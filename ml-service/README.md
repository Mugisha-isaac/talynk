# Talynk — ML Service

The ML service is a FastAPI microservice that handles authentication, media
quality evaluation, and sector-based content recommendations for Talynk. It
does **not** run any PyTorch models itself — inference is delegated over
HTTP to a separate Hugging Face Space, which keeps this service lightweight
enough to run on a small Render instance.

```
┌──────────────┐        ┌──────────────────┐        ┌─────────────────────────┐
│   Frontend   │ ─────▶ │   ML Service      │ ─────▶ │  Model Service           │
│  (Next.js)   │  JWT   │  (FastAPI/Render) │  HTTP  │  (Hugging Face Space)    │
└──────────────┘        └────────┬─────────┘        │  MERT + CLIP/NIMA, torch │
                                  │                  └─────────────────────────┘
                                  ▼
                          ┌───────────────┐
                          │  PostgreSQL   │
                          └───────────────┘
```

---

## Tech Stack

- **Framework:** FastAPI (Python 3.11), served by Uvicorn
- **Database driver:** asyncpg (native async PostgreSQL, no ORM)
- **Database:** PostgreSQL
- **Cache:** in-process, in-memory (see [Caching Strategy](#caching-strategy)) — no Redis dependency
- **Auth:** JWT (HS256), shared secret with the Next.js/NextAuth frontend
- **Model inference:** offloaded to a separate Docker-based Hugging Face Space (see [Model Service](#model-service))
- **Deployment:** Render (Docker web service + managed Postgres), defined in `render.yaml`

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | Health check |
| POST | `/api/v1/auth/register` | — | Create an account (`email`, `password`, `sector`) |
| POST | `/api/v1/auth/login` | — | Log in, returns a JWT valid for 24h |
| POST | `/api/v1/audio/evaluate` | Bearer JWT | Score an audio file, record the result |
| POST | `/api/v1/image/evaluate` | Bearer JWT | Score an image file, record the result |
| POST | `/api/v1/video/evaluate` | Bearer JWT | Score a video (by upload or `file_url`), record the result |
| POST | `/api/v1/recommendations/sector-top-five` | Bearer JWT | Top 5 highest-scoring evaluations for a sector, each annotated with a fairness-adjusted `visibility_approved` flag |
| POST | `/api/v1/fairness/rerank` | Bearer JWT | Re-run demographic-parity fairness re-ranking on an arbitrary set of recommendations |
| GET | `/api/v1/fairness/status` | — | Reports whether the Fairlearn optimizer weights loaded successfully |
| GET | `/docs` | — | Swagger UI |

All three `*/evaluate` routes take the same shape as multipart form data:

| Field | Required | Description |
|---|---|---|
| `file` | yes | The audio/image/video file (video also accepts `file_url` instead) |
| `sector` | yes | The content sector this evaluation belongs to |
| `talent_id` | no | The Talynk creator ID to attribute the evaluation to. Falls back to the JWT's own user ID if omitted — the JWT identifies the *caller* (usually a service account), which isn't always the same as the content owner. |

Each evaluate route calls out to the [Model Service](#model-service), converts
the returned `0–1` score to a `0–100` `visibility_score`, writes a row to
`platform_media_evaluations`, and invalidates that sector's cached top-5 list.

> **Note:** Fairness re-ranking is live in two places — embedded directly in
> `sector-top-five`, and as a standalone `/api/v1/fairness/rerank` endpoint
> for re-ranking an arbitrary recommendation list. See
> [Recommendations & Fairness](#recommendations--fairness) for how each one
> works and the caveats that apply to both.

## Data Model

Schema lives in `init.sql` and is applied programmatically on startup (see
[Database Initialization](#database-initialization)) — no separate migration
step is needed.

**`platform_users`**

| Column | Type | Notes |
|---|---|---|
| `user_id` | `SERIAL PRIMARY KEY` | |
| `email` | `VARCHAR(150) UNIQUE NOT NULL` | login identity |
| `password_hash` | `VARCHAR(255) NOT NULL` | bcrypt |
| `sector` | `VARCHAR(50) NOT NULL` | |
| `created_at` | `TIMESTAMPTZ` | defaults to `NOW()` |

**`platform_media_evaluations`**

| Column | Type | Notes |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` | |
| `user_id` | `VARCHAR(100) NOT NULL` | creator this evaluation is attributed to |
| `sector` | `VARCHAR(50) NOT NULL` | indexed (`idx_media_sector`) |
| `media_type` | `VARCHAR(10) NOT NULL` | `'audio'`, `'image'`, or `'video'` |
| `visibility_score` | `NUMERIC(5,2) NOT NULL` | `0–100` |
| `created_at` | `TIMESTAMPTZ` | defaults to `NOW()` |

## Model Service

PyTorch and `transformers` don't live in this service — they run in a
separate Hugging Face Space (`talynk-ml-engine`), a Docker Space that wraps
two fine-tuned models behind a small FastAPI app:

- **MERT-v1-95M + fine-tuned head** — audio quality → `/predict/audio`
- **CLIP ViT-B/32 + NIMA head** — image quality → `/predict/image`, and video quality (scored on the middle extracted frame) → `/predict/video`

`app/services/hf_client.py` is the only thing in this service that talks to
it — a thin `requests`-based wrapper with one static method per media type.
Splitting inference out this way keeps this service on Render's `starter`
plan instead of needing enough RAM to hold two transformer models in memory.

The Space sleeps after inactivity on the free CPU tier, so the first request
after idling will be noticeably slower (both base models re-download from
the Hugging Face Hub on cold start).

## Recommendations & Fairness

`POST /api/v1/recommendations/sector-top-five` is a straightforward
`ORDER BY visibility_score DESC LIMIT 5` query against
`platform_media_evaluations` for the given sector, media-type-agnostic —
audio, image, and video evaluations are all eligible.

Results are passed through a Fairlearn `ThresholdOptimizer` (unpickled once
at import time from `app/models/weights/fairlearn_threshold_optimizer.pkl`)
to attach a `visibility_approved` boolean per candidate. If the pickle can't
be loaded for any reason, the route degrades gracefully — every candidate is
simply marked approved rather than the request failing. This is the path the
frontend actually consumes (`getSectorRecommendations()` in
`frontend/src/lib/ml-service.ts`); the UI reads `visibility_approved` off
each recommendation directly.

`POST /api/v1/fairness/rerank` runs the same `ThresholdOptimizer` against a
caller-supplied list of recommendations instead of a database query, and
returns each item annotated with `fairness_approved`, `demographic_group`,
and an estimated gap-reduction figure. It is registered and tested
independently of `sector-top-five`, but nothing in the frontend calls it yet
— it exists as a standalone fairness API for future use (e.g. re-ranking a
recommendation set assembled from another source). `GET /api/v1/fairness/status`
reports whether the optimizer weights loaded successfully, which is useful
for confirming a deployment has the `.pkl` file in place.

**Sensitive-feature caveat (both mechanisms):** neither route has access to
real creator demographic data. `sector-top-five` and `/fairness/rerank`
(when `sensitive_features` isn't supplied in the request body) both generate
a random 0/1 demographic label per candidate with `np.random.choice` purely
to satisfy the `ThresholdOptimizer.predict()` call signature. The
`visibility_approved`/`fairness_approved` flags and gap-reduction estimate
this produces are consequently not a real fairness measurement against any
actual protected attribute — they demonstrate the mechanism, not a
production-grade equity guarantee. Wiring in real, consented demographic
data (per `frontend`'s privacy/terms copy, which already describes this
intent) is necessary before the gap-reduction numbers mean anything.

## Caching Strategy

There's no Redis. `app/lib/cache.py` is a per-process, in-memory dict with a
TTL, used only for the `sector-top-five` results (5-minute TTL, invalidated
immediately whenever a new evaluation is recorded for that sector). This
trades cross-instance/cross-restart caching for zero extra infrastructure,
which is a reasonable trade for a single-instance deployment — if this ever
runs as more than one Render instance, this cache stops being consistent
across them and should be swapped for a real shared cache.

## Project Structure

```
ml-service/
  app/
    main.py              Application entrypoint, router registration, DB bootstrap
    middleware/
      auth.py            JWT verification (Bearer token → request.state.user_id)
    services/
      hf_client.py        HTTP client for the Model Service (see above)
    lib/
      cache.py            In-memory TTL cache
    routes/
      auth.py              /api/v1/auth/register, /login
      audio_quality.py     /api/v1/audio/evaluate
      image_quality.py     /api/v1/image/evaluate
      video_quality.py     /api/v1/video/evaluate
      recommendations.py   /api/v1/recommendations/sector-top-five
      fairness.py          /api/v1/fairness/rerank, /api/v1/fairness/status
      health.py            /health
    models/
      weights/
        fairlearn_threshold_optimizer.pkl   Used by recommendations.py
    scripts/
      train_mert.py        Legacy training script — see Known Issues below
  init.sql               Schema, applied programmatically on startup
  requirements.txt
  Dockerfile
  render.yaml            Render Blueprint (Postgres + this service)
  .env                   Local environment variables (not committed)
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

```dotenv
JWT_SECRET_KEY=your-shared-nextauth-jwt-secret
DATABASE_URL=postgresql://talynk_admin:password@127.0.0.1:5433/talynk_ml_metadata
HF_SPACE_URL=https://<your-hf-username>-talynk-ml-engine.hf.space
ML_DEFAULT_ADMIN_USERNAME=admin
ML_DEFAULT_ADMIN_PASSWORD=admin
ML_DEFAULT_ADMIN_SECTOR=music

# Local-dev-only — see Troubleshooting. Never set this in production.
# HF_SPACE_SSL_VERIFY=false
```

| Variable | Required | Notes |
|---|---|---|
| `JWT_SECRET_KEY` | yes | Must exactly match `NEXTAUTH_SECRET` in `frontend/.env.local` |
| `DATABASE_URL` | yes | Standard `postgresql://` connection string |
| `HF_SPACE_URL` | yes | The Space's **`.hf.space` subdomain**, not its `huggingface.co/spaces/...` page (see Troubleshooting) |
| `ML_DEFAULT_ADMIN_USERNAME` / `_PASSWORD` / `_SECTOR` | no | Seeds a default admin user on first startup if one doesn't already exist |
| `HF_SPACE_SSL_VERIFY` | no | Set to `false` only to work around a local TLS-intercepting proxy — never in a real deployment |

### 3. Run locally

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Run with Docker

```bash
docker build -t talynk-ml-service .
docker run --env-file .env -p 8000:8000 talynk-ml-service
```

## Running Tests

Tests use pytest + FastAPI's `TestClient`. `asyncpg.connect` and `HFClient`
are patched per-test with fakes (see `tests/conftest.py`), so no real
Postgres or Hugging Face Space connection is required.

```bash
pip install -r requirements-dev.txt
pytest
```

See [`../TESTING.md`](../TESTING.md) for what's currently covered.

## Database Initialization

The service applies `init.sql` programmatically via asyncpg on startup — no
manual `psql` step, migration tool, or Docker volume mount is required. It
retries the connection a few times on startup to tolerate Postgres starting
up slightly after the app does. A default admin user is also created at
startup if `ML_DEFAULT_ADMIN_USERNAME` doesn't already exist.

## Deployment

`render.yaml` defines a Render Blueprint: a `starter`-plan Postgres instance
and a `starter`-plan Docker web service for this app (torch lives entirely
in the separate Space, so this service doesn't need a RAM-heavy plan). Push
to GitHub, then in Render: **New → Blueprint**, point at the repo, and set
the `sync: false` environment variables (`JWT_SECRET_KEY`,
`ML_DEFAULT_ADMIN_USERNAME`/`_PASSWORD`, `HF_SPACE_URL`) manually in the
dashboard, since they aren't committed to the repo.

The Model Service (`ml-space/`) deploys separately, directly to its Hugging
Face Space — see that directory's own README.

## Known Issues / TODO

- **`tests/test_fairness.py` posts to the wrong path.** It calls
  `POST /api/v1/fairness` instead of `POST /api/v1/fairness/rerank`, so it
  currently fails with a 404 even though the endpoint itself works correctly
  when called at the right path (verified manually and exercised indirectly
  via `sector-top-five`'s tests). Fix the URL in the test rather than the
  route.
- **Sensitive features are mocked, not real**, in both `sector-top-five` and
  `/fairness/rerank` when no `sensitive_features` are supplied — see the
  caveat in [Recommendations & Fairness](#recommendations--fairness). This
  needs real, consented demographic data before the fairness metrics are
  meaningful.
- **`app/scripts/train_mert.py`** imports `app.models.mert_loader`, which no
  longer exists in this service — the MERT model code now lives in
  `ml-space/`. This script needs to be moved there (or updated to import
  from wherever the training pipeline actually lives) before it'll run again.

## Troubleshooting

**`ImportError` on startup, or a route works locally but 404s/500s
unexpectedly** — Check `app/main.py`'s `include_router` calls against each
route file's `APIRouter(prefix=...)`. Two routers registered at the same
path will silently shadow each other; only the first one registered ever
gets called (this bit both `audio_quality.py` and `image_quality.py` before
they were given distinct `/audio` and `/image` prefixes).

**`ModuleNotFoundError: No module named 'email_validator'`** — Pydantic's
`EmailStr` (used in `auth.py`) needs `email-validator` as an optional
dependency; it's in `requirements.txt`, so this only happens if your `venv`
predates that addition. `pip install email-validator` fixes it immediately.

**`Video/Audio/Image processing failure: Expecting value: line 1 column 1
(char 0)`** — `HFClient` got a non-JSON response back, almost always because
`HF_SPACE_URL` points at the Space's `huggingface.co/spaces/...` webpage
instead of its callable `https://<user>-<space>.hf.space` subdomain.

**`SSLError` / `CERTIFICATE_VERIFY_FAILED` / `self-signed certificate in
certificate chain`** — A TLS-intercepting proxy (common on corporate
networks) is swapping in its own certificate for `huggingface.co`. Proper
fix: export that proxy's root CA and point `REQUESTS_CA_BUNDLE` at it.
Local-only workaround: set `HF_SPACE_SSL_VERIFY=false` — never in a real
deployment, since it disables certificate verification entirely.

**JWT validation errors** — Verify `JWT_SECRET_KEY` in `ml-service/.env`
matches `NEXTAUTH_SECRET` in `frontend/.env.local` exactly, including
whitespace.

**Service fails to start / can't reach Postgres** — Confirm `DATABASE_URL`
is reachable from wherever the service is running; the retry loop in
`init_db_schema()` logs each connection attempt with the error it hit.