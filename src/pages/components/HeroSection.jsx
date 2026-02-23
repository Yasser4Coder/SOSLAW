import bg from "../../assets/bgs/bg.webp";
import bg2 from "../../assets/bgs/bg1.webp";
import bg3 from "../../assets/bgs/heroBG1.webp";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
// import heroLawyerImg from "../../assets/heroLawyer1.webp";
import logoBlueBg from "../../assets/logoBlueBg.svg";

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
  const { scrollToSection } = useSmoothScroll();
  const lang = i18n.language || "en";
  const isRTL = lang === "ar";
  const contentRef = useRef(null);
  const imageFadeRef = useRef(null);

  // Automatic background slider
  const backgrounds = [
    { img: bg, dots: ["#b48b5a", "white", "white"] },
    { img: bg2, dots: ["white", "#b48b5a", "white"] },
    { img: bg3, dots: ["white", "white", "#b48b5a"] },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide with interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

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
    <section className="relative w-full min-h-[calc(100vh-40px)] flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      {backgrounds.map((bgItem, index) => (
        <img
          key={index}
          src={bgItem.img}
          alt={t("heroBGAlt") || "Justice background"}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          } ${isRTL ? "scale-x-[-1]" : "scale-x-100"}`}
          draggable="false"
        />
      ))}

      <div className="absolute inset-0 bg-black/60 z-0" aria-hidden="true" />
      
      {/* Container for content */}
      <div className="relative w-full max-w-[1600px] mx-auto h-full px-4 md:px-8 flex flex-col justify-center">
        <div
          className={`flex flex-col md:flex-row ${
            lang === "ar" ? "md:flex-row-reverse" : "md:flex-row"
          } justify-center gap-8 items-center h-full w-full`}
          style={{ height: "100%" }}
        >
          {/* Main Content */}
          <div
            ref={contentRef}
            className={`flex flex-col justify-center items-center text-center w-full md:w-auto h-full ${
              isRTL ? "md:order-2" : "md:order-1"
            } opacity-0 translate-y-8 transition-all duration-1000`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Logo */}
            <img
              src={logoBlueBg}
              alt="SOS Law Logo"
              className="w-48 md:w-64 lg:w-80 mb-6 md:mb-8 h-auto object-contain drop-shadow-lg"
              draggable="false"
            />
            {/* Main Title */}
            <h1
              className={`font-serif text-white font-extrabold mb-4 md:mb-6 leading-tight drop-shadow-lg ${
                isRTL
                  ? "text-2xl md:text-6xl lg:text-7xl"
                  : "text-xl md:text-4xl lg:text-5xl"
              }`}
            >
              {t("heroTitle")}
            </h1>
            {/* Description */}
            <p
              className={`text-white mb-8 max-w-xl drop-shadow-md ${
                isRTL
                  ? "text-xs md:text-lg lg:text-xl"
                  : "text-xs md:text-base lg:text-lg"
              }`}
            >
              {t("heroDesc1")}
              <br />
              {t("heroDesc2")}
            </p>
            {/* CTA Buttons */}
            <div className="flex gap-4 mb-8 justify-center">
              <Link
                to="/contact"
                className={`px-6 py-2 md:px-8 md:py-3 bg-[#b48b5a] text-white font-bold rounded shadow-lg hover:bg-[#a07a4a] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b48b5a] cursor-pointer ${
                  isRTL ? "text-sm md:text-lg" : "text-base md:text-lg"
                }`}
                aria-label={t("heroRequestNow")}
              >
                {t("heroRequestNow")}
              </Link>
              <button
                onClick={() => scrollToSection("services")}
                className={`px-6 py-2 md:px-8 md:py-3 bg-white/20 text-white font-semibold rounded border border-white/40 hover:bg-white/30 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b48b5a] cursor-pointer backdrop-blur-sm ${
                  isRTL ? "text-sm md:text-lg" : "text-base md:text-lg"
                }`}
                aria-label={t("learnMore") || "Learn More"}
              >
                {t("learnMore") || "Learn More"}
              </button>
            </div>
            {/* Slider Dots (clickable) */}
            <div className="flex items-center gap-3 mt-2 md:mt-4">
              {backgrounds.map((bgItem, idx) => (
                <span
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`cursor-pointer ${
                    idx === 0
                      ? "w-3 h-3 md:w-4 md:h-4 rotate-45"
                      : "w-2 h-2 md:w-3 md:h-3 rounded-full"
                  } inline-block transition-all duration-300`}
                  style={{
                    backgroundColor: bgItem.dots[idx] || "#fff",
                    opacity: idx === currentSlide ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-16 md:h-24 lg:h-32"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C360,20 720,100 1080,40 C1260,10 1380,30 1440,50 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
