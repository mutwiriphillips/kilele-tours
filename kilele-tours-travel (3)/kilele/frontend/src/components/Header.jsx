import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/services", label: "Services" },
  { to: "/fleet", label: "Fleet" },
  { to: "/itinerary", label: "Itinerary Planner" },
  { to: "/vip", label: "VIP International" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-sand-light/95 backdrop-blur border-b border-brass/20">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl tracking-tight text-pine group-hover:text-pine-light transition-colors">
            Kilele
          </span>
          <span className="hidden sm:block text-xs uppercase tracking-[0.2em] text-brass-dark font-mono">
            Tours &amp; Travel
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive ? "text-pine" : "text-ink/70 hover:text-pine"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/request-quote"
            className="bg-pine text-sand-light text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-pine-dark transition-colors"
          >
            Request a quote
          </Link>
        </nav>

        <button
          className="md:hidden text-pine"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-brass/20 bg-sand-light">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-ink/80 hover:text-pine"
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/request-quote"
              onClick={() => setOpen(false)}
              className="bg-pine text-sand-light text-sm font-medium px-5 py-3 rounded-sm text-center"
            >
              Request a quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
