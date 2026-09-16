import pandas as pd
from database import SessionLocal 
from init_db import FichePoro

def import_table_poro(fichier):
    nom_onglet = "PORO table"
    print(f"Lecture de l'onglet '{nom_onglet}' dans le fichier {fichier}...")
    df = pd.read_excel(fichier, sheet_name=nom_onglet)
    df.columns = df.columns.str.strip()

    print("\n--- ANALYSE DE LA TABLE ---")
    print("Colonnes détectées :", df.columns.tolist())
    print(f"Nombre de lignes trouvées : {len(df)}\n")

    db = SessionLocal()
    imported = 0
    skipped = 0

    for index, row in df.iterrows():
        try:
            ref = str(row.get("reference", "")).strip()
            if not ref or ref == "nan" or ref == "None":
                continue

            existing = db.query(FichePoro).filter(FichePoro.reference == ref).first()
            if existing:
                skipped += 1
                continue

            fiche = FichePoro(reference=ref,
                designation_en=str(row.get("english designation", "") or ""),
                psa_dec=str(row.get("psa code", "") or ""),
                vehicle_area=str(row.get("vehicule area", "") or ""),
                last_modification=str(row.get("last modification", "") or ""),
                status=str(row.get("Status", "To be updated") or "To be updated"),
                ref_screw_nut_Bdl=str(row.get("Ref screw, nut  BdL", "") or ""),
                triplet_for_poro=str(row.get("triplet for poro", "") or "")
            )

            db.add(fiche)
            db.commit()
            imported += 1
        
        except Exception as e:
            print(f"Erreur sur la ligne {ref}: {e}")
            db.rollback()
            
    db.close()

    print(f"\n Import terminé ! Importées : {imported} | Ignorées (déjà existantes) : {skipped}")

if __name__ == "__main__":
    nom_fichier = input("Chemin du fichier Excel : ")
    import_table_poro(nom_fichier)