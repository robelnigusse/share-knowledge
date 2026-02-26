from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class user(BaseModel):
    id: int
    name: str
    email: str
    credits: int
    created_at: datetime
 

class UserUpdate(BaseModel):
    name: Optional[str] = None