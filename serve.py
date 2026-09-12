"""
serve.py — One-command launch script for the Repo Doctor web server.

Usage:
    python serve.py              # starts on http://localhost:8000
    python serve.py --port 9000  # custom port
"""

import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description="Launch Repo Doctor web server")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--reload", action="store_true", default=False)
    args = parser.parse_args()

    try:
        import uvicorn
    except ImportError:
        print("uvicorn not found. Run: pip install uvicorn[standard]")
        sys.exit(1)

    print(f"\n  [Repo Doctor] Web UI")
    print(f"  " + "-" * 37)
    print(f"  Open:  http://{args.host}:{args.port}")
    print(f"  API:   http://{args.host}:{args.port}/api/analyze")
    print(f"  Stop:  Ctrl+C\n")

    uvicorn.run(
        "repo_doctor.api:app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        log_level="info",
    )

if __name__ == "__main__":
    main()
