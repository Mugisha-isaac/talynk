from fastapi import FastAPI
from app.routes import audio_quality, video_quality, recommendations

app = FastAPI(
    title="Talynk AI/ML Core Inference Service",
    description="Production pipeline handling media quality ranking and fair recommendation distribution.",
    version="2.0.0",
    docs_url="/docs",
)

app.include_router(audio_quality.router, prefix="/api/v1")
app.include_router(video_quality.router, prefix="/api/v1")
app.include_router(recommendations.router, prefix="/api/v1")


@app.get("/health", tags=["System Verification"])
async def runtime_health_status():
    return {
        "status": "healthy",
        "database_target": "native-postgres-container",
        "cache_target": "native-redis-container",
    }
