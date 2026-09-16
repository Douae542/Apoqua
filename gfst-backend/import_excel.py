"""
Import / synchronisation Excel -> table `fiches`.

Différences clés avec l'ancien import_excel.py :
1. UPSERT réel : une fiche déjà présente (même reference) est mise à jour
   (statut, désignations, zone, lot, dates...) au lieu d'être ignorée.
   => C'est ce qui causait le blocage sur "To be updated" dans le frontend.
2. Matching de colonnes normalisé (strip + lower) et tolérant aux variantes
   d'intitulés, avec repli sur plusieurs positions d'en-tête possibles.
3. A la fin : rapport des fiches présentes en base mais absentes du fichier
   Excel (candidates à vérifier / supprimer manuellement), écrit dans
   orphelines.csv. Rien n'est supprimé automatiquement.

Usage:
    python import_excel_v2.py chemin/vers/fichier.xlsx
    python import_excel_v2.py chemin/vers/fichier.xlsx --delete-orphans   # optionnel, destructif
"""

import sys
import os
import argparse
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

# Adapte cet import si ton vrai module s'appelle `database` + `models.fiche`
# au lieu de `init_db`. Les deux schémas sont identiques.
from init_db import SessionLocal, engine, Base, Fiche

Base.metadata.create_all(bind=engine)

COLUMN_CANDIDATES = {
    "reference": ["reference"],
    "designation_fr": [
        "standard joints database designation (french)",
        "apoqua designation (francais)",
        "apoqua designation (français)",
        "designation fr",
        "designation (french)",
    ],
    "designation_en": [
        "standard joints database designation (english)",
        "apoqua designation (english)",
        "designation en",
        "designation (english)",
    ],
    "vehicle_area": ["vehicle area"],
    "psa_dec": ["xpsa cod", "xpsa dec", "psa dec", "psa dec.", "psa cod"],
    "lot": ["lot"],
    "status": ["status", "statut"],
    "in_poro": ["in poro", "in file poro"],
    "in_pfr": ["in pfr", "in pfr for lionel"],
    "creation_date": ["creation date"],
    "last_modification": ["last modification", "last modificationdate", "last modification date"],
}

REQUIRED_FIELDS = {"reference", "designation_fr", "vehicle_area", "status"}

# Si aucun intitule exact ne matche, on cherche une colonne qui CONTIENT
# un de ces mots-cles (utile quand l'intitule reel differe legerement,
# ex. "xPSA COD" au lieu de "xPSA DEC").
KEYWORD_FALLBACK = {
    "psa_dec": ["psa"],
    "in_poro": ["poro"],
    "in_pfr": ["pfr"],
    "vehicle_area": ["vehicle"],
    "status": ["status", "statut"],
    "lot": ["lot"],
    "last_modification": ["modif"],
    "creation_date": ["creation"],
}


def normalize(col: str) -> str:
    return " ".join(str(col).strip().lower().split())


def pick_sheet(fichier):
    xls = pd.ExcelFile(fichier)
    preferred = [
        "Table APOQUA files",
        "Standard_Joints_Database_Complete_List",
        "Standard Joints Database Files",
    ]
    for name in preferred:
        if name in xls.sheet_names:
            return name
    print(f"Feuille preferee introuvable, feuilles disponibles: {xls.sheet_names}")
    print(f"-> Utilisation de la premiere feuille: '{xls.sheet_names[0]}'")
    return xls.sheet_names[0]


def load_dataframe(fichier):
    sheet = pick_sheet(fichier)
    for header_row in (0, 1, 2, 3):
        df = pd.read_excel(fichier, sheet_name=sheet, header=header_row)
        cols = [normalize(c) for c in df.columns]
        if "reference" in cols:
            df.columns = cols
            print(f"Feuille '{sheet}', en-tete detecte a la ligne {header_row + 1}.")
            return df
    raise ValueError(
        "Impossible de localiser la colonne 'Reference' dans les 4 premieres lignes "
        "d'en-tete possibles. Verifiez la structure du fichier."
    )


def resolve_columns(df):
    resolved = {}
    missing = []
    for field, candidates in COLUMN_CANDIDATES.items():
        found = next((c for c in candidates if c in df.columns), None)
        if not found and field in KEYWORD_FALLBACK:
            for kw in KEYWORD_FALLBACK[field]:
                found = next((c for c in df.columns if kw in c), None)
                if found:
                    break
        resolved[field] = found
        if not found and field in REQUIRED_FIELDS:
            missing.append(field)
    print("\nMapping colonnes -> champs Fiche:")
    for field, col in resolved.items():
        print(f"  {field:20s} <- {col!r}")
    print(f"\nColonnes reellement presentes dans le fichier ({len(df.columns)}):")
    print(" ", list(df.columns))
    if missing:
        print(f"\nATTENTION colonnes obligatoires introuvables: {missing}")
    return resolved


def get_val(row, resolved, field, default=""):
    col = resolved.get(field)
    if not col:
        return default
    val = row.get(col, default)
    if val is None or str(val).strip().lower() == "nan":
        return default
    return str(val).strip()


def cleanup_bad_values(db):
    """Nettoie les valeurs 'nan' / 'none' litterales laissees par d'anciens imports bugges."""
    bad = {"nan", "none", "null", "nat"}
    fields = ["designation_fr", "designation_en", "vehicle_area", "psa_dec",
              "lot", "status", "in_poro", "in_pfr", "creation_date", "last_modification"]
    cleaned = 0
    for fiche in db.query(Fiche).all():
        for field in fields:
            val = getattr(fiche, field)
            if val is not None and str(val).strip().lower() in bad:
                setattr(fiche, field, "")
                cleaned += 1
    if cleaned:
        db.commit()
        print(f"Nettoyage: {cleaned} valeurs 'nan'/'none' litterales effacees.")


def sync_fiches(fichier, delete_orphans=False):
    print("Import:", fichier)
    df = load_dataframe(fichier)
    print("Lignes trouvees dans Excel:", len(df))
    resolved = resolve_columns(df)

    db = SessionLocal()
    cleanup_bad_values(db)

    created = 0
    updated = 0
    unchanged = 0
    errors = 0

    # Champs pour lesquels une colonne a reellement ete trouvee dans ce fichier.
    # On ne touchera JAMAIS aux champs absents de l'Excel (ex: in_poro, in_pfr,
    # creation_date dans ce fichier) -- ni a la creation ni a la mise a jour,
    # sauf valeur par defaut minimale a la creation d'une fiche totalement neuve.
    present_fields = [f for f, col in resolved.items() if col]
    print(f"\nChamps mis a jour depuis ce fichier: {present_fields}")
    absent_fields = [f for f in COLUMN_CANDIDATES if f not in present_fields]
    if absent_fields:
        print(f"Champs NON touches (absents de ce fichier): {absent_fields}")

    excel_refs = set()

    for _, row in df.iterrows():
        try:
            ref = get_val(row, resolved, "reference")
            if not ref:
                continue
            excel_refs.add(ref)

            # Valeur EXACTE d'Excel, uniquement pour les colonnes presentes.
            values = {f: get_val(row, resolved, f) for f in present_fields if f != "reference"}

            existing = db.query(Fiche).filter(Fiche.reference == ref).first()

            if existing:
                changed = False
                for field, new_val in values.items():
                    if getattr(existing, field) != new_val:
                        setattr(existing, field, new_val)
                        changed = True
                if changed:
                    updated += 1
                else:
                    unchanged += 1
            else:
                # Fiche totalement nouvelle : valeurs par defaut minimales
                # uniquement pour les champs absents de l'Excel.
                defaults = {"status": "To be updated", "in_poro": "NO", "in_pfr": "NO"}
                for f in absent_fields:
                    if f in defaults:
                        values.setdefault(f, defaults[f])
                fiche = Fiche(reference=ref, created_by=None, **values)
                db.add(fiche)
                created += 1

            if (created + updated) % 50 == 0:
                db.commit()

        except Exception as e:
            db.rollback()
            errors += 1
            print("Erreur ligne ignoree:", e)

    db.commit()

    # Rapport des fiches en base absentes de l'Excel (pas de suppression auto)
    db_refs = {r for (r,) in db.query(Fiche.reference).all()}
    orphans = sorted(db_refs - excel_refs)

    print("\n--- Resume ---")
    print("Lignes Excel valides:", len(excel_refs))
    print("Creees:", created)
    print("Mises a jour:", updated)
    print("Inchangees:", unchanged)
    print("Erreurs:", errors)
    print("Fiches en base absentes de l'Excel:", len(orphans))

    if orphans:
        report_path = "orphelines.csv"
        with open(report_path, "w", encoding="utf-8") as f:
            f.write("reference\n")
            for r in orphans:
                f.write(r + "\n")
        print(f"-> Liste ecrite dans {report_path}")

        if delete_orphans:
            db.query(Fiche).filter(Fiche.reference.in_(orphans)).delete(synchronize_session=False)
            db.commit()
            print(f"{len(orphans)} fiches orphelines supprimees (--delete-orphans).")
        else:
            print("Aucune suppression effectuee (relancez avec --delete-orphans si voulu).")

    db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("fichier", nargs="?", help="Chemin du fichier Excel")
    parser.add_argument("--delete-orphans", action="store_true",
                         help="Supprime les fiches en base absentes de l'Excel")
    args = parser.parse_args()

    fichier = args.fichier or input("Chemin du fichier Excel: ").strip()

    if not os.path.exists(fichier):
        print("Fichier introuvable:", fichier)
    else:
        sync_fiches(fichier, delete_orphans=args.delete_orphans)