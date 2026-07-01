# Setup Notes (integration pass)

## 1. Install & generate Prisma client
```bash
yarn install        # or npm install
npx prisma generate
npx prisma migrate dev   # if your DB doesn't have the tables yet
```
(`prisma generate` needs internet access to download engine binaries — this
sandbox couldn't reach `binaries.prisma.sh`, but your machine will be fine.)

## 2. Environment variables
Copy `.env.example` -> `.env.local` and fill in:
- `DATABASE_URL` — your Postgres connection string
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard (used for all media uploads now, replacing the old fake `/uploads/...` path)
- `ML_SERVICE_URL` — wherever your FastAPI ml-service is running (default `http://localhost:8000`)
- `JWT_SECRET_KEY` — must match the `JWT_SECRET_KEY` in the ml-service's `.env` exactly (both sides verify the same HS256 token)

## 3. Run
```bash
yarn dev
```
Auth (`/auth/signup`, `/auth/login`), talents discovery, profile, content
upload (Studio), and the ML-scored recommendation feed on `/home` are all now
backed by Postgres/Cloudinary/the ML service rather than mock arrays.

## What changed in this pass
- Fixed sector/category naming: `src/lib/sectors.ts` is now the single mapping
  between UI sector ids, the Prisma `Discipline` enum, and the ML service's
  `sector` strings. Every sector pill in the UI now actually filters real data.
- `src/app/api/recommendations/route.ts` — removed the old mock-data shortcut;
  sector feeds always go through the ML service's `/recommendations/sector-top-five`,
  and `sponsorId` lookups now read real `Recommendation` rows from Postgres.
- `src/app/(dashboard)/studio/page.tsx` — "Publish Content" now actually
  uploads the file to Cloudinary + creates a `ContentItem` row (previously it
  only simulated a progress bar and never sent anything to the server).

## Still using placeholder/sample data (next pass if you want it)
- `src/app/dashboard/sponsor/page.tsx`, `src/app/dashboard/talent/page.tsx`
- `src/app/sponsors/page.tsx`, `src/app/sponsors/[id]/page.tsx`
- `src/app/(discovery)/explore|search|trending/page.tsx`
