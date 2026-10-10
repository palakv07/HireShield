import uuid
import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


def test_auth_registration_login_and_logout(client):
    email = f"account-{uuid.uuid4()}@example.com"
    registration = client.post(
        "/api/auth/register",
        json={"name": "Test User", "email": email, "password": "secure-pass-123"},
    )
    assert registration.status_code == 201
    assert registration.json()["email"] == email
    assert "password" not in registration.json()

    duplicate = client.post(
        "/api/auth/register",
        json={"name": "Test User", "email": email, "password": "secure-pass-123"},
    )
    assert duplicate.status_code == 409

    rejected_login = client.post(
        "/api/auth/login",
        json={"email": email, "password": "incorrect-password"},
    )
    assert rejected_login.status_code == 401

    login = client.post(
        "/api/auth/login",
        json={"email": email, "password": "secure-pass-123"},
    )
    assert login.status_code == 200
    assert login.json()["name"] == "Test User"
    assert login.cookies.get("hireshield_session")
    assert "httponly" in login.headers["set-cookie"].lower()

    current_user = client.get("/api/auth/me")
    assert current_user.status_code == 200
    assert current_user.json()["email"] == email

    logout = client.post("/api/auth/logout")
    assert logout.status_code == 200
    assert client.get("/api/auth/me").status_code == 401


def test_auth_registration_validates_input(client):
    assert client.post(
        "/api/auth/register",
        json={"name": "Test User", "email": "not-an-email", "password": "secure-pass-123"},
    ).status_code == 422
    assert client.post(
        "/api/auth/register",
        json={"name": "Test User", "email": "valid@example.com", "password": "short"},
    ).status_code == 422


def test_analyze_endpoint_high(client):
    payload = {
        "text": "Selected for Microsoft! Kindly pay $200 training fee within 24 hours. Email: hr@gmail.com",
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] == "HIGH"
    assert data["score"] >= 60
    assert len(data["flags"]) > 0
    assert len(data["unknowns"]) > 0
    assert len(data["checklist"]) > 0
    assert "analysis_id" in data


def test_analyze_endpoint_empty_error(client):
    response = client.post("/api/analyze", json={"text": "", "url": ""})
    assert response.status_code == 422


def test_report_endpoint(client):
    payload = {
        "scam_type": "fee",
        "platform": "WhatsApp",
        "redacted_text": "Scammer asked for $100 registration fee. Contact 555-019-2834.",
    }
    response = client.post("/api/report", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "report_id" in data
    assert data["status"] == "received"


def test_feedback_endpoint(client):
    payload = {
        "analysis_id": "test-id-123",
        "helpful": True,
        "comment": "Accurate detection of fee red flag.",
    }
    response = client.post("/api/feedback", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"


def test_trends_endpoint(client):
    response = client.get("/api/trends")
    assert response.status_code == 200
    data = response.json()
    assert "total_reports" in data
    assert "by_scam_type" in data
    assert "by_platform" in data
    assert "flag_frequency" in data
    assert "benchmark_metrics" in data
    assert data["benchmark_metrics"]["samples_count"] >= 30
