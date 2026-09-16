import numpy as np
import json
from openai import OpenAI
import httpx
import os

client = OpenAI(
    base_url="https://openai.generative.engine.capgemini.com/v1",
    api_key=os.getenv("CAPGEMINI_API_KEY"),
    http_client=httpx.Client(verify=False),
    timeout=30.0
)


def get_embedding(texte: str) -> list:
    """Transforme un texte en vecteur numérique via l'API."""
    response = client.embeddings.create(
        model="text-embedding-3-small",  # à vérifier/adapter selon ce que le proxy Capgemini propose
        input=texte
    )
    return response.data[0].embedding


def cosine_similarity(vec1, vec2):
    a, b = np.array(vec1), np.array(vec2)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def rechercher_par_similarite(db, model_class, query_embedding, limite=8):
    """
    Recherche générique : fonctionne pour Fiche, FichePoro, ou SlidePresentation
    en passant la classe du modèle en paramètre.
    """
    enregistrements = db.query(model_class).filter(model_class.embedding.isnot(None)).all()
    scores = []
    for item in enregistrements:
        emb = json.loads(item.embedding)
        score = cosine_similarity(query_embedding, emb)
        scores.append((item, score))
    scores.sort(key=lambda x: x[1], reverse=True)
    return [item for item, score in scores[:limite]]