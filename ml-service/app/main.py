from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import recommendations, quality, fairness, health

app = FastAPI(
    title="Talynk ML Service",
    description="FastAPI service for Music Quality, Visual Quality, and Fair Recommendations",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for communication with the Next.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(quality.router, prefix="/api/v1", tags=["Quality Evaluation"])
app.include_router(recommendations.router, prefix="/api/v1", tags=["Recommendations"])
app.include_router(fairness.router, prefix="/api/v1", tags=["Fairness Re-ranking"])


@app.get("/")
async def root():
    return {"message": "Talynk ML Service is running. Access API docs at /docs"}
