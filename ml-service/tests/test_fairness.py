def test_fairness_rerank_passthrough(client):
    raw_recs = [{"id": "a", "score": 0.9}, {"id": "b", "score": 0.7}]

    response = client.post(
        "/api/v1/fairness",
        json={"user_id": "user-1", "raw_recommendations": raw_recs},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["user_id"] == "user-1"
    assert body["reranked_recommendations"] == raw_recs
    assert "ThresholdOptimizer" in body["mechanism"]
