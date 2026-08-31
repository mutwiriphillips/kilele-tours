import nodemailer from "nodemailer";

// Booking-confirmation emails, sent via Gmail SMTP using an App Password —
// not the Gmail API / OAuth, since an App Password is something a business
// owner can generate themselves in a few minutes (myaccount.google.com/apppasswords,
// requires 2-Step Verification to be on) without registering a Google Cloud
// project. See README for setup steps.
//
// If GMAIL_USER / GMAIL_APP_PASSWORD aren't set, every function here no-ops
// and reports "not_configured" rather than throwing — the rest of the app
// works fine without email configured, it just can't send it.

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

export function isEmailConfigured() {
  return Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);
}

let transporter = null;
function getTransporter() {
  if (!isEmailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      // Fail fast rather than hang the request if the network can't reach
      // Gmail's SMTP servers (e.g. an outbound-restricted host, or a
      // sandboxed environment) — better an honest "failed" in a few
      // seconds than a request that never resolves.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 10_000
    });
  }
  return transporter;
}

function confirmationSubject(request) {
  return `Booking confirmed — ${request.reference} — Kilele Tours & Travel`;
}

function confirmationText(request) {
  const route = request.itinerary || `${request.pickup} to ${request.dropoff}`;
  const balance = (request.quoted_price || 0) - (request.amount_paid || 0);
  const lines = [
    `Hi ${request.full_name.split(" ")[0]},`,
    ``,
    `Your booking with Kilele Tours & Travel is confirmed.`,
    ``,
    `Reference: ${request.reference}`,
    `Trip: ${route}`,
    `Date: ${request.travel_date}`,
    `Passengers: ${request.passengers}`
  ];
  if (request.quoted_price) {
    lines.push(``, `Total: KES ${request.quoted_price.toLocaleString()}`);
    lines.push(`Paid so far: KES ${(request.amount_paid || 0).toLocaleString()}`);
    if (balance > 0) {
      lines.push(`Balance due: KES ${balance.toLocaleString()} (on or before your travel date)`);
    } else {
      lines.push(`Paid in full — nothing further due.`);
    }
  }
  lines.push(
    ``,
    `We'll be in touch with your driver and vehicle details closer to your travel date.`,
    `Questions in the meantime? Call or WhatsApp +254 719 355 057.`,
    ``,
    `Thank you for booking with Kilele.`
  );
  return lines.join("\n");
}

function confirmationHtml(request) {
  const text = confirmationText(request);
  // Simple, readable HTML — one <br>-joined block rather than a heavy
  // template, since most of what matters here is that the plain-text
  // content is right, not that the email is a pixel-perfect brand piece.
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  return `<div style="font-family: Georgia, serif; color: #201C1A; max-width: 480px;">
    <div style="font-size: 20px; color: #1F3D2E; margin-bottom: 4px;">Kilele</div>
    <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #B08D57; margin-bottom: 24px;">Tours &amp; Travel</div>
    <div style="font-size: 14px; line-height: 1.7;">${escaped}</div>
  </div>`;
}

/**
 * Sends a booking-confirmation email. Returns one of:
 *   { status: "not_configured" }
 *   { status: "sent" }
 *   { status: "failed", error: string }
 * Never throws — callers can await this inline without a try/catch.
 */
export async function sendConfirmationEmail(request) {
  if (!request.email) {
    return { status: "no_email_on_file" };
  }
  const t = getTransporter();
  if (!t) {
    return { status: "not_configured" };
  }
  try {
    await t.sendMail({
      from: `"Kilele Tours & Travel" <${GMAIL_USER}>`,
      to: request.email,
      subject: confirmationSubject(request),
      text: confirmationText(request),
      html: confirmationHtml(request)
    });
    return { status: "sent" };
  } catch (err) {
    return { status: "failed", error: err.message };
  }
}

export function buildConfirmationWhatsAppMessage(request) {
  return confirmationText(request);
}

// --- New-request alert to staff ------------------------------------------
// Fires when a customer submits a quote request, so staff don't have to sit
// refreshing /admin to notice new work. Sent to ADMIN_ALERT_EMAIL if set,
// otherwise falls back to GMAIL_USER (the same inbox used to send, on the
// assumption that's the business's own address if nothing else is given).

const ADMIN_ALERT_EMAIL = process.env.ADMIN_ALERT_EMAIL || GMAIL_USER;

function adminAlertSubject(request) {
  const tag = request.tier === "vip" ? "[VIP] " : "";
  return `${tag}New quote request — ${request.reference}`;
}

function adminAlertText(request) {
  const route = request.itinerary || `${request.pickup} to ${request.dropoff}`;
  const lines = [
    `New quote request received.`,
    ``,
    `Reference: ${request.reference}`,
    `Customer: ${request.full_name}`,
    `Phone: ${request.phone}`,
    request.email ? `Email: ${request.email}` : null,
    ``,
    `Occasion: ${request.occasion}`,
    `Trip: ${route}`,
    `Date: ${request.travel_date}`,
    `Passengers: ${request.passengers}`,
    `Tier: ${request.tier === "vip" ? "VIP" : "Standard"}`,
    `Traveler: ${request.traveler_type === "international" ? "International" : "Local"}`,
    `Driver: ${request.rental_type === "self_drive" ? "Self-drive (own driver)" : "Chauffeur-driven"}`,
    request.needs_airport_pickup ? `Needs airport pickup: yes (flight ${request.flight_number || "—"})` : null,
    request.notes ? `Notes: ${request.notes}` : null,
    ``,
    `Log in to /admin to send a quote.`
  ].filter(Boolean);
  return lines.join("\n");
}

function adminAlertHtml(request) {
  const escaped = adminAlertText(request)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  return `<div style="font-family: Georgia, serif; color: #201C1A; max-width: 480px;">
    <div style="font-size: 20px; color: #1F3D2E; margin-bottom: 4px;">Kilele</div>
    <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #B08D57; margin-bottom: 24px;">Staff alert</div>
    <div style="font-size: 14px; line-height: 1.7;">${escaped}</div>
  </div>`;
}

/**
 * Alerts staff that a new request came in. Same return shape as
 * sendConfirmationEmail. Intended to be called without awaiting the result
 * on the customer-facing request path — the customer's submission shouldn't
 * wait on an email round-trip (or worse, the 10s SMTP timeout) before they
 * get their reference number back.
 */
export async function sendAdminAlertEmail(request) {
  const t = getTransporter();
  if (!t || !ADMIN_ALERT_EMAIL) {
    return { status: "not_configured" };
  }
  try {
    await t.sendMail({
      from: `"Kilele Tours & Travel" <${GMAIL_USER}>`,
      to: ADMIN_ALERT_EMAIL,
      subject: adminAlertSubject(request),
      text: adminAlertText(request),
      html: adminAlertHtml(request)
    });
    return { status: "sent" };
  } catch (err) {
    return { status: "failed", error: err.message };
  }
}
