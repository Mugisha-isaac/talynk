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

# Instantiate pipeline classes once into local system memory on system startup
audio_processor, audio_model = load_audio_pipeline()
visual_processor, visual_model = load_visual_pipeline()


class QualityRequest(BaseModel):
    file_url: str
    media_type: str  # "audio" or "image"


@router.post("/quality")
async def evaluate_quality(payload: QualityRequest):
    try:
        # Secure stream download directly out of your Supabase Storage Bucket
        response = requests.get(payload.file_url, timeout=10)
        if response.status_code != 200:
            raise HTTPException(
                status_code=400, detail="Failed to pull asset out of Supabase Storage."
            )

        file_bytes = io.BytesIO(response.content)
        visibility_score = 0.0

        if payload.media_type == "audio":
            # Load raw audio bytes directly into a PyTorch waveform tensor
            waveform, sample_rate = torchaudio.load(file_bytes)

            # Resample on the fly to 24kHz to match MERT's exact native training shape
            if sample_rate != 24000:
                waveform = torchaudio.functional.resample(waveform, sample_rate, 24000)

            # Perform clean forward inference
            inputs = audio_processor(
                waveform.squeeze(0), sampling_rate=24000, return_tensors="pt"
            )
            with torch.no_grad():
                score_tensor = audio_model(inputs.input_values)
            visibility_score = score_tensor.item() * 100

        else:
            # Parse target stream array into an RGB image
            image = Image.open(file_bytes).convert("RGB")

            inputs = visual_processor(images=image, return_tensors="pt")
            with torch.no_grad():
                score_tensor = visual_model(inputs.pixel_values)
            visibility_score = score_tensor.item() * 100

        return {
            "status": "success",
            "media_type": payload.media_type,
            "visibility_score": round(
                visibility_score, 2
            ),  # Real score 0-100 derived from your Colab training
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Inference Engine Failure: {str(e)}"
        )
