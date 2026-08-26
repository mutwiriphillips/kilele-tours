// Original illustrated panorama for the homepage hero — a Rift Valley sunset
// scene: Mt Kenya on the skyline, a wildebeest line crossing the plain, Big
// Five silhouettes grazing, acacia trees, and a paraglider catching the last
// light. Deliberately illustrative (not photographic) — consistent with the
// rest of the site's original artwork, and avoids any copyright question
// that real safari photography would raise.

function Acacia({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#0F1F17">
      <rect x="-4" y="0" width="8" height="60" rx="2" />
      <ellipse cx="0" cy="-18" rx="70" ry="18" />
      <ellipse cx="-40" cy="-8" rx="30" ry="10" />
      <ellipse cx="42" cy="-6" rx="26" ry="9" />
    </g>
  );
}

function Wildebeest({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#0F1F17">
      <path d="M0 20 Q4 4 20 2 Q34 1 40 10 L38 20 Q30 14 20 15 Q8 16 4 26 Z" />
      <rect x="4" y="18" width="3" height="10" />
      <rect x="14" y="19" width="3" height="10" />
      <rect x="26" y="18" width="3" height="10" />
      <rect x="34" y="17" width="3" height="10" />
      <path d="M36 8 Q40 4 44 7 Q41 9 40 12 Z" />
    </g>
  );
}

function Elephant({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#0B1712">
      <ellipse cx="10" cy="0" rx="55" ry="32" />
      <path d="M-42 -6 Q-60 -2 -66 20 Q-64 30 -56 28 Q-58 14 -46 6 Z" />
      <ellipse cx="-30" cy="-18" rx="22" ry="24" />
      <path d="M-8 -30 Q10 -46 30 -30 Q14 -34 -2 -24 Z" />
      <rect x="-16" y="24" width="10" height="26" rx="3" />
      <rect x="4" y="26" width="10" height="26" rx="3" />
      <rect x="28" y="26" width="10" height="26" rx="3" />
      <rect x="48" y="24" width="10" height="26" rx="3" />
    </g>
  );
}

function Lion({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#0B1712">
      <circle cx="0" cy="-6" r="16" opacity="0.9" />
      <ellipse cx="26" cy="4" rx="26" ry="14" />
      <rect x="10" y="14" width="6" height="14" rx="2" />
      <rect x="22" y="15" width="6" height="14" rx="2" />
      <rect x="38" y="14" width="6" height="14" rx="2" />
      <rect x="46" y="12" width="6" height="14" rx="2" />
      <path d="M50 0 Q64 -4 66 -14 Q58 -8 50 -6 Z" />
    </g>
  );
}

function Rhino({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#0B1712">
      <ellipse cx="6" cy="4" rx="38" ry="20" />
      <path d="M-30 -6 Q-42 -6 -46 6 Q-40 10 -32 6 Q-34 0 -30 -6 Z" />
      <path d="M-40 -6 L-46 -18 L-38 -8 Z" />
      <rect x="-14" y="18" width="8" height="16" rx="2" />
      <rect x="4" y="20" width="8" height="16" rx="2" />
      <rect x="22" y="20" width="8" height="16" rx="2" />
      <rect x="34" y="18" width="8" height="16" rx="2" />
    </g>
  );
}

function Buffalo({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#0B1712">
      <ellipse cx="8" cy="4" rx="34" ry="18" />
      <ellipse cx="-24" cy="-4" rx="14" ry="12" />
      <path d="M-34 -12 Q-40 -22 -32 -26 Q-30 -16 -26 -12 Z" />
      <path d="M-14 -12 Q-8 -22 -16 -26 Q-18 -16 -22 -12 Z" />
      <rect x="-10" y="14" width="7" height="14" rx="2" />
      <rect x="6" y="16" width="7" height="14" rx="2" />
      <rect x="20" y="16" width="7" height="14" rx="2" />
      <rect x="30" y="14" width="7" height="14" rx="2" />
    </g>
  );
}

function Leopard({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#0B1712">
      <ellipse cx="8" cy="2" rx="30" ry="12" />
      <circle cx="-20" cy="-6" r="10" />
      <path d="M34 -2 Q48 -6 52 4 Q44 2 36 4 Z" />
      <rect x="-8" y="10" width="5" height="12" rx="2" />
      <rect x="4" y="11" width="5" height="12" rx="2" />
      <rect x="16" y="11" width="5" height="12" rx="2" />
      <rect x="24" y="9" width="5" height="12" rx="2" />
    </g>
  );
}

function Paraglider({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M-50 0 Q0 -34 50 0 Q0 -14 -50 0Z"
        fill="#B08D57"
        opacity="0.85"
      />
      <line x1="-38" y1="2" x2="-4" y2="46" stroke="#0B1712" strokeWidth="1.5" />
      <line x1="0" y1="4" x2="0" y2="46" stroke="#0B1712" strokeWidth="1.5" />
      <line x1="38" y1="2" x2="4" y2="46" stroke="#0B1712" strokeWidth="1.5" />
      <circle cx="0" cy="52" r="6" fill="#0B1712" />
    </g>
  );
}

export default function HeroScene({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#152A20" />
          <stop offset="45%" stopColor="#2E5641" />
          <stop offset="72%" stopColor="#B08D57" />
          <stop offset="100%" stopColor="#E8C989" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F7E7C4" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#F7E7C4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="1600" height="900" fill="url(#sky)" />

      {/* Sun glow */}
      <circle cx="1180" cy="560" r="220" fill="url(#sun)" />
      <circle cx="1180" cy="560" r="70" fill="#FBEFD3" opacity="0.9" />

      {/* Birds */}
      <g stroke="#0F1F17" strokeWidth="3" fill="none" opacity="0.7">
        <path d="M120 140 q14 -14 28 0 q14 -14 28 0" />
        <path d="M200 180 q10 -10 20 0 q10 -10 20 0" />
        <path d="M900 120 q12 -12 24 0 q12 -12 24 0" />
      </g>

      {/* Mount Kenya skyline, left of center */}
      <polygon points="260,600 380,340 430,420 500,300 620,600" fill="#0F1F17" opacity="0.92" />
      <polygon points="420,420 430,420 460,380 470,400 440,430" fill="#F7F4EE" opacity="0.5" />

      {/* Distant rolling hills */}
      <path d="M0 640 Q200 590 420 630 Q700 580 1000 630 Q1300 590 1600 640 L1600 900 L0 900 Z" fill="#1F3D2E" opacity="0.85" />

      {/* Paraglider catching the evening light, upper right over the rift */}
      <Paraglider x="1080" y="260" scale="1.1" />

      {/* Ground plain */}
      <path d="M0 690 Q400 650 800 685 Q1200 645 1600 690 L1600 900 L0 900 Z" fill="#152A20" />

      {/* Acacia trees framing the scene */}
      <Acacia x="90" y="700" scale="1.3" />
      <Acacia x="1500" y="720" scale="1.1" />
      <Acacia x="1360" y="760" scale="0.8" />

      {/* Wildebeest migration line, crossing mid-ground left to right */}
      <g opacity="0.9">
        {Array.from({ length: 9 }).map((_, i) => (
          <Wildebeest key={i} x={140 + i * 62} y={640 - (i % 2) * 6} scale={0.55} />
        ))}
      </g>

      {/* Big Five silhouettes, foreground */}
      <Elephant x="230" y="770" scale="1.15" />
      <Lion x="620" y="800" scale="1.05" />
      <Rhino x="900" y="810" scale="1" />
      <Buffalo x="1130" y="800" scale="1" />
      <Leopard x="1340" y="790" scale="0.95" />

      {/* Foreground grass texture */}
      <path
        d="M0 860 Q80 840 160 862 Q260 838 360 860 Q460 838 560 862 Q660 838 760 860 Q860 838 960 862 Q1060 838 1160 860 Q1260 838 1360 862 Q1460 838 1600 860 L1600 900 L0 900 Z"
        fill="#0F1F17"
      />
    </svg>
  );
}
