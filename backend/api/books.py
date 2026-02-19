from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from service.auth_service import get_current_user
from service.books_service import  check_file_exists, get_hash, upload_book_to_db, upload_book_to_storage
import database.models.books
from api.auth import get_db





router = APIRouter(prefix="/books", tags=["books"]) 


@router.get("/")
def get_books(db: Session = Depends(get_db)):
    return db.query(database.models.books.books).all()


# title: str=Form(...),
            #   ,description: str=Form(None)
            #   category: str=Form("General"),#   status: str=Form("active"),
@router.post("/add-book")
def add_books(
            
              file: UploadFile=File(...),
              current_user_data: dict = Depends(get_current_user),
              db: Session = Depends(get_db)
              ):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")
    try:
        hash = get_hash(file)

        if check_file_exists(hash,db=db):
            raise HTTPException(status_code=409, detail="File already exists")

        url  = upload_book_to_storage(file, file.filename)
        print("uploaded")
        upload_book_to_db(file_url=url,file_hash=hash,current_user_data=current_user_data,db=db)
        return {
            "message": "File uploaded successfully",
            "file_url": url,
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
       

    
    

