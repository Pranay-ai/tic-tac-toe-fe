import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      __APP_BACKEND_WS_URL__: JSON.stringify(
        env.VITE_BACKEND_WS_URL || "wss://tic-tac-toe-server-5jbq.onrender.com/ws"
      ),
    },
  };
});
