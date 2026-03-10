from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pyrate_limiter import Duration, Limiter, Rate
from api import auth , books , users, reports
from database.config import engine , base
from fastapi_limiter.depends import RateLimiter

app = FastAPI(dependencies=[Depends(RateLimiter(limiter=Limiter(Rate(10, Duration.SECOND * 1))))])
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
