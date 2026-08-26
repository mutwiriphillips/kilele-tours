# Kilele Tours & Travel

A booking-request web app for a tours & travel company covering weddings,
funerals, game park safaris, corporate events, airport transfers, and
general travel. Customers browse the fleet and submit a quote request with
date, route, and passenger count; the company follows up with a fixed
price.

"Kilele" is Swahili for peak/summit — chosen for a brand that needs to feel
professional to international clients while staying distinctly Kenyan, and
because it sits naturally alongside the mountain, migration, and
high-altitude experiences (Mt Kenya, paragliding) the homepage now leads
with.

Brand: deep pine green + warm sand + muted brass, serif display type
(Fraunces) for gravitas, humanist sans (Public Sans) for everything
functional. The homepage hero is an original illustrated sunset panorama —
Mt Kenya on the skyline, a wildebeest line, Big Five silhouettes, and a
paraglider — deliberately illustrative rather than photographic, consistent
with the rest of the site's artwork and free of any stock-photo licensing
question.

## Structure

```
kilele/
  backend/     Express + SQLite API (quote requests, vehicle fleet)
  frontend/    React (Vite) + Tailwind CSS
```

## Running locally

You'll need Node.js 18+ installed.

**1. Start the backend** (runs on http://localhost:4000)

```bash
cd backend
npm install
ADMIN_PASSWORD=whatever-you-like npm run dev
```

This creates `backend/data/kilele.db` on first run and seeds it with six
sample vehicles (saloon, safari 4x4, shuttle van, coaster bus, luxury van,
and a funeral convoy vehicle). Edit the `vehicles` array in `db.js` to
match your real fleet. If you skip `ADMIN_PASSWORD`, the server falls back
to `kilele-admin` and logs a warning — fine for poking around locally,
not for anything real.

**2. Start the frontend** (runs on http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to the backend automatically
(see `vite.config.js`), so open http://localhost:5173 and everything just
works together. Visit http://localhost:5173/admin for the staff dashboard.

**Testing the production build locally** (optional) — the backend serves
the built frontend directly in production, so you can test that exact path
before deploying:

```bash
cd frontend && npm run build && cd ../backend && ADMIN_PASSWORD=test node server.js
```

Then open http://localhost:4000 — both the public site and `/admin` are
served from the one process, same as on Render.

## What's built

- **Home** — an illustrated sunset hero (Mt Kenya, Big Five silhouettes,
  wildebeest line, paraglider) leading with the destinations that draw
  people to Kenya, a "Signature Kenya Experiences" grid (Big Five, Mount
  Kenya, the Great Migration, the Coast, Rift Valley paragliding) linking
  into the itinerary planner and I-ZURU previews, the "one road, every
  occasion" service section, and a VIP International teaser.
- **Services** — detail on weddings, funerals, safaris, corporate/events,
  airport transfers, and general travel.
- **Fleet** — live vehicle list pulled from the API, with a mock 360°
  walkthrough per vehicle (drag-to-pan interior preview, three scenes:
  front cabin, middle row, boot/luggage) and daily rate guidance.
- **Itinerary Planner** (`/itinerary`) — a curated catalogue of 16 Kenya
  tour sites (national parks & reserves, rift valley, coast, culture &
  heritage), filterable by category. Each site card has:
  - **Add to itinerary** — builds a running shortlist, shown in a sticky
    bottom bar with removable chips, persisted for the browser session.
  - **View on I-ZURU** — opens `/izuru-preview/:siteId`, a clearly labelled
    placeholder for where a real 360° I-ZURU tour of that site would open.
    It's honest that this is a mock (I-ZURU is pre-launch), not a live
    integration.
  - **Request a quote for this itinerary** — carries the full shortlist
    into the quote form via `?sites=id1,id2,...`.
- **VIP International** (`/vip`) — the bundled tier for international
  guests: airport pickup, hotel/lodge transfers, and game drives as one
  itinerary. The page explicitly frames the handoff between **I-ZURU**
  (property preview before commitment) and **Kilele** (ground execution from
  landing to departure) as two systems serving one trip.
- **Request a quote** — the booking form, with a **Standard / VIP
  International** tier toggle and, when arriving from the itinerary
  planner, a banner showing the selected sites (editable, links back to
  `/itinerary`). The chosen route pre-fills the drop-off field and is
  stored on the quote as a plain-text `itinerary` field. VIP unlocks an
  arrival & stay fieldset (flight number, arrival date & time,
  accommodation, nights, game-drive opt-in), validated server-side. VIP
  references are prefixed `KLT-VIP-` instead of `KLT-`.
- **About / Contact** — company positioning and direct contact info.
- **Admin dashboard** (`/admin`) — password-gated staff view. See
  [Admin dashboard](#admin-dashboard) below.

No online payment is wired up — by design, this is a *request-a-quote*
flow, not a pay-now booking flow, since pricing for tours/travel usually
depends on a human quoting distance and occasion specifics.

### On I-ZURU

The VIP page, the Fleet page's 360° walkthrough, and the Itinerary
Planner's "View on I-ZURU" links all reference **I-ZURU** — a separate,
pre-MVP virtual-tour platform ("see the space before you book it") — as
the natural upstream partner: I-ZURU lets a guest preview a property or
site before committing, and this platform owns everything that happens
physically once they land. Nothing here calls a real I-ZURU API or links
to a real I-ZURU URL (a URL that doesn't exist yet would be a broken or
misleading link); the `/izuru-preview/:siteId` route and the 360°
walkthrough are both clearly labelled mocks until an actual technical or
business integration exists.

## Admin dashboard

`/admin` is a password-gated staff view, kept deliberately outside the
public site's header/footer/nav. It is **not** linked from anywhere on
the public site — staff need to know the URL.

**Login.** One shared password, set via the `ADMIN_PASSWORD` environment
variable. On success the server hands back an opaque session token (valid
12 hours), which the browser holds in `sessionStorage` and sends as
`Authorization: Bearer <token>` on every admin request. There's no
per-user login, no password reset flow, and no rate-limiting on login
attempts — appropriate for a small team sharing one door code, not for
anything handling sensitive data at scale. See "Before this handles more"
below for what to add if that changes.

**Dashboard.** A filterable table of every request (status, tier),
newest first. Clicking a row opens a detail panel with the full trip,
contact, and (for VIP) arrival/stay information.

**Changing status.** Five states — pending, quoted, confirmed, declined,
cancelled — set with one click, no confirmation dialog, updates instantly.

**Sending a quote.** Enter a price in KES (message is optional — leave it
blank and the server writes a sensible default referencing the route,
date, passenger count, and price). Saving stores the quote on the request
and marks it `quoted`. **Nothing is sent automatically** — there's no
email or SMS provider wired up, so the panel instead hands back:
- a `wa.me` link pre-filled with the message, opening WhatsApp with that
  customer's number already in place;
- a `mailto:` link with the same message, if the customer left an email;
- a copy-to-clipboard button, for anything else (SMS, a different app).

This is an honest design choice, not a shortcut to fix later: claiming a
quote was "sent" without a real delivery channel behind it would be
misleading. If you later add a transactional email/SMS provider (Twilio,
SendGrid, Africa's Talking), the natural place to wire it in is right
after the `UPDATE` in `POST /api/admin/quotes/:id/quote` in `server.js`.

**Before this handles more** than a small team's day-to-day quoting:
move sessions from in-memory (lost on every restart, and won't work if
you ever run more than one server instance) to a store like Redis or the
database itself; move the session token from `sessionStorage` to an
httpOnly cookie; add per-staff logins instead of one shared password; and
add login rate-limiting.

## Deployment (Render)

The backend serves the built frontend directly (see the static-file
block at the bottom of `server.js`), so this deploys as **one** Render
web service — no separate static site, no CORS configuration to manage.

### Option A — Blueprint (recommended)

1. Push this project to a GitHub repo.
2. In the Render dashboard: **New → Blueprint**, point it at the repo.
   Render reads `render.yaml` and configures the service automatically.
3. When prompted, set `ADMIN_PASSWORD` to something real (`sync: false`
   in the blueprint means Render will ask rather than guess).
4. Deploy. Render runs the `buildCommand` (builds the frontend, installs
   the backend), then the `startCommand` (starts the Express server,
   which now serves both the API and the built frontend).

### Option B — Manual web service

1. **New → Web Service**, connect the repo.
2. **Build command:**
   `cd frontend && npm install --include=dev && npm run build && cd ../backend && npm install`
3. **Start command:** `cd backend && node server.js`
4. **Environment:** add `ADMIN_PASSWORD` and `NODE_ENV=production`.
5. **Health check path:** `/api/health`.

### Troubleshooting: `vite: not found`

If the build fails with `sh: 1: vite: not found`, it's because `NODE_ENV=production`
was set *before* `npm install` ran — npm then skips `devDependencies`,
and `vite` (along with Tailwind/PostCSS) lives there since they're only
needed at build time, not at runtime. Both build commands above already
include `--include=dev` to force-install them regardless of `NODE_ENV`;
if you've customized the build command, make sure that flag survives.

### Troubleshooting: `better-sqlite3` build fails / 404 downloading Node headers

`better-sqlite3` is a native module — it needs either a prebuilt binary
for your exact Node version, or working compiler headers to build from
source. If Render picks an unpinned or very new/alpha Node version (this
has happened when no version is pinned at all — Render defaulted to an
alpha build with no published headers, and the install failed with a 404
downloading `node-vX.Y.Z-headers.tar.gz`), the install fails outright.

Fixed here by pinning Node explicitly two ways: the `.node-version` file
at the repo root, and a `NODE_VERSION` env var in `render.yaml`. Both
point at the same stable LTS release. If you ever change the Node
version, keep `.node-version`, the `NODE_VERSION` env var, and
`engines.node` in `backend/package.json` in sync — a mismatch between
them is exactly what causes Render to fall back to guessing.

### Data persistence

Render's **free** plan doesn't support persistent disks — the SQLite
file lives on ephemeral storage and resets on every redeploy and on the
periodic restarts free services get. That's fine for testing the
deployment itself, but **upgrade to at least the Starter plan before
relying on this for real customer requests**, then:

1. In the Render dashboard, add a disk to the service — mount path
   `/data`, 1GB is plenty for a long time.
2. Add an environment variable `DATA_DIR=/data`.
3. Redeploy. `db.js` already reads `DATA_DIR` when it's set (see the
   commented-out block in `render.yaml` for the equivalent blueprint
   config).

### Cold starts

Free-plan Render services spin down after inactivity and take a beat to
wake back up on the next request — the first visitor after a quiet
period will see a few seconds' delay. Upgrading to a paid plan removes
this; worth doing before pointing real marketing traffic at the site.

## Data

`sites.js` (frontend) holds the 16-site catalogue — id, name, category,
region, a short original description, and an optional tag. Add a site by
adding an object to that array; no backend or migration needed, since
site content doesn't need per-booking state the way vehicles and quotes
do.

## API reference

| Method | Path                          | Auth  | Purpose                                  |
|--------|-------------------------------|-------|-------------------------------------------|
| GET    | `/api/health`                 | —     | Health check (used by Render)            |
| GET    | `/api/vehicles`               | —     | List fleet (optional `?category=`)       |
| GET    | `/api/vehicles/:id`           | —     | Single vehicle                           |
| GET    | `/api/occasions`              | —     | List of service occasions                |
| POST   | `/api/quotes`                 | —     | Submit a quote request (`tier: "standard" \| "vip"`, optional `itinerary`) |
| GET    | `/api/quotes/:ref`            | —     | Look up a request by reference           |
| POST   | `/api/admin/login`            | —     | `{ password }` → `{ token, expiresAt }`  |
| POST   | `/api/admin/logout`           | ✓     | Invalidate the current session token     |
| GET    | `/api/admin/quotes`           | ✓     | List requests (optional `?status=` `?tier=`) |
| GET    | `/api/admin/quotes/:id`       | ✓     | Single request, full detail              |
| PATCH  | `/api/admin/quotes/:id`       | ✓     | `{ status }` → update status only        |
| POST   | `/api/admin/quotes/:id/quote` | ✓     | `{ price, message? }` → mark quoted, returns `whatsappUrl` / `mailtoUrl` |

Admin routes (✓) require `Authorization: Bearer <token>` from
`/api/admin/login`.

`quote_requests` rows also carry `itinerary` (comma-separated site names,
populated when the request came from the planner), `flight_number`,
`arrival_datetime`, `accommodation`, `nights`, and `wants_game_drives`
(populated only when `tier` is `"vip"`), and `quoted_price` /
`quoted_message` / `quoted_at` (populated once a quote's been sent).

## Suggested next steps

1. **Notifications** — email or WhatsApp notification to staff when a
   quote request comes in, with VIP requests flagged urgently since
   they're time-sensitive against a flight.
2. **Real I-ZURU integration** — once I-ZURU has a real capture pipeline
   and player, swap the illustrated 360° mock and the `/izuru-preview`
   placeholder for the real embed/API, and link itinerary and VIP
   submissions to the specific I-ZURU listing the guest previewed.
3. **Real branding assets** — swap in an actual logo; the current header
   uses a text wordmark.
4. **Harden the admin dashboard** before it handles more than a small
   team's daily quoting — see "Before this handles more" above.
