"use client";

import { useWeather } from "@/hooks/useWeather";
import SearchForm from "@/components/SearchForm";
import WeatherCard from "@/components/WeatherCard";
import SearchHistory from "@/components/SearchHistory";
import PopularCities from "@/components/PopularCities";

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
    search,
    deleteHistory,
    clear,
  } = useWeather();

  /** Pre-fill inputs and trigger a fresh search from a history record */
  const handleReSearch = (searchCity: string, searchCountry: string) => {
    setCity(searchCity);
    setCountry(searchCountry);
    search(searchCity, searchCountry);
  };

  /** Trigger search from a popular city card */
  const handleCityCardClick = (searchCity: string, searchCountry: string) => {
    setCity(searchCity);
    setCountry(searchCountry);
    search(searchCity, searchCountry, true);
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-start justify-center p-4 sm:p-8 pt-8">
      <div className="w-full max-w-2xl">

        {/* Popular cities — always visible for quick access */}
        <PopularCities
          onSearch={handleCityCardClick}
          setCity={setCity}
          setCountry={setCountry}
          loadingCity={loadingCity}
        />

        {/* Main weather card */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-3 mb-4">
            Today&apos;s Weather
          </h1>

          <SearchForm
            city={city}
            country={country}
            isLoading={status === "loading"}
            onCityChange={setCity}
            onCountryChange={setCountry}
            onSearch={search}
            onClear={clear}
          />

          {/* Weather result */}
          {status === "success" && weather && <WeatherCard weather={weather} />}

          {/* City not found */}
          {status === "not_found" && (
            <div
              role="alert"
              className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-600 mb-4"
            >
              Not found
            </div>
          )}

          {/* API key invalid / not yet activated */}
          {status === "api_key_error" && (
            <div
              role="alert"
              className="border border-yellow-300 bg-yellow-50 rounded px-4 py-2 text-sm text-yellow-800 mb-4"
            >
              OpenWeatherMap API key is invalid or not yet active. New keys can take up to 2 hours to activate.
            </div>
          )}

          {/* Unexpected error */}
          {status === "error" && (
            <div
              role="alert"
              className="border border-red-300 bg-red-50 rounded px-4 py-2 text-sm text-red-600 mb-4"
            >
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
