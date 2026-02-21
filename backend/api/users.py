from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.auth import get_db
from service.auth_service import get_current_user
from schemas.user import UserUpdate, user
from database.models.users import users

router = APIRouter(prefix="/users", tags=["users"])
@router.get("/user",response_model=user)
def get_user(db: Session = Depends(get_db),current_user_data: dict = Depends(get_current_user)):
    user_email = current_user_data.get("email")
    user = db.query(users).filter(users.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/update-user")
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
# @router.put("/update-user")
# def update_user(newuser: user,db: Session = Depends(get_db),current_user_data: dict = Depends(get_current_user)):
#     user_email = current_user_data.get("email")
#     updated_user = db.query(database.models.users.users).filter(database.models.users.users.email == user_email).update(newuser.model_dump())
#     if updated_user == 0:
#         raise HTTPException(status_code=404, detail="User not found")
#     db.commit()
#     return {"email": user_email}



