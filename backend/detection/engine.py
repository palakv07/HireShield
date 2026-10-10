import os
import re
from typing import List, Dict, Any, Optional
from detection.rules import evaluate_content_rules, evaluate_url_rules

AI_ENABLED = os.environ.get("AI_ENABLED", "false").lower() in ("true", "1", "yes")

DISCLAIMER_TEXT = (
    "HireShield is an early-warning and education tool, not a guarantee. "
    "It evaluates text and domain heuristics to identify common recruitment risk patterns. "
    "It never issues verdicts or confirms legitimacy. Always verify directly through verified company channels."
)

DEFAULT_CHECKLIST = [
    "Find the company's official careers page directly (do not use links provided in messages)",
    "Verify the recruiter's identity through official corporate channels or LinkedIn company directory",
    "Never pay any fee, security deposit, or equipment charge to secure an interview or job offer",
    "Never share government ID numbers, bank details, or OTPs prior to receiving a verified contract",
    "Examine the URL domain carefully in your browser address bar before entering any information",
]


def determine_unknowns(text: Optional[str], url: Optional[str]) -> List[str]:
    """Identifies missing context and pieces of evidence that could not be verified."""
    unknowns = []

    has_url = bool(url and url.strip())
    has_text = bool(text and text.strip())

    if not has_url:
        unknowns.append("No company or application URL provided to inspect domain legitimacy.")

    if not has_text:
        unknowns.append("No recruiter message or job description text provided to analyze behavioral cues.")
    else:
        text_lower = text.lower()
        if not re.search(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", text):
            unknowns.append("No sender email address found to verify corporate domain ownership.")

        if not any(sal in text_lower for sal in ["salary", "$", "₹", "€", "£", "per year", "per month", "hourly"]):
            unknowns.append("Compensation details and structure were not specified in the message.")

        if not any(kw in text_lower for kw in ["responsibilities", "requirements", "role", "qualifications", "duties"]):
            unknowns.append("Detailed job responsibilities or qualifications are omitted.")

    unknowns.append("Recruiter identity cannot be authenticated without an established corporate email exchange.")
    return unknowns


def run_ai_classifier_hook(text: str, current_score: int) -> int:
    """
    Optional AI classifier hook. Behind environment flag AI_ENABLED (default: False).
    When off, changes nothing. When enabled, can blend subtle semantic embeddings or LLM outputs.
    """
    if not AI_ENABLED:
        return current_score

    # Simulated lightweight AI augmentation when explicitly activated
    # In production, this can call an ONNX local model or an external LLM endpoint
    return current_score


def analyze_recruitment_post(text: Optional[str] = None, url: Optional[str] = None) -> Dict[str, Any]:
    """
    Analyzes submitted job post text and/or URL, returns explainable risk breakdown.
    Never asserts definitely fake or genuine.
    """
    text_clean = (text or "").strip()
    url_clean = (url or "").strip()

    if not text_clean and not url_clean:
        raise ValueError("At least one of 'text' or 'url' must be provided for analysis.")

    # 1. Content Rules Evaluation
    content_flags = evaluate_content_rules(text_clean) if text_clean else []

    # 2. URL Rules Evaluation (offline string heuristic)
    url_flags = evaluate_url_rules(url_clean, text_context=text_clean) if url_clean else []

    all_flags = content_flags + url_flags

    # 3. Weighted Score Computation
    raw_score = sum(f.get("weight", 15) for f in all_flags)

    # Allow AI hook to adjust if enabled
    adjusted_score = run_ai_classifier_hook(text_clean, raw_score)

    # Clamp score between 0 and 100
    score = min(max(adjusted_score, 0), 100)

    # 4. Determine Risk Level
    # HIGH (>= 60), MEDIUM (30-59), LOW (< 30)
    if score >= 60:
        risk_level = "HIGH"
        summary = "Multiple high-severity red flags detected typical of fee or credential recruitment fraud."
    elif score >= 30:
        risk_level = "MEDIUM"
        summary = "Suspicious signals or domain irregularities identified that require cautious independent verification."
    else:
        risk_level = "LOW"
        if len(all_flags) == 0:
            summary = "No obvious red flags found in the provided text. Always verify through official channels."
        else:
            summary = "Minor low-risk phrasing noted. No critical recruitment fraud indicators detected."

    # 5. Unknowns and Checklist
    unknowns = determine_unknowns(text_clean, url_clean)
    checklist = list(DEFAULT_CHECKLIST)

    return {
        "risk_level": risk_level,
        "score": score,
        "summary": summary,
        "flags": all_flags,
        "unknowns": unknowns,
        "checklist": checklist,
        "content_signals": len(content_flags),
        "url_signals": len(url_flags),
        "disclaimer": DISCLAIMER_TEXT,
        "confidence_note": "Based on the information provided and heuristic pattern analysis.",
    }
