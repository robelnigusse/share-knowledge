from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from schemas.book import BookResponse
from service.auth_service import get_current_user
from service.books_service import  check_file_exists, delete_book_from_storage, get_hash, upload_book_to_db, upload_book_to_storage
import database.models.books
from api.auth import get_db
from database.models.users import users
from database.models.books import books





router = APIRouter(prefix="/books", tags=["books"]) 


@router.get("/all-books",response_model=list[BookResponse])
def get_books(db: Session = Depends(get_db)):
    result = db.query(books).all()
    return result

@router.get("/users-books" , response_model=list[BookResponse])
def users_books(current_user_data: dict = Depends(get_current_user),db: Session = Depends(get_db)):
    result = db.query(books).filter(books.owner_id == db.query(users).filter(users.email == current_user_data.get("email")).first().id).order_by(books.upload_date.desc()).all()
    return result


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
        upload_book_to_db(file_url=url,file_hash=hash,current_user_data=current_user_data,db=db)
        return {
            "message": "File uploaded successfully",
            "file_url": url,
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
       

    
    
@router.delete("/delete-book/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db),current_user_data: dict = Depends(get_current_user)):
    book = db.query(books).filter(books.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    user_id = user_id= db.query(users).filter(users.email == current_user_data.get("email")).first().id
    book_owner= db.query(books).filter(books.id == book_id).first().owner_id

    if user_id != book_owner:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this book")
    
    delete_book_from_storage(book.file_url)
    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully"}
    

