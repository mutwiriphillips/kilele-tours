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
npm run dev
```

This creates `backend/data/kilele.db` on first run and seeds it with six
sample vehicles (saloon, safari 4x4, shuttle van, coaster bus, luxury van,
and a funeral convoy vehicle). Edit the `vehicles` array in `db.js` to
match your real fleet.

**2. Start the frontend** (runs on http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to the backend automatically
(see `vite.config.js`), so open http://localhost:5173 and everything just
works together.

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
  references are prefixed `NJ-VIP-` instead of `NJ-`.
- **About / Contact** — company positioning and direct contact info.

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

## Data

`sites.js` (frontend) holds the 16-site catalogue — id, name, category,
region, a short original description, and an optional tag. Add a site by
adding an object to that array; no backend or migration needed, since
site content doesn't need per-booking state the way vehicles and quotes
do.

## API reference

| Method | Path                  | Purpose                                  |
|--------|-----------------------|-------------------------------------------|
| GET    | `/api/vehicles`       | List fleet (optional `?category=`)       |
| GET    | `/api/vehicles/:id`   | Single vehicle                           |
| GET    | `/api/occasions`      | List of service occasions                |
| POST   | `/api/quotes`         | Submit a quote request (`tier: "standard" \| "vip"`, optional `itinerary`) |
| GET    | `/api/quotes/:ref`    | Look up a request by reference           |
| GET    | `/api/admin/quotes`   | All requests, newest first (no auth yet) |

`quote_requests` rows also carry `itinerary` (comma-separated site names,
populated when the request came from the planner), plus `flight_number`,
`arrival_datetime`, `accommodation`, `nights`, and `wants_game_drives` —
populated only when `tier` is `"vip"`.

## Suggested next steps

1. **Admin view** — a simple password-protected page over
   `/api/admin/quotes` so staff can see and action incoming requests
   (VIP itineraries especially benefit from a dedicated view, since they
   carry flight/arrival data standard requests don't).
2. **Notifications** — email or WhatsApp notification to staff when a
   quote request comes in, with VIP requests flagged urgently since
   they're time-sensitive against a flight.
3. **Real I-ZURU integration** — once I-ZURU has a real capture pipeline
   and player, swap the illustrated 360° mock and the `/izuru-preview`
   placeholder for the real embed/API, and link itinerary and VIP
   submissions to the specific I-ZURU listing the guest previewed.
4. **Real branding assets** — swap in an actual logo; the current header
   uses a text wordmark.
5. **Deployment** — the frontend builds to static files (`npm run build`
   in `frontend/`) deployable to any static host; the backend needs a
   small always-on Node host (Render, Railway, a VPS) since it uses a
   file-based SQLite database.
