import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import get_db
from models.import_file import ImportedFile
from models.user import User, RoleEnum
from schemas.import_file import ImportedFileResponse
from routes.auth import get_current_user, require_role

router = APIRouter()

# Dossier de stockage des fichiers importés, à la racine du projet backend
# (au même niveau que main.py). Créé automatiquement s'il n'existe pas.
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads" / "imports"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = (".csv", ".xlsx", ".xls", ".txt")


@router.get("/", response_model=list[ImportedFileResponse])
def list_imports(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(RoleEnum.super_admin, RoleEnum.admin)),
):
    records = (
        db.query(ImportedFile)
        .order_by(ImportedFile.uploaded_at.desc())
        .all()
    )
    result = []
    for record in records:
        uploader = db.query(User).filter(User.id == record.uploaded_by).first()
        uploader_name = f"{uploader.prenom} {uploader.nom}" if uploader else "Inconnu"
        result.append(
            ImportedFileResponse(
                id=record.id,
                file_name=record.file_name,
                comment=record.comment or "",
                size=record.size,
                uploaded_by_name=uploader_name,
                uploaded_at=record.uploaded_at,
            )
        )
    return result


@router.post("/upload", response_model=ImportedFileResponse)
async def upload_import(
    file: UploadFile = File(...),
    comment: str = Form(...),  # obligatoire : raison/description de l'import
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # tout utilisateur connecté peut importer
):
    if not file.filename.lower().endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Type de fichier non supporté")

    comment_clean = (comment or "").strip()
    if not comment_clean:
        raise HTTPException(status_code=400, detail="La description / raison de l'import est obligatoire")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Fichier vide")

    ext = Path(file.filename).suffix
    stored_name = f"{uuid.uuid4().hex}{ext}"
    dest_path = UPLOAD_DIR / stored_name
    with open(dest_path, "wb") as f:
        f.write(content)

    record = ImportedFile(
        file_name=file.filename,
        stored_name=stored_name,
        comment=comment_clean[:1000],
        size=len(content),
        uploaded_by=current_user.id,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return ImportedFileResponse(
        id=record.id,
        file_name=record.file_name,
        comment=record.comment,
        size=record.size,
        uploaded_by_name=f"{current_user.prenom} {current_user.nom}",
        uploaded_at=record.uploaded_at,
    )



@router.get("/{import_id}/download")
def download_import(
    import_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(RoleEnum.super_admin, RoleEnum.admin)),
):
    record = db.query(ImportedFile).filter(ImportedFile.id == import_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Fichier introuvable")

    file_path = UPLOAD_DIR / record.stored_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Fichier introuvable sur le disque")

    return FileResponse(path=file_path, filename=record.file_name)