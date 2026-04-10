import type { ForecastDay, WeatherData } from "@/types/weather";
import WeatherAnimation from "@/components/WeatherAnimation";

interface WeatherCardProps {
  weather: WeatherData;
  travelFrom?: string;
  travelTo?: string;
  forecastCapped?: boolean;
}

export default function WeatherCard({ weather, travelFrom, travelTo, forecastCapped }: WeatherCardProps) {
  const style = getConditionStyle(weather.condition);
  const hasTravelDates = !!(travelFrom || travelTo);

  const displayForecast = hasTravelDates
    ? weather.forecast.filter((day) => {
        if (travelFrom && day.iso_date < travelFrom) return false;
        if (travelTo   && day.iso_date > travelTo)   return false;
        return true;
      })
    : weather.forecast;

  const forecastLabel = hasTravelDates
    ? `Trip Forecast${travelFrom ? ` · ${travelFrom}` : ""}${travelTo ? ` → ${travelTo}` : ""}`
    : "5-Day Forecast";

  // Detect if this is extended (Open-Meteo) data
  const isExtended = displayForecast.some((d) => d.data_type !== undefined);

  return (
    <section aria-label="Current weather result" className="mb-6 space-y-4 animate-weather-card">

      {/* ── Hero ── */}
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

          <div className="shrink-0 -mt-1 drop-shadow-lg">
            <WeatherAnimation condition={weather.condition} size={110} />
          </div>
        </div>

        {/* Quick stat pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          <StatPill icon="💧" label={`${weather.humidity}%`}        title="Humidity" />
          <StatPill icon="🌬️" label={`${weather.wind_speed} m/s`}  title="Wind" />
          <StatPill icon="☁️" label={`${weather.cloudiness}%`}      title="Cloud cover" />
          <StatPill icon="👁️" label={`${weather.visibility_km} km`} title="Visibility" />
        </div>
      </div>

      {/* ── Detail metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <MetricCard icon="🧭" label="Pressure"      value={`${weather.pressure} hPa`} />
        <MetricCard icon="🌡️" label="Temp Range"   value={`${weather.temp_min}° – ${weather.temp_max}°C`} />
        <MetricCard icon="🌅" label="Sunrise (SGT)" value={weather.sunrise} />
        <MetricCard icon="🌇" label="Sunset (SGT)"  value={weather.sunset} />
        <MetricCard icon="🕒" label="Observed At"   value={weather.time} />
      </div>

      {/* ── Forecast / History ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {forecastLabel}
          </h3>
          {isExtended && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
              Historical
              <span className="inline-block w-2 h-2 rounded-full bg-sky-400 ml-1" />
              Forecast
            </span>
          )}
        </div>

        {/* Capped date banner */}
        {forecastCapped && travelTo && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 mb-3 text-xs text-amber-700">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Forecast is limited to 16 days ahead. Showing data up to the available range — dates beyond that cannot be predicted yet.
          </div>
        )}

        {displayForecast.length > 0 ? (
          <ul className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide">
            {displayForecast.map((day, i) => (
              <ForecastCard
                key={day.iso_date ?? `${day.date}-${day.condition}`}
                day={day}
                delayClass={`forecast-delay-${Math.min(i, 4)}`}
              />
            ))}
          </ul>
        ) : hasTravelDates ? (
          <div className="rounded-xl border border-dashed border-sky-200 bg-sky-50 px-4 py-5 text-center">
            <p className="text-sm font-medium text-sky-700">No data for the selected travel dates</p>
            <p className="text-xs text-sky-500 mt-1">
              Historical data is available for past dates · Forecast covers up to 16 days ahead
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────── */

function StatPill({ icon, label, title }: { icon: string; label: string; title: string }) {
  return (
    <div title={title}
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
    <div className="bg-white border border-gray-100 rounded-xl px-3.5 py-3 shadow-sm
                    hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        <span className="mr-1" aria-hidden="true">{icon}</span>
        {label}
      </p>
      <p className="text-sm font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

function ForecastCard({ day, delayClass }: { day: ForecastDay; delayClass: string }) {
  const style = getConditionStyle(day.condition);
  const isHistorical = day.data_type === "historical";
  const isForecast = day.data_type === "forecast";

  return (
    <li className={`min-w-[138px] snap-start rounded-2xl overflow-hidden shadow-sm
                    border border-gray-100 bg-white flex-shrink-0
                    hover:shadow-md hover:-translate-y-1 transition-all duration-200
                    ${delayClass}`}>
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${style.gradient} flex flex-col items-center pt-3 pb-2 px-2`}>
        <WeatherAnimation condition={day.condition} size={60} />
        <p className="text-white text-xs font-semibold mt-0.5">{day.date}</p>
      </div>

      {/* Details */}
      <div className="px-3 py-2.5">
        {/* Historical / Forecast badge */}
        {isHistorical && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold
                           bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            Historical
          </span>
        )}
        {isForecast && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold
                           bg-sky-100 text-sky-700 rounded-full px-2 py-0.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
            Forecast
          </span>
        )}

        <p className="text-xs text-gray-500 capitalize truncate">{day.description}</p>
        <p className="text-sm font-bold text-gray-800 mt-1">{day.temp_min}° – {day.temp_max}°C</p>
        <p className="text-xs text-gray-400 mt-1.5">💧 {day.humidity}%&nbsp;&nbsp;🌬️ {day.wind_speed} m/s</p>
      </div>
    </li>
  );
}

/* ── Helpers ─────────────────────────────────────────── */

interface ConditionStyle { gradient: string; label: string; }

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
