"""
Build investor_startup_matching_regression.csv from investors.csv, startups.csv, interactions.csv.
Match score from interaction_type: viewed=45, shortlisted=70, contacted=90.
"""
import os
import pandas as pd

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = SERVER_DIR

def main():
    investors = pd.read_csv(os.path.join(DATA_DIR, "investors.csv"))
    startups = pd.read_csv(os.path.join(DATA_DIR, "startups.csv"))
    interactions = pd.read_csv(os.path.join(DATA_DIR, "interactions.csv"))

    score_map = {"viewed": 45, "shortlisted": 70, "contacted": 90}
    interactions["match_score"] = interactions["interaction_type"].map(score_map)

    merged = interactions.merge(
        startups,
        on="startup_id",
        how="inner",
        suffixes=("", "_s"),
    ).merge(
        investors,
        on="investor_id",
        how="inner",
        suffixes=("", "_i"),
    )

    df = pd.DataFrame({
        "startup_industry": merged["industry"],
        "startup_stage": merged["stage"],
        "funding_required_lakhs": merged["funding_required_lakhs"],
        "investor_pref_industry": merged["preferred_industry"],
        "investor_pref_stage": merged["preferred_stage"],
        "investor_ticket_min_lakhs": merged["ticket_min_lakhs"],
        "investor_ticket_max_lakhs": merged["ticket_max_lakhs"],
        "startup_desc": merged["description"].fillna(""),
        "investor_desc": merged["thesis"].fillna(""),
        "match_score": merged["match_score"],
    })

    out_path = os.path.join(DATA_DIR, "investor_startup_matching_regression.csv")
    df.to_csv(out_path, index=False)
    print(f"Wrote {len(df)} rows to {out_path}")

if __name__ == "__main__":
    main()
