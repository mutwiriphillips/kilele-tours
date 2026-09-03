import { Link } from "react-router-dom";
import { vipJourney } from "../content";
import PageHeader from "../components/PageHeader";
import paragliderImg from "../assets/photos/paraglider-canopy.jpg";

const icons = {
  eye: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  plane: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 16l20-8-8 20-3-8-8-4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  route: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8 7c3 0 3 10 8 10" strokeLinecap="round" strokeDasharray="1 4" />
    </svg>
  ),
  compass: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-2 6-6 2 2-6z" strokeLinejoin="round" />
    </svg>
  ),
  sunset: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 18h18M6 18a6 6 0 0112 0" strokeLinecap="round" />
      <path d="M12 10V6M6.5 12.5l-2-2M17.5 12.5l2-2" strokeLinecap="round" />
    </svg>
  )
};

export default function Vip() {
  return (
    <div>
      <PageHeader
        image={paragliderImg}
        alt="A paraglider soaring over the Rift Valley"
        eyebrow="VIP Service"
        title={
          <>
            Priority service, door to door.
            <br />
            <span className="italic text-brass-light">Local or visiting — handled the same way.</span>
          </>
        }
        subtitle="VIP is our top service tier — senior drivers, premium vehicles, and priority scheduling for any occasion, whether you live down the road or you're landing from another continent. Flying in? Pair VIP with airport pickup when you book, and we'll coordinate the ground logistics around a property you've already previewed in full."
        cta={
          <Link
            to="/request-quote?tier=vip"
            className="mt-6 bg-brass text-pine-dark font-medium px-7 py-3.5 rounded-sm hover:bg-brass-light transition-colors inline-block"
          >
            Request VIP service
          </Link>
        }
      />

      {/* The bridge: I-ZURU x Kilele */}
      <section className="bg-sand border-y border-brass/20">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] font-mono text-brass-dark mb-2">
                Two systems, one trip
              </div>
              <h2 className="font-display text-2xl text-pine mb-3">
                Trust before you book. Trust the moment you land.
              </h2>
              <p className="text-ink/70 leading-relaxed text-sm">
                <strong className="text-pine">I-ZURU</strong> lets you walk
                through the actual hotel or lodge — in 360° — before you
                commit to a booking, so there's no gap between the listing
                and reality.{" "}
                <strong className="text-pine">Kilele</strong> picks up from
                there: the moment your flight lands, we own every leg of the
                physical journey until you're back at departures.
              </p>
            </div>
            <div className="bg-white/70 border border-brass/20 rounded-sm p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-pine text-sand-light flex items-center justify-center font-display text-sm">
                  I
                </span>
                <div>
                  <div className="text-sm font-semibold text-pine">I-ZURU previews the stay</div>
                  <div className="text-xs text-ink/50">See it, trust it — before you book</div>
                </div>
              </div>
              <div className="ml-4 border-l-2 border-dashed border-brass/40 h-6" />
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-brass text-pine-dark flex items-center justify-center font-display text-sm">
                  N
                </span>
                <div>
                  <div className="text-sm font-semibold text-pine">Kilele delivers the stay</div>
                  <div className="text-xs text-ink/50">Ground logistics, gate to gate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="max-w-xl mb-14">
          <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-dark mb-3">
            The VIP journey
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-pine">
            From "considering Kenya" to wheels-up home.
          </h2>
          <p className="text-sm text-ink/50 mt-3">
            This full sequence is for guests arriving from abroad. Booking
            VIP locally? Steps 3–4 (airport pickup, arrival transfer) simply
            don't apply — everything else does.
          </p>
        </div>

        <div className="route-thread">
          <div className="space-y-10">
            {vipJourney.map((step, i) => (
              <div key={step.phase} className="waypoint grid md:grid-cols-2 gap-6 md:gap-16 items-start">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.system === "I-ZURU"
                          ? "bg-pine text-sand-light"
                          : "bg-brass text-pine-dark"
                      }`}
                    >
                      {icons[step.icon]}
                    </span>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.15em] font-mono text-brass-dark">
                        {step.label}
                      </div>
                      <div className="text-[11px] font-semibold text-ink/40">
                        {step.system}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-display text-xl text-pine mb-2">{step.title}</h3>
                  <p className="text-ink/70 leading-relaxed text-sm">{step.detail}</p>
                </div>
                <div className="hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-sand">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="font-display text-2xl text-pine mb-2 text-center">
            Every VIP booking includes
          </h2>
          <p className="text-sm text-ink/50 text-center mb-8">
            Local or international — this is the VIP tier itself.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { title: "Senior drivers", desc: "Our most experienced, highest-rated drivers" },
              { title: "Premium vehicles", desc: "Priority pick from the luxury van and SUV fleet" },
              { title: "Priority scheduling", desc: "First call on availability for your dates" },
              { title: "Dedicated coordinator", desc: "One point of contact for the whole booking" }
            ].map((f) => (
              <div key={f.title} className="bg-white/60 border border-brass/20 rounded-sm p-5">
                <div className="font-display text-lg text-pine mb-1.5">{f.title}</div>
                <div className="text-sm text-ink/60">{f.desc}</div>
              </div>
            ))}
          </div>

          <h2 className="font-display text-2xl text-pine mb-2 text-center">
            Add for international arrivals
          </h2>
          <p className="text-sm text-ink/50 text-center mb-8">
            Tick "I'll be arriving by flight" at booking to add these.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Flight-tracked pickup", desc: "Meet-and-greet at arrivals, delays covered" },
              { title: "Hotel & lodge transfers", desc: "Direct, planned routes — no detours" },
              { title: "Game drives", desc: "Pop-up-roof 4x4s with driver-guides" },
              { title: "Departure transfer", desc: "Timed with margin for your outbound flight" }
            ].map((f) => (
              <div key={f.title} className="bg-white/60 border border-brass/20 rounded-sm p-5">
                <div className="font-display text-lg text-pine mb-1.5">{f.title}</div>
                <div className="text-sm text-ink/60">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl text-pine mb-4">
          Ready for VIP treatment?
        </h2>
        <p className="text-ink/70 max-w-lg mx-auto mb-8">
          Book VIP for any occasion. Flying in from abroad? Add your flight
          details at booking and we'll build the full ground itinerary
          around it — before you land.
        </p>
        <Link
          to="/request-quote?tier=vip"
          className="bg-pine text-sand-light font-medium px-8 py-3.5 rounded-sm hover:bg-pine-dark transition-colors inline-block"
        >
          Request VIP service
        </Link>
      </section>
    </div>
  );
}
