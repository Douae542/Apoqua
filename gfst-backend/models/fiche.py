from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base

class Fiche(Base):
    __tablename__ = "fiches"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(100), unique=True, index=True, nullable=False)
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
    embedding = Column(Text)
