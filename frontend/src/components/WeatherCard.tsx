import type { WeatherData } from "@/types/weather";

interface WeatherCardProps {
  weather: WeatherData;
}

/** Displays current weather details for the searched city */
export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <section aria-label="Current weather result" className="mb-6">
      <p className="text-gray-600 text-sm mb-1">
        {weather.city}, {weather.country}
      </p>

      <h2 className="text-4xl font-bold text-gray-900 mb-4">{weather.condition}</h2>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm text-gray-700">
        <dt className="font-medium">Description:</dt>
        <dd className="capitalize">{weather.description}</dd>

        <dt className="font-medium">Temperature:</dt>
        <dd>
          {weather.temp_min}°C ~ {weather.temp_max}°C
        </dd>

        <dt className="font-medium">Humidity:</dt>
        <dd>{weather.humidity}%</dd>

        <dt className="font-medium">Time:</dt>
        <dd>{weather.time}</dd>
      </dl>
    </section>
  );
}
