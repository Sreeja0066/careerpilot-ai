import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-flash-latest",
)

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is not set")