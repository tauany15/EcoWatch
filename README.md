# Eco Watch

Eco Watch is a full-stack biodiversity dashboard for exploring cold-biome species and conservation statuses. The API enriches the curated species list with live taxonomy data from GBIF when available, then falls back to a local curated response so the experience remains reliable.

## Tech Stack

- React, TypeScript, Vite, Tailwind CSS
- Express and TypeScript
- GBIF species API for taxonomy enrichment

## Local Development

Install dependencies in both apps:

```bash
cd server
npm install
npm run dev
```

In another terminal:

```bash
cd web
npm install
npm run dev
```

The web app runs on `http://localhost:5173` and the API runs on `http://localhost:3000`.

## Environment Variables

Server:

```bash
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
GBIF_TIMEOUT_MS=4000
CACHE_TTL_MS=1800000
```

Web:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

For a hosted deployment, set `VITE_API_BASE_URL` to your deployed API URL and set `CLIENT_ORIGIN` to your deployed frontend URL.

## API

- `GET /api/health` returns `{ "ok": true }`
- `GET /api/biomes/cold` returns species, conservation status, source metadata, and whether the response used live GBIF taxonomy or curated fallback data

## Production Build

```bash
cd server
npm run build
npm start
```

```bash
cd web
npm run build
npm run preview
```
