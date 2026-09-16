from pydantic import BaseModel
from datetime import datetime

class ImportedFileResponse(BaseModel):
    id: int
    file_name: str
    comment: str
    size: int
    uploaded_by_name: str
    uploaded_at: datetime

    class Config:
        from_attributes = True