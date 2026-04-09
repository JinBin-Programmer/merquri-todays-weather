import type { ForecastDay, WeatherData } from "@/types/weather";

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const style = getConditionStyle(weather.condition);

  return (
    <section aria-label="Current weather result" className="mb-6 space-y-4">

      {/* ── Hero: condition gradient + OWM icon ── */}
      <div className={`rounded-2xl bg-gradient-to-br ${style.gradient} p-5 shadow-lg`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className={`text-sm font-semibold ${style.label} mb-0.5`}>
              {weather.city}, {weather.country}
            </p>
            <p className="text-6xl font-bold text-white tracking-tight">
              {weather.temp_current}°
              <span className="text-3xl font-semibold opacity-70 ml-0.5">C</span>
            </p>
            <p className="mt-1.5 text-base font-semibold text-white/90">{weather.condition}</p>
            <p className="text-sm capitalize text-white/60">{weather.description}</p>
            <p className="text-xs mt-2 text-white/50">
              Feels like {weather.feels_like}°C &nbsp;·&nbsp; {weather.temp_min}° – {weather.temp_max}°C
            </p>
          </div>

          {/* Weather icon from OpenWeatherMap CDN */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://openweathermap.org/img/wn/${getOWMIconCode(weather.condition)}@4x.png`}
            alt={weather.condition}
            width={110}
            height={110}
            className="shrink-0 drop-shadow-lg -mt-1"
          />
        </div>

        {/* Quick stat pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          <StatPill icon="💧" label={`${weather.humidity}%`} title="Humidity" />
          <StatPill icon="🌬️" label={`${weather.wind_speed} m/s`} title="Wind" />
          <StatPill icon="☁️" label={`${weather.cloudiness}%`} title="Cloud cover" />
          <StatPill icon="👁️" label={`${weather.visibility_km} km`} title="Visibility" />
        </div>
      </div>

      {/* ── Detail metrics grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <MetricCard icon="🧭" label="Pressure" value={`${weather.pressure} hPa`} />
        <MetricCard icon="🌡️" label="Temp Range" value={`${weather.temp_min}° – ${weather.temp_max}°C`} />
        <MetricCard icon="🌅" label="Sunrise (UTC)" value={weather.sunrise} />
        <MetricCard icon="🌇" label="Sunset (UTC)" value={weather.sunset} />
        <MetricCard icon="🕒" label="Observed At" value={weather.time} />
      </div>

      {/* ── 5-Day Forecast ── */}
      {weather.forecast.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            5-Day Forecast
          </h3>
          <ul className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide">
            {weather.forecast.map((day) => (
              <ForecastCard key={`${day.date}-${day.condition}`} day={day} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────── */

function StatPill({ icon, label, title }: { icon: string; label: string; title: string }) {
  return (
    <div
      title={title}
      className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full
                 px-3 py-1 text-xs font-medium text-white"
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3.5 py-3 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        <span className="mr-1" aria-hidden="true">{icon}</span>
        {label}
      </p>
      <p className="text-sm font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

function ForecastCard({ day }: { day: ForecastDay }) {
  const style = getConditionStyle(day.condition);

  return (
    <li className="min-w-[138px] snap-start rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white flex-shrink-0">
      {/* Gradient header with weather icon */}
      <div className={`bg-gradient-to-br ${style.gradient} flex flex-col items-center pt-3 pb-2 px-2`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://openweathermap.org/img/wn/${getOWMIconCode(day.condition)}@2x.png`}
          alt={day.condition}
          width={60}
          height={60}
          className="drop-shadow"
          loading="lazy"
        />
        <p className="text-white text-xs font-semibold mt-0.5">{day.date}</p>
      </div>

      {/* Details */}
      <div className="px-3 py-2.5">
        <p className="text-xs text-gray-500 capitalize truncate">{day.description}</p>
        <p className="text-sm font-bold text-gray-800 mt-1">
          {day.temp_min}° – {day.temp_max}°C
        </p>
        <p className="text-xs text-gray-400 mt-1.5">
          💧 {day.humidity}%&nbsp;&nbsp;🌬️ {day.wind_speed} m/s
        </p>
      </div>
    </li>
  );
}

/* ── Helpers ─────────────────────────────────────────── */

/** Maps a condition string to the closest OWM icon code */
function getOWMIconCode(condition: string): string {
  const key = condition.toLowerCase();
  if (key.includes("thunder")) return "11d";
  if (key.includes("drizzle")) return "09d";
  if (key.includes("rain")) return "10d";
  if (key.includes("snow")) return "13d";
  if (key.includes("mist") || key.includes("fog") || key.includes("haze") || key.includes("smoke")) return "50d";
  if (key.includes("cloud")) return "04d";
  if (key.includes("clear")) return "01d";
  return "02d";
}

interface ConditionStyle {
  gradient: string;
  label: string; // text colour for city label on gradient bg
}

/** Condition-aware gradient + label colour for hero and forecast cards */
function getConditionStyle(condition: string): ConditionStyle {
  const key = condition.toLowerCase();

  if (key.includes("thunder"))
    return { gradient: "from-slate-800 via-purple-900 to-slate-700", label: "text-purple-300" };
  if (key.includes("rain"))
    return { gradient: "from-slate-600 via-blue-700 to-slate-600",   label: "text-blue-200"   };
  if (key.includes("drizzle"))
    return { gradient: "from-slate-500 via-blue-600 to-cyan-700",    label: "text-sky-200"    };
  if (key.includes("snow"))
    return { gradient: "from-sky-300 via-blue-200 to-slate-300",     label: "text-sky-700"    };
  if (key.includes("mist") || key.includes("fog") || key.includes("haze"))
    return { gradient: "from-gray-500 via-slate-400 to-gray-500",    label: "text-gray-200"   };
  if (key.includes("cloud"))
    return { gradient: "from-slate-500 via-gray-400 to-blue-500",    label: "text-gray-200"   };
  if (key.includes("clear"))
    return { gradient: "from-sky-400 via-blue-500 to-cyan-400",      label: "text-sky-100"    };

  return   { gradient: "from-blue-500 via-sky-500 to-cyan-400",      label: "text-sky-100"    };
}
