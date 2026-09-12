"""
api.py — FastAPI backend for Repo Doctor web interface.

Endpoints
---------
POST /api/analyze   { "repo_url": "https://github.com/owner/repo" }
GET  /api/health    Simple health check
"""

from __future__ import annotations

import os
import shutil
import subprocess
import tempfile
import time
import uuid
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, field_validator

from repo_doctor.checks import git_hygiene, secrets as secrets_check, code_quality
from repo_doctor.scorer import compute
from repo_doctor.curer import generate_cures

# ── App setup ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Repo Doctor API",
    description="Repository health diagnostics engine",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── Request / Response models ─────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    repo_url: str

    @field_validator("repo_url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        v = v.strip()
        allowed_prefixes = (
            "https://github.com/",
            "https://gitlab.com/",
            "https://bitbucket.org/",
        )
        if not any(v.startswith(p) for p in allowed_prefixes):
            raise ValueError(
                "Only public GitHub, GitLab, or Bitbucket HTTPS URLs are supported."
            )
        # Strip .git suffix if present — we'll re-add it for cloning
        if v.endswith(".git"):
            v = v[:-4]
        return v


# ── Clone helper ──────────────────────────────────────────────────────────────

def _shallow_clone(repo_url: str, target_dir: str, timeout: int = 60) -> None:
    """
    Perform a shallow clone (depth=1) of *repo_url* into *target_dir*.

    Raises :class:`RuntimeError` on failure.
    """
    cmd = [
        "git", "clone",
        "--depth", "1",
        "--single-branch",
        "--no-tags",
        "--quiet",
        repo_url,
        target_dir,
    ]
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
            env={**os.environ, "GIT_TERMINAL_PROMPT": "0"},
        )
        if result.returncode != 0:
            stderr = result.stderr.strip()
            raise RuntimeError(f"git clone failed: {stderr}")
    except subprocess.TimeoutExpired:
        raise RuntimeError(f"Clone timed out after {timeout}s — repo may be too large.")
    except FileNotFoundError:
        raise RuntimeError("git is not installed or not in PATH.")


# ── Main analyze endpoint ─────────────────────────────────────────────────────

@app.post("/api/analyze")
async def analyze(req: AnalyzeRequest) -> dict[str, Any]:
    """
    Clone *repo_url* (shallow) and run all Repo Doctor checks.

    Returns a complete JSON report suitable for the frontend to render.
    """
    tmp_dir = tempfile.mkdtemp(prefix="repo_doctor_")
    clone_path = os.path.join(tmp_dir, "repo")

    try:
        t0 = time.perf_counter()

        # ── Clone ─────────────────────────────────────────────────────────────
        try:
            _shallow_clone(req.repo_url, clone_path)
        except RuntimeError as exc:
            raise HTTPException(status_code=422, detail=str(exc))

        repo_root = Path(clone_path)

        # ── Run checks ────────────────────────────────────────────────────────
        hygiene = git_hygiene.run(repo_root)
        secrets = secrets_check.run(repo_root)
        code = code_quality.run(repo_root)

        # ── Score ─────────────────────────────────────────────────────────────
        score = compute(hygiene, secrets, code)
        elapsed = round(time.perf_counter() - t0, 2)

        # ── Build issues list ─────────────────────────────────────────────────
        issues: list[dict[str, Any]] = []

        # Hygiene issues
        if not hygiene["has_gitignore"]:
            issues.append({
                "category": "hygiene",
                "severity": "warning",
                "title": "Missing .gitignore",
                "description": "No .gitignore file found. Build artifacts, secrets, and OS files may be accidentally committed.",
                "impact": -10,
            })
        if not hygiene["has_readme"]:
            wc = hygiene["readme_word_count"]
            issues.append({
                "category": "hygiene",
                "severity": "warning",
                "title": f"README too short ({wc} words)" if wc else "Missing README.md",
                "description": "A meaningful README (>50 words) is essential for discoverability and onboarding.",
                "impact": -10,
            })
        if not hygiene["has_license"]:
            issues.append({
                "category": "hygiene",
                "severity": "info",
                "title": "Missing LICENSE file",
                "description": "Without a license, the code is technically All Rights Reserved. Add an open-source license to clarify usage rights.",
                "impact": -5,
            })
        if not hygiene["has_ci"]:
            issues.append({
                "category": "hygiene",
                "severity": "info",
                "title": "No CI/CD workflow found",
                "description": "No GitHub Actions workflow detected under .github/workflows/. Automated testing prevents regressions.",
                "impact": -5,
            })

        # Secret issues
        for finding in secrets["findings"]:
            issues.append({
                "category": "security",
                "severity": "critical",
                "title": f"Leaked credential: {finding['pattern']}",
                "description": (
                    f"Found in {finding['file']} at line {finding['line']}. "
                    f"Token prefix: {finding['snippet']}... — "
                    f"Rotate this credential immediately and remove it from the working tree."
                ),
                "impact": -25,
                "file": finding["file"],
                "line": finding["line"],
            })

        if secrets["has_dot_env"] and not secrets["has_dot_env_example"]:
            issues.append({
                "category": "security",
                "severity": "error",
                "title": "Committed .env without .env.example",
                "description": (
                    "A .env file was found in the repo root but no .env.example exists. "
                    ".env files should be gitignored; .env.example (with values stripped) "
                    "should be committed so contributors know what variables to set."
                ),
                "impact": -15,
            })

        # Code quality issues
        for bf in code["bloated_files"]:
            issues.append({
                "category": "code",
                "severity": "warning",
                "title": f"Oversized file: {bf['file']}",
                "description": f"{bf['file']} has {bf['loc']} lines of code (threshold: 600). Consider splitting it into focused modules.",
                "impact": -5,
                "file": bf["file"],
            })

        if code["todo_count"] > 10:
            issues.append({
                "category": "code",
                "severity": "warning",
                "title": f"High TODO/FIXME density ({code['todo_count']} occurrences)",
                "description": (
                    f"{code['todo_count']} unresolved TODO / FIXME / HACK / XXX comments found. "
                    "Track these in your issue tracker before they become forgotten debt."
                ),
                "impact": -10,
                "locations": code["todo_locations"][:10],
            })

        for ecosystem in code["missing_lockfiles"]:
            issues.append({
                "category": "code",
                "severity": "warning",
                "title": f"Missing lockfile for {ecosystem}",
                "description": (
                    f"A {ecosystem} manifest was detected but no corresponding lockfile exists. "
                    "Lockfiles ensure reproducible, deterministic dependency installs."
                ),
                "impact": -5,
            })

        # ── Generate cures (in-memory, never written to disk) ─────────────────
        cure_result = generate_cures(repo_root, hygiene, secrets)
        unified_diff = cure_result.as_unified_diff(repo_root)

        # Build a list of cure file objects: {path, content, language}
        _LANG_MAP = {
            ".gitignore":              "gitignore",
            ".env.example":            "dotenv",
            "ci.yml":                  "yaml",
            "LICENSE":                 "text",
        }
        cure_files = []
        for rel_path, content in cure_result.files.items():
            filename = rel_path.split("/")[-1]
            cure_files.append({
                "path": rel_path,
                "filename": filename,
                "content": content,
                "language": _LANG_MAP.get(filename, "text"),
            })

        return {
            "repo_url": req.repo_url,
            "elapsed_seconds": elapsed,
            "score": {
                "total": score.total,
                "grade": score.grade,
                "hygiene": {
                    "earned": score.hygiene.earned,
                    "max": score.hygiene.max_points,
                    "pct": score.hygiene.pct,
                },
                "security": {
                    "earned": score.security.earned,
                    "max": score.security.max_points,
                    "pct": score.security.pct,
                },
                "code": {
                    "earned": score.code.earned,
                    "max": score.code.max_points,
                    "pct": score.code.pct,
                },
            },
            "issues": issues,
            "stats": {
                "files_scanned": sum(1 for _ in repo_root.rglob("*") if _.is_file()),
                "secrets_found": secrets["unique_secret_count"],
                "bloated_files": len(code["bloated_files"]),
                "todo_count": code["todo_count"],
                "detected_ecosystems": code["detected_ecosystems"],
            },
            "hygiene_detail": {
                "has_gitignore": hygiene["has_gitignore"],
                "has_readme": hygiene["has_readme"],
                "readme_word_count": hygiene["readme_word_count"],
                "has_license": hygiene["has_license"],
                "has_ci": hygiene["has_ci"],
                "ci_files": hygiene["ci_files"],
            },
            "cures": {
                "files": cure_files,
                "unified_diff": unified_diff,
                "count": len(cure_files),
            },
        }

    finally:
        # Always clean up the temp clone
        shutil.rmtree(tmp_dir, ignore_errors=True)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "version": "0.1.0"}


# ── Serve frontend static files ───────────────────────────────────────────────
_FRONTEND_DIR = Path(__file__).parent.parent / "frontend"

if _FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(_FRONTEND_DIR / "static")), name="static")

    @app.get("/")
    async def serve_index() -> FileResponse:
        return FileResponse(str(_FRONTEND_DIR / "index.html"))
