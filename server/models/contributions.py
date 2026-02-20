"""
SHAP-based match explanation utilities converted from `models/contributions.ipynb`.

This module builds the same feature row as the training pipeline and returns:
- a clamped match score in the 0–100 range
- normalized percentage contributions of the main factors:
  Industry Fit, Stage Fit, Funding Fit, Idea Similarity
"""

from __future__ import annotations

import json
import os
from typing import Any, Dict

import joblib
import numpy as np
import pandas as pd
import shap
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "ml_artifacts")


def _load_artifacts():
  """
  Load model, TF-IDF vectorizer and feature columns.

  Mirrors the artifacts layout used by `predict_score.py` and `explain_match.py`.
  """
  model_path = os.path.join(ARTIFACTS_DIR, "model.pkl")
  tfidf_path = os.path.join(ARTIFACTS_DIR, "tfidf.pkl")
  cols_json_path = os.path.join(ARTIFACTS_DIR, "feature_columns.json")

  if not (os.path.isfile(model_path) and os.path.isfile(tfidf_path) and os.path.isfile(cols_json_path)):
    raise FileNotFoundError(
      "ML artifacts not found. Run the training pipeline to generate "
      "`model.pkl`, `tfidf.pkl` and `feature_columns.json` in `server/ml_artifacts/`."
    )

  model = joblib.load(model_path)
  tfidf = joblib.load(tfidf_path)
  with open(cols_json_path) as f:
    columns = json.load(f)

  explainer = shap.TreeExplainer(model)
  return model, tfidf, columns, explainer


MODEL, TFIDF, FEATURE_COLUMNS, EXPLAINER = _load_artifacts()


def build_feature_row(startup_data: Dict[str, Any], investor_data: Dict[str, Any]) -> pd.DataFrame:
  """
  Build a single aligned feature row for the (startup, investor) pair.

  This is the direct port of the notebook logic, adapted to the shared
  artifact layout.
  """
  df = pd.DataFrame(
    [
      {
        "startup_industry": startup_data.get("industry"),
        "startup_stage": startup_data.get("stage"),
        "funding_required_lakhs": startup_data.get("funding_required"),
        "investor_pref_industry": investor_data.get("preferred_industry"),
        "investor_pref_stage": investor_data.get("preferred_stage"),
        "investor_ticket_min_lakhs": investor_data.get("ticket_min"),
        "investor_ticket_max_lakhs": investor_data.get("ticket_max"),
        "startup_desc": startup_data.get("description", "") or "",
        "investor_desc": investor_data.get("description", "") or investor_data.get("thesis", "") or "",
      }
    ]
  )

  # Idea similarity
  s_vec = TFIDF.transform(df["startup_desc"])
  i_vec = TFIDF.transform(df["investor_desc"])
  similarity = cosine_similarity(s_vec, i_vec)[0][0]
  df["idea_similarity"] = float(similarity)

  # Funding fit
  df["funding_fit"] = (
    (df["funding_required_lakhs"] >= df["investor_ticket_min_lakhs"])
    & (df["funding_required_lakhs"] <= df["investor_ticket_max_lakhs"])
  ).astype(int)

  df = df.drop(["startup_desc", "investor_desc"], axis=1)

  df_encoded = pd.get_dummies(df, drop_first=True)
  df_aligned = df_encoded.reindex(columns=FEATURE_COLUMNS, fill_value=0)

  return df_aligned


def explain_match(startup_data: Dict[str, Any], investor_data: Dict[str, Any]) -> Dict[str, Any]:
  """
  Return match score and normalized contribution percentages for core factors.

  Output shape (matching the notebook):
  {
    "match_score": float,
    "contributions": {
      "Industry Fit": float,
      "Stage Fit": float,
      "Funding Fit": float,
      "Idea Similarity": float
    }
  }
  """
  X_input = build_feature_row(startup_data, investor_data)

  # Raw model prediction, clamped to [0, 100]
  prediction = float(MODEL.predict(X_input)[0])
  prediction = float(np.clip(prediction, 0, 100))

  shap_vals = EXPLAINER.shap_values(X_input)
  # TreeExplainer may return list for multi-output models
  if isinstance(shap_vals, list):
    shap_vals = shap_vals[0]
  shap_row = shap_vals[0]

  feature_contrib = dict(zip(X_input.columns, shap_row))

  industry_contrib = sum(v for k, v in feature_contrib.items() if "industry" in k.lower())
  stage_contrib = sum(v for k, v in feature_contrib.items() if "stage" in k.lower())
  funding_contrib = feature_contrib.get("funding_fit", 0.0)
  similarity_contrib = feature_contrib.get("idea_similarity", 0.0)

  contributions_raw = {
    "Industry Fit": abs(float(industry_contrib)),
    "Stage Fit": abs(float(stage_contrib)),
    "Funding Fit": abs(float(funding_contrib)),
    "Idea Similarity": abs(float(similarity_contrib)),
  }

  total = sum(contributions_raw.values()) + 1e-6

  contributions_pct = {
    k: round(100.0 * v / total, 1)
    for k, v in contributions_raw.items()
  }

  return {
    "match_score": round(prediction, 2),
    "contributions": contributions_pct,
  }


__all__ = ["build_feature_row", "explain_match"]

