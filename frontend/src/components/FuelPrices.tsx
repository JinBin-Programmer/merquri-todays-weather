"use client";

import { useEffect, useState } from "react";

interface FuelData {
  date: string;
  ron95: number;
  ron97: number;
  diesel: number;
  dieselEastMsia: number;
}

const FUEL_CARDS = [
  { key: "ron95",        label: "RON 95",        note: "Subsidised",   color: "from-green-50 to-emerald-50 border-green-100", dot: "bg-green-400" },
  { key: "ron97",        label: "RON 97",        note: "Market price", color: "from-amber-50 to-yellow-50 border-amber-100",  dot: "bg-amber-400" },
  { key: "diesel",       label: "Diesel",        note: "Subsidised",   color: "from-sky-50 to-cyan-50 border-sky-100",        dot: "bg-sky-400"   },
  { key: "dieselEastMsia", label: "Diesel (EM)", note: "East Malaysia", color: "from-blue-50 to-indigo-50 border-blue-100",   dot: "bg-blue-400"  },
] as const;

export default function FuelPrices() {
  const [data, setData] = useState<FuelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/fuel")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: FuelData) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const effectiveDate = data
    ? new Date(data.date).toLocaleDateString("en-MY", { month: "short", year: "numeric" })
    : null;

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-orange-500 text-white shadow-sm text-sm">
            ⛽
          </span>
          <div>
            <h2 className="text-sm font-bold text-gray-800 leading-tight">Harga Minyak</h2>
            <p className="text-[10px] text-gray-400">Malaysia · per litre</p>
          </div>
        </div>
        {effectiveDate && <span className="text-[10px] text-gray-400">Effective {effectiveDate}</span>}
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && <p className="text-xs text-center text-gray-400 py-3">Unable to load fuel prices.</p>}

      {data && !loading && (
        <div className="grid grid-cols-2 gap-2">
          {FUEL_CARDS.map((f) => (
            <div key={f.key}
              className={`rounded-xl bg-gradient-to-br ${f.color} border p-2.5`}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${f.dot}`} />
                <span className="text-[10px] font-semibold text-gray-600">{f.label}</span>
              </div>
              <p className="text-base font-bold text-gray-800">RM {data[f.key].toFixed(2)}</p>
              <p className="text-[10px] text-gray-400">{f.note}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-[9px] text-gray-300 mt-2 text-center">
        Source: <span className="text-sky-400">data.gov.my</span> · updated weekly
      </p>
    </div>
  );
}
