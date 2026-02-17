from fastapi import APIRouter, HTTPException,Depends
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv 
from db.models.users import users
from db.config import session
from sqlalchemy.orm import Session

load_dotenv()
router = APIRouter(prefix="/auth", tags=["auth"])

class TokenData(BaseModel):
    clientID: str
def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

@router.post("/login")
def login(token_data: TokenData, db: Session = Depends(get_db)):
    print(token_data.clientID)
    response = requests.get(
        f"https://oauth2.googleapis.com/tokeninfo?id_token={token_data.clientID}"
    )
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid token")
    
    user_info = response.json()

    if user_info["aud"] != GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=400, detail="Invalid client ID")
    

    existing_user = db.query(users).filter(
        users.google_id == user_info["sub"]
    ).first()

    if existing_user:
        return {
            "message": "Login successful",
            "user_id": existing_user.id
        }
    
    new_user = users(
        name=user_info["name"],
        email=user_info["email"],
        google_id=user_info["sub"],
        credits=0,
        role="user",
        is_banned=False
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "Signup successful",
        "user_id": new_user.id
    }

