import datetime
import uuid
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from database import Base


class AnalysisLog(Base):
    __tablename__ = "analyses_log"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
    risk_level = Column(String(20), nullable=False)
    score = Column(Integer, nullable=False)
    flags_count = Column(Integer, default=0, nullable=False)
    text_length = Column(Integer, default=0, nullable=False)
    has_url = Column(Boolean, default=False, nullable=False)
    redacted_snippet = Column(String(255), nullable=True)  # Strictly redacted, never raw


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
    scam_type = Column(String(50), nullable=False)  # fee, phishing_link, impersonation, fake_posting, other
    platform = Column(String(50), nullable=False)   # LinkedIn, WhatsApp, Telegram, Email, Other
    redacted_text = Column(Text, nullable=False)    # Strictly re-redacted on server
    status = Column(String(20), default="reviewed", nullable=False)


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
    analysis_id = Column(String(36), nullable=True)
    helpful = Column(Boolean, nullable=False)
    comment = Column(Text, nullable=True)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(254), unique=True, index=True, nullable=False)
    password_hash = Column(String(256), nullable=False)


class AuthSession(Base):
    __tablename__ = "auth_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=False, index=True)
    token_hash = Column(String(64), unique=True, nullable=False)
    expires_at = Column(Integer, nullable=False)
