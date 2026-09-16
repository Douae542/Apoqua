from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from models.user import User, RoleEnum
from schemas.auth import UserCreate, UserResponse, Token
from utils.security import hash_password, verify_password, create_access_token, decode_token
from schemas.auth import UserCreate, UserResponse, Token, ProfilUpdate
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token invalide")
    user = db.query(User).filter(User.email == payload.get("email")).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return user

def require_role(*roles: RoleEnum):
    def checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Accès refusé")
        return current_user
    return checker

@router.post("/register", response_model=UserResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    user = User(
        nom=data.nom,
        prenom=data.prenom,
        email=data.email,
        hashed_password=hash_password(data.password),
        role=data.role,
        site=data.site
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Compte désactivé")
    token = create_access_token({
        "email": user.email,
        "role": user.role.value,
        "nom": user.nom,
        "prenom": user.prenom
    })
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(RoleEnum.super_admin, RoleEnum.admin))
):
    users = db.query(User).all()
    return {"data": users, "total": len(users)}

@router.put("/users/{user_id}/disable")
def disable_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(RoleEnum.super_admin))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    user.is_active = False
    db.commit()
    return {"message": f"Utilisateur {user.email} désactivé"}
    

# ─── COMPLÉTER LE PROFIL ──────────────────────────────────────
@router.put("/profil")
def update_profil(
    data: ProfilUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for key, value in data.dict(exclude_none=True).items():
        setattr(current_user, key, value)
    current_user.profil_complete = True
    db.commit()
    db.refresh(current_user)
    return current_user

# ─── VÉRIFIER SI PROFIL COMPLET ──────────────────────────────
@router.get("/check-profil")
def check_profil(current_user: User = Depends(get_current_user)):
    return {
        "profil_complete": current_user.profil_complete,
        "role": current_user.role.value,
        "is_admin": current_user.email == "admin@gfst.com" or current_user.role.value in ["super_admin", "admin"]
    }