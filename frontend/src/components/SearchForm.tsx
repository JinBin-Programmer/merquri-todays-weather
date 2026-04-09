"use client";

import type { FormEvent } from "react";

interface SearchFormProps {
  city: string;
  country: string;
  isLoading: boolean;
  onCityChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onSearch: (city: string, country: string) => void;
  onClear: () => void;
}

export default function SearchForm({
  city,
  country,
  isLoading,
  onCityChange,
  onCountryChange,
  onSearch,
  onClear,
}: SearchFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(city, country);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4"
      aria-label="Weather search"
    >
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        City:
        <input
          type="text"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="e.g. Johor"
          aria-label="City name"
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-40
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        Country:
        <input
          type="text"
          value={country}
          onChange={(e) => onCountryChange(e.target.value.toUpperCase())}
          placeholder="e.g. MY"
          maxLength={2}
          aria-label="Country code (2-letter ISO)"
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-20
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading || !city.trim()}
        className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed
                   text-sm px-4 py-1.5 rounded border border-gray-400 transition-colors"
      >
        {isLoading ? "Searching…" : "Search"}
      </button>

      <button
        type="button"
        onClick={onClear}
        className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1.5
                   rounded border border-gray-400 transition-colors"
      >
        Clear
      </button>
    </form>
  );
}
