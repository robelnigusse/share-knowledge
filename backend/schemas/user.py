from pydantic import BaseModel
class user(BaseModel):
    name: str
    email: str
    google_id: str
    role: str
    is_banned: bool

 