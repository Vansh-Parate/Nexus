"""
Explain match score with contributions breakdown.
Input: { "startup": {...}, "investor": {...} }
Output: { "score": float, "contributions": {...}, "breakdown": {...} }
"""
import sys
import json
import os
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import numpy as np

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_DIR = os.path.dirname(SCRIPT_DIR)
ARTIFACTS_DIR = os.path.join(SERVER_DIR, "ml_artifacts")

def explain_match(startup_data, investor_data, model, tfidf, feature_columns):
    """Get match score with detailed contributions."""
    input_df = pd.DataFrame([{
        "startup_industry": startup_data.get("industry", ""),
        "startup_stage": startup_data.get("stage", ""),
        "funding_required_lakhs": float(startup_data.get("funding_required", 0)),
        "investor_pref_industry": investor_data.get("preferred_industry", ""),
        "investor_pref_stage": investor_data.get("preferred_stage", ""),
        "investor_ticket_min_lakhs": float(investor_data.get("ticket_min", 0)),
        "investor_ticket_max_lakhs": float(investor_data.get("ticket_max", 1000)),
        "startup_desc": startup_data.get("description", "") or "",
        "investor_desc": investor_data.get("description", "") or investor_data.get("thesis", "") or "",
    }])

    # Compute idea similarity
    startup_vec = tfidf.transform(input_df["startup_desc"])
    investor_vec = tfidf.transform(input_df["investor_desc"])
    similarity = cosine_similarity(startup_vec, investor_vec)[0][0]
    input_df["idea_similarity"] = similarity

    # Funding fit
    funding_required = float(input_df["funding_required_lakhs"].iloc[0])
    ticket_min = float(input_df["investor_ticket_min_lakhs"].iloc[0])
    ticket_max = float(input_df["investor_ticket_max_lakhs"].iloc[0])
    funding_fit = (funding_required >= ticket_min) and (funding_required <= ticket_max)
    input_df["funding_fit"] = int(funding_fit)
    
    input_df_clean = input_df.drop(["startup_desc", "investor_desc"], axis=1)
    input_encoded = pd.get_dummies(input_df_clean)
    input_aligned = input_encoded.reindex(columns=feature_columns, fill_value=0)

    # Get prediction
    score = float(model.predict(input_aligned)[0])
    
    # Get feature importances (global from model)
    feature_importances = model.feature_importances_
    feature_names = feature_columns
    
    # Calculate contributions per feature category
    contributions = {}
    
    # Sector match
    # Treat empty investor_pref_industry as "no preference" => count as a match
    startup_industry = input_df["startup_industry"].iloc[0]
    investor_pref_industry = input_df["investor_pref_industry"].iloc[0]
    sector_match = (
        (startup_industry and investor_pref_industry and startup_industry == investor_pref_industry)
        or (startup_industry and not investor_pref_industry)  # investor has no specific sector filter
    )
    sector_cols = [i for i, col in enumerate(feature_names) if 'industry' in col.lower() and input_aligned.iloc[0, i] > 0]
    sector_contrib = sum(feature_importances[i] * input_aligned.iloc[0, i] for i in sector_cols) if sector_cols else 0
    contributions["sector"] = {
        "match": bool(sector_match),
        "contribution": round(float(sector_contrib), 2),
        "startup": startup_industry,
        "investor": investor_pref_industry or "Any"
    }
    
    # Stage match
    startup_stage = input_df["startup_stage"].iloc[0]
    investor_pref_stage = input_df["investor_pref_stage"].iloc[0]
    stage_match = (
        (startup_stage and investor_pref_stage and startup_stage == investor_pref_stage)
        or (startup_stage and not investor_pref_stage)  # no specific stage preference
    )
    stage_cols = [i for i, col in enumerate(feature_names) if 'stage' in col.lower() and input_aligned.iloc[0, i] > 0]
    stage_contrib = sum(feature_importances[i] * input_aligned.iloc[0, i] for i in stage_cols) if stage_cols else 0
    contributions["stage"] = {
        "match": bool(stage_match),
        "contribution": round(float(stage_contrib), 2),
        "startup": startup_stage,
        "investor": investor_pref_stage or "Any"
    }
    
    # Funding fit
    funding_cols = [i for i, col in enumerate(feature_names) if 'funding' in col.lower() or 'ticket' in col.lower()]
    funding_contrib = sum(feature_importances[i] * input_aligned.iloc[0, i] for i in funding_cols) if funding_cols else 0
    contributions["funding"] = {
        "fit": bool(funding_fit),
        "contribution": round(float(funding_contrib), 2),
        "startup_ask": float(input_df["funding_required_lakhs"].iloc[0]),
        "investor_range": [float(input_df["investor_ticket_min_lakhs"].iloc[0]), float(input_df["investor_ticket_max_lakhs"].iloc[0])]
    }
    
    # Idea similarity
    idea_cols = [i for i, col in enumerate(feature_names) if 'similarity' in col.lower() or 'idea' in col.lower()]
    idea_contrib = sum(feature_importances[i] * input_aligned.iloc[0, i] for i in idea_cols) if idea_cols else 0
    contributions["idea_similarity"] = {
        "score": round(float(similarity), 3),
        "contribution": round(float(idea_contrib), 2),
        "description": "Semantic similarity between startup description and investor thesis"
    }
    
    # Breakdown summary
    breakdown = {
        "total_score": round(score, 2),
        "factors": [
            {"name": "Sector Match", "value": contributions["sector"]["match"], "impact": contributions["sector"]["contribution"]},
            {"name": "Stage Match", "value": contributions["stage"]["match"], "impact": contributions["stage"]["contribution"]},
            {"name": "Funding Fit", "value": contributions["funding"]["fit"], "impact": contributions["funding"]["contribution"]},
            {"name": "Idea Similarity", "value": f"{contributions['idea_similarity']['score']:.1%}", "impact": contributions["idea_similarity"]["contribution"]}
        ],
        "strengths": [],
        "weaknesses": []
    }
    
    # Identify strengths and weaknesses
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
        "score": round(score, 2),
        "contributions": contributions,
        "breakdown": breakdown
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
