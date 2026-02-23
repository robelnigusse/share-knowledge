from fastapi import APIRouter, HTTPException,Depends, Response
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv 
from database.models.users import users
from database.config import sessionLocal
from sqlalchemy.orm import Session
from service.auth_service import create_access_token
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
            samesite="lax",
            # secure=False # will be set true at end of project
        )
        return {
            "message": "Login successful",
            # "token": access_token,
            # "user": {
            #     "name": existing_user.name,
            #     "email": existing_user.email,
            #     "user_id": existing_user.id
            # }
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
            samesite="lax",
            # secure=False # will be set true at end of project
        )
        return {
            "message": "Signup successful",
            # "token": access_token,
            # "user": {
            #     "name": user_info["name"],
            #     "email": user_info["email"],  
            #     "user_id": db.query(users).filter(users.google_id == user_info["sub"]).first().id   
            # }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    

