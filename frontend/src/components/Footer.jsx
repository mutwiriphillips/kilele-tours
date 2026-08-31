import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-pine text-sand-light mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl mb-3">Kilele</div>
          <p className="text-sand/80 text-sm leading-relaxed max-w-xs">
            Every journey, handled with care. Weddings, funerals, safaris, and
            events — one dependable fleet, wherever the road leads.
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-brass-light font-mono mb-4">
            Get there
          </div>
          <ul className="space-y-2 text-sm text-sand/90">
            <li><Link to="/services" className="hover:text-brass-light">Services</Link></li>
            <li><Link to="/fleet" className="hover:text-brass-light">Our fleet</Link></li>
            <li><Link to="/itinerary" className="hover:text-brass-light">Itinerary planner</Link></li>
            <li><Link to="/vip" className="hover:text-brass-light">VIP service</Link></li>
            <li><Link to="/feedback" className="hover:text-brass-light">Feedback</Link></li>
            <li><Link to="/request-quote" className="hover:text-brass-light">Request a quote</Link></li>
            <li><Link to="/policy" className="hover:text-brass-light">Booking &amp; payment policy</Link></li>
            <li><Link to="/about" className="hover:text-brass-light">About Kilele</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-brass-light font-mono mb-4">
            Reach us
          </div>
          <ul className="space-y-2 text-sm text-sand/90">
            <li>Nairobi, Kenya</li>
            <li>+254 719 355 057</li>
            <li>bookings@kileletours.co.ke</li>
            <li>Mon–Sun, 7am–8pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sand-light/10">
        <div className="max-w-6xl mx-auto px-6 py-5 text-xs text-sand-light/60 flex flex-col sm:flex-row justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Kilele Tours &amp; Travel. All rights reserved.</span>
          <span>Every vehicle inspected before it leaves the yard.</span>
        </div>
      </div>
    </footer>
  );
}
