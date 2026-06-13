import os
import io
import requests
import asyncpg
import redis.asyncio as aioredis
import torch
import torchaudio
from fastapi import APIRouter, HTTPException, Depends, Request, Form, UploadFile, File
from typing import Optional
from app.models.mert_loader import load_audio_pipeline
from app.middleware.auth import verify_user_jwt

router = APIRouter(prefix="/audio", tags=["Audio Evaluation"])

DATABASE_URL = os.getenv("DATABASE_URL")
REDIS_URL = os.getenv("REDIS_URL")

audio_processor, audio_model = load_audio_pipeline()


@router.post("/evaluate")
async def evaluate_and_save_audio(
    request: Request,
    sector: str = Form(...),
    file_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    token_payload: dict = Depends(verify_user_jwt),
):
    current_user_id = request.state.user_id
    target_sector = sector.strip().lower()
    file_bytes = None

    if file_url and file_url.strip().lower() in ["string", ""]:
        file_url = None

    if file and file.filename != "":
        raw_data = await file.read()
        file_bytes = io.BytesIO(raw_data)
    elif file_url:
        res = requests.get(file_url, timeout=10)
        if res.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="Could not read audio file stream from provided URL.",
            )
        file_bytes = io.BytesIO(res.content)
    else:
        raise HTTPException(
            status_code=400,
            detail="Provide either a direct binary file or a valid file_url.",
        )

    try:
        waveform, sample_rate = torchaudio.load(file_bytes)
        if sample_rate != 24000:
            waveform = torchaudio.functional.resample(waveform, sample_rate, 24000)

        inputs = audio_processor(
            waveform.squeeze(0), sampling_rate=24000, return_tensors="pt"
        )
        with torch.no_grad():
            score_tensor = audio_model(inputs.input_values)

        visibility_score = round(score_tensor.item() * 100, 2)

        pg_conn = await asyncpg.connect(DATABASE_URL)
        await pg_conn.execute(
            """
            INSERT INTO platform_media_evaluations (user_id, sector, media_type, visibility_score)
            VALUES ($1, $2, $3, $4)
        """,
            current_user_id,
            target_sector,
            "audio",
            visibility_score,
        )
        await pg_conn.close()

        if REDIS_URL:
            redis_client = aioredis.from_url(REDIS_URL)
            await redis_client.delete(f"cache:sector:{target_sector}:top5")
            await redis_client.close()

        return {
            "status": "success",
            "media_type": "audio",
            "sector": target_sector,
            "visibility_score": visibility_score,
            "recorded_by_user": current_user_id,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Audio processing failure: {str(e)}"
        )
