import { Link } from "react-router-dom";
import { occasions, experiences } from "../content";
import HeroScene from "../components/HeroScene";

const icons = {
  paw: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="15" r="5.5" />
      <circle cx="5" cy="8" r="2.4" />
      <circle cx="10.5" cy="4.5" r="2.2" />
      <circle cx="15.5" cy="4.5" r="2.2" />
      <circle cx="19" cy="8" r="2.4" />
    </svg>
  ),
  mountain: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 20L9 8l4 6 2-3 7 9H2z" strokeLinejoin="round" />
      <path d="M9 8l1.5 2.3" strokeLinecap="round" />
    </svg>
  ),
  migration: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 17c2-6 5-9 9-9s7 3 9 9" strokeLinecap="round" />
      <path d="M17 8l4 0 0 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  wave: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0" strokeLinecap="round" />
    </svg>
  ),
  paraglide: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 8q10-6 20 0Q13 6 2 8Z" strokeLinejoin="round" />
      <path d="M6 8l6 12M12 8v12M18 8l-6 12" strokeLinecap="round" />
    </svg>
  )
};

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-pine text-sand-light">
        <HeroScene className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-dark/90 via-pine-dark/20 to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-40 md:pt-32 md:pb-56">
          <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-light mb-6">
            Est. Embu, Kenya
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.08] max-w-3xl drop-shadow-lg">
            The Big Five, the Migration,
            <br />
            <span className="italic text-brass-light">the mountain, the coast.</span>
          </h1>
          <p className="mt-7 text-sand-light/90 text-lg max-w-xl leading-relaxed drop-shadow">
            One country, extraordinary range — and one dependable fleet to
            get you through all of it, plus every wedding, funeral, and
            event in between.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/itinerary"
              className="bg-brass text-pine-dark font-medium px-7 py-3.5 rounded-sm hover:bg-brass-light transition-colors shadow-lg"
            >
              Plan an itinerary
            </Link>
            <Link
              to="/request-quote"
              className="bg-sand-light/10 backdrop-blur border border-sand-light/40 text-sand-light font-medium px-7 py-3.5 rounded-sm hover:bg-sand-light/20 transition-colors"
            >
              Request a quote
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-sand border-b border-brass/20">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap gap-x-10 gap-y-3 justify-between text-sm font-medium text-pine-dark">
          <span>Vehicles inspected before every trip</span>
          <span className="hidden sm:inline">Uniformed, licensed drivers</span>
          <span>Fixed quotes, no surprise charges</span>
          <span className="hidden sm:inline">Nationwide coverage</span>
        </div>
      </section>

      {/* Signature Kenya experiences */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-xl mb-14">
          <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-dark mb-3">
            Signature Kenya experiences
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-pine">
            The reasons people fly in.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <Link
              key={exp.id}
              to={exp.link}
              className="group bg-white/60 border border-brass/20 rounded-sm p-6 flex flex-col hover:border-brass/50 hover:shadow-md transition-all"
            >
              <span className="w-11 h-11 rounded-full bg-pine text-sand-light flex items-center justify-center mb-4 group-hover:bg-brass group-hover:text-pine-dark transition-colors">
                {icons[exp.icon]}
              </span>
              <h3 className="font-display text-xl text-pine mb-1.5">{exp.title}</h3>
              <p className="text-sm font-medium text-brass-dark mb-3">{exp.line}</p>
              <p className="text-sm text-ink/65 leading-relaxed flex-1">{exp.detail}</p>
              <span className="mt-4 text-xs font-semibold text-pine group-hover:text-brass-dark inline-flex items-center gap-1">
                Explore →
              </span>
            </Link>
          ))}

          {/* CTA tile completing the grid */}
          <Link
            to="/itinerary"
            className="bg-pine text-sand-light rounded-sm p-6 flex flex-col justify-center items-start hover:bg-pine-dark transition-colors"
          >
            <h3 className="font-display text-xl mb-2">Build your route</h3>
            <p className="text-sm text-sand-light/80 leading-relaxed mb-4">
              Select the sites that matter to you and get one quote covering
              the whole trip.
            </p>
            <span className="text-sm font-semibold text-brass-light inline-flex items-center gap-1">
              Open the planner →
            </span>
          </Link>
        </div>
      </section>

      {/* Occasions — threaded by the route line, since every occasion is a stop on the same road */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-xl mb-16">
          <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-dark mb-3">
            Where we take you
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-pine">
            One road, every occasion.
          </h2>
        </div>

        <div className="route-thread">
          <div className="space-y-16">
            {occasions.map((o, i) => (
              <div
                key={o.id}
                className={`waypoint grid md:grid-cols-2 gap-6 md:gap-16 items-center ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "md:text-right" : ""}>
                  <div className="font-mono text-xs text-brass-dark mb-2">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-display text-2xl text-pine mb-2">{o.label}</h3>
                  <p className="text-ink/70 leading-relaxed mb-4">{o.line}</p>
                  <Link
                    to={`/services#${o.id}`}
                    className="text-sm font-medium text-brass-dark hover:text-brass inline-flex items-center gap-1"
                  >
                    Learn more →
                  </Link>
                </div>
                <div className="hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP International teaser */}
      <section className="bg-pine text-sand-light">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-light mb-3">
              For international guests
            </div>
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Flying in? Land already sorted.
            </h2>
            <p className="text-sand/80 leading-relaxed mb-6 max-w-md">
              Our VIP tier bundles airport pickup, hotel and lodge transfers,
              and game drives into one itinerary — built around a stay
              you've already previewed in full before you booked it.
            </p>
            <Link
              to="/vip"
              className="bg-brass text-pine-dark font-medium px-6 py-3 rounded-sm hover:bg-brass-light transition-colors inline-block"
            >
              See the VIP tier
            </Link>
          </div>
          <div className="bg-pine-dark/60 border border-sand-light/10 rounded-sm p-6 space-y-4">
            {["Flight-tracked airport pickup", "Direct hotel & lodge transfers", "Game drives with driver-guides", "Timed departure transfer"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-sand-light/90">
                <span className="w-1.5 h-1.5 rounded-full bg-brass-light flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-sand">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-pine mb-4">
            Tell us the occasion. We'll bring the right vehicle.
          </h2>
          <p className="text-ink/70 max-w-lg mx-auto mb-8">
            A quote request takes two minutes. We'll come back to you with a
            fixed price and a vehicle that fits.
          </p>
          <Link
            to="/request-quote"
            className="bg-pine text-sand-light font-medium px-8 py-3.5 rounded-sm hover:bg-pine-dark transition-colors inline-block"
          >
            Request a quote
          </Link>
        </div>
      </section>
    </div>
  );
}
