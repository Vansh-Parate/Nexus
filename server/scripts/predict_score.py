"""
Read one JSON object from stdin: { "startup": {...}, "investor": {...} }
Output: single line with match score (float).
"""
import sys
import json
import os
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import joblib

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_DIR = os.path.dirname(SCRIPT_DIR)
ARTIFACTS_DIR = os.path.join(SERVER_DIR, "ml_artifacts")

def predict_match_score(startup_data, investor_data, model, tfidf, feature_columns):
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

    startup_vec = tfidf.transform(input_df["startup_desc"])
    investor_vec = tfidf.transform(input_df["investor_desc"])
    similarity = cosine_similarity(startup_vec, investor_vec)[0][0]
    input_df["idea_similarity"] = similarity

    input_df["funding_fit"] = (
        (input_df["funding_required_lakhs"] >= input_df["investor_ticket_min_lakhs"])
        & (input_df["funding_required_lakhs"] <= input_df["investor_ticket_max_lakhs"])
    )
    input_df = input_df.drop(["startup_desc", "investor_desc"], axis=1)

    input_encoded = pd.get_dummies(input_df)
    input_aligned = input_encoded.reindex(columns=feature_columns, fill_value=0)

    score = model.predict(input_aligned)[0]
    return round(float(score), 2)

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

    score = predict_match_score(startup, investor, model, tfidf, feature_columns)
    print(json.dumps({"score": score}))

if __name__ == "__main__":
    main()
