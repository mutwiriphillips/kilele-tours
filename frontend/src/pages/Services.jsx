import { Link } from "react-router-dom";
import { occasions } from "../content";
import PageHeader from "../components/PageHeader";
import sunsetImg from "../assets/photos/sunset-outrigger.jpg";

export default function Services() {
  return (
    <div>
      <PageHeader
        image={sunsetImg}
        alt="A traditional outrigger boat silhouetted against a Kenyan coast sunset"
        eyebrow="Services"
        title="Transport for every occasion on the calendar."
        subtitle="Each occasion has its own pace, mood, and requirements. We match the vehicle, driver, and plan to the day — not the other way around."
      />

      <div className="max-w-6xl mx-auto px-6 py-20">
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
    </div>
  );
}
