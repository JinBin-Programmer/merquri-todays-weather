# Today's Weather

A full-stack weather application built with **Next.js** (frontend) and **Python FastAPI** (backend), powered by the [OpenWeatherMap API](https://openweathermap.org/api).

## Features

- Search current weather by city and optional country code
- Displays condition, temperature range, humidity, and timestamp
- Persistent search history (SQLite) with re-search and delete actions
- Graceful error states for invalid city/country inputs
- Fully containerised with Docker and docker-compose

---

## Project Structure

```
weather-app/
├── backend/                  # Python FastAPI
│   ├── app/
│   │   ├── main.py           # App entry point & CORS config
│   │   ├── database.py       # SQLAlchemy setup
│   │   ├── models/           # ORM models
│   │   ├── routes/           # API route handlers
│   │   └── services/         # OpenWeatherMap API integration
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # Next.js (App Router)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx      # Main "Today's Weather" page
│   │   │   └── api/[...slug] # Server-side proxy to backend
│   │   ├── components/       # SearchForm, WeatherCard, SearchHistory
│   │   ├── hooks/            # useWeather custom hook
│   │   └── types/            # Shared TypeScript interfaces
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── ASSUMPTIONS.md            # UI decisions and design notes
└── README.md
```

---

## Quick Start with Docker

### 1. Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- An OpenWeatherMap API key (free tier works — sign up at https://openweathermap.org/api)

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and set your API key:

```
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 3. Build and run

```bash
docker-compose up --build
```

The first build downloads dependencies and may take a few minutes.

### 4. Open the app

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

### 5. Stop the app

```bash
docker-compose down
```

To also remove the persisted database volume:

```bash
docker-compose down -v
```

---

## Local Development (without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create a .env file in the backend directory
echo "OPENWEATHER_API_KEY=your_key_here" > .env

uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Next.js dev server proxies `/api/*` requests to `http://localhost:8000` by default.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/weather?city=Johor&country=MY` | Fetch weather and save to history |
| `GET` | `/api/history` | List all search history (newest first) |
| `DELETE` | `/api/history/{id}` | Remove a history record |
| `GET` | `/health` | Liveness check |

---

## Environment Variables

| Variable | Service | Description |
|---|---|---|
| `OPENWEATHER_API_KEY` | Backend | Required. Your OpenWeatherMap API key |
| `DATABASE_URL` | Backend | SQLAlchemy DB URL (default: `sqlite:///./weather.db`) |
| `BACKEND_URL` | Frontend | Backend base URL for the server-side proxy (default: `http://localhost:8000`) |

---

## Design Decisions & Assumptions

See [ASSUMPTIONS.md](./ASSUMPTIONS.md) for a full explanation of UI behaviour decisions, tech stack choices, and design trade-offs.
