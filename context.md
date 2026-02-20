Here's a comprehensive design prompt for WD-03 as a Senior Design Engineer:

---

# 🎨 WD-03 — Startup India Matchmaking Portal
## Senior Design Prompt: Full Product Design Specification

---

## 🧭 Design Philosophy & Direction

**Theme:** Neobrutalism with Warm Natural Tones
**Aesthetic DNA:** Raw, unapologetic structure meets the earthy warmth of handmade craft markets. Think cork boards, kraft paper, rubber stamps, bold black borders — but polished and digital. This is the anti-VC-deck design. It feels *founder-made*, like someone who bootstrapped their way to a product.

**Color Palette (CSS Variables):**
```css
--cream: #F5F0E8        /* primary background */
--warm-sand: #E8DCC8    /* card backgrounds */
--terracotta: #C4622D   /* primary accent / CTA */
--burnt-amber: #D4813A  /* secondary accent */
--forest-ink: #2C3E2D   /* primary text, borders */
--dusty-sage: #8FAF7E   /* success states, tags */
--clay-red: #A83E2A     /* danger/reject states */
--chalk-white: #FDFAF4  /* elevated surfaces */
--charcoal: #1A1A1A     /* strong borders, shadows */
```

**Typography:**
- Display: `Playfair Display` (bold, commanding headings)
- Body/UI: `DM Mono` (tabular, structured — feels like a ledger or typewriter)
- Labels/Tags: `Space Mono` (for badges, chips, metadata)

**Border & Shadow System:**
- All interactive cards: `3px solid #1A1A1A` with `4px 4px 0px #1A1A1A` box-shadow
- Hover state: shadow shifts to `6px 6px 0px #1A1A1A` (subtle lift — use `motion` for this)
- Inputs: `2px solid #1A1A1A`, no border-radius or 2px max
- Buttons: `3px solid #1A1A1A`, flat, with terracotta/amber fills

**Motion Strategy (Minimal, Purposeful):**
Use `motion` (Framer Motion) ONLY for:
- Page-level fade + slide-up on mount (`initial: {opacity: 0, y: 20}` → `animate: {opacity: 1, y: 0}`)
- Card hover shadow shift (CSS transition, not JS)
- Match score progress bar fill on load (single `animate` trigger)
- Toast notification slide-in from bottom-right
- Modal backdrop fade
Nothing else. No scroll animations, no parallax, no looping effects.

---

## 🗂️ Tech Stack Specification

```
Frontend:    React 18 + Vite
Styling:     Tailwind CSS v4 (with @theme for custom tokens)
Animation:   Motion (Framer Motion v11)
Icons:       Lucide React
UI Extras:   Radix UI primitives (Dialog, Select, Tabs, Tooltip)
Charts:      Recharts (match score visualization)
Routing:     React Router v6
Backend:     Express.js + Node.js
DB:          PostgreSQL(cloud) + Prisma
Auth:        JWT stored in httpOnly cookie
```

---

## 📄 PAGE-BY-PAGE DESIGN SPEC

---

### PAGE 1: Landing Page `/`

**Purpose:** Convert visitors into registered Startups or Investors. First impression must feel bold, trustworthy, and uniquely Indian-startup-energy.

**Layout: Full-width editorial grid**

**HERO SECTION**
- Background: `--cream` with a subtle noise texture SVG overlay (CSS `background-image` grain filter, opacity 0.04)
- Giant staggered heading (2 lines, Playfair Display, 72-80px):
  - Line 1: `"Find Your"` — forest-ink, normal weight
  - Line 2: `"Perfect Match."` — terracotta, italic bold
- Subtext (DM Mono, 16px, warm-sand-darkened): `"India's most structured startup–investor discovery engine. No cold emails. No noise."`
- Two CTA buttons side by side:
  - `[  🚀 I'm a Startup  ]` — filled terracotta, black border/shadow
  - `[  💼 I'm an Investor  ]` — filled chalk-white, black border/shadow
- Hero visual: A hand-drawn-style illustration (SVG asset) of two hands doing a "deal handshake" emerging from a laptop, with tiny floating tags like `"SaaS"`, `"₹50L Ticket"`, `"Series A"`, `"EdTech"` orbiting it. Use `position: absolute` placement, no animation.

**STATS BAR** (below hero, full-width terracotta strip)
- 4 stats in DM Mono: `1,240 Startups Registered` | `380 Active Investors` | `₹42Cr+ Deals Initiated` | `94% Match Satisfaction`
- Bold charcoal numbers, cream labels

**HOW IT WORKS SECTION**
- Heading: `"Three Steps to a Deal"` (Playfair, 48px)
- 3 large numbered cards in a horizontal row (neobrutalist boxes):
  1. `01 — Build Your Profile` — startup or investor, structured intake
  2. `02 — Get Matched` — our algorithm aligns sector, stage & ticket size
  3. `03 — Connect & Close` — send connection requests, start conversations
- Each card: cream bg, 3px black border, 4px shadow, a bold number in terracotta (120px, Playfair, behind the card content as a watermark-style element)

**FEATURED SECTORS STRIP**
- Horizontal scrollable row (no scrollbar visible) of sector tags: `AgriTech`, `FinTech`, `EdTech`, `CleanEnergy`, `HealthTech`, `D2C`, `DeepTech`, `GovTech`, `SaaS`, `Mobility`
- Each tag: `burnt-amber` bg, black border, DM Mono, rounded-none

**TESTIMONIALS SECTION**
- 2-column grid of quote cards, kraft-paper feel (`--warm-sand` bg)
- Founder and Investor quotes alternating
- Quote mark as decorative oversized `"` in terracotta

**FOOTER**
- Full `--forest-ink` background, cream text
- Logo + tagline left | Quick links center | Social icons right
- Bottom strip: `© 2025 Startup India Matchmaking Initiative` in DM Mono, 12px

---

### PAGE 2: Registration `/register`

**Layout:** Two-column — left panel (decorative/branding), right panel (form)

**Left Panel (40% width)**
- `--terracotta` background
- Large Playfair italic: `"Your next chapter starts here."`
- Illustrated SVG: rocket launching from a map of India
- Bullet list of benefits in DM Mono (white): `✓ Verified Investor Network`, `✓ Smart Matching Engine`, `✓ Zero Cold Outreach`, `✓ 100% Free to Register`

**Right Panel (60% width) — `--chalk-white` bg**
- Role selector at top (big toggle buttons, not a dropdown):
  - `[ 🚀 Startup ]` | `[ 💼 Investor ]` — selected state fills with terracotta
- Form adapts based on role selection (React state-driven conditional rendering, no animation)

**Startup Form Fields:**
- Startup Name, Founder Name, Email, Password
- Industry Sector (Radix Select, styled neobrutalist)
- Business Stage: `Idea | MVP | Early Revenue | Scaling` (4 pill buttons, single-select)
- Funding Sought: slider (styled with terracotta thumb, black track)
- One-liner Pitch (textarea, max 160 chars with live counter in DM Mono)
- Location (State dropdown)

**Investor Form Fields:**
- Full Name, Firm Name (optional), Email, Password
- Investor Type: `Angel | VC | Family Office | Corporate VC` (pill select)
- Preferred Sectors (multi-select tag input — type and add tags)
- Ticket Size Range: dual handle slider (`₹10L – ₹5Cr`)
- Preferred Stages: multi-select pills
- Portfolio Size (optional number input)

**Submit Button:** Full-width, `--terracotta`, `"Create My Profile →"`, 3px black border

---

### PAGE 3: Login `/login`

**Layout:** Centered card on `--cream` textured bg

**Card:** 480px wide, `--chalk-white` bg, 3px black border, `8px 8px 0 #1A1A1A` shadow

- Top: Logo + `"Welcome Back"` (Playfair, 36px)
- Role tabs: `[ Startup ]  [ Investor ]` (Radix Tabs, neobrutalist tab style)
- Email + Password fields
- `"Forgot Password?"` link (DM Mono, 12px, underline)
- Login button: full-width terracotta
- Divider: `— or —` in DM Mono
- Link to Register

---

### PAGE 4: Startup Dashboard `/startup/dashboard`

**Layout:** Fixed left sidebar (240px) + main content area

**Sidebar:**
- Logo at top
- Navigation items (DM Mono, 14px) with Lucide icons:
  - `Dashboard` (Home icon)
  - `My Profile` (User icon)
  - `Matches` (Zap icon) — with badge showing unread count
  - `Connection Requests` (Handshake icon)
  - `Messages` (bonus feature placeholder)
  - `Settings` (Settings icon)
- Bottom: User avatar + name + `Logout` button
- Sidebar bg: `--forest-ink`, text: `--cream`, active item: terracotta left border + amber background

**Main Content — Dashboard Home:**

**Top Stats Row (4 cards):**
- `Match Score Avg`: big number + mini horizontal bar
- `Investors Matched`: count with trend arrow
- `Requests Sent`: count
- `Requests Received`: count
- Each card: chalk-white bg, 3px border, 4px shadow, Playfair number (48px), DM Mono label

**"Your Top Matches" Section:**
- 3-column card grid of investor match cards (see Investor Match Card below)
- `"View All Matches →"` link

**Profile Completion Widget:**
- Horizontal progress bar (terracotta fill, black border)
- `"Your profile is 70% complete"` + checklist of missing items
- Neobrutalist card style

---

### PAGE 5: Investor Dashboard `/investor/dashboard`

Same sidebar structure as Startup dashboard (role-aware nav).

**Main Content:**

**Top Stats Row:**
- `Startups Browsed`, `Requests Received`, `Connections Active`, `Avg Match Score`

**"Recommended Startups" Feed:**
- Full-width list of startup cards (see Startup Discovery Card below)
- Filterable by: Sector, Stage, Funding Range (filter bar at top of feed)
- Filter bar: horizontal row of neobrutalist dropdowns/pills — `forest-ink` bg, cream text

**Preference Summary Card (sidebar-right, sticky):**
- Shows current investment preferences
- `"Edit Preferences"` button

---

### PAGE 6: Match Discovery `/startup/matches` & `/investor/matches`

**Layout:** Full content area with filter sidebar (left 280px) + results grid (right)

**Filter Sidebar (Startup view — filtering investors):**
- Heading: `"Filter Investors"` (Playfair, 24px)
- Investor Type checkboxes (neobrutalist styled: square checkbox, black border)
- Ticket Size range slider
- Preferred Sectors tag filter
- `"Apply Filters"` button (terracotta)
- `"Reset"` text link

**Results Grid (3 columns):**

**Investor Match Card:**
- `--chalk-white` bg, 3px black border, 4px offset shadow
- Top-right badge: Match Score `87%` — filled circle, terracotta bg, bold DM Mono
- Investor name (Playfair, 20px bold)
- Firm name (DM Mono, 12px, muted)
- Tags row: sector preferences as amber pills
- Ticket range: `₹25L – ₹2Cr` in DM Mono
- Stage preference pills
- Two buttons at bottom:
  - `[ View Profile ]` — outlined black
  - `[ Send Request → ]` — filled terracotta
- Hover: shadow deepens from 4px to 6px (CSS transition 150ms)

**Startup Discovery Card (Investor view):**
- Same card structure but shows:
- Startup name + one-liner pitch (truncated to 2 lines)
- Industry sector badge (dusty-sage bg)
- Stage badge (burnt-amber bg)
- Funding sought in large DM Mono
- Match score badge
- `[ View Pitch ]` + `[ Express Interest → ]` buttons

**Empty State:**
- Large illustrated SVG of a compass with "No matches yet — try broadening your filters"
- Centered, charming, not depressing

---

### PAGE 7: Profile Pages

**`/startup/profile/:id` — Public Startup Profile**

Layout: Full-page editorial with cover area + content grid

**Cover Section:**
- `--warm-sand` bg strip (full width, 200px height)
- Startup logo placeholder (big square, 3px black border, terracotta initial letters)
- Startup name: Playfair 48px, overlapping the cover bottom edge
- Stage + Sector badges

**Content Grid (2 col: 65% + 35%):**

Left column:
- `"The Pitch"` section — one-liner in large DM Mono, italic, terracotta
- `"About"` — description text
- `"Traction"` — key metrics as stat boxes (revenue, users, growth %)
- `"The Ask"` — funding amount sought, use of funds breakdown

Right column:
- `"Match Score"` widget (only visible to logged-in investors): circular gauge using Recharts RadialBarChart, terracotta fill
- Founder info card
- Location + Founded date
- `"Connect"` CTA button (full-width, terracotta, sticky at bottom on mobile)

**`/investor/profile/:id` — Public Investor Profile:**
Similar layout showing:
- Investment thesis (quoted text block with giant terracotta quotation mark)
- Portfolio highlights (card list)
- Sector focus tag cloud
- Stage preference visualization (horizontal bar showing stage distribution)
- `"Send Pitch Request"` CTA

---

### PAGE 8: Connection Requests `/startup/requests` & `/investor/requests`

**Layout:** Centered content, max-width 800px

**Tabs:** `Received (4)` | `Sent (7)` | `Accepted (2)` (Radix Tabs)

**Request Card:**
- Horizontal card, full-width
- Avatar/logo left
- Name + role + match score center
- Status badge right: `Pending` (amber), `Accepted` (sage), `Declined` (clay-red)
- For Received tab: `[ Accept ✓ ]` (sage bg) + `[ Decline ✗ ]` (clay-red) buttons
- For Sent tab: just status badge + timestamp in DM Mono
- Card: chalk-white bg, 2px border, 3px shadow

---

### PAGE 9: Edit Profile `/startup/profile/edit` & `/investor/profile/edit`

**Layout:** Centered form card (max-width 720px)

- Section-divided form with bold section headers (Playfair, 24px):
  - `"Basic Info"`, `"Your Pitch"`, `"Traction & Metrics"`, `"Funding Details"`, `"Preferences"`
- Each section visually separated by a dashed `--charcoal` horizontal rule
- Autosave indicator in DM Mono bottom-right: `"Last saved 2 min ago ✓"` (forest-ink)
- `"Save Changes"` button: sticky at bottom of viewport, full-width terracotta strip

---

### PAGE 10: Admin Panel `/admin` *(Bonus)*

**Layout:** Top nav bar + full-width content

**Top Nav:** forest-ink bg, cream text, Playfair logo, nav links: `Overview | Startups | Investors | Connections | Reports`

**Overview Metrics Grid:**
- 4 large stat cards (same neobrutalist style)
- Recharts BarChart: registrations over time (terracotta bars)
- Recharts LineChart: match connections over time (forest-ink line)

**Data Tables (Startups / Investors):**
- Clean table, DM Mono, alternating warm-sand row backgrounds
- Action column: `View | Verify | Suspend`
- Verification badge: `Verified ✓` in dusty-sage, `Unverified` in amber

---

## 🧩 Shared Component Library

**`<NeoButton variant="primary|outline|ghost" />`**
- Primary: terracotta bg, black border, 3px shadow offset
- Outline: transparent bg, black border
- All: no border-radius (or 2px max), DM Mono font

**`<NeoCard />`**
- chalk-white bg, 3px border, `4px 4px 0 #1A1A1A` shadow
- Hover: shadow to `6px 6px 0 #1A1A1A` (CSS transition)

**`<Badge variant="sector|stage|match|status" />`**
- No border-radius, 2px black border, DM Mono 11px

**`<MatchScoreRing score={87} />`**
- Recharts RadialBarChart, terracotta fill, cream bg
- Center: score number in Playfair bold

**`<ToastNotification />`**
- Motion `slide-in from y:60 to y:0`, 300ms ease-out
- Bottom-right fixed, chalk-white bg, 3px border

**`<EmptyState illustration="..." message="..." />`**
- SVG illustration + Playfair message + optional CTA

---

## 🏗️ File/Folder Structure

```
src/
├── components/
│   ├── ui/            (NeoButton, NeoCard, Badge, etc.)
│   ├── layout/        (Sidebar, TopNav, Footer)
│   ├── features/
│   │   ├── matching/  (MatchCard, ScoreRing, FilterSidebar)
│   │   ├── profile/   (StartupProfile, InvestorProfile)
│   │   └── requests/  (RequestCard, RequestTabs)
├── pages/
│   ├── Landing.jsx
│   ├── Register.jsx
│   ├── Login.jsx
│   ├── startup/       (Dashboard, Matches, Profile, EditProfile, Requests)
│   ├── investor/      (Dashboard, Matches, Profile, EditProfile, Requests)
│   └── admin/         (AdminDashboard)
├── hooks/             (useAuth, useMatches, useProfile)
├── store/             (Zustand or Context — auth + profile state)
├── api/               (axios instance + endpoint functions)
└── assets/
    ├── illustrations/ (SVG files: handshake, rocket, compass)
    └── textures/      (noise.svg for background grain)

server/
├── routes/            (auth, startups, investors, matches, requests)
├── middleware/        (authMiddleware, roleGuard)
├── controllers/
├── db/                (SQLite schema + seed data)
└── utils/             (matchingEngine.js — scoring algorithm)
```

---

## 🤝 Matching Algorithm Logic (Express Backend)

**Match Score Formula** for `startup ↔ investor`:

```js
function computeMatchScore(startup, investor) {
  let score = 0;

  // Sector overlap (40 points)
  const sectorMatch = investor.preferredSectors.includes(startup.sector);
  if (sectorMatch) score += 40;

  // Stage alignment (30 points)
  const stageMatch = investor.preferredStages.includes(startup.stage);
  if (stageMatch) score += 30;

  // Ticket size fit (30 points)
  const sought = startup.fundingSought;
  if (sought >= investor.ticketMin && sought <= investor.ticketMax) score += 30;
  else if (sought >= investor.ticketMin * 0.7 && sought <= investor.ticketMax * 1.3) score += 15;

  return score; // 0–100
}
```

Expose as: `GET /api/matches` → returns ranked list with scores

---

## 📐 Design Rules Summary (Quick Reference)

| Element | Value |
|---|---|
| Border radius | 0px (buttons/cards) / 2px max |
| Border width | 2–3px solid `#1A1A1A` |
| Card shadow | `4px 4px 0 #1A1A1A` |
| Hover shadow | `6px 6px 0 #1A1A1A` |
| Primary font | Playfair Display |
| Body font | DM Mono |
| Label font | Space Mono |
| Animation | Motion: page mount + toast only |
| Transitions | CSS: shadow, bg-color (150ms) |
| Max content width | 1280px |
| Sidebar width | 240px (fixed) |

---

This spec gives your team everything needed to build a cohesive, memorable product in 12 hours. Each page has a clear visual hierarchy, the neobrutalist system is consistent throughout, and the warm terracotta/cream palette makes it feel distinctly South Asian and founder-friendly rather than cold Silicon Valley SaaS. Build the matching engine and core pages first — landing, register, login, and the two dashboards — then layer in profiles and requests.