from fastapi import FastAPI, UploadFile, File
import torch

from models.mert_loader import load_audio_model
from models.nima_clip_loader import load_image_model

app = FastAPI()

audio_processor, audio_model = load_audio_model()
image_processor, image_model = load_image_model()

@app.get('/')
def health():
    return {'status': 'ok'}

@app.post('/predict/audio')
async def audio(file: UploadFile = File(...)):
    data = await file.read()
    inputs = audio_processor(data, return_tensors='pt')

    with torch.no_grad():
        score = audio_model(inputs['input_values'])

    return {'score': float(score.item())}

@app.post('/predict/image')
async def image(file: UploadFile = File(...)):
    data = await file.read()
    inputs = image_processor(images=data, return_tensors='pt')

    with torch.no_grad():
        score = image_model(inputs['pixel_values'])

    return {'score': float(score.item())}
