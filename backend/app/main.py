from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import FRONTEND_URL, FRONTEND_URLS, STATIC_DIR
from app.database import engine, Base
from app.routes import auth, designs, orders, products, inquiries, admin

# Create all tables
Base.metadata.create_all(bind=engine)

# Run migration check
try:
    from sqlalchemy import text
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN is_suspended BOOLEAN DEFAULT 0"))
        conn.commit()
except Exception:
    pass

app = FastAPI(
    title="VistaarWater API",
    description="B2B Custom Water Bottle Design & Ordering Platform",
    version="1.0.0",
)

allowed_origins = list(dict.fromkeys([FRONTEND_URL, *FRONTEND_URLS]))

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Include routes
app.include_router(auth.router)
app.include_router(designs.router)
app.include_router(orders.router)
app.include_router(products.router)
app.include_router(inquiries.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "VistaarWater API is running", "version": "1.0.0"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}
