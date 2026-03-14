from fastapi.testclient import TestClient
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from database.models.users import users
from main import app
from service.auth_service import get_current_user

from api.auth import get_db
from database.config import base

#StaticPool to share the connection in memory
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 2. Create the tables
base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
def override_get_current_user():
    return {"email": "example@example.com"}

@pytest.fixture
def test_user(db):

    user = users(
        name="Test User",
        email="example@example.com",
        google_id="12345"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@pytest.fixture
def db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def client():
    return TestClient(app)

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user