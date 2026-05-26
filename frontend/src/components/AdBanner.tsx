"use client";

// AdSense ads disabled until site approval is complete.
// Re-enable by uncommenting the useEffect and the <ins> tag below.

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export default function AdBanner({ className = "" }: AdBannerProps) {
  return <div className={className} />;
}
