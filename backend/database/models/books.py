from enum import unique
from sqlalchemy.sql import func
from sqlalchemy import TEXT, Column, ForeignKey , Integer , String , Float , Boolean , DateTime
from sqlalchemy.orm import relationship
from database.config import base


class books(base):
    __tablename__ = "books"

    id = Column(Integer , primary_key=True , nullable=False, autoincrement=True)
    title = Column(TEXT, nullable=False)
    description = Column(TEXT)
    file_url = Column(String , nullable=False)
    file_hash = Column(String(64) , nullable=False, unique=True)
    owner_id = Column(Integer , ForeignKey("users.id") , nullable=False)
    status = Column(String(20) , default="active")
    category = Column(String(50) , default="General")
    upload_date = Column(DateTime , server_default=func.now())
    owner = relationship("users", back_populates="books")


# CREATE TABLE books (
#     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
#     title VARCHAR(255) NOT NULL,
#     description TEXT,
#     file_url TEXT NOT NULL, -- link to Supabase Storage
#     file_hash CHAR(64) NOT NULL, -- SHA256 hash
#     owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
#     status VARCHAR(20) DEFAULT 'active', -- 'active', 'reported', 'removed'
#     category VARCHAR(50) DEFAULT 'General', NOT NULL
#     upload_date TIMESTAMP DEFAULT now(),
#     UNIQUE (file_hash) -- prevents duplicate files
# );