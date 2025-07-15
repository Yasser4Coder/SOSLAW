import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import "./i18n";

// Set initial dir before React renders
const getInitialLang = () => {
  if (typeof window === "undefined") return "en";
  const lsLang = localStorage.getItem("i18nextLng");
  if (lsLang) return lsLang;
  const htmlLang = document.documentElement.lang;
  if (htmlLang) return htmlLang;
  if (navigator.language) return navigator.language;
  return "en";
};
const initialLang = getInitialLang();
document.documentElement.dir = initialLang.startsWith("ar") ? "rtl" : "ltr";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
