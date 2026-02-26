from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.auth import get_db
from service.auth_service import get_current_user
from schemas.user import UserUpdate, user
from database.models.users import users

router = APIRouter(tags=["users"])
@router.get("/me",response_model=user)
def get_user(db: Session = Depends(get_db),current_user_data: dict = Depends(get_current_user)):
    user_email = current_user_data.get("email")
    me = db.query(users).filter(users.email == user_email).first()
    if not me:
        raise HTTPException(status_code=404, detail="User not found")
    return me

# @router.delete("/me")
# def delete_user(db: Session = Depends(get_db),current_user_data: dict = Depends(get_current_user)):
#     user_email = current_user_data.get("email")
#     user = db.query(users).filter(users.email == user_email).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     db.delete(user)
#     db.commit()
#     return {"message": "User deleted successfully"}


@router.put("/users")
def update_user(
    newuser: UserUpdate,
    db: Session = Depends(get_db),
    current_user_data: dict = Depends(get_current_user),
):
    user_email = current_user_data.get("email")
    update_data = newuser.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided")
    updated_user = (
        db.query(users)
        .filter(users.email == user_email)
        .update(update_data)
    )
    if updated_user == 0:
        raise HTTPException(status_code=404, detail="User not found")
    db.commit()
    return {"message": "User updated successfully"} 

