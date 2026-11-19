import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dev server runs on port 5173. Any request to /api is passed on to the
// task board API on port 4000, so the page can call "/api/board" as if the
// API lived on the same server.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
