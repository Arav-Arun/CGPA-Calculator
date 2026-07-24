import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Plain static SPA — builds to /dist, deploys as-is on Vercel.
export default defineConfig({
  plugins: [react()],
});
