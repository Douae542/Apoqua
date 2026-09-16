from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    session_id = Column(String(50), index=True)
    role = Column(String(20))
    content = Column(Text)
    timestamp = Column(DateTime, server_default=func.now())