export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-dark mb-3">
        About Kilele
      </div>
      <h1 className="font-display text-4xl text-pine mb-8">
        A fleet built to be trusted with the important days.
      </h1>

      <div className="space-y-6 text-ink/75 leading-relaxed">
        <p>
          Kilele started with a simple observation: the days people book
          transport for are rarely ordinary ones. A wedding convoy that
          arrives late is a story told for years. A funeral procession that
          feels rushed dishonours the day. A safari vehicle that breaks down
          in a park turns a holiday into an ordeal.
        </p>
        <p>
          So we built the company around reliability first — every vehicle
          in our fleet is inspected on a fixed schedule, every driver is
          licensed and briefed on the specific occasion before they leave the
          yard, and every quote is fixed before you travel, not adjusted
          afterward.
        </p>
        <p>
          We cover the country — from local weddings and funerals to
          multi-day game park safaris and corporate transport contracts. If
          it involves getting people somewhere safely and on time, it's the
          kind of job we take on.
        </p>
      </div>

      <div className="mt-16 grid sm:grid-cols-3 gap-8 border-t border-brass/20 pt-12">
        <div>
          <div className="font-display text-3xl text-pine mb-1">Fixed</div>
          <div className="text-sm text-ink/60">quotes, agreed before travel</div>
        </div>
        <div>
          <div className="font-display text-3xl text-pine mb-1">Inspected</div>
          <div className="text-sm text-ink/60">vehicles, on a fixed schedule</div>
        </div>
        <div>
          <div className="font-display text-3xl text-pine mb-1">Nationwide</div>
          <div className="text-sm text-ink/60">coverage, every county</div>
        </div>
      </div>

      {/* Leadership */}
      <div className="mt-20 border-t border-brass/20 pt-12">
        <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-dark mb-3">
          Leadership
        </div>
        <h2 className="font-display text-2xl text-pine mb-10">
          Who's behind Kilele.
        </h2>

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark mb-1">
              Chief Executive Officer
            </div>
            <h3 className="font-display text-xl text-pine mb-3">Leonard Dancan Munene</h3>
            <p className="text-sm text-ink/70 leading-relaxed">
              Leonard holds a Bachelor's degree in Economics and is currently
              a graduate student at Moi University, Eldoret. That background
              shows up directly in how Kilele is run, not just on paper:
              fixed quotes instead of guesswork pricing, a Standard/VIP
              structure built around what different trips are actually worth
              rather than one price for everyone, and a deposit set
              deliberately at 20% — enough to secure a booking without
              pricing out genuine customers. Tourism is one of Kenya's
              largest foreign-exchange earners, and running a transport
              company inside that sector means constantly reading demand
              seasonality, currency exposure from international clients, and
              fleet investment trade-offs — the kind of thinking an
              economics degree is built for.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark mb-1">
              Chief Technology Officer
            </div>
            <h3 className="font-display text-xl text-pine mb-3">Ray Philips Mutwiri</h3>
            <p className="text-sm text-ink/70 leading-relaxed">
              Ray is a developer in his own right, and built the platform
              you're using right now — the booking system, the admin
              dashboard, the itinerary planner, all of it. He's also the
              founder of I-ZURU, the 360° property-preview platform
              referenced throughout this site. That's not a formal
              partnership stitched together after the fact — it's why the
              I-ZURU integration here feels native rather than bolted on:
              the same person designed both systems, so "preview before you
              book, then let Kilele handle the ground" was architected as
              one experience from the start.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
