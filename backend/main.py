from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth
from api import books
from database.config import engine , base
from api import users 
# from database.models.reports import reports


app = FastAPI()
base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(books.router)
app.include_router(users.router)

