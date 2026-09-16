from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db 
from init_db import FichePoro
from schemas.fiche import FichePoroResponse 

router = APIRouter()

@router.get("/{reference}", response_model=FichePoroResponse)
def get_fiche_poro(reference: str, db: Session = Depends(get_db)):
    fiche = db.query(FichePoro).filter(FichePoro.reference == reference).first()
    
    if not fiche:
        raise HTTPException(status_code=404, detail="Référence Poro introuvable")
        
    return fiche