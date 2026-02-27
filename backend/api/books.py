from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from schemas.book import BookResponse
from service.auth_service import get_current_user
from service.books_service import  check_file_exists, delete_book_from_storage, get_book_description, get_hash, upload_book_to_db, upload_book_to_storage
from api.auth import get_db
from database.models.users import users
from database.models.books import books





router = APIRouter(prefix="/books", tags=["books"]) 
MAX_SIZE_MB = 10
MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024  # 12 MB in bytes


@router.get("/download/{book_id}")
def downlaod_book(book_id: int, db: Session = Depends(get_db), current_user_data: dict = Depends(get_current_user)):
    if not current_user_data:
        raise HTTPException(status_code=401, detail="Unauthorized")
    book = db.query(books).filter(books.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if db.query(users).filter(users.email == current_user_data.get("email")).first().credits < 10:
        raise HTTPException(status_code=403, detail="You don't have enough credits to download this book")
    
    db.query(users).filter(users.email == current_user_data.get("email")).first().credits -= 10
    db.commit()
    
    return {"file_url": book.file_url}


@router.get("",response_model=list[BookResponse])
def get_books(db: Session = Depends(get_db)):
    result = db.query(books).all()
    return result

@router.get("/me" , response_model=list[BookResponse])
def users_books(current_user_data: dict = Depends(get_current_user),db: Session = Depends(get_db)):
    result = db.query(books).filter(books.owner_id == db.query(users).filter(users.email == current_user_data.get("email")).first().id).order_by(books.upload_date.desc()).all()
    return result


@router.get("/{book_id}",response_model=BookResponse)
def get_book(book_id: int, db: Session = Depends(get_db)):
    result = db.query(books).filter(books.id == book_id).first()
    if not result:
     raise HTTPException(status_code=404, detail="Book not found")
    return result


@router.post("")
async def add_books(
              category: str=Form("General"),
              file: UploadFile=File(...),
              current_user_data: dict = Depends(get_current_user),
              db: Session = Depends(get_db)
              ):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")
    if not current_user_data:
        raise HTTPException(status_code=401, detail="Unauthorized")


    # check file size
    await file.seek(0)  # Ensure we start at the beginning
    size_bytes = 0
    chunk_size = 1024 * 1024  # 1 MB per chunk

    chunk = await file.read(chunk_size)
    while chunk:
        size_bytes += len(chunk)
        if size_bytes > MAX_SIZE_BYTES:
            raise HTTPException(status_code=400, detail=f"File too large. Max {MAX_SIZE_MB} MB allowed.")
        chunk = await file.read(chunk_size)
    
    try:
        hash = get_hash(file)

        if check_file_exists(hash,db=db):
            raise HTTPException(status_code=409, detail="File already exists")
        # get file description from open ai if possible
        description = get_book_description(file)
        url  = upload_book_to_storage(file, file.filename)
        upload_book_to_db(category=category,file_url=url,file_hash=hash,current_user_data=current_user_data,db=db,description=description)
        db.query(users).filter(users.email == current_user_data.get("email")).first().credits += 10
        db.commit()
        return {
            "message": "File uploaded successfully",
            "file_url": url,
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
       

    
    
@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db),current_user_data: dict = Depends(get_current_user)):
    book = db.query(books).filter(books.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    user_id = db.query(users).filter(users.email == current_user_data.get("email")).first().id
    book_owner= db.query(books).filter(books.id == book_id).first().owner_id

    if user_id != book_owner:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this book")
    
    delete_book_from_storage(book.file_url)
    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully"}
    

