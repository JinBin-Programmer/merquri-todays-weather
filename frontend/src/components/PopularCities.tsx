"use client";

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
    city: "Singapore",
    country: "SG",
    landmark: "Marina Bay Sands",
    flag: "🇸🇬",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=250&fit=crop&q=80",
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
  const handleClick = (city: City) => {
    setCity(city.city);
    setCountry(city.country);
    onSearch(city.city, city.country);
  };

  return (
    <section className="mb-6" aria-label="Popular cities">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Popular Cities
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {POPULAR_CITIES.map((city) => {
          const isLoading = loadingCity === `${city.city}-${city.country}`;

          return (
            <button
              key={`${city.city}-${city.country}`}
              onClick={() => handleClick(city)}
              disabled={loadingCity !== null}
              aria-label={`Search weather for ${city.city}, ${city.country}`}
              className="relative overflow-hidden rounded-xl h-28 sm:h-32 group
                         focus:outline-none focus:ring-2 focus:ring-blue-400
                         disabled:cursor-wait transition-transform duration-200
                         hover:scale-[1.03] active:scale-[0.98]"
            >
              {/* Landmark image */}
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
                  <span className="text-base leading-none">{city.flag}</span>
                  <span className="text-white font-semibold text-sm leading-tight drop-shadow">
                    {city.city}
                  </span>
                </div>
                <p className="text-gray-300 text-xs mt-0.5 leading-tight">{city.landmark}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
