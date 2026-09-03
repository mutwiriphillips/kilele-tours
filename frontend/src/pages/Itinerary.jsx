import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { sites, siteCategories } from "../sites";
import { useItinerary } from "../context/ItineraryContext";
import PageHeader from "../components/PageHeader";
import migrationVehicleImg from "../assets/photos/migration-vehicle-dust.jpg";

export default function Itinerary() {
  const [params] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const { selectedIds, toggleSite, removeSite, clearItinerary } = useItinerary();

  useEffect(() => {
    const cat = params.get("category");
    if (cat && siteCategories.some((c) => c.id === cat)) {
      setActiveCategory(cat);
    }
  }, [params]);

  const filtered = activeCategory === "all" ? sites : sites.filter((s) => s.category === activeCategory);
  const selectedSites = sites.filter((s) => selectedIds.includes(s.id));

  return (
    <div className="pb-28">
      <PageHeader
        image={migrationVehicleImg}
        alt="A safari vehicle following wildebeest and zebra during the migration"
        eyebrow="Itinerary Planner"
        title="Pick the places. We'll plan the roads between them."
        subtitle="Browse Kenya's parks, coast, and heritage sites, preview any of them on I-ZURU, and build a shortlist — then request one quote covering the whole route."
      />

      {/* Category filter */}
      <div className="sticky top-20 z-30 bg-sand-light/95 backdrop-blur border-b border-brass/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-2">
          <FilterPill active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
            All sites
          </FilterPill>
          {siteCategories.map((c) => (
            <FilterPill key={c.id} active={activeCategory === c.id} onClick={() => setActiveCategory(c.id)}>
              {c.label}
            </FilterPill>
          ))}
        </div>
      </div>

      {/* Site grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((site) => {
            const isSelected = selectedIds.includes(site.id);
            return (
              <div
                key={site.id}
                className={`bg-white/60 border rounded-sm p-6 flex flex-col transition-colors ${
                  isSelected ? "border-brass ring-1 ring-brass/40" : "border-brass/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark">
                    {site.region}
                  </span>
                  {site.tag && (
                    <span className="text-[10px] font-medium bg-pine/10 text-pine px-2 py-1 rounded-full whitespace-nowrap">
                      {site.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-lg text-pine mb-2">{site.name}</h3>
                <p className="text-sm text-ink/70 leading-relaxed mb-5 flex-1">
                  {site.description}
                </p>

                <div className="flex items-center gap-2 pt-4 border-t border-brass/15">
                  <button
                    onClick={() => toggleSite(site.id)}
                    className={`flex-1 text-xs font-medium px-3 py-2.5 rounded-sm transition-colors ${
                      isSelected
                        ? "bg-pine text-sand-light"
                        : "bg-sand text-pine hover:bg-brass/20 border border-brass/25"
                    }`}
                  >
                    {isSelected ? "✓ Added" : "Add to itinerary"}
                  </button>
                  <Link
                    to={`/izuru-preview/${site.id}`}
                    className="text-xs font-medium px-3 py-2.5 rounded-sm border border-brass/25 text-brass-dark hover:bg-sand transition-colors whitespace-nowrap"
                  >
                    View on I-ZURU
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky itinerary summary bar */}
      {selectedSites.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-pine text-sand-light border-t border-brass/30 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-light mb-1.5">
                Your itinerary · {selectedSites.length} {selectedSites.length === 1 ? "site" : "sites"}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSites.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1.5 bg-sand-light/10 text-sand-light text-xs px-2.5 py-1 rounded-full"
                  >
                    {s.name}
                    <button
                      onClick={() => removeSite(s.id)}
                      aria-label={`Remove ${s.name}`}
                      className="hover:text-brass-light"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={clearItinerary}
                className="text-xs text-sand-light/60 hover:text-sand-light"
              >
                Clear
              </button>
              <Link
                to={`/request-quote?sites=${selectedIds.join(",")}`}
                className="bg-brass text-pine-dark font-medium text-sm px-5 py-2.5 rounded-sm hover:bg-brass-light transition-colors whitespace-nowrap"
              >
                Request a quote for this itinerary
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
        active ? "bg-pine text-sand-light" : "bg-sand text-ink/70 hover:bg-brass/20"
      }`}
    >
      {children}
    </button>
  );
}
