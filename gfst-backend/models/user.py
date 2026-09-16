from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from database import Base
import enum

class RoleEnum(str, enum.Enum):
    super_admin = "super_admin"
    admin = "admin"
    ingenieur = "ingenieur"
    concepteur = "concepteur"
    operateur = "operateur"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100), nullable=False)
    prenom = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.operateur)
    site = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    # ✅ Nouveaux champs identité
    login = Column(String(100), nullable=True)
    telephone = Column(String(50), nullable=True)
    service = Column(String(200), nullable=True)
    site_geo = Column(String(200), nullable=True)
    company = Column(String(200), nullable=True)
    langue = Column(String(50), nullable=True)
    organisation = Column(String(200), nullable=True)
    profil_complete = Column(Boolean, default=False)