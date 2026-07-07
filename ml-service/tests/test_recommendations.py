from unittest.mock import AsyncMock, patch

from tests.conftest import FakeConnection


def test_sector_top_five_requires_auth(client):
    response = client.post("/api/v1/recommendations/sector-top-five", json={"sector": "music"})

    assert response.status_code == 401


def test_sector_top_five_returns_cached_results_without_hitting_db(client, auth_headers):
    cached_payload = [{"evaluation_id": 1, "visibility_score": 99.0}]

    with patch("app.routes.recommendations.cache.get", return_value=cached_payload), patch(
        "app.routes.recommendations.asyncpg.connect"
    ) as mock_connect:
        response = client.post(
            "/api/v1/recommendations/sector-top-five",
            headers=auth_headers,
            json={"sector": "Music"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["source"] == "cache"
    assert body["sector"] == "music"
    assert body["results"] == cached_payload
    mock_connect.assert_not_called()


def test_sector_top_five_queries_db_on_cache_miss_and_caches_result(client, auth_headers):
    rows = [
        {"id": 1, "user_id": "u1", "media_type": "audio", "visibility_score": 91.5},
        {"id": 2, "user_id": "u2", "media_type": "image", "visibility_score": 80.0},
    ]
    fake_conn = FakeConnection(fetch_results=[rows])

    with patch("app.routes.recommendations.cache.get", return_value=None), patch(
        "app.routes.recommendations.cache.setex"
    ) as mock_setex, patch(
        "app.routes.recommendations.asyncpg.connect", new=AsyncMock(return_value=fake_conn)
    ), patch(
        "app.routes.recommendations.fair_optimizer", None
    ):
        response = client.post(
            "/api/v1/recommendations/sector-top-five",
            headers=auth_headers,
            json={"sector": "music"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["source"] == "database"
    assert len(body["results"]) == 2
    # sorted descending by prediction_score
    assert body["results"][0]["evaluation_id"] == 1
    assert body["results"][0]["visibility_approved"] is True
    mock_setex.assert_called_once()


def test_sector_top_five_returns_empty_list_when_no_rows(client, auth_headers):
    fake_conn = FakeConnection(fetch_results=[[]])

    with patch("app.routes.recommendations.cache.get", return_value=None), patch(
        "app.routes.recommendations.asyncpg.connect", new=AsyncMock(return_value=fake_conn)
    ):
        response = client.post(
            "/api/v1/recommendations/sector-top-five",
            headers=auth_headers,
            json={"sector": "empty-sector"},
        )

    assert response.status_code == 200
    assert response.json()["results"] == []
