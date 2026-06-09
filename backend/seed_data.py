"""Seed the database with initial data."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine, Base
from app.models import Product, User
from app.auth import hash_password

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ── Seed Products ──
products = [
    Product(name="VistaarWater Classic 250ml", size="250ml", base_price=15.0,
            description="Compact 250ml bottle, perfect for events and meetings.", image_url="/static/products/250ml.png"),
    Product(name="VistaarWater Standard 500ml", size="500ml", base_price=20.0,
            description="Our most popular 500ml bottle for hotels, restaurants, and offices.", image_url="/static/products/500ml.png"),
    Product(name="VistaarWater Premium 1000ml", size="1000ml", base_price=30.0,
            description="Large 1000ml bottle for gyms, events, and premium hospitality.", image_url="/static/products/1000ml.png"),
]

for p in products:
    existing = db.query(Product).filter(Product.name == p.name).first()
    if not existing:
        db.add(p)
        print(f"  Added product: {p.name}")

# ── Seed Admin User ──
admin_email = "admin@vistaarwater.com"
existing_admin = db.query(User).filter(User.email == admin_email).first()
if not existing_admin:
    admin = User(
        email=admin_email,
        password_hash=hash_password("admin123"),
        business_name="VistaarWater Admin",
        role="admin",
    )
    db.add(admin)
    print(f"  Added admin user: {admin_email} / admin123")

# ── Seed Demo User ──
demo_email = "demo@vistaarwater.com"
existing_demo = db.query(User).filter(User.email == demo_email).first()
if not existing_demo:
    demo = User(
        email=demo_email,
        password_hash=hash_password("demo123"),
        business_name="Royal Hotel",
        phone="+91 9876543210",
        role="user",
    )
    db.add(demo)
    print(f"  Added demo user: {demo_email} / demo123")

db.commit()
db.close()
print("\nDatabase seeded successfully!")
