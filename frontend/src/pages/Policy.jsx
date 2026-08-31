const SECTIONS = [
  {
    title: "1. Scope",
    body: [
      "This policy covers every booking made through Kilele Tours & Travel — weddings, funerals, safaris, corporate transport, airport transfers, general travel, and self-drive rentals. Submitting a quote request or making a payment means you accept these terms."
    ]
  },
  {
    title: "2. Quote requests",
    body: [
      "Submitting a quote request is not a booking and creates no obligation on either side. We'll respond with a fixed price for your trip. Prices depend on distance, duration, vehicle, and occasion, and are quoted per request — we don't publish a fixed price list because tour and event transport varies too much trip to trip."
    ]
  },
  {
    title: "3. Confirmation & deposit",
    body: [
      "A booking is confirmed once a 20% deposit of the quoted price has been received. Until that deposit is paid, we cannot guarantee the vehicle or driver for your date — a quote is a price, not a reservation.",
      "The remaining balance is due on or before the day of service, unless we've agreed otherwise in writing for corporate accounts.",
      "Accepted payment methods are M-Pesa, bank transfer, and cash; card payment may be available on request. Contact us for current till, paybill, and account details — we don't publish payment details on the public site as a basic anti-fraud precaution.",
      "Every payment we record is issued a receipt with a unique receipt number, which we'll share with you directly."
    ]
  },
  {
    title: "4. Rental types: chauffeur-driven and self-drive",
    body: [
      "Chauffeur-driven is our standard service: a licensed, uniformed Kilele driver for the full trip, included in the quoted price.",
      "Self-drive — bring your own driver means we provide the vehicle only; you or someone you bring does the driving. This is available on saloon, 4x4 SUV, and luxury van categories. It is not available on our vans, buses, or funeral convoy vehicles, which require a company-provided driver — most of these carry more than 8 passengers and are legally required to operate under a licensed PSV (public service vehicle) driver in Kenya, and our funeral convoy vehicles are chauffeur-only so drivers can hold procession pacing and etiquette.",
      "Self-drive requires: a valid driving license held for at least 3 years by whoever will be driving, the driver to be at least 23 years old, and — for licenses not issued in Kenya — either an International Driving Permit or a certified translation, presented at pickup alongside a passport or national ID.",
      "A refundable security deposit is required for self-drive rentals, separate from the booking deposit, released after the vehicle is returned undamaged and with a full fuel tank (or the equivalent deducted for fuel not replaced).",
      "The driver named at pickup is responsible for all traffic fines, tolls, and damage incurred during the rental period. The vehicle may not be taken off authorized routes, loaded beyond its seat capacity, used for any illegal purpose, or sub-let to a third party."
    ]
  },
  {
    title: "5. Cancellations & refunds",
    body: [
      "More than 7 days before travel: full deposit refund.",
      "Between 3 and 7 days before travel: 50% of the deposit refunded.",
      "Less than 72 hours before travel, or a no-show: the deposit is forfeited to cover vehicle and driver allocation already committed.",
      "Date changes are treated as a cancellation and rebooking if the new date falls within 72 hours of the request, otherwise we'll move your deposit to the new date subject to availability.",
      "We reserve the right to cancel and fully refund a booking if a vehicle becomes unavailable for reasons outside our control (accident, mechanical failure with no substitute available); we'll always try to offer a comparable alternative first."
    ]
  },
  {
    title: "6. Passenger conduct & safety",
    body: [
      "Seatbelts are required for every passenger where fitted. Smoking is not permitted in any vehicle. Alcohol consumption is at the discretion of the vehicle occupants for private chauffeur-driven hires, but never for the driver, and never for anyone driving under a self-drive rental.",
      "On safari, passengers are expected to follow park and driver-guide safety instructions at all times, including remaining inside the vehicle where required by park rules.",
      "We can accommodate reasonable luggage for the vehicle and passenger count booked; let us know in advance if you're travelling with unusually large or unusual items (musical instruments, sports equipment, additional luggage for a group)."
    ]
  },
  {
    title: "7. Liability & insurance",
    body: [
      "All chauffeur-driven vehicles carry comprehensive insurance. For self-drive rentals, insurance terms and excess amounts are confirmed at the time of booking and detailed in your rental agreement at pickup.",
      "We are not liable for personal belongings left in a vehicle, or for delays caused by circumstances outside our reasonable control — weather, road closures, park closures, strikes, or political instability (force majeure). Where a force majeure event affects your trip, we'll work with you on rescheduling in good faith."
    ]
  },
  {
    title: "8. Privacy",
    body: [
      "Information you give us when requesting a quote — name, contact details, trip details — is used only to prepare and deliver your booking, and to follow up about it. We don't sell or share it with third parties beyond what's needed to deliver the service itself (e.g. a partner property for a VIP itinerary, with your knowledge)."
    ]
  },
  {
    title: "9. Complaints & disputes",
    body: [
      "If something goes wrong, tell us — contact details are on our Contact page. We aim to resolve issues directly and promptly. This policy is governed by the laws of Kenya."
    ]
  },
  {
    title: "10. Changes to this policy",
    body: [
      "We may update this policy from time to time; the version that applied when you paid your deposit is the one that governs your booking."
    ]
  }
];

export default function Policy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-xs uppercase tracking-[0.25em] font-mono text-brass-dark mb-3">
        Booking &amp; Payment Policy
      </div>
      <h1 className="font-display text-4xl text-pine mb-4">
        The terms behind every booking.
      </h1>
      <p className="text-ink/70 leading-relaxed mb-12">
        Plain terms, not fine print for its own sake. If anything here is
        unclear, ask us before you pay a deposit — we'd rather explain it
        than have you find out the hard way.
      </p>

      <div className="space-y-10">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-xl text-pine mb-3">{s.title}</h2>
            <div className="space-y-3">
              {s.body.map((p, i) => (
                <p key={i} className="text-sm text-ink/70 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 pt-8 border-t border-brass/20 text-xs text-ink/40">
        Last updated August 2026. Kilele Tours &amp; Travel, Nairobi, Kenya.
      </div>
    </div>
  );
}
