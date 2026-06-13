from fastapi import FastAPI

# Import all routers, including the new auth module
from app.routes import (
    auth,
    audio_quality,
    image_quality,
    video_quality,
    recommendations,
)

app = FastAPI(
    title="Talynk AI/ML Core Inference Service",
    description="Production pipeline handling native user authorization, quality rankings, and fair recommendations.",
    version="2.1.0",
    docs_url="/docs",
)

# Mount Auth first so it sits cleanly at the top of your documentation
app.include_router(auth.router, prefix="/api/v1")
app.include_router(audio_quality.router, prefix="/api/v1")
app.include_router(image_quality.router, prefix="/api/v1")
app.include_router(video_quality.router, prefix="/api/v1")
app.include_router(recommendations.router, prefix="/api/v1")


@app.get("/health", tags=["System Verification"])
async def runtime_health_status():
    return {
        "status": "healthy",
        "database_target": "native-postgres-container",
        "cache_target": "native-redis-container",
    }
