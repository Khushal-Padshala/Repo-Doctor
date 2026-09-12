"""
git_hygiene.py — Checks for essential repository hygiene files.

Checks performed
----------------
* .gitignore present
* README.md present AND contains > 50 words
* LICENSE (or LICENCE) file present
* CI configuration under .github/workflows/ present
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from repo_doctor.scanner import read_file, walk_repo


# ── Public API ───────────────────────────────────────────────────────────────

def run(repo_root: Path) -> dict[str, Any]:
    """
    Inspect *repo_root* for basic hygiene files.

    Returns
    -------
    dict with keys:
        ``has_gitignore``, ``has_readme``, ``readme_word_count``,
        ``has_license``, ``has_ci``, ``ci_files`` (list[str])
    """
    findings: dict[str, Any] = {
        "has_gitignore": False,
        "has_readme": False,
        "readme_word_count": 0,
        "has_license": False,
        "has_ci": False,
        "ci_files": [],
    }

    root = Path(repo_root).resolve()

    # Use a top-level listing rather than full walk for speed on hygiene checks
    top_level = list(root.iterdir()) if root.is_dir() else []
    top_names_lower = {p.name.lower(): p for p in top_level}

    # ── .gitignore ───────────────────────────────────────────────────────────
    if ".gitignore" in top_names_lower:
        findings["has_gitignore"] = True

    # ── README ───────────────────────────────────────────────────────────────
    readme_candidates = [
        name for name in top_names_lower
        if name.startswith("readme")
    ]
    if readme_candidates:
        readme_path = top_names_lower[readme_candidates[0]]
        content = read_file(readme_path)
        word_count = len(content.split())
        findings["has_readme"] = word_count > 50
        findings["readme_word_count"] = word_count

    # ── LICENSE ──────────────────────────────────────────────────────────────
    license_candidates = [
        name for name in top_names_lower
        if name in ("license", "license.md", "license.txt",
                    "licence", "licence.md", "licence.txt")
    ]
    if license_candidates:
        findings["has_license"] = True

    # ── CI workflows ─────────────────────────────────────────────────────────
    workflows_dir = root / ".github" / "workflows"
    if workflows_dir.is_dir():
        ci_files = [
            p.name for p in workflows_dir.iterdir()
            if p.suffix in (".yml", ".yaml") and p.is_file()
        ]
        if ci_files:
            findings["has_ci"] = True
            findings["ci_files"] = ci_files

    return findings
