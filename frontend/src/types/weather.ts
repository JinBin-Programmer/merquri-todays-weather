/** A single day in the 5-day forecast view */
export interface ForecastDay {
  date: string;
  condition: string;
  description: string;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind_speed: number;
}

/** Processed weather data returned by the backend after a successful search */
export interface WeatherData {
  city: string;
  country: string;
  condition: string;    // e.g. "Clouds"
  description: string;  // e.g. "scattered clouds"
  temp_min: number;     // Celsius
  temp_max: number;     // Celsius
  temp_current: number; // Celsius
  feels_like: number;   // Celsius
  humidity: number;     // Percentage (0–100)
  pressure: number;     // hPa
  visibility_km: number;
  wind_speed: number;   // m/s
  cloudiness: number;   // Percentage (0–100)
  sunrise: string;      // SGT time, e.g. "06:31 AM"
  sunset: string;       // SGT time, e.g. "06:45 PM"
  time: string;         // SGT datetime, e.g. "2024-03-16 03:15 PM"
  forecast: ForecastDay[];
  history_id: string;   // MongoDB ObjectId as a hex string (empty when save=false)
  searched_at: string;  // SGT datetime string
}

/** A single entry from the search history list */
export interface HistoryRecord {
  id: string;           // MongoDB ObjectId as a hex string
  city: string;
  country: string;
  searched_at: string;  // SGT datetime string
  travel_from?: string; // ISO date string, e.g. "2024-05-10" (optional)
  travel_to?: string;   // ISO date string, e.g. "2024-05-15" (optional)
}

/** Possible UI states for a weather search */
export type SearchStatus = "idle" | "loading" | "success" | "not_found" | "api_key_error" | "error";
