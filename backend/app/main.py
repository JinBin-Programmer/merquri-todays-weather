import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import connect_db, close_db
from app.routes.weather import router

# Comma-separated list of allowed origins.
# Override via ALLOWED_ORIGINS env var when deploying (e.g. your Cloud Run frontend URL).
_raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://frontend:3000",
)
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Connect to MongoDB on startup and close the connection on shutdown."""
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="Today's Weather API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
def health_check():
    """Simple liveness probe used by Docker healthcheck."""
    return {"status": "ok"}
