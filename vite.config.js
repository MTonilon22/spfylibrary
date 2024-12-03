import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Explicitly bind to all interfaces
    port: 5173, // Optional: Ensure the port is the one you expect
    strictPort: true, // Optional: Ensures the server fails if the port is taken
  },
});
