from datetime import datetime

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_db
from app.models.search_history import SearchHistoryDocument
from app.services.weather_service import fetch_weather

router = APIRouter(prefix="/api", tags=["weather"])


@router.get("/weather")
async def get_weather(
    city: str = Query(..., min_length=1, description="City name"),
    country: str = Query("", description="ISO 3166-1 alpha-2 country code (e.g. MY)"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Fetch current weather for a city/country pair.

    Saves the search to history on success.
    Returns 404 if the city/country combination is not recognised by OpenWeatherMap.
    Returns 502 if the OpenWeatherMap API key is invalid or not yet activated.
    """
    try:
        weather_data = await fetch_weather(city.strip(), country.strip())
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    if weather_data is None:
        raise HTTPException(status_code=404, detail="City not found")

    # Build and persist the search record
    doc = SearchHistoryDocument(
        city=weather_data["city"],
        country=weather_data["country"],
        searched_at=datetime.utcnow(),
    )
    result = await db.search_history.insert_one(doc.model_dump())

    return {
        **weather_data,
        "history_id": str(result.inserted_id),
        "searched_at": doc.searched_at.strftime("%I:%M:%S %p"),
    }


@router.get("/history")
async def get_history(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Return all search history records ordered by most recent first."""
    cursor = db.search_history.find().sort("searched_at", -1)
    records = await cursor.to_list(length=None)

    return [
        {
            "id": str(r["_id"]),
            "city": r["city"],
            "country": r["country"],
            "searched_at": r["searched_at"].strftime("%I:%M:%S %p"),
        }
        for r in records
    ]


@router.delete("/history/{history_id}", status_code=204)
async def delete_history(history_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Remove a single search history record by its MongoDB ObjectId."""
    try:
        oid = ObjectId(history_id)
    except InvalidId:
        raise HTTPException(status_code=404, detail="Record not found")

    result = await db.search_history.delete_one({"_id": oid})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")
