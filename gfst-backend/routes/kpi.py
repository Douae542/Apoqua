from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import io

router = APIRouter()

@router.post("/api/kpi/upload")
async def upload_kpi(file: UploadFile = File(...)):
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Fichier Excel requis")
    
    content = await file.read()
    df = pd.read_excel(io.BytesIO(content))
    
    # Adapter selon la structure de ton fichier
    kpi = {
        "total": int(df.iloc[0]["Total Items"]) if "Total Items" in df.columns else 194,
        "published": int(df.iloc[0]["Published"]) if "Published" in df.columns else 143,
        "ongoing": int(df.iloc[0]["On going"]) if "On going" in df.columns else 44,
        "cancelled": int(df.iloc[0]["Cancelled"]) if "Cancelled" in df.columns else 7,
    }
    
    return JSONResponse(content=kpi)

@router.get("/api/kpi/default")
def get_default_kpi():
    return {
        "total": 194,
        "published": 143,
        "ongoing": 44,
        "cancelled": 7,
        "approved_target": [
            { "name": "Approved", "value": 81, "color": "#2E7D32" },
            { "name": "Email sent", "value": 7, "color": "#C8E6C9" },
            { "name": "Email sent to pedro", "value": 3, "color": "#F5A623" },
            { "name": "Searching about validators", "value": 3, "color": "#3D8EF5" },
            { "name": "Red target", "value": 3, "color": "#FF6B6B" },
            { "name": "Canceled", "value": 2, "color": "#9E9E9E" },
            { "name": "In workflow", "value": 1, "color": "#B0BEC5" },
        ],
        "applicable_target": [
            { "name": "Approved", "value": 31, "color": "#2E7D32" },
            { "name": "Email sent", "value": 14, "color": "#C8E6C9" },
            { "name": "Email sent to pedro", "value": 6, "color": "#F5A623" },
            { "name": "Searching about validators", "value": 20, "color": "#3D8EF5" },
            { "name": "Red target", "value": 12, "color": "#FF6B6B" },
            { "name": "On going", "value": 6, "color": "#9B8CFF" },
            { "name": "Canceled", "value": 11, "color": "#9E9E9E" },
        ],
    }