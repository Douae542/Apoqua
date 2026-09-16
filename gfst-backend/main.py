from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal
from models import user, fiche, demande
from routes import auth, fiches, demandes, chatbot, poro, ppt, session, translate, imports
from apscheduler.schedulers.background import BackgroundScheduler
from models.message import Message
from datetime import datetime, timedelta
from routes.kpi import router as kpi_router
import embedding_hooks

Base.metadata.create_all(bind=engine)

def clean_old_sessions():
    db = SessionLocal()
    try:
        # On calcule la limite de 24h
        limit = datetime.now() - timedelta(hours=24)
        db.query(Message).filter(Message.timestamp < limit).delete()
        db.commit()
        print(" Nettoyage terminé.")
    except Exception as e:
        print(f" Erreur lors du nettoyage : {e}")
        db.rollback()
    finally:
        # On s'assure de toujours fermer la session DB
        db.close()

# Gestion du démarrage et de l'arrêt du serveur
@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = BackgroundScheduler()
    scheduler.add_job(clean_old_sessions, 'interval', hours=1)
    scheduler.start()
    print("Planificateur démarré.")
    
    yield  # L'API tourne ici
    
    scheduler.shutdown()
    print("Planificateur arrêté proprement.")

# On ajoute le lifespan à l'application
app = FastAPI(title="GFST API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,     prefix="/api/auth",     tags=["Auth"])
app.include_router(fiches.router,   prefix="/api/fiches",   tags=["Fiches"])
app.include_router(demandes.router, prefix="/api/demandes", tags=["Demandes"])
app.include_router(chatbot.router,  prefix="/api/chatbot",  tags=["Chatbot"])
app.include_router(session.router,  prefix="/api/session",  tags=["Session"])
app.include_router(poro.router,     prefix="/api/poro",     tags=["Poro"])
app.include_router(ppt.router,      prefix="/api/ppt",      tags=["PPT"])
app.include_router(kpi_router,      tags=["KPI"])
app.include_router(translate.router, prefix="/api/translate", tags=["Translate"])
app.include_router(imports.router,  prefix="/api/imports",  tags=["Imports"])

@app.get("/")
def root():
    return {"message": "GFST API OK"}