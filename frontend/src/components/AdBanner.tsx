"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

// Replace PUBLISHER_ID below with your ca-pub-7019273666606982 after AdSense approval
const PUBLISHER_ID = "ca-pub-7019273666606982";

export default function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  // During development (no real publisher ID), show a placeholder
  if (PUBLISHER_ID === "ca-pub-7019273666606982") {
    return (
      <div className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm ${className}`}>
        <div className="text-center py-2">
          <p className="font-medium">Ad Space</p>
          <p className="text-xs mt-1">Replace PUBLISHER_ID in AdBanner.tsx after AdSense approval</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
