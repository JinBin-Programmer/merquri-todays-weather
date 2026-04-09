import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal standalone server bundle for Docker
  output: "standalone",
};

export default nextConfig;
