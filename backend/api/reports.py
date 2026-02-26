

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.auth import get_db
from database.models import reports, users,books
from schemas.report import ReportCreate
from service.auth_service import get_current_user


router = APIRouter(prefix="/report",tags=["reports"])

@router.post("")
def report_book( report_data : ReportCreate ,db: Session = Depends(get_db) , current_user_data: dict = Depends(get_current_user)):
    if not current_user_data:
        raise HTTPException(status_code=401, detail="Unauthorized")
    book = db.query(books.books).filter(books.books.id == report_data.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if book.owner_id == db.query(users.users).filter(users.users.email == current_user_data.get("email")).first().id:
        raise HTTPException(status_code=403, detail="You cannot report your own book")
    
    
    # if db.query(reports.reports).filter(reports.reports.book_id == report_data.book_id).first():
    #     raise HTTPException(status_code=400, detail="You have already reported this book")
    
    id = db.query(users.users).filter(users.users.email == current_user_data.get("email")).first().id

    new_report = reports.reports(
        reporter_id=id,
        book_id=report_data.book_id,
        reason=report_data.reason
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return {"message": "Report submitted successfully"}
