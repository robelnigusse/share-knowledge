from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
# from security.auth_service import get_current_user
from service.books_service import  upload_book_to_storage
import database.models.books
from api.auth import get_db





router = APIRouter(prefix="/books", tags=["books"]) 


@router.get("/")
def get_books(db: Session = Depends(get_db)):
    return db.query(database.models.books.books).all()



@router.post("/add-book")
def add_books(
            # title: str=Form(...),
            #   ,description: str=Form(None)
              category: str=Form("General"),
              file: UploadFile=File(...),
            #   status: str=Form("active"),
            #   current_user_data: dict = Depends(get_current_user),db: Session = Depends(get_db)
              ):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")
    try:
        url , hash = upload_book_to_storage(file, file.filename)
        return {
            "message": "File uploaded successfully",
            "file_url": url,
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
       

    
    

