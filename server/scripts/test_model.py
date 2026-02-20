"""
Quick sanity check that the match-score model loads and returns sensible scores.
Run from server dir: python scripts/test_model.py
"""
import sys
import os
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_DIR = os.path.dirname(SCRIPT_DIR)
sys.path.insert(0, SERVER_DIR)
os.chdir(SERVER_DIR)

def run_test(name, startup, investor, expect_range=None):
    """Run one prediction and optionally check score is in (min, max)."""
    import subprocess
    payload = json.dumps({"startup": startup, "investor": investor})
    proc = subprocess.run(
        [sys.executable, os.path.join(SCRIPT_DIR, "predict_score.py")],
        input=payload,
        capture_output=True,
        text=True,
        cwd=SERVER_DIR,
    )
    if proc.returncode != 0:
        print(f"  FAIL {name}: script exited {proc.returncode}\n  {proc.stderr}")
        return False
    out = json.loads(proc.stdout.strip())
    score = out.get("score")
    if score is None:
        print(f"  FAIL {name}: no 'score' in output: {out}")
        return False
    ok = True
    if expect_range is not None:
        lo, hi = expect_range
        if not (lo <= score <= hi):
            print(f"  FAIL {name}: score {score} not in [{lo}, {hi}]")
            ok = False
    if ok:
        print(f"  OK   {name}: score = {score}")
    return ok

def main():
    print("Testing match-score model (scripts/predict_score.py)\n")

    # 1. Aligned pair (same sector/stage, funding in range) -> expect higher score
    run_test(
        "Aligned pair (FinTech Seed, funding in range)",
        startup={
            "industry": "FinTech",
            "stage": "Seed",
            "funding_required": 80,
            "description": "AI-based fraud detection for digital payments",
        },
        investor={
            "preferred_industry": "FinTech",
            "preferred_stage": "Seed",
            "ticket_min": 50,
            "ticket_max": 200,
            "thesis": "Investing in FinTech and AI-driven startups",
        },
        expect_range=(50, 100),
    )

    # 2. Mismatched sector -> expect lower score than aligned
    run_test(
        "Mismatched sector (HealthTech vs FinTech investor)",
        startup={
            "industry": "HealthTech",
            "stage": "Seed",
            "funding_required": 100,
            "description": "Medical devices for rural clinics",
        },
        investor={
            "preferred_industry": "FinTech",
            "preferred_stage": "Seed",
            "ticket_min": 50,
            "ticket_max": 200,
            "thesis": "FinTech only",
        },
        expect_range=(0, 85),
    )

    # 3. Funding outside range -> model may still score but often lower
    run_test(
        "Funding outside range (500L vs 50–200L)",
        startup={
            "industry": "FinTech",
            "stage": "Series A",
            "funding_required": 500,
            "description": "Enterprise payments platform",
        },
        investor={
            "preferred_industry": "FinTech",
            "preferred_stage": "Series A",
            "ticket_min": 50,
            "ticket_max": 200,
            "thesis": "FinTech growth stage",
        },
        expect_range=(0, 100),
    )

    print("\nIf all three show 'OK' and scores look reasonable, the model is working.")
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except FileNotFoundError as e:
        print("Model not found. Run: npm run ml:build && npm run ml:train", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
