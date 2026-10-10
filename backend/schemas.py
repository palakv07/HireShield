import re
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, field_validator, model_validator


class FlagItem(BaseModel):
    id: str
    title: str
    severity: str  # HIGH, MEDIUM, LOW
    weight: int
    evidence: str
    span: List[int]
    why: str


class AnalyzeRequest(BaseModel):
    text: Optional[str] = Field(default=None, max_length=15000)
    url: Optional[str] = Field(default=None, max_length=1000)

    @model_validator(mode="after")
    def check_at_least_one(self):
        has_text = bool(self.text and self.text.strip())
        has_url = bool(self.url and self.url.strip())
        if not has_text and not has_url:
            raise ValueError("Either 'text' or 'url' must be provided.")
        return self


class AnalyzeResponse(BaseModel):
    analysis_id: str
    risk_level: str
    score: int
    summary: str
    flags: List[FlagItem]
    unknowns: List[str]
    checklist: List[str]
    content_signals: int
    url_signals: int
    disclaimer: str
    confidence_note: str


class ReportRequest(BaseModel):
    scam_type: str = Field(..., max_length=50)  # fee, phishing_link, impersonation, fake_posting, other
    platform: str = Field(..., max_length=50)   # LinkedIn, WhatsApp, Telegram, Email, Other
    redacted_text: str = Field(..., min_length=5, max_length=15000)


class ReportResponse(BaseModel):
    report_id: str
    status: str
    message: str


class FeedbackRequest(BaseModel):
    analysis_id: Optional[str] = None
    helpful: bool
    comment: Optional[str] = Field(default=None, max_length=1000)


class FeedbackResponse(BaseModel):
    feedback_id: str
    status: str
    message: str


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=3, max_length=254)
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Name cannot be blank.")
        return value

    @field_validator("email")
    @classmethod
    def clean_email(cls, value: str) -> str:
        value = value.strip().lower()
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            raise ValueError("Enter a valid email address.")
        return value


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=254)
    password: str = Field(..., min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def clean_email(cls, value: str) -> str:
        value = value.strip().lower()
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            raise ValueError("Enter a valid email address.")
        return value


class AccountResponse(BaseModel):
    id: str
    name: str
    email: str


class CategoryCount(BaseModel):
    name: str
    count: int


class FlagCount(BaseModel):
    flag: str
    count: int


class BenchmarkMetrics(BaseModel):
    detection_rate: float
    false_positive_rate: float
    samples_count: int
    scam_samples: int
    legitimate_samples: int
    evaluated_at: str


class TrendsResponse(BaseModel):
    total_reports: int
    total_analyses: int
    by_scam_type: List[CategoryCount]
    by_platform: List[CategoryCount]
    flag_frequency: List[FlagCount]
    benchmark_metrics: BenchmarkMetrics
    is_demo_seed: bool
