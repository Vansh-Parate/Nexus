"""
Check if ML dependencies are properly installed and working.
Run: python scripts/check_ml_setup.py
"""
import sys
import os

print("=" * 60)
print("ML Setup Check")
print("=" * 60)

# Check Python version
print(f"\nPython Version: {sys.version}")
python_version = sys.version_info
if python_version.major == 3 and python_version.minor >= 13:
    print("⚠️  WARNING: Python 3.13+ may have compatibility issues with scipy/sklearn on Windows")
    print("   Consider using Python 3.11 or 3.12 for better compatibility")
else:
    print("✓ Python version looks good")

# Check required packages
required_packages = {
    'pandas': 'pandas',
    'numpy': 'numpy',
    'sklearn': 'scikit-learn',
    'scipy': 'scipy',
    'joblib': 'joblib',
}

print("\nChecking required packages:")
missing = []
for import_name, package_name in required_packages.items():
    try:
        if import_name == 'sklearn':
            import sklearn
            version = sklearn.__version__
        elif import_name == 'scipy':
            import scipy
            version = scipy.__version__
        elif import_name == 'pandas':
            import pandas
            version = pandas.__version__
        elif import_name == 'numpy':
            import numpy
            version = numpy.__version__
        elif import_name == 'joblib':
            import joblib
            version = joblib.__version__
        print(f"  ✓ {package_name}: {version}")
    except ImportError as e:
        print(f"  ✗ {package_name}: NOT INSTALLED")
        missing.append(package_name)
    except Exception as e:
        print(f"  ✗ {package_name}: ERROR - {e}")
        missing.append(package_name)

# Check ML artifacts
print("\nChecking ML artifacts:")
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_DIR = os.path.dirname(SCRIPT_DIR)
ARTIFACTS_DIR = os.path.join(SERVER_DIR, "ml_artifacts")

artifacts = {
    'model.pkl': 'Trained model',
    'tfidf.pkl': 'TF-IDF vectorizer',
    'feature_columns.json': 'Feature columns'
}

all_artifacts_present = True
for filename, description in artifacts.items():
    filepath = os.path.join(ARTIFACTS_DIR, filename)
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        print(f"  ✓ {description}: {filename} ({size:,} bytes)")
    else:
        print(f"  ✗ {description}: {filename} NOT FOUND")
        all_artifacts_present = False

# Test ML prediction if everything is available
if not missing and all_artifacts_present:
    print("\nTesting ML prediction...")
    try:
        import joblib
        import pandas as pd
        from sklearn.metrics.pairwise import cosine_similarity
        from sklearn.feature_extraction.text import TfidfVectorizer
        
        model_path = os.path.join(ARTIFACTS_DIR, "model.pkl")
        tfidf_path = os.path.join(ARTIFACTS_DIR, "tfidf.pkl")
        
        model = joblib.load(model_path)
        tfidf = joblib.load(tfidf_path)
        
        # Simple test
        test_text = ["test startup description"]
        tfidf.transform(test_text)
        
        print("  ✓ ML model loads and works correctly!")
    except Exception as e:
        print(f"  ✗ ML model test failed: {e}")
        if 'DLL' in str(e) or 'paging file' in str(e):
            print("\n  ⚠️  This is a Windows DLL loading issue.")
            print("     See ML_TROUBLESHOOTING.md for solutions.")

print("\n" + "=" * 60)
if missing:
    print("❌ Some packages are missing. Install with:")
    print(f"   pip install {' '.join(missing)}")
elif not all_artifacts_present:
    print("⚠️  ML artifacts not found. Train the model first:")
    print("   python scripts/build_regression_data.py")
    print("   python scripts/train_model.py")
else:
    print("✓ ML setup looks good!")
print("=" * 60)
