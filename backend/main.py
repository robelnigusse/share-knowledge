from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth , books , users, reports
from database.config import engine , base



app = FastAPI()
base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://sharepdf.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(books.router)
app.include_router(users.router)
app.include_router(reports.router)
