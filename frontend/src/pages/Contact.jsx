import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-dark mb-3">
        Contact
      </div>
      <h1 className="font-display text-4xl text-pine mb-8">
        Speak to us directly, or send a quote request.
      </h1>

      <div className="grid sm:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/60 border border-brass/20 rounded-sm p-6">
          <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark mb-2">Call or WhatsApp</div>
          <a href="tel:+254719355057" className="font-display text-2xl text-pine hover:text-pine-light transition-colors block">
            +254 719 355 057
          </a>
          <p className="text-sm text-ink/60 mt-2">Mon–Sun, 7am–8pm</p>
        </div>
        <div className="bg-white/60 border border-brass/20 rounded-sm p-6">
          <div className="text-xs uppercase tracking-[0.15em] font-mono text-brass-dark mb-2">Email</div>
          <div className="font-display text-2xl text-pine">bookings@kileletours.co.ke</div>
          <p className="text-sm text-ink/60 mt-2">We reply within a few hours</p>
        </div>
      </div>

      <div className="bg-pine text-sand-light rounded-sm p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-xl mb-1">Prefer a written quote?</h2>
          <p className="text-sand/80 text-sm">
            Fill in the trip details and we'll send a fixed price back to you.
          </p>
        </div>
        <Link
          to="/request-quote"
          className="bg-brass text-pine-dark font-medium px-6 py-3 rounded-sm hover:bg-brass-light transition-colors whitespace-nowrap"
        >
          Request a quote
        </Link>
      </div>

      <div className="mt-12 text-sm text-ink/60">
        <div className="font-medium text-ink/80 mb-1">Head office</div>
        Nairobi, Kenya
      </div>
    </div>
  );
}
