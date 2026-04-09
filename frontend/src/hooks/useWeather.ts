"use client";

import { useState, useCallback, useEffect } from "react";
import type { WeatherData, HistoryRecord, SearchStatus } from "@/types/weather";

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  // Tracks which popular city card is currently loading (format: "City-COUNTRY")
  const [loadingCity, setLoadingCity] = useState<string | null>(null);

  /** Reload the search history list from the backend */
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        setHistory(await res.json());
      }
    } catch {
      // History is non-critical; silently ignore network errors
    }
  }, []);

  // Populate history on first render
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  /** Search weather for the given city and country */
  const search = useCallback(
    async (searchCity: string, searchCountry: string, fromCard = false) => {
      if (!searchCity.trim()) return;

      setStatus("loading");
      if (fromCard) setLoadingCity(`${searchCity}-${searchCountry}`);

      try {
        const params = new URLSearchParams({
          city: searchCity.trim(),
          country: searchCountry.trim(),
        });

        const [weatherRes, forecastRes] = await Promise.all([
          fetch(`/api/weather?${params.toString()}`),
          fetch(`/api/forecast?${params.toString()}`),
        ]);

        if (weatherRes.status === 404 || forecastRes.status === 404) {
          setWeather(null);
          setStatus("not_found");
          return;
        }

        if (weatherRes.status === 502 || forecastRes.status === 502) {
          setWeather(null);
          setStatus("api_key_error");
          return;
        }

        if (!weatherRes.ok || !forecastRes.ok) {
          throw new Error(`Unexpected API status: ${weatherRes.status}/${forecastRes.status}`);
        }

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        const data: WeatherData = {
          ...weatherData,
          forecast: forecastData.forecast ?? [],
        };

        setWeather(data);
        setStatus("success");

        // Refresh history so the new record appears immediately
        await fetchHistory();
      } catch {
        setStatus("error");
      } finally {
        setLoadingCity(null);
      }
    },
    [fetchHistory]
  );

  /** Remove a single record from history (optimistic update) */
  const deleteHistory = useCallback(async (id: string) => {
    // Optimistically remove from UI first for snappy feedback
    setHistory((prev) => prev.filter((r) => r.id !== id));

    try {
      await fetch(`/api/history/${id}`, { method: "DELETE" });
    } catch {
      // If deletion fails, re-fetch to restore accurate state
      fetchHistory();
    }
  }, [fetchHistory]);

  /** Clear search inputs and reset the weather display area */
  const clear = useCallback(() => {
    setCity("");
    setCountry("");
    setWeather(null);
    setStatus("idle");
  }, []);

  return {
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
  };
}