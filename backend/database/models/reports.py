# from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, UniqueConstraint, func
# from database.config import base
# from sqlalchemy.orm import relationship

# class reports(base):
#     __tablename__ = "reports"
    
#     id = Column(Integer, primary_key=True, unique=True, nullable=False,autoincrement=True)
#     user_id = Column(Integer , ForeignKey("users.id",ondelete="CASCADE") , nullable=False)
#     book_id = Column(Integer , ForeignKey("books.id",ondelete="CASCADE") , nullable=False)
#     reason = Column(String(255) , nullable=False)
#     created_at = Column(DateTime , server_default=func.now())

#     # Prevent duplicate reports
#     __table_args__ = (
#         UniqueConstraint('user_id', 'book_id', name='unique_user_book_report'),
#     )

#     user = relationship("users", back_populates="reports")
#     book = relationship("books", back_populates="reports")


# # CREATE TABLE reports (
# #     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
# #     book_id UUID REFERENCES books(id) ON DELETE CASCADE,
# #     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
# #     reason VARCHAR(255) NOT NULL,
# #     created_at TIMESTAMP DEFAULT now(),
# #     UNIQUE (book_id, user_id)
# # );