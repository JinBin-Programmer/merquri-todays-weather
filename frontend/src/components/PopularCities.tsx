"use client";

import { useRef } from "react";
import { COUNTRY_NAME } from "@/data/locations";

interface City {
  city: string;
  country: string;
  landmark: string;
  flag: string;
  image: string;
}

const POPULAR_CITIES: City[] = [
  {
    city: "Tokyo",
    country: "JP",
    landmark: "Shibuya Crossing",
    flag: "🇯🇵",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "Paris",
    country: "FR",
    landmark: "Eiffel Tower",
    flag: "🇫🇷",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "New York",
    country: "US",
    landmark: "Times Square",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1546436836-07a91091f160?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "Singapore",
    country: "SG",
    landmark: "Marina Bay Sands",
    flag: "🇸🇬",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "London",
    country: "GB",
    landmark: "Big Ben",
    flag: "🇬🇧",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "Dubai",
    country: "AE",
    landmark: "Burj Khalifa",
    flag: "🇦🇪",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop&q=80",
  },

  {
    city: "Sydney",
    country: "AU",
    landmark: "Opera House",
    flag: "🇦🇺",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "Rome",
    country: "IT",
    landmark: "Colosseum",
    flag: "🇮🇹",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "Bangkok",
    country: "TH",
    landmark: "Grand Palace",
    flag: "🇹🇭",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "Seoul",
    country: "KR",
    landmark: "Gyeongbokgung",
    flag: "🇰🇷",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "Amsterdam",
    country: "NL",
    landmark: "Canal Houses",
    flag: "🇳🇱",
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "Barcelona",
    country: "ES",
    landmark: "Sagrada Família",
    flag: "🇪🇸",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "Istanbul",
    country: "TR",
    landmark: "Hagia Sophia",
    flag: "🇹🇷",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "Kuala Lumpur",
    country: "MY",
    landmark: "Petronas Towers",
    flag: "🇲🇾",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "Cape Town",
    country: "ZA",
    landmark: "Table Mountain",
    flag: "🇿🇦",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=250&fit=crop&q=80",
  },
  {
    city: "Bali",
    country: "ID",
    landmark: "Tanah Lot",
    flag: "🇮🇩",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=250&fit=crop&q=80",
  },
];

interface PopularCitiesProps {
  onSearch: (city: string, country: string) => void;
  setCity: (city: string) => void;
  setCountry: (country: string) => void;
  loadingCity: string | null;
}

export default function PopularCities({
  onSearch,
  setCity,
  setCountry,
  loadingCity,
}: PopularCitiesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleClick = (city: City) => {
    setCity(city.city);
    setCountry(city.country);
    onSearch(city.city, city.country);
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 400 : -400, behavior: "smooth" });
  };

  return (
    <section className="mb-6" aria-label="Popular cities">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Popular Cities
        </h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm
                       border border-white/60 text-gray-600 hover:bg-white hover:text-gray-900
                       shadow-sm transition-all duration-150 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm
                       border border-white/60 text-gray-600 hover:bg-white hover:text-gray-900
                       shadow-sm transition-all duration-150 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1"
      >
        {POPULAR_CITIES.map((city) => {
          const isLoading = loadingCity === `${city.city}-${city.country}`;
          const countryName = COUNTRY_NAME[city.country] ?? city.country;

          return (
            <button
              key={`${city.city}-${city.country}`}
              onClick={() => handleClick(city)}
              disabled={loadingCity !== null}
              aria-label={`Search weather for ${city.city}, ${countryName}`}
              className="relative overflow-hidden rounded-xl flex-shrink-0 w-36 h-28 snap-start group
                         focus:outline-none focus:ring-2 focus:ring-blue-400
                         disabled:cursor-wait transition-transform duration-200
                         hover:scale-[1.03] active:scale-[0.98]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={city.image}
                alt={city.landmark}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Loading spinner overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* City info */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-base leading-none text-white">{city.flag}</span>
                  <span className="text-white font-semibold text-sm leading-tight drop-shadow truncate">
                    {city.city}
                  </span>
                </div>
                <p className="text-gray-300 text-xs mt-0.5 leading-tight truncate">{countryName}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
