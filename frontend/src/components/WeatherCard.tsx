import type { WeatherData } from "@/types/weather";

interface WeatherCardProps {
  weather: WeatherData;
}

/** Displays current weather details and a compact 5-day forecast */
export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <section aria-label="Current weather result" className="mb-6 space-y-5">
      <div>
        <p className="text-gray-600 text-sm mb-1">
          {weather.city}, {weather.country}
        </p>
        <h2 className="text-4xl font-bold text-gray-900">{weather.condition}</h2>
        <p className="capitalize text-gray-600 mt-1">{weather.description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Current" value={`${weather.temp_current}°C`} />
        <MetricCard label="Feels Like" value={`${weather.feels_like}°C`} />
        <MetricCard label="Range" value={`${weather.temp_min}°C ~ ${weather.temp_max}°C`} />
        <MetricCard label="Humidity" value={`${weather.humidity}%`} />
        <MetricCard label="Wind" value={`${weather.wind_speed} m/s`} />
        <MetricCard label="Pressure" value={`${weather.pressure} hPa`} />
        <MetricCard label="Cloudiness" value={`${weather.cloudiness}%`} />
        <MetricCard label="Visibility" value={`${weather.visibility_km} km`} />
        <MetricCard label="Observed At" value={weather.time} />
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm text-gray-700">
        <dt className="font-medium">Sunrise (UTC):</dt>
        <dd>{weather.sunrise}</dd>
        <dt className="font-medium">Sunset (UTC):</dt>
        <dd>{weather.sunset}</dd>
      </dl>

      {weather.forecast.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">5-Day Forecast</h3>
          <ul className="space-y-2">
            {weather.forecast.map((day) => (
              <li
                key={`${day.date}-${day.condition}`}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-gray-900">{day.date}</p>
                  <p className="text-gray-700">
                    {day.temp_min}°C ~ {day.temp_max}°C
                  </p>
                </div>
                <p className="text-gray-600 capitalize">{day.description}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Humidity {day.humidity}% • Wind {day.wind_speed} m/s
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-gray-900 mt-1">{value}</p>
    </div>
  );
}