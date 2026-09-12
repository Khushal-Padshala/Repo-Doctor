"""
scanner.py — File walker with strict directory exclusion.

Walks a repository root and yields (relative_path, absolute_path) tuples
for every scannable file, pruning directories that are irrelevant or
potentially enormous (node_modules, .git, vendor, etc.).

Binary files are detected via a null-byte sniff on the first 8 KB and
are silently skipped so regex checks never choke on them.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Iterator

# ── Pruned directory names (exact match against directory basename) ──────────
PRUNED_DIRS: frozenset[str] = frozenset(
    {
        "node_modules",
        "vendor",
        ".git",
        "dist",
        "build",
        ".venv",
        "venv",
        "__pycache__",
        ".tox",
        ".mypy_cache",
        ".pytest_cache",
        ".cache",
        "coverage",
        ".nyc_output",
        "target",       # Rust/Java
        ".gradle",
        ".idea",
        ".vscode",
    }
)

# Maximum file size we will fully read (4 MB) — guards against accidental blobs
MAX_FILE_BYTES: int = 4 * 1024 * 1024

_BINARY_SNIFF_BYTES: int = 8 * 1024


def is_binary(path: Path) -> bool:
    """Return True if *path* looks like a binary file (null-byte heuristic)."""
    try:
        with path.open("rb") as fh:
            chunk = fh.read(_BINARY_SNIFF_BYTES)
        return b"\x00" in chunk
    except OSError:
        return True


def walk_repo(root: str | Path) -> Iterator[tuple[Path, Path]]:
    """
    Yield ``(relative_path, absolute_path)`` for every text file under *root*.

    Directories in :data:`PRUNED_DIRS` are never descended into.
    Binary files and files larger than :data:`MAX_FILE_BYTES` are skipped.

    Parameters
    ----------
    root:
        Absolute or relative path to the repository root.

    Yields
    ------
    tuple[Path, Path]
        ``(rel_path, abs_path)`` where ``rel_path`` is relative to *root*.
    """
    root = Path(root).resolve()

    for dirpath_str, dirnames, filenames in os.walk(root, topdown=True):
        dirpath = Path(dirpath_str)

        # Prune in-place so os.walk skips the subtree entirely
        dirnames[:] = [
            d for d in dirnames if d not in PRUNED_DIRS and not d.startswith(".")
            or d == ".github"  # keep .github for CI workflow checks
        ]

        for filename in filenames:
            abs_path = dirpath / filename
            rel_path = abs_path.relative_to(root)

            # Skip oversized files
            try:
                if abs_path.stat().st_size > MAX_FILE_BYTES:
                    continue
            except OSError:
                continue

            # Skip binaries
            if is_binary(abs_path):
                continue

            yield rel_path, abs_path


def read_file(path: Path) -> str:
    """
    Read *path* and return its text content, replacing undecodable bytes.

    Returns an empty string if the file cannot be opened.
    """
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""


def count_lines(path: Path) -> int:
    """Return the number of lines in a text file without loading it all."""
    try:
        with path.open("rb") as fh:
            return sum(1 for _ in fh)
    except OSError:
        return 0
