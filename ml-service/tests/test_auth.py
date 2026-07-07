from unittest.mock import AsyncMock, patch

import bcrypt
import jwt

from tests.conftest import FakeConnection, JWT_SECRET_KEY


def test_register_new_user_success(client):
    fake_conn = FakeConnection(fetchrow_results=[None])  # no existing user

    with patch("app.routes.auth.asyncpg.connect", new=AsyncMock(return_value=fake_conn)):
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "new@example.com", "password": "secret123", "sector": "Music"},
        )

    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "success"
    assert "music" in body["message"]
    # sector was lowercased and password was hashed before insert
    insert_query, insert_args = fake_conn.executed[0]
    assert insert_args[0] == "new@example.com"
    assert insert_args[2] == "music"
    assert insert_args[1] != "secret123"


def test_register_rejects_duplicate_email(client):
    fake_conn = FakeConnection(fetchrow_results=[{"user_id": 1}])  # existing user

    with patch("app.routes.auth.asyncpg.connect", new=AsyncMock(return_value=fake_conn)):
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "dup@example.com", "password": "secret123", "sector": "music"},
        )

    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_login_success_returns_valid_jwt(client):
    password_hash = bcrypt.hashpw(b"correct-password", bcrypt.gensalt()).decode("utf-8")
    fake_conn = FakeConnection(
        fetchrow_results=[
            {"user_id": 7, "password_hash": password_hash, "sector": "music"}
        ]
    )

    with patch("app.routes.auth.asyncpg.connect", new=AsyncMock(return_value=fake_conn)):
        response = client.post(
            "/api/v1/auth/login",
            json={"username": "talent@example.com", "password": "correct-password"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "success"
    assert body["assigned_sector"] == "music"

    decoded = jwt.decode(body["access_token"], JWT_SECRET_KEY, algorithms=["HS256"])
    assert decoded["user_id"] == "7"
    assert decoded["sector"] == "music"


def test_login_wrong_password_returns_401(client):
    password_hash = bcrypt.hashpw(b"correct-password", bcrypt.gensalt()).decode("utf-8")
    fake_conn = FakeConnection(
        fetchrow_results=[
            {"user_id": 7, "password_hash": password_hash, "sector": "music"}
        ]
    )

    with patch("app.routes.auth.asyncpg.connect", new=AsyncMock(return_value=fake_conn)):
        response = client.post(
            "/api/v1/auth/login",
            json={"username": "talent@example.com", "password": "wrong-password"},
        )

    assert response.status_code == 401


def test_login_unknown_user_returns_401(client):
    fake_conn = FakeConnection(fetchrow_results=[None])

    with patch("app.routes.auth.asyncpg.connect", new=AsyncMock(return_value=fake_conn)):
        response = client.post(
            "/api/v1/auth/login",
            json={"username": "nobody@example.com", "password": "whatever"},
        )

    assert response.status_code == 401


def test_login_missing_identity_returns_400(client):
    response = client.post("/api/v1/auth/login", json={"password": "whatever"})

    assert response.status_code == 400
