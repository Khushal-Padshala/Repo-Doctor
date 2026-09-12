"""
test_scanner.py — Unit tests for the file walker and supporting utilities.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

import pytest

from repo_doctor.scanner import (
    PRUNED_DIRS,
    is_binary,
    walk_repo,
    read_file,
    count_lines,
)


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture()
def tmp_repo(tmp_path: Path) -> Path:
    """Create a minimal fake repository structure for testing."""
    # Normal files
    (tmp_path / "README.md").write_text("# Hello\n\nThis is a test repo.\n")
    (tmp_path / "app.py").write_text("print('hello')\n" * 10)
    (tmp_path / ".gitignore").write_text("*.pyc\n__pycache__/\n")

    # Pruned directories — should NOT be walked
    node_modules = tmp_path / "node_modules"
    node_modules.mkdir()
    (node_modules / "lodash.js").write_text("// lodash\n")

    git_dir = tmp_path / ".git"
    git_dir.mkdir()
    (git_dir / "HEAD").write_text("ref: refs/heads/main\n")

    venv_dir = tmp_path / ".venv"
    venv_dir.mkdir()
    (venv_dir / "activate").write_text("#!/bin/sh\n")

    # Nested legitimate directory
    src = tmp_path / "src"
    src.mkdir()
    (src / "utils.py").write_text("def add(a, b):\n    return a + b\n")

    return tmp_path


@pytest.fixture()
def binary_file(tmp_path: Path) -> Path:
    """Create a binary file (contains null bytes)."""
    p = tmp_path / "image.png"
    p.write_bytes(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00")
    return p


@pytest.fixture()
def text_file(tmp_path: Path) -> Path:
    """Create a plain text file."""
    p = tmp_path / "hello.txt"
    p.write_text("Hello, world!\n")
    return p


# ── is_binary ─────────────────────────────────────────────────────────────────

class TestIsBinary:
    def test_binary_file_detected(self, binary_file: Path) -> None:
        assert is_binary(binary_file) is True

    def test_text_file_not_binary(self, text_file: Path) -> None:
        assert is_binary(text_file) is False

    def test_nonexistent_path_returns_true(self, tmp_path: Path) -> None:
        assert is_binary(tmp_path / "does_not_exist.bin") is True

    def test_empty_file_not_binary(self, tmp_path: Path) -> None:
        p = tmp_path / "empty.txt"
        p.write_bytes(b"")
        assert is_binary(p) is False


# ── walk_repo ─────────────────────────────────────────────────────────────────

class TestWalkRepo:
    def test_yields_normal_files(self, tmp_repo: Path) -> None:
        found = {rel for rel, _ in walk_repo(tmp_repo)}
        assert Path("README.md") in found
        assert Path("app.py") in found

    def test_prunes_node_modules(self, tmp_repo: Path) -> None:
        found = {str(rel) for rel, _ in walk_repo(tmp_repo)}
        assert not any("node_modules" in p for p in found)

    def test_prunes_git_dir(self, tmp_repo: Path) -> None:
        found = {str(rel) for rel, _ in walk_repo(tmp_repo)}
        git_sep = ".git" + os.sep
        # Ensure nothing inside the .git directory is returned
        assert not any(git_sep in p for p in found), \
            f"Found .git internals in: {[p for p in found if git_sep in p]}"

    def test_prunes_venv(self, tmp_repo: Path) -> None:
        found = {str(rel) for rel, _ in walk_repo(tmp_repo)}
        assert not any(".venv" in p for p in found)

    def test_walks_nested_dirs(self, tmp_repo: Path) -> None:
        found = {rel for rel, _ in walk_repo(tmp_repo)}
        assert Path("src") / "utils.py" in found

    def test_skips_binary_files(self, tmp_repo: Path) -> None:
        binary = tmp_repo / "data.bin"
        binary.write_bytes(b"\x00" * 100)
        found = {str(rel) for rel, _ in walk_repo(tmp_repo)}
        assert "data.bin" not in found

    def test_returns_absolute_paths(self, tmp_repo: Path) -> None:
        for rel, abs_path in walk_repo(tmp_repo):
            assert abs_path.is_absolute()

    def test_skips_oversized_files(self, tmp_repo: Path) -> None:
        """Files larger than MAX_FILE_BYTES should be silently skipped."""
        from repo_doctor.scanner import MAX_FILE_BYTES
        big = tmp_repo / "huge.log"
        # Write just enough bytes to exceed the limit
        big.write_bytes(b"x" * (MAX_FILE_BYTES + 1))
        found = {str(rel) for rel, _ in walk_repo(tmp_repo)}
        assert "huge.log" not in found

    def test_empty_repo(self, tmp_path: Path) -> None:
        assert list(walk_repo(tmp_path)) == []


# ── read_file ─────────────────────────────────────────────────────────────────

class TestReadFile:
    def test_reads_text(self, text_file: Path) -> None:
        content = read_file(text_file)
        assert "Hello, world!" in content

    def test_nonexistent_returns_empty(self, tmp_path: Path) -> None:
        assert read_file(tmp_path / "missing.txt") == ""

    def test_handles_encoding_errors(self, tmp_path: Path) -> None:
        p = tmp_path / "latin1.txt"
        p.write_bytes(b"caf\xe9 au lait\n")
        content = read_file(p)
        assert "caf" in content  # replacement char used, not raised


# ── count_lines ───────────────────────────────────────────────────────────────

class TestCountLines:
    def test_counts_correctly(self, tmp_path: Path) -> None:
        p = tmp_path / "multi.txt"
        p.write_text("line1\nline2\nline3\n")
        assert count_lines(p) == 3

    def test_empty_file(self, tmp_path: Path) -> None:
        p = tmp_path / "empty.txt"
        p.write_bytes(b"")
        assert count_lines(p) == 0

    def test_nonexistent_returns_zero(self, tmp_path: Path) -> None:
        assert count_lines(Path("/nonexistent/path.txt")) == 0


# ── Pruned dirs set sanity check ──────────────────────────────────────────────

class TestPrunedDirs:
    def test_required_dirs_pruned(self) -> None:
        essential = {"node_modules", ".git", "vendor", ".venv", "dist", "build"}
        assert essential.issubset(PRUNED_DIRS)

    def test_github_dir_allowed(self) -> None:
        """The .github directory must NOT be pruned (CI workflow checks need it)."""
        assert ".github" not in PRUNED_DIRS
