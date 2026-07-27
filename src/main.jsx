import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.VITE_BASE_URL || "/"}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
