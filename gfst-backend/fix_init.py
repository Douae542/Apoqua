code = '''from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
from passlib.context import CryptContext
from dotenv import load_dotenv
import enum
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RoleEnum(str, enum.Enum):
    super_admin = "super_admin"
    admin = "admin"
    ingenieur = "ingenieur"
    concepteur = "concepteur"
    operateur = "operateur"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    nom = Column(String(100))
    prenom = Column(String(100))
    email = Column(String(255), unique=True)
    hashed_password = Column(String(255))
    role = Column(Enum(RoleEnum), default=RoleEnum.operateur)
    site = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

class Fiche(Base):
    __tablename__ = "fiches"
    id = Column(Integer, primary_key=True)
    reference = Column(String(100), unique=True)
    designation_fr = Column(String(500))
    designation_en = Column(String(500))
    vehicle_area = Column(String(200))
    psa_dec = Column(String(100))
    lot = Column(String(50))
    status = Column(String(100), default="To be updated")
    in_poro = Column(String(10), default="NO")
    in_pfr = Column(String(10), default="NO")
    creation_date = Column(String(50))
    last_modification = Column(String(50))
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class Demande(Base):
    __tablename__ = "demandes"
    id = Column(Integer, primary_key=True)
    reference = Column(String(100))
    type_demande = Column(String(100))
    statut = Column(String(100), default="En attente")
    description = Column(String(1000))
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

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
'''

with open("init_db.py", "w", encoding="utf-8") as f:
    f.write(code)
print("init_db.py created!")