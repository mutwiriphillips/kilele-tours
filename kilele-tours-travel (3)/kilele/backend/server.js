import express from "express";
import cors from "cors";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { customAlphabet } from "nanoid";
import db from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

// --- Admin auth -------------------------------------------------------
// Single shared password (set ADMIN_PASSWORD in the environment). Sessions
// are opaque tokens kept in memory, valid for 12 hours. This is intentionally
// simple for a small internal tool — see README for upgrade notes before
// this ever needs to hold more sensitive data or serve more than one admin.

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kilele-admin";
if (!process.env.ADMIN_PASSWORD) {
  console.warn(
    "⚠ ADMIN_PASSWORD is not set — using the insecure default. Set it in your environment before deploying."
  );
}

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const sessions = new Map(); // token -> expiresAt

function timingSafeStringEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const expiresAt = token && sessions.get(token);
  if (!expiresAt || expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (!password || !timingSafeStringEqual(password, ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Incorrect password" });
  }
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, expiresAt);
  res.json({ token, expiresAt });
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  const token = req.headers.authorization.slice(7);
  sessions.delete(token);
  res.json({ ok: true });
});

const OCCASIONS = [
  { id: "wedding", label: "Wedding" },
  { id: "funeral", label: "Funeral" },
  { id: "safari", label: "Game Park Safari" },
  { id: "event", label: "Corporate / Event" },
  { id: "airport", label: "Airport Transfer" },
  { id: "general", label: "General Travel" }
];

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/occasions", (req, res) => res.json(OCCASIONS));

app.get("/api/vehicles", (req, res) => {
  const { category } = req.query;
  let rows;
  if (category) {
    rows = db.prepare("SELECT * FROM vehicles WHERE category = ?").all(category);
  } else {
    rows = db.prepare("SELECT * FROM vehicles ORDER BY capacity ASC").all();
  }
  res.json(rows);
});

app.get("/api/vehicles/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM vehicles WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Vehicle not found" });
  res.json(row);
});

function validateQuote(body) {
  const errors = {};
  if (!body.occasion) errors.occasion = "Select what this trip is for";
  if (!body.travel_date) errors.travel_date = "Choose a date";
  if (!body.pickup) errors.pickup = "Pickup location is required";
  if (!body.dropoff) errors.dropoff = "Drop-off location is required";
  if (!body.passengers || Number(body.passengers) < 1) errors.passengers = "Enter number of passengers";
  if (!body.full_name) errors.full_name = "Your name is required";
  if (!body.phone) errors.phone = "A phone number is required";

  if (body.tier === "vip") {
    if (!body.flight_number) errors.flight_number = "Flight number helps us track your arrival";
    if (!body.arrival_datetime) errors.arrival_datetime = "Arrival date & time is required for airport pickup";
    if (!body.accommodation) errors.accommodation = "Tell us which hotel or lodge you're staying at";
  }

  return errors;
}

app.post("/api/quotes", (req, res) => {
  const errors = validateQuote(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const {
    tier, occasion, vehicle_id, travel_date, pickup, dropoff,
    passengers, full_name, phone, email, notes, itinerary,
    flight_number, arrival_datetime, accommodation, nights, wants_game_drives
  } = req.body;

  const reference = (tier === "vip" ? "KLT-VIP-" : "KLT-") + nanoid();

  const stmt = db.prepare(`
    INSERT INTO quote_requests
      (reference, tier, occasion, vehicle_id, travel_date, pickup, dropoff, passengers,
       full_name, phone, email, notes, itinerary, flight_number, arrival_datetime, accommodation,
       nights, wants_game_drives)
    VALUES
      (@reference, @tier, @occasion, @vehicle_id, @travel_date, @pickup, @dropoff, @passengers,
       @full_name, @phone, @email, @notes, @itinerary, @flight_number, @arrival_datetime, @accommodation,
       @nights, @wants_game_drives)
  `);

  stmt.run({
    reference,
    tier: tier === "vip" ? "vip" : "standard",
    occasion,
    vehicle_id: vehicle_id || null,
    travel_date,
    pickup,
    dropoff,
    passengers: Number(passengers),
    full_name,
    phone,
    email: email || null,
    notes: notes || null,
    itinerary: itinerary || null,
    flight_number: flight_number || null,
    arrival_datetime: arrival_datetime || null,
    accommodation: accommodation || null,
    nights: nights ? Number(nights) : null,
    wants_game_drives: wants_game_drives ? 1 : 0
  });

  const created = db.prepare("SELECT * FROM quote_requests WHERE reference = ?").get(reference);
  res.status(201).json(created);
});

app.get("/api/quotes/:reference", (req, res) => {
  const row = db.prepare("SELECT * FROM quote_requests WHERE reference = ?").get(req.params.reference);
  if (!row) return res.status(404).json({ error: "Quote request not found" });
  res.json(row);
});

const VALID_STATUSES = ["pending", "quoted", "confirmed", "declined", "cancelled"];

// List + filter requests (protected)
app.get("/api/admin/quotes", requireAdmin, (req, res) => {
  const { status, tier } = req.query;
  const clauses = [];
  const params = {};
  if (status && VALID_STATUSES.includes(status)) {
    clauses.push("q.status = @status");
    params.status = status;
  }
  if (tier === "standard" || tier === "vip") {
    clauses.push("q.tier = @tier");
    params.tier = tier;
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db.prepare(`
    SELECT q.*, v.name as vehicle_name
    FROM quote_requests q
    LEFT JOIN vehicles v ON v.id = q.vehicle_id
    ${where}
    ORDER BY q.created_at DESC
  `).all(params);
  res.json(rows);
});

// Single request detail (protected)
app.get("/api/admin/quotes/:id", requireAdmin, (req, res) => {
  const row = db.prepare(`
    SELECT q.*, v.name as vehicle_name
    FROM quote_requests q
    LEFT JOIN vehicles v ON v.id = q.vehicle_id
    WHERE q.id = ?
  `).get(req.params.id);
  if (!row) return res.status(404).json({ error: "Request not found" });
  res.json(row);
});

// Update status only (protected) — e.g. mark confirmed / declined / cancelled
app.patch("/api/admin/quotes/:id", requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
  }
  const result = db.prepare(
    "UPDATE quote_requests SET status = @status, updated_at = datetime('now') WHERE id = @id"
  ).run({ status, id: req.params.id });
  if (result.changes === 0) return res.status(404).json({ error: "Request not found" });
  const updated = db.prepare("SELECT * FROM quote_requests WHERE id = ?").get(req.params.id);
  res.json(updated);
});

// Send a quote: records the price + message and marks the request "quoted".
// There's no email/SMS provider wired up, so this doesn't claim to send
// anything itself — it hands back the message plus ready-to-use WhatsApp
// and mailto links so staff can actually deliver it in one click.
app.post("/api/admin/quotes/:id/quote", requireAdmin, (req, res) => {
  const { price, message } = req.body;
  if (!price || Number(price) <= 0) {
    return res.status(400).json({ error: "Enter a valid quoted price" });
  }

  const existing = db.prepare("SELECT * FROM quote_requests WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Request not found" });

  const finalMessage = message && message.trim()
    ? message
    : defaultQuoteMessage(existing, Number(price));

  db.prepare(`
    UPDATE quote_requests
    SET status = 'quoted', quoted_price = @price, quoted_message = @message,
        quoted_at = datetime('now'), updated_at = datetime('now')
    WHERE id = @id
  `).run({ price: Number(price), message: finalMessage, id: req.params.id });

  const updated = db.prepare("SELECT * FROM quote_requests WHERE id = ?").get(req.params.id);
  res.json({
    ...updated,
    whatsappUrl: buildWhatsAppUrl(updated.phone, finalMessage),
    mailtoUrl: updated.email ? buildMailtoUrl(updated.email, updated.reference, finalMessage) : null
  });
});

function defaultQuoteMessage(request, price) {
  const route = request.itinerary || `${request.pickup} to ${request.dropoff}`;
  return [
    `Hi ${request.full_name.split(" ")[0]}, this is Kilele Tours & Travel.`,
    ``,
    `Your quote for ${route} on ${request.travel_date} (${request.passengers} passengers):`,
    `KES ${price.toLocaleString()}`,
    ``,
    `Reference: ${request.reference}`,
    `Reply to confirm and we'll lock in your vehicle and driver.`
  ].join("\n");
}

function buildWhatsAppUrl(phone, message) {
  const digits = String(phone).replace(/[^\d+]/g, "").replace(/^\+/, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function buildMailtoUrl(email, reference, message) {
  const subject = `Your Kilele Tours & Travel quote — ${reference}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

// --- Serve the built frontend in production ---------------------------
// Render deploys this as one web service: the build step runs `vite build`
// in frontend/, and this Express app serves the result for every non-API
// route. In local dev, frontend/dist won't exist (use `npm run dev` in
// frontend/ instead, which proxies /api to this server).
const distPath = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Kilele backend running on http://localhost:${PORT}`));
