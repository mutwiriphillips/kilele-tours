import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import VehicleTour360 from "../components/VehicleTour360";
import PageHeader from "../components/PageHeader";
import bushBreakfastImg from "../assets/photos/bush-breakfast-safari.jpg";

export default function Fleet() {
  const [vehicles, setVehicles] = useState([]);
  const [status, setStatus] = useState("loading");
  const [tourVehicle, setTourVehicle] = useState(null);

  useEffect(() => {
    api
      .getVehicles()
      .then((data) => {
        setVehicles(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div>
      <PageHeader
        image={bushBreakfastImg}
        alt="A Kilele safari vehicle parked under an acacia tree during a bush breakfast stop"
        eyebrow="Our Fleet"
        title="Maintained, inspected, and ready."
        subtitle="Every vehicle goes through a roadworthiness check before it's assigned to a trip. Rates below are a daily guide — your quote will reflect distance, duration, and occasion."
      />

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-2xl mb-12">
          <p className="text-ink/50 text-sm">
            New: drag through a 360° walkthrough of any vehicle before you
            request it — no surprises when it pulls up.
          </p>
          <p className="text-ink/50 text-sm mt-1">
            Saloons, 4x4s, and the luxury van are available self-drive —
            bring your own driver. See our{" "}
            <Link to="/policy" className="underline hover:text-brass-dark">booking policy</Link> for
            self-drive terms.
          </p>
        </div>

      {status === "loading" && (
        <p className="text-ink/50 font-mono text-sm">Loading fleet…</p>
      )}
      {status === "error" && (
        <p className="text-ink/50 text-sm">
          Couldn't load the fleet right now. Please try again shortly.
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="bg-white/60 border border-brass/20 rounded-sm p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark">
                {v.category}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                {v.self_drive_eligible ? (
                  <span className="text-[10px] font-mono uppercase tracking-wide bg-brass/15 text-brass-dark px-2 py-1 rounded-full">
                    Self-drive OK
                  </span>
                ) : (
                  <span className="text-[10px] font-mono uppercase tracking-wide bg-ink/5 text-ink/50 px-2 py-1 rounded-full">
                    Chauffeur only
                  </span>
                )}
                <span className="text-[10px] font-mono uppercase tracking-wide bg-pine/10 text-pine px-2 py-1 rounded-full">
                  360° tour
                </span>
              </div>
            </div>
            <h3 className="font-display text-xl text-pine mb-2">{v.name}</h3>
            <p className="text-sm text-ink/70 leading-relaxed mb-4 flex-1">
              {v.description}
            </p>

            <button
              onClick={() => setTourVehicle(v)}
              className="mb-4 relative rounded-sm overflow-hidden border border-brass/25 h-28 group"
              aria-label={`View 360 degree tour of ${v.name}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pine to-pine-dark" />
              <div className="absolute inset-0 opacity-40 group-hover:opacity-55 transition-opacity"
                   style={{
                     backgroundImage: "repeating-linear-gradient(100deg, transparent 0 18px, rgba(217,199,163,0.15) 18px 20px)"
                   }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex items-center gap-2 bg-sand-light/95 text-pine text-xs font-semibold px-4 py-2 rounded-full shadow group-hover:scale-105 transition-transform">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <ellipse cx="12" cy="12" rx="9" ry="5" />
                    <path d="M3 12a9 5 0 0018 0" strokeDasharray="2 3" />
                  </svg>
                  View 360° walkthrough
                </span>
              </div>
            </button>

            <div className="flex items-center justify-between text-sm border-t border-brass/15 pt-4">
              <span className="text-ink/60">Seats {v.capacity}</span>
              {v.daily_rate && (
                <span className="font-medium text-pine">
                  from KES {v.daily_rate.toLocaleString()}/day
                </span>
              )}
            </div>
            <Link
              to={`/request-quote?vehicle=${v.id}`}
              className="mt-4 text-sm font-medium text-brass-dark hover:text-brass"
            >
              Request this vehicle →
            </Link>
          </div>
        ))}
      </div>

      {tourVehicle && (
        <VehicleTour360 vehicle={tourVehicle} onClose={() => setTourVehicle(null)} />
      )}
      </div>
    </div>
  );
}
