from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.message import Message

router = APIRouter()

@router.delete("/close-session/{session_id}")
def close_session(session_id: str, db: Session = Depends(get_db)):
    db.query(Message).filter(Message.session_id == session_id).delete()
    db.commit()
    return {"message": f"Session {session_id} cloturée et historique effacé"}