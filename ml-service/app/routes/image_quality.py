import os
from typing import Optional

import asyncpg
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile

from app.lib import cache
from app.middleware.auth import verify_user_jwt
from app.services.hf_client import HFClient

router = APIRouter(prefix="/image")

DATABASE_URL = os.getenv("DATABASE_URL")


@router.post("/evaluate")
async def evaluate_image(
    request: Request,
    sector: str = Form(...),
    file: UploadFile = File(...),
    talent_id: Optional[str] = Form(None),
    token_payload: dict = Depends(verify_user_jwt),
):
    current_user_id = (talent_id or "").strip() or request.state.user_id
    target_sector = sector.strip().lower()
    file_bytes = await file.read()

    try:
        result = HFClient.image(file_bytes)
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
            "image",
            visibility_score,
        )
        await pg_conn.close()

        cache.delete(f"cache:sector:{target_sector}:top5")

        return {
            "status": "success",
            "media_type": "image",
            "sector": target_sector,
            "visibility_score": visibility_score,
            "recorded_by_user": current_user_id,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Image processing failure: {str(e)}"
        )
