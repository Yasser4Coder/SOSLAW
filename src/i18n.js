import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// i18next will load translations from /src/locales/{lng}/translation.json

i18n
  .use(LanguageDetector)
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

// Set RTL/LTR direction on initial load
if (typeof window !== "undefined") {
  const lang = i18n.language || "ar";
  const isRTL = lang === "ar";

  document.documentElement.lang = lang;
  document.documentElement.dir = isRTL ? "rtl" : "ltr";

  // Also set body attributes
  document.body.lang = lang;
  document.body.dir = isRTL ? "rtl" : "ltr";
}

i18n.on("languageChanged", (lng) => {
  const isRTL = lng === "ar";

  document.documentElement.lang = lng;
  document.documentElement.dir = isRTL ? "rtl" : "ltr";

  document.body.lang = lng;
  document.body.dir = isRTL ? "rtl" : "ltr";
});

export default i18n;
