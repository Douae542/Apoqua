from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Enum, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
from passlib.context import CryptContext
from models.demande import Demande
from models.fiche import Fiche
from models.user import User
from dotenv import load_dotenv
from database import Base, engine, SessionLocal
import enum
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RoleEnum(str, enum.Enum):
    super_admin = "super_admin"
    admin = "admin"
    operateur = "operateur"

class FichePoro(Base):
    __tablename__ = "fiches_poro"  # <-- C'est le nouveau nom dans PostgreSQL
    
    id = Column(Integer, primary_key=True)
    reference = Column(String(255), unique=True)
    designation_fr = Column(Text)
    designation_en = Column(Text)
    vehicle_area = Column(Text)
    psa_dec = Column(Text)
    lot = Column(Text)
    status = Column(Text)
    in_poro = Column(Text, default="YES")
    in_pfr = Column(Text, default="NO")
    creation_date = Column(Text)
    last_modification = Column(Text)
    ref_screw_nut_Bdl = Column(Text)
    triplet_for_poro = Column(Text)
    
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    embedding = Column(Text)

class SlidePresentation(Base):
    __tablename__ = "slides_ppt"
    
    id = Column(Integer, primary_key=True)
    nom_fichier = Column(String(255))
    numero_slide = Column(Integer)
    titre_slide = Column(Text)
    contenu_texte = Column(Text)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    embedding = Column(Text)

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)

    print("Tables created!")

    db = SessionLocal()

    existing = db.query(User).filter(User.email == "admin@gfst.com").first()

    if not existing:
        admin = User(
            nom="Admin",
            prenom="GFST",
            email="admin@gfst.com",
            hashed_password=pwd_context.hash("admin123"),
            role=RoleEnum.super_admin,
            site="Paris",
            is_active=True
        )

        db.add(admin)
        db.commit()

        print("Admin created!")
        print("Email: admin@gfst.com")
        print("Password: admin123")

    else:
        print("Admin already exists!")

    print("Users count:", db.query(User).count())

    db.close()