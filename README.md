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
  occasion" service section, a VIP teaser, and — once there's approved
  feedback — a testimonials strip pulled live from `/api/feedback`.
- **Services** — detail on weddings, funerals, safaris, corporate/events,
  airport transfers, and general travel.
- **Fleet** — live vehicle list pulled from the API, with a mock 360°
  walkthrough per vehicle, daily rate guidance, and a **self-drive
  eligibility badge** per vehicle (see "Self-drive" below).
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
- **VIP** (`/vip`) — a premium *service tier*, independent of where the
  guest is travelling from. Local clients get the same senior drivers,
  premium vehicles, and priority scheduling as anyone flying in — VIP and
  "arriving internationally" are two separate axes now, not one bundled
  tier. The page still frames the **I-ZURU** (property preview) →
  **Kilele** (ground execution) handoff for guests who do need airport
  pickup, but that's opt-in, not assumed.
- **Request a quote** — the booking form now separates three independent
  choices instead of one bundled toggle:
  - **Service tier** — Standard / VIP.
  - **Traveler origin** — Within Kenya / Abroad (affects nothing on its
    own beyond context; it doesn't gate any fields).
  - **Driver** — Chauffeur-driven / **Self-drive, bring your own driver**.
    Self-drive requires a license number and issuing country, and is
    blocked client- and server-side on vehicles that require a company
    driver (see "Self-drive" below).
  - A separate **"I'll be arriving by flight and need airport pickup"**
    checkbox (independent of tier and traveler origin) reveals the
    flight/arrival/accommodation fieldset — so a local VIP client isn't
    shown irrelevant flight fields, and an international standard client
    who's driving up from the border isn't forced through them either.
  - **Phone number** uses a country-code-aware input (`PhoneInput.jsx`,
    backed by `countryCodes.js`, ~60 countries) instead of assuming +254 —
    tourists are calling in from everywhere. Submitted numbers are
    validated server-side as `+<countrycode><number>`.
  - A required **policy consent checkbox**, linking to `/policy`, stating
    the 20% deposit requirement explicitly before the person can submit.
  - The itinerary-planner integration (site shortlist banner, pre-filled
    route) from earlier sessions still works exactly as before.
- **Policy** (`/policy`) — a drafted booking & payment policy: scope,
  quote requests vs. bookings, the 20% deposit rule, chauffeur vs.
  self-drive terms (license/age/deposit requirements, which vehicles
  qualify and why), cancellation tiers, conduct & safety, liability,
  privacy, and disputes. Linked from the booking form, the self-drive
  fieldset, the Fleet page, and the footer.
- **Feedback** (`/feedback`) — a public review form (name, star rating,
  occasion, message, optional booking reference) plus a live grid of
  approved testimonials. Submissions are held for moderation — see
  "Admin dashboard" below — before they're publicly visible anywhere.
- **Receipt** (`/receipt/:receiptNumber?ref=<reference>`) — a public,
  print-friendly receipt page (see "Payments & receipts" below). Renders
  standalone, outside the normal site header/footer, since it's meant to
  be printed, saved as a PDF, or opened from a WhatsApp/email link rather
  than browsed to.
- **About / Contact** — company positioning and direct contact info.
- **Admin dashboard** (`/admin`) — password-gated staff view. See
  [Admin dashboard](#admin-dashboard) below.

No online payment gateway is wired up — by design, this is a
*request-a-quote* flow, not a pay-now booking flow, since pricing for
tours/travel usually depends on a human quoting distance and occasion
specifics. Payments made by other means (M-Pesa, bank transfer, cash) are
recorded by staff after the fact — see "Payments & receipts."

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

### Self-drive

`vehicles.self_drive_eligible` marks which vehicles can be rented without
a Kilele driver. Seeded as: Saloon, 4x4 SUV, and Luxury Van are eligible;
the Van, Bus, and Convoy vehicle are not. The reasoning (drafted into the
policy, not just hidden in code): vehicles carrying more than 8
passengers are legally required to operate under a licensed PSV driver in
Kenya, and the funeral convoy vehicle is chauffeur-only so drivers can
hold procession pacing. This is enforced in two places, not just one —
`RequestQuote.jsx` disables submission and shows a warning client-side,
and `server.js`'s `validateQuote` rejects it server-side regardless of
what the client sent, since client-side checks alone are never
sufficient.

### Payments & receipts

There's no payment gateway integration (no M-Pesa Daraja API or Stripe
credentials configured) — this deliberately doesn't pretend otherwise.
What it does instead: staff record payments customers have already made
by other means (M-Pesa till, bank transfer, cash), and the system tracks
the running total against the quoted price.

- `POST /api/admin/quotes/:id/payments` — records one payment (amount,
  method, optional transaction reference, deposit/balance/full/other),
  generates a unique receipt number, and recalculates the request's
  `amount_paid` and `payment_status` (`unpaid` → `partial` →
  `deposit_paid` → `paid_in_full`).
- **The 20% deposit rule is enforced in code, not just written in the
  policy.** If a payment brings the total paid up to the deposit
  threshold (or beyond) while the request is still just `quoted`, the
  server automatically flips `status` to `confirmed` in the same
  transaction. Staff don't have to remember to do this manually, and it
  can't drift out of sync with the policy document.
- Every recorded payment gets a receipt, viewable at
  `/receipt/:receiptNumber?ref=<booking reference>` — a print-friendly
  page (there's a "Print / save as PDF" button using the browser's native
  print dialog, deliberately not a server-side PDF library, since that
  would've meant adding another native dependency right after fixing two
  native-module deployment failures in this same project). The reference
  query param is required and checked against the payment's actual
  booking — not full authentication, but enough that receipt numbers
  alone (which are short and could plausibly be guessed or enumerated)
  aren't sufficient to view someone else's payment history.

### Feedback moderation

Submissions via `POST /api/feedback` are never public until approved.
`GET /api/feedback` (used by the Home and Feedback pages) only ever
returns rows where `approved = 1`. The admin dashboard's **Feedback**
tab lists everything regardless of status, with Approve/Unpublish/Delete
actions.

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
| GET    | `/api/vehicles`               | —     | List fleet (optional `?category=`); includes `self_drive_eligible` |
| GET    | `/api/vehicles/:id`           | —     | Single vehicle                           |
| GET    | `/api/occasions`              | —     | List of service occasions                |
| POST   | `/api/quotes`                 | —     | Submit a quote request (see fields below) |
| GET    | `/api/quotes/:ref`            | —     | Look up a request by reference           |
| POST   | `/api/feedback`               | —     | Submit feedback (`full_name`, `rating` 1–5, `message`, optional `occasion`/`reference`) — held for moderation |
| GET    | `/api/feedback`                | —     | List *approved* feedback only, newest first |
| GET    | `/api/receipts/:receiptNumber` | —     | Look up a receipt; requires `?ref=<booking reference>` |
| POST   | `/api/admin/login`            | —     | `{ password }` → `{ token, expiresAt }`  |
| POST   | `/api/admin/logout`           | ✓     | Invalidate the current session token     |
| GET    | `/api/admin/quotes`           | ✓     | List requests (optional `?status=` `?tier=`) |
| GET    | `/api/admin/quotes/:id`       | ✓     | Single request, full detail              |
| PATCH  | `/api/admin/quotes/:id`       | ✓     | `{ status }` → update status only        |
| POST   | `/api/admin/quotes/:id/quote` | ✓     | `{ price, message? }` → mark quoted, computes `deposit_amount`, returns `whatsappUrl` / `mailtoUrl` |
| POST   | `/api/admin/quotes/:id/payments` | ✓  | `{ amount, method, transaction_ref?, payment_type?, notes? }` → records a payment, generates a receipt, may auto-confirm the booking |
| GET    | `/api/admin/quotes/:id/payments` | ✓  | List payments recorded against a request |
| GET    | `/api/admin/feedback`         | ✓     | List all feedback (optional `?approved=0\|1`) |
| PATCH  | `/api/admin/feedback/:id`     | ✓     | `{ approved }` → publish/unpublish       |
| DELETE | `/api/admin/feedback/:id`     | ✓     | Delete a feedback entry                  |

Admin routes (✓) require `Authorization: Bearer <token>` from
`/api/admin/login`.

**`POST /api/quotes` body fields:** `tier` (`standard`|`vip`),
`traveler_type` (`local`|`international`), `rental_type`
(`chauffeur`|`self_drive` — the latter requires `driver_license_number` +
`driver_license_country`, and is rejected if the chosen vehicle isn't
self-drive eligible), `occasion`, `vehicle_id`, `travel_date`, `pickup`,
`dropoff`, `passengers`, `full_name`, `phone` (must include a country
code, e.g. `+254712345678`), `phone_country`, `email`, `notes`,
`itinerary`, `needs_airport_pickup` (independent of tier/traveler_type —
true reveals/requires `flight_number`, `arrival_datetime`,
`accommodation`), `nights`, `wants_game_drives`, and `agreed_to_policy`
(must be truthy).

`quote_requests` rows additionally carry: `deposit_amount` (20% of
`quoted_price`, computed when a quote is sent), `amount_paid`,
`payment_status` (`unpaid`|`partial`|`deposit_paid`|`paid_in_full`).

## Suggested next steps

1. **Real payment gateway** — M-Pesa's Daraja API (STK Push) is the
   natural fit for the Kenyan market and would let customers pay their
   deposit directly rather than staff recording it after the fact.
   Wiring it in doesn't change the data model much — it would call the
   same payment-recording logic that already exists, just triggered by a
   webhook instead of an admin form.
2. **Notifications** — email or WhatsApp notification to staff when a
   quote request or a self-drive booking comes in, with VIP + airport
   pickup requests flagged urgently since they're time-sensitive against
   a flight.
3. **Real I-ZURU integration** — once I-ZURU has a real capture pipeline
   and player, swap the illustrated 360° mock and the `/izuru-preview`
   placeholder for the real embed/API, and link itinerary and VIP
   submissions to the specific I-ZURU listing the guest previewed.
4. **Real branding assets** — swap in an actual logo; the current header
   uses a text wordmark.
5. **Harden the admin dashboard** before it handles more than a small
   team's daily quoting — see "Before this handles more" above.
