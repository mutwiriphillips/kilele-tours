import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// On Render, mount a persistent disk (see render.yaml) and set DATA_DIR to
// its mount path so the database survives redeploys. Falls back to a local
// folder for development.
const dataDir = process.env.DATA_DIR || path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "kilele.db"));

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  description TEXT NOT NULL,
  daily_rate INTEGER,
  best_for TEXT NOT NULL,
  self_drive_eligible INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL DEFAULT 'standard',
  traveler_type TEXT NOT NULL DEFAULT 'local',
  rental_type TEXT NOT NULL DEFAULT 'chauffeur',
  driver_license_number TEXT,
  driver_license_country TEXT,
  occasion TEXT NOT NULL,
  vehicle_id INTEGER,
  travel_date TEXT NOT NULL,
  pickup TEXT NOT NULL,
  dropoff TEXT NOT NULL,
  passengers INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_country TEXT,
  email TEXT,
  notes TEXT,
  itinerary TEXT,
  needs_airport_pickup INTEGER NOT NULL DEFAULT 0,
  flight_number TEXT,
  arrival_datetime TEXT,
  accommodation TEXT,
  nights INTEGER,
  wants_game_drives INTEGER NOT NULL DEFAULT 0,
  agreed_to_policy INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  quoted_price INTEGER,
  quoted_message TEXT,
  quoted_at TEXT,
  deposit_amount INTEGER,
  amount_paid INTEGER NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  updated_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_request_id INTEGER NOT NULL,
  receipt_number TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  method TEXT NOT NULL,
  transaction_ref TEXT,
  payment_type TEXT NOT NULL DEFAULT 'deposit',
  notes TEXT,
  recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (quote_request_id) REFERENCES quote_requests(id)
);

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  occasion TEXT,
  reference TEXT,
  message TEXT NOT NULL,
  approved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

const count = db.prepare("SELECT COUNT(*) as c FROM vehicles").get().c;

if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO vehicles (name, category, capacity, description, daily_rate, best_for, self_drive_eligible)
    VALUES (@name, @category, @capacity, @description, @daily_rate, @best_for, @self_drive_eligible)
  `);

  const vehicles = [
    {
      name: "Toyota Mark X — Executive Saloon",
      category: "Saloon",
      capacity: 3,
      description: "A quiet, well-kept saloon for airport runs and small executive parties. Chauffeur in uniform, vehicle detailed before every trip.",
      daily_rate: 9500,
      best_for: "Airport transfers, executive travel",
      self_drive_eligible: 1
    },
    {
      name: "Toyota Prado — Safari Cruiser",
      category: "4x4 SUV",
      capacity: 5,
      description: "Pop-up roof for game viewing, high clearance for park terrain, and a driver-guide who knows the routes. Serviced before every safari departure.",
      daily_rate: 18000,
      best_for: "Game park safaris, off-road routes",
      self_drive_eligible: 1
    },
    {
      name: "Toyota Hiace — Shuttle Van",
      category: "Van",
      capacity: 14,
      description: "Our most-booked vehicle for group travel — church groups, safari parties, and family convoys. Reclining seats, luggage rack, roadworthy inspection monthly.",
      daily_rate: 14000,
      best_for: "Weddings, group tours, church trips",
      self_drive_eligible: 0
    },
    {
      name: "Coaster Bus — 33-Seater",
      category: "Bus",
      capacity: 33,
      description: "For large weddings, funeral processions, and corporate events needing to move a full congregation or delegation together, on schedule.",
      daily_rate: 26000,
      best_for: "Funerals, large weddings, corporate events",
      self_drive_eligible: 0
    },
    {
      name: "Mercedes-Benz V-Class — VIP Van",
      category: "Luxury Van",
      capacity: 6,
      description: "Leather interior, climate control, and a discreet, formally dressed driver — built for bridal parties and dignitaries who need comfort and privacy.",
      daily_rate: 22000,
      best_for: "Bridal party, VIP and dignitary transport",
      self_drive_eligible: 1
    },
    {
      name: "Land Cruiser Hearse Escort — Funeral Convoy",
      category: "Convoy Vehicle",
      capacity: 7,
      description: "A dedicated, dignified vehicle for family and clergy travelling with a funeral convoy. Drivers trained in convoy pacing and procession etiquette.",
      daily_rate: 16000,
      best_for: "Funeral convoys",
      self_drive_eligible: 0
    }
  ];

  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });
  insertMany(vehicles);
}

export default db;
