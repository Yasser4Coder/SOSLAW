import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useFontLoader } from "../hooks/useFontLoader";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { useTranslation } from "react-i18next";

function ScrollToHash() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [hash]);
  return null;
}

const MainLayout = ({ children }) => {
  const { i18n } = useTranslation();

  // Ensure font is loaded on all pages
  useFontLoader();

  // Scroll to top on route change
  useScrollToTop();

  // Get current language and RTL status
  const currentLang = i18n.language || "ar";
  const isRTL = currentLang === "ar";

  // Update document attributes when language changes
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.body.lang = currentLang;
    document.body.dir = isRTL ? "rtl" : "ltr";
  }, [currentLang, isRTL]);

  return (
    <div
      className={`font-arabic ${isRTL ? "rtl" : "ltr"}`}
      lang={currentLang}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <ScrollToHash />
      <Header />
      {children}
      <Footer />
      <BackToTop />
    </div>
  );
};

export default MainLayout;
