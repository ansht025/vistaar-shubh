import os
import sys

# Ensure root and backend directories are in python path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
backend_dir = os.path.join(root_dir, 'backend')
for p in [root_dir, backend_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.app.main import app
except ImportError:
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
