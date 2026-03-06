from fastapi import APIRouter, HTTPException,Depends, Response
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv 
from database.models.users import users
from database.config import sessionLocal
from sqlalchemy.orm import Session
from service.auth_service import create_access_token, get_current_user
load_dotenv()
router = APIRouter(tags=["auth"])

class TokenData(BaseModel):
    clientID: str
def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

@router.post("/login")
def login(response: Response,token_data: TokenData, db: Session = Depends(get_db)):
    print(token_data)
    google_response = requests.get(
        f"https://oauth2.googleapis.com/tokeninfo?id_token={token_data.clientID}"
    )
    if google_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid token")
    
    user_info = google_response.json()

    if user_info["aud"] != GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=400, detail="Invalid client ID")
    

    existing_user = db.query(users).filter(
        users.google_id == user_info["sub"]
    ).first()

    access_token = create_access_token(data={"sub": user_info["email"]})

    if existing_user:
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            samesite="none",
            secure=True 
        )
        return {
            "message": "Login successful",
        }
    
    new_user = users(
        name=user_info["name"],
        email=user_info["email"],
        google_id=user_info["sub"],
        credits=0,
        role="user",
        is_banned=False
    )
    try:
        db.add(new_user)
        db.commit()
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            samesite="none",
            secure=True 
        )
        return {
            "message": "Signup successful",
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    


@router.post("/logout")
def logout(response: Response,current_user_data: dict = Depends(get_current_user)):
    if not current_user_data:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    response.delete_cookie(key="access_token", httponly=True, samesite="none")
    return {"message": "Logout successful"}