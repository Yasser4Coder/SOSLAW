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
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/src/locales/{{lng}}/translation.json",
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

// Set RTL/LTR direction on initial load
if (typeof window !== "undefined") {
  const lang =
    i18n.language ||
    (typeof navigator !== "undefined" ? navigator.language : "en");
  document.documentElement.lang = lang;
  if (lang.startsWith("ar")) {
    document.documentElement.dir = "rtl";
  } else {
    document.documentElement.dir = "ltr";
  }
}

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  if (lng.startsWith("ar")) {
    document.documentElement.dir = "rtl";
  } else {
    document.documentElement.dir = "ltr";
  }
});

export default i18n;
