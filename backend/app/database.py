from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import DATABASE_URL

db_url = DATABASE_URL
# Normalize all postgres URL schemes to pg8000 (pure Python driver, works on Vercel)
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+pg8000://", 1)
elif db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+pg8000://", 1)
elif db_url.startswith("postgresql+psycopg2://"):
    db_url = db_url.replace("postgresql+psycopg2://", "postgresql+pg8000://", 1)

# Remove sslmode from query string — pg8000 uses ssl_context instead
if db_url.startswith("postgresql+pg8000://") and "sslmode" in db_url:
    import re
    db_url = re.sub(r'[?&]sslmode=[^&]*', '', db_url)
    db_url = re.sub(r'\?&', '?', db_url)
    db_url = db_url.rstrip('?')

from sqlalchemy.pool import NullPool

if db_url.startswith("sqlite"):
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
elif db_url.startswith("postgresql+pg8000"):
    import ssl
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE
    engine = create_engine(
        db_url,
        poolclass=NullPool,
        connect_args={"ssl_context": ssl_ctx},
    )
else:
    engine = create_engine(db_url, poolclass=NullPool)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
