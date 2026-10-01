from fastapi import FastAPI
from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.profile import router as profile_router
from app.api.skills import router as skills_router

from app.db.dependencies import get_db

app = FastAPI(
    title="CareerPilot AI",
    description="AI-powered career and interview preparation platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_origin_regex=r"^https://5173-.*\.cs-asia-southeast1-fork\.cloudshell\.dev$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(profile_router, prefix="/api/v1")
app.include_router(auth_router)
app.include_router(skills_router, prefix="/api/v1")

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