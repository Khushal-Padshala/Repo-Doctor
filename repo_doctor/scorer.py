"""
scorer.py — Deterministic 100-point health-score rubric.

Scoring breakdown
-----------------
  Repo Hygiene          30 pts
    +10  .gitignore present
    +10  README.md with >50 words
    + 5  LICENSE present
    + 5  CI workflow present

  Security & Secrets    40 pts  (starts at 40, deductions applied)
    -25  per unique leaked credential (floor 0)
    -15  .env exists but .env.example is missing

  Code Smells           30 pts  (starts at 30, deductions applied)
    - 5  per file > 600 LOC  (cap at -15)
    -10  if TODO/FIXME density > 10
    - 5  per missing lockfile (cap at -10)

Total possible: 100 points.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

# ── Point constants ──────────────────────────────────────────────────────────
_HYGIENE_GITIGNORE = 10
_HYGIENE_README = 10
_HYGIENE_LICENSE = 5
_HYGIENE_CI = 5
_HYGIENE_MAX = _HYGIENE_GITIGNORE + _HYGIENE_README + _HYGIENE_LICENSE + _HYGIENE_CI  # 30

_SECURITY_BASE = 40
_SECURITY_SECRET_DEDUCT = 25   # per unique secret (floor 0)
_SECURITY_DOTENV_DEDUCT = 15   # missing .env.example when .env exists

_CODE_BASE = 30
_CODE_BLOAT_DEDUCT = 5         # per bloated file
_CODE_BLOAT_MAX_DEDUCT = 15    # maximum deduction for bloat
_CODE_TODO_DEDUCT = 10         # density threshold breach
_CODE_LOCKFILE_DEDUCT = 5      # per missing lockfile
_CODE_LOCKFILE_MAX_DEDUCT = 10 # cap


@dataclass
class CategoryScore:
    name: str
    earned: int
    max_points: int
    details: list[str] = field(default_factory=list)

    @property
    def pct(self) -> float:
        return round(self.earned / self.max_points * 100, 1) if self.max_points else 0.0


@dataclass
class HealthScore:
    total: int
    grade: str
    hygiene: CategoryScore
    security: CategoryScore
    code: CategoryScore
    recommendations: list[str] = field(default_factory=list)


def _grade(score: int) -> str:
    """Map a 0-100 score to a letter grade."""
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 65:
        return "C"
    if score >= 50:
        return "D"
    return "F"


def compute(
    hygiene: dict[str, Any],
    secrets: dict[str, Any],
    code: dict[str, Any],
) -> HealthScore:
    """
    Calculate the overall health score from the three check result dicts.

    Parameters
    ----------
    hygiene:
        Result from :func:`repo_doctor.checks.git_hygiene.run`.
    secrets:
        Result from :func:`repo_doctor.checks.secrets.run`.
    code:
        Result from :func:`repo_doctor.checks.code_quality.run`.

    Returns
    -------
    :class:`HealthScore`
    """
    # ── Hygiene (additive) ────────────────────────────────────────────────────
    h_earned = 0
    h_details: list[str] = []
    recs: list[str] = []

    if hygiene["has_gitignore"]:
        h_earned += _HYGIENE_GITIGNORE
        h_details.append(f"[+{_HYGIENE_GITIGNORE}] .gitignore present")
    else:
        h_details.append(f"[ 0] .gitignore missing")
        recs.append("Add a .gitignore tailored to your ecosystem (use --fix to auto-generate).")

    if hygiene["has_readme"]:
        h_earned += _HYGIENE_README
        h_details.append(
            f"[+{_HYGIENE_README}] README.md present ({hygiene['readme_word_count']} words)"
        )
    else:
        h_details.append(
            f"[ 0] README.md missing or too short ({hygiene['readme_word_count']} words, need >50)"
        )
        recs.append("Add or expand your README.md to at least 50 words.")

    if hygiene["has_license"]:
        h_earned += _HYGIENE_LICENSE
        h_details.append(f"[+{_HYGIENE_LICENSE}] LICENSE file present")
    else:
        h_details.append(f"[ 0] LICENSE file missing")
        recs.append("Add a LICENSE file. Use --fix to generate an MIT license stub.")

    if hygiene["has_ci"]:
        h_earned += _HYGIENE_CI
        ci_list = ", ".join(hygiene["ci_files"])
        h_details.append(f"[+{_HYGIENE_CI}] CI workflow(s) found: {ci_list}")
    else:
        h_details.append(f"[ 0] No CI workflow found under .github/workflows/")
        recs.append(
            "Add a GitHub Actions CI workflow (use --fix to generate a baseline ci.yml)."
        )

    hygiene_score = CategoryScore(
        name="Repo Hygiene",
        earned=h_earned,
        max_points=_HYGIENE_MAX,
        details=h_details,
    )

    # ── Security (deductive from base) ───────────────────────────────────────
    s_pool = _SECURITY_BASE
    s_details: list[str] = []

    n_secrets = secrets["unique_secret_count"]
    if n_secrets:
        deduction = min(n_secrets * _SECURITY_SECRET_DEDUCT, s_pool)
        s_pool -= deduction
        s_details.append(
            f"[-{deduction}] {n_secrets} leaked credential(s) detected "
            f"(−{_SECURITY_SECRET_DEDUCT} each, floored at 0)"
        )
        recs.append(
            f"Rotate all leaked credentials immediately! "
            f"Add them to .gitignore / .env and use .env.example for safe sharing."
        )
        for f in secrets["findings"]:
            s_details.append(
                f"       ↳ {f['pattern']} in {f['file']}:{f['line']} ({f['snippet']}…)"
            )
    else:
        s_details.append("[+0 deductions] No leaked credentials detected ✓")

    if secrets["has_dot_env"] and not secrets["has_dot_env_example"]:
        deduction = min(_SECURITY_DOTENV_DEDUCT, s_pool)
        s_pool -= deduction
        s_details.append(
            f"[-{deduction}] .env found but .env.example is missing"
        )
        recs.append(
            ".env.example is missing — use --fix to auto-generate one with values stripped."
        )

    security_score = CategoryScore(
        name="Security & Secrets",
        earned=max(s_pool, 0),
        max_points=_SECURITY_BASE,
        details=s_details,
    )

    # ── Code quality (deductive from base) ───────────────────────────────────
    c_pool = _CODE_BASE
    c_details: list[str] = []

    n_bloated = len(code["bloated_files"])
    if n_bloated:
        deduction = min(n_bloated * _CODE_BLOAT_DEDUCT, _CODE_BLOAT_MAX_DEDUCT)
        c_pool -= deduction
        c_details.append(
            f"[-{deduction}] {n_bloated} file(s) exceed {600} LOC "
            f"(−{_CODE_BLOAT_DEDUCT} each, cap −{_CODE_BLOAT_MAX_DEDUCT})"
        )
        for bf in code["bloated_files"][:5]:
            c_details.append(f"       ↳ {bf['file']}  ({bf['loc']} lines)")
        if n_bloated > 5:
            c_details.append(f"       ↳ … and {n_bloated - 5} more")
        recs.append(
            f"Refactor {n_bloated} oversized file(s) — aim for modules under 600 lines."
        )
    else:
        c_details.append("[+0 deductions] No oversized files detected ✓")

    if code["todo_count"] > 10:
        deduction = min(_CODE_TODO_DEDUCT, c_pool)
        c_pool -= deduction
        c_details.append(
            f"[-{deduction}] High TODO/FIXME density: {code['todo_count']} occurrences (threshold 10)"
        )
        recs.append(
            f"Address or track {code['todo_count']} TODO/FIXME comments in your issue tracker."
        )
    else:
        c_details.append(
            f"[+0 deductions] TODO/FIXME count {code['todo_count']} ≤ threshold ✓"
        )

    n_missing_locks = len(code["missing_lockfiles"])
    if n_missing_locks:
        deduction = min(n_missing_locks * _CODE_LOCKFILE_DEDUCT, _CODE_LOCKFILE_MAX_DEDUCT)
        c_pool -= deduction
        missing_str = ", ".join(code["missing_lockfiles"])
        c_details.append(
            f"[-{deduction}] Missing lockfile(s) for: {missing_str}"
        )
        recs.append(
            f"Commit your lockfile(s) ({missing_str}) to ensure reproducible builds."
        )
    else:
        if code["detected_ecosystems"]:
            c_details.append("[+0 deductions] All ecosystem lockfiles present ✓")

    code_score = CategoryScore(
        name="Code Smells & Organisation",
        earned=max(c_pool, 0),
        max_points=_CODE_BASE,
        details=c_details,
    )

    total = hygiene_score.earned + security_score.earned + code_score.earned

    return HealthScore(
        total=total,
        grade=_grade(total),
        hygiene=hygiene_score,
        security=security_score,
        code=code_score,
        recommendations=recs,
    )
