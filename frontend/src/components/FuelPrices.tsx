"use client";

import { useEffect, useState } from "react";

interface FuelData {
  date: string;
  ron95Budi: number;
  ron95Skps: number;
  ron95Market: number;
  ron97: number;
  dieselEastMsia: number;
}

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
        <div className="space-y-2">
          {/* RON 95 — all three tiers */}
          <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">RON 95</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <div>
                <p className="text-base font-bold text-gray-800">RM {data.ron95Budi.toFixed(2)}</p>
                <p className="text-[9px] text-emerald-600 font-semibold">BUDI95</p>
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">RM {data.ron95Skps.toFixed(2)}</p>
                <p className="text-[9px] text-sky-600 font-semibold">SKPS</p>
              </div>
              <div>
                <p className="text-base font-bold text-gray-500">RM {data.ron95Market.toFixed(2)}</p>
                <p className="text-[9px] text-gray-400">Market</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* RON 97 */}
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[10px] font-semibold text-gray-600">RON 97</span>
              </div>
              <p className="text-base font-bold text-gray-800">RM {data.ron97.toFixed(2)}</p>
              <p className="text-[10px] text-gray-400">Market price</p>
            </div>

            {/* Diesel East Malaysia */}
            <div className="rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100 p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="text-[10px] font-semibold text-gray-600">Diesel (EM)</span>
              </div>
              <p className="text-base font-bold text-gray-800">RM {data.dieselEastMsia.toFixed(2)}</p>
              <p className="text-[10px] text-gray-400">East Malaysia</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-[9px] text-gray-300 mt-2 text-center">
        Source: <span className="text-sky-400">data.gov.my</span> · updated weekly
      </p>
    </div>
  );
}
