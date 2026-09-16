from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from database import get_db
from models.fiche import Fiche
from init_db import FichePoro, SlidePresentation
from models.demande import Demande
from models.message import Message as DBMessage
from embeddings import get_embedding, rechercher_par_similarite 
from models.user import User
from routes.auth import get_current_user
from openai import OpenAI
from sqlalchemy import text
from sqlalchemy import cast, String as SQLString
import os
import httpx 
import json
import re
from sqlalchemy import func
import openai

router = APIRouter()

client = OpenAI(
    base_url="https://openai.generative.engine.capgemini.com/v1",
    api_key=os.getenv("CAPGEMINI_API_KEY"),
    http_client=httpx.Client(verify=False),
    timeout=30.0
)

tools = [
    {
        "type": "function",
        "function": {
            "name": "search_fiches",
            "description": "Recherche sémantique par mot-clé UNIQUE ou expression simple (ex: 'moteur', 'vis M8', 'PORO'). À utiliser UNIQUEMENT quand la question porte sur UN SEUL critère de recherche (un mot, une référence, un thème). NE PAS utiliser si la question combine plusieurs conditions à croiser (ex: 'zone X ET statut Y', 'statut A OU statut B') — dans ce cas utiliser executer_requete_sql à la place.",
            "parameters": {
                "type": "object",
                "properties": {
                    "terme": {
                        "type": "string",
                        "description": "Le ou les mots-clés à chercher (ex: 'vis moteur M8')."
                    }
                },
                "required": ["terme"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "compter_fiches_par_statut",
            "description": "Donne un COMPTAGE par statut, en cherchant dans TOUTES les tables (Fiches GFST, Fiches PORO, Demandes). À utiliser UNIQUEMENT pour des questions de type 'combien', 'le nombre de'. Ne retourne PAS le détail des fiches elles-mêmes.",
            "parameters": {
                "type": "object",
                "properties": {
                    "statut": {
                        "type": "string",
                        "description": "Le statut à compter (ex: 'Approved', 'Cancelled', 'En attente'). Laisse vide pour la répartition globale toutes tables confondues."
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "executer_requete_sql",
            "description": "OUTIL PRIORITAIRE dès que la question combine PLUSIEURS critères à croiser (ex: 'zone Engine ET statut Cancelled', 'créées après telle date ET tel statut'), demande un TRI ou un CLASSEMENT, ou porte sur une colonne précise non couverte par search_fiches. Si la question contient 'et', 'avec', 'ainsi que' entre deux critères de filtrage différents, utilise CET outil plutôt que search_fiches.",
            "parameters": {
                "type": "object",
                "properties": {
                    "requete_sql": {
                        "type": "string",
                        "description": "La requête SQL PostgreSQL. Exemple pour un filtre combiné : SELECT reference, status, vehicle_area FROM fiches WHERE vehicle_area ILIKE '%Engine%' AND status ILIKE '%Cancelled%' LIMIT 10."
                    }
                },
                "required": ["requete_sql"]
            }
        }
    }
]

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    historique: Optional[List[Message]] = []
    session_id: Optional[str] = None


def build_system_prompt(db: Session, user: User) -> str:
    total_fiches = db.query(Fiche).count()
    total_poro = db.query(FichePoro).count()
    total_slides = db.query(SlidePresentation).count()
    total_demandes = db.query(Demande).count()

    return f"""
Tu es l'assistant intelligent de la plateforme GFST (Global FaSteners Team) de Stellantis. Ton but est d'aider les utilisateurs de manière claire, naturelle et précise.

IDENTITÉ :
- Tu t'appelles "Assistant GFST".
- Tu es expert en fixations automobiles et tu connais les guides/présentations internes sur le bout des doigts.
- Tu réponds avec la même langue de la question posée .
- Tu es professionnel, précis et concis.
- Tu ne connais AUCUNE donnée spécifique (statut, référence, contenu de fiche) par cœur — tu dois toujours passer par un outil pour toute question portant sur des données réelles de la base.

UTILISATEUR CONNECTÉ :
- Nom : {user.prenom} {user.nom}
- Rôle : {user.role.value}

ÉTAT DE LA BASE DE DONNÉES :
- Fiches GFST Classiques : {total_fiches}
- Fiches PORO : {total_poro}
- Slides de Présentation (Guides/PPT) : {total_slides}
- Demandes utilisateurs : {total_demandes}

CHOIX DE L'OUTIL (à respecter strictement) :
- Question générale, salutation, ou explication que tu connais déjà (concepts, définitions générales non spécifiques à Stellantis) → réponds directement, SANS outil.
- Question portant sur UN SEUL critère simple (un mot-clé, une référence, un thème, un statut isolé) → 'search_fiches'.
- Question demandant un COMPTAGE ("combien de", "le nombre de") → 'compter_fiches_par_statut'.
- Question combinant PLUSIEURS critères à croiser (ex: zone ET statut, statut ET date), demandant un tri/classement, ou portant sur une colonne non couverte par les autres outils → 'executer_requete_sql'. C'est le signal le plus fiable : dès que la question contient "et", "avec", "ainsi que" entre deux conditions de filtrage différentes, utilise CET outil, pas 'search_fiches'.
- Ne mélange jamais deux outils pour une même question : choisis le plus adapté selon les critères ci-dessus.

RÈGLES DE PRÉCISION :
- Si une section "RECHERCHE EN BASE" apparaît avec des résultats, synthétise ces informations pour répondre — ne les résume pas de façon vague.
- Cite TOUJOURS les références exactes trouvées (ex: "Réf. XJ-4521, statut Approved") plutôt que des généralités du type "plusieurs fiches correspondent".
- Si les résultats sont vides ou insuffisants, dis-le explicitement (ex: "Je n'ai trouvé aucune fiche correspondant à X") plutôt que de généraliser ou meubler.
- Ne réponds jamais par une généralité si une donnée précise (chiffre, référence, statut, nom de fichier) est disponible dans le contexte fourni.
- Ne complète jamais une réponse issue de la base avec des connaissances générales sur les fixations automobiles, sauf si l'utilisateur le demande explicitement.
- Si plusieurs résultats existent, structure ta réponse en liste, pas en paragraphe.
- Ne jamais inventer de données. Si tu ne sais pas, dis-le — ne devine jamais une définition, un acronyme métier, ou une donnée que tu n'as pas trouvée via un outil.
"""

def compter_fiches_par_statut(db: Session, statut: str = None) -> str:
    statut = normaliser_statut(statut)
    resume = ""

    # Configuration : (nom affiché, classe du modèle, nom du champ statut)
    tables_a_verifier = [
        ("Fiches GFST", Fiche, "status"),
        ("Fiches PORO", FichePoro, "status"),
        ("Demandes", Demande, "statut"),
    ]

    if statut:
        # Comptage ciblé sur un statut précis, dans chaque table
        for nom_table, model_class, nom_champ in tables_a_verifier:
            champ_statut = getattr(model_class, nom_champ)
            compte = db.query(model_class).filter(cast(champ_statut, SQLString).ilike(f"%{statut}%")).count()
            if compte > 0:
                resume += f"[STATISTIQUES] {nom_table} : {compte} enregistrement(s) avec un statut correspondant à '{statut}'.\n"

        if not resume:
            return f"[STATISTIQUES] Aucun enregistrement trouvé avec un statut correspondant à '{statut}', dans aucune table."
        return resume

    # Pas de statut précisé : répartition globale par table
    resume = "\n--- [STATISTIQUES] RÉPARTITION PAR STATUT ---\n"
    for nom_table, model_class, nom_champ in tables_a_verifier:
        champ_statut = getattr(model_class, nom_champ)
        resultats = db.query(champ_statut, func.count(model_class.id)).group_by(champ_statut).all()

        if resultats:
            resume += f"\n{nom_table} :\n"
            for stat, total in resultats:
                nom_statut = stat if stat else "Non défini"
                resume += f"  - {nom_statut} : {total}\n"

    return resume

STATUTS_FR_VERS_EN = {
    "Approuvé": "Approved",
    "Annulé": "Cancelled",
    "En cours": "In Process",
}

def normaliser_statut(statut: str) -> str:
    """Convertit un statut en français vers sa valeur anglaise réelle en base, si reconnu."""
    if not statut:
        return statut
    statut_normalise = STATUTS_FR_VERS_EN.get(statut.strip().lower(), statut)
    return statut_normalise

def executer_requete_sql(db: Session, requete_sql: str) -> str:
    # SÉCURITÉ : On interdit formellement toute modification
    mots_interdits = ["insert", "update", "delete", "drop", "alter", "truncate", "create"]
    if any(mot in requete_sql.lower() for mot in mots_interdits):
        return "ERREUR DE SÉCURITÉ : Seules les requêtes SELECT sont autorisées."
    
    try:
        # Exécution de la requête SQL brute
        resultats = db.execute(text(requete_sql)).fetchall()
        
        if not resultats:
            return "Aucun résultat trouvé dans la base de données."
            
        # Formatage des résultats (limité pour ne pas saturer les tokens)
        reponse = f"Résultats de la requête (limité aux 10 premiers) :\n"
        for row in resultats[:10]:
            reponse += f"- {dict(row._mapping)}\n"
            
        return reponse
    except Exception as e:
        return f"Erreur SQL : {str(e)}"

def rechercher_hybride(db, model_class, champs_ilike: list, query: str, query_embedding, limite=5) -> list:
    """
    Combine recherche exacte (ILIKE sur les champs donnés) et recherche
    sémantique (embeddings), sans doublons.
    """
    # Recherche exacte
    filtre_ilike = None
    for champ in champs_ilike:
        condition = champ.ilike(f"%{query}%")
        filtre_ilike = condition if filtre_ilike is None else (filtre_ilike | condition)

    candidats_ilike = db.query(model_class).filter(filtre_ilike).limit(5).all() if filtre_ilike is not None else []

    # Recherche sémantique
    candidats_semantique = rechercher_par_similarite(db, model_class, query_embedding, limite=limite)

    # Fusion sans doublons (par id), l'ILIKE en premier (correspondance exacte prioritaire)
    vus = set()
    resultats = []
    for item in candidats_ilike + candidats_semantique:
        if item.id not in vus:
            vus.add(item.id)
            resultats.append(item)

    return resultats[:limite]


def search_fiches_context(db: Session, query: str) -> str:
    if not query or len(query) < 3:
        return ""

    result_text = ""

    try:
        query_embedding = get_embedding(query)
    except Exception as e:
        print(f"[EMBEDDING] Erreur lors du calcul de l'embedding de la requête : {e}")
        query_embedding = None

    if not query_embedding:
        return f"\n[RECHERCHE EN BASE] Impossible d'effectuer la recherche pour '{query}' (erreur technique)."

    # 1. RECHERCHE DANS GFST CLASSIQUE
    fiches_classiques = rechercher_hybride(
        db, Fiche,
        [Fiche.reference, Fiche.designation_fr, Fiche.designation_en, Fiche.status],
        query, query_embedding
    )
    if fiches_classiques:
        result_text += "\n--- [RECHERCHE] FICHES GFST ---\n"
        for f in fiches_classiques:
            result_text += f"- Réf: {f.reference} | {f.designation_fr} | Zone: {f.vehicle_area} | Statut: {f.status}\n"

    # 2. RECHERCHE DANS PORO
    fiches_poro = rechercher_hybride(
        db, FichePoro,
        [FichePoro.reference, FichePoro.ref_screw_nut_Bdl, FichePoro.triplet_for_poro],
        query, query_embedding
    )
    if fiches_poro:
        result_text += "\n--- [RECHERCHE] FICHES PORO ---\n"
        for f in fiches_poro:
            result_text += f"- Réf: {f.reference} | Vis: {f.ref_screw_nut_Bdl} | Triplet: {f.triplet_for_poro}\n"

    # 3. RECHERCHE DANS LES SLIDES POWERPOINT
    slides_trouvees = rechercher_hybride(
        db, SlidePresentation,
        [SlidePresentation.titre_slide, SlidePresentation.contenu_texte],
        query, query_embedding
    )
    if slides_trouvees:
        result_text += "\n--- [RECHERCHE] DOCUMENTATIONS & GUIDES PPT ---\n"
        for s in slides_trouvees:
            texte = s.contenu_texte or ""
            extrait = (texte[:300] + "...") if len(texte) > 300 else texte
            extrait_propre = extrait.replace('\n', ' ')
            result_text += f"- Fichier: {s.nom_fichier} (Slide {s.numero_slide}) | Titre: {s.titre_slide}\n  Contenu: {extrait_propre}\n"

    # 4. RECHERCHE DANS LES DEMANDES
    demandes_trouvees = rechercher_hybride(
        db, Demande,
        [Demande.reference, Demande.type_demande, Demande.description],
        query, query_embedding
    )
    if demandes_trouvees:
        result_text += "\n--- [RECHERCHE] DEMANDES ---\n"
        for d in demandes_trouvees:
            result_text += f"- Réf: {d.reference} | Type: {d.type_demande} | Statut: {d.statut} | {d.description}\n"

    if not result_text:
        return f"\n[RECHERCHE EN BASE] Aucune information trouvée pour '{query}'."

    return result_text


def executer_tool(db: Session, tool_name: str, tool_args: dict) -> str:
    """Route un tool_call vers la bonne fonction et retourne toujours une string (jamais un HTTPResponse direct)."""
    if tool_name == "search_fiches":
        terme_recherche = tool_args.get("terme", "")
        return search_fiches_context(db, terme_recherche)

    elif tool_name == "compter_fiches_par_statut":
        statut_demande = tool_args.get("statut", None)
        return compter_fiches_par_statut(db, statut_demande)

    elif tool_name == "executer_requete_sql":
        return executer_requete_sql(db, tool_args.get("requete_sql", ""))

    else:
        return "Outil inconnu."


@router.post("/")
async def chat(
    body: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        system_prompt = build_system_prompt(db, current_user)
        messages = [{"role": "system", "content": system_prompt}]
        for msg in body.historique[-10:]:
            messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": body.message})

        # --- 1ER APPEL A L'IA ---
        try:
            response = client.chat.completions.create(
                extra_headers={"HTTP-Referer": "http://localhost:3000", "X-Title": "GFST Platform"},
                model="openai.gpt-4o",
                messages=messages,
                tools=tools,
                tool_choice="auto",
                max_tokens=1000,
                temperature=0.3
            )
            message = response.choices[0].message
            
        except openai.BadRequestError as e:
            print(" Erreur de syntaxe openAI (400) interceptée, on empêche le crash.")
            
            # On simule un message texte pour éviter que le reste du code plante
            class DummyMessage:
                def __init__(self):
                    self.content = "Je rencontre un petit problème technique avec ma base de données. Pourriez-vous reformuler ?"
                    self.tool_calls = None
                    
            class DummyResponse:
                def __init__(self):
                    self.usage = None
                    
            message = DummyMessage()
            response = DummyResponse()

        if message.tool_calls:
            # On traite TOUS les tool_calls renvoyés, pas seulement le premier
            messages.append({
                "role": "assistant",
                "content": message.content or "",
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments
                        }
                    }
                    for tc in message.tool_calls
                ]
            })

            for tool_call in message.tool_calls:
                tool_name = tool_call.function.name
                tool_args = json.loads(tool_call.function.arguments)
                resultat = executer_tool(db, tool_name, tool_args)

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": tool_name,
                    "content": resultat
                })

            # --- 2EME APPEL A L'IA (Rédaction de la réponse finale) ---
            # Température basse : ici l'IA doit restituer fidèlement les données
            # de la DB, pas "créer" du texte.
            final_response = client.chat.completions.create(
                extra_headers={"HTTP-Referer": "http://localhost:3000", "X-Title": "GFST Platform"},
                model="openai.gpt-4o",
                messages=messages,
                max_tokens=1000,
                temperature=0.2
            )
            reponse_texte = final_response.choices[0].message.content
            tokens_total = (response.usage.total_tokens if response.usage else 0) + final_response.usage.total_tokens
            
        else:
            # L'IA n'a pas utilisé d'outil, elle a répondu directement
            reponse_texte = message.content
            tokens_total = response.usage.total_tokens if response.usage else 0

        # --- SAUVEGARDE EN BASE DE DONNÉES ---
        if body.session_id:
            msg_user = DBMessage(session_id=body.session_id, role="user", content=body.message)
            db.add(msg_user)
            
            msg_ia = DBMessage(session_id=body.session_id, role="assistant", content=reponse_texte)
            db.add(msg_ia)
            
            db.commit()
            
        return {"reponse": reponse_texte, "tokens_used": tokens_total}

    except Exception as e:
        import traceback
        print("🚨 --- DÉBUT DE L'ERREUR CHATBOT --- 🚨")
        traceback.print_exc()
        print("🚨 --- FIN DE L'ERREUR --- 🚨")
        raise HTTPException(status_code=500, detail=f"Erreur IA: {str(e)}")