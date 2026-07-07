"""
Shared pytest fixtures for the ml-service test suite.

Design notes:
- The app's `lifespan` hits a real Postgres instance on startup
  (schema init + default admin creation). Tests patch those two
  functions to no-ops so `TestClient(app)` doesn't need a live DB.
- Individual routes open their own `asyncpg.connect(...)` calls rather
  than using dependency injection, so route-level tests patch
  `asyncpg.connect` at the module where it's imported (e.g.
  `app.routes.auth.asyncpg.connect`) with a `FakeConnection`.
"""
import datetime
import os
import sys
from unittest.mock import AsyncMock, patch

import jwt
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

os.environ.setdefault("JWT_SECRET_KEY", "your-shared-nextauth-jwt-token-secret-key-12345")
os.environ.setdefault("DATABASE_URL", "postgresql://test:test@localhost/test")

JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]


class FakeConnection:
    """A stand-in for an asyncpg connection.

    `fetchrow_result` / `fetch_result` are consumed in order each time
    the corresponding method is called, so a test can queue up
    different responses for successive queries within one request.
    """

    def __init__(self, fetchrow_results=None, fetch_results=None):
        self._fetchrow_results = list(fetchrow_results or [])
        self._fetch_results = list(fetch_results or [])
        self.executed = []

    async def fetchrow(self, query, *args):
        if self._fetchrow_results:
            return self._fetchrow_results.pop(0)
        return None

    async def fetch(self, query, *args):
        if self._fetch_results:
            return self._fetch_results.pop(0)
        return []

    async def execute(self, query, *args):
        self.executed.append((query, args))
        return "OK"

    async def close(self):
        return None


@pytest.fixture
def app():
    """Import the FastAPI app with startup DB calls patched out."""
    with patch("app.main.init_db_schema", new=AsyncMock(return_value=None)), patch(
        "app.main.ensure_default_admin_user", new=AsyncMock(return_value=None)
    ):
        from app.main import app as fastapi_app

        yield fastapi_app


@pytest.fixture
def client(app):
    with TestClient(app) as c:
        yield c


@pytest.fixture
def make_token():
    def _make(user_id="42", email="talent@example.com", sector="music", expired=False):
        exp = datetime.datetime.utcnow() + (
            datetime.timedelta(hours=-1) if expired else datetime.timedelta(hours=24)
        )
        payload = {"user_id": user_id, "email": email, "sector": sector, "exp": exp}
        return jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")

    return _make


@pytest.fixture
def auth_headers(make_token):
    return {"Authorization": f"Bearer {make_token()}"}
