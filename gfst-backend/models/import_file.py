from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class ImportedFile(Base):
    __tablename__ = "imported_files"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String(255), nullable=False)       # nom original du fichier
    stored_name = Column(String(255), nullable=False)      # nom réel sur le disque (unique)
    comment = Column(String(1000), nullable=True)          # commentaire facultatif
    size = Column(Integer, nullable=False, default=0)      # taille en octets
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    uploaded_at = Column(DateTime, server_default=func.now())