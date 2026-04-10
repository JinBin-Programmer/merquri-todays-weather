"use client";

import { useState, useCallback, useEffect } from "react";
import type { WeatherData, HistoryRecord, SearchStatus } from "@/types/weather";

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");         // ISO code, e.g. "MY"
  const [travelFrom, setTravelFrom] = useState("");   // ISO date, e.g. "2024-05-10"
  const [travelTo, setTravelTo] = useState("");       // ISO date, e.g. "2024-05-15"
  const [forecastCapped, setForecastCapped] = useState(false);
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

  /**
   * Search weather for the given city and country.
   *
   * @param fromCard      true when triggered by a popular-city card (shows card spinner)
   * @param saveToHistory true only when the user explicitly clicked the Search button
   */
  const search = useCallback(
    async (
      searchCity: string,
      searchCountry: string,
      fromCard = false,
      saveToHistory = false
    ) => {
      if (!searchCity.trim()) return;

      setStatus("loading");
      setForecastCapped(false);
      if (fromCard) setLoadingCity(`${searchCity}-${searchCountry}`);

      try {
        // Weather params (includes save flag + travel dates only when saving)
        const weatherParams = new URLSearchParams({
          city: searchCity.trim(),
          country: searchCountry.trim(),
          save: saveToHistory ? "true" : "false",
          ...(saveToHistory && travelFrom ? { travel_from: travelFrom } : {}),
          ...(saveToHistory && travelTo   ? { travel_to: travelTo }   : {}),
        });

        // Forecast params — travel dates always sent so extended range works
        const forecastParams = new URLSearchParams({
          city: searchCity.trim(),
          country: searchCountry.trim(),
          ...(travelFrom ? { travel_from: travelFrom } : {}),
          ...(travelTo   ? { travel_to: travelTo }   : {}),
        });

        const [weatherRes, forecastRes] = await Promise.all([
          fetch(`/api/weather?${weatherParams.toString()}`),
          fetch(`/api/forecast?${forecastParams.toString()}`),
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

        if (forecastData.capped) {
          setForecastCapped(true);
        }

        const data: WeatherData = {
          ...weatherData,
          forecast: forecastData.forecast ?? [],
        };

        setWeather(data);
        setStatus("success");

        // Only refresh history when a record was actually saved
        if (saveToHistory) {
          await fetchHistory();
        }
      } catch {
        setStatus("error");
      } finally {
        setLoadingCity(null);
      }
    },
    [fetchHistory, travelFrom, travelTo]
  );

  /** Remove a single record from history (optimistic update) */
  const deleteHistory = useCallback(
    async (id: string) => {
      setHistory((prev) => prev.filter((r) => r.id !== id));
      try {
        await fetch(`/api/history/${id}`, { method: "DELETE" });
      } catch {
        fetchHistory();
      }
    },
    [fetchHistory]
  );

  /** Clear search inputs and reset the weather display area */
  const clear = useCallback(() => {
    setCity("");
    setCountry("");
    setTravelFrom("");
    setTravelTo("");
    setWeather(null);
    setStatus("idle");
    setForecastCapped(false);
  }, []);

  return {
    weather,
    history,
    status,
    loadingCity,
    forecastCapped,
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
  };
}
