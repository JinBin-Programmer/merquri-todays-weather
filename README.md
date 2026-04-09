# Today's Weather

A full-stack weather application built with **Next.js** (frontend) and **Python FastAPI** (backend), powered by the [OpenWeatherMap API](https://openweathermap.org/api).

Search current weather by city and country, view persistent search history, and re-search or delete past records.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router, TypeScript, Tailwind CSS) |
| Backend | Python FastAPI (async) |
| Database | MongoDB Atlas |
| External API | OpenWeatherMap Current Weather API |
| Containerisation | Docker + docker-compose |
| Backend Hosting | Google Cloud Run |
| CI/CD | GitHub Actions |

---

## Features

- Search weather by city and optional ISO country code (e.g. `MY`, `JP`)
- Displays weather condition, temperature range, humidity, and timestamp
- Persistent search history stored in MongoDB Atlas
- Re-search from history with one click
- Delete individual history records
- Graceful error states for invalid city/country and inactive API keys
- Fully containerised for local development with docker-compose
- Backend auto-deploys to Cloud Run on every push to `main`

---

## Project Structure

```
merquri-todays-weather/
├── .github/
│   └── workflows/
│       └── deploy-backend.yml    # CI/CD — auto-deploy backend to Cloud Run
├── backend/                      # Python FastAPI
│   ├── app/
│   │   ├── main.py               # App entry point, CORS, lifespan
│   │   ├── database.py           # MongoDB (Motor) connection
│   │   ├── models/               # Pydantic document schemas
│   │   ├── routes/               # API route handlers
│   │   └── services/             # OpenWeatherMap API integration
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                     # Next.js (App Router)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Main "Today's Weather" page
│   │   │   └── api/[...slug]/    # Server-side proxy to backend
│   │   ├── components/           # SearchForm, WeatherCard, SearchHistory
│   │   ├── hooks/                # useWeather — all state & AJAX logic
│   │   └── types/                # Shared TypeScript interfaces
│   └── Dockerfile
├── docker-compose.yml
├── .env.example                  # Environment variable reference
├── ASSUMPTIONS.md                # UI behaviour decisions & design notes
├── DEPLOYMENT.md                 # Step-by-step GCP Cloud Run setup guide
└── README.md
```

---

## Local Development with Docker

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running (Linux containers mode)
- [OpenWeatherMap API key](https://openweathermap.org/api) (free tier)
- MongoDB Atlas connection string (free tier at [mongodb.com](https://www.mongodb.com/atlas))

### 1. Configure environment

```bash
cp .env.example .env
```

Fill in your values in `.env`:

```env
OPENWEATHER_API_KEY=your_openweathermap_key
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=<app>
MONGODB_DB=weather_app
```

### 2. Build and run

```bash
docker-compose up --build
```

### 3. Open the app

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

### 4. Stop

```bash
docker-compose down
```

---

## Local Development (without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
```

Requires `OPENWEATHER_API_KEY`, `MONGODB_URL`, and `MONGODB_DB` set in your environment or a `.env` file inside `backend/`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Next.js dev server proxies `/api/*` to `http://localhost:8000` by default.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/weather?city=Johor&country=MY` | Fetch weather and save to history |
| `GET` | `/api/history` | List all search history (newest first) |
| `DELETE` | `/api/history/{id}` | Remove a history record by MongoDB ID |
| `GET` | `/health` | Liveness check (used by Docker & Cloud Run) |

Full interactive docs available at `/docs` (Swagger UI) when the backend is running.

---

## Environment Variables

| Variable | Service | Description |
|---|---|---|
| `OPENWEATHER_API_KEY` | Backend | Required. OpenWeatherMap API key |
| `MONGODB_URL` | Backend | MongoDB connection string (local or Atlas) |
| `MONGODB_DB` | Backend | MongoDB database name (default: `weather_app`) |
| `ALLOWED_ORIGINS` | Backend | Comma-separated CORS origins (default: `http://localhost:3000`) |
| `BACKEND_URL` | Frontend | Backend base URL for the server-side proxy (default: `http://localhost:8000`) |

---

## CI/CD — GitHub Actions

The workflow at `.github/workflows/deploy-backend.yml` automatically:

1. Builds the backend Docker image
2. Pushes it to **Google Artifact Registry**
3. Deploys it to **Google Cloud Run** (`asia-southeast1`)

**Triggers:** every push to `main` that changes files inside `backend/` or the workflow file itself.

### Required GitHub Secrets

Set these under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|---|---|
| `GCP_PROJECT_ID` | GCP project ID (e.g. `weather-app-492812`) |
| `GCP_SA_KEY` | Full JSON content of the GCP service account key |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key |
| `MONGODB_URL` | MongoDB Atlas connection string |
| `MONGODB_DB` | MongoDB database name |

---

## Cloud Run Deployment

The backend is deployed to GCP Cloud Run and accessible via an auto-generated `*.run.app` URL.

For full setup instructions (enabling APIs, creating Artifact Registry, service account permissions), see [DEPLOYMENT.md](./DEPLOYMENT.md).

After deployment, update the frontend's `BACKEND_URL` to point to the Cloud Run URL, and add the frontend's origin to `ALLOWED_ORIGINS` on the backend:

```bash
gcloud run services update weather-backend \
  --region asia-southeast1 \
  --update-env-vars "ALLOWED_ORIGINS=https://your-frontend-url.com"
```

---

## Design Decisions & Assumptions

See [ASSUMPTIONS.md](./ASSUMPTIONS.md) for UI behaviour decisions, tech stack rationale, and design trade-offs.
