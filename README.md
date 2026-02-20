# VEGA — Startup India Matchmaking Portal

Neobrutalist startup–investor discovery platform. Find your perfect match.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS v4, Motion (Framer Motion), Radix UI, Recharts, React Router v6, Zustand
- **Backend:** Express.js, Prisma, PostgreSQL, JWT (httpOnly cookie)

## Setup

### 1. Database

Create a PostgreSQL database and set:

```bash
# server/.env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
JWT_SECRET="your-secret-key"
```

### 2. Backend

```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run db:seed   # optional: seed user founder@startup.io / raj@angel.in with password "password123"
npm run dev       # runs on http://localhost:3001
```

### 3. Frontend

```bash
cd client
npm install
npm run dev       # runs on http://localhost:5173, proxies /api to backend
```

## Scripts

| Command        | Location | Description        |
|----------------|----------|--------------------|
| `npm run dev`  | client   | Vite dev server    |
| `npm run build`| client   | Production build   |
| `npm run dev`  | server   | Express + watch    |
| `npm run db:push` | server | Apply Prisma schema |
| `npm run db:seed` | server | Seed data          |

## Design

- **Theme:** Neobrutalism with warm natural tones (cream, terracotta, forest-ink)
- **Fonts:** Playfair Display (headings), DM Mono (body), Space Mono (labels)
- **Components:** NeoButton, NeoCard, Badge, MatchScoreRing, EmptyState

## Matching

Match score (0–100): Sector overlap 40 pts, Stage alignment 30 pts, Ticket size fit 30 pts.  
`GET /api/matches` returns ranked matches for the current user (startup sees investors, investor sees startups).

## License

MIT

## PPT Link
https://drive.google.com/file/d/16EbfLw7duG6yjmSF7L5GkhDy7LYs29ge/view?usp=drivesdk