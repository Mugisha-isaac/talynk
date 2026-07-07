from unittest.mock import AsyncMock, patch

import pytest

from tests.conftest import FakeConnection

MEDIA_ROUTES = [
    ("audio", "app.routes.audio_quality"),
    ("image", "app.routes.image_quality"),
    ("video", "app.routes.video_quality"),
]


@pytest.mark.parametrize("media_type,module_path", MEDIA_ROUTES)
def test_evaluate_requires_auth(client, media_type, module_path):
    response = client.post(
        f"/api/v1/{media_type}/evaluate",
        data={"sector": "music"},
        files={"file": ("clip.bin", b"fake-bytes")},
    )

    assert response.status_code == 401


@pytest.mark.parametrize("media_type,module_path", MEDIA_ROUTES)
def test_evaluate_success_records_score_and_invalidates_cache(
    client, auth_headers, media_type, module_path
):
    fake_conn = FakeConnection()
    hf_result = {"score": 0.8734}

    with patch(f"{module_path}.asyncpg.connect", new=AsyncMock(return_value=fake_conn)), patch(
        f"{module_path}.HFClient.{media_type}", return_value=hf_result
    ), patch(f"{module_path}.cache.delete") as mock_cache_delete:
        response = client.post(
            f"/api/v1/{media_type}/evaluate",
            headers=auth_headers,
            data={"sector": "Music", "talent_id": "creator-123"},
            files={"file": ("clip.bin", b"fake-bytes")},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "success"
    assert body["media_type"] == media_type
    assert body["sector"] == "music"
    assert body["visibility_score"] == 87.34
    assert body["recorded_by_user"] == "creator-123"

    # the score got persisted
    insert_query, insert_args = fake_conn.executed[0]
    assert insert_args == ("creator-123", "music", media_type, 87.34)

    # and the sector's cached top-5 feed was invalidated
    mock_cache_delete.assert_called_once_with("cache:sector:music:top5")


@pytest.mark.parametrize("media_type,module_path", MEDIA_ROUTES)
def test_evaluate_falls_back_to_token_user_id_when_no_talent_id(
    client, auth_headers, media_type, module_path
):
    fake_conn = FakeConnection()

    with patch(f"{module_path}.asyncpg.connect", new=AsyncMock(return_value=fake_conn)), patch(
        f"{module_path}.HFClient.{media_type}", return_value={"score": 0.5}
    ), patch(f"{module_path}.cache.delete"):
        response = client.post(
            f"/api/v1/{media_type}/evaluate",
            headers=auth_headers,
            data={"sector": "music"},
            files={"file": ("clip.bin", b"fake-bytes")},
        )

    assert response.status_code == 200
    # "42" is the user_id baked into the auth_headers fixture's token
    assert response.json()["recorded_by_user"] == "42"


@pytest.mark.parametrize("media_type,module_path", MEDIA_ROUTES)
def test_evaluate_returns_500_when_model_service_has_no_score(
    client, auth_headers, media_type, module_path
):
    with patch(
        f"{module_path}.HFClient.{media_type}",
        return_value={"detail": "model unavailable"},
    ):
        response = client.post(
            f"/api/v1/{media_type}/evaluate",
            headers=auth_headers,
            data={"sector": "music"},
            files={"file": ("clip.bin", b"fake-bytes")},
        )

    assert response.status_code == 500
    assert "model unavailable" in response.json()["detail"]


def test_video_evaluate_requires_file_or_url(client, auth_headers):
    with patch("app.routes.video_quality.HFClient.video", return_value={"score": 0.5}):
        response = client.post(
            "/api/v1/video/evaluate",
            headers=auth_headers,
            data={"sector": "music"},
        )

    assert response.status_code == 400
    assert "Provide either" in response.json()["detail"]


def test_video_evaluate_via_file_url(client, auth_headers):
    fake_conn = FakeConnection()
    fake_download = AsyncMock()

    class FakeResponse:
        status_code = 200
        content = b"downloaded-bytes"

    with patch(
        "app.routes.video_quality.asyncpg.connect", new=AsyncMock(return_value=fake_conn)
    ), patch("app.routes.video_quality.requests.get", return_value=FakeResponse()), patch(
        "app.routes.video_quality.HFClient.video", return_value={"score": 0.42}
    ), patch(
        "app.routes.video_quality.cache.delete"
    ):
        response = client.post(
            "/api/v1/video/evaluate",
            headers=auth_headers,
            data={"sector": "music", "file_url": "https://cdn.example.com/clip.mp4"},
        )

    assert response.status_code == 200
    assert response.json()["visibility_score"] == 42.0
