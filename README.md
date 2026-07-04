# Talynk

Talynk is a full-stack platform that connects East African creative professionals with sponsors through sector-based media classification and fairness-aware recommendation. Talents upload their creative work, the system classifies it automatically, and sponsors discover relevant creators through an equitable recommendation engine.

GitHub Repository: https://github.com/Mugisha-isaac/talynk


Demo Video Url: https://www.veed.io/view/fcd6ccf9-7df2-4561-8474-e52cc0f2882b?source=editor&panel=share

---

## Description

The creative economy in East Africa faces a structural visibility gap. talented creators lack the infrastructure to reach sponsors and opportunity at scale. Talynk addresses this by providing a platform where creators upload portfolio media, an ML pipeline scores and classifies the content by sector, and a fairness-constrained recommendation engine surfaces those creators to sponsors in an equitable way.

The system is built across three layers: a Next.js 14 fullstack frontend, a FastAPI machine-learning inference microservice, and a shared data layer built on Supabase PostgreSQL, Supabase Storage, and Redis.

---

## Repository Structure

```
talynk/
  frontend/          Next.js 14 fullstack application (TypeScript)
  ml-service/        FastAPI inference microservice (Python 3.11)
  docker-compose.yml Orchestrates all services
  init.sql           Shared database initialisation
  README.md          This file
```

---

## Environment Setup

### Prerequisites

- Docker Desktop (Engine 24+)
- Node.js 18 or later
- Yarn 4.0.0
- Python 3.11 or later
- A Supabase project (PostgreSQL + Auth + Storage)

### 1. Clone the repository

```bash
git clone https://github.com/Mugisha-isaac/talynk
cd talynk
```

### 2. Configure environment variables

**Frontend** — create `frontend/.env.local`:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
HUGGINGFACE_API_KEY=optional
```

**ML service** — create `ml-service/.env`:

```
JWT_SECRET_KEY=your-shared-nextauth-jwt-secret
DATABASE_URL=postgresql://talynk_admin:password@127.0.0.1:5433/talynk_ml_metadata
REDIS_URL=redis://127.0.0.1:6379/0
```

`JWT_SECRET_KEY` must match `NEXTAUTH_SECRET` exactly.

### 3. Supabase storage buckets

Create the following public buckets in your Supabase project:

- `portfolio` — talent portfolio assets
- `avatars` — user profile images
- `logos` — sponsor company logos

### 4. Place ML model checkpoints

Copy the following files into `ml-service/models/`:

- `nima_clip_head.pt`
- `mert_quality_head.pt`

### 5. Run the full stack

```bash
docker compose up --build
```

Or run services individually:

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
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Service URLs

| Service     | URL                       |
|-------------|---------------------------|
| Frontend    | http://localhost:3000      |
| ML service  | http://localhost:8000      |
| ML API docs | http://localhost:8000/docs |

---

## Designs

<img width="2720" height="2880" alt="talynk_system_architecture_updated" src="https://github.com/user-attachments/assets/128bf0ea-d747-445a-8ec1-a71b06aebe00" />


### Architecture Diagram

The system follows a three-tier architecture:

```
[ Next.js Frontend ]
  - Creator Dashboard
  - Sponsor Discovery Interface
  - Upload Page
  - Analytics Dashboard
  - Transparency Panel
        |
        | HTTP
        v
[ FastAPI ML Service ]
  - MERT-v1-95M    (music quality scoring)
  - NIMA + CLIP    (visual quality scoring)
  - LightGCN       (collaborative filtering recommendations)
  - Fairlearn      (fairness post-processing / demographic parity)
        |
        v
[ Data Layer ]
  - Supabase PostgreSQL  (users, content, interactions, recommendations)
  - Supabase Storage     (audio, video, images)
  - Redis Cache          (quality scores, recommendation outputs, short TTL)
```

###  Designs and App Screenshots
 


---

## Deployment Plan

### Target Environment

The application is designed to be deployed as three Docker containers managed by Docker Compose, suitable for a single VPS or a container orchestration platform such as Railway, Render, or a self-hosted Ubuntu server.

### Services

| Service      | Image / Runtime         | Port |
|--------------|-------------------------|------|
| frontend     | Node.js 18 / Next.js    | 3000 |
| ml-service   | Python 3.11 / Uvicorn   | 8000 |
| postgres     | PostgreSQL 16 Alpine    | 5433 |
| redis        | Redis 7 Alpine          | 6379 |

### Steps

**1. Provision a server**

A Ubuntu 22.04 VPS with a minimum of 4 GB RAM and 2 vCPUs is recommended given the ML model inference requirements.

**2. Install Docker and Docker Compose**

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
```

**3. Clone the repository and configure environment files**

```bash
git clone https://github.com/Mugisha-isaac/talynk
cd talynk
# Create frontend/.env.local and ml-service/.env as documented above
```

**4. Copy model checkpoints to ml-service/models/**

**5. Build and start all containers**

```bash
docker compose -f docker-compose.yml up -d --build
```

**6. Run database migrations**

```bash
docker compose exec frontend yarn prisma:migrate
docker compose exec frontend yarn prisma:seed
```

**7. Configure a reverse proxy (optional)**

Use Nginx or Caddy to terminate HTTPS and proxy:
- `yourdomain.com` → port 3000 (frontend)
- `api.yourdomain.com` → port 8000 (ml-service)

### CI/CD

A GitHub Actions workflow can be configured to build and push Docker images on each push to `main`, then SSH into the server to pull and restart containers. A sample workflow file is located at `.github/workflows/deploy.yml`.


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

- `frontend/README.md` — frontend setup, project structure, API routes, and troubleshooting
- `ml-service/README.md` — ML service setup, model details, fairness design, and API reference
