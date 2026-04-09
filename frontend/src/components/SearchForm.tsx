"use client";

import { type FormEvent, useState, useEffect } from "react";
import { COUNTRIES, CITY_SUGGESTIONS } from "@/data/locations";

interface SearchFormProps {
  city: string;
  country: string;           // ISO code stored in parent (e.g. "MY")
  travelFrom: string;
  travelTo: string;
  isLoading: boolean;
  onCityChange: (value: string) => void;
  onCountryChange: (code: string) => void;
  onTravelFromChange: (value: string) => void;
  onTravelToChange: (value: string) => void;
  onSearch: (city: string, country: string) => void;
  onClear: () => void;
}

export default function SearchForm({
  city,
  country,
  travelFrom,
  travelTo,
  isLoading,
  onCityChange,
  onCountryChange,
  onTravelFromChange,
  onTravelToChange,
  onSearch,
  onClear,
}: SearchFormProps) {
  const [showTravelDates, setShowTravelDates] = useState(
    () => !!(travelFrom || travelTo)
  );

  // Show travel-date section if parent already has dates (e.g. after clear/restore)
  useEffect(() => {
    if (travelFrom || travelTo) setShowTravelDates(true);
  }, [travelFrom, travelTo]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(city, country);
  };

  const handleClear = () => {
    setShowTravelDates(false);
    onClear();
  };

  // City suggestions based on the selected country code
  const citySuggestions = CITY_SUGGESTIONS[country] ?? [];

  return (
    <form onSubmit={handleSubmit} className="mb-5 space-y-3" aria-label="Weather search">

      {/* ── Row 1: City + Country ── */}
      <div className="flex flex-wrap gap-3">

        {/* City — free text with optional suggestions */}
        <div className="flex-1 min-w-[140px]">
          <label
            htmlFor="city-input"
            className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
          >
            City
          </label>
          <input
            id="city-input"
            type="text"
            list="city-suggestions"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="e.g. Johor Bahru"
            autoComplete="off"
            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm
                       text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400
                       focus:border-transparent focus:bg-white transition-all placeholder:text-gray-300"
          />
          {/* City suggestions — only appear when a country is selected */}
          {citySuggestions.length > 0 && (
            <datalist id="city-suggestions">
              {citySuggestions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          )}
        </div>

        {/* Country — proper <select> dropdown, no autofill weirdness */}
        <div className="w-48">
          <label
            htmlFor="country-select"
            className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
          >
            Country
          </label>
          <select
            id="country-select"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm
                       text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400
                       focus:border-transparent focus:bg-white transition-all"
          >
            <option value="">— Any country —</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Row 2: Travel dates (collapsible) ── */}
      <div>
        <button
          type="button"
          onClick={() => setShowTravelDates((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-500
                     hover:text-sky-700 transition-colors"
        >
          <CalendarIcon />
          {showTravelDates ? "Hide travel dates" : "Add travel dates (optional)"}
        </button>

        {showTravelDates && (
          <div className="mt-2 flex flex-wrap gap-3">
            <div className="flex-1 min-w-[140px]">
              <label
                htmlFor="travel-from"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
              >
                Travel From
              </label>
              <input
                id="travel-from"
                type="date"
                value={travelFrom}
                onChange={(e) => onTravelFromChange(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm
                           text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400
                           focus:border-transparent focus:bg-white transition-all"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label
                htmlFor="travel-to"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
              >
                Travel To
              </label>
              <input
                id="travel-to"
                type="date"
                value={travelTo}
                min={travelFrom || undefined}
                onChange={(e) => onTravelToChange(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm
                           text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400
                           focus:border-transparent focus:bg-white transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Row 3: Action buttons ── */}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isLoading || !city.trim()}
          className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700
                     disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold
                     px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-sky-200/60"
        >
          {isLoading ? (
            <>
              <span
                className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
              Searching…
            </>
          ) : (
            <>
              <SearchIcon />
              Search
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-medium text-gray-400 hover:text-gray-600 px-4 py-2.5
                     rounded-xl hover:bg-gray-100 transition-colors"
        >
          Clear
        </button>
      </div>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
