
import hashlib
import os
from urllib.parse import unquote, urlparse
from dotenv import load_dotenv
from fastapi import  Depends, HTTPException, UploadFile
from supabase import create_client , Client
from sqlalchemy.orm import Session
from database.models.users import users
from database.models.books import books

from api.auth import get_db

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME")


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_hash(file: UploadFile):
    file_bytes = file.file.read()
    file_hash = hashlib.sha256(file_bytes).hexdigest()
    return file_hash

def check_file_exists(file_hash: str, db: Session ):
    return db.query(books).filter(books.file_hash == file_hash).first()


def upload_book_to_storage(file: UploadFile, filename: str):
    file_bytes = file.file.read()

    storage_path = f"{filename}"
    try:
    # Upload to Supabase bucket
         supabase.storage.from_(BUCKET_NAME).upload(
                    path=storage_path,
                    file=file_bytes,
                    file_options={"content-type": "application/pdf"}
                )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Get private URL
    public_url = supabase.storage.from_(BUCKET_NAME).create_signed_url(storage_path, 36000000)  # URL valid for 1 hour
    return public_url["signedURL"]


def upload_book_to_db(db: Session,file_url : str,file_hash,current_user_data: dict,description="this goes to the description",category="General" ):

    user_id= db.query(users).filter(users.email == current_user_data.get("email")).first().id
    title =os.path.basename(urlparse(file_url).path)

    try:

        new_book = books(title=title,description=description,file_url=file_url,file_hash=file_hash,owner_id=user_id,category=category)
        db.add(new_book)
        db.commit()
        db.refresh(new_book)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def delete_book_from_storage(url: str):
    try:
        parsed = urlparse(url)

        # Decode %20 etc.
        decoded_path = unquote(parsed.path)
        file_name = decoded_path.split("/")[-1]
        supabase.storage.from_(BUCKET_NAME).remove([file_name])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


    


