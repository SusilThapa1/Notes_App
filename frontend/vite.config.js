import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Allows access all the network
    port: 5173, // Default Vite port (change if needed)
    // allowedHosts: ["f645-103-225-244-41.ngrok-free.app"],
  },
});
