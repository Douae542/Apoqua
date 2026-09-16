from fastapi import APIRouter, Depends
from pydantic import BaseModel
from deep_translator import GoogleTranslator
from routes.auth import require_role
from models.user import User, RoleEnum

router = APIRouter()

class TranslateRequest(BaseModel):
    text: str
    target_lang: str  # "fr" ou "en"

class TranslateResponse(BaseModel):
    translated_text: str

@router.post("/", response_model=TranslateResponse)
def translate_text(
    payload: TranslateRequest,
    current_user: User = Depends(require_role(RoleEnum.super_admin, RoleEnum.admin)),
):
    text = (payload.text or "").strip()
    if not text:
        return TranslateResponse(translated_text="")

    target = "fr" if payload.target_lang == "fr" else "en"

    try:
        translated = GoogleTranslator(source="auto", target=target).translate(text)
    except Exception:
        # Si le service de traduction échoue, on renvoie le texte original plutôt que de bloquer
        translated = text

    return TranslateResponse(translated_text=translated or text)