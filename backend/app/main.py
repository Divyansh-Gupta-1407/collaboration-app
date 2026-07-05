from fastapi import FastAPI, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from .database import get_db
from .models.user import User
from .schemas.user import UserCreate
from .utils.security import hash_password, verify_password, create_access_token, get_current_user
from .schemas.login import LoginRequest


app = FastAPI()


@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        existing_user = db.query(User).filter(User.username == user.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")

        hashed_pw = hash_password(user.password)
        new_user = User(username=user.username, password_hash=hashed_pw)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User registered successfully", "id": new_user.id}
    except Exception as e:
        print("❌ Error in /register:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me")
def read_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "username": current_user.username}
