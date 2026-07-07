# Testing Guide

## Frontend (`frontend/`)

Stack: Jest + React Testing Library, configured via `next/jest` (Next.js 14 app router).

Setup:
```bash
cd frontend
yarn install
yarn add --dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @testing-library/dom @types/jest
```

(These devDependencies are already listed in `package.json` — a simple `yarn install` is enough once you pull this branch.)

Run:
```bash
yarn test             # run once
yarn test:watch       # watch mode
yarn test:coverage    # generate coverage report
```

What's covered so far:
- `src/utils/helpers.ts`, `src/lib/utils.ts` — pure formatting/className helpers
- `src/hooks/useAuthUser.ts`, `useMedia.ts`, `useRecommendations.ts` — fetch/XHR mocked, loading/error/success states and derived helpers (`isSponsor`, `nextPage`, etc.)
- `src/components/StatCard.tsx`, `CategoryCard.tsx` — rendering and conditional content
- `src/components/Navigation.tsx` — auth-aware links and the mobile hamburger menu toggle

This is a starting scaffold, not full coverage. The same patterns (mock `fetch`/`XMLHttpRequest`, `renderHook` for hooks, `render`/`screen` for components) can be extended directly to the rest of `src/components` and `src/hooks`.

---

## ML Service (`ml-service/`)

Stack: `pytest` + FastAPI's `TestClient`. Nothing talks to a real Postgres or Hugging Face Space during tests — `asyncpg.connect` and `HFClient.*` are patched per test with fakes defined in `tests/conftest.py` (see `FakeConnection`).

Setup:
```bash
cd ml-service
python3 -m venv .venv

# Linux/macOS
source .venv/bin/activate

# Windows
# .venv\Scripts\activate

pip install -r requirements-dev.txt
```

Run:
```bash
pytest
```

What's covered:
- `/health`
- `/api/v1/auth/register` and `/login` (duplicate email, wrong password, missing identity, valid JWT)
- `verify_user_jwt` middleware directly (missing, malformed, expired, and invalid tokens)
- `/api/v1/audio|image|video/evaluate` (authentication required, score persistence, cache invalidation, `talent_id` vs. token `user_id` fallback, model-service error handling, and video's `file` vs. `file_url` paths)
- `/api/v1/recommendations/sector-top-five` (cache hit vs. miss, empty sector, and fairness re-ranking path)
- `/api/v1/fairness`