from sqlalchemy.sql import func
from sqlalchemy import Column , Integer , String , Float , Boolean , DateTime
from sqlalchemy.orm import relationship
from database.config import base

class users(base):
    __tablename__ = "users"

    id = Column(Integer , primary_key=True , nullable=False, autoincrement=True)
    name = Column(String(100) , nullable=False)
    email = Column(String(255) , nullable=False , unique=True)
    google_id = Column(String(255) , nullable=False , unique=True)    
    credits = Column(Integer , default=0)
    role = Column(String(20) , default="user")
    is_banned = Column(Boolean , default=False)
    created_at = Column(DateTime , server_default=func.now())
    
    books = relationship("books", back_populates="owner", cascade="all, delete-orphan")



# CREATE TABLE users (
#     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
#     name VARCHAR(100) NOT NULL,
#     email VARCHAR(255) UNIQUE NOT NULL,
#     google_id VARCHAR(255) UNIQUE NOT NULL,  
#     credits INT DEFAULT 0,
#     role VARCHAR(20) DEFAULT 'user', -- 'user' or 'admin'
#     is_banned BOOLEAN DEFAULT FALSE,
#     created_at TIMESTAMP DEFAULT now()
# );
