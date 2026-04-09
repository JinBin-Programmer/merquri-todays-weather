/** Country list used for the search-form combobox */
export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2
}

export const COUNTRIES: Country[] = [
  { name: "Afghanistan", code: "AF" },
  { name: "Argentina", code: "AR" },
  { name: "Australia", code: "AU" },
  { name: "Austria", code: "AT" },
  { name: "Bangladesh", code: "BD" },
  { name: "Belgium", code: "BE" },
  { name: "Brazil", code: "BR" },
  { name: "Canada", code: "CA" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Colombia", code: "CO" },
  { name: "Croatia", code: "HR" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Denmark", code: "DK" },
  { name: "Egypt", code: "EG" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "Germany", code: "DE" },
  { name: "Greece", code: "GR" },
  { name: "Hong Kong", code: "HK" },
  { name: "Hungary", code: "HU" },
  { name: "India", code: "IN" },
  { name: "Indonesia", code: "ID" },
  { name: "Ireland", code: "IE" },
  { name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },
  { name: "Japan", code: "JP" },
  { name: "Jordan", code: "JO" },
  { name: "Kenya", code: "KE" },
  { name: "Malaysia", code: "MY" },
  { name: "Maldives", code: "MV" },
  { name: "Mexico", code: "MX" },
  { name: "Morocco", code: "MA" },
  { name: "Myanmar", code: "MM" },
  { name: "Nepal", code: "NP" },
  { name: "Netherlands", code: "NL" },
  { name: "New Zealand", code: "NZ" },
  { name: "Nigeria", code: "NG" },
  { name: "Norway", code: "NO" },
  { name: "Pakistan", code: "PK" },
  { name: "Peru", code: "PE" },
  { name: "Philippines", code: "PH" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Qatar", code: "QA" },
  { name: "Romania", code: "RO" },
  { name: "Russia", code: "RU" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Singapore", code: "SG" },
  { name: "South Africa", code: "ZA" },
  { name: "South Korea", code: "KR" },
  { name: "Spain", code: "ES" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Taiwan", code: "TW" },
  { name: "Thailand", code: "TH" },
  { name: "Turkey", code: "TR" },
  { name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },
  { name: "Vietnam", code: "VN" },
];

/** Lookup: country code → full name */
export const COUNTRY_NAME: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c.name])
);

/**
 * Popular city suggestions per country code.
 * Used to populate the city datalist after a country is selected.
 */
export const CITY_SUGGESTIONS: Record<string, string[]> = {
  AE: ["Dubai", "Abu Dhabi", "Sharjah"],
  AR: ["Buenos Aires", "Córdoba", "Mendoza"],
  AU: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  AT: ["Vienna", "Salzburg", "Graz"],
  BD: ["Dhaka", "Chittagong"],
  BE: ["Brussels", "Antwerp", "Ghent"],
  BR: ["São Paulo", "Rio de Janeiro", "Brasília", "Fortaleza"],
  CA: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  CH: ["Zurich", "Geneva", "Basel", "Bern"],
  CL: ["Santiago", "Valparaíso"],
  CN: ["Beijing", "Shanghai", "Guangzhou", "Chengdu", "Xi'an"],
  CO: ["Bogotá", "Medellín", "Cartagena"],
  DE: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  DK: ["Copenhagen", "Aarhus"],
  EG: ["Cairo", "Alexandria", "Luxor", "Hurghada"],
  ES: ["Madrid", "Barcelona", "Seville", "Valencia", "Málaga"],
  FI: ["Helsinki", "Tampere"],
  FR: ["Paris", "Lyon", "Marseille", "Nice", "Bordeaux"],
  GB: ["London", "Manchester", "Edinburgh", "Birmingham", "Liverpool"],
  GR: ["Athens", "Thessaloniki", "Santorini", "Heraklion"],
  HK: ["Hong Kong"],
  HR: ["Zagreb", "Dubrovnik", "Split"],
  HU: ["Budapest", "Debrecen"],
  ID: ["Jakarta", "Bali", "Surabaya", "Yogyakarta", "Bandung"],
  IE: ["Dublin", "Cork", "Galway"],
  IL: ["Tel Aviv", "Jerusalem", "Haifa"],
  IN: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad"],
  IT: ["Rome", "Milan", "Florence", "Venice", "Naples", "Turin"],
  JP: ["Tokyo", "Osaka", "Kyoto", "Hiroshima", "Sapporo", "Fukuoka"],
  JO: ["Amman", "Aqaba"],
  KE: ["Nairobi", "Mombasa"],
  KR: ["Seoul", "Busan", "Incheon", "Jeju"],
  LK: ["Colombo", "Kandy"],
  MA: ["Marrakech", "Casablanca", "Fez", "Rabat"],
  MV: ["Malé"],
  MX: ["Mexico City", "Cancún", "Guadalajara", "Monterrey"],
  MY: ["Kuala Lumpur", "Penang", "Johor Bahru", "Kota Kinabalu", "Malacca"],
  MM: ["Yangon", "Mandalay"],
  NL: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"],
  NO: ["Oslo", "Bergen", "Tromsø"],
  NP: ["Kathmandu", "Pokhara"],
  NZ: ["Auckland", "Wellington", "Christchurch", "Queenstown"],
  NG: ["Lagos", "Abuja"],
  PE: ["Lima", "Cusco", "Arequipa"],
  PH: ["Manila", "Cebu", "Davao", "Boracay"],
  PK: ["Karachi", "Lahore", "Islamabad"],
  PL: ["Warsaw", "Kraków", "Gdańsk"],
  PT: ["Lisbon", "Porto", "Faro"],
  QA: ["Doha"],
  RO: ["Bucharest", "Cluj-Napoca"],
  RU: ["Moscow", "Saint Petersburg", "Novosibirsk"],
  SA: ["Riyadh", "Jeddah", "Mecca", "Medina"],
  SE: ["Stockholm", "Gothenburg", "Malmö"],
  SG: ["Singapore"],
  TH: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Krabi"],
  TR: ["Istanbul", "Ankara", "Antalya", "Izmir"],
  TW: ["Taipei", "Kaohsiung", "Taichung"],
  UA: ["Kyiv", "Lviv", "Odessa"],
  US: ["New York", "Los Angeles", "Chicago", "Houston", "Miami", "Las Vegas", "San Francisco", "Seattle"],
  VN: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hội An"],
  ZA: ["Cape Town", "Johannesburg", "Durban"],
};

/**
 * Try to resolve a country code from user input.
 * Accepts:
 *  - A 2-letter code directly (e.g. "MY")
 *  - A full country name (e.g. "Malaysia")
 *  - A combined string produced by the datalist option (e.g. "Malaysia (MY)")
 * Returns the 2-letter ISO code, or the original string if not recognised.
 */
export function resolveCountryCode(input: string): string {
  const trimmed = input.trim();

  // "Malaysia (MY)" → "MY"
  const parenMatch = trimmed.match(/\(([A-Z]{2})\)\s*$/);
  if (parenMatch) return parenMatch[1];

  // Direct 2-letter code "MY"
  if (/^[A-Z]{2}$/i.test(trimmed)) return trimmed.toUpperCase();

  // Full country name "Malaysia"
  const found = COUNTRIES.find(
    (c) => c.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (found) return found.code;

  return trimmed; // return as-is; OWM will attempt to resolve it
}
