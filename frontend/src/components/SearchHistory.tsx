"use client";

import { useState, useMemo } from "react";
import type { HistoryRecord } from "@/types/weather";
import { COUNTRY_NAME } from "@/data/locations";

interface SearchHistoryProps {
  records: HistoryRecord[];
  onReSearch: (city: string, country: string) => void;
  onDelete: (id: string) => void;
}

export default function SearchHistory({ records, onReSearch, onDelete }: SearchHistoryProps) {
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // Determine if any records have travel dates (to decide whether to show filter)
  const hasTravelDates = useMemo(
    () => records.some((r) => r.travel_from || r.travel_to),
    [records]
  );

  // Client-side filter: show only records whose travel dates overlap the filter range
  const filteredRecords = useMemo(() => {
    if (!filterFrom && !filterTo) return records;

    return records.filter((r) => {
      // If no travel dates on record, hide it while a filter is active
      if (!r.travel_from && !r.travel_to) return false;

      const recStart = r.travel_from ? new Date(r.travel_from) : null;
      const recEnd = r.travel_to ? new Date(r.travel_to) : recStart;
      const fFrom = filterFrom ? new Date(filterFrom) : null;
      const fTo = filterTo ? new Date(filterTo) : null;

      // Overlap: recStart <= fTo AND recEnd >= fFrom
      if (fTo && recStart && recStart > fTo) return false;
      if (fFrom && recEnd && recEnd < fFrom) return false;
      return true;
    });
  }, [records, filterFrom, filterTo]);

  const clearFilter = () => {
    setFilterFrom("");
    setFilterTo("");
  };

  return (
    <section aria-label="Search history" className="mt-6">

      {/* ── Section header ── */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-5 mb-3">
        <div className="flex items-center gap-2">
          <ClockIcon />
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Search History
          </h3>
          {(filterFrom || filterTo) && (
            <span className="text-[10px] bg-sky-100 text-sky-600 font-semibold px-2 py-0.5 rounded-full">
              Filtered
            </span>
          )}
        </div>

        {/* Show filter toggle only when there are travel-date records */}
        {hasTravelDates && (
          <button
            type="button"
            onClick={() => setShowFilter((v) => !v)}
            className="text-xs font-medium text-gray-400 hover:text-sky-500 transition-colors
                       inline-flex items-center gap-1"
          >
            <FilterIcon />
            {showFilter ? "Hide filter" : "Filter by travel date"}
          </button>
        )}
      </div>

      {/* ── Date range filter ── */}
      {showFilter && (
        <div className="mb-4 p-3 bg-sky-50 border border-sky-100 rounded-xl space-y-2">
          <p className="text-xs font-semibold text-sky-700">Filter by travel date range</p>
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[130px]">
              <label className="block text-[11px] text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="w-full border border-sky-200 bg-white rounded-lg px-2.5 py-1.5 text-sm
                           text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div className="flex-1 min-w-[130px]">
              <label className="block text-[11px] text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={filterTo}
                min={filterFrom || undefined}
                onChange={(e) => setFilterTo(e.target.value)}
                className="w-full border border-sky-200 bg-white rounded-lg px-2.5 py-1.5 text-sm
                           text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>
          {(filterFrom || filterTo) && (
            <button
              type="button"
              onClick={clearFilter}
              className="text-xs text-sky-600 hover:text-sky-800 font-medium transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* ── Record list ── */}
      {records.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400">No searches yet</p>
          <p className="text-xs text-gray-300 mt-1">Searches made via the Search button appear here</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-400">No trips match the selected date range</p>
          <button
            type="button"
            onClick={clearFilter}
            className="text-xs text-sky-500 hover:underline mt-1"
          >
            Clear filter
          </button>
        </div>
      ) : (
        <ul className="space-y-0.5">
          {filteredRecords.map((record, index) => (
            <HistoryRow
              key={record.id}
              record={record}
              index={index}
              onReSearch={onReSearch}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

/* ── Individual row ─────────────────────────────────── */

function HistoryRow({
  record,
  index,
  onReSearch,
  onDelete,
}: {
  record: HistoryRecord;
  index: number;
  onReSearch: (city: string, country: string) => void;
  onDelete: (id: string) => void;
}) {
  const countryName = COUNTRY_NAME[record.country] ?? record.country;
  const hasTravelDates = record.travel_from || record.travel_to;

  return (
    <li className="group flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">

      {/* Index + city info */}
      <div className="flex items-start gap-3 min-w-0">
        <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[11px]
                         flex items-center justify-center font-semibold">
          {index + 1}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {record.city},&nbsp;
            <span className="text-gray-500">{countryName}</span>
          </p>
          <p className="text-xs text-gray-400">{record.searched_at}</p>

          {/* Travel dates badge */}
          {hasTravelDates && (
            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-sky-600 font-medium">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {record.travel_from ?? "?"} → {record.travel_to ?? "?"}
            </p>
          )}
        </div>
      </div>

      {/* Actions — revealed on hover */}
      <div className="flex items-center gap-0.5 shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onReSearch(record.city, record.country)}
          aria-label={`Re-search ${record.city}, ${record.country}`}
          title="Search again"
          className="p-1.5 rounded-lg text-gray-400 hover:text-sky-500 hover:bg-sky-50 transition-colors"
        >
          <SearchIcon />
        </button>
        <button
          onClick={() => onDelete(record.id)}
          aria-label={`Delete ${record.city} from history`}
          title="Delete"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}

/* ── Icons ───────────────────────────────────────────── */

function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
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

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
