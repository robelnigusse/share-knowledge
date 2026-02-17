from pydantic import BaseModel
class user(BaseModel):
    name: str
    email: str
    google_id: str
    is_banned: bool

 