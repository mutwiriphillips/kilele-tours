import { useState, useEffect } from "react";
import { adminApi } from "../../adminApi";

const STATUS_OPTIONS = [
  { id: "pending", label: "Pending" },
  { id: "quoted", label: "Quoted" },
  { id: "confirmed", label: "Confirmed" },
  { id: "declined", label: "Declined" },
  { id: "cancelled", label: "Cancelled" }
];

export default function RequestDetail({ request, onClose, onUpdated }) {
  const [price, setPrice] = useState(request.quoted_price || "");
  const [message, setMessage] = useState(request.quoted_message || "");
  const [sendResult, setSendResult] = useState(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    setPrice(request.quoted_price || "");
    setMessage(request.quoted_message || "");
    setSendResult(null);
    setSendError("");
  }, [request.id]);

  async function handleStatusChange(status) {
    setStatusSaving(true);
    try {
      const updated = await adminApi.updateStatus(request.id, status);
      onUpdated(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleSendQuote(e) {
    e.preventDefault();
    setSending(true);
    setSendError("");
    try {
      const result = await adminApi.sendQuote(request.id, { price, message });
      setSendResult(result);
      onUpdated(result);
    } catch (err) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  }

  function copyMessage() {
    const text = message || sendResult?.quoted_message || "";
    navigator.clipboard?.writeText(text);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-sand-light h-full overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-sand-light border-b border-brass/20 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="text-xs font-mono text-brass-dark">{request.reference}</div>
            <div className="font-display text-lg text-pine">{request.full_name}</div>
          </div>
          <button onClick={onClose} className="text-ink/50 hover:text-ink w-8 h-8 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Status */}
          <div>
            <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark mb-2">Status</div>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  disabled={statusSaving}
                  onClick={() => handleStatusChange(s.id)}
                  className={`text-xs font-medium px-3 py-2 rounded-full transition-colors disabled:opacity-50 ${
                    request.status === s.id
                      ? "bg-pine text-sand-light"
                      : "bg-white text-ink/60 border border-brass/25 hover:border-brass/50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trip details */}
          <div>
            <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark mb-2">Trip</div>
            <dl className="text-sm space-y-1.5">
              <Row label="Tier" value={request.tier === "vip" ? "VIP International" : "Standard"} />
              <Row label="Occasion" value={request.occasion} />
              <Row label="Date" value={request.travel_date} />
              <Row label="Passengers" value={request.passengers} />
              <Row label="Pickup" value={request.pickup} />
              <Row label="Drop-off" value={request.dropoff} />
              {request.itinerary && <Row label="Itinerary" value={request.itinerary} />}
              {request.vehicle_name && <Row label="Requested vehicle" value={request.vehicle_name} />}
              {request.notes && <Row label="Notes" value={request.notes} />}
            </dl>
          </div>

          {request.tier === "vip" && (
            <div>
              <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark mb-2">
                Arrival &amp; stay
              </div>
              <dl className="text-sm space-y-1.5">
                <Row label="Flight" value={request.flight_number} />
                <Row label="Arrival" value={request.arrival_datetime} />
                <Row label="Accommodation" value={request.accommodation} />
                {request.nights && <Row label="Nights" value={request.nights} />}
                <Row label="Game drives" value={request.wants_game_drives ? "Yes" : "No"} />
              </dl>
            </div>
          )}

          {/* Contact */}
          <div>
            <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark mb-2">Contact</div>
            <dl className="text-sm space-y-1.5">
              <Row label="Phone" value={request.phone} />
              {request.email && <Row label="Email" value={request.email} />}
              <Row label="Submitted" value={request.created_at} />
            </dl>
          </div>

          {/* Send quote */}
          <div className="border-t border-brass/20 pt-6">
            <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark mb-3">
              {request.status === "quoted" || request.status === "confirmed" ? "Quote sent" : "Send a quote"}
            </div>

            <form onSubmit={handleSendQuote} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-ink/80 mb-1.5 block">Price (KES)</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white border border-brass/30 rounded-sm px-4 py-2.5 focus:border-brass"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-ink/80 mb-1.5 block">
                  Message (leave blank to auto-generate)
                </span>
                <textarea
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave blank for a standard quote message"
                  className="w-full bg-white border border-brass/30 rounded-sm px-4 py-2.5 focus:border-brass font-mono text-xs"
                />
              </label>

              {sendError && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-2.5">
                  {sendError}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-pine text-sand-light font-medium px-6 py-3 rounded-sm hover:bg-pine-dark transition-colors disabled:opacity-60"
              >
                {sending ? "Saving…" : "Save quote & get send links"}
              </button>
            </form>

            {sendResult && (
              <div className="mt-4 bg-white border border-brass/25 rounded-sm p-4 space-y-3">
                <p className="text-xs text-ink/50">
                  Quote saved. Use one of these to actually deliver it — nothing
                  is sent automatically.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={sendResult.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium bg-pine text-sand-light px-4 py-2 rounded-sm hover:bg-pine-dark"
                  >
                    Open in WhatsApp
                  </a>
                  {sendResult.mailtoUrl && (
                    <a
                      href={sendResult.mailtoUrl}
                      className="text-xs font-medium border border-brass/30 text-pine px-4 py-2 rounded-sm hover:bg-sand"
                    >
                      Open email
                    </a>
                  )}
                  <button
                    onClick={copyMessage}
                    type="button"
                    className="text-xs font-medium border border-brass/30 text-pine px-4 py-2 rounded-sm hover:bg-sand"
                  >
                    Copy message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <dt className="text-ink/50 w-32 flex-shrink-0">{label}</dt>
      <dd className="text-ink/85">{value}</dd>
    </div>
  );
}
