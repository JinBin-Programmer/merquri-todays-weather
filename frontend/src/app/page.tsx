"use client";

import { useWeather } from "@/hooks/useWeather";
import SearchForm from "@/components/SearchForm";
import WeatherCard from "@/components/WeatherCard";
import SearchHistory from "@/components/SearchHistory";
import PopularCities from "@/components/PopularCities";

/** Default background shown before any search */
const DEFAULT_BG = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&q=80`;

/** Map OWM condition string → full-width Unsplash background image URL */
function getWeatherBg(condition: string): string {
  const key = condition.toLowerCase();
  const q = "w=1920&h=1080&fit=crop&q=80";
  if (key.includes("thunder"))
    return `https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?${q}`;
  if (key.includes("drizzle"))
    return `https://images.unsplash.com/photo-1428592953211-077101b2021b?${q}`;
  if (key.includes("rain"))
    return `https://images.unsplash.com/photo-5Q5jtb1SEVo?${q}`;
  if (key.includes("snow"))
    return `https://images.unsplash.com/photo-1491002052546-bf38f186af56?${q}`;
  if (key.includes("mist") || key.includes("fog") || key.includes("haze"))
    return `https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?${q}`;
  if (key.includes("cloud"))
    return `https://images.unsplash.com/photo-1534088568595-a066f410bcda?${q}`;
  if (key.includes("clear"))
    return `https://images.unsplash.com/photo-1597200381847-30ec200eeb9a?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;
  return `https://images.unsplash.com/photo-1469474968028-56623f02e42e?${q}`;
}

const TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function HomePage() {
  const {
    weather,
    history,
    status,
    loadingCity,
    city,
    setCity,
    country,
    setCountry,
    travelFrom,
    setTravelFrom,
    travelTo,
    setTravelTo,
    search,
    deleteHistory,
    clear,
    forecastCapped,
  } = useWeather();

  const bgImage = weather ? getWeatherBg(weather.condition) : DEFAULT_BG;

  const handleReSearch = (searchCity: string, searchCountry: string) => {
    setCity(searchCity);
    setCountry(searchCountry);
    search(searchCity, searchCountry, false, false);
  };

  const handleCityCardClick = (searchCity: string, searchCountry: string) => {
    setCity(searchCity);
    setCountry(searchCountry);
    search(searchCity, searchCountry, true, false);
  };

  const handleFormSearch = (searchCity: string, searchCountry: string) => {
    search(searchCity, searchCountry, false, true);
  };

  return (
    <main className="min-h-screen flex items-start justify-center p-4 sm:p-8 pt-8 relative">

      {/* ── Full-screen background ── */}
      <div className="fixed inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={bgImage}
          src={bgImage}
          alt=""
          className="w-full h-full object-cover animate-bg-fade"
        />
        <div className="absolute inset-0 bg-gray-900/50" />
      </div>

      <div className="w-full max-w-2xl space-y-4">

        {/* Popular cities */}
        <PopularCities
          onSearch={handleCityCardClick}
          setCity={setCity}
          setCountry={setCountry}
          loadingCity={loadingCity}
        />

        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-6">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sm shadow-sky-200">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </span>
              <div>
                <h1 className="text-xl font-bold text-gray-800 leading-tight">Today&apos;s Weather</h1>
                <p className="text-[11px] text-gray-400 mt-0">{TODAY}</p>
              </div>
            </div>
          </div>

          <SearchForm
            city={city}
            country={country}
            travelFrom={travelFrom}
            travelTo={travelTo}
            isLoading={status === "loading"}
            onCityChange={setCity}
            onCountryChange={setCountry}
            onTravelFromChange={setTravelFrom}
            onTravelToChange={setTravelTo}
            onSearch={handleFormSearch}
            onClear={clear}
          />

          {/* Idle prompt */}
          {status === "idle" && (
            <div className="flex flex-col items-center py-10 text-center select-none">
              {/* Animated sun + cloud illustration */}
              <div className="relative mb-5 [animation:weather-float_3.5s_ease-in-out_infinite]">
                <svg viewBox="0 0 96 80" width="96" height="80" aria-hidden="true">
                  {/* Sun glow */}
                  <circle cx="38" cy="34" r="22" fill="#fde68a" opacity="0.3" style={{ animation: "weather-sun-glow 3s ease-in-out infinite" }} />
                  {/* Sun body */}
                  <circle cx="38" cy="34" r="14" fill="#fbbf24" />
                  {/* Sun rays */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    return (
                      <line
                        key={deg}
                        x1={38 + 17 * Math.sin(rad)} y1={34 - 17 * Math.cos(rad)}
                        x2={38 + 23 * Math.sin(rad)} y2={34 - 23 * Math.cos(rad)}
                        stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"
                      />
                    );
                  })}
                  {/* Cloud body */}
                  <ellipse cx="62" cy="55" rx="20" ry="12" fill="white" />
                  <circle cx="50" cy="52" r="10" fill="white" />
                  <circle cx="68" cy="50" r="9" fill="white" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500">Where are you headed?</p>
              <p className="text-xs text-gray-400 mt-1">Enter a city to check today&apos;s weather</p>
              <p className="text-xs text-gray-300 mt-0.5">Or pick a popular destination above</p>
            </div>
          )}

          {/* Results */}
          {status === "success" && weather && (
            <WeatherCard
              weather={weather}
              travelFrom={travelFrom}
              travelTo={travelTo}
              forecastCapped={forecastCapped}
            />
          )}

          {status === "not_found" && (
            <div role="alert"
              className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 mb-4"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              City not found. Please check the city name and country code.
            </div>
          )}

          {status === "api_key_error" && (
            <div role="alert"
              className="flex items-center gap-2.5 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800 mb-4"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              API key invalid or not yet active. New keys can take up to 2 hours to activate.
            </div>
          )}

          {status === "error" && (
            <div role="alert"
              className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Something went wrong. Please try again.
            </div>
          )}

          <SearchHistory
            records={history}
            onReSearch={handleReSearch}
            onDelete={deleteHistory}
          />
        </div>

      </div>
    </main>
  );
}
