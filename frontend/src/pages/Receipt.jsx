import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const METHOD_LABELS = {
  mpesa: "M-Pesa",
  bank_transfer: "Bank transfer",
  cash: "Cash",
  card: "Card",
  other: "Other"
};

const TYPE_LABELS = {
  deposit: "Deposit",
  balance: "Balance payment",
  full: "Full payment",
  other: "Payment"
};

export default function Receipt() {
  const { receiptNumber } = useParams();
  const [params] = useSearchParams();
  const ref = params.get("ref");

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) {
      setError("This link is missing the booking reference needed to view the receipt.");
      setLoading(false);
      return;
    }
    fetch(`/api/receipts/${receiptNumber}?ref=${encodeURIComponent(ref)}`)
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error || "Couldn't load this receipt");
        return body;
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [receiptNumber, ref]);

  if (loading) {
    return <div className="max-w-lg mx-auto px-6 py-24 text-center text-ink/50 text-sm font-mono">Loading receipt…</div>;
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-ink/60 text-sm">{error}</p>
      </div>
    );
  }

  const { payment, request } = data;
  const balance = (request.quoted_price || 0) - (request.amount_paid || 0);

  return (
    <div className="min-h-screen bg-sand-light">
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="flex justify-end mb-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="text-sm font-medium bg-pine text-sand-light px-5 py-2.5 rounded-sm hover:bg-pine-dark transition-colors"
          >
            Print / save as PDF
          </button>
        </div>

        <div className="bg-white border border-brass/25 rounded-sm p-10 print:border-0 print:shadow-none">
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-brass/20">
            <div>
              <div className="font-display text-2xl text-pine">Kilele</div>
              <div className="text-xs uppercase tracking-[0.15em] text-brass-dark font-mono">Tours &amp; Travel</div>
            </div>
            <div className="text-right text-xs text-ink/50">
              <div>Embu, Kenya</div>
              <div>bookings@kileletours.co.ke</div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark">Receipt</div>
              <div className="font-display text-xl text-pine">{payment.receipt_number}</div>
            </div>
            <div className="text-right text-sm text-ink/60">
              {payment.recorded_at}
            </div>
          </div>

          <dl className="text-sm space-y-2 mb-8">
            <Row label="Billed to" value={request.full_name} />
            <Row label="Booking reference" value={request.reference} />
            <Row label="Trip" value={`${request.pickup} → ${request.dropoff}`} />
            <Row label="Travel date" value={request.travel_date} />
          </dl>

          <div className="bg-sand/50 rounded-sm p-5 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ink/60">{TYPE_LABELS[payment.payment_type] || "Payment"}</span>
              <span className="font-medium text-pine">KES {payment.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-ink/50">
              <span>Method</span>
              <span>{METHOD_LABELS[payment.method] || payment.method}</span>
            </div>
            {payment.transaction_ref && (
              <div className="flex justify-between text-xs text-ink/50 mt-1">
                <span>Transaction ref</span>
                <span>{payment.transaction_ref}</span>
              </div>
            )}
          </div>

          {request.quoted_price && (
            <dl className="text-sm space-y-1.5 border-t border-brass/20 pt-4">
              <Row label="Total quoted" value={`KES ${request.quoted_price.toLocaleString()}`} />
              <Row label="Total paid to date" value={`KES ${(request.amount_paid || 0).toLocaleString()}`} />
              <Row
                label="Balance remaining"
                value={`KES ${Math.max(balance, 0).toLocaleString()}`}
                strong={balance > 0}
              />
            </dl>
          )}

          <div className="mt-10 pt-6 border-t border-brass/20 text-xs text-ink/40 text-center">
            Thank you for booking with Kilele Tours &amp; Travel.
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink/50">{label}</dt>
      <dd className={strong ? "font-semibold text-pine" : "text-ink/85"}>{value}</dd>
    </div>
  );
}
