from pydantic import BaseModel, EmailStr
from typing import Optional
from models.user import RoleEnum

class UserCreate(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    password: str
    role: Optional[RoleEnum] = RoleEnum.operateur
    site: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    nom: str
    prenom: str
    email: str
    role: RoleEnum
    site: Optional[str]
    is_active: bool
    login: Optional[str]
    telephone: Optional[str]
    service: Optional[str]
    site_geo: Optional[str]
    company: Optional[str]
    langue: Optional[str]
    organisation: Optional[str]
    profil_complete: Optional[bool] = False

    class Config:
        model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# ✅ Schéma pour compléter le profil
class ProfilUpdate(BaseModel):
    login: Optional[str] = None
    telephone: Optional[str] = None
    service: Optional[str] = None
    site_geo: Optional[str] = None
    company: Optional[str] = None
    langue: Optional[str] = None
    organisation: Optional[str] = None