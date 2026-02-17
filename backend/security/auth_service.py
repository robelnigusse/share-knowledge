from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os



load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY") 
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

def create_access_token(data: dict):
    to_encode = data.copy()
    
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt







# This tells FastAPI to look for the "Authorization: Bearer <TOKEN>" header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    print(token)

    try:
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        
        if email is None:
            raise credentials_exception
            
        return {"email": email} 
        
    except JWTError:
        # If the token is expired or the signature is wrong, this triggers
        raise credentials_exception