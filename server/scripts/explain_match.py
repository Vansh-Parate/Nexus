"""
Explain match score with SHAP-based contributions, aligned with the
`models/contributions (1).ipynb` notebook.

Input:  { "startup": {...}, "investor": {...} }
Output: { "score": float, "contributions": {...}, "breakdown": {...} }
"""
import sys
import json
import os
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import numpy as np
import shap

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_DIR = os.path.dirname(SCRIPT_DIR)
ARTIFACTS_DIR = os.path.join(SERVER_DIR, "ml_artifacts")


def build_feature_row(startup_data, investor_data, tfidf, feature_columns):
    """Replicate feature building from the contributions notebook."""
    df = pd.DataFrame(
        [
            {
                "startup_industry": startup_data.get("industry", ""),
                "startup_stage": startup_data.get("stage", ""),
                "funding_required_lakhs": float(startup_data.get("funding_required", 0)),
                "investor_pref_industry": investor_data.get("preferred_industry", ""),
                "investor_pref_stage": investor_data.get("preferred_stage", ""),
                "investor_ticket_min_lakhs": float(investor_data.get("ticket_min", 0)),
                "investor_ticket_max_lakhs": float(investor_data.get("ticket_max", 1000)),
                "startup_desc": startup_data.get("description", "") or "",
                "investor_desc": investor_data.get("description", "") or investor_data.get("thesis", "") or "",
            }
        ]
    )

    # Idea similarity
    s_vec = tfidf.transform(df["startup_desc"])
    i_vec = tfidf.transform(df["investor_desc"])
    similarity = cosine_similarity(s_vec, i_vec)[0][0]
    df["idea_similarity"] = float(similarity)

    # Funding fit
    df["funding_fit"] = (
        (df["funding_required_lakhs"] >= df["investor_ticket_min_lakhs"])
        & (df["funding_required_lakhs"] <= df["investor_ticket_max_lakhs"])
    ).astype(int)

    df_clean = df.drop(["startup_desc", "investor_desc"], axis=1)
    df_encoded = pd.get_dummies(df_clean, drop_first=True)
    df_aligned = df_encoded.reindex(columns=feature_columns, fill_value=0)

    return df, df_aligned, similarity


def explain_match(startup_data, investor_data, model, tfidf, feature_columns):
    """Get match score with SHAP-based contributions."""
    # Build aligned feature row
    raw_df, X_input, similarity = build_feature_row(startup_data, investor_data, tfidf, feature_columns)

    # Model prediction (clamped to 0–100)
    prediction = float(model.predict(X_input)[0])
    prediction = float(np.clip(prediction, 0, 100))

    # SHAP values
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_input)

    if isinstance(shap_values, list):
        shap_vals = shap_values[0][0]
    else:
        shap_vals = shap_values[0]

    feature_contrib = dict(zip(feature_columns, shap_vals))

    # Aggregate into buckets
    buckets = {
        "Industry Fit": 0.0,
        "Stage Fit": 0.0,
        "Funding Fit": 0.0,
        "Idea Similarity": 0.0,
    }

    for feat, val in feature_contrib.items():
        f = feat.lower()
        if "industry" in f:
            buckets["Industry Fit"] += val
        elif "stage" in f:
            buckets["Stage Fit"] += val
        elif "funding_fit" in f or "funding" in f or "ticket" in f:
            buckets["Funding Fit"] += val
        elif "idea_similarity" in f or "similarity" in f:
            buckets["Idea Similarity"] += val

    total_abs = sum(abs(v) for v in buckets.values()) + 1e-6
    bucket_pcts = {k: round(100 * abs(v) / total_abs, 1) for k, v in buckets.items()}

    # Map to UI structure, using prediction * percentage as "points"
    sector_pct = bucket_pcts["Industry Fit"]
    stage_pct = bucket_pcts["Stage Fit"]
    funding_pct = bucket_pcts["Funding Fit"]
    idea_pct = bucket_pcts["Idea Similarity"]

    sector_contrib = round(prediction * sector_pct / 100.0, 1)
    stage_contrib = round(prediction * stage_pct / 100.0, 1)
    funding_contrib = round(prediction * funding_pct / 100.0, 1)
    idea_contrib = round(prediction * idea_pct / 100.0, 1)

    # Booleans for match status (for labels)
    startup_industry = raw_df["startup_industry"].iloc[0]
    investor_pref_industry = raw_df["investor_pref_industry"].iloc[0]
    sector_match = (
        (startup_industry and investor_pref_industry and startup_industry == investor_pref_industry)
        or (startup_industry and not investor_pref_industry)
    )

    startup_stage = raw_df["startup_stage"].iloc[0]
    investor_pref_stage = raw_df["investor_pref_stage"].iloc[0]
    stage_match = (
        (startup_stage and investor_pref_stage and startup_stage == investor_pref_stage)
        or (startup_stage and not investor_pref_stage)
    )

    funding_required = float(raw_df["funding_required_lakhs"].iloc[0])
    ticket_min = float(raw_df["investor_ticket_min_lakhs"].iloc[0])
    ticket_max = float(raw_df["investor_ticket_max_lakhs"].iloc[0])
    funding_fit = (funding_required >= ticket_min) and (funding_required <= ticket_max)

    contributions = {
        "sector": {
            "match": bool(sector_match),
            "contribution": float(sector_contrib),
            "startup": startup_industry,
            "investor": investor_pref_industry or "Any",
        },
        "stage": {
            "match": bool(stage_match),
            "contribution": float(stage_contrib),
            "startup": startup_stage,
            "investor": investor_pref_stage or "Any",
        },
        "funding": {
            "fit": bool(funding_fit),
            "contribution": float(funding_contrib),
            "startup_ask": funding_required,
            "investor_range": [ticket_min, ticket_max],
        },
        "idea_similarity": {
            "score": round(float(similarity), 3),
            "contribution": float(idea_contrib),
            "description": "Semantic similarity between startup description and investor thesis",
        },
    }

    breakdown = {
        "total_score": round(prediction, 2),
        "factors": [],
        "strengths": [],
        "weaknesses": [],
    }

    if contributions["sector"]["match"]:
        breakdown["strengths"].append("Sector alignment")
    else:
        breakdown["weaknesses"].append("Sector mismatch")

    if contributions["stage"]["match"]:
        breakdown["strengths"].append("Stage alignment")
    else:
        breakdown["weaknesses"].append("Stage mismatch")

    if contributions["funding"]["fit"]:
        breakdown["strengths"].append("Funding range fit")
    else:
        breakdown["weaknesses"].append("Funding ask outside investor range")

    if similarity > 0.3:
        breakdown["strengths"].append("Strong idea similarity")
    elif similarity < 0.1:
        breakdown["weaknesses"].append("Low idea similarity")

    return {
        "score": round(prediction, 2),
        "contributions": contributions,
        "breakdown": breakdown,
    }

def main():
    model_path = os.path.join(ARTIFACTS_DIR, "model.pkl")
    tfidf_path = os.path.join(ARTIFACTS_DIR, "tfidf.pkl")
    cols_path = os.path.join(ARTIFACTS_DIR, "feature_columns.json")

    if not all(os.path.isfile(p) for p in [model_path, tfidf_path, cols_path]):
        print(json.dumps({"error": "Model not trained. Run scripts/build_regression_data.py then scripts/train_model.py"}), file=sys.stderr)
        sys.exit(1)

    model = joblib.load(model_path)
    tfidf = joblib.load(tfidf_path)
    with open(cols_path) as f:
        feature_columns = json.load(f)

    raw = sys.stdin.read()
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

    startup = data.get("startup", {})
    investor = data.get("investor", {})

    result = explain_match(startup, investor, model, tfidf, feature_columns)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
