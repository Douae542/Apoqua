from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.demande import StatutDemandeEnum

class DemandeCreate(BaseModel):
    reference: str
    type_demande: str
    description: Optional[str] = ""

    model_config = {"from_attributes": True}

class DemandeUpdate(BaseModel):
    statut: Optional[StatutDemandeEnum] = None
    description: Optional[str] = None

    model_config = {"from_attributes": True}

class DemandeResponse(BaseModel):
    id: int
    reference: str
    type_demande: str
    statut: StatutDemandeEnum
    description: Optional[str]
    created_by: int
    created_at: Optional[datetime] = True

    model_config = {"from_attributes": True}