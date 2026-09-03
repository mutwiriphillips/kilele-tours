import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../api";
import { occasions, rentalTypes, DEPOSIT_PERCENT } from "../content";
import { siteById } from "../sites";
import PhoneInput from "../components/PhoneInput";

const emptyForm = {
  tier: "standard",
  traveler_type: "local",
  rental_type: "chauffeur",
  driver_license_number: "",
  driver_license_country: "",
  occasion: "",
  vehicle_id: "",
  travel_date: "",
  pickup: "",
  dropoff: "",
  passengers: "",
  full_name: "",
  phone: "",
  phone_country: "KE",
  email: "",
  notes: "",
  itinerary: "",
  needs_airport_pickup: false,
  flight_number: "",
  arrival_datetime: "",
  accommodation: "",
  nights: "",
  wants_game_drives: false,
  agreed_to_policy: false
};

export default function RequestQuote() {
  const [params] = useSearchParams();
  const [form, setForm] = useState(emptyForm);
  const [vehicles, setVehicles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [itinerarySites, setItinerarySites] = useState([]);

  useEffect(() => {
    api.getVehicles().then(setVehicles).catch(() => {});
  }, []);

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

  const selectedVehicle = vehicles.find((v) => String(v.id) === String(form.vehicle_id));
  const selfDriveBlocked = form.rental_type === "self_drive" && selectedVehicle && !selectedVehicle.self_drive_eligible;

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
          {result.tier === "vip" ? "VIP request received" : "Request received"}
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
        {result.needs_airport_pickup === 1 && (
          <p className="text-ink/70 leading-relaxed mb-2">
            We'll plan your airport pickup around flight{" "}
            <strong>{result.flight_number}</strong>, arriving{" "}
            <strong>{result.arrival_datetime}</strong>, staying at{" "}
            <strong>{result.accommodation}</strong>.
          </p>
        )}
        {result.rental_type === "self_drive" && (
          <p className="text-ink/70 leading-relaxed mb-2">
            This is a self-drive booking — bring the license you gave us
            plus a passport or ID when you collect the vehicle.
          </p>
        )}
        <p className="text-sm text-ink/50 mt-8">
          Once quoted, a {DEPOSIT_PERCENT}% deposit confirms your booking —
          see our <Link to="/policy" className="underline hover:text-brass-dark">booking policy</Link> for details.
          Keep your reference number handy when you follow up.
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
          Let's plan your trip.
        </h1>
        <p className="text-ink/70 leading-relaxed">
          Tell us where you're headed and what the day means to you — a
          wedding, a safari, a quiet trip home. We'll come back with a
          fixed price built around your trip, not a generic package.
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

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Three independent choices: service tier, traveler origin, rental type */}
        <fieldset className="space-y-5">
          <legend className="text-sm font-semibold text-pine mb-2">How would you like to book?</legend>

          <div>
            <span className="text-sm font-medium text-ink/80 mb-1.5 block">Service tier</span>
            <p className="text-xs text-ink/50 mb-2">
              VIP is a premium level of service — available whether you're
              local or visiting. See the <Link to="/vip" className="underline hover:text-brass-dark">VIP page</Link>.
            </p>
            <TogglePair
              options={[{ id: "standard", label: "Standard" }, { id: "vip", label: "VIP" }]}
              value={form.tier}
              onChange={(v) => update("tier", v)}
            />
          </div>

          <div>
            <span className="text-sm font-medium text-ink/80 mb-1.5 block">You're traveling from</span>
            <TogglePair
              options={[{ id: "local", label: "Within Kenya" }, { id: "international", label: "Abroad" }]}
              value={form.traveler_type}
              onChange={(v) => update("traveler_type", v)}
            />
          </div>

          <div>
            <span className="text-sm font-medium text-ink/80 mb-1.5 block">Driver</span>
            <TogglePair
              options={rentalTypes.map((r) => ({ id: r.id, label: r.label }))}
              value={form.rental_type}
              onChange={(v) => update("rental_type", v)}
            />
            <p className="text-xs text-ink/50 mt-2">
              {rentalTypes.find((r) => r.id === form.rental_type)?.line}
            </p>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.needs_airport_pickup}
              onChange={(e) => update("needs_airport_pickup", e.target.checked)}
              className="w-4 h-4 accent-brass"
            />
            <span className="text-sm text-ink/80">I'll be arriving by flight and need airport pickup</span>
          </label>
        </fieldset>

        {form.rental_type === "self_drive" && (
          <fieldset className="space-y-5 bg-sand/60 border border-brass/25 rounded-sm p-5 -mx-1">
            <legend className="text-sm font-semibold text-pine mb-2 px-1">Self-drive details</legend>
            <p className="text-xs text-ink/50 -mt-3 mb-1">
              Required for self-drive — see our{" "}
              <Link to="/policy" className="underline hover:text-brass-dark">self-drive policy</Link> for
              license, age, and deposit terms.
            </p>

            {selfDriveBlocked && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                {selectedVehicle.name} needs a company driver — self-drive isn't available on this
                vehicle. Choose a different vehicle or switch to chauffeur-driven.
              </p>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Driver's license number" error={errors.driver_license_number}>
                <input
                  type="text"
                  className={inputClass(errors.driver_license_number)}
                  value={form.driver_license_number}
                  onChange={(e) => update("driver_license_number", e.target.value)}
                />
              </Field>
              <Field label="License issued by (country)" error={errors.driver_license_country}>
                <input
                  type="text"
                  placeholder="e.g. Kenya"
                  className={inputClass(errors.driver_license_country)}
                  value={form.driver_license_country}
                  onChange={(e) => update("driver_license_country", e.target.value)}
                />
              </Field>
            </div>
          </fieldset>
        )}

        {form.needs_airport_pickup && (
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

          <Field label="Preferred vehicle (optional)" error={errors.rental_type}>
            <select
              className={inputClass(errors.rental_type)}
              value={form.vehicle_id}
              onChange={(e) => update("vehicle_id", e.target.value)}
            >
              <option value="">No preference — recommend one</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — seats {v.capacity}
                  {form.rental_type === "self_drive" && !v.self_drive_eligible ? " (chauffeur only)" : ""}
                </option>
              ))}
            </select>
          </Field>
        </fieldset>

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
              placeholder="e.g. Nairobi CBD"
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
              <PhoneInput
                value={form.phone}
                error={errors.phone}
                defaultIso={form.phone_country}
                onChange={(phone, iso) => {
                  update("phone", phone);
                  update("phone_country", iso);
                }}
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

        <fieldset className="border-t border-brass/20 pt-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.agreed_to_policy}
              onChange={(e) => update("agreed_to_policy", e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-brass flex-shrink-0"
            />
            <span className="text-sm text-ink/75 leading-relaxed">
              I've read and agree to the{" "}
              <Link to="/policy" className="underline text-pine hover:text-brass-dark" target="_blank">
                booking &amp; payment policy
              </Link>
              , including that a {DEPOSIT_PERCENT}% deposit is required to confirm this booking once quoted.
            </span>
          </label>
          {errors.agreed_to_policy && (
            <span className="text-xs text-red-700 mt-1.5 block ml-7">{errors.agreed_to_policy}</span>
          )}
        </fieldset>

        {submitError && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || selfDriveBlocked}
          className="w-full bg-pine text-sand-light font-medium px-8 py-4 rounded-sm hover:bg-pine-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send quote request"}
        </button>
      </form>
    </div>
  );
}

function TogglePair({ options, value, onChange }) {
  return (
    <div className="flex gap-2 bg-sand border border-brass/25 rounded-full p-1 max-w-md">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`flex-1 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
            value === o.id ? "bg-pine text-sand-light" : "text-ink/60 hover:text-pine"
          }`}
        >
          {o.label}
        </button>
      ))}
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
