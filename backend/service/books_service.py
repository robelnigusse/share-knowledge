
import hashlib
import os
from dotenv import load_dotenv
from fastapi import  HTTPException, UploadFile
from supabase import create_client , Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME")


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_book_to_storage(file: UploadFile, filename: str):
    file_bytes = file.file.read()

    # Create hash for uniqueness
    file_hash = hashlib.sha256(file_bytes).hexdigest()

    storage_path = f"{filename}"
    try:
    # Upload to Supabase bucket
        response = supabase.storage.from_(BUCKET_NAME).upload(
                    path=storage_path,
                    file=file_bytes,
                    file_options={"content-type": "application/pdf"}
                )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Get private URL
    public_url = supabase.storage.from_(BUCKET_NAME).create_signed_url(storage_path, 3600)  # URL valid for 1 hour

    return public_url, file_hash
