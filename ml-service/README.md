# Talynk — ML Service

The ML service is an asynchronous FastAPI microservice responsible for media quality scoring, fairness-constrained recommendation generation, and visibility scoring. It runs in a dedicated Docker container and communicates with the Next.js frontend over HTTP.

---

## Tech Stack

- Framework: FastAPI (Python 3.11)
- ML runtime: PyTorch
- Database driver: asyncpg (native asynchronous PostgreSQL)
- Cache: Redis 7
- Database: PostgreSQL 16
- Container: Docker

## Models

### MERT-v1-95M — Music Quality

Fine-tuned checkpoint trained on the Free Music Archive dataset plus local East African audio data. Exposed via `/api/v1/quality` for audio files.

### NIMA + CLIP — Visual Quality

NIMA head mounted on a CLIP/ResNet-50 backbone fine-tuned on the AADB aesthetic dataset. Scores images on a 0–100 aesthetic quality scale. Exposed via `/api/v1/quality` for image files.

### LightGCN — Collaborative Filtering

Graph-based collaborative filtering implemented with RecBole using a sparse user-item interaction matrix. Generates ranked recommendation lists per sponsor. Exposed via `/api/v1/recommendations`.

### Fairlearn — Fairness Post-processing

After LightGCN ranking, a ThresholdOptimizer with demographic parity constraints re-ranks results to ensure equitable visibility across creator subgroups. Fairness metrics are available via `/api/v1/fairness`.

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Service health check |
| POST | `/api/v1/recommendations` | Generate ranked recommendations for a sponsor |
| POST | `/api/v1/quality` | Score media quality (audio or image) |
| GET | `/api/v1/fairness` | Retrieve fairness audit metrics |
| GET | `/docs` | Swagger UI |

## Project Structure

```
ml-service/
  app/
  middleware/       Authentication and request validation
  models/           PyTorch model definitions and checkpoint loaders
  routes/           FastAPI router modules
  scripts/          Utility and data-preparation scripts
  notebook/         Exploratory analysis notebooks
  main.py           Application entrypoint
  config.py         Settings loaded from environment
  requirements.txt  Python dependencies
  Dockerfile
  .env              Local environment variables (not committed)
```

## Setup

### 1. Create a virtual environment

```bash
cd ml-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment

Create a `.env` file in the `ml-service` directory:

```
JWT_SECRET_KEY=your-shared-nextauth-jwt-secret
DATABASE_URL=postgresql://talynk_admin:password@127.0.0.1:5433/talynk_ml_metadata
REDIS_URL=redis://127.0.0.1:6379/0
```

`JWT_SECRET_KEY` must match `NEXTAUTH_SECRET` in `frontend/.env.local` exactly so that tokens issued by NextAuth can be validated by the ML service middleware.

### 3. Model checkpoints

Place the following checkpoint files in the `models/` directory before starting the service:

- `nima_clip_head.pt` — NIMA visual quality head
- `mert_quality_head.pt` — MERT audio quality head

### 4. Run with Docker Compose (recommended)

```bash
docker compose up ml-service --build
```

### 5. Run locally

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Database Initialisation

The service initialises its own schema programmatically on startup using asyncpg. No manual SQL execution or Docker volume mounts are required. The `init.sql` file in the repository root is provided for reference only.

## Caching Strategy

Quality scores and recommendation outputs are cached in Redis with a short TTL. This avoids redundant inference on frequently accessed content while ensuring updated content or re-trained models are reflected within the TTL window. The cache is bypassed automatically if Redis is unreachable, allowing the service to degrade gracefully.

## Fairness Design

The Fairlearn ThresholdOptimizer is applied as a post-processing step after LightGCN scoring. It adjusts the recommendation threshold per demographic group so that each group achieves equal positive prediction rates (demographic parity). Audit metrics including group-level exposure rates and disparity ratios are logged and surfaced through `/api/v1/fairness` for transparency.

## Troubleshooting

**Service fails to start** — Confirm that PostgreSQL and Redis are reachable at the addresses in `.env`. The service logs connection errors with the host and port it attempted.

**Model checkpoint not found** — Ensure both `.pt` files are present in `models/` before starting. The application raises a descriptive error on startup if a checkpoint is missing.

**JWT validation errors** — Verify that `JWT_SECRET_KEY` in `ml-service/.env` matches `NEXTAUTH_SECRET` in `frontend/.env.local` exactly, including any trailing whitespace.
