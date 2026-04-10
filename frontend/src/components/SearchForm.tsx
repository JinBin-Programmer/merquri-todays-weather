"use client";

import { type FormEvent, useState, useEffect, useRef } from "react";
import { COUNTRIES, CITY_SUGGESTIONS } from "@/data/locations";

interface SearchFormProps {
  city: string;
  country: string;
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

  const citySuggestions = CITY_SUGGESTIONS[country] ?? [];

  return (
    <form onSubmit={handleSubmit} className="mb-5 space-y-3" aria-label="Weather search">

      {/* ── City + Country ── */}
      <div className="flex flex-wrap gap-3">

        {/* City */}
        <div className="flex-1 min-w-[140px]">
          <label htmlFor="city-input"
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
            placeholder="e.g. Singapore"
            autoComplete="off"
            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm
                       text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400
                       focus:border-transparent focus:bg-white transition-all placeholder:text-gray-300"
          />
          {citySuggestions.length > 0 && (
            <datalist id="city-suggestions">
              {citySuggestions.map((c) => <option key={c} value={c} />)}
            </datalist>
          )}
        </div>

        {/* Country — custom dropdown */}
        <div className="w-40">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
            Country
          </label>
          <CountrySelect value={country} onChange={onCountryChange} />
        </div>
      </div>

      {/* ── Travel dates ── */}
      <div>
        <button type="button" onClick={() => setShowTravelDates((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-500
                     hover:text-sky-700 transition-colors"
        >
          <CalendarIcon />
          {showTravelDates ? "Hide travel dates" : "Add travel dates (optional)"}
        </button>

        {showTravelDates && (
          <div className="mt-2 space-y-2">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[140px]">
                <label htmlFor="travel-from"
                  className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
                >
                  Travel From
                </label>
                <input id="travel-from" type="date" value={travelFrom}
                  onChange={(e) => onTravelFromChange(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm
                             text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400
                             focus:border-transparent focus:bg-white transition-all"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <label htmlFor="travel-to"
                  className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
                >
                  Travel To
                </label>
                <input id="travel-to" type="date" value={travelTo}
                  min={travelFrom || undefined}
                  onChange={(e) => onTravelToChange(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm
                             text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400
                             focus:border-transparent focus:bg-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Historical data for past dates · Forecast up to 16 days ahead
            </p>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-2">
        <button type="submit" disabled={isLoading || !city.trim()}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600
                     hover:from-sky-600 hover:to-blue-700 active:from-sky-700 active:to-blue-800
                     disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold
                     px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-sky-300/50"
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
                aria-hidden="true" />
              Searching…
            </>
          ) : (
            <><SearchIcon /> Search</>
          )}
        </button>

        <button type="button" onClick={handleClear}
          className="text-sm font-medium text-gray-400 hover:text-gray-600 px-4 py-2.5
                     rounded-xl hover:bg-gray-100 transition-colors"
        >
          Clear
        </button>
      </div>
    </form>
  );
}

/* ── Custom country dropdown ─────────────────────────── */

function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-focus search when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code: string) => {
    onChange(code);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Trigger — shows code when selected, placeholder when empty */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 border border-gray-200 bg-gray-50
                   rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2
                   focus:ring-sky-400 focus:bg-white transition-all"
      >
        {value ? (
          <span className="font-bold text-gray-800 tracking-wide">{value}</span>
        ) : (
          <span className="text-gray-300">Country</span>
        )}
        <ChevronIcon open={open} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200
                        rounded-xl shadow-2xl overflow-hidden min-w-[220px]">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country…"
              className="w-full text-sm px-3 py-1.5 border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Option list */}
          <ul className="max-h-52 overflow-y-auto py-1" role="listbox">
            {/* Clear option */}
            <li>
              <button type="button" onClick={() => handleSelect("")}
                className="w-full px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-50"
              >
                — Any country —
              </button>
            </li>

            {filtered.length > 0 ? filtered.map((c) => (
              <li key={c.code} role="option" aria-selected={value === c.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(c.code)}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between
                             hover:bg-sky-50 transition-colors
                             ${value === c.code ? "bg-sky-50 text-sky-700" : "text-gray-700"}`}
                >
                  <span>{c.name}</span>
                  <span className={`text-xs font-mono font-bold
                                   ${value === c.code ? "text-sky-500" : "text-gray-400"}`}>
                    {c.code}
                  </span>
                </button>
              </li>
            )) : (
              <li className="px-3 py-4 text-sm text-gray-400 text-center">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────── */

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
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
