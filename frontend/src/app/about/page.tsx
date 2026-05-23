import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Today's Weather — a free, fast weather forecast app providing real-time conditions, air quality index, and 5-day forecasts for any city worldwide.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto">

        {/* Hero */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-md shadow-sky-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">About Today&apos;s Weather</h1>
              <p className="text-sm text-gray-400">Free real-time weather for everywhere</p>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Today&apos;s Weather</strong> is a free, fast, and reliable weather application that provides
            real-time weather conditions, air quality index (AQI), and multi-day forecasts for any city in the world.
            Whether you&apos;re planning a trip, heading outdoors, or just curious about the weather across the globe,
            we&apos;ve got you covered.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our app is built with travellers in mind. You can check the weather for your destination city, add travel
            dates to get a trip-specific forecast, and browse your search history to revisit past lookups — all in one
            clean, intuitive interface.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">What We Offer</h2>
          <div className="space-y-4">
            {[
              {
                icon: "🌡️",
                title: "Real-Time Weather",
                desc: "Current temperature, feels-like, min/max, humidity, wind speed, pressure, and visibility — updated every few minutes.",
              },
              {
                icon: "🌿",
                title: "Air Quality Index (AQI)",
                desc: "Know whether the air is Good, Fair, Moderate, Poor, or Very Poor before you step outside.",
              },
              {
                icon: "📅",
                title: "5-Day & Extended Forecast",
                desc: "Plan ahead with a 5-day forecast, or use travel dates to get historical + 16-day extended forecasts for any date range.",
              },
              {
                icon: "🕒",
                title: "Hourly Breakdown",
                desc: "See today's weather hour by hour, including precipitation probability, to pick the best time to go out.",
              },
              {
                icon: "🌍",
                title: "200+ Countries",
                desc: "Search weather for cities across the globe using our curated country and city suggestions.",
              },
              {
                icon: "📋",
                title: "Search History",
                desc: "Your past searches are saved so you can quickly revisit or re-check any city you've looked up.",
              },
            ].map((f) => (
              <div key={f.title} className="flex gap-4">
                <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data sources */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Data Sources</h2>
          <p className="text-sm text-gray-600 mb-4">
            We use trusted, industry-leading weather data providers to ensure accuracy and reliability:
          </p>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-gray-800">OpenWeatherMap</strong> — Current conditions, AQI, and 5-day
                forecast data. One of the world&apos;s leading weather APIs with coverage for over 200,000 cities.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-gray-800">Open-Meteo</strong> — Historical weather archive and extended
                16-day forecasts when travel dates are provided. Free, open-source meteorological API.
              </div>
            </li>
          </ul>
          <p className="text-xs text-gray-400 mt-4">
            All weather information is for informational purposes only. We recommend verifying critical weather
            decisions with official meteorological services.
          </p>
        </div>

        {/* Contact / Disclaimer */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Contact &amp; Feedback</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Have a suggestion, found a bug, or want to provide feedback? We&apos;d love to hear from you.
            Reach us at{" "}
            <a href="mailto:jinbin@ioti.io" className="text-sky-600 hover:underline font-medium">
              jinbin@ioti.io
            </a>.
          </p>
          <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-3 text-sm">
            <Link href="/privacy-policy" className="text-sky-600 hover:underline">Privacy Policy</Link>
            <span className="text-gray-300">·</span>
            <Link href="/terms" className="text-sky-600 hover:underline">Terms of Service</Link>
            <span className="text-gray-300">·</span>
            <Link href="/" className="text-sky-600 hover:underline">Back to Weather</Link>
          </div>
        </div>

      </div>
    </main>
  );
}
