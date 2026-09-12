# 🩺 Repo Doctor

**Fast, deterministic repository health diagnostics & auto-remediation engine with modern Web UI and CLI.**

Repo Doctor inspects any local or public Git repository (Git hygiene + source code + security secrets), calculates an objective **100-point Health Score**, itemizes actionable diagnoses with concrete file and line locations, and safely prepares deterministic "Doctor's Cure" patches (unified `.diff` ready for PR) — all in under 2 seconds.

---

## ✨ Key Features

- **🌐 Interactive Web Dashboard**: Dark-mode UI with live animated scan progress, score breakdowns, filterable issue list, and safe code preview.
- **💻 CLI Diagnostics Tool**: Rich terminal output with progress spinners, colored letter grades (A–F), and JSON export for CI/CD pipelines.
- **🔐 High-Precision Secret Scanner**: Zero-hallucination regexes detecting leaked production keys (`ghp_`, `AKIA...`, `sk_live_`, RSA private keys, Slack/SendGrid tokens, etc.).
- **🧹 Code Quality & Maintainability**: Flags monolithic files (>600 LOC), unaddressed TODO/FIXME comments, and missing lockfiles.
- **💊 Doctor's Cures (Auto-Fix Generator)**: Generates tailored `.gitignore`, `.env.example`, `.github/workflows/ci.yml`, and `LICENSE` in-memory without modifying your repository.
- **⚡ Blazing Fast**: In-memory scan and directory pruning (`node_modules/`, `.git/`, `.venv/` skipped) finishes scans in milliseconds.

---

## 🚀 Complete Step-by-Step Setup Guide

Follow these instructions to run Repo Doctor on **any computer** (Windows, macOS, or Linux) after cloning or downloading the `.zip` file.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Python 3.9+** ([Download Python](https://www.python.org/downloads/)) — *Make sure to check "Add Python to PATH" on Windows during installation*.
- **Git** ([Download Git](https://git-scm.com/downloads)) — *Required for cloning repos in the web UI*.

---

### 2. Extract / Open the Project

#### Option A: If you downloaded a ZIP file
1. Right-click the `.zip` file and extract it to a folder (e.g., `repo_doctor/`).
2. Open your terminal or command prompt inside the extracted `repo_doctor` folder:
   - **Windows**: Open the folder in File Explorer, type `powershell` or `cmd` in the address bar, and press **Enter**.
   - **macOS / Linux**: Open Terminal and `cd path/to/repo_doctor`.

#### Option B: If you cloned via Git
```bash
git clone <YOUR_REPO_URL>
cd repo_doctor
```

---

### 3. Create & Activate a Virtual Environment (Recommended)

Creating a clean virtual environment ensures dependencies don't conflict with other Python packages on your system.

**On Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```
*(If PowerShell gives a script execution policy error, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` and try activating again).*

**On Windows (Command Prompt / CMD):**
```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

**On macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

### 4. Install Dependencies

Install all required packages with a single command:

```bash
pip install -r requirements.txt
```

*(Optional for developers)* If you want to install dev tools and run the full test suite:
```bash
pip install -e ".[dev]"
```

---

### 5. Running Repo Doctor

#### 🌐 Method A: Launch the Web UI (Recommended)
Start the local web server:
```bash
python serve.py
```
Output will display:
```
  [Repo Doctor] Web UI
  -------------------------------------
  Open:  http://127.0.0.1:8000
  API:   http://127.0.0.1:8000/api/analyze
  Stop:  Ctrl+C
```
👉 Open **`http://localhost:8000`** in your browser!

**How to test in Web UI:**
1. Paste any public GitHub repo URL into the box (e.g. `https://github.com/octocat/Hello-World`).
2. Click **Scan**.
3. View the live Score, Category breakdowns, itemized issues, and expand **"View Recommended Cures"** to preview and copy fix files.

---

#### 💻 Method B: Run via Terminal CLI
You can analyze any local folder or project directly from the command line:

```bash
# Analyze a project directory
python -m repo_doctor.cli analyze ./path/to/any-repo

# Test the included broken repo fixture
python -m repo_doctor.cli analyze ./tests/fixtures/bad_repo

# Auto-generate and apply fix files directly to the directory
python -m repo_doctor.cli analyze ./my-repo --fix

# Export a unified Git diff (.diff) patch file
python -m repo_doctor.cli analyze ./my-repo --export-patch cures.diff

# Output JSON for CI/CD pipelines
python -m repo_doctor.cli analyze ./my-repo --json
```

---

### 6. Running Automated Tests

Run the full automated test suite (21 unit tests covering scanner, directory pruning, binary detection, scoring):

```bash
pytest
```
Expected output:
```
============================= 21 passed in 0.46s ==============================
```

---

## 📊 100-Point Scoring Rubric

Repo Doctor uses a transparent, deterministic mathematical scoring model:

```
Total: 100 points

┌─────────────────────────────┬───────┬─────────────────────────────────────────┐
│ Category                    │ Pts   │ Rule                                    │
├─────────────────────────────┼───────┼─────────────────────────────────────────┤
│ Repo Hygiene (additive)     │  /30  │                                         │
│   .gitignore present        │ +10   │ Prevents committing artifacts & secrets │
│   README.md (>50 words)     │ +10   │ Baseline onboarding documentation       │
│   LICENSE file              │  +5   │ Clarifies open-source permissions       │
│   CI workflow (.github/)    │  +5   │ Automated regression testing            │
├─────────────────────────────┼───────┼─────────────────────────────────────────┤
│ Security & Secrets (deduct) │  /40  │ Starts at 40, deductions applied        │
│   Leaked credential         │ -25   │ per unique high-entropy token (floor 0) │
│   Missing .env.example      │ -15   │ when .env is committed                  │
├─────────────────────────────┼───────┼─────────────────────────────────────────┤
│ Code Smells (deduct)        │  /30  │ Starts at 30, deductions applied        │
│   Files > 600 LOC           │  -5   │ per bloated file (cap -15)              │
│   TODO/FIXME density > 10   │ -10   │ Unmanaged technical debt backlog        │
│   Missing lockfile          │  -5   │ per ecosystem (package-lock, poetry)    │
└─────────────────────────────┴───────┴─────────────────────────────────────────┘

Grades:  A ≥90 · B ≥80 · C ≥65 · D ≥50 · F <50
```

---

## 📁 Project Directory Structure

```
repo_doctor/
├── frontend/
│   ├── index.html            # Web UI single-page interface
│   └── static/
│       ├── style.css         # Dark-themed responsive styling
│       └── app.js            # Frontend logic & cure code viewer
├── repo_doctor/
│   ├── __init__.py
│   ├── __main__.py          # python -m repo_doctor.cli entry point
│   ├── api.py               # FastAPI backend for web diagnostics
│   ├── cli.py               # Rich-formatted terminal CLI
│   ├── scanner.py           # File walker with strict directory exclusion
│   ├── scorer.py            # 100-point deterministic rubric
│   ├── curer.py             # Deterministic patch & template generator
│   └── checks/
│       ├── git_hygiene.py   # .gitignore, README, LICENSE, CI checks
│       ├── secrets.py       # High-precision credential regex scanner
│       └── code_quality.py  # LOC bloat, TODO density, lockfile checks
├── tests/
│   ├── test_scanner.py      # Pytest test suite (21 unit tests)
│   └── fixtures/
│       └── bad_repo/        # Flawed mock repo for diagnostics testing
├── pyproject.toml           # Build configuration & metadata
├── requirements.txt         # Project dependencies
├── serve.py                 # One-command web server launcher
└── README.md                # Comprehensive documentation
```

---

## ❓ Troubleshooting & FAQs

- **Port 8000 already in use?**
  Run with a custom port: `python serve.py --port 8080`
- **Git clone errors in Web UI?**
  Ensure Git is installed and accessible in your terminal (`git --version`).
- **PowerShell Execution Policy Error on Windows?**
  Run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` then run the activation script again.

---

## 📄 License
MIT © Contributors
