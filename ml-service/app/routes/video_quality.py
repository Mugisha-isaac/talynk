import os
import io
import requests
import asyncpg
import redis.asyncio as aioredis
import torch
import torchvision.io as tv_io
from PIL import Image
from fastapi import APIRouter, HTTPException, Depends, Request, Form, UploadFile, File
from typing import Optional
from app.models.nima_clip_loader import load_visual_pipeline
from app.middleware.auth import verify_user_jwt

router = APIRouter(prefix="/video", tags=["Video Evaluation"])

DATABASE_URL = os.getenv("DATABASE_URL")
REDIS_URL = os.getenv("REDIS_URL")

visual_processor, visual_model = load_visual_pipeline()


@router.post("/evaluate")
async def evaluate_and_save_video(
    request: Request,
    sector: str = Form(...),
    file_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    talent_id: Optional[str] = Form(None),
    token_payload: dict = Depends(verify_user_jwt),
):
    # talent_id is the real Talynk creator id (passed by the frontend on behalf
    # of the caller). The JWT's user_id is the service-account identity used to
    # authenticate against this API, not the actual content owner, so we prefer
    # talent_id when it's supplied and only fall back to the token's identity.
    current_user_id = (talent_id or "").strip() or request.state.user_id
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
                detail="Could not read video file stream from provided URL.",
            )
        file_bytes = io.BytesIO(res.content)
    else:
        raise HTTPException(
            status_code=400,
            detail="Provide either a direct binary video upload or a valid file_url.",
        )

    try:
        temp_path = "temp_inference_video.mp4"
        with open(temp_path, "wb") as f:
            f.write(file_bytes.getbuffer())

        video_frames, _, _ = tv_io.read_video(
            temp_path, pts_unit="sec", output_format="TCHW"
        )
        if len(video_frames) == 0:
            raise ValueError("Target media contains no readable video frames.")

        indices = torch.linspace(0, len(video_frames) - 1, steps=5).long()
        sampled_frames = video_frames[indices]

        scores = []
        for frame in sampled_frames:
            pil_img = Image.fromarray(frame.permute(1, 2, 0).numpy())
            inputs = visual_processor(images=pil_img, return_tensors="pt")
            with torch.no_grad():
                score_tensor = visual_model(inputs.pixel_values)
            scores.append(score_tensor.item() * 100)

        visibility_score = round(sum(scores) / len(scores), 2)

        pg_conn = await asyncpg.connect(DATABASE_URL)
        await pg_conn.execute(
            """
            INSERT INTO platform_media_evaluations (user_id, sector, media_type, visibility_score)
            VALUES ($1, $2, $3, $4)
        """,
            current_user_id,
            target_sector,
            "video",
            visibility_score,
        )
        await pg_conn.close()

        if REDIS_URL:
            redis_client = aioredis.from_url(REDIS_URL)
            await redis_client.delete(f"cache:sector:{target_sector}:top5")
            await redis_client.close()

        return {
            "status": "success",
            "media_type": "video",
            "sector": target_sector,
            "visibility_score": visibility_score,
            "recorded_by_user": current_user_id,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Video processing failure: {str(e)}"
        )
