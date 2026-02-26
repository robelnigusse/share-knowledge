from pydantic import BaseModel


class ReportCreate(BaseModel):
    book_id: int
    reason: str