from fastapi import FastAPI
from . import database

app = FastAPI()

# Temporary check: try connecting
try:
    with database.engine.connect() as conn:
        print("✅ Connected to PostgreSQL successfully!")
except Exception as e:
    print("❌ Database connection failed:", e)


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}
