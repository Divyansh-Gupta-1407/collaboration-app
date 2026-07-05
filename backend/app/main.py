from fastapi import FastAPI, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from .database import get_db
from .models.user import User
from .schemas.user import UserCreate
from .utils.security import hash_password, verify_password, create_access_token, get_current_user
from .schemas.login import LoginRequest
from .models.document import Document
from .models.collaborator import DocumentCollaborator



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


@app.post("/documents")
def create_document(title: str, content: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    new_doc = Document(title=title, content=content, owner_id=current_user.id)
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return {"id": new_doc.id, "title": new_doc.title, "content": new_doc.content}

@app.get("/documents/{id}")
def read_document(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"id": doc.id, "title": doc.title, "content": doc.content, "owner_id": doc.owner_id}

@app.put("/documents/{id}")
def update_document(id: int, title: str, content: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this document")

    doc.title = title
    doc.content = content
    db.commit()
    db.refresh(doc)
    return {"id": doc.id, "title": doc.title, "content": doc.content}

@app.delete("/documents/{id}")
def delete_document(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this document")

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}

@app.post("/documents/{id}/share")
def share_document(id: int, user_id: int, role: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Ensure document exists
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Only owner can share
    if doc.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to share this document")

    # Insert collaborator
    collaborator = DocumentCollaborator(document_id=id, user_id=user_id, role=role)
    db.add(collaborator)
    db.commit()
    return {"message": "Collaborator added successfully"}

@app.get("/documents/{id}")
def read_document(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Owner?
    if doc.owner_id == current_user.id:
        return {"id": doc.id, "title": doc.title, "content": doc.content}

    # Collaborator?
    collab = db.query(DocumentCollaborator).filter(
        DocumentCollaborator.document_id == id,
        DocumentCollaborator.user_id == current_user.id
    ).first()

    if collab:
        return {"id": doc.id, "title": doc.title, "content": doc.content, "role": collab.role}

    # Else forbidden
    raise HTTPException(status_code=403, detail="Not authorized to view this document")
