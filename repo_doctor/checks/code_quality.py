"""
code_quality.py — Code smell and organisation checks.

Checks performed
----------------
* Files > 600 lines of code (LOC)
* Unaddressed TODO / FIXME density (> 10 across the entire repo)
* Missing package-manager lockfile for detected ecosystems
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from repo_doctor.scanner import walk_repo, read_file, count_lines

# ── Thresholds ────────────────────────────────────────────────────────────────
LOC_THRESHOLD = 600          # files above this are flagged as "bloated"
TODO_DENSITY_THRESHOLD = 10  # total TODO/FIXME comments above this → penalty

# ── TODO / FIXME pattern ─────────────────────────────────────────────────────
_TODO_RE = re.compile(r"\b(TODO|FIXME|HACK|XXX)\b", re.IGNORECASE)

# ── Known lockfile names keyed by ecosystem label ────────────────────────────
_LOCKFILES: dict[str, list[str]] = {
    "Node/NPM": ["package-lock.json"],
    "Node/Yarn": ["yarn.lock"],
    "Node/pnpm": ["pnpm-lock.yaml"],
    "Python/Poetry": ["poetry.lock"],
    "Python/Pipenv": ["Pipfile.lock"],
    "Ruby": ["Gemfile.lock"],
    "PHP/Composer": ["composer.lock"],
    "Go": ["go.sum"],
    "Rust": ["Cargo.lock"],
}

# Manifest files that signal which ecosystem is in use
_MANIFESTS: dict[str, str] = {
    "package.json": "Node",
    "pyproject.toml": "Python/Poetry",
    "Pipfile": "Python/Pipenv",
    "Gemfile": "Ruby",
    "composer.json": "PHP/Composer",
    "go.mod": "Go",
    "Cargo.toml": "Rust",
}


def run(repo_root: Path) -> dict[str, Any]:
    """
    Analyse *repo_root* for code-quality issues.

    Returns
    -------
    dict with keys:
        ``bloated_files``       – list of {file, loc} for files > LOC_THRESHOLD
        ``todo_count``          – total TODO/FIXME/HACK/XXX occurrences
        ``todo_locations``      – list of {file, line, text} for first 20
        ``missing_lockfiles``   – list of ecosystem names missing a lockfile
        ``detected_ecosystems`` – list of ecosystem labels found
    """
    root = Path(repo_root).resolve()

    bloated_files: list[dict[str, Any]] = []
    todo_count = 0
    todo_locations: list[dict[str, Any]] = []
    top_names: set[str] = set()

    if root.is_dir():
        top_names = {p.name for p in root.iterdir()}

    # Walk repo once for LOC + TODO checks
    for rel_path, abs_path in walk_repo(root):
        # ── LOC check ────────────────────────────────────────────────────────
        loc = count_lines(abs_path)
        if loc > LOC_THRESHOLD:
            bloated_files.append({"file": str(rel_path), "loc": loc})

        # ── TODO / FIXME check ───────────────────────────────────────────────
        content = read_file(abs_path)
        lines = content.splitlines()
        for lineno, line in enumerate(lines, start=1):
            if _TODO_RE.search(line):
                todo_count += 1
                if len(todo_locations) < 20:  # cap list to avoid huge output
                    todo_locations.append(
                        {
                            "file": str(rel_path),
                            "line": lineno,
                            "text": line.strip()[:120],
                        }
                    )

    # ── Lockfile / ecosystem check ────────────────────────────────────────────
    detected_ecosystems: list[str] = []
    for manifest, ecosystem_prefix in _MANIFESTS.items():
        if manifest in top_names:
            detected_ecosystems.append(ecosystem_prefix)

    missing_lockfiles: list[str] = []
    for ecosystem, lockfile_candidates in _LOCKFILES.items():
        ecosystem_prefix = ecosystem.split("/")[0]  # "Node", "Python", etc.
        # Only check if the ecosystem was detected
        if any(e.startswith(ecosystem_prefix) for e in detected_ecosystems):
            if not any(lf in top_names for lf in lockfile_candidates):
                missing_lockfiles.append(ecosystem)

    return {
        "bloated_files": bloated_files,
        "todo_count": todo_count,
        "todo_locations": todo_locations,
        "missing_lockfiles": missing_lockfiles,
        "detected_ecosystems": detected_ecosystems,
    }
