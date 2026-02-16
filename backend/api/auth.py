from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests

router = APIRouter(prefix="/auth", tags=["auth"])

class TokenData(BaseModel):
    clientID: str


@router.post("/login")
def login(token_data: TokenData):
    print(token_data.clientID)
    response = requests.get(
        f"https://oauth2.googleapis.com/tokeninfo?id_token={token_data.clientID}"
    )
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid token")

    user_info = response.json()
    
    print(user_info)
   

    return {
        "message": "success"
    }

