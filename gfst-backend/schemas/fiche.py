from pydantic import BaseModel
from typing import Optional

class FicheCreate(BaseModel):
    reference: str
    designation_fr: str
    designation_en: Optional[str] = ""
    vehicle_area: Optional[str] = ""
    psa_dec: Optional[str] = ""
    lot: Optional[str] = ""
    status: Optional[str] = "To be updated"
    in_poro: Optional[str] = "NO"
    in_pfr: Optional[str] = "NO"
    creation_date: Optional[str] = ""
    last_modification: Optional[str] = ""

class FicheUpdate(BaseModel):
    designation_fr: Optional[str] = None
    designation_en: Optional[str] = None
    vehicle_area: Optional[str] = None
    psa_dec: Optional[str] = None
    lot: Optional[str] = None
    status: Optional[str] = None
    in_poro: Optional[str] = None
    in_pfr: Optional[str] = None
    last_modification: Optional[str] = None

class FicheResponse(BaseModel):
    id: int
    reference: str
    designation_fr: Optional[str]
    designation_en: Optional[str]
    vehicle_area: Optional[str]
    psa_dec: Optional[str]
    lot: Optional[str]
    status: str
    in_poro: str
    in_pfr: str
    creation_date: Optional[str]
    last_modification: Optional[str]

    model_config = {"from_attributes": True}

class FichePoroResponse(BaseModel):
    id: int
    reference: str
    designation_en: Optional[str] = None
    vehicle_area: Optional[str] = None
    psa_dec: Optional[str] = None
    status: Optional[str] = None
    ref_screw_nut_Bdl: Optional[str] = None
    triplet_for_poro: Optional[str] = None

    model_config = {"from_attributes": True}

class SlideResponse(BaseModel):
    id: int
    nom_fichier: str
    numero_slide: int
    titre_slide: Optional[str] = None
    contenu_texte: Optional[str] = None

    model_config = {"from_attributes": True}
