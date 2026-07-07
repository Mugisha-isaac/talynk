# Testing Guide

## Frontend (`frontend/`)

Stack: Jest + React Testing Library, configured via `next/jest` (Next.js 14 app router).

Setup:
```
cd frontend
npm install
npm install --save-dev jest jest-environment-jsdom @testing-library/react \
  @testing-library/jest-dom @testing-library/user-event @testing-library/dom @types/jest
```
(these devDependencies are already listed in package.json — a plain `npm install` is enough
once you pull this branch)

Run:
```
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

What's covered so far:
- `src/utils/helpers.ts`, `src/lib/utils.ts` — pure formatting/className helpers
- `src/hooks/useAuthUser.ts`, `useMedia.ts`, `useRecommendations.ts` — fetch/XHR mocked,
  loading/error/success states and derived helpers (isSponsor, nextPage, etc.)
- `src/components/StatCard.tsx`, `CategoryCard.tsx` — rendering and conditional content
- `src/components/Navigation.tsx` — auth-aware links and the mobile hamburger menu toggle

This is a starting scaffold, not full coverage — the same patterns (mock `fetch`/`XMLHttpRequest`,
`renderHook` for hooks, `render`/`screen` for components) extend directly to the rest of
`src/components` and `src/hooks`.

## ML service (`ml-service/`)

Stack: pytest + FastAPI's `TestClient`. Nothing talks to a real Postgres or Hugging Face
Space in tests — `asyncpg.connect` and `HFClient.*` are patched per-test with fakes defined
in `tests/conftest.py` (see `FakeConnection`).

Setup:
```
cd ml-service
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
```

Run:
```
pytest
```

What's covered:
- `/health`
- `/api/v1/auth/register` and `/login` (duplicate email, wrong password, missing identity, valid JWT)
- `verify_user_jwt` middleware directly (missing/malformed/expired/garbage tokens)
- `/api/v1/audio|image|video/evaluate` (auth required, score persisted + cache invalidated,
  talent_id vs token user_id fallback, model-service error handling, video's file vs file_url path)
- `/api/v1/recommendations/sector-top-five` (cache hit vs miss, empty sector, fairness reranking path)
- `/api/v1/fairness`

### Bug fixed along the way
`routes/fairness.py` defined a working `/fairness` endpoint but it was never registered
in `main.py`'s router list, so it was unreachable (404) before this change. It's now
included under `/api/v1/fairness`.
