from fastapi import FastAPI
from .database import engine, Base
from .models import user, document, collaborator
app = FastAPI()

# Create tables in the database
Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}
