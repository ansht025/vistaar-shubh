import os
import sys

# Add the 'backend' directory to the python path so imports like 'from app...' work correctly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.main import app
