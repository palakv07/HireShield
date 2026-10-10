import re
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse

# ==============================================================================
# CONTENT RULES
# ==============================================================================

# 1. UPFRONT PAYMENT
# Words like registration fee, security deposit, training fee, kit/laptop/uniform charge,
# "pay to confirm/secure your slot", refundable deposit
UPFRONT_PAYMENT_PATTERN = re.compile(
    r"\b(?:"
    r"registration\s+fee|"
    r"security\s+deposit|"
    r"refundable\s+deposit|"
    r"training\s+(?:fee|charges?|cost)|"
    r"(?:laptop|kit|equipment|uniform|materials?)\s+(?:fee|charge|deposit|cost)|"
    r"pay\s+(?:to\s+confirm|to\s+secure|prior\s+to\s+joining|in\s+advance)|"
    r"deposit\s+of\s+[\$₹€£]?\s*\d+|"
    r"fee\s+of\s+[\$₹€£]?\s*\d+|"
    r"processing\s+fee|"
    r"onboarding\s+fee|"
    r"application\s+fee"
    r")\b",
    re.IGNORECASE,
)

# 2. URGENCY / TIME PRESSURE
# "reply within X hours", "limited slots", "act now", "last chance", "urgent requirement"
URGENCY_PATTERN = re.compile(
    r"\b(?:"
    r"reply\s+within\s+(?:\d+|twenty[-\s]?four|forty[-\s]?eight)\s*(?:hours?|hrs?)|"
    r"within\s+\d+\s*(?:hours?|hrs?)|"
    r"limited\s+(?:slots?|openings?|seats?|vacancies)|"
    r"act\s+now|"
    r"last\s+chance|"
    r"urgent\s+hiring|"
    r"immediate\s+joining\s+only|"
    r"offer\s+expires\s+(?:today|in\s+\d+\s*hours?)|"
    r"only\s+\d+\s+slots?\s+left"
    r")\b",
    re.IGNORECASE,
)

# 3. SENSITIVE DATA REQUEST
# Aadhaar/SSN/passport/ID, bank or card details, OTP, passwords before formal offer
SENSITIVE_DATA_PATTERN = re.compile(
    r"\b(?:"
    r"bank\s+(?:account|details?|routing)|"
    r"(?:credit|debit)\s+card|"
    r"(?:cvv|cve|pin\s+number)|"
    r"(?:social\s+security\s+number|ssn)|"
    r"(?:aadhaar|aadhar|pan\s+card|passport\s+number)|"
    r"(?:otp|one[-\s]?time\s+password)|"
    r"(?:login\s+credentials?|password)"
    r")\b",
    re.IGNORECASE,
)

# 4. OFF-PLATFORM PIVOT
# Pivots immediately to WhatsApp, Telegram, personal Gmail, WeChat, Signal
OFF_PLATFORM_PATTERN = re.compile(
    r"\b(?:"
    r"(?:reach|contact|message|chat|ping|connect)\s+(?:(?:with\s+)?me\s+)?on\s+(?:whatsapp|telegram|signal|wechat)|"
    r"(?:whatsapp|telegram|signal)\s+(?:at|number|me|chat|link)|"
    r"send\s+resume\s+to\s+[a-zA-Z0-9._%+-]+@(?:gmail|yahoo|outlook|hotmail)\.com|"
    r"dm\s+(?:on\s+)?(?:telegram|whatsapp|signal)"
    r")\b",
    re.IGNORECASE,
)

# 5. TOO GOOD TO BE TRUE / UNREALISTIC OFFERS
# High pay with no experience, no interview needed, guaranteed placement
TOO_GOOD_PATTERN = re.compile(
    r"\b(?:"
    r"no\s+interview\s+needed|"
    r"no\s+interview\s+required|"
    r"direct\s+selection|"
    r"guaranteed\s+(?:placement|job|selection)|"
    r"earn\s+\$?\d{3,}\s*(?:per\s+day|/day|daily)|"
    r"earn\s+(?:\$|₹|£|€)?\s*(?:5[0-9]{4}|[6-9][0-9]{4}|[1-9][0-9]{5,})\s*(?:per\s+month|/month|monthly)\s*(?:with\s+no\s+experience|for\s+freshers?|simple\s+tasks?)|"
    r"no\s+skills?\s+or\s+experience\s+required|"
    r"work\s+\d+\s+hours?\s+earn\s+\$?\d{3,}"
    r")\b",
    re.IGNORECASE,
)

# 6. GENERIC / FREEMAIL SENDER CLAIMING ENTERPRISE
# When the text explicitly mentions well-known corporations but gives a freemail contact
KNOWN_ENTERPRISES = [
    "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Deloitte",
    "TCS", "Infosys", "Wipro", "Accenture", "McKinsey", "Goldman Sachs",
    "JP Morgan", "IBM", "Intel", "Cisco", "Oracle", "Tesla"
]
FREEMAIL_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "rediffmail.com", "mail.com"]

# 7. POOR GRAMMAR / PRESSURE PATTERNS
POOR_GRAMMAR_PATTERN = re.compile(
    r"\b(?:"
    r"kindly\s+(?:revert|pay|deposit|share\s+fast)|"
    r"congratulation\s+you\s+are\s+selected\s+for\s+job|"
    r"dear\s+applicant\s+kindly|"
    r"100%\s+legit|"
    r"urgent\s+revert\s+back"
    r")\b",
    re.IGNORECASE,
)


def evaluate_content_rules(text: str) -> List[Dict[str, Any]]:
    """Evaluates text content against heuristic recruitment fraud rules."""
    flags: List[Dict[str, Any]] = []
    if not text:
        return flags

    # Rule 1: Upfront Payment (High)
    for match in UPFRONT_PAYMENT_PATTERN.finditer(text):
        flags.append({
            "id": "RULE_FEE_UPFRONT",
            "title": "Upfront Payment or Deposit Required",
            "severity": "HIGH",
            "weight": 40,
            "evidence": match.group(0),
            "span": [match.start(), match.end()],
            "why": "Legitimate employers never require candidates to pay fees for applications, equipment, training, or onboarding.",
        })

    # Rule 2: Sensitive Data Request (High)
    for match in SENSITIVE_DATA_PATTERN.finditer(text):
        flags.append({
            "id": "RULE_SENSITIVE_DATA",
            "title": "Premature Sensitive Data or Credential Request",
            "severity": "HIGH",
            "weight": 35,
            "evidence": match.group(0),
            "span": [match.start(), match.end()],
            "why": "Official hiring processes do not request bank routing numbers, government IDs, or OTPs prior to a formal, verified written offer.",
        })

    # Rule 3: Urgency / Time Pressure (Medium)
    for match in URGENCY_PATTERN.finditer(text):
        flags.append({
            "id": "RULE_URGENCY_PRESSURE",
            "title": "Artificial Urgency or Time Pressure",
            "severity": "MEDIUM",
            "weight": 20,
            "evidence": match.group(0),
            "span": [match.start(), match.end()],
            "why": "Scammers manufacture artificial deadlines to prevent applicants from verifying credentials or consulting mentors.",
        })

    # Rule 4: Off-Platform Pivot (Medium)
    for match in OFF_PLATFORM_PATTERN.finditer(text):
        flags.append({
            "id": "RULE_OFF_PLATFORM_PIVOT",
            "title": "Pivot to Unmonitored Channels (WhatsApp / Telegram)",
            "severity": "MEDIUM",
            "weight": 30,
            "evidence": match.group(0),
            "span": [match.start(), match.end()],
            "why": "Moving communication away from verified professional platforms evades security filters and leaves no corporate audit trail.",
        })

    # Rule 5: Too-Good-To-Be-True Terms (Medium)
    for match in TOO_GOOD_PATTERN.finditer(text):
        flags.append({
            "id": "RULE_TOO_GOOD_TRUE",
            "title": "Unrealistic Compensation or Bypassed Interview",
            "severity": "MEDIUM",
            "weight": 25,
            "evidence": match.group(0),
            "span": [match.start(), match.end()],
            "why": "Guaranteed jobs without formal interviews or unusually high compensation for minimal experience are common bait tactics.",
        })

    # Rule 6: Generic Free-mail claiming Enterprise (Medium)
    text_lower = text.lower()
    email_matches = re.finditer(r"\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b", text)
    for email_match in email_matches:
        domain = email_match.group(1).lower()
        if domain in FREEMAIL_DOMAINS:
            # Check if any known enterprise is cited in the text
            for ent in KNOWN_ENTERPRISES:
                if ent.lower() in text_lower:
                    flags.append({
                        "id": "RULE_FREEMAIL_IMPERSONATION",
                        "title": f"Public Email Domain Claiming {ent} Affiliation",
                        "severity": "MEDIUM",
                        "weight": 25,
                        "evidence": email_match.group(0),
                        "span": [email_match.start(), email_match.end()],
                        "why": f"Recruiters representing {ent} communicate via verified corporate domain emails, not free personal email accounts.",
                    })
                    break

    # Rule 7: Poor Grammar with Pressure (Low)
    for match in POOR_GRAMMAR_PATTERN.finditer(text):
        flags.append({
            "id": "RULE_GRAMMAR_PRESSURE",
            "title": "Irregular Phrasing & Pressure Pattern",
            "severity": "LOW",
            "weight": 10,
            "evidence": match.group(0),
            "span": [match.start(), match.end()],
            "why": "Unprofessional grammar combined with solicitations often signals mass-templated outreach rather than genuine recruiting.",
        })

    # Deduplicate flags with overlapping spans and identical rule IDs
    unique_flags = []
    seen = set()
    for f in flags:
        key = (f["id"], f["span"][0], f["span"][1])
        if key not in seen:
            seen.add(key)
            unique_flags.append(f)

    return unique_flags


# ==============================================================================
# URL RULES
# ==============================================================================

SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "ow.ly", "buff.ly", "goo.gl",
    "cutt.ly", "shorturl.at", "rb.gy", "rebrand.ly"
}

SUSPICIOUS_TLDS = {
    ".xyz", ".top", ".buzz", ".rest", ".monster", ".tk", ".ml", ".ga", ".cf",
    ".gq", ".work", ".click", ".link", ".live", ".fit", ".icu"
}

IP_HOST_PATTERN = re.compile(
    r"^(?:\d{1,3}\.){3}\d{1,3}$"
)

TYPOSQUAT_PATTERNS = [
    (r"(?:careers?|jobs?|recruitment|portal|apply)[-_.](?:google|amazon|microsoft|apple|meta|netflix|deloitte)", "Lookalike domain combining brand with hiring keywords"),
    (r"(?:google|amazon|microsoft|apple|meta|netflix|deloitte)[-_.](?:careers?|jobs?|verify|secure|hire)", "Lookalike domain combining brand with hiring keywords"),
    (r"g00gle|amaz0n|m1crosoft|app1e|paypa1", "Character substitution / leetspeak brand imitation"),
]


def evaluate_url_rules(url: str, text_context: Optional[str] = None) -> List[Dict[str, Any]]:
    """Evaluates candidate URL strings without performing external network requests."""
    flags: List[Dict[str, Any]] = []
    if not url or not url.strip():
        return flags

    url_str = url.strip()
    # Normalize with scheme if missing for urlparse
    parsed = urlparse(url_str if "://" in url_str else f"http://{url_str}")
    hostname = (parsed.hostname or "").lower()

    # Rule 1: Non-HTTPS (Medium)
    if parsed.scheme == "http":
        flags.append({
            "id": "RULE_URL_NON_HTTPS",
            "title": "Insecure Connection (HTTP instead of HTTPS)",
            "severity": "MEDIUM",
            "weight": 15,
            "evidence": url_str[:30],
            "span": [0, len(url_str)],
            "why": "Legitimate enterprise portals always serve applicant tracking and login workflows over encrypted HTTPS connections.",
        })

    # Rule 2: IP-address host (High)
    if IP_HOST_PATTERN.match(hostname):
        flags.append({
            "id": "RULE_URL_IP_HOST",
            "title": "Direct IP Address Host",
            "severity": "HIGH",
            "weight": 35,
            "evidence": hostname,
            "span": [0, len(url_str)],
            "why": "Standard corporate hiring systems use registered brand domains, never bare numerical IP addresses.",
        })

    # Rule 3: URL Shortener (Medium)
    if hostname in SHORTENER_DOMAINS:
        flags.append({
            "id": "RULE_URL_SHORTENER",
            "title": "Shortened or Obfuscated Link",
            "severity": "MEDIUM",
            "weight": 30,
            "evidence": hostname,
            "span": [0, len(url_str)],
            "why": "URL shorteners conceal the true destination domain, commonly used in phishing campaigns to bypass inspection.",
        })

    # Rule 4: Suspicious / Low-Reputation TLD (Medium)
    for tld in SUSPICIOUS_TLDS:
        if hostname.endswith(tld):
            flags.append({
                "id": "RULE_URL_SUSPICIOUS_TLD",
                "title": f"Unusual Top-Level Domain ({tld})",
                "severity": "MEDIUM",
                "weight": 20,
                "evidence": hostname,
                "span": [0, len(url_str)],
                "why": f"Global employers rarely host corporate career portals on low-cost generic TLDs like {tld}.",
            })
            break

    # Rule 5: Typosquatted / Brand-masquerade Domain (High / Medium)
    for pattern, reason in TYPOSQUAT_PATTERNS:
        if re.search(pattern, hostname):
            flags.append({
                "id": "RULE_URL_LOOKALIKE",
                "title": "Lookalike / Typosquatted Brand Domain",
                "severity": "HIGH",
                "weight": 30,
                "evidence": hostname,
                "span": [0, len(url_str)],
                "why": f"{reason}. Scammers register similar spellings or hyphens to impersonate reputable firms.",
            })
            break

    # Rule 6: Excessive Subdomains (Medium)
    subdomain_parts = hostname.split(".")
    # If more than 3 parts (e.g. login.careers.portal.example.com)
    if len(subdomain_parts) >= 4 and not IP_HOST_PATTERN.match(hostname):
        flags.append({
            "id": "RULE_URL_EXCESSIVE_SUBDOMAINS",
            "title": "Excessive Subdomain Nesting",
            "severity": "MEDIUM",
            "weight": 15,
            "evidence": hostname,
            "span": [0, len(url_str)],
            "why": "Heavily nested subdomains are often crafted to push the genuine base domain out of view on mobile screens.",
        })

    # Rule 7: Brand mismatch between Text Context and URL Domain (Medium)
    if text_context and hostname:
        text_lower = text_context.lower()
        for brand in KNOWN_ENTERPRISES:
            brand_clean = brand.lower().replace(" ", "")
            # If text explicitly claims brand, but hostname is not that brand
            if brand.lower() in text_lower:
                # Hostname does not contain brand root
                if brand_clean not in hostname and hostname not in SHORTENER_DOMAINS:
                    flags.append({
                        "id": "RULE_URL_BRAND_MISMATCH",
                        "title": f"Domain Does Not Match Claimed Brand ({brand})",
                        "severity": "MEDIUM",
                        "weight": 20,
                        "evidence": f"Claims {brand} but links to {hostname}",
                        "span": [0, len(url_str)],
                        "why": f"The message names {brand}, yet the destination points to an unaffiliated domain ({hostname}).",
                    })
                    break

    return flags
