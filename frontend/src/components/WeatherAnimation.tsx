"use client";

interface Props {
  condition: string;
  size?: number;
}

/** Animated SVG weather illustration — maps OWM condition strings to animations */
export default function WeatherAnimation({ condition, size = 110 }: Props) {
  const key = condition.toLowerCase();
  if (key.includes("thunder"))                                          return <ThunderAnim size={size} />;
  if (key.includes("drizzle"))                                          return <DrizzleAnim size={size} />;
  if (key.includes("rain"))                                             return <RainAnim    size={size} />;
  if (key.includes("snow"))                                             return <SnowAnim    size={size} />;
  if (key.includes("mist") || key.includes("fog") ||
      key.includes("haze") || key.includes("smoke"))                    return <MistAnim    size={size} />;
  if (key.includes("cloud"))                                            return <CloudAnim   size={size} />;
  return <SunAnim size={size} />;
}

/* ── Shared cloud shape (overlapping ellipses) ────────── */
function Cloud({ opacity = 1 }: { opacity?: number }) {
  return (
    <g opacity={opacity}>
      <ellipse cx="60" cy="74" rx="30" ry="17" fill="white" />
      <circle  cx="42" cy="67" r="17"           fill="white" />
      <circle  cx="67" cy="57" r="21"           fill="white" />
      <circle  cx="83" cy="67" r="14"           fill="white" />
    </g>
  );
}

/* ── Sun ──────────────────────────────────────────────── */
const SUN_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function SunAnim({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      {/* Outer glow ring */}
      <circle cx="60" cy="60" r="40" fill="white" opacity="0.12"
        style={{ animation: "weather-sun-glow 3.5s ease-in-out infinite",
                 transformOrigin: "60px 60px" }} />
      {/* Inner glow ring */}
      <circle cx="60" cy="60" r="29" fill="white" opacity="0.18"
        style={{ animation: "weather-sun-glow 3.5s ease-in-out infinite 0.7s",
                 transformOrigin: "60px 60px" }} />
      {/* Rotating rays */}
      <g style={{ animation: "weather-rotate 14s linear infinite",
                  transformOrigin: "60px 60px" }}>
        {SUN_ANGLES.map((a) => (
          <line key={a}
            x1="60" y1="30" x2="60" y2="17"
            stroke="white" strokeWidth="4" strokeLinecap="round"
            transform={`rotate(${a} 60 60)`}
          />
        ))}
      </g>
      {/* Sun disc */}
      <circle cx="60" cy="60" r="19" fill="white" opacity="0.95" />
    </svg>
  );
}

/* ── Cloud ────────────────────────────────────────────── */
function CloudAnim({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <g style={{ animation: "weather-float 5s ease-in-out infinite",
                  transformOrigin: "60px 65px" }}>
        <Cloud />
      </g>
    </svg>
  );
}

/* ── Rain ─────────────────────────────────────────────── */
const RAIN_DROPS = [
  { x: 37, delay: "0s"     },
  { x: 51, delay: "0.2s"   },
  { x: 65, delay: "0.45s"  },
  { x: 79, delay: "0.7s"   },
  { x: 44, delay: "0.1s"   },
  { x: 72, delay: "0.55s"  },
];

function RainAnim({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <g style={{ animation: "weather-float 6s ease-in-out infinite",
                  transformOrigin: "60px 65px" }}>
        <Cloud />
      </g>
      {RAIN_DROPS.map((d, i) => (
        <line key={i}
          x1={d.x} y1="90" x2={d.x - 4} y2="106"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"
          style={{ animation: `weather-rain-drop 1.1s ease-in infinite`,
                   animationDelay: d.delay }} />
      ))}
    </svg>
  );
}

/* ── Drizzle ──────────────────────────────────────────── */
const DRIZZLE_DROPS = [
  { x: 41, delay: "0s"   },
  { x: 59, delay: "0.45s"},
  { x: 77, delay: "0.9s" },
  { x: 50, delay: "0.6s" },
];

function DrizzleAnim({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <g style={{ animation: "weather-float 6s ease-in-out infinite",
                  transformOrigin: "60px 65px" }}>
        <Cloud opacity={0.85} />
      </g>
      {DRIZZLE_DROPS.map((d, i) => (
        <line key={i}
          x1={d.x} y1="90" x2={d.x - 3} y2="103"
          stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.75"
          style={{ animation: `weather-rain-drop 1.7s ease-in infinite`,
                   animationDelay: d.delay }} />
      ))}
    </svg>
  );
}

/* ── Thunderstorm ─────────────────────────────────────── */
function ThunderAnim({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <g style={{ animation: "weather-float 7s ease-in-out infinite",
                  transformOrigin: "60px 65px" }}>
        <Cloud opacity={0.9} />
      </g>
      {/* Lightning bolt */}
      <polygon
        points="66,83 53,101 63,101 55,119 77,97 65,97 75,83"
        fill="white"
        style={{ animation: "weather-lightning 2.8s ease-in-out infinite" }}
      />
      {/* Side rain drops */}
      <line x1="36" y1="90" x2="32" y2="104"
        stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"
        style={{ animation: "weather-rain-drop 1.1s ease-in infinite 0.3s" }} />
      <line x1="90" y1="90" x2="86" y2="104"
        stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7"
        style={{ animation: "weather-rain-drop 1.1s ease-in infinite 0.9s" }} />
    </svg>
  );
}

/* ── Snow ─────────────────────────────────────────────── */
const SNOWFLAKES = [
  { x: 37, delay: "0s",    r: 4 },
  { x: 52, delay: "0.5s",  r: 3 },
  { x: 67, delay: "1.0s",  r: 4 },
  { x: 81, delay: "0.25s", r: 3 },
  { x: 44, delay: "0.75s", r: 3 },
  { x: 74, delay: "1.25s", r: 4 },
];

function SnowAnim({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <g style={{ animation: "weather-float 6s ease-in-out infinite",
                  transformOrigin: "60px 65px" }}>
        <Cloud opacity={0.9} />
      </g>
      {SNOWFLAKES.map((s, i) => (
        <circle key={i}
          cx={s.x} cy="90" r={s.r} fill="white" opacity="0.9"
          style={{ animation: `weather-snow-fall 2s ease-in infinite`,
                   animationDelay: s.delay }} />
      ))}
    </svg>
  );
}

/* ── Mist / Fog ───────────────────────────────────────── */
const FOG_LINES = [
  { y: 32, x: 22, w: 68, delay: "0s"   },
  { y: 48, x: 14, w: 78, delay: "0.6s" },
  { y: 64, x: 20, w: 62, delay: "1.2s" },
  { y: 80, x: 28, w: 52, delay: "0.3s" },
];

function MistAnim({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      {FOG_LINES.map((f, i) => (
        <rect key={i}
          x={f.x} y={f.y} width={f.w} height="9" rx="4.5"
          fill="white" opacity="0.7"
          style={{ animation: `weather-fog 3.5s ease-in-out infinite`,
                   animationDelay: f.delay }} />
      ))}
    </svg>
  );
}
