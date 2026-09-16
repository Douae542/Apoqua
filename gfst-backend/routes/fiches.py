from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from database import get_db
from models.fiche import Fiche
from models.user import User, RoleEnum
from schemas.fiche import FicheCreate, FicheUpdate, FicheResponse
from routes.auth import get_current_user, require_role
import pandas as pd

router = APIRouter()

# Anciens libellés Excel qui doivent maintenant être regroupés sous les 4 statuts
# officiels du frontend. Complète cette liste avec les valeurs réelles trouvées via:
# SELECT status, COUNT(*) FROM fiches GROUP BY status ORDER BY COUNT(*) DESC;
STATUS_ALIASES = {
    "Approved": ["approved"],
    "In Process": ["in process", "processing", "pending", "ongoing", "to be updated"],
    "Cancelled": ["cancelled", "canceled"],
    "Applicable": ["applicable"],
}

@router.get("/")
def get_fiches(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    area: Optional[str] = Query(None),
    poro: Optional[str] = Query(None),
    pfr: Optional[str] = Query(None),
    page: int = 1,
    limit: int = 25,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Fiche)
    if search:
        query = query.filter(
            Fiche.reference.ilike(f"%{search}%") |
            Fiche.designation_fr.ilike(f"%{search}%") |
            Fiche.designation_en.ilike(f"%{search}%")
        )
    if status:
        # Comparaison insensible à la casse/espaces + regroupement des anciennes
        # variantes connues sous le statut officiel demandé.
        normalized_status = func.lower(func.trim(Fiche.status))
        aliases = STATUS_ALIASES.get(status, [status.lower()])
        query = query.filter(normalized_status.in_(aliases))
    if area:
        query = query.filter(Fiche.vehicle_area == area)
    if poro:
        query = query.filter(Fiche.in_poro == poro)
    if pfr:
        query = query.filter(Fiche.in_pfr == pfr)

    total = query.count()
    fiches = query.offset((page - 1) * limit).limit(limit).all()
    return {
        "data": [FicheResponse.from_orm(f) for f in fiches],
        "total": total,
        "page": page,
        "pages": -(-total // limit)
    }

@router.get("/all")
def get_all_fiches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    fiches = db.query(Fiche).all()
    return {"data": [FicheResponse.from_orm(f) for f in fiches], "total": len(fiches)}

@router.post("/")
def create_fiche(
    data: FicheCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(
        RoleEnum.super_admin, RoleEnum.admin, RoleEnum.ingenieur
    ))
):
    if db.query(Fiche).filter(Fiche.reference == data.reference).first():
        raise HTTPException(status_code=400, detail="Référence déjà existante")
    fiche = Fiche(**data.dict(), created_by=current_user.id)
    db.add(fiche)
    db.commit()
    db.refresh(fiche)
    return fiche

@router.put("/{fiche_id}")
def update_fiche(
    fiche_id: int,
    data: FicheUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(
        RoleEnum.super_admin, RoleEnum.admin, RoleEnum.ingenieur
    ))
):
    fiche = db.query(Fiche).filter(Fiche.id == fiche_id).first()
    if not fiche:
        raise HTTPException(status_code=404, detail="Fiche introuvable")
    for key, value in data.dict(exclude_none=True).items():
        setattr(fiche, key, value)
    db.commit()
    db.refresh(fiche)
    return fiche

@router.delete("/{fiche_id}")
def delete_fiche(
    fiche_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(RoleEnum.super_admin))
):
    fiche = db.query(Fiche).filter(Fiche.id == fiche_id).first()
    if not fiche:
        raise HTTPException(status_code=404, detail="Fiche introuvable")
    db.delete(fiche)
    db.commit()
    return {"message": "Fiche supprimée"}

@router.post("/import-excel")
async def import_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(RoleEnum.super_admin, RoleEnum.admin))
):
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Fichier Excel requis")

    df = pd.read_excel(file.file)
    df.columns = df.columns.str.strip()
    imported = 0
    errors = []

    for _, row in df.iterrows():
        try:
            ref = str(row.get("Reference", "")).strip()
            if not ref or ref == "nan":
                continue
            if db.query(Fiche).filter(Fiche.reference == ref).first():
                errors.append(f"{ref} déjà existante")
                continue
            fiche = Fiche(
                reference=ref,
                designation_fr=str(row.get("Designation FR", "") or ""),
                designation_en=str(row.get("Designation EN", "") or ""),
                vehicle_area=str(row.get("Vehicle Area", "") or ""),
                psa_dec=str(row.get("PSA DEC", "") or ""),
                lot=str(row.get("Lot", "") or ""),
                status=str(row.get("Status", "To be updated") or "To be updated"),
                in_poro=str(row.get("In PORO", "NO") or "NO"),
                in_pfr=str(row.get("In PFR", "NO") or "NO"),
                creation_date=str(row.get("Creation Date", "") or ""),
                last_modification=str(row.get("Last Modification", "") or ""),
                created_by=current_user.id
            )
            db.add(fiche)
            imported += 1
        except Exception as e:
            errors.append(str(e))

    db.commit()
    return {"imported": imported, "errors": errors}