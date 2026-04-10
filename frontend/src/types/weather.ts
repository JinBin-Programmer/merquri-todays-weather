/** A single 3-hour slot in today's hourly forecast */
export interface HourlySlot {
  time: string;       // e.g. "02:00 PM"
  condition: string;
  description: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  pop: number;        // precipitation probability 0–100 %
}

/** A single day in the forecast/history view */
export interface ForecastDay {
  date: string;       // display string, e.g. "Mon, Apr 10"
  iso_date: string;   // YYYY-MM-DD — used for travel-date filtering
  condition: string;
  description: string;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind_speed: number;
  data_type?: "historical" | "forecast"; // set when using Open-Meteo extended range
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
  aqi?: number;         // Air Quality Index 1–5
  aqi_label?: string;   // "Good" | "Fair" | "Moderate" | "Poor" | "Very Poor"
  forecast: ForecastDay[];
  hourly: HourlySlot[]; // Today's 3-hour forecast slots
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
