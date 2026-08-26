import { Link } from "react-router-dom";
import { occasions } from "../content";

export default function Services() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="max-w-2xl mb-16">
        <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-dark mb-3">
          Services
        </div>
        <h1 className="font-display text-4xl text-pine mb-4">
          Transport for every occasion on the calendar.
        </h1>
        <p className="text-ink/70 leading-relaxed">
          Each occasion has its own pace, mood, and requirements. We match
          the vehicle, driver, and plan to the day — not the other way
          around.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {occasions.map((o) => (
          <div
            key={o.id}
            id={o.id}
            className="bg-white/60 border border-brass/20 rounded-sm p-8 scroll-mt-24"
          >
            <h2 className="font-display text-2xl text-pine mb-3">{o.label}</h2>
            <p className="text-ink/70 leading-relaxed mb-6">{o.detail}</p>
            <Link
              to={`/request-quote?occasion=${o.id}`}
              className="text-sm font-medium text-brass-dark hover:text-brass inline-flex items-center gap-1"
            >
              Request a quote for this →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
