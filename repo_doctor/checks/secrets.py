"""
secrets.py — Deterministic regex scanner for high-confidence leaked credentials.

Design principles
-----------------
* ONLY flag unambiguous, high-entropy token formats that are unmistakably
  real credentials (e.g. ``ghp_``, ``AKIA…``, ``sk_live_``).
* NEVER scan Git history — working tree only.
* NEVER flag generic variable names or low-confidence patterns.
* Each finding records the file path, line number, pattern name, and a
  redacted snippet so we don't echo the real secret.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from repo_doctor.scanner import walk_repo, read_file

# ── Secret patterns — ordered from most- to least-specific ──────────────────
#
# Each entry:  (name, compiled_regex)
# The regex must capture only genuine, unambiguous tokens.
#
SECRET_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    # GitHub personal access tokens (classic)
    (
        "GitHub Token (classic)",
        re.compile(r"ghp_[A-Za-z0-9]{36}", re.ASCII),
    ),
    # GitHub fine-grained tokens
    (
        "GitHub Fine-Grained Token",
        re.compile(r"github_pat_[A-Za-z0-9_]{82}", re.ASCII),
    ),
    # AWS Access Key ID
    (
        "AWS Access Key ID",
        re.compile(r"AKIA[0-9A-Z]{16}", re.ASCII),
    ),
    # Stripe live secret key
    (
        "Stripe Live Secret Key",
        re.compile(r"sk_live_[A-Za-z0-9]{24,}", re.ASCII),
    ),
    # Stripe live publishable key (lower severity but still leaks env info)
    (
        "Stripe Live Publishable Key",
        re.compile(r"pk_live_[A-Za-z0-9]{24,}", re.ASCII),
    ),
    # Generic JWT-shaped bearer token (3 base64url segments)
    # Only flag when it looks like it was assigned, not a placeholder
    # Skipped — too noisy for a hackathon demo scope.

    # Private RSA key header
    (
        "Private RSA Key",
        re.compile(r"-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----", re.ASCII),
    ),
    # Slack bot/workspace token
    (
        "Slack Bot Token",
        re.compile(r"xoxb-[0-9]{10,13}-[0-9]{10,13}-[A-Za-z0-9]{24}", re.ASCII),
    ),
    # Slack user OAuth token
    (
        "Slack User Token",
        re.compile(r"xoxp-[0-9]{10,13}-[0-9]{10,13}-[0-9]{10,13}-[A-Za-z0-9]{32}", re.ASCII),
    ),
    # Twilio account SID + auth token pair (SID alone is non-sensitive)
    (
        "Twilio Auth Token",
        re.compile(r"SK[0-9a-fA-F]{32}", re.ASCII),
    ),
    # Sendgrid API key
    (
        "SendGrid API Key",
        re.compile(r"SG\.[A-Za-z0-9\-_]{22}\.[A-Za-z0-9\-_]{43}", re.ASCII),
    ),
    # Heroku API key
    (
        "Heroku API Key",
        re.compile(
            r"[hH]eroku.*['\"][0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}"
            r"-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}['\"]",
        ),
    ),
    # Generic high-entropy hex secret (≥40 chars) assigned to a suspicious key
    (
        "Possible High-Entropy Secret",
        re.compile(
            r"""(?:secret|api_?key|auth_?token|access_?token|private_?key)\s*[=:]\s*['"]([0-9a-fA-F]{40,})['"]""",
            re.IGNORECASE,
        ),
    ),
]

# Files that are themselves secret stores — skip scanning their content
# (they're flagged separately as missing-from-.gitignore issues)
_SKIP_FILENAMES: frozenset[str] = frozenset(
    {".env", ".env.local", ".env.production", ".env.staging"}
)


def _redact(match_str: str, keep: int = 6) -> str:
    """Return first *keep* chars + asterisks, masking the rest."""
    if len(match_str) <= keep:
        return "***"
    return match_str[:keep] + "*" * min(len(match_str) - keep, 12)


def run(repo_root: Path) -> dict[str, Any]:
    """
    Scan all text files in *repo_root* for leaked credentials.

    Returns
    -------
    dict with keys:
        ``findings`` – list of finding dicts, each with:
            ``pattern``, ``file``, ``line``, ``snippet``
        ``has_dot_env`` – bool, True if a ``.env`` file was found in root
        ``has_dot_env_example`` – bool
        ``unique_secret_count`` – int (de-duplicated by pattern+file)
    """
    findings: list[dict[str, Any]] = []
    seen: set[tuple[str, str]] = set()  # (pattern_name, rel_path)

    root = Path(repo_root).resolve()
    has_dot_env = False
    has_dot_env_example = False

    # Check top-level for .env files
    if root.is_dir():
        for item in root.iterdir():
            if item.name == ".env":
                has_dot_env = True
            if item.name in (".env.example", ".env.sample", ".env.template"):
                has_dot_env_example = True

    for rel_path, abs_path in walk_repo(root):
        # Skip .env files themselves — they're expected to have secrets
        if abs_path.name in _SKIP_FILENAMES:
            continue

        content = read_file(abs_path)
        if not content:
            continue

        lines = content.splitlines()
        for lineno, line in enumerate(lines, start=1):
            for pattern_name, pattern in SECRET_PATTERNS:
                match = pattern.search(line)
                if match:
                    dedup_key = (pattern_name, str(rel_path))
                    if dedup_key in seen:
                        continue
                    seen.add(dedup_key)
                    findings.append(
                        {
                            "pattern": pattern_name,
                            "file": str(rel_path),
                            "line": lineno,
                            "snippet": _redact(match.group(0)),
                        }
                    )

    return {
        "findings": findings,
        "has_dot_env": has_dot_env,
        "has_dot_env_example": has_dot_env_example,
        "unique_secret_count": len(findings),
    }
