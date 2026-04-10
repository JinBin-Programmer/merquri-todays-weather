import asyncio
import os
from datetime import date as date_cls, datetime, timezone, timedelta

import httpx
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
OPENWEATHER_FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"
OPENWEATHER_GEO_URL = "https://api.openweathermap.org/geo/1.0/direct"

OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
OPEN_METEO_ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"
OPEN_METEO_DAILY = (
    "weather_code,temperature_2m_max,temperature_2m_min,"
    "relative_humidity_2m_max,wind_speed_10m_max"
)

# Singapore / Malaysia time (UTC+8)
SGT = timezone(timedelta(hours=8))

# WMO weather code → (condition, description) — matches OWM condition strings
WMO_CONDITION: dict[int, tuple[str, str]] = {
    0:  ("Clear",        "clear sky"),
    1:  ("Clear",        "mainly clear"),
    2:  ("Clouds",       "partly cloudy"),
    3:  ("Clouds",       "overcast clouds"),
    45: ("Mist",         "fog"),
    48: ("Mist",         "depositing rime fog"),
    51: ("Drizzle",      "light drizzle"),
    53: ("Drizzle",      "moderate drizzle"),
    55: ("Drizzle",      "dense drizzle"),
    61: ("Rain",         "slight rain"),
    63: ("Rain",         "moderate rain"),
    65: ("Rain",         "heavy rain"),
    71: ("Snow",         "slight snow fall"),
    73: ("Snow",         "moderate snow fall"),
    75: ("Snow",         "heavy snow fall"),
    80: ("Rain",         "slight rain showers"),
    81: ("Rain",         "moderate rain showers"),
    82: ("Rain",         "heavy rain showers"),
    85: ("Snow",         "snow showers"),
    86: ("Snow",         "heavy snow showers"),
    95: ("Thunderstorm", "thunderstorm"),
    96: ("Thunderstorm", "thunderstorm with hail"),
    99: ("Thunderstorm", "thunderstorm with heavy hail"),
}


# ── OpenWeatherMap ─────────────────────────────────────────────────────────────

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
        "lat": data["coord"]["lat"],
        "lon": data["coord"]["lon"],
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
        timestamp = datetime.fromtimestamp(entry["dt"], tz=SGT)
        date_key = timestamp.strftime("%Y-%m-%d")

        # OWM 3-hour UTC slots → SGT: prefer 11:00 or 14:00 SGT (local noon-ish)
        if timestamp.hour not in {11, 14}:
            continue

        if date_key in seen_dates:
            continue

        seen_dates.add(date_key)
        daily_forecast.append(
            {
                "date": timestamp.strftime("%a, %b %d"),
                "iso_date": date_key,
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


# ── Open-Meteo (extended / historical) ────────────────────────────────────────

async def fetch_coords(city: str, country: str) -> tuple[float, float] | None:
    """Geocode a city/country via OWM Geocoding API. Returns (lat, lon) or None."""
    params = {
        "q": f"{city},{country}" if country else city,
        "limit": 1,
        "appid": OPENWEATHER_API_KEY,
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(OPENWEATHER_GEO_URL, params=params)

    if resp.status_code != 200:
        return None
    data = resp.json()
    if not data:
        return None
    return data[0]["lat"], data[0]["lon"]


def _parse_open_meteo(daily: dict, today_sgt: date_cls) -> list[dict]:
    """Convert Open-Meteo daily payload → list of ForecastDay-compatible dicts."""
    days = []
    for i, iso in enumerate(daily.get("time", [])):
        d = date_cls.fromisoformat(iso)
        code = int(daily.get("weather_code", [0])[i] or 0)
        condition, description = WMO_CONDITION.get(code, ("Clouds", "cloudy"))
        days.append(
            {
                "date": d.strftime("%a, %b %d"),
                "iso_date": iso,
                "condition": condition,
                "description": description,
                "temp_max": round(float(daily.get("temperature_2m_max", [0])[i] or 0), 1),
                "temp_min": round(float(daily.get("temperature_2m_min", [0])[i] or 0), 1),
                "humidity": int(daily.get("relative_humidity_2m_max", [0])[i] or 0),
                "wind_speed": round(float(daily.get("wind_speed_10m_max", [0])[i] or 0), 1),
                "data_type": "historical" if d < today_sgt else "forecast",
            }
        )
    return days


async def _fetch_archive(lat: float, lon: float, start: date_cls, end: date_cls) -> list[dict]:
    today_sgt = datetime.now(SGT).date()
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.get(
            OPEN_METEO_ARCHIVE_URL,
            params={
                "latitude": lat, "longitude": lon,
                "daily": OPEN_METEO_DAILY,
                "timezone": "auto",
                "start_date": str(start),
                "end_date": str(end),
            },
        )
    if resp.status_code != 200:
        return []
    return _parse_open_meteo(resp.json().get("daily", {}), today_sgt)


async def _fetch_forecast_om(lat: float, lon: float, start: date_cls, end: date_cls) -> list[dict]:
    today_sgt = datetime.now(SGT).date()
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.get(
            OPEN_METEO_FORECAST_URL,
            params={
                "latitude": lat, "longitude": lon,
                "daily": OPEN_METEO_DAILY,
                "timezone": "auto",
                "start_date": str(start),
                "end_date": str(end),
            },
        )
    if resp.status_code != 200:
        return []
    return _parse_open_meteo(resp.json().get("daily", {}), today_sgt)


async def fetch_extended_forecast(
    lat: float,
    lon: float,
    start_date: str,
    end_date: str,
) -> tuple[list[dict], bool]:
    """
    Fetch daily weather for an arbitrary date range using Open-Meteo.

    - Past dates  (before today SGT): archive API
    - Future dates (today → today+16): forecast API
    - Dates beyond +16 days are capped; capped=True is returned.

    Returns (list_of_forecast_days, capped_flag).
    """
    today_sgt = datetime.now(SGT).date()
    start = date_cls.fromisoformat(start_date)
    end_raw = date_cls.fromisoformat(end_date)

    max_future = today_sgt + timedelta(days=16)
    capped = end_raw > max_future
    end = min(end_raw, max_future)

    if start > end:
        return [], capped

    results: dict[str, dict] = {}

    yesterday = today_sgt - timedelta(days=1)
    past_end = min(end, yesterday)
    future_start = max(start, today_sgt)

    call_archive = start <= past_end
    call_forecast = future_start <= end

    tasks: list = []
    if call_archive:
        tasks.append(_fetch_archive(lat, lon, start, past_end))
    if call_forecast:
        tasks.append(_fetch_forecast_om(lat, lon, future_start, end))

    try:
        results_list = await asyncio.gather(*tasks, return_exceptions=True)
    except Exception:
        return [], capped

    idx = 0
    if call_archive:
        archive_days = results_list[idx]
        if isinstance(archive_days, list):
            for d in archive_days:
                results[d["iso_date"]] = d
        idx += 1

    if call_forecast:
        forecast_days = results_list[idx]
        if isinstance(forecast_days, list):
            for d in forecast_days:
                results.setdefault(d["iso_date"], d)  # archive takes priority on overlap

    return sorted(results.values(), key=lambda x: x["iso_date"]), capped
