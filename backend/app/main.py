from fastapi import FastAPI
from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

app = FastAPI(
    title="CareerPilot AI",
    description="AI-powered career and interview preparation platform",
    version="0.1.0",
)

@app.get("/health")
def health_check():
    return {"status": "Welcome to CareerPilot AI!"}

@app.get("/db-health")
def database_health(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))
    return {
        "database": "connected",
        "result": result.scalar(),
    }