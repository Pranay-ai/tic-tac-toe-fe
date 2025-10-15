import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GameProvider } from "./context/GameContext.jsx";

createRoot(document.getElementById("root")).render(
  <GameProvider>
    {" "}
    {/* Wrap App with the provider */}
    <App />
  </GameProvider>
);
