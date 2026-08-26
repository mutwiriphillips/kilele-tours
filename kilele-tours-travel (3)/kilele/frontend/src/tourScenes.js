// Illustrated (non-photographic) interior panoramas used to mock a 360° walkthrough.
// Each scene is a wide SVG "wrap" the viewer drags across, simulating a pan around
// the cabin. Rendered as data URIs so the component stays framework-agnostic.

const PALETTE = {
  cabin: "#243B2E",
  cabinLight: "#2E5641",
  seat: "#B08D57",
  seatShade: "#8E6F3F",
  glass: "#D9C7A3",
  glassDim: "#C7A876",
  floor: "#152A20",
  trim: "#F7F4EE"
};

function seatShape(x, y, scale = 1) {
  return `
    <g transform="translate(${x} ${y}) scale(${scale})">
      <rect x="-38" y="-10" width="76" height="90" rx="14" fill="${PALETTE.seat}" />
      <rect x="-38" y="-70" width="76" height="70" rx="16" fill="${PALETTE.seatShade}" />
      <rect x="-30" y="-58" width="60" height="46" rx="10" fill="${PALETTE.seat}" opacity="0.55" />
    </g>
  `;
}

function windowBand(x, w, y = 40, h = 130) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${PALETTE.glass}" opacity="0.35" />`;
}

// Scene 1: Front cabin — dashboard, front seats, windscreen band
const frontCabin = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 800" width="2400" height="800">
  <rect width="2400" height="800" fill="${PALETTE.cabin}" />
  <rect y="560" width="2400" height="240" fill="${PALETTE.floor}" />
  ${windowBand(120, 340)}${windowBand(560, 340)}${windowBand(1000, 340)}${windowBand(1440, 340)}${windowBand(1880, 340)}
  <rect x="900" y="420" width="600" height="140" rx="26" fill="${PALETTE.cabinLight}" />
  <rect x="960" y="450" width="180" height="70" rx="10" fill="${PALETTE.trim}" opacity="0.15" />
  <circle cx="820" cy="540" r="70" fill="${PALETTE.floor}" stroke="${PALETTE.seat}" stroke-width="10" />
  ${seatShape(400, 560)}
  ${seatShape(1900, 560)}
  <rect x="0" y="780" width="2400" height="20" fill="${PALETTE.floor}" />
</svg>
`;

// Scene 2: Middle row — bench seating, more window
const middleRow = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 800" width="2400" height="800">
  <rect width="2400" height="800" fill="${PALETTE.cabinLight}" />
  <rect y="560" width="2400" height="240" fill="${PALETTE.floor}" />
  ${windowBand(100, 380, 30, 150)}${windowBand(620, 380, 30, 150)}${windowBand(1140, 380, 30, 150)}${windowBand(1660, 380, 30, 150)}${windowBand(2180, 380, 30, 150)}
  ${seatShape(360, 560, 1.1)}${seatShape(720, 560, 1.1)}${seatShape(1080, 560, 1.1)}
  ${seatShape(1440, 560, 1.1)}${seatShape(1800, 560, 1.1)}${seatShape(2160, 560, 1.1)}
  <rect x="0" y="780" width="2400" height="20" fill="${PALETTE.floor}" />
</svg>
`;

// Scene 3: Boot / luggage space
const bootSpace = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 800" width="2400" height="800">
  <rect width="2400" height="800" fill="${PALETTE.cabin}" />
  <rect y="500" width="2400" height="300" fill="${PALETTE.floor}" />
  ${windowBand(300, 420, 60, 120)}${windowBand(1000, 420, 60, 120)}${windowBand(1700, 420, 420, 120)}
  <rect x="500" y="540" width="260" height="200" rx="16" fill="${PALETTE.seat}" />
  <rect x="820" y="580" width="220" height="160" rx="16" fill="${PALETTE.seatShade}" />
  <rect x="1120" y="560" width="300" height="180" rx="16" fill="${PALETTE.seat}" opacity="0.85" />
  <rect x="1500" y="600" width="180" height="140" rx="14" fill="${PALETTE.seatShade}" />
  <rect x="0" y="780" width="2400" height="20" fill="${PALETTE.floor}" />
</svg>
`;

function toDataUri(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const tourScenes = [
  { id: "front", label: "Front cabin", image: toDataUri(frontCabin), hotspots: [
    { x: 8, label: "Driver & front passenger seats" },
    { x: 34, label: "Dashboard & climate controls" },
    { x: 78, label: "Window & natural light" }
  ]},
  { id: "middle", label: "Middle row", image: toDataUri(middleRow), hotspots: [
    { x: 15, label: "Reclining bench seating" },
    { x: 50, label: "Legroom & headroom" },
    { x: 85, label: "Window on every row" }
  ]},
  { id: "boot", label: "Boot & luggage", image: toDataUri(bootSpace), hotspots: [
    { x: 20, label: "Luggage rack" },
    { x: 55, label: "Loading space" },
    { x: 88, label: "Rear window" }
  ]}
];
