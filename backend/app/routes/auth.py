import random
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, OTP
from app.schemas import UserRegister, UserLogin, UserResponse, TokenResponse, SendOTPRequest, VerifyOTPRequest
from app.auth import hash_password, verify_password, create_access_token, get_current_user
from app.services.email_service import send_otp_email

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _generate_and_send_otp(email: str, db: Session) -> str:
    """Generate a 6-digit OTP, store it, and send it via email."""
    otp_code = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # Invalidate previous unused OTPs for this email
    db.query(OTP).filter(OTP.email == email, OTP.is_used == False).update({"is_used": True})
    
    new_otp = OTP(email=email, otp_code=otp_code, expires_at=expires_at)
    db.add(new_otp)
    db.commit()
    
    # Send email (non-blocking, won't fail hard if SMTP not configured)
    send_otp_email(email, otp_code)
    print(f"[OTP] Generated OTP {otp_code} for {email}")
    return otp_code


@router.post("/send-otp")
def send_otp(data: SendOTPRequest, db: Session = Depends(get_db)):
    """Generate and send a 6-digit OTP to the provided email."""
    _generate_and_send_otp(data.email, db)
    return {"message": "OTP sent successfully to email"}


@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(data: VerifyOTPRequest, db: Session = Depends(get_db)):
    """Verify OTP and return auth token."""
    otp_record = db.query(OTP).filter(
        OTP.email == data.email,
        OTP.otp_code == data.otp_code,
        OTP.is_used == False,
        OTP.expires_at > datetime.utcnow()
    ).first()

    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Mark as used
    otp_record.is_used = True
    db.commit()

    # Find or create user
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        user = User(
            email=data.email,
            password_hash=hash_password(data.otp_code)
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if user.is_suspended:
        raise HTTPException(status_code=403, detail="User account is suspended")

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user. Sends OTP for verification before granting access."""
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        business_name=data.business_name,
        phone=data.phone,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Send OTP instead of returning token
    _generate_and_send_otp(data.email, db)
    
    return {
        "message": "Registration successful. OTP sent to your email.",
        "requires_otp": True,
        "email": data.email,
    }


@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password. Admin gets instant access; users need OTP."""
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user.is_suspended:
        raise HTTPException(status_code=403, detail="User account is suspended")

    # Admin bypasses OTP
    if user.role == "admin":
        token = create_access_token({"sub": str(user.id)})
        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(user),
        ).model_dump()

    # Regular user: send OTP
    _generate_and_send_otp(data.email, db)
    return {
        "message": "OTP sent to your email.",
        "requires_otp": True,
        "email": data.email,
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return UserResponse.model_validate(current_user)
