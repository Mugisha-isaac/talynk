import os
import requests
import asyncpg
from fastapi import APIRouter, HTTPException, Depends, Request, Form, UploadFile, File
from typing import Optional
from app.services.hf_client import HFClient
from app.middleware.auth import verify_user_jwt
from app.lib import cache

router = APIRouter(prefix="/video", tags=["Video Evaluation"])

DATABASE_URL = os.getenv("DATABASE_URL")


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
        file_bytes = await file.read()
    elif file_url:
        res = requests.get(file_url, timeout=10)
        if res.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="Could not read video file stream from provided URL.",
            )
        file_bytes = res.content
    else:
        raise HTTPException(
            status_code=400,
            detail="Provide either a direct binary video upload or a valid file_url.",
        )

    try:
        result = HFClient.video(file_bytes)
        if "score" not in result:
            raise ValueError(result.get("detail", "Model service returned no score."))

        visibility_score = round(result["score"] * 100, 2)

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

        cache.delete(f"cache:sector:{target_sector}:top5")

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
