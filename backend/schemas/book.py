from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class BookUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None



class BookResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    file_url: str
    category: str
    upload_date: datetime
    
    model_config = ConfigDict(from_attributes=True)