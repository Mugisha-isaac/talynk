import os
import joblib
import pandas as pd
import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Load the Fairlearn ThresholdOptimizer artifact on application initialization
weights_dir = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "models", "weights"
)
fair_model_path = os.path.join(weights_dir, "fairlearn_threshold_optimizer.pkl")

try:
    fair_optimizer = joblib.load(fair_model_path)
    print("-> Recommendation Engine: Loaded Demographic Parity post-processor.")
except Exception as e:
    fair_optimizer = None
    print(f"-> Recommendation Engine Warning: Could not load fairness weights: {e}")


class RecRequest(BaseModel):
    user_id: int
    top_k: int = 10


@router.post("/recommendations")
async def get_fair_recommendations(payload: RecRequest):
    try:
        # 1. In production, pull raw recommendation data matrices from your RecBole model or Redis cache.
        # For demonstration, we simulate 10 candidate tracks returned by the underlying LightGCN layers.
        num_candidates = 10
        mock_item_ids = [2001 + i for i in range(num_candidates)]
        mock_lightgcn_scores = sorted(
            np.random.uniform(0.5, 0.95, num_candidates).tolist(), reverse=True
        )

        # Demographics lookups pulled out of your Supabase PostgreSQL Data Layer (e.g. 0 = Group A, 1 = Group B)
        mock_sensitive_features = np.random.choice([0, 1], size=num_candidates).tolist()

        if fair_optimizer is not None:
            # Structuring inputs matching your scikit-learn/Fairlearn format
            X_df = pd.DataFrame({"score": mock_lightgcn_scores})

            # Predict fair selection decisions based on the post-tuned Colab metric boundaries
            fair_decisions = fair_optimizer.predict(
                X_df, sensitive_features=mock_sensitive_features
            )

            final_recommendations = []
            for idx, approved in enumerate(fair_decisions):
                # Only include items approved by the optimization constraints, or sort by parity transformations
                final_recommendations.append(
                    {
                        "item_id": mock_item_ids[idx],
                        "raw_score": round(mock_lightgcn_scores[idx], 4),
                        "sensitive_group": int(mock_sensitive_features[idx]),
                        "visibility_approved": bool(approved),
                    }
                )
        else:
            # Fallback configuration structure
            final_recommendations = [
                {
                    "item_id": mock_item_ids[i],
                    "raw_score": mock_lightgcn_scores[i],
                    "visibility_approved": True,
                }
                for i in range(num_candidates)
            ]

        return {
            "user_id": payload.user_id,
            "fairness_mitigation_active": fair_optimizer is not None,
            "results": final_recommendations[: payload.top_k],
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Recommendation Exception: {str(e)}"
        )
