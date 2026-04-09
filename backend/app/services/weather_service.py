import os
from datetime import datetime, timezone, timedelta

import httpx
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
OPENWEATHER_FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"

# Singapore / Malaysia time (UTC+8)
SGT = timezone(timedelta(hours=8))


async def fetch_weather(city: str, country: str) -> dict | None:
    """
    Fetch current weather from OpenWeatherMap API.

    Returns processed weather dict on success, or None if city/country not found.
    Raises ValueError for invalid API key.
    All times are expressed in UTC+8 (Singapore Time).
    """
    params = {
        "q": f"{city},{country}" if country else city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(OPENWEATHER_BASE_URL, params=params)

    if response.status_code == 404:
        return None

    if response.status_code == 401:
        raise ValueError("Invalid or inactive OpenWeatherMap API key")

    response.raise_for_status()
    data = response.json()

    # Convert Unix timestamp → SGT
    dt = datetime.fromtimestamp(data["dt"], tz=SGT)
    formatted_time = dt.strftime("%Y-%m-%d %I:%M %p")

    return {
        "city": data["name"],
        "country": data["sys"]["country"],
        "condition": data["weather"][0]["main"],
        "description": data["weather"][0]["description"],
        "temp_min": round(data["main"]["temp_min"], 2),
        "temp_max": round(data["main"]["temp_max"], 2),
        "temp_current": round(data["main"]["temp"], 2),
        "feels_like": round(data["main"]["feels_like"], 2),
        "humidity": data["main"]["humidity"],
        "pressure": data["main"]["pressure"],
        "visibility_km": round((data.get("visibility", 0) or 0) / 1000, 2),
        "wind_speed": round(data.get("wind", {}).get("speed", 0), 2),
        "cloudiness": data.get("clouds", {}).get("all", 0),
        "sunrise": datetime.fromtimestamp(
            data["sys"]["sunrise"], tz=SGT
        ).strftime("%I:%M %p"),
        "sunset": datetime.fromtimestamp(
            data["sys"]["sunset"], tz=SGT
        ).strftime("%I:%M %p"),
        "time": formatted_time,
    }


async def fetch_forecast(city: str, country: str) -> dict | None:
    """Fetch 5-day weather forecast and return one noon-ish point per day (in SGT)."""
    params = {
        "q": f"{city},{country}" if country else city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(OPENWEATHER_FORECAST_URL, params=params)

    if response.status_code == 404:
        return None

    if response.status_code == 401:
        raise ValueError("Invalid or inactive OpenWeatherMap API key")

    response.raise_for_status()
    data = response.json()

    seen_dates: set[str] = set()
    daily_forecast = []

    for entry in data.get("list", []):
        # Convert to SGT so date grouping and hour filtering are local-time–aware
        timestamp = datetime.fromtimestamp(entry["dt"], tz=SGT)
        date_key = timestamp.strftime("%Y-%m-%d")

        # Prefer the noon-ish SGT data point (12:00 or 15:00 SGT)
        if timestamp.hour not in {12, 15}:
            continue

        if date_key in seen_dates:
            continue

        seen_dates.add(date_key)
        daily_forecast.append(
            {
                "date": timestamp.strftime("%a, %b %d"),
                "condition": entry["weather"][0]["main"],
                "description": entry["weather"][0]["description"],
                "temp_min": round(entry["main"]["temp_min"], 2),
                "temp_max": round(entry["main"]["temp_max"], 2),
                "humidity": entry["main"]["humidity"],
                "wind_speed": round(entry.get("wind", {}).get("speed", 0), 2),
            }
        )

        if len(daily_forecast) == 5:
            break

    return {
        "city": data["city"]["name"],
        "country": data["city"]["country"],
        "forecast": daily_forecast,
    }
