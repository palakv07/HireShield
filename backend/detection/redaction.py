import re
from typing import Tuple, List, Dict

# Regex patterns for identifying and redacting sensitive data
EMAIL_REGEX = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
)

# Phone regex handles international (+1, +91, etc.), parenthesized area codes, dots, dashes
PHONE_REGEX = re.compile(
    r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b"
)

# Credit/Debit Card: 13-19 digits, possibly with dashes or spaces
CARD_REGEX = re.compile(
    r"\b(?:\d{4}[-\s]?){3}\d{1,4}\b"
)

# SSN: XXX-XX-XXXX or 9 digits
SSN_REGEX = re.compile(
    r"\b\d{3}-\d{2}-\d{4}\b"
)

# Aadhaar: 12 digits, often 4-4-4
AADHAAR_REGEX = re.compile(
    r"\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b"
)

# OTP / Verification code: 4-8 consecutive digits in an OTP/code context or standalone 6-digit sequence
OTP_PATTERN = re.compile(
    r"\b(?:otp|code|pin|password|secret)[:\s]*([0-9]{4,8})\b", re.IGNORECASE
)
STANDALONE_OTP_REGEX = re.compile(
    r"\b\d{6}\b"
)

# Generic long digit strings (7+ digits)
LONG_DIGIT_REGEX = re.compile(
    r"\b\d{7,}\b"
)


def detect_sensitive_data(text: str) -> List[Dict[str, str]]:
    """
    Detects if sensitive data like OTP, card, SSN/Aadhaar, phone, or email is present in the text.
    Returns a list of detected item descriptions without logging secret values.
    """
    findings = []
    if CARD_REGEX.search(text):
        findings.append({"type": "card", "label": "Payment card number detected"})
    if SSN_REGEX.search(text):
        findings.append({"type": "ssn", "label": "Social Security Number (SSN) detected"})
    if AADHAAR_REGEX.search(text):
        findings.append({"type": "aadhaar", "label": "National ID / Aadhaar number format detected"})
    if OTP_PATTERN.search(text):
        findings.append({"type": "otp", "label": "One-Time Password (OTP) or security code detected"})
    if EMAIL_REGEX.search(text):
        findings.append({"type": "email", "label": "Personal email address detected"})
    if PHONE_REGEX.search(text):
        findings.append({"type": "phone", "label": "Phone number detected"})
    return findings


def redact_text(text: str) -> str:
    """
    Strictly redacts sensitive PII (emails, phone numbers, payment cards, national IDs, OTPs,
    and long digit strings) from user text.
    """
    if not text:
        return ""

    redacted = text

    # Redact Cards first (before generic digits)
    redacted = CARD_REGEX.sub("[CARD_REDACTED]", redacted)

    # Redact SSN
    redacted = SSN_REGEX.sub("[GOVT_ID_REDACTED]", redacted)

    # Redact Aadhaar
    redacted = AADHAAR_REGEX.sub("[GOVT_ID_REDACTED]", redacted)

    # Redact Emails
    redacted = EMAIL_REGEX.sub("[EMAIL_REDACTED]", redacted)

    # Redact OTP with context
    redacted = OTP_PATTERN.sub(r"code: [OTP_REDACTED]", redacted)

    # Redact Phone numbers
    redacted = PHONE_REGEX.sub("[PHONE_REDACTED]", redacted)

    # Redact standalone 7+ digit numbers
    redacted = LONG_DIGIT_REGEX.sub("[DIGITS_REDACTED]", redacted)

    return redacted
