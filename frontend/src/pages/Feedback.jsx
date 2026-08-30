import { useState, useEffect } from "react";
import { occasions } from "../content";

const BASE = "/api";

export default function Feedback() {
  const [testimonials, setTestimonials] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [form, setForm] = useState({ full_name: "", rating: 0, occasion: "", message: "", reference: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetch(`${BASE}/feedback`)
      .then((r) => r.json())
      .then(setTestimonials)
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setErrors({});
    try {
      const res = await fetch(`${BASE}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Couldn't send your feedback just now — please try again shortly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="max-w-2xl mb-14">
        <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-dark mb-3">
          Feedback
        </div>
        <h1 className="font-display text-4xl text-pine mb-4">
          How was your trip?
        </h1>
        <p className="text-ink/70 leading-relaxed">
          Good or bad, we'd like to hear it. Reviews are read by our team
          before they appear here, so there may be a short delay before
          yours is visible.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Form */}
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="bg-white/60 border border-brass/20 rounded-sm p-8 text-center">
              <div className="font-display text-xl text-pine mb-2">Thank you</div>
              <p className="text-sm text-ink/60">
                Your feedback has been received and will appear here once reviewed.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Field label="Your name" error={errors.full_name}>
                <input
                  type="text"
                  className={inputClass(errors.full_name)}
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                />
              </Field>

              <Field label="Rating" error={errors.rating}>
                <StarPicker value={form.rating} onChange={(v) => update("rating", v)} />
              </Field>

              <Field label="What was this trip for? (optional)">
                <select
                  className={inputClass()}
                  value={form.occasion}
                  onChange={(e) => update("occasion", e.target.value)}
                >
                  <option value="">Select an occasion</option>
                  {occasions.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Your experience" error={errors.message}>
                <textarea
                  rows={5}
                  className={inputClass(errors.message)}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us what stood out — the driver, the vehicle, how the day went…"
                />
              </Field>

              <Field label="Booking reference (optional)">
                <input
                  type="text"
                  placeholder="KLT-XXXXXX"
                  className={inputClass()}
                  value={form.reference}
                  onChange={(e) => update("reference", e.target.value)}
                />
              </Field>

              {submitError && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-pine text-sand-light font-medium px-6 py-3 rounded-sm hover:bg-pine-dark transition-colors disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Share your feedback"}
              </button>
            </form>
          )}
        </div>

        {/* Testimonials */}
        <div className="lg:col-span-3">
          <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark mb-4">
            What travelers say
          </div>
          {loadingList ? (
            <p className="text-ink/50 text-sm font-mono">Loading…</p>
          ) : testimonials.length === 0 ? (
            <div className="bg-white/60 border border-brass/20 rounded-sm p-8 text-center text-sm text-ink/50">
              No reviews yet — be the first to share your experience.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white/60 border border-brass/20 rounded-sm p-5">
                  <div className="flex items-center gap-1 mb-2" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} filled={i < t.rating} />
                    ))}
                  </div>
                  <p className="text-sm text-ink/75 leading-relaxed mb-3">"{t.message}"</p>
                  <div className="text-xs text-ink/50">
                    {t.full_name}
                    {t.occasion && <span className="capitalize"> · {t.occasion}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          aria-label={`${i + 1} star${i === 0 ? "" : "s"}`}
          className="p-0.5"
        >
          <Star filled={i < value} size={26} />
        </button>
      ))}
    </div>
  );
}

function Star({ filled, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#B08D57" : "none"} stroke="#B08D57" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" strokeLinejoin="round" />
    </svg>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink/80 mb-1.5 block">{label}</span>
      {children}
      {error && <span className="text-xs text-red-700 mt-1 block">{error}</span>}
    </label>
  );
}

function inputClass(error) {
  return `w-full bg-white border rounded-sm px-4 py-3 text-ink placeholder:text-ink/30 focus:border-brass transition-colors ${
    error ? "border-red-400" : "border-brass/30"
  }`;
}
