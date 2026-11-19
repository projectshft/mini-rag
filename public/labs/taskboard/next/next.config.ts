import type { NextConfig } from "next";

// Where the task board API lives. The server reads it from the environment,
// and falls back to the API running on your machine.
const api = process.env.TASKBOARD_API_URL ?? "http://localhost:4000/api";

const nextConfig: NextConfig = {
  // The browser calls /api/... on this Next.js server, and Next.js passes the
  // request on to the task board API. So code in the browser never needs to
  // know where the API really lives.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${api}/:path*` }];
  },
};

export default nextConfig;
