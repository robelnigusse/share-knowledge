from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth
import db.models.users
from db.config import engine



app = FastAPI()
db.models.users.Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

