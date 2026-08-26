import express from "express";
import cors from "cors";
import { customAlphabet } from "nanoid";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

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

// Simple admin listing — no auth yet, intended for internal use only during development.
app.get("/api/admin/quotes", (req, res) => {
  const rows = db.prepare(`
    SELECT q.*, v.name as vehicle_name
    FROM quote_requests q
    LEFT JOIN vehicles v ON v.id = q.vehicle_id
    ORDER BY q.created_at DESC
  `).all();
  res.json(rows);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Kilele backend running on http://localhost:${PORT}`));
