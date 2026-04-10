from datetime import datetime, timezone, timedelta

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database import get_db
from app.models.search_history import SearchHistoryDocument
from app.services.weather_service import (
    fetch_coords,
    fetch_extended_forecast,
    fetch_forecast,
    fetch_weather,
)

router = APIRouter(prefix="/api", tags=["weather"])

# Singapore Time (UTC+8) — used for display formatting
SGT = timezone(timedelta(hours=8))


def _fmt_sgt(dt: datetime) -> str:
    """Convert any datetime (naive = UTC assumed) to a formatted SGT string."""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(SGT).strftime("%Y-%m-%d %I:%M %p")


@router.get("/weather")
async def get_weather(
    city: str = Query(..., min_length=1, description="City name"),
    country: str = Query("", description="ISO 3166-1 alpha-2 country code (e.g. MY)"),
    save: bool = Query(True, description="Whether to save this search to history"),
    travel_from: str = Query("", description="Optional travel start date (YYYY-MM-DD)"),
    travel_to: str = Query("", description="Optional travel end date (YYYY-MM-DD)"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """
    Fetch current weather for a city/country pair.
    Pass save=false to skip saving to history (e.g. popular-city card clicks).
    """
    try:
        weather_data = await fetch_weather(city.strip(), country.strip())
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    if weather_data is None:
        raise HTTPException(status_code=404, detail="City not found")

    now_utc = datetime.now(timezone.utc)
    history_id = ""

    if save:
        doc = SearchHistoryDocument(
            city=weather_data["city"],
            country=weather_data["country"],
            searched_at=now_utc,
            travel_from=travel_from.strip() or None,
            travel_to=travel_to.strip() or None,
        )
        result = await db.search_history.insert_one(doc.model_dump())
        history_id = str(result.inserted_id)

    return {
        **weather_data,
        "history_id": history_id,
        "searched_at": _fmt_sgt(now_utc),
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
            "searched_at": _fmt_sgt(r["searched_at"]),
            "travel_from": r.get("travel_from"),
            "travel_to": r.get("travel_to"),
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


@router.get("/forecast")
async def get_forecast(
    city: str = Query(..., min_length=1, description="City name"),
    country: str = Query("", description="ISO 3166-1 alpha-2 country code (e.g. MY)"),
    travel_from: str = Query("", description="Travel start date YYYY-MM-DD"),
    travel_to: str = Query("", description="Travel end date YYYY-MM-DD"),
):
    """
    Fetch weather forecast for a city/country pair.

    - Without travel dates: returns OWM 5-day forecast.
    - With both travel dates: returns extended historical+forecast data via
      Open-Meteo (past dates from archive, future up to 16 days from forecast API).
      Includes a `capped` flag when the end date exceeds the 16-day window.
    """
    city = city.strip()
    country = country.strip()

    # ── Extended mode (travel dates provided) ──────────────────────────────────
    if travel_from and travel_to:
        coords = await fetch_coords(city, country)
        if coords is None:
            raise HTTPException(status_code=404, detail="City not found")

        lat, lon = coords
        try:
            days, capped = await fetch_extended_forecast(lat, lon, travel_from, travel_to)
        except Exception:
            raise HTTPException(
                status_code=502,
                detail="Extended forecast service unavailable. Try a shorter date range.",
            )

        return {
            "city": city,
            "country": country,
            "forecast": days,
            "extended": True,
            "capped": capped,
        }

    # ── Standard mode (OWM 5-day forecast) ────────────────────────────────────
    try:
        forecast_data = await fetch_forecast(city, country)
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    if forecast_data is None:
        raise HTTPException(status_code=404, detail="City not found")

    return {**forecast_data, "extended": False, "capped": False}
