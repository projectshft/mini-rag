import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/ask": ["./data/**/*"],
  },
};

export default nextConfig;
