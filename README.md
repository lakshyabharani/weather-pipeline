# Weather Pipeline

An automated data pipeline that fetches real-time weather data for 14 cities across the world every hour, stores snapshots in PostgreSQL, and visualizes trends on a live dashboard.

## Architecture

```
Open-Meteo API (free, no key needed)
        ↓
NestJS Pipeline (cron job — every hour)
        ↓
PostgreSQL (stores hourly snapshots)
        ↓
REST API + Live Dashboard (Chart.js)
```

## Features

- **Automated pipeline** — cron job fetches weather every hour for all 14 cities
- **On-demand fetch** — manual trigger via `POST /api/weather/fetch`
- **Historical data** — query hourly weather history for any tracked city
- **Live dashboard** — dark mode UI with interactive temperature, humidity and wind charts
- **Global coverage** — tracks cities across North America, Europe, Asia, Oceania and South America
- **No API key needed** — uses Open-Meteo, a completely free and open weather API

## Tech Stack

- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL (via Docker)
- **ORM:** TypeORM
- **Scheduler:** @nestjs/schedule (cron)
- **HTTP Client:** Axios
- **Charts:** Chart.js
- **Data Source:** [Open-Meteo API](https://open-meteo.com)

## Tracked Cities

| Region | City |
|--------|------|
| North America | Washington DC, New York, Los Angeles, Chicago, Toronto |
| Europe | London, Paris, Berlin |
| Asia | Tokyo, Dubai, Singapore, Mumbai |
| Oceania & South America | Sydney, São Paulo |

## Project Structure

```
weather-pipeline/
├── src/
│   ├── weather/
│   │   ├── weather.entity.ts      # TypeORM entity — weather snapshots table
│   │   ├── weather.service.ts     # Fetcher, cron job, DB queries
│   │   ├── weather.controller.ts  # REST endpoints
│   │   └── weather.module.ts
│   ├── app.module.ts
│   └── main.ts
├── public/
│   └── index.html                 # Live dashboard (Chart.js)
├── docker-compose.yml
├── .env.example
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather/latest` | Latest snapshot for all 14 cities |
| GET | `/api/weather/history?city=Tokyo&limit=24` | Last 24 hourly readings for a city |
| GET | `/api/weather/cities` | List of all tracked cities |
| POST | `/api/weather/fetch` | Manually trigger a data fetch now |

## Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop

### 1 — Clone the repo

```bash
git clone https://github.com/lakshyabharani/weather-pipeline.git
cd weather-pipeline
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Set up environment variables

```bash
cp .env.example .env
```

### 4 — Start the database

```bash
docker-compose up -d
```

### 5 — Start the server

```bash
npm run start:dev
```

### 6 — Open the dashboard

```
http://localhost:3000
```

### 7 — Trigger your first data fetch

Click **"Fetch Now"** on the dashboard, or run:

```bash
curl -X POST http://localhost:3000/api/weather/fetch
```

## Example API Response

```json
GET /api/weather/latest

[
  {
    "id": "6cafa751-cc5a-4968-a2fd-3d42230f0211",
    "city": "Tokyo",
    "temperature": 28.4,
    "windspeed": 12.1,
    "humidity": 74,
    "weatherCode": 2,
    "description": "Partly cloudy",
    "fetchedAt": "2026-06-05T22:00:11.886Z"
  }
]
```

## How the Pipeline Works

1. On startup, NestJS registers a cron job that fires every hour
2. The cron job calls the Open-Meteo API for each of the 14 tracked cities
3. Each response is parsed and saved as a `WeatherSnapshot` in PostgreSQL
4. The REST API exposes the stored data for querying
5. The dashboard fetches from the API and renders live charts using Chart.js

## Data Growth

| Timeframe | Snapshots stored |
|-----------|-----------------|
| 1 hour | 14 rows |
| 1 day | 336 rows |
| 1 week | 2,352 rows |
| 1 month | ~10,080 rows |

## Author

**Lakshya Bharani**
[LinkedIn](https://www.linkedin.com/in/lakshya-bharani) · [GitHub](https://github.com/lakshyabharani) · [Portfolio](https://lakshyabharani.github.io)