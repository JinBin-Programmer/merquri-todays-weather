import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Today's Weather | Free Real-Time Weather Forecast",
    template: "%s | Today's Weather",
  },
  description:
    "Get accurate real-time weather forecasts, air quality index, and 5-day weather predictions for any city worldwide. Free, fast, and reliable.",
  keywords: [
    "weather forecast",
    "today weather",
    "temperature",
    "humidity",
    "rain forecast",
    "air quality index",
    "AQI",
    "travel weather",
    "Malaysia weather",
    "Singapore weather",
  ],
  authors: [{ name: "Today's Weather" }],
  metadataBase: new URL("https://www.weather-jinbin.site"),
  openGraph: {
    title: "Today's Weather | Free Real-Time Weather Forecast",
    description: "Real-time weather forecasts and air quality index for any city worldwide.",
    type: "website",
    locale: "en_MY",
    url: "https://www.weather-jinbin.site",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-animated flex flex-col">
        {/* ── Google AdSense – replace PUBLISHER_ID after approval ── */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7019273666606982"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* ── Sticky navbar ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/60 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-gray-800 hover:text-sky-600 transition-colors"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sm shadow-sky-200">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </span>
              <span className="text-base">Today&apos;s Weather</span>
            </Link>

            <div className="flex items-center gap-0.5">
              <Link href="/"
                className="text-sm font-medium text-gray-600 hover:text-sky-600 px-3 py-1.5 rounded-lg hover:bg-sky-50 transition-colors">
                Home
              </Link>
              <Link href="/about"
                className="text-sm font-medium text-gray-600 hover:text-sky-600 px-3 py-1.5 rounded-lg hover:bg-sky-50 transition-colors">
                About
              </Link>
              <Link href="/privacy-policy"
                className="text-sm font-medium text-gray-600 hover:text-sky-600 px-3 py-1.5 rounded-lg hover:bg-sky-50 transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Main content (offset for fixed navbar) ── */}
        <div className="pt-14 flex-1">
          {children}
        </div>

        {/* ── Footer ── */}
        <footer className="relative z-10 bg-gray-900/80 backdrop-blur-sm border-t border-white/10 text-white/60 py-8 mt-auto">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </span>
                Today&apos;s Weather
              </div>

              <p className="text-xs text-center">
                Weather data by <span className="text-sky-400">OpenWeatherMap</span> &amp; <span className="text-sky-400">Open-Meteo</span>. For informational use only.
              </p>

              <div className="flex gap-4 text-xs">
                <Link href="/about" className="hover:text-white transition-colors">About</Link>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
            <p className="text-center text-xs text-white/30 mt-5">
              © {new Date().getFullYear()} Today&apos;s Weather · All rights reserved
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
