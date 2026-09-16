"""
Script de migration : calcule et stocke l'embedding pour toutes les données
existantes dans Fiche, FichePoro, SlidePresentation et Demande.

À lancer UNE FOIS après avoir ajouté la colonne embedding (ALTER TABLE) sur
les 4 tables. Peut être relancé sans risque ensuite : il ne recalcule que
les lignes dont embedding est encore vide (donc pas de gaspillage d'appels API
si tu le relances après une interruption).

Usage :
    python generate_embeddings.py
"""

import json
import time
from database import SessionLocal
from init_db import Fiche, FichePoro, SlidePresentation
from embeddings import get_embedding
from models.demande import Demande

# Un petit délai entre appels pour éviter de saturer l'API (à ajuster selon les limites de ton proxy)
DELAI_ENTRE_APPELS = 0.2


def construire_texte_fiche(fiche: Fiche) -> str:
    """Assemble les champs pertinents d'une Fiche en un seul texte à indexer."""
    return " ".join(filter(None, [
        fiche.reference,
        fiche.designation_fr,
        fiche.designation_en,
        fiche.vehicle_area,
        fiche.status
    ]))


def construire_texte_poro(fiche: FichePoro) -> str:
    return " ".join(filter(None, [
        fiche.reference,
        fiche.designation_fr,
        fiche.designation_en,
        fiche.vehicle_area,
        fiche.ref_screw_nut_Bdl,
        fiche.triplet_for_poro
    ]))


def construire_texte_slide(slide: SlidePresentation) -> str:
    return " ".join(filter(None, [
        slide.titre_slide,
        slide.contenu_texte
    ]))


def construire_texte_demande(demande: Demande) -> str:
    return " ".join(filter(None, [
        demande.reference,
        demande.type_demande,
        demande.statut,
        demande.description
    ]))


def indexer_table(db, model_class, construire_texte, nom_table: str):
    """
    Parcourt toutes les lignes d'une table dont embedding est vide,
    calcule leur embedding, et sauvegarde.
    """
    lignes_a_traiter = db.query(model_class).filter(model_class.embedding.is_(None)).all()
    total = len(lignes_a_traiter)

    if total == 0:
        print(f"[{nom_table}] Rien à faire — toutes les lignes ont déjà un embedding.")
        return

    print(f"[{nom_table}] {total} ligne(s) à indexer...")

    reussies = 0
    erreurs = 0

    for i, ligne in enumerate(lignes_a_traiter, start=1):
        texte = construire_texte(ligne)

        if not texte.strip():
            # Rien de significatif à indexer pour cette ligne, on passe
            continue

        try:
            vecteur = get_embedding(texte)
            ligne.embedding = json.dumps(vecteur)
            db.commit()
            reussies += 1
        except Exception as e:
            print(f"  [ERREUR] Ligne id={ligne.id} : {e}")
            db.rollback()
            erreurs += 1

        if i % 20 == 0 or i == total:
            print(f"  ... {i}/{total} traitées")

        time.sleep(DELAI_ENTRE_APPELS)

    print(f"[{nom_table}] Terminé — {reussies} indexées, {erreurs} erreur(s).\n")


def main():
    db = SessionLocal()

    try:
        indexer_table(db, Fiche, construire_texte_fiche, "Fiches GFST")
        indexer_table(db, FichePoro, construire_texte_poro, "Fiches PORO")
        indexer_table(db, SlidePresentation, construire_texte_slide, "Slides PPT")
        indexer_table(db, Demande, construire_texte_demande, "Demandes")
    finally:
        db.close()

    print("Migration terminée pour les 4 tables.")


if __name__ == "__main__":
    main()