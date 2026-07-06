import io
import os

import av
import numpy as np
import torch
import torchaudio
from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from PIL import Image

from models.mert_loader import load_audio_pipeline
from models.nima_clip_loader import load_visual_pipeline

INTERNAL_TOKEN = os.getenv("INTERNAL_TOKEN")  # optional Space secret

app = FastAPI()

audio_processor, audio_model = load_audio_pipeline()
visual_processor, visual_model = load_visual_pipeline()


def _check_auth(x_internal_token):
    if INTERNAL_TOKEN and x_internal_token != INTERNAL_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing internal token.")


def _decode_audio(raw_bytes: bytes):
    """Decode arbitrary audio bytes (wav/mp3/m4a/...) into a mono float32 waveform."""
    try:
        container = av.open(io.BytesIO(raw_bytes))
        stream = next(s for s in container.streams if s.type == "audio")
        sample_rate = stream.codec_context.sample_rate
        frames = []
        for frame in container.decode(stream):
            arr = frame.to_ndarray()
            if arr.ndim > 1:
                arr = arr.mean(axis=0)
            frames.append(arr.astype(np.float32))
        container.close()
        if not frames:
            raise ValueError("No audio frames decoded.")
        waveform = np.concatenate(frames)
        if waveform.max() > 1.0 or waveform.min() < -1.0:
            waveform = waveform / np.abs(waveform).max()
        return waveform, sample_rate
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not decode audio: {e}")


def _extract_video_frame(raw_bytes: bytes) -> Image.Image:
    """Grab the middle frame of a video as a PIL image."""
    try:
        container = av.open(io.BytesIO(raw_bytes))
        stream = next(s for s in container.streams if s.type == "video")
        total_frames = stream.frames or 0
        target_index = total_frames // 2 if total_frames else 0

        frame_img = None
        for i, frame in enumerate(container.decode(stream)):
            frame_img = frame.to_image()
            if i >= target_index:
                break
        container.close()

        if frame_img is None:
            raise ValueError("No video frames decoded.")
        return frame_img.convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not decode video: {e}")


def _score_image(image: Image.Image) -> float:
    inputs = visual_processor(images=image, return_tensors="pt")
    with torch.no_grad():
        score = visual_model(inputs["pixel_values"])
    return float(score.item())


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/predict/audio")
async def predict_audio(
    file: UploadFile = File(...),
    x_internal_token: str = Header(None),
):
    _check_auth(x_internal_token)
    raw_bytes = await file.read()
    waveform, sample_rate = _decode_audio(raw_bytes)

    target_rate = audio_processor.sampling_rate
    if sample_rate != target_rate:
        tensor = torch.from_numpy(waveform).unsqueeze(0)
        tensor = torchaudio.functional.resample(tensor, sample_rate, target_rate)
        waveform = tensor.squeeze(0).numpy()

    inputs = audio_processor(waveform, sampling_rate=target_rate, return_tensors="pt")

    with torch.no_grad():
        score = audio_model(inputs["input_values"])

    return {"score": float(score.item())}


@app.post("/predict/image")
async def predict_image(
    file: UploadFile = File(...),
    x_internal_token: str = Header(None),
):
    _check_auth(x_internal_token)
    raw_bytes = await file.read()
    try:
        image = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not decode image: {e}")

    return {"score": _score_image(image)}


@app.post("/predict/video")
async def predict_video(
    file: UploadFile = File(...),
    x_internal_token: str = Header(None),
):
    _check_auth(x_internal_token)
    raw_bytes = await file.read()
    frame = _extract_video_frame(raw_bytes)
    return {"score": _score_image(frame)}
