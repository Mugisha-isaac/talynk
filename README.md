# Talynk

Talynk is a full-stack platform that connects East African creative professionals with sponsors through sector-based media classification and fairness-aware recommendation. Talents upload their creative work, the system classifies it automatically, and sponsors discover relevant creators through an equitable recommendation engine.

GitHub Repository: https://github.com/Mugisha-isaac/talynk

Demo Video Url: [https://www.bugufi.link/SfcDo_](https://www.bugufi.link/SfcDo_)

---

## Live Deployments

| Component | URL |
|---|---|
| Frontend (Next.js app) | https://talynk-woad.vercel.app/ |
| ML service (FastAPI, Swagger docs) | https://talynk.onrender.com/docs |
| Model service (Hugging Face Space — MERT/CLIP/NIMA inference) | https://huggingface.co/spaces/isaacm26/talynk-ml-engine |

---

## Description

The creative economy in East Africa faces a structural visibility gap. talented creators lack the infrastructure to reach sponsors and opportunity at scale. Talynk addresses this by providing a platform where creators upload portfolio media, an ML pipeline scores and classifies the content by sector, and a fairness-constrained recommendation engine surfaces those creators to sponsors in an equitable way.

The system is built across three layers:

- **`frontend/`** — a Next.js 14 fullstack application (TypeScript). All backend logic for this layer lives in Next.js API routes — there is no separate Node backend. It talks to PostgreSQL directly via Prisma, uses Cloudinary for media storage, and calls the ML service over HTTP for media scoring and recommendations.
- **`ml-service/`** — a FastAPI microservice (Python 3.11) that handles auth, media-quality evaluation requests, and sector-based recommendations. It does not run any PyTorch models itself — it stores results in its own PostgreSQL database and delegates inference over HTTP to a separate Hugging Face Space.
- **`ml-space/`** — the Hugging Face Space (Docker) that actually runs the models: MERT-v1-95M (audio quality) and CLIP ViT-B/32 + NIMA (image/video quality).

Each layer has its own database/storage — there is no shared Supabase or Redis instance between them. See each subproject's README for full detail: `frontend/README.md`, `ml-service/README.md`.

---

## Repository Structure

```
talynk/
  frontend/          Next.js 14 fullstack application (TypeScript) — talks to Postgres via Prisma
  ml-service/        FastAPI inference-orchestration microservice (Python 3.11) — its own Postgres
  ml-space/          Hugging Face Space — runs the MERT/CLIP/NIMA models
  docker-compose.yml Orchestrates frontend + ml-service for local development
  README.md          This file
```

---

## Environment Setup

### Prerequisites

- Docker Desktop (Engine 24+), for the Docker Compose path
- Node.js 18 or later
- Yarn
- Python 3.11 or later
- A PostgreSQL instance for the frontend (`DATABASE_URL`), and a separate one for the ML service — they do **not** share a database or schema
- A Cloudinary account (media storage for the frontend)

### 1. Clone the repository

```bash
git clone https://github.com/Mugisha-isaac/talynk
cd talynk
```

### 2. Configure environment variables

**Frontend** — copy `frontend/.env.example` to `frontend/.env.local` and fill in at least:

```dotenv
DATABASE_URL=postgresql://user:password@localhost:5432/talynk
JWT_SECRET_KEY=your-shared-secret        # must match ml-service's JWT_SECRET_KEY
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ML_SERVICE_URL=http://localhost:8000
ML_SERVICE_ADMIN_USERNAME=admin           # must match ml-service's ML_DEFAULT_ADMIN_USERNAME
ML_SERVICE_ADMIN_PASSWORD=admin           # must match ml-service's ML_DEFAULT_ADMIN_PASSWORD
```

See `frontend/README.md` for the full variable reference (auth, ML integration, and a few legacy/unused variables that are safe to leave unset).

**ML service** — create `ml-service/.env`:

```dotenv
JWT_SECRET_KEY=your-shared-secret         # must match the frontend's JWT_SECRET_KEY exactly
DATABASE_URL=postgresql://talynk_admin:password@127.0.0.1:5433/talynk_ml_metadata
HF_SPACE_URL=https://<your-hf-username>-talynk-ml-engine.hf.space
ML_DEFAULT_ADMIN_USERNAME=admin
ML_DEFAULT_ADMIN_PASSWORD=admin
ML_DEFAULT_ADMIN_SECTOR=music
```

`JWT_SECRET_KEY` must match the frontend's exactly, since the ML service verifies JWTs signed by the frontend using the same secret and algorithm.

### 3. Model service (Hugging Face Space)

The actual PyTorch models (MERT for audio, CLIP+NIMA for image/video) run in the separate `ml-space/` Hugging Face Space, not in `ml-service/`. For local development you can point `HF_SPACE_URL` at the deployed Space (https://huggingface.co/spaces/isaacm26/talynk-ml-engine) instead of running it yourself — see `ml-service/README.md` for details on the split.

### 4. Run the full stack

```bash
docker compose up --build
```

This brings up `frontend` and `ml-service` (plus Postgres). Or run services individually:

```bash
# Frontend
cd frontend
yarn install
yarn prisma:generate
yarn prisma:migrate
yarn prisma:seed
yarn dev

# ML service
cd ml-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Local Service URLs

| Service     | URL                       |
|-------------|---------------------------|
| Frontend    | http://localhost:3000      |
| ML service  | http://localhost:8000      |
| ML API docs | http://localhost:8000/docs |

For the hosted equivalents, see [Live Deployments](#live-deployments) above.

### Running Tests

```bash
# Frontend (Jest + React Testing Library)
cd frontend
npm test

# ML service (pytest)
cd ml-service
source venv/bin/activate   # if not already active
pip install -r requirements-dev.txt
pytest
```

Neither suite touches a real database, Postgres, or the Hugging Face model
service — everything is mocked. See [`TESTING.md`](./TESTING.md) for what's
covered and how to extend it.

---

## Designs

<img width="2720" height="2880" alt="talynk_system_architecture_updated" src="https://github.com/user-attachments/assets/128bf0ea-d747-445a-8ec1-a71b06aebe00" />


### Architecture Diagram

The system is split into three deployable pieces, each with its own data store:

```
[ Next.js Frontend ]                      (Vercel)
  - Creator Dashboard
  - Sponsor Discovery Interface
  - Upload Page
  - Talent / Sponsor directories
  - All backend logic as Next.js API routes
        |                    |
        | Prisma             | HTTP + JWT
        v                    v
[ PostgreSQL ]        [ FastAPI ML Service ]         (Render)
  - users               - auth (JWT issuance)
  - creators            - evaluate audio/image/video
  - content items        (persists results, no models here)
  - interactions        - sector-top-five recommendations
  - recommendations      - Fairlearn ThresholdOptimizer post-processing
        ^                    |          ^
        |                    | HTTP     |
[ Cloudinary ]                v          |
  (audio/video/image    [ Model Service ]   (Hugging Face Space)
   storage for the         - MERT-v1-95M (audio quality)
   frontend)                - CLIP ViT-B/32 + NIMA (image/video quality)
                                    |
                             [ PostgreSQL ]
                          (ml-service's own DB —
                           evaluations, ml-service users)
```

The frontend and ML service each own a separate PostgreSQL database — there is no shared database, and no Redis in the current deployment. Caching in the ML service is an in-process, in-memory TTL cache instead.

###  Designs and App Screenshots
 


---

## Deployment Plan

The three components are deployed independently, each to the platform best suited to it, rather than as a single Docker Compose stack. `docker-compose.yml` is kept for local development only.

### Target Environment

| Component | Platform | Notes |
|---|---|---|
| `frontend/` | [Vercel](https://vercel.com) | Next.js 14, connected to its own managed PostgreSQL |
| `ml-service/` | [Render](https://render.com) | Docker web service + managed Postgres, defined in `ml-service/render.yaml` |
| `ml-space/` | [Hugging Face Spaces](https://huggingface.co/spaces) (Docker SDK) | Runs MERT/CLIP/NIMA inference; sleeps after inactivity on the free CPU tier |

### Live URLs

See [Live Deployments](#live-deployments) at the top of this file.

### Steps

**1. Deploy the model service (`ml-space/`)**

Push `ml-space/` to a Hugging Face Space (Docker SDK). Note its callable subdomain — `https://<username>-<space-name>.hf.space` — this is what `ml-service` calls, not the `huggingface.co/spaces/...` page itself.

**2. Deploy the ML service (`ml-service/`)**

On Render: **New → Blueprint**, point at this repo (`ml-service/render.yaml`), which provisions a `starter`-plan Postgres instance and a `starter`-plan Docker web service. Set the `sync: false` environment variables manually in the dashboard: `JWT_SECRET_KEY`, `ML_DEFAULT_ADMIN_USERNAME`/`_PASSWORD`, and `HF_SPACE_URL` (pointed at the Space from step 1).

**3. Deploy the frontend (`frontend/`)**

On Vercel, import the repo with `frontend/` as the project root, provision/connect a PostgreSQL database, and set the environment variables from [Environment Setup](#environment-setup) above — in particular `JWT_SECRET_KEY` (must match the ML service's value from step 2) and `ML_SERVICE_URL` (the Render URL from step 2). Run `yarn prisma:migrate` (and `yarn prisma:seed` if desired) against the production database as part of the build or a one-off job.

**4. Verify end-to-end**

Confirm the frontend can reach the ML service (`ML_SERVICE_URL`), the ML service can reach the model service (`HF_SPACE_URL`), and that a test upload produces a real `visibility_score` rather than falling back to the frontend's local heuristic.

### Local Development

For local work, `docker compose up --build` still brings up `frontend` + `ml-service` + a local Postgres against your own `.env` files — see [Environment Setup](#environment-setup) above. `ml-space/` is not part of the compose file; point `HF_SPACE_URL` at the deployed Space instead of running the model service locally.


### UI Demo
<img width="1357" height="633" alt="image" src="https://github.com/user-attachments/assets/21e5fa02-6a20-458a-a1f6-3bdc6d6164a7" />

<img width="1358" height="671" alt="image" src="https://github.com/user-attachments/assets/36303dee-8a31-4ea6-af11-98d24541f051" />
<img width="1355" height="679" alt="image" src="https://github.com/user-attachments/assets/6445543b-8b4b-445d-a71c-db44f0e8d298" />
<img width="1343" height="665" alt="image" src="https://github.com/user-attachments/assets/cf39f68c-3bb5-4a3a-8598-2077dcad1b68" />
<img width="1352" height="687" alt="image" src="https://github.com/user-attachments/assets/0d1a1780-d0c2-4e93-b986-eb84c25e0031" />
<img width="1353" height="671" alt="image" src="https://github.com/user-attachments/assets/58c1b465-2ef2-4395-bb51-5dd13133f582" />
<img width="1353" height="679" alt="image" src="https://github.com/user-attachments/assets/12b686af-c216-442a-8729-5a49257f8b20" />

---

## Further Documentation

- `frontend/README.md` — frontend setup, data model, auth, ML integration, API routes, known issues, and troubleshooting
- `ml-service/README.md` — ML service setup, data model, the model-service split, fairness/recommendations design, deployment, and troubleshooting
- `ml-space/README.md` — Hugging Face Space configuration reference for the model service
- `TESTING.md` — how to run and extend the frontend and ML service test suites
