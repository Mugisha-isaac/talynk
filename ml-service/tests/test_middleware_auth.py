import asyncio
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException

from app.middleware.auth import verify_user_jwt


def _make_request(auth_header):
    request = MagicMock()
    request.headers = {"Authorization": auth_header} if auth_header else {}
    request.state = SimpleNamespace()
    return request


def test_verify_user_jwt_accepts_valid_token(make_token):
    request = _make_request(f"Bearer {make_token(user_id='99')}")

    payload = asyncio.run(verify_user_jwt(request))

    assert payload["user_id"] == "99"
    assert request.state.user_id == "99"


def test_verify_user_jwt_rejects_missing_header():
    request = _make_request(None)

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(verify_user_jwt(request))

    assert exc_info.value.status_code == 401


def test_verify_user_jwt_rejects_malformed_header():
    request = _make_request("Token abc.def.ghi")

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(verify_user_jwt(request))

    assert exc_info.value.status_code == 401


def test_verify_user_jwt_rejects_expired_token(make_token):
    request = _make_request(f"Bearer {make_token(expired=True)}")

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(verify_user_jwt(request))

    assert exc_info.value.status_code == 401
    assert "expired" in exc_info.value.detail


def test_verify_user_jwt_rejects_garbage_token():
    request = _make_request("Bearer not-a-real-jwt")

    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(verify_user_jwt(request))

    assert exc_info.value.status_code == 401
