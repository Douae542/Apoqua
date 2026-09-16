"""
Calcule automatiquement l'embedding de chaque ligne avant sa sauvegarde en base,
pour Fiche, FichePoro, SlidePresentation et Demande.

Il suffit d'importer ce fichier une fois au démarrage de l'application
(dans main.py) pour que ça s'applique partout, sans toucher aux routes.
"""

import json
from sqlalchemy import event
from models.fiche import Fiche
from init_db import FichePoro, SlidePresentation, Demande
from embeddings import get_embedding


def construire_texte(instance) -> str:
    """Assemble les champs pertinents selon le type d'objet."""
    if isinstance(instance, Fiche):
        champs = [instance.reference, instance.designation_fr, instance.designation_en, instance.vehicle_area, instance.status]
    elif isinstance(instance, FichePoro):
        champs = [instance.reference, instance.designation_fr, instance.designation_en, instance.vehicle_area, instance.ref_screw_nut_Bdl, instance.triplet_for_poro]
    elif isinstance(instance, SlidePresentation):
        champs = [instance.titre_slide, instance.contenu_texte]
    elif isinstance(instance, Demande):
        champs = [instance.reference, instance.type_demande, instance.statut, instance.description]
    else:
        champs = []
    return " ".join(filter(None, champs))


def calculer_embedding_avant_sauvegarde(mapper, connection, target):
    """Déclenché automatiquement avant chaque INSERT ou UPDATE."""
    texte = construire_texte(target)
    if texte.strip():
        try:
            target.embedding = json.dumps(get_embedding(texte))
        except Exception as e:
            print(f"[EMBEDDING] Erreur lors du calcul pour {type(target).__name__} id={getattr(target, 'id', '?')} : {e}")


# On branche le hook sur les 4 modèles, pour l'insertion ET la modification
for model in [Fiche, FichePoro, SlidePresentation, Demande]:
    event.listen(model, "before_insert", calculer_embedding_avant_sauvegarde)
    event.listen(model, "before_update", calculer_embedding_avant_sauvegarde)