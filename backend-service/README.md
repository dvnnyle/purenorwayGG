# Backend Service

Shared backend API for static `bigwater` and `admin-console` frontends.

## Endpoints

- `GET /health`
- `POST /api/newsletter/subscribe`
- `POST /api/newsletter/unsubscribe`
- `POST /api/newsletter/send`

## Run locally

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   - `npm install`
3. Start server:
   - `npm run dev`

Server runs on `http://localhost:8787` by default.
