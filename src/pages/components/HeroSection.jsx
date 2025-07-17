import bg from "../../assets/bgs/heroBG1.webp";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import heroLawyerImg from "../../assets/heroLawyer1.webp";

const JusticeIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2V4M12 4C13.1046 4 14 4.89543 14 6C14 7.10457 13.1046 8 12 8C10.8954 8 10 7.10457 10 6C10 4.89543 10.8954 4 12 4ZM12 8V20M12 20H7M12 20H17M7 20C7 20 5 13 5 10M17 20C17 20 19 13 19 10M5 10H19M5 10C5 10 3 10 3 12C3 14 5 14 5 14C5 14 7 14 7 12C7 10 5 10 5 10ZM19 10C19 10 21 10 21 12C21 14 19 14 19 14C19 14 17 14 17 12C17 10 19 10 19 10Z"
      stroke="#b48b5a"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const isRTL = lang === "ar";
  const contentRef = useRef(null);
  const imageFadeRef = useRef(null);

  // Fade-in animation on mount
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.remove("opacity-0", "translate-y-8");
      void contentRef.current.offsetWidth;
      contentRef.current.classList.add("opacity-100", "translate-y-0");
    }
    if (imageFadeRef.current) {
      imageFadeRef.current.classList.remove("opacity-0", "translate-y-8");
      void imageFadeRef.current.offsetWidth;
      imageFadeRef.current.classList.add("opacity-100", "translate-y-0");
    }
  }, [lang]);

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] flex items-start md:items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <img
        src={bg}
        alt={t("heroBGAlt") || "Justice background"}
        className={`absolute inset-0 w-full h-full object-cover z-0 ${
          isRTL ? "scale-x-[-1]" : "scale-x-100"
        }`}
        draggable="false"
      />
      <div className="absolute inset-0 bg-black/60 z-0" aria-hidden="true" />
      {/* Container for content and testimonial */}
      <div className="relative w-full max-w-[1600px] mx-auto h-full px-4 md:px-8 flex flex-col justify-center">
        <div
          className={`flex flex-col md:flex-row ${
            lang === "ar" ? "md:flex-row-reverse" : "md:flex-row"
          } justify-between gap-8 items-center h-full w-full`}
          style={{ height: "100%" }}
        >
          {/* Testimonial Card (desktop & mobile) - always first in RTL */}
          <div
            ref={imageFadeRef}
            className={`flex flex-col justify-center w-full md:w-auto h-full ${
              isRTL ? "md:order-1" : "md:order-2"
            } items-center mt-8 md:mt-0 opacity-0 translate-y-8 transition-all duration-1000`}
          >
            {/* Hero Lawyer Image */}
            <img
              src={heroLawyerImg}
              alt={t("lawyerAlt") || "Lawyer"}
              className={`w-full max-w-xs md:max-w-md lg:max-w-lg h-auto object-contain drop-shadow-xl pointer-events-none ${
                lang === "ar" ? "" : "scale-x-[-1]"
              }`}
              draggable="false"
            />
          </div>
          {/* Main Content - always second in RTL */}
          <div
            ref={contentRef}
            className={`flex flex-col justify-center w-full md:w-auto h-full ${
              isRTL ? "md:order-2" : "md:order-1"
            } opacity-0 translate-y-8 transition-all duration-1000`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Icon + Subtitle */}
            <div
              className={`flex items-center mb-4 md:mb-6 gap-2 ${
                isRTL ? "text-lg md:text-xl" : ""
              }`}
            >
              <JusticeIcon className="w-6 h-6 text-[#b48b5a]" />
              <h2
                className={`uppercase tracking-widest text-[#b48b5a] text-base md:text-lg font-semibold ${
                  isRTL ? "text-xl md:text-2xl" : ""
                }`}
              >
                {t("heroSubtitle")}
              </h2>
            </div>
            {/* Main Title */}
            <h1
              className={`font-serif text-white font-extrabold mb-4 md:mb-6 leading-tight drop-shadow-lg ${
                isRTL
                  ? "text-3xl md:text-5xl lg:text-6xl"
                  : "text-3xl md:text-5xl lg:text-6xl"
              }`}
            >
              {t("heroTitle")}
            </h1>
            {/* Description */}
            <p
              className={`text-white mb-8 max-w-xl drop-shadow-md ${
                isRTL
                  ? "text-base md:text-lg lg:text-xl"
                  : "text-sm md:text-base lg:text-lg"
              }`}
            >
              {t("heroDesc1")}
              <br />
              {t("heroDesc2")}
            </p>
            {/* CTA Buttons */}
            <div className="flex gap-4 mb-8">
              <Link
                to="/contact"
                className="px-8 py-3 bg-[#b48b5a] text-white font-bold rounded shadow-lg hover:bg-[#a07a4a] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b48b5a] text-lg cursor-pointer"
                aria-label={t("heroRequestNow")}
              >
                {t("heroRequestNow")}
              </Link>
              <a
                href="#services"
                className="px-8 py-3 bg-white/20 text-white font-semibold rounded border border-white/40 hover:bg-white/30 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b48b5a] text-lg cursor-pointer backdrop-blur-sm"
                aria-label={t("learnMore") || "Learn More"}
              >
                {t("learnMore") || "Learn More"}
              </a>
            </div>
            {/* Slider Dots */}
            <div className="flex items-center gap-3 mt-2 md:mt-4">
              <span className="w-3 h-3 md:w-4 md:h-4 bg-[#b48b5a] rotate-45 inline-block" />
              <span className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full inline-block" />
              <span className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full inline-block opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
