"""
Script d'évaluation du chatbot GFST.

Usage :
    python run_evals.py

Ce script :
1. Charge le dataset de questions types (eval_dataset.json)
2. Envoie chaque question à ton endpoint /chat (ou directement à ta fonction si tu préfères l'appeler en local)
3. Vérifie les critères simples (mots-clés attendus / interdits)
4. Fait juger la réponse par un LLM sur 3 critères : précision, absence de vague, respect du format
5. Affiche un rapport clair + sauvegarde un CSV pour comparer les runs dans le temps

À adapter :
- CHAT_ENDPOINT_URL si tu testes via l'API HTTP (ton serveur FastAPI doit tourner)
- Ou utilise call_chatbot_direct() si tu préfères importer directement ta fonction Python (plus rapide, pas besoin de lancer le serveur)
"""

import json
import csv
import os
import httpx
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

# --- CONFIG ---
CHAT_ENDPOINT_URL = "http://localhost:8000/api/chatbot/"  # adapte à ton vrai endpoint + port
DATASET_PATH = os.path.join(os.path.dirname(__file__), "eval_dataset.json")
RESULTS_CSV = f"eval_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"

# Client pour le LLM-juge (réutilise ta config Capgemini existante)
juge_client = OpenAI(
    base_url="https://openai.generative.engine.capgemini.com/v1",
    api_key=os.getenv("CAPGEMINI_API_KEY"),
    http_client=httpx.Client(verify=False),
    timeout=30.0
)


def appeler_chatbot(question: str) -> str:
    """Envoie une question au chatbot via l'API HTTP et retourne la réponse texte."""
    # NOTE : adapte selon ton système d'auth (JWT). Ici on suppose un token de test en dur,
    # ou retire l'auth si tu as un mode de test sans JWT.
    headers = {"Authorization": f"Bearer {os.getenv('TEST_JWT_TOKEN', '')}"}
    payload = {"message": question, "historique": [], "session_id": None}

    try:
        response = httpx.post(CHAT_ENDPOINT_URL, json=payload, headers=headers, timeout=30.0)
        response.raise_for_status()
        return response.json().get("reponse", "")
    except Exception as e:
        return f"[ERREUR APPEL API] {str(e)}"


def verifier_mots_cles(reponse: str, doit_contenir: list, ne_doit_pas_contenir: list) -> dict:
    """Vérification simple et rapide, sans appel LLM."""
    reponse_lower = reponse.lower()
    manquants = [mot for mot in doit_contenir if mot.lower() not in reponse_lower]
    presents_interdits = [mot for mot in ne_doit_pas_contenir if mot.lower() in reponse_lower]

    return {
        "mots_cles_ok": len(manquants) == 0 and len(presents_interdits) == 0,
        "mots_manquants": manquants,
        "mots_interdits_presents": presents_interdits
    }


def juger_avec_llm(question: str, reponse: str, note_contexte: str) -> dict:
    """Fait évaluer la réponse par un LLM sur 3 critères, retourne des scores 1-5."""
    prompt_juge = f"""Tu es un évaluateur strict de chatbot d'entreprise. Évalue la réponse suivante.

QUESTION POSÉE : {question}
RÉPONSE DU CHATBOT : {reponse}
CONTEXTE ATTENDU : {note_contexte}

Note chaque critère de 1 (très mauvais) à 5 (excellent) :
1. PRECISION : la réponse donne-t-elle des informations concrètes et vérifiables (chiffres, références) plutôt que des généralités ?
2. NON_VAGUE : la réponse évite-t-elle les formulations floues ("plusieurs", "certaines", "généralement") quand une donnée précise était disponible ?
3. FORMAT : la réponse est-elle bien structurée et directement utilisable ?

Réponds UNIQUEMENT en JSON, sans aucun texte avant ou après, format exact :
{{"precision": <1-5>, "non_vague": <1-5>, "format": <1-5>, "commentaire": "<une phrase courte>"}}
"""

    try:
        response = juge_client.chat.completions.create(
            model="openai.gpt-4o",
            messages=[{"role": "user", "content": prompt_juge}],
            temperature=0.0,
            max_tokens=200
        )
        contenu = response.choices[0].message.content.strip()
        # Nettoyage au cas où le modèle ajoute des balises markdown malgré la consigne
        contenu = contenu.replace("```json", "").replace("```", "").strip()
        return json.loads(contenu)
    except Exception as e:
        return {"precision": 0, "non_vague": 0, "format": 0, "commentaire": f"Erreur juge: {str(e)}"}


def run_evals():
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    resultats = []
    print(f"\n{'='*60}\nLancement de {len(dataset)} tests\n{'='*60}\n")

    for cas in dataset:
        print(f"[{cas['id']}] {cas['question']}")

        reponse = appeler_chatbot(cas["question"])
        check_mots_cles = verifier_mots_cles(reponse, cas["doit_contenir"], cas["ne_doit_pas_contenir"])
        jugement = juger_avec_llm(cas["question"], reponse, cas["note"])

        score_moyen = (jugement["precision"] + jugement["non_vague"] + jugement["format"]) / 3

        resultat = {
            "id": cas["id"],
            "categorie": cas["categorie"],
            "question": cas["question"],
            "reponse": reponse,
            "mots_cles_ok": check_mots_cles["mots_cles_ok"],
            "mots_manquants": ", ".join(check_mots_cles["mots_manquants"]),
            "mots_interdits_presents": ", ".join(check_mots_cles["mots_interdits_presents"]),
            "score_precision": jugement["precision"],
            "score_non_vague": jugement["non_vague"],
            "score_format": jugement["format"],
            "score_moyen": round(score_moyen, 2),
            "commentaire_juge": jugement["commentaire"]
        }
        resultats.append(resultat)

        statut = "✅" if check_mots_cles["mots_cles_ok"] and score_moyen >= 3.5 else "⚠️"
        print(f"  {statut} Score: {score_moyen:.1f}/5 | Mots-clés OK: {check_mots_cles['mots_cles_ok']}")
        if not check_mots_cles["mots_cles_ok"]:
            print(f"     Manquants: {check_mots_cles['mots_manquants']} | Interdits présents: {check_mots_cles['mots_interdits_presents']}")
        print(f"     Juge: {jugement['commentaire']}\n")

    # Sauvegarde CSV pour comparer les runs dans le temps
    with open(RESULTS_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=resultats[0].keys())
        writer.writeheader()
        writer.writerows(resultats)

    score_global = sum(r["score_moyen"] for r in resultats) / len(resultats)
    taux_mots_cles = sum(1 for r in resultats if r["mots_cles_ok"]) / len(resultats) * 100

    print(f"{'='*60}")
    print(f"RÉSUMÉ : score global {score_global:.2f}/5 | mots-clés respectés: {taux_mots_cles:.0f}%")
    print(f"Résultats détaillés sauvegardés dans : {RESULTS_CSV}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    run_evals()