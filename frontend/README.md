# Talynk — Frontend

The frontend is a Next.js 14 application using the App Router and TypeScript. It provides the user-facing interface, server-side API routes, and authentication integration via NextAuth and Supabase Auth.

---

## Tech Stack

- Framework: Next.js 14 (App Router) with TypeScript
- UI library: shadcn/ui with Tailwind CSS
- Authentication: NextAuth with Supabase JWT
- Database ORM: Prisma
- Database: Supabase PostgreSQL
- Storage: Supabase Storage (S3-compatible)
- Package manager: Yarn 4.0.0

## Project Structure

```
src/
  app/
    api/                  API route handlers
      media/              Media upload and retrieval
      recommendations/    Recommendation management
      quality/            Quality score endpoints
      analytics/          Analytics endpoints
    auth/                 Authentication pages (login, signup, callback)
    dashboard/            Role-based dashboards (talent, sponsor, setup)
    talents/              Talent directory and individual profiles
    sponsors/             Sponsor directory and company profiles
    about/                About page
    layout.tsx            Root layout
    page.tsx              Landing page
    globals.css           Global styles
  components/
    ui/                   shadcn/ui primitives
    Navigation.tsx        Header and mobile menu
    Footer.tsx            Site footer
    TalentCard.tsx        Talent listing card
    SponsorCard.tsx       Sponsor listing card
    MediaUploadDialog.tsx Upload dialog with classification feedback
  hooks/
    useAuth.ts            Authentication state hook
  lib/
    supabase/             Supabase client utilities
    classification.ts     Client-side classification helpers
    prisma.ts             Prisma client singleton
    unsplash.ts           Image URL utilities
  types/index.ts          Shared TypeScript types
  utils/helpers.ts        General utility functions
```

## Database Schema

**User** — `id`, `email`, `name`, `role` (TALENT | SPONSOR | ADMIN)

**Talent** — `id`, `userId`, `bio`, `portfolioUrl`, `socialLinks`. One-to-many with Media.

**Sponsor** — `id`, `userId`, `companyName`, `description`, `website`, `logo`. Many-to-many with Sectors.

**Media** — `id`, `talentId`, `title`, `type` (IMAGE | VIDEO | AUDIO | DOCUMENT), `fileUrl`, `thumbnailUrl`, `sectorId`, `classification` (JSON), `confidenceScore`.

**Sector** — `id`, `name`, `description`, `icon`. Many-to-many with Sponsors and Media.

**Recommendation** — `id`, `talentId`, `sponsorId`, `mediaId`, `matchScore`, `status` (PENDING | VIEWED | INTERESTED | REJECTED | CONNECTED). Unique on `(talentId, sponsorId, mediaId)`.

## Supported Creative Sectors

Visual Arts, Photography, Design, Music, Film and Video, Fashion, Performance and Theater, Sports.

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

Required variables:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
HUGGINGFACE_API_KEY=optional
```

### 3. Supabase storage buckets

Create the following public buckets in your Supabase project:

- `portfolio` — talent portfolio assets
- `avatars` — user profile images
- `logos` — sponsor company logos

### 4. Database setup

```bash
yarn prisma:generate
yarn prisma:migrate
yarn prisma:seed
```

### 5. Start development server

```bash
yarn dev
```

Application available at http://localhost:3000.

## Available Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Compile for production |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn prisma:generate` | Regenerate Prisma client after schema changes |
| `yarn prisma:migrate` | Apply pending migrations |
| `yarn prisma:studio` | Open Prisma Studio database browser |
| `yarn prisma:seed` | Seed initial sector data |

## Authentication Flow

Users register with email and password through Supabase Auth. After registration they complete a profile setup step to choose a role (Talent or Sponsor). Session tokens are managed by NextAuth and validated on all API routes. Row-level security policies in Supabase enforce data access boundaries at the database level.

## Media Upload and Classification Flow

A user selects a file, which is uploaded to Supabase Storage. The file metadata is extracted and sent to the Hugging Face Inference API, or a local heuristic fallback if no API key is configured. The returned sector classification and confidence score are stored alongside the media record. Recommendations are then generated automatically for sponsors who have registered interest in the identified sector.

```
Upload → Supabase Storage → Classification → Database → Recommendations
```

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/media` | Upload new media item |
| GET | `/api/media?talentId=...` | List talent media |
| GET | `/api/recommendations?sponsorId=...` | List sponsor recommendations |
| PATCH | `/api/recommendations` | Update recommendation status |
| GET | `/api/quality` | Retrieve quality scores from ml-service |
| GET | `/api/analytics` | Aggregate engagement analytics |

## Troubleshooting

**Supabase connection errors**

```bash
echo $DATABASE_URL
psql $DATABASE_URL -c "SELECT 1"
```

**Media upload failures** — Verify that the Supabase storage bucket permissions are set to public read and that the file does not exceed the 100 MB default limit.

**Classification not running** — If `HUGGINGFACE_API_KEY` is not set, the system falls back to local heuristic classification based on file extension and MIME type. Accuracy is lower but no external API is required.
