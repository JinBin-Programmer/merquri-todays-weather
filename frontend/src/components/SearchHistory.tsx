"use client";

import type { HistoryRecord } from "@/types/weather";

interface SearchHistoryProps {
  records: HistoryRecord[];
  onReSearch: (city: string, country: string) => void;
  onDelete: (id: string) => void;
}

/** Renders the list of past weather searches with re-search and delete actions */
export default function SearchHistory({ records, onReSearch, onDelete }: SearchHistoryProps) {
  return (
    <section aria-label="Search history">
      <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-1">
        Search History
      </h3>

      {records.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm" role="status">
          No Record
        </p>
      ) : (
        <ul>
          {records.map((record, index) => (
            <li
              key={record.id}
              className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
            >
              <span className="text-sm text-gray-800">
                {index + 1}. {record.city}, {record.country}
              </span>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 tabular-nums">
                  {record.searched_at}
                </span>

                {/* Re-search button */}
                <button
                  onClick={() => onReSearch(record.city, record.country)}
                  aria-label={`Re-search ${record.city}, ${record.country}`}
                  title="Search again"
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                >
                  <SearchIcon />
                </button>

                {/* Delete button */}
                <button
                  onClick={() => onDelete(record.id)}
                  aria-label={`Delete ${record.city}, ${record.country} from history`}
                  title="Delete record"
                  className="p-1.5 rounded hover:bg-red-50 transition-colors group"
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-gray-500 group-hover:text-red-500 transition-colors"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
