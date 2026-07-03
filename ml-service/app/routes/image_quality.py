from fastapi import APIRouter, UploadFile, File, Depends
from app.middleware.auth import verify_user_jwt
from app.services.hf_client import HFClient

router = APIRouter()

@router.post('/evaluate')
async def evaluate_image(file: UploadFile = File(...), user=Depends(verify_user_jwt)):
    file_bytes = await file.read()
    return HFClient.image(file_bytes)
