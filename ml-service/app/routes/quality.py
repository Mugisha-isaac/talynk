import io
import requests
import torch
import torchaudio
from PIL import Image
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.mert_loader import load_audio_pipeline
from app.models.nima_clip_loader import load_visual_pipeline

router = APIRouter()

# Instantiate pipelines once at startup
audio_processor, audio_model = load_audio_pipeline()
visual_processor, visual_model = load_visual_pipeline()


class QualityRequest(BaseModel):
    file_url: str
    media_type: str  # "audio" or "video" / "image"


@router.post("/quality")
async def evaluate_quality(payload: QualityRequest):
    try:
        # Download payload object from Supabase Storage
        response = requests.get(payload.file_url, timeout=10)
        if response.status_code != 200:
            raise HTTPException(
                status_code=400, detail="Failed to retrieve file from storage URL."
            )

        file_bytes = io.BytesIO(response.content)
        visibility_score = 0.0

        if payload.media_type == "audio":
            # Real Inference via MERT
            waveform, sample_rate = torchaudio.load(file_bytes)
            # Re-sample to 24kHz matching MERT requirements
            if sample_rate != 24000:
                waveform = torchaudio.functional.resample(waveform, sample_rate, 24000)

            inputs = audio_processor(
                waveform.squeeze(0), sampling_rate=24000, return_tensors="pt"
            )
            with torch.no_grad():
                score_tensor = audio_model(inputs.input_values)
            visibility_score = (
                score_tensor.item() * 100
            )  # Convert 0-1 range to 0-100 scale

        else:
            # Real Inference via NIMA + CLIP
            image = Image.open(file_bytes).convert("RGB")
            inputs = visual_processor(images=image, return_tensors="pt")
            with torch.no_grad():
                score_tensor = visual_model(inputs.pixel_values)
            visibility_score = score_tensor.item() * 100

        return {
            "status": "completed",
            "media_type": payload.media_type,
            "visibility_score": round(
                visibility_score, 2
            ),  # Dynamic Visibility Score (0-100)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Inference Engine Failed: {str(e)}"
        )
