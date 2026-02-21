from typing import Optional
from pydantic import BaseModel
class user(BaseModel):
    name: str
    email: str
    credits: int
 

class UserUpdate(BaseModel):
    name: Optional[str] = None