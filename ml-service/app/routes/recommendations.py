import os
import asyncpg
import joblib
import pandas as pd
import numpy as np
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.middleware.auth import verify_user_jwt
from app.lib import cache

router = APIRouter(prefix="/recommendations", tags=["Recommendation Engine"])

DATABASE_URL = os.getenv("DATABASE_URL")

weights_dir = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "models", "weights"
)
fair_model_path = os.path.join(weights_dir, "fairlearn_threshold_optimizer.pkl")
try:
    fair_optimizer = joblib.load(fair_model_path)
except Exception:
    fair_optimizer = None


class SectorFeedRequest(BaseModel):
    sector: str


@router.post("/sector-top-five", dependencies=[Depends(verify_user_jwt)])
async def get_highest_quality_by_sector(payload: SectorFeedRequest):
    target_sector = payload.sector.strip().lower()
    cache_key = f"cache:sector:{target_sector}:top5"

    try:
        cached_results = cache.get(cache_key)
        if cached_results is not None:
            return {
                "status": "success",
                "sector": target_sector,
                "source": "cache",
                "results": cached_results,
            }

        pg_conn = await asyncpg.connect(DATABASE_URL)
        rows = await pg_conn.fetch(
            """
            SELECT id, user_id, media_type, visibility_score
            FROM platform_media_evaluations
            WHERE sector = $1
            ORDER BY visibility_score DESC
            LIMIT 5
        """,
            target_sector,
        )
        await pg_conn.close()

        if not rows:
            return {
                "status": "success",
                "sector": target_sector,
                "source": "database",
                "results": [],
            }

        processed_candidates = []
        mock_groups = np.random.choice([0, 1], size=len(rows)).tolist()

        if fair_optimizer is not None:
            scores = [float(r["visibility_score"]) / 100.0 for r in rows]
            X_df = pd.DataFrame({"score": scores})
            fair_decisions = fair_optimizer.predict(
                X_df, sensitive_features=mock_groups
            )

            for idx, row in enumerate(rows):
                processed_candidates.append(
                    {
                        "evaluation_id": row["id"],
                        "uploaded_by_user": row["user_id"],
                        "media_type": row["media_type"],
                        "visibility_score": float(row["visibility_score"]),
                        "prediction_score": float(row["visibility_score"]),
                        "visibility_approved": bool(fair_decisions[idx]),
                    }
                )
        else:
            for row in rows:
                processed_candidates.append(
                    {
                        "evaluation_id": row["id"],
                        "uploaded_by_user": row["user_id"],
                        "media_type": row["media_type"],
                        "visibility_score": float(row["visibility_score"]),
                        "prediction_score": float(row["visibility_score"]),
                        "visibility_approved": True,
                    }
                )

        processed_candidates.sort(key=lambda x: x["prediction_score"], reverse=True)
        top_five_feed = processed_candidates[:5]

        cache.setex(cache_key, 300, top_five_feed)

        return {
            "status": "success",
            "sector": target_sector,
            "source": "database",
            "results": top_five_feed,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate sector recommendations: {str(e)}",
        )
