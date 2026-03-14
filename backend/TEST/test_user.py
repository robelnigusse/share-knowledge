def test_get_user(test_user,client):
    response = client.get("/me")
    assert response.status_code == 200


def test_update_user(client):
    response = client.put("/me", json={"name": "Updated User"})
    assert response.status_code == 200
    assert response.json() == {"message": "User updated successfully"}


