from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()


class RecRequest(BaseModel):
    user_id: str
    top_k: int = 10


@router.post("/recommendations")
async def get_recommendations(payload: RecRequest):
    # 1. Fetch sparse matrix data or interaction history from Supabase/Redis Cache
    # 2. Pass to LightGCN model to get raw recommendation scores
    raw_recs = [
        {"item_id": "track_101", "score": 0.95},
        {"item_id": "track_202", "score": 0.89},
    ]

    return {"user_id": payload.user_id, "recommendations": raw_recs}
