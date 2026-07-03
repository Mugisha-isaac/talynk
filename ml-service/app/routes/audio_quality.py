from fastapi import APIRouter, UploadFile, File, Depends, Form
from app.middleware.auth import verify_user_jwt
from app.services.hf_client import HFClient

router = APIRouter()

@router.post('/evaluate')
async def evaluate_audio(file: UploadFile = File(...), sector: str = Form(...), user=Depends(verify_user_jwt)):
    file_bytes = await file.read()
    result = HFClient.audio(file_bytes)
    return {'score': result['score'], 'sector': sector, 'user': user['user_id']}
