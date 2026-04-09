import os
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


async def fetch_weather(city: str, country: str) -> dict | None:
    """
    Fetch current weather from OpenWeatherMap API.

    Args:
        city: City name, e.g. "Johor Bahru"
        country: ISO 3166-1 alpha-2 country code, e.g. "MY"

    Returns:
        Processed weather dict on success, or None if the city/country was not found.

    Raises:
        httpx.HTTPStatusError: For unexpected non-404 API errors.
    """
    params = {
        "q": f"{city},{country}" if country else city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",  # Return temperatures in Celsius
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(OPENWEATHER_BASE_URL, params=params)

    # OpenWeatherMap returns 404 for unknown city/country combinations
    if response.status_code == 404:
        return None

    # 401 means the API key is invalid or not yet activated (new keys can take up to 2 hours)
    if response.status_code == 401:
        raise ValueError("Invalid or inactive OpenWeatherMap API key")

    response.raise_for_status()
    data = response.json()

    # Convert Unix UTC timestamp to a readable datetime string
    dt = datetime.fromtimestamp(data["dt"], tz=timezone.utc)
    formatted_time = dt.strftime("%Y-%m-%d %I:%M %p")

    return {
        "city": data["name"],
        "country": data["sys"]["country"],
        "condition": data["weather"][0]["main"],
        "description": data["weather"][0]["description"],
        "temp_min": round(data["main"]["temp_min"], 2),
        "temp_max": round(data["main"]["temp_max"], 2),
        "humidity": data["main"]["humidity"],
        "time": formatted_time,
    }
