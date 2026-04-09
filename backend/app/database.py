import os

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB", "weather_app")

_client: AsyncIOMotorClient | None = None


async def connect_db() -> None:
    """Open the MongoDB connection and create useful indexes."""
    global _client
    _client = AsyncIOMotorClient(MONGODB_URL)

    # Index on searched_at enables efficient newest-first sorting
    await _client[DB_NAME].search_history.create_index("searched_at")


async def close_db() -> None:
    """Close the MongoDB connection gracefully."""
    global _client
    if _client:
        _client.close()
        _client = None


def get_db() -> AsyncIOMotorDatabase:
    """FastAPI dependency: returns the active MongoDB database instance."""
    return _client[DB_NAME]
