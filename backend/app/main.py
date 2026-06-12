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
        conn.execute(text("ALTER TABLE users ADD COLUMN is_suspended BOOLEAN DEFAULT FALSE"))
        conn.commit()
except Exception:
    pass

# Auto-seed initial database data if empty
try:
    from app.models import Product, User
    from app.auth import hash_password
    from app.database import SessionLocal
    
    db = SessionLocal()
    # Check if products table is empty
    if db.query(Product).count() == 0:
        default_products = [
            Product(name="VistaarWater Classic 250ml", size="250ml", base_price=15.0,
                    description="Compact 250ml bottle, perfect for events and meetings.", image_url="/static/products/250ml.png"),
            Product(name="VistaarWater Standard 500ml", size="500ml", base_price=20.0,
                    description="Our most popular 500ml bottle for hotels, restaurants, and offices.", image_url="/static/products/500ml.png"),
            Product(name="VistaarWater Premium 1000ml", size="1000ml", base_price=30.0,
                    description="Large 1000ml bottle for gyms, events, and premium hospitality.", image_url="/static/products/1000ml.png"),
        ]
        db.add_all(default_products)
        print("Auto-seeded default products.")

    # Check if admin user is empty
    admin_email = "admin@vistaarwater.com"
    if db.query(User).filter(User.email == admin_email).count() == 0:
        admin = User(
            email=admin_email,
            password_hash=hash_password("admin123"),
            business_name="VistaarWater Admin",
            role="admin",
        )
        db.add(admin)
        print(f"Auto-seeded admin user: {admin_email}")

    # Check if demo user is empty
    demo_email = "demo@vistaarwater.com"
    if db.query(User).filter(User.email == demo_email).count() == 0:
        demo = User(
            email=demo_email,
            password_hash=hash_password("demo123"),
            business_name="Royal Hotel",
            phone="+91 9876543210",
            role="user",
        )
        db.add(demo)
        print(f"Auto-seeded demo user: {demo_email}")

    db.commit()
    db.close()
except Exception as e:
    print(f"Error during database auto-seeding: {e}")


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
