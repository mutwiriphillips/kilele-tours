export const occasions = [
  {
    id: "wedding",
    label: "Weddings",
    line: "Bridal cars, guest shuttles, and a convoy that arrives together, on time.",
    detail:
      "From the bride's car to the last guest shuttle, we plan the convoy order, timing, and decoration allowances so the day runs without a transport worry in it.",
    vehicleCategory: "Luxury Van"
  },
  {
    id: "funeral",
    label: "Funerals",
    line: "Dignified convoy transport for family, clergy, and mourners.",
    detail:
      "Funeral logistics need a calm, unhurried hand. Our drivers are trained in procession pacing and convoy etiquette, and vehicles are prepared with quiet, respectful presentation.",
    vehicleCategory: "Convoy Vehicle"
  },
  {
    id: "safari",
    label: "Game Park Safaris",
    line: "Pop-up-roof 4x4s and driver-guides who know the parks.",
    detail:
      "Our safari vehicles are maintained to handle park terrain reliably, with driver-guides experienced in the major parks and reserves across the country.",
    vehicleCategory: "4x4 SUV"
  },
  {
    id: "event",
    label: "Corporate & Events",
    line: "Delegate shuttles, conference logistics, and staff transport.",
    detail:
      "Conferences, product launches, and staff retreats need transport that runs on a schedule as tight as the event itself. We coordinate pickup windows and route timing in advance.",
    vehicleCategory: "Bus"
  },
  {
    id: "airport",
    label: "Airport Transfers",
    line: "Flight-tracked pickups, meet-and-greet, no waiting around.",
    detail:
      "We track your flight, not your itinerary — arrival delays are covered, and your driver will be at the gate with a name board, ready to load and go.",
    vehicleCategory: "Saloon"
  },
  {
    id: "general",
    label: "General Travel",
    line: "Point-to-point trips, upcountry visits, and long-distance transfers.",
    detail:
      "For everything else — family visits upcountry, inter-town trips, or a one-off journey — book the vehicle that fits your group and go.",
    vehicleCategory: "Van"
  }
];

export const DEPOSIT_PERCENT = 20;

export const rentalTypes = [
  {
    id: "chauffeur",
    label: "Chauffeur-driven",
    line: "Our licensed driver, in uniform, for the whole trip.",
    icon: "steering"
  },
  {
    id: "self_drive",
    label: "Self-drive — bring your own driver",
    line: "You provide the driver — yourself or someone you bring. We provide the vehicle.",
    icon: "key"
  }
];

export function occasionById(id) {
  return occasions.find((o) => o.id === id);
}

// Signature Kenya experiences featured on the homepage — each links either
// to a specific site in the itinerary planner or to a themed browse view.
export const experiences = [
  {
    id: "big-five",
    title: "The Big Five",
    line: "Lion, elephant, rhino, buffalo, leopard — in one circuit.",
    detail:
      "Ol Pejeta and the Mara put all five within reach of a single well-planned route, with driver-guides who know where each is most reliably seen this season.",
    link: "/itinerary?category=safari",
    icon: "paw"
  },
  {
    id: "mount-kenya",
    title: "Mount Kenya",
    line: "Africa's second-highest peak, from a day hike to a full summit.",
    detail:
      "Glacial valleys and Afro-alpine moorland a few hours from Nairobi — trekking routes for a single day out or a multi-day ascent.",
    link: "/izuru-preview/mount-kenya",
    icon: "mountain"
  },
  {
    id: "migration",
    title: "The Great Migration",
    line: "Millions of wildebeest crossing the Mara, in season.",
    detail:
      "One of the largest wildlife movements on earth — timed right, a single morning in the Mara can put you at the edge of the crossing itself.",
    link: "/izuru-preview/maasai-mara",
    icon: "migration"
  },
  {
    id: "beaches",
    title: "The Coast",
    line: "Diani's white sand, Watamu's reefs, Lamu's old streets.",
    detail:
      "A natural add-on after a safari — warm water, coral reefs, and centuries of Swahili coastal history within easy reach of each other.",
    link: "/itinerary?category=coast",
    icon: "wave"
  },
  {
    id: "paragliding",
    title: "Paragliding, Rift Valley",
    line: "Launch from Kijabe or the Kerio Valley escarpment.",
    detail:
      "A striking pairing with a Maasai Mara safari — tandem flights over Rift Valley scenery, arranged as an add-on to your itinerary.",
    link: "/izuru-preview/maasai-mara",
    icon: "paraglide"
  }
];

// The VIP International journey — the explicit handoff between I-ZURU
// (property preview, before commitment) and Kilele (ground execution, on arrival).
export const vipJourney = [
  {
    phase: "before",
    label: "Before you fly",
    system: "I-ZURU",
    title: "See the lodge or hotel before you commit to it",
    detail:
      "Browse a real, navigable 360° tour of the property you're considering — every room, every angle — instead of a curated photo set. Confirm the space matches the promise before you book a single night.",
    icon: "eye"
  },
  {
    phase: "confirm",
    label: "Once you've decided",
    system: "Kilele",
    title: "Send us your flight and stay details",
    detail:
      "Give us your flight number, arrival time, and where you're staying. We build the ground itinerary around it — pickup, transfer, and drives — before you've even landed.",
    icon: "check"
  },
  {
    phase: "land",
    label: "The moment you land",
    system: "Kilele",
    title: "Airport pickup, tracked against your flight",
    detail:
      "Your driver tracks the flight, not the timetable. Delays are covered — we're at the gate with a name board, luggage handled, vehicle ready.",
    icon: "plane"
  },
  {
    phase: "transfer",
    label: "Getting to your stay",
    system: "Kilele",
    title: "Direct transfer to the property you already toured",
    detail:
      "Straight from the airport to the hotel or lodge you previewed on I-ZURU — no unplanned stops, no uncertainty about the route or the destination.",
    icon: "route"
  },
  {
    phase: "explore",
    label: "During your stay",
    system: "Kilele",
    title: "Game drives and excursions, on your schedule",
    detail:
      "Pop-up-roof safari vehicles and driver-guides who know the parks, booked around your itinerary — whether that's a single morning drive or a multi-day circuit.",
    icon: "compass"
  },
  {
    phase: "depart",
    label: "Departure",
    system: "Kilele",
    title: "Seamless return, timed to your outbound flight",
    detail:
      "The same reliability in reverse — collected on time, driven to the airport with margin to spare, no last-day stress.",
    icon: "sunset"
  }
];
