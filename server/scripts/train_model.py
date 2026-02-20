"""
Train match-score model from investor_startup_matching_regression.csv (built from 3 CSVs).
Saves model.pkl, tfidf.pkl, feature_columns.json to server/ml_artifacts/.
"""
import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.ensemble import RandomForestRegressor
import joblib

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = SERVER_DIR
ARTIFACTS_DIR = os.path.join(SERVER_DIR, "ml_artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

CSV_PATH = os.path.join(DATA_DIR, "investor_startup_matching_regression.csv")

def main():
    if not os.path.isfile(CSV_PATH):
        print(f"Run build_regression_data.py first to create {CSV_PATH}")
        return 1

    df = pd.read_csv(CSV_PATH)
    df = df.drop(["startup_location", "investor_location_pref"], axis=1, errors="ignore")

    X = df.drop("match_score", axis=1)
    y = df["match_score"]

    tfidf = TfidfVectorizer(stop_words="english")
    startup_vec = tfidf.fit_transform(X["startup_desc"].fillna(""))
    investor_vec = tfidf.transform(X["investor_desc"].fillna(""))

    similarity_scores = []
    for i in range(len(X)):
        sim = cosine_similarity(startup_vec[i], investor_vec[i])[0][0]
        similarity_scores.append(sim)
    X = X.copy()
    X["idea_similarity"] = similarity_scores

    X["funding_fit"] = (
        (X["funding_required_lakhs"] >= X["investor_ticket_min_lakhs"])
        & (X["funding_required_lakhs"] <= X["investor_ticket_max_lakhs"])
    )
    X = X.drop(["startup_desc", "investor_desc"], axis=1)

    X_encoded = pd.get_dummies(X, drop_first=True)
    feature_columns = list(X_encoded.columns)

    X_train, X_test, y_train, y_test = train_test_split(
        X_encoded, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=300, max_depth=12, random_state=42, n_jobs=-1
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    print("MAE:", mae)
    print("RMSE:", rmse)

    joblib.dump(model, os.path.join(ARTIFACTS_DIR, "model.pkl"))
    joblib.dump(tfidf, os.path.join(ARTIFACTS_DIR, "tfidf.pkl"))
    with open(os.path.join(ARTIFACTS_DIR, "feature_columns.json"), "w") as f:
        json.dump(feature_columns, f)

    print(f"Saved artifacts to {ARTIFACTS_DIR}")
    return 0

if __name__ == "__main__":
    exit(main())
