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

const SELF_DRIVE_INELIGIBLE_CATEGORIES = ["Van", "Bus", "Convoy Vehicle"];

function validateQuote(body) {
  const errors = {};
  if (!body.occasion) errors.occasion = "Select what this trip is for";
  if (!body.travel_date) errors.travel_date = "Choose a date";
  if (!body.pickup) errors.pickup = "Pickup location is required";
  if (!body.dropoff) errors.dropoff = "Drop-off location is required";
  if (!body.passengers || Number(body.passengers) < 1) errors.passengers = "Enter number of passengers";
  if (!body.full_name) errors.full_name = "Your name is required";
  if (!body.phone) {
    errors.phone = "A phone number is required";
  } else if (!/^\+\d{7,15}$/.test(String(body.phone).replace(/[\s-]/g, ""))) {
    errors.phone = "Include a country code, e.g. +254 7XX XXX XXX";
  }

  if (body.needs_airport_pickup) {
    if (!body.flight_number) errors.flight_number = "Flight number helps us track your arrival";
    if (!body.arrival_datetime) errors.arrival_datetime = "Arrival date & time is required for airport pickup";
    if (!body.accommodation) errors.accommodation = "Tell us which hotel or lodge you're staying at";
  }

  if (body.rental_type === "self_drive") {
    if (!body.driver_license_number) errors.driver_license_number = "Driver's license number is required for self-drive";
    if (!body.driver_license_country) errors.driver_license_country = "Tell us which country issued the license";

    if (body.vehicle_id) {
      const vehicle = db.prepare("SELECT * FROM vehicles WHERE id = ?").get(body.vehicle_id);
      if (vehicle && SELF_DRIVE_INELIGIBLE_CATEGORIES.includes(vehicle.category)) {
        errors.rental_type = `${vehicle.name} requires a company driver — self-drive isn't available on this vehicle`;
      }
    }
  }

  if (!body.agreed_to_policy) {
    errors.agreed_to_policy = "Please confirm you've read and agree to the booking & payment policy";
  }

  return errors;
}

app.post("/api/quotes", (req, res) => {
  const errors = validateQuote(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const {
    tier, traveler_type, rental_type, driver_license_number, driver_license_country,
    occasion, vehicle_id, travel_date, pickup, dropoff,
    passengers, full_name, phone, phone_country, email, notes, itinerary,
    needs_airport_pickup, flight_number, arrival_datetime, accommodation,
    nights, wants_game_drives, agreed_to_policy
  } = req.body;

  const reference = (tier === "vip" ? "KLT-VIP-" : "KLT-") + nanoid();

  const stmt = db.prepare(`
    INSERT INTO quote_requests
      (reference, tier, traveler_type, rental_type, driver_license_number, driver_license_country,
       occasion, vehicle_id, travel_date, pickup, dropoff, passengers,
       full_name, phone, phone_country, email, notes, itinerary,
       needs_airport_pickup, flight_number, arrival_datetime, accommodation,
       nights, wants_game_drives, agreed_to_policy)
    VALUES
      (@reference, @tier, @traveler_type, @rental_type, @driver_license_number, @driver_license_country,
       @occasion, @vehicle_id, @travel_date, @pickup, @dropoff, @passengers,
       @full_name, @phone, @phone_country, @email, @notes, @itinerary,
       @needs_airport_pickup, @flight_number, @arrival_datetime, @accommodation,
       @nights, @wants_game_drives, @agreed_to_policy)
  `);

  stmt.run({
    reference,
    tier: tier === "vip" ? "vip" : "standard",
    traveler_type: traveler_type === "international" ? "international" : "local",
    rental_type: rental_type === "self_drive" ? "self_drive" : "chauffeur",
    driver_license_number: driver_license_number || null,
    driver_license_country: driver_license_country || null,
    occasion,
    vehicle_id: vehicle_id || null,
    travel_date,
    pickup,
    dropoff,
    passengers: Number(passengers),
    full_name,
    phone,
    phone_country: phone_country || null,
    email: email || null,
    notes: notes || null,
    itinerary: itinerary || null,
    needs_airport_pickup: needs_airport_pickup ? 1 : 0,
    flight_number: flight_number || null,
    arrival_datetime: arrival_datetime || null,
    accommodation: accommodation || null,
    nights: nights ? Number(nights) : null,
    wants_game_drives: wants_game_drives ? 1 : 0,
    agreed_to_policy: agreed_to_policy ? 1 : 0
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

  const numericPrice = Number(price);
  const depositAmount = Math.round(numericPrice * 0.2);

  const finalMessage = message && message.trim()
    ? message
    : defaultQuoteMessage(existing, numericPrice, depositAmount);

  db.prepare(`
    UPDATE quote_requests
    SET status = 'quoted', quoted_price = @price, quoted_message = @message,
        deposit_amount = @depositAmount, quoted_at = datetime('now'), updated_at = datetime('now')
    WHERE id = @id
  `).run({ price: numericPrice, message: finalMessage, depositAmount, id: req.params.id });

  const updated = db.prepare("SELECT * FROM quote_requests WHERE id = ?").get(req.params.id);
  res.json({
    ...updated,
    whatsappUrl: buildWhatsAppUrl(updated.phone, finalMessage),
    mailtoUrl: updated.email ? buildMailtoUrl(updated.email, updated.reference, finalMessage) : null
  });
});

function defaultQuoteMessage(request, price, depositAmount) {
  const route = request.itinerary || `${request.pickup} to ${request.dropoff}`;
  return [
    `Hi ${request.full_name.split(" ")[0]}, this is Kilele Tours & Travel.`,
    ``,
    `Your quote for ${route} on ${request.travel_date} (${request.passengers} passengers):`,
    `KES ${price.toLocaleString()}`,
    ``,
    `A 20% deposit of KES ${depositAmount.toLocaleString()} confirms this booking (per our booking policy).`,
    `Reference: ${request.reference}`,
    `Reply to arrange your deposit and we'll lock in your vehicle and driver.`
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

// --- Payments -----------------------------------------------------------
// There's no payment gateway wired up (no M-Pesa/Stripe credentials) — this
// records payments staff have already received by other means (M-Pesa till,
// bank transfer, cash) against a request, and generates a receipt. It
// verifies internal consistency (amount is positive, request exists) but
// can't verify the transaction actually happened with the payment provider;
// that's on staff to check before recording it.

const PAYMENT_METHODS = ["mpesa", "bank_transfer", "cash", "card", "other"];
const PAYMENT_TYPES = ["deposit", "balance", "full", "other"];
const receiptId = customAlphabet("0123456789", 8);

app.post("/api/admin/quotes/:id/payments", requireAdmin, (req, res) => {
  const { amount, method, transaction_ref, payment_type, notes } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: "Enter a valid payment amount" });
  }
  if (!PAYMENT_METHODS.includes(method)) {
    return res.status(400).json({ error: `Method must be one of: ${PAYMENT_METHODS.join(", ")}` });
  }
  const type = PAYMENT_TYPES.includes(payment_type) ? payment_type : "deposit";

  const request = db.prepare("SELECT * FROM quote_requests WHERE id = ?").get(req.params.id);
  if (!request) return res.status(404).json({ error: "Request not found" });

  const receiptNumber = "RCT-" + receiptId();
  const numericAmount = Number(amount);

  const insertPayment = db.prepare(`
    INSERT INTO payments (quote_request_id, receipt_number, amount, method, transaction_ref, payment_type, notes)
    VALUES (@quote_request_id, @receipt_number, @amount, @method, @transaction_ref, @payment_type, @notes)
  `);

  const updateRequest = db.transaction(() => {
    insertPayment.run({
      quote_request_id: request.id,
      receipt_number: receiptNumber,
      amount: numericAmount,
      method,
      transaction_ref: transaction_ref || null,
      payment_type: type,
      notes: notes || null
    });

    const totalPaid = db.prepare(
      "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE quote_request_id = ?"
    ).get(request.id).total;

    let paymentStatus = "unpaid";
    if (request.quoted_price && totalPaid >= request.quoted_price) {
      paymentStatus = "paid_in_full";
    } else if (request.deposit_amount && totalPaid >= request.deposit_amount) {
      paymentStatus = "deposit_paid";
    } else if (totalPaid > 0) {
      paymentStatus = "partial";
    }

    // Business rule from the booking policy: a 20% deposit confirms the
    // booking. If this payment reaches that threshold and the request is
    // still just "quoted", move it to "confirmed" automatically.
    const newStatus =
      request.status === "quoted" && (paymentStatus === "deposit_paid" || paymentStatus === "paid_in_full")
        ? "confirmed"
        : request.status;

    db.prepare(`
      UPDATE quote_requests
      SET amount_paid = @totalPaid, payment_status = @paymentStatus, status = @newStatus,
          updated_at = datetime('now')
      WHERE id = @id
    `).run({ totalPaid, paymentStatus, newStatus, id: request.id });
  });

  updateRequest();

  const updatedRequest = db.prepare("SELECT * FROM quote_requests WHERE id = ?").get(request.id);
  const payment = db.prepare("SELECT * FROM payments WHERE receipt_number = ?").get(receiptNumber);

  res.status(201).json({
    payment,
    request: updatedRequest,
    receiptUrl: `/receipt/${receiptNumber}?ref=${updatedRequest.reference}`
  });
});

app.get("/api/admin/quotes/:id/payments", requireAdmin, (req, res) => {
  const rows = db.prepare(
    "SELECT * FROM payments WHERE quote_request_id = ? ORDER BY recorded_at DESC"
  ).all(req.params.id);
  res.json(rows);
});

// Receipt lookup — not behind admin auth (staff share this link with the
// customer), but requires the booking reference as a lightweight shared
// secret so receipts aren't just sequentially guessable. This is adequate
// friction for a small operation, not bank-grade access control — see
// README for the upgrade path if that ever matters more.
app.get("/api/receipts/:receiptNumber", (req, res) => {
  const { ref } = req.query;
  const payment = db.prepare("SELECT * FROM payments WHERE receipt_number = ?").get(req.params.receiptNumber);
  if (!payment) return res.status(404).json({ error: "Receipt not found" });

  const request = db.prepare("SELECT * FROM quote_requests WHERE id = ?").get(payment.quote_request_id);
  if (!request || !ref || request.reference !== ref) {
    return res.status(403).json({ error: "Provide the correct booking reference to view this receipt" });
  }

  res.json({ payment, request });
});

// --- Feedback -------------------------------------------------------------
app.post("/api/feedback", (req, res) => {
  const { full_name, rating, occasion, message, reference } = req.body;
  const errors = {};
  if (!full_name) errors.full_name = "Your name is required";
  if (!rating || Number(rating) < 1 || Number(rating) > 5) errors.rating = "Choose a rating from 1 to 5";
  if (!message || message.trim().length < 5) errors.message = "Tell us a little about your experience";
  if (Object.keys(errors).length > 0) return res.status(400).json({ errors });

  const stmt = db.prepare(`
    INSERT INTO feedback (full_name, rating, occasion, reference, message)
    VALUES (@full_name, @rating, @occasion, @reference, @message)
  `);
  const result = stmt.run({
    full_name,
    rating: Number(rating),
    occasion: occasion || null,
    reference: reference || null,
    message: message.trim()
  });

  const created = db.prepare("SELECT * FROM feedback WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(created);
});

// Public: only approved feedback, for the testimonials page
app.get("/api/feedback", (req, res) => {
  const rows = db.prepare(
    "SELECT id, full_name, rating, occasion, message, created_at FROM feedback WHERE approved = 1 ORDER BY created_at DESC LIMIT 50"
  ).all();
  res.json(rows);
});

// Admin: everything, for moderation
app.get("/api/admin/feedback", requireAdmin, (req, res) => {
  const { approved } = req.query;
  let rows;
  if (approved === "1" || approved === "0") {
    rows = db.prepare("SELECT * FROM feedback WHERE approved = ? ORDER BY created_at DESC").all(Number(approved));
  } else {
    rows = db.prepare("SELECT * FROM feedback ORDER BY created_at DESC").all();
  }
  res.json(rows);
});

app.patch("/api/admin/feedback/:id", requireAdmin, (req, res) => {
  const { approved } = req.body;
  const result = db.prepare("UPDATE feedback SET approved = ? WHERE id = ?").run(approved ? 1 : 0, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Feedback not found" });
  res.json(db.prepare("SELECT * FROM feedback WHERE id = ?").get(req.params.id));
});

app.delete("/api/admin/feedback/:id", requireAdmin, (req, res) => {
  const result = db.prepare("DELETE FROM feedback WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Feedback not found" });
  res.json({ ok: true });
});

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
