# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from api.auth import get_db
# from security.auth_service import get_current_user
# from schemas.user import user
# import database.models.users

# router = APIRouter(prefix="/users", tags=["users"])
# @router.put("/update-user")
# def update_user(newuser: user,db: Session = Depends(get_db),current_user_data: dict = Depends(get_current_user)):
#     user_email = current_user_data.get("email")
#     updated_user = db.query(database.models.users.users).filter(database.models.users.users.email == user_email).update(newuser.model_dump())
#     if updated_user == 0:
#         raise HTTPException(status_code=404, detail="User not found")
#     db.commit()
#     return {"email": user_email}



