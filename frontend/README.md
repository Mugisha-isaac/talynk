# Talynk — Frontend

The frontend is a Next.js 14 (App Router) application that serves the
public site, the talent/sponsor dashboards, and all backend logic for this
layer via Next.js API routes — there's no separate Node backend. It talks
to Postgres directly through Prisma and to the [ML service](../ml-service)
over HTTP for media scoring and recommendations.

```
┌────────────┐     ┌──────────────────────┐     ┌─────────────┐
│  Browser   │ ──▶ │  Next.js App Router   │ ──▶ │  PostgreSQL │
│            │     │  (pages + API routes) │     │  (Prisma)   │
└────────────┘     └──────────┬───────────┘     └─────────────┘
                               │           ┌─────────────┐
                               ├──────────▶│  Cloudinary │  (media storage)
                               │           └─────────────┘
                               │           ┌─────────────┐
                               └──────────▶│  ML Service │  (quality scoring,
                                           └─────────────┘   recommendations)
```

---

## Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **UI:** Tailwind CSS + Radix UI primitives (`shadcn/ui`-style `components/ui/`)
- **Database ORM:** Prisma, against PostgreSQL
- **Auth:** custom — **not** NextAuth, **not** Supabase Auth (see [Authentication](#authentication))
- **Media storage:** Cloudinary (**not** Supabase Storage — see [Known Issues](#known-issues--legacy-code))
- **Package manager:** Yarn

## Data Model

The Prisma schema (`prisma/schema.prisma`) models a **Creator / Audience**
platform, not the `Talent`/`Sponsor` naming you'll see in the UI and API
responses — those are an application-level vocabulary layered on top (see
below). The real models:

| Model | Purpose |
|---|---|
| `User` | Base account — `email`, `username`, `passwordHash`, `userType` (`CREATOR \| AUDIENCE \| ADMIN`) |
| `Creator` | A user's creator profile — `discipline`, `bio`, `followerCount`, `visibilityScoreCurrent` (cached average quality score) |
| `AudienceMember` | A user's audience-side profile — `preferences` (JSON; also where the `SPONSOR`/`FAN` distinction below is stored) |
| `ContentItem` | An uploaded piece of media — `contentType` (`AUDIO\|VIDEO\|IMAGE`), `discipline`, `mediaUrl`, `cloudinaryPublicId`, `status` |
| `QualityScore` | One-to-one with `ContentItem` — the ML-evaluated score, stored across several sub-fields (see [ML Integration](#ml-integration)) |
| `VisibilityScore` | Historical engagement + quality + fairness breakdown for a `Creator` |
| `Interaction` | View/like/share/comment/follow events, tied to `AudienceMember` |
| `Recommendation` | ML-generated recommendation linking an `AudienceMember` to a `ContentItem` |
| `Follow`, `Comment` | Self-explanatory |

**Talent / Sponsor is a UI-level concept, not a Prisma model.** `src/types/index.ts`
defines the `User`/`TalentProfile`/`Recommendation`/etc. shapes the UI and
API responses actually use, and code like `toUserRole()` in
`api/auth/login/route.ts` maps the underlying `userType` onto this
vocabulary:

| Prisma `userType` | Mapped `UserRole` |
|---|---|
| `CREATOR` | `TALENT` |
| `ADMIN` | `ADMIN` |
| `AUDIENCE` (with `preferences.accountRole === 'SPONSOR'`) | `SPONSOR` |
| `AUDIENCE` (otherwise) | `FAN` |

`src/lib/sectors.ts` is the single canonical mapping between the UI's
sector filter (`music`, `comedy`, `dance`, `sports`, `art`, `performance`,
`film`, `fashion`), the ML service's free-text `sector` string, and the
Prisma `Discipline` enum (`MUSIC \| VISUAL_ARTS \| COMEDY \| ATHLETICS \|
PERFORMING_ARTS`) — a `Discipline` can map to more than one sector id (e.g.
`VISUAL_ARTS` covers `art`, `film`, and `fashion`).

## Authentication

There is no NextAuth and no Supabase Auth in the live auth flow, despite
both being listed as dependencies. The actual flow:

1. `POST /api/auth/signup` / `POST /api/auth/login` verify credentials
   against `User.passwordHash` — hashed with Node's built-in `scrypt`
   (`src/lib/password.ts`), not bcrypt.
2. On success, a hand-rolled HS256 JWT (`src/lib/jwt.ts` — a from-scratch
   implementation, not a library) is signed and set as an `httpOnly`
   `talynk_token` cookie.
3. `src/hooks/useAuthUser.ts` reads the session via `GET /api/auth/session`
   (which decodes that cookie), not any Supabase client.
4. `src/lib/admin-auth.ts`'s `requireAdmin()` decodes the same cookie and
   checks `userType === 'ADMIN'` for every `/api/admin/*` route.

`JWT_SECRET_KEY` (falling back to `NEXTAUTH_SECRET`, then a hardcoded
default — see `getJwtSecret()`) **must match the ML service's
`JWT_SECRET_KEY` exactly**, since the ML service verifies JWTs signed here
using the same secret and algorithm.

## Media Upload Flow

`POST /api/media` (see `src/app/api/media/route.ts`):

1. Uploads the file directly to **Cloudinary** (`src/lib/cloudinary.ts`),
   under `talynk/<talentId>`. Audio and video both use Cloudinary's
   `video` resource type; only images use `image`.
2. Runs `classifyMediaLocally()` (`src/lib/classification.ts`) — a
   filename/MIME-type heuristic, not a real ML call — to get an initial
   sector guess.
3. Calls the ML service (`evaluateMediaQuality()` in `src/lib/ml-service.ts`)
   with the *Creator's* ID (not the uploader's session user ID — this
   matters if an admin or service account is uploading on a creator's
   behalf) to get a real `visibility_score`. If the ML service is
   unreachable, it falls back to the local heuristic's confidence score
   instead of failing the upload outright.
4. Persists a `ContentItem` + `QualityScore`, then recalculates and caches
   the creator's average `visibilityScoreCurrent`.

## ML Integration

`src/lib/ml-auth.ts` and `src/lib/ml-service.ts` are the only things that
talk to the ML service:

- `ensureMlServiceToken()` logs into the ML service as a shared service
  account (`ML_SERVICE_ADMIN_USERNAME`/`_PASSWORD`) and caches the JWT
  in memory, refreshing it ~60 seconds before expiry.
- `evaluateMediaQuality()` calls `POST {ML_SERVICE_URL}/api/v1/{audio|image|video}/evaluate`,
  passing the file plus the **creator's** ID as `talent_id` so the score
  gets attributed correctly rather than to the shared service account.
- `getSectorRecommendations()` calls
  `POST {ML_SERVICE_URL}/api/v1/recommendations/sector-top-five`.
- `<MlServiceBootstrapper />` (mounted somewhere in the root layout) fires
  `POST /api/ml/auth/bootstrap` on page load purely to warm the cached
  token before a user actually needs it.

## Environment Variables

```dotenv
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/talynk"

# Auth
JWT_SECRET_KEY=your-shared-secret       # MUST match ml-service's JWT_SECRET_KEY
NEXTAUTH_SECRET=your_nextauth_secret     # fallback if JWT_SECRET_KEY is unset — not actually NextAuth

# Cloudinary (media storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ML service
ML_SERVICE_URL=http://localhost:8000
ML_SERVICE_ADMIN_USERNAME=admin          # must match ml-service's ML_DEFAULT_ADMIN_USERNAME
ML_SERVICE_ADMIN_PASSWORD=admin          # must match ml-service's ML_DEFAULT_ADMIN_PASSWORD

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`.env.example` also lists `NEXT_PUBLIC_SUPABASE_*`,
`SUPABASE_SERVICE_ROLE_KEY`, `HUGGINGFACE_API_KEY`, and
`GOOGLE_VISION_API_KEY` — none of these are read by any code path currently
in use (see [Known Issues](#known-issues--legacy-code)). They're harmless
to leave unset.

## API Routes

| Method | Route | Notes |
|---|---|---|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Sets `talynk_token` cookie |
| POST | `/api/auth/logout` | Clears the cookie |
| GET | `/api/auth/session` | Current user from the cookie |
| GET | `/api/health` | Health check |
| POST, GET | `/api/media` | Upload / list a creator's content (see [Media Upload Flow](#media-upload-flow)) |
| POST | `/api/quality` | Score a single file without persisting a `ContentItem` (used outside the main upload flow) |
| GET, PATCH | `/api/recommendations` | List / update recommendation status for the current audience member |
| POST | `/api/ml/auth/bootstrap` | Pre-warm the cached ML-service token |
| GET, PATCH | `/api/profile` | Current user's profile |
| GET | `/api/users` | List users |
| POST | `/api/users` | Create a user |
| GET | `/api/talents` | List creators (talent directory) |
| POST | `/api/talents` | Create a creator profile |
| GET | `/api/talents/[id]` | Single creator profile |
| GET, POST | `/api/content/[id]/comments` | Comments on a `ContentItem` |
| GET, POST | `/api/content/[id]/interactions` | Views/likes/shares/follows |
| GET, POST | `/api/content/[id]/save` | Bookmark a `ContentItem` |
| GET, POST | `/api/admin/users`, `/api/admin/users/[id]` | Admin user management (`requireAdmin`) |
| GET, POST | `/api/admin/talents`, `/api/admin/talents/[id]` | Admin creator management |
| GET, POST | `/api/admin/sponsors`, `/api/admin/sponsors/[id]` | Admin sponsor management |

## Project Structure

```
frontend/
  prisma/
    schema.prisma        Source of truth for the data model
    seed.ts
  src/
    app/
      api/                All backend logic — see API Routes above
      admin/               Admin UI
      dashboard/           Talent/sponsor dashboards (see Known Issues re: duplicate trees)
      talents/             Talent directory + profile pages
      sponsors/            Sponsor directory + profile pages
      about/, profile/, settings/, sitemap/
    components/
      ui/                  Radix-based primitives (button, dialog, card, ...)
      cards/, common/, forms/, layout/, discovery/
      MediaUploadDialog.tsx, MlServiceBootstrapper.tsx, Navigation.tsx, ...
    hooks/
      useAuthUser.ts       Session state, logout, role checks
      useMedia.ts, useRecommendations.ts, useAuth.ts
    lib/
      prisma.ts             Prisma client singleton
      jwt.ts, password.ts   Hand-rolled JWT + scrypt password hashing
      auth-request.ts       Resolves a user ID from a request (JWT, header, or query param)
      admin-auth.ts          requireAdmin() guard for /api/admin/*
      cloudinary.ts          Media upload/delete
      ml-service.ts, ml-auth.ts   ML service HTTP client + token caching
      sectors.ts             Canonical sector ↔ Discipline ↔ ML-sector mapping
      classification.ts      Local heuristic classifier (HF API path is unused, see below)
      audience.ts             getOrCreateAudienceMemberId()
      supabase/                Present but effectively unused — see Known Issues
    types/index.ts          Shared TS types (Talent/Sponsor-vocabulary layer)
```

## Setup

### 1. Install dependencies

```bash
cd frontend
yarn install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in at least `DATABASE_URL`, `JWT_SECRET_KEY`, the `CLOUDINARY_*` trio,
and `ML_SERVICE_URL` (+ matching admin credentials) — see
[Environment Variables](#environment-variables).

### 3. Database setup

```bash
yarn prisma:generate
yarn prisma:migrate
yarn prisma:seed
```

### 4. Start the dev server

```bash
yarn dev
```

Available at http://localhost:3000. The ML service (see
`../ml-service/README.md`) needs to be running too for uploads and
recommendations to actually score anything — without it, uploads still
succeed via the local-heuristic fallback.

## Available Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start development server |
| `yarn build` | Compile for production |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn prisma:generate` | Regenerate Prisma client after schema changes |
| `yarn prisma:migrate` | Apply pending migrations |
| `yarn prisma:studio` | Open Prisma Studio |
| `yarn prisma:seed` | Seed initial sector/discipline data |
| `yarn test` | Run the Jest test suite once |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:coverage` | Run tests with a coverage report |

## Running Tests

Tests use Jest + React Testing Library, configured via `next/jest` so they
run against the same TypeScript/path-alias setup (`@/*`) as the app itself.

```bash
yarn test
```

No dev server, database, or ML service needs to be running — `fetch` and
`XMLHttpRequest` calls are mocked per-test. Test files live alongside their
subject in `__tests__/` folders (e.g. `src/hooks/__tests__/useMedia.test.ts`).
See [`../TESTING.md`](../TESTING.md) for what's currently covered.

## Known Issues / Legacy Code

- **`app/dashboard/page.tsx` uses `supabase.auth.getUser()`** to decide
  whether to redirect to `/dashboard/talent` or `/auth/login`. Nothing else
  in the app creates a Supabase Auth session — login sets a `talynk_token`
  cookie instead — so this call will effectively always return no user,
  and this route will redirect logged-in users back to login. Worth fixing
  to check the same cookie/session the rest of the app uses
  (`GET /api/auth/session`).
- **`useAuthUser().updateProfile()` calls `PUT /api/users/[user.id]`**,
  but no such route exists (`/api/users/route.ts` only has `GET`/`POST`;
  the `[id]` dynamic route only exists under `/api/admin/users/[id]`).
  Profile updates should likely go through `/api/profile` (`GET`/`PATCH`),
  which does exist.
- **Duplicate page trees:** both `app/auth/*` and `app/(auth)/*`, and both
  `app/dashboard/*` and `app/(dashboard)/*`, exist side by side. This looks
  like a partial migration to route groups — worth confirming which is
  canonical and deleting the other before it causes confusion about which
  page actually serves a given route.
- **`src/lib/classification.ts`'s `classifyMediaWithHuggingFace()`** and
  **`src/lib/supabase/storage.ts`'s `uploadMedia()`/`deleteMedia()`** are
  not called anywhere — the live upload path uses Cloudinary +
  `classifyMediaLocally()` only. Safe to delete, or keep as a documented
  fallback if you intend to wire real HF-based classification back in.
- `@supabase/auth-helpers-nextjs`, `HUGGINGFACE_API_KEY`, and
  `GOOGLE_VISION_API_KEY` are consequently dead weight too, unless you're
  planning to actually restore one of those paths.

## Troubleshooting

**Prisma errors on startup** — Confirm `DATABASE_URL` is reachable:
```bash
psql "$DATABASE_URL" -c "SELECT 1"
```

**Media upload succeeds but always uses the same generic sector guess** —
Expected if the ML service is unreachable; `classifyMediaLocally()`'s
heuristic is filename/MIME-based only and isn't meant to be precise. Check
`ML_SERVICE_URL` and that the ML service is actually running.

**"ML evaluation failed" / 502 from `/api/media` or `/api/quality`** —
Check `ML_SERVICE_URL` and that `ML_SERVICE_ADMIN_USERNAME`/`_PASSWORD` here
match `ML_DEFAULT_ADMIN_USERNAME`/`_PASSWORD` on the ML service exactly —
`ensureMlServiceToken()` logs in as that account on every cache miss.

**Logged-in users get bounced back to `/auth/login` from `/dashboard`** —
See the first item in [Known Issues](#known-issues--legacy-code) above.

**JWT / session mismatches between frontend and ML service** — Verify
`JWT_SECRET_KEY` is identical (including whitespace) in both `.env` files.