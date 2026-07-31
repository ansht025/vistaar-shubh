import os
import sys

# Add the 'backend' directory to the python path so imports like 'from app...' work correctly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

try:
    from app.main import app
except Exception as _import_error:
    import traceback
    _tb = traceback.format_exc()
    from fastapi import FastAPI as _FastAPI
    app = _FastAPI()

    @app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
    def _error_handler(full_path: str = ""):
        return {
            "error": "App failed to start",
            "detail": str(_import_error),
            "traceback": _tb,
        }
