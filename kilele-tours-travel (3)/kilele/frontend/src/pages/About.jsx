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
    </div>
  );
}
