from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Inquiry
from app.schemas import InquiryCreate, InquiryResponse

router = APIRouter(prefix="/api/inquiries", tags=["inquiries"])


@router.post("/", response_model=InquiryResponse)
def create_inquiry(data: InquiryCreate, db: Session = Depends(get_db)):
    """Submit a quote/inquiry request. No auth required."""
    inquiry = Inquiry(**data.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return InquiryResponse.model_validate(inquiry)
