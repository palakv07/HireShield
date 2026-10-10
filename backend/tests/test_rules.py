import pytest
from detection.rules import evaluate_content_rules, evaluate_url_rules
from detection.redaction import detect_sensitive_data, redact_text
from detection.engine import analyze_recruitment_post


def test_rule_upfront_fee():
    text = "Please submit a refundable deposit of $200 registration fee before starting training."
    flags = evaluate_content_rules(text)
    assert any(f["id"] == "RULE_FEE_UPFRONT" for f in flags)
    assert any(f["severity"] == "HIGH" for f in flags)


def test_rule_sensitive_data():
    text = "Before your offer letter, please provide your bank account details and social security number."
    flags = evaluate_content_rules(text)
    assert any(f["id"] == "RULE_SENSITIVE_DATA" for f in flags)
    assert any(f["severity"] == "HIGH" for f in flags)


def test_rule_urgency():
    text = "Reply within 24 hours to secure your slot! Limited seats available."
    flags = evaluate_content_rules(text)
    assert any(f["id"] == "RULE_URGENCY_PRESSURE" for f in flags)


def test_rule_off_platform_pivot():
    text = "Great profile! Message me on WhatsApp at +1234567890 to proceed with the hiring process."
    flags = evaluate_content_rules(text)
    assert any(f["id"] == "RULE_OFF_PLATFORM_PIVOT" for f in flags)


def test_rule_too_good_to_be_true():
    text = "No interview needed, direct selection. Earn $500 per day working from home!"
    flags = evaluate_content_rules(text)
    assert any(f["id"] == "RULE_TOO_GOOD_TRUE" for f in flags)


def test_rule_freemail_enterprise_impersonation():
    text = "I am a talent scout at Google. Send your resume to google.recruitment.team@gmail.com immediately."
    flags = evaluate_content_rules(text)
    assert any(f["id"] == "RULE_FREEMAIL_IMPERSONATION" for f in flags)


def test_rule_url_non_https():
    url = "http://jobs-corporate.com/apply"
    flags = evaluate_url_rules(url)
    assert any(f["id"] == "RULE_URL_NON_HTTPS" for f in flags)


def test_rule_url_ip_host():
    url = "http://192.168.1.1/careers"
    flags = evaluate_url_rules(url)
    assert any(f["id"] == "RULE_URL_IP_HOST" for f in flags)


def test_rule_url_shortener():
    url = "https://bit.ly/my-new-job"
    flags = evaluate_url_rules(url)
    assert any(f["id"] == "RULE_URL_SHORTENER" for f in flags)


def test_rule_url_suspicious_tld():
    url = "https://amazon-careers.xyz"
    flags = evaluate_url_rules(url)
    assert any(f["id"] == "RULE_URL_SUSPICIOUS_TLD" for f in flags)


def test_rule_url_lookalike():
    url = "https://careers-google-verify.com"
    flags = evaluate_url_rules(url)
    assert any(f["id"] == "RULE_URL_LOOKALIKE" for f in flags)


def test_redaction_email_phone_card_ssn():
    raw = "My email is test@example.com, phone is 555-123-4567, card is 4111 2222 3333 4444, ssn is 123-45-6789."
    redacted = redact_text(raw)
    assert "test@example.com" not in redacted
    assert "[EMAIL_REDACTED]" in redacted
    assert "4111 2222 3333 4444" not in redacted
    assert "[CARD_REDACTED]" in redacted
    assert "123-45-6789" not in redacted
    assert "[GOVT_ID_REDACTED]" in redacted


def test_detect_sensitive_data():
    raw = "Here is my code: 123456 and my card 4111 2222 3333 4444"
    findings = detect_sensitive_data(raw)
    types = [f["type"] for f in findings]
    assert "card" in types
    assert "otp" in types


def test_engine_demo_high():
    # Fee + Urgency + freemail
    text = "Google hiring! Registration fee of $150 required for kit. Reply within 24 hours. Contact hr.google@gmail.com"
    res = analyze_recruitment_post(text=text)
    assert res["risk_level"] == "HIGH"
    assert res["score"] >= 60
    assert len(res["flags"]) >= 2
    assert "No obvious red flags" not in res["summary"]


def test_engine_demo_medium():
    # Bit.ly link + lookalike
    text = "Interview confirmed! View portal details at https://bit.ly/google-job-interview"
    res = analyze_recruitment_post(text=text, url="https://bit.ly/google-job-interview")
    assert res["risk_level"] == "MEDIUM"
    assert 30 <= res["score"] < 60


def test_engine_demo_low():
    # Legitimate Stripe posting
    text = "Software Engineer at Stripe. Build payment systems in Go and Ruby. Health insurance, 401(k). Apply via https://stripe.com/jobs"
    res = analyze_recruitment_post(text=text, url="https://stripe.com/jobs")
    assert res["risk_level"] == "LOW"
    assert res["score"] < 30
    assert "disclaimer" in res
    assert "checklist" in res
    assert len(res["checklist"]) >= 4
