# Talynk

Talynk is a full-stack platform that connects creative professionals with sponsors through sector-based media classification and fairness-aware recommendation. The system consists of three layers: a Next.js frontend, a FastAPI machine-learning inference service, and a shared data layer built on Supabase PostgreSQL, Redis, and Supabase Storage.

---

## Repository Structure

```
talynk/
  frontend/          Next.js 14 fullstack application (TypeScript)
  ml-service/        FastAPI inference microservice (Python 3.11)
  docker-compose.yml Orchestrates all services
  init.sql           Shared database initialisation
```

## Architecture Overview

The frontend serves both the UI and its own API routes (`/api/recommendations`, `/api/upload`, `/api/quality`, `/api/analytics`). It delegates all ML inference to the ml-service over HTTP. Authentication is handled by NextAuth with a Supabase JWT backend.

The ml-service runs in a separate Docker container, exposing a FastAPI router at `/api/v1/`. It integrates fine-tuned models for music quality (MERT-v1-95M), visual quality (NIMA + CLIP), and collaborative filtering recommendations (LightGCN via RecBole). A Fairlearn post-processing layer applies demographic parity constraints before recommendations are returned.

Supabase PostgreSQL stores users, content metadata, interaction logs, and recommendation outputs. Supabase Storage holds audio, video, and image assets. Redis caches quality scores and recommendation outputs with a short TTL.

## Prerequisites

- Docker Desktop (Engine 24+)
- Node.js 18 or later with Yarn 4.0.0
- Python 3.11 or later
- A Supabase project (PostgreSQL + Auth + Storage)

## Environment Variables

Create `.env.local` in `frontend/` and `.env` in `ml-service/`. The required keys are documented in each service's README and in the respective `.env.example` files.

## Running the Stack

### Development

```bash
# Start all services
docker compose up --build

# Frontend only
cd frontend && yarn dev

# ML service only
cd ml-service && uvicorn main:app --reload
```

### Production

```bash
docker compose -f docker-compose.yml up -d
```

## Service URLs

| Service     | URL                       |
|-------------|---------------------------|
| Frontend    | http://localhost:3000      |
| ML service  | http://localhost:8000      |
| ML API docs | http://localhost:8000/docs |

## Further Documentation

Each sub-directory contains a dedicated README covering setup, environment configuration, project structure, and API reference. Start with `frontend/README.md` for UI development and `ml-service/README.md` for the inference service.
