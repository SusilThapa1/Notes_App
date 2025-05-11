import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProgrammesProvider } from "./components/Context/ProgrammeContext.jsx";
import { AuthProvider } from "./components/Context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ProgrammesProvider>
        <App />
      </ProgrammesProvider>
    </AuthProvider>
  </StrictMode>
);
