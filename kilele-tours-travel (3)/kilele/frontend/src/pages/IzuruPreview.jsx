import { useParams, Link } from "react-router-dom";
import { siteById } from "../sites";
import { useItinerary } from "../context/ItineraryContext";

export default function IzuruPreview() {
  const { siteId } = useParams();
  const site = siteById(siteId);
  const { selectedIds, toggleSite } = useItinerary();

  if (!site) {
    return (
      <div className="max-w-lg mx-auto px-6 py-28 text-center">
        <p className="text-ink/60">We couldn't find that site.</p>
        <Link to="/itinerary" className="text-brass-dark font-medium mt-4 inline-block">
          ← Back to the itinerary planner
        </Link>
      </div>
    );
  }

  const isSelected = selectedIds.includes(site.id);

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <Link to="/itinerary" className="text-sm text-brass-dark hover:text-brass font-medium">
        ← Back to itinerary planner
      </Link>

      <div className="mt-6 bg-pine text-sand-light rounded-sm overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-light mb-4">
            I-ZURU Preview
          </div>
          <h1 className="font-display text-2xl mb-3">{site.name}</h1>
          <p className="text-sand/80 text-sm leading-relaxed max-w-md mx-auto">
            This is where a real, navigable 360° tour of {site.name} would
            open on I-ZURU — letting you explore the lodges, camps, or
            visitor facilities here before you commit to a booking.
          </p>
        </div>
        <div className="bg-pine-dark/60 border-t border-sand-light/10 px-8 py-4 text-center">
          <p className="text-xs text-sand-light/50 font-mono">
            Placeholder — I-ZURU is pre-launch. This link will point to a live
            360° tour once the integration is built.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white/60 border border-brass/20 rounded-sm p-6">
        <h2 className="font-display text-lg text-pine mb-2">{site.name}</h2>
        <div className="text-xs text-brass-dark font-mono uppercase tracking-wide mb-3">
          {site.region}
        </div>
        <p className="text-sm text-ink/70 leading-relaxed mb-6">{site.description}</p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => toggleSite(site.id)}
            className={`text-sm font-medium px-5 py-2.5 rounded-sm transition-colors ${
              isSelected
                ? "bg-sand text-pine border border-brass/40"
                : "bg-pine text-sand-light hover:bg-pine-dark"
            }`}
          >
            {isSelected ? "✓ Added to your itinerary" : "Add to my itinerary"}
          </button>
          <Link
            to="/itinerary"
            className="text-sm font-medium px-5 py-2.5 rounded-sm border border-brass/30 text-pine hover:bg-sand transition-colors"
          >
            Continue browsing sites
          </Link>
        </div>
      </div>
    </div>
  );
}
