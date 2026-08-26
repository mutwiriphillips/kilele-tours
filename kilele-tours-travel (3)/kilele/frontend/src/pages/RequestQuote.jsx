import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../api";
import { occasions } from "../content";
import { siteById } from "../sites";

const emptyForm = {
  tier: "standard",
  occasion: "",
  vehicle_id: "",
  travel_date: "",
  pickup: "",
  dropoff: "",
  passengers: "",
  full_name: "",
  phone: "",
  email: "",
  notes: "",
  itinerary: "",
  flight_number: "",
  arrival_datetime: "",
  accommodation: "",
  nights: "",
  wants_game_drives: false
};

export default function RequestQuote() {
  const [params] = useSearchParams();
  const [form, setForm] = useState(emptyForm);
  const [vehicles, setVehicles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    api.getVehicles().then(setVehicles).catch(() => {});
  }, []);

  const [itinerarySites, setItinerarySites] = useState([]);

  useEffect(() => {
    const occasion = params.get("occasion") || "";
    const vehicle_id = params.get("vehicle") || "";
    const tier = params.get("tier") === "vip" ? "vip" : "";
    const sitesParam = params.get("sites") || "";

    const resolved = sitesParam
      .split(",")
      .map((id) => siteById(id))
      .filter(Boolean);

    setItinerarySites(resolved);

    setForm((f) => ({
      ...f,
      ...(occasion && { occasion }),
      ...(vehicle_id && { vehicle_id }),
      ...(tier && { tier, occasion: f.occasion || "safari" }),
      ...(resolved.length > 0 && {
        occasion: f.occasion || "safari",
        itinerary: resolved.map((s) => s.name).join(", "),
        dropoff: f.dropoff || resolved.map((s) => s.name).join(" → ")
      })
    }));
  }, [params]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setErrors({});
    try {
      const created = await api.createQuote(form);
      setResult(created);
    } catch (err) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      } else {
        setSubmitError("Something went wrong sending your request. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="max-w-xl mx-auto px-6 py-28 text-center">
        <div className="waypoint w-3 h-3 mx-auto mb-8" />
        <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-dark mb-4">
          {result.tier === "vip" ? "VIP itinerary received" : "Request received"}
        </div>
        <h1 className="font-display text-3xl text-pine mb-4">
          Reference {result.reference}
        </h1>
        <p className="text-ink/70 leading-relaxed mb-2">
          Thank you, {result.full_name.split(" ")[0]}. We've logged your
          request for <strong>{result.travel_date}</strong> and will call{" "}
          <strong>{result.phone}</strong> with a fixed quote shortly.
        </p>
        {result.itinerary && (
          <p className="text-ink/70 leading-relaxed mb-2">
            Route requested: <strong>{result.itinerary}</strong>
          </p>
        )}
        {result.tier === "vip" && (
          <p className="text-ink/70 leading-relaxed mb-2">
            We'll build your ground itinerary around flight{" "}
            <strong>{result.flight_number}</strong>, arriving{" "}
            <strong>{result.arrival_datetime}</strong>, staying at{" "}
            <strong>{result.accommodation}</strong>.
          </p>
        )}
        <p className="text-sm text-ink/50 mt-8">
          Keep your reference number — quote it if you call us to follow up.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="mb-12">
        <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-dark mb-3">
          Request a quote
        </div>
        <h1 className="font-display text-4xl text-pine mb-4">
          {form.tier === "vip" ? "Tell us your flight. We'll handle the rest." : "Tell us about the trip."}
        </h1>
        <p className="text-ink/70 leading-relaxed">
          {form.tier === "vip"
            ? "Give us your arrival and stay details and we'll build a full ground itinerary — pickup to departure — before you land."
            : "Fill in what you know — we'll follow up with a fixed price and confirm the vehicle. No payment is required at this step."}
        </p>
      </div>

      {itinerarySites.length > 0 && (
        <div className="bg-sand border border-brass/25 rounded-sm p-5 mb-8">
          <div className="text-xs uppercase tracking-[0.2em] font-mono text-brass-dark mb-3">
            Your itinerary · {itinerarySites.length} {itinerarySites.length === 1 ? "site" : "sites"}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {itinerarySites.map((s) => (
              <span key={s.id} className="bg-white text-pine text-xs font-medium px-3 py-1.5 rounded-full border border-brass/25">
                {s.name}
              </span>
            ))}
          </div>
          <Link to="/itinerary" className="text-xs text-brass-dark hover:text-brass font-medium">
            Edit itinerary →
          </Link>
        </div>
      )}

      <div className="flex gap-2 mb-10 bg-sand border border-brass/25 rounded-full p-1 max-w-sm">
        {[
          { id: "standard", label: "Standard" },
          { id: "vip", label: "VIP International" }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => update("tier", t.id)}
            className={`flex-1 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
              form.tier === t.id
                ? "bg-pine text-sand-light"
                : "text-ink/60 hover:text-pine"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <fieldset className="space-y-5">
          <legend className="text-sm font-semibold text-pine mb-2">The occasion</legend>

          <Field label="What's this trip for" error={errors.occasion}>
            <select
              className={inputClass(errors.occasion)}
              value={form.occasion}
              onChange={(e) => update("occasion", e.target.value)}
            >
              <option value="">Select an occasion</option>
              {occasions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Preferred vehicle (optional)">
            <select
              className={inputClass()}
              value={form.vehicle_id}
              onChange={(e) => update("vehicle_id", e.target.value)}
            >
              <option value="">No preference — recommend one</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.name} — seats {v.capacity}</option>
              ))}
            </select>
          </Field>
        </fieldset>

        {form.tier === "vip" && (
          <fieldset className="space-y-5 bg-sand/60 border border-brass/25 rounded-sm p-5 -mx-1">
            <legend className="text-sm font-semibold text-pine mb-2 px-1">
              Arrival &amp; stay details
            </legend>
            <p className="text-xs text-ink/50 -mt-3 mb-1">
              Already previewed your hotel or lodge on I-ZURU? Paste the
              property name below and we'll route straight there.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Flight number" error={errors.flight_number}>
                <input
                  type="text"
                  placeholder="e.g. KQ100"
                  className={inputClass(errors.flight_number)}
                  value={form.flight_number}
                  onChange={(e) => update("flight_number", e.target.value)}
                />
              </Field>
              <Field label="Arrival date & time" error={errors.arrival_datetime}>
                <input
                  type="datetime-local"
                  className={inputClass(errors.arrival_datetime)}
                  value={form.arrival_datetime}
                  onChange={(e) => update("arrival_datetime", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Hotel or lodge" error={errors.accommodation}>
              <input
                type="text"
                placeholder="e.g. Beachfront Villa, Diani"
                className={inputClass(errors.accommodation)}
                value={form.accommodation}
                onChange={(e) => update("accommodation", e.target.value)}
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5 items-end">
              <Field label="Nights in-country (optional)">
                <input
                  type="number"
                  min="1"
                  className={inputClass()}
                  value={form.nights}
                  onChange={(e) => update("nights", e.target.value)}
                />
              </Field>
              <label className="flex items-center gap-2.5 pb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.wants_game_drives}
                  onChange={(e) => update("wants_game_drives", e.target.checked)}
                  className="w-4 h-4 accent-brass"
                />
                <span className="text-sm text-ink/80">Include game drives</span>
              </label>
            </div>
          </fieldset>
        )}

        <fieldset className="space-y-5">
          <legend className="text-sm font-semibold text-pine mb-2">Route and date</legend>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Travel date" error={errors.travel_date}>
              <input
                type="date"
                className={inputClass(errors.travel_date)}
                value={form.travel_date}
                onChange={(e) => update("travel_date", e.target.value)}
              />
            </Field>
            <Field label="Passengers" error={errors.passengers}>
              <input
                type="number"
                min="1"
                className={inputClass(errors.passengers)}
                value={form.passengers}
                onChange={(e) => update("passengers", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Pickup location" error={errors.pickup}>
            <input
              type="text"
              placeholder="e.g. Embu Town"
              className={inputClass(errors.pickup)}
              value={form.pickup}
              onChange={(e) => update("pickup", e.target.value)}
            />
          </Field>

          <Field label="Drop-off / destination" error={errors.dropoff}>
            <input
              type="text"
              placeholder="e.g. Meru National Park"
              className={inputClass(errors.dropoff)}
              value={form.dropoff}
              onChange={(e) => update("dropoff", e.target.value)}
            />
          </Field>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="text-sm font-semibold text-pine mb-2">Your details</legend>

          <Field label="Full name" error={errors.full_name}>
            <input
              type="text"
              className={inputClass(errors.full_name)}
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Phone number" error={errors.phone}>
              <input
                type="tel"
                placeholder="07XX XXX XXX"
                className={inputClass(errors.phone)}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
            <Field label="Email (optional)">
              <input
                type="email"
                className={inputClass()}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Anything else we should know? (optional)">
            <textarea
              rows={4}
              className={inputClass()}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Decorations needed, convoy size, luggage, accessibility needs…"
            />
          </Field>
        </fieldset>

        {submitError && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-pine text-sand-light font-medium px-8 py-4 rounded-sm hover:bg-pine-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send quote request"}
        </button>
      </form>
    </div>
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
