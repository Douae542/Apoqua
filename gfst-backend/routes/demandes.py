from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
from models.demande import Demande
from models.user import User, RoleEnum
from schemas.demande import DemandeCreate, DemandeUpdate, DemandeResponse
from routes.auth import get_current_user, require_role
from utils.email import send_notification_email

router = APIRouter()

@router.get("/")
def get_demandes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role in [RoleEnum.super_admin, RoleEnum.admin]:
        demandes = db.query(Demande).order_by(Demande.created_at.desc()).all()
    else:
        demandes = db.query(Demande).filter(
            Demande.created_by == current_user.id
        ).order_by(Demande.created_at.desc()).all()
    return {
        "data": [DemandeResponse.model_validate(d) for d in demandes],
        "total": len(demandes)
    }

@router.post("/")
def create_demande(
    data: DemandeCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    
    demande = Demande(
        **data.dict(),
        created_by=current_user.id,
        statut="Applicable"  
    )
    db.add(demande)
    db.commit()
    db.refresh(demande)
  
  
    background_tasks.add_task(
        send_notification_email,
        type_demande=data.type_demande,
        reference=data.reference,
        description=data.description or "",
        user_nom=current_user.nom,
        user_prenom=current_user.prenom,
        user_email=current_user.email
    )

    return {
        "message": "Demande enregistrée et notifications envoyées",
        "demande": demande
    }

@router.patch("/{demande_id}", response_model=DemandeResponse)
def update_demande(
    demande_id: int,
    data: DemandeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(RoleEnum.super_admin, RoleEnum.admin))
):
    demande = db.query(Demande).filter(Demande.id == demande_id).first()
    if not demande:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    for key, value in data.dict(exclude_none=True).items():
        setattr(demande, key, value)
    db.commit()
    db.refresh(demande)
    return demande

@router.delete("/{demande_id}")
def delete_demande(
    demande_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(RoleEnum.super_admin))
):
    demande = db.query(Demande).filter(Demande.id == demande_id).first()
    if not demande:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    db.delete(demande)
    db.commit()
    return {"message": "Demande supprimée"}