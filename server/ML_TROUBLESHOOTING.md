# ML Model Troubleshooting Guide

## Windows DLL Loading Error

If you see errors like:
```
ImportError: DLL load failed while importing _dop: The paging file is too small for this operation to complete.
```

This is a common issue on Windows, especially with Python 3.13 and scipy/sklearn.

## Solutions (try in order):

### 1. Increase Windows Page File Size (Quick Fix)

1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to **Advanced** tab → **Performance** → **Settings**
3. Go to **Advanced** tab → **Virtual memory** → **Change**
4. Uncheck "Automatically manage paging file size"
5. Select your system drive (usually C:)
6. Select **Custom size**
7. Set Initial size: `8192` MB, Maximum size: `16384` MB
8. Click **Set**, then **OK**
9. **Restart your computer**

### 2. Reinstall scipy and sklearn (Recommended)

```bash
cd c:\Dev\VEGA\server
pip uninstall scipy scikit-learn -y
pip install scipy scikit-learn --no-cache-dir
```

### 3. Use Python 3.11 or 3.12 (Most Reliable)

Python 3.13 is very new and may have compatibility issues. Consider using Python 3.11 or 3.12:

1. Install Python 3.11 or 3.12 from python.org
2. Create a virtual environment:
   ```bash
   python3.11 -m venv venv
   venv\Scripts\activate
   pip install -r requirements-ml.txt
   ```
3. Update your `PYTHON` environment variable or set it in `.env`:
   ```
   PYTHON=python3.11
   ```

### 4. Use Conda (Alternative)

Conda handles Windows DLLs better:

```bash
conda create -n vega-ml python=3.11
conda activate vega-ml
conda install scipy scikit-learn pandas numpy joblib
```

Then set `PYTHON` to point to conda's Python.

### 5. Verify Installation

Test if ML works:
```bash
cd c:\Dev\VEGA\server
python scripts/predict_score.py
# Paste: {"startup": {"industry": "Tech", "stage": "MVP", "funding_required": 50, "description": "test"}, "investor": {"preferred_industry": "Tech", "preferred_stage": "MVP", "ticket_min": 10, "ticket_max": 100, "description": "test"}}
# Press Ctrl+Z then Enter
```

## Current Behavior

The system automatically falls back to simple rule-based scoring when ML is unavailable. You'll see warnings in the console, but the app will continue working.

## Performance Note

The ML engine processes matches in batches of 10 to reduce memory pressure. If you still see issues, you can reduce `BATCH_SIZE` in `mlMatchingEngine.js`.
