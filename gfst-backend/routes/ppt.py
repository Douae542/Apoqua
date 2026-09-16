from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db 
from init_db import SlidePresentation 
from schemas.fiche import SlideResponse

router = APIRouter()

@router.get("/{nom_fichier}", response_model=list[SlideResponse])
def get_slides_by_file(nom_fichier: str, db: Session = Depends(get_db)):
    """
    Récupère toutes les slides d'un fichier PowerPoint précis.
    """
    slides = db.query(SlidePresentation).filter(SlidePresentation.nom_fichier == nom_fichier).order_by(SlidePresentation.numero_slide.asc()).all()
    
    if not slides:
        raise HTTPException(status_code=404, detail="Aucune slide trouvée pour ce fichier")
        
    return slides

@router.get("/", response_model=list[SlideResponse])
def get_all_slides(db: Session = Depends(get_db)):
    """
    Récupère absolument toutes les slides de la base.
    """
    return db.query(SlidePresentation).all()