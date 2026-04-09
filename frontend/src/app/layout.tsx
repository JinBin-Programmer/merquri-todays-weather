import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Today's Weather",
  description: "Search current weather conditions by city and country",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">{children}</body>
    </html>
  );
}
