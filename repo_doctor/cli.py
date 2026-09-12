"""
cli.py — Rich-formatted CLI interface for Repo Doctor.

Usage examples
--------------
  python -m repo_doctor.cli analyze ./my-project
  python -m repo_doctor.cli analyze ./my-project --fix
  python -m repo_doctor.cli analyze ./my-project --export-patch patch.diff
"""

from __future__ import annotations

import io
import sys
import time
from pathlib import Path

# Force UTF-8 output on Windows to avoid cp1252 / legacy console encoding errors
if sys.platform == "win32":
    if hasattr(sys.stdout, "buffer"):
        sys.stdout = io.TextIOWrapper(
            sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True
        )
    if hasattr(sys.stderr, "buffer"):
        sys.stderr = io.TextIOWrapper(
            sys.stderr.buffer, encoding="utf-8", errors="replace", line_buffering=True
        )

import typer
from rich import box
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, TimeElapsedColumn
from rich.rule import Rule
from rich.table import Table
from rich.text import Text

from repo_doctor import __version__
from repo_doctor.checks import git_hygiene, secrets as secrets_check, code_quality
from repo_doctor.scorer import compute, HealthScore, CategoryScore
from repo_doctor.curer import generate_cures

# ── App bootstrap ────────────────────────────────────────────────────────────
app = typer.Typer(
    name="repo-doctor",
    help="[Repo Doctor] Fast repository health diagnostics & auto-remediation.",
    add_completion=False,
    pretty_exceptions_enable=False,
)
console = Console(highlight=False, file=sys.stdout)

# ── Grade → colour + label mapping ───────────────────────────────────────────
_GRADE_STYLE: dict[str, str] = {
    "A": "bold green",
    "B": "bold cyan",
    "C": "bold yellow",
    "D": "bold magenta",
    "F": "bold red",
}

_GRADE_LABEL: dict[str, str] = {
    "A": "[A] EXCELLENT",
    "B": "[B] GOOD",
    "C": "[C] FAIR",
    "D": "[D] POOR",
    "F": "[F] CRITICAL",
}


def _score_bar(earned: int, maximum: int, width: int = 20) -> str:
    """Return a simple ASCII progress bar using block chars."""
    filled = int(round(earned / maximum * width)) if maximum else 0
    return "#" * filled + "-" * (width - filled)


def _category_table(category: CategoryScore) -> Table:
    """Render a category breakdown as a Rich Table."""
    pct = category.pct
    if pct >= 80:
        bar_style = "green"
    elif pct >= 55:
        bar_style = "yellow"
    else:
        bar_style = "red"

    table = Table(box=box.SIMPLE, show_header=False, padding=(0, 1))
    table.add_column("Detail", style="dim", no_wrap=False)

    bar = _score_bar(category.earned, category.max_points)
    table.add_row(
        f"[bold]{category.name}[/bold]  "
        f"[{bar_style}]{bar}[/{bar_style}]  "
        f"[bold]{category.earned}[/bold]/[dim]{category.max_points}[/dim] pts"
    )
    for detail in category.details:
        if "[-" in detail:
            icon = "[red]FAIL[/red]"
        elif "->>" in detail or "->" in detail:
            icon = "    "
        elif ":" in detail and detail.strip().startswith("[+"):
            icon = "[green] OK [/green]"
        elif "(c)" in detail or detail.strip().startswith("[+"):
            icon = "[green] OK [/green]"
        else:
            icon = "[dim]INFO[/dim]"

        table.add_row(f"  {icon}  {detail}")

    return table


def _print_report(score: HealthScore, repo_path: Path, elapsed: float) -> None:
    """Pretty-print the full health report to the console."""
    grade = score.grade
    grade_style = _GRADE_STYLE.get(grade, "white")
    grade_label = _GRADE_LABEL.get(grade, grade)

    # ── Header panel ─────────────────────────────────────────────────────────
    header_text = Text()
    header_text.append("=== REPO DOCTOR ===  ", style="bold white")
    header_text.append(f"v{__version__}", style="dim")
    header_text.append(f"\n\nRepo: {repo_path.resolve()}\n", style="dim")
    header_text.append("Overall Health Score\n", style="bold")
    header_text.append(f"  {score.total} / 100  ", style=f"bold {grade_style}")
    header_text.append("Grade: ", style="bold")
    header_text.append(grade_label, style=grade_style)
    header_text.append(f"\n  Analysed in {elapsed:.2f}s", style="dim")

    console.print()
    console.print(
        Panel(header_text, border_style=grade_style, expand=False, padding=(1, 3))
    )
    console.print()

    # ── Category breakdown ───────────────────────────────────────────────────
    console.print(Rule("[bold]Category Breakdown[/bold]", style="dim"))
    console.print()
    for category in (score.hygiene, score.security, score.code):
        console.print(_category_table(category))

    # ── Recommendations ──────────────────────────────────────────────────────
    if score.recommendations:
        console.print()
        console.print(Rule("[bold yellow]>>> Recommended Fixes[/bold yellow]", style="yellow"))
        console.print()
        for i, rec in enumerate(score.recommendations, 1):
            console.print(f"  [yellow]{i}.[/yellow] {rec}")
    else:
        console.print()
        console.print(
            Panel(
                "[bold green]No critical issues found. Your repo is in great shape![/bold green]",
                border_style="green",
            )
        )

    console.print()


# ── Commands ─────────────────────────────────────────────────────────────────

@app.command()
def analyze(
    repo_path: Path = typer.Argument(
        ...,
        help="Path to the repository root to analyse.",
        exists=True,
        file_okay=False,
        dir_okay=True,
        resolve_path=True,
    ),
    fix: bool = typer.Option(
        False,
        "--fix",
        help="Write auto-generated cure files directly to the repository.",
    ),
    export_patch: Path = typer.Option(
        None,
        "--export-patch",
        help="Write a unified Git diff of all cures to this file path.",
    ),
    json_output: bool = typer.Option(
        False,
        "--json",
        help="Output raw JSON (useful for CI/CD pipelines).",
    ),
) -> None:
    """Analyse a repository and report its health score."""
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        TimeElapsedColumn(),
        console=console,
        transient=True,
    ) as progress:
        t0 = time.perf_counter()

        task = progress.add_task("Scanning repository...", total=None)

        hygiene = git_hygiene.run(repo_path)
        progress.update(task, description="Checking for secrets...")

        secrets = secrets_check.run(repo_path)
        progress.update(task, description="Analysing code quality...")

        code = code_quality.run(repo_path)
        progress.update(task, description="Computing health score...")

        score = compute(hygiene, secrets, code)
        elapsed = time.perf_counter() - t0

    # ── JSON mode ─────────────────────────────────────────────────────────────
    if json_output:
        import json

        output = {
            "version": __version__,
            "repo": str(repo_path.resolve()),
            "elapsed_seconds": round(elapsed, 3),
            "score": {
                "total": score.total,
                "grade": score.grade,
                "hygiene": {
                    "earned": score.hygiene.earned,
                    "max": score.hygiene.max_points,
                    "details": score.hygiene.details,
                },
                "security": {
                    "earned": score.security.earned,
                    "max": score.security.max_points,
                    "details": score.security.details,
                },
                "code": {
                    "earned": score.code.earned,
                    "max": score.code.max_points,
                    "details": score.code.details,
                },
            },
            "recommendations": score.recommendations,
            "findings": {
                "secrets": secrets["findings"],
                "bloated_files": code["bloated_files"],
                "todo_count": code["todo_count"],
                "missing_lockfiles": code["missing_lockfiles"],
            },
        }
        console.print_json(json.dumps(output, indent=2))
        raise typer.Exit(0)

    # ── Rich report ───────────────────────────────────────────────────────────
    _print_report(score, repo_path, elapsed)

    # ── Cure generation ───────────────────────────────────────────────────────
    if fix or export_patch:
        cures = generate_cures(repo_path, hygiene, secrets)

        if not cures.files:
            console.print("[green]Nothing to cure - all structural checks passed.[/green]\n")
        else:
            if fix:
                written = cures.write_to_disk(repo_path)
                console.print(Rule("[bold green]Applied Cures[/bold green]", style="green"))
                console.print()
                for path_str in written:
                    console.print(f"  [green]WRITTEN[/green] {path_str}")
                console.print()

            if export_patch:
                diff = cures.as_unified_diff(repo_path)
                if diff:
                    export_patch_path = Path(export_patch)
                    export_patch_path.write_text(diff, encoding="utf-8")
                    console.print(
                        f"[green]Patch exported to:[/green] {export_patch_path}\n"
                    )
                else:
                    console.print("[dim]No diff to export (files already up-to-date).[/dim]\n")

    # Exit with non-zero code when score < 65 (grade C or below)
    if score.total < 65:
        raise typer.Exit(1)


@app.callback(invoke_without_command=True)
def version_callback(
    version: bool = typer.Option(None, "--version", "-V", is_eager=True),
) -> None:
    if version:
        console.print(f"Repo Doctor {__version__}")
        raise typer.Exit()


# ── Entry point for ``python -m repo_doctor.cli`` ────────────────────────────

def main() -> None:
    app()


if __name__ == "__main__":
    main()
