"use client";

import { useWeather } from "@/hooks/useWeather";
import SearchForm from "@/components/SearchForm";
import WeatherCard from "@/components/WeatherCard";
import SearchHistory from "@/components/SearchHistory";
import PopularCities from "@/components/PopularCities";

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

  const bgImage = weather ? getWeatherBg(weather.condition) : null;

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

      {/* ── Full-screen weather background ── */}
      <div className="fixed inset-0 -z-10">
        {bgImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={bgImage}
              src={bgImage}
              alt=""
              className="w-full h-full object-cover transition-opacity duration-1000"
            />
            {/* Gray overlay so all text stays readable */}
            <div className="absolute inset-0 bg-gray-900/50" />
          </>
        ) : (
          /* Default animated gradient when no weather loaded */
          <div className="w-full h-full bg-animated" />
        )}
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
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white shadow-sm shadow-sky-200">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </span>
            <h1 className="text-xl font-bold text-gray-800">Today&apos;s Weather</h1>
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
            <div className="flex flex-col items-center py-8 text-center select-none">
              <svg viewBox="0 0 96 96" width="72" height="72" aria-hidden="true" className="mb-3 opacity-30">
                <circle cx="48" cy="48" r="32" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="8 4" />
                <circle cx="48" cy="48" r="16" fill="#0ea5e9" opacity="0.3" />
                <circle cx="48" cy="48" r="6"  fill="#0ea5e9" opacity="0.6" />
              </svg>
              <p className="text-sm font-medium text-gray-400">Enter a city to see today&apos;s weather</p>
              <p className="text-xs text-gray-300 mt-1">Or pick a popular city above</p>
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
