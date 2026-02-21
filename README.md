# NEXUS — Startup India Matchmaking Portal

AI-powered startup–investor discovery platform. Find your perfect match with ML-ranked compatibility scores, saved matches, pitch requests, and real-time notifications.

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| **Frontend** | React 19, Vite 7, TypeScript, Tailwind CSS v4, Motion (Framer Motion), Radix UI, Recharts, React Router v7, Zustand |
| **Backend**  | Node.js (ESM), Express, Prisma 5, PostgreSQL, JWT (httpOnly cookie), WebSockets |
| **AI / ML**  | Google Gemini (pitch generation), ML-based match ranking (regression model) |
| **Email**    | Nodemailer (SMTP) for pitch/connection emails |

## Project Structure

```
VEGA/
├── client/                 # React SPA (Vite)
│   ├── public/             # Static assets (logo, favicon)
│   └── src/
│       ├── api/            # Axios client, endpoints
│       ├── components/     # UI, layout, home sections
│       ├── pages/          # Routes (Landing, Login, Register, startup/*, investor/*)
│       ├── store/          # Zustand (auth)
│       └── hooks/          # useWebSocket, etc.
├── server/                 # Express API
│   ├── routes/             # auth, matches, dashboard, startups, investors, requests, saved, pitch, matchScore, notifications, catalog
│   ├── middleware/         # authMiddleware
│   ├── prisma/             # schema, seed, migrations
│   ├── utils/              # matchingEngine, mlMatchingEngine, mailer
│   ├── uploads/            # Pitch deck PDFs (gitignored)
│   └── websocket.js        # Real-time notifications
└── public/                 # Shared static files served by API (e.g. logo)
```

## Setup

### 1. Database

Create a PostgreSQL database (e.g. [Neon](https://neon.tech), Supabase, or local). In `server/.env`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
JWT_SECRET="your-secret-key"
PORT=3001
```

Optional (for production / emails / AI):

- `NODE_ENV=production`
- `FRONTEND_URL=https://your-frontend.vercel.app` (for CORS and email links)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (for pitch/connection emails)
- `GEMINI_API_KEY` (for AI pitch/description generation)

### 2. Backend

```bash
cd server
npm install
npm run build          # prisma generate (required for deploy)
npx prisma db push     # apply schema
npm run db:seed        # optional: demo users (demo-startup-N@nexus.demo / demo-investor-N@nexus.demo, password123)
npm run dev            # http://localhost:3001, WebSocket at ws://localhost:3001/ws
```

### 3. Frontend

```bash
cd client
npm install
npm run dev            # http://localhost:5173 (use /api for backend when same-origin or proxy)
```

For **local dev**, leave `VITE_API_URL` unset so the app uses `/api` (same host). For **deployed frontend** (e.g. Vercel) talking to a separate backend (e.g. Render), set in Vercel env:

- `VITE_API_URL=https://your-backend.onrender.com/api`
- `VITE_WS_URL=wss://your-backend.onrender.com/ws` (optional, for notifications)

## Scripts

| Command           | Where   | Description |
|------------------|---------|-------------|
| `npm run dev`    | client  | Vite dev server |
| `npm run build`  | client  | TypeScript check + Vite production build |
| `npm run preview`| client  | Preview production build |
| `npm run dev`    | server  | Express with `--watch` |
| `npm run start`  | server  | Run production server |
| `npm run build`  | server  | `prisma generate` (run before deploy) |
| `npm run db:push`| server  | Apply Prisma schema to DB |
| `npm run db:seed`| server  | Seed demo startups/investors |
| `npm run ml:build` | server | Build ML regression data |
| `npm run ml:train` | server | Train match model (Python) |

## API Overview

| Path | Description |
|------|-------------|
| `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | Auth (cookies) |
| `GET /api/dashboard` | Startup or investor dashboard (matches, readiness, activity) |
| `GET /api/matches` | Paginated, ranked matches (sector/stage filters) |
| `GET /api/saved`, `POST /api/saved/:id`, `DELETE /api/saved/:id` | Saved matches |
| `GET /api/requests`, `POST /api/requests`, `POST /api/requests/:id/accept|decline` | Connection requests |
| `GET /api/startups/:id`, `PATCH /api/startups/:id` | Startup profile (investor view) |
| `GET /api/investors/:id`, `PATCH /api/investors/:id` | Investor profile |
| `POST /api/match-score/explain` | Match score breakdown (sector, stage, funding, idea similarity) |
| `POST /api/pitch/generate` | AI pitch/description (Gemini) |
| `GET /api/uploads/:filename` | Serve pitch deck PDFs |
| `GET /api/notifications`, `POST /api/notifications/mark-all-read` | Notifications |
| `GET /api/health` | Health check |

Auth is also mounted at `/auth/*` for compatibility (e.g. `/auth/login`).

## Matching

- **Score (0–100):** Sector overlap, stage alignment, ticket size fit, and (for startups) idea-similarity from ML.
- **Ranking:** ML-based when available (`mlMatchingEngine`), with rule-based fallback.
- **Saved:** Startups can save investors; Matches view supports `?saved=1` to show only saved.

## Design

- **Theme:** Neobrutalism with warm tones (cream, terracotta, forest-ink).
- **Fonts:** Playfair Display (headings), DM Sans / Mono (body/labels).
- **UI:** NeoButton, NeoCard, Badge, MatchScoreRing, EmptyState; responsive layout with bottom nav on mobile, sidebar on desktop.

## Deployment

- **Frontend:** Vercel (or similar). Set `VITE_API_URL` and optionally `VITE_WS_URL`. Add `client/vercel.json` (SPA rewrites) so routes like `/startup/dashboard` serve `index.html`.
- **Backend:** Render (or similar). Build: `npm install && npm run build`. Start: `npm start`. Set `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`; optional SMTP and `GEMINI_API_KEY`. Cookie is set with `SameSite=None` in production for cross-origin (Vercel ↔ Render).

## License

MIT

