
from io import BytesIO
from unittest.mock import patch
import pytest
from database.models.users import users
from database.models.books import books

@pytest.fixture
def test_book(db):
    book = books(
        title="Test Book",
        description="This is a test book",
        file_url="https://example.com/test.pdf",
        file_hash="test_hash",
        owner_id=1,
    )

    db.add(book)
    db.commit()
    db.refresh(book)

    return book


def test_upload_book(client,test_user):
    files = {
        "file": ("test.pdf", BytesIO(b"pdf content"), "application/pdf")
    }
    with (
        patch('api.books.upload_book_to_db') as mock_upload_book_to_db,
        patch('api.books.get_hash') as mock_get_hash,
        patch('api.books.get_book_description') as mock_get_book_description,
        patch('api.books.upload_book_to_storage') as mock_upload_book_to_storage,
        patch('api.books.check_file_exists') as mock_check_file_exists
        ):
        mock_upload_book_to_db.return_value = None
        mock_get_hash.return_value = "test_hash"
        mock_get_book_description.return_value = "This is a test book"
        mock_upload_book_to_storage.return_value = "https://example.com/test.pdf"
        mock_check_file_exists.return_value = None


        response = client.post("/books", files=files)
    assert response.status_code == 200


def test_get_all_books(test_book,client):
    response = client.get("/books")
    assert response.status_code == 200 


def test_download_book(client):
    response = client.get(f"/books/download/{1}")
    assert response.status_code == 200
    assert response.json() == {"file_url": "https://example.com/test.pdf"}

def test_users_books(client):
    response = client.get("/books/me")
    assert response.status_code == 200

def test_delete_book(client):
    response = client.delete(f"/books/{1}")
    assert response.status_code == 200
    assert response.json() == {"message": "Book deleted successfully"}


    
