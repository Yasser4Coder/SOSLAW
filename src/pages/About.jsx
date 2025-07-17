import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { FiGlobe, FiUsers, FiCheckCircle } from "react-icons/fi";
import aboutlogo from "../assets/soslawLogoHorizontalColor.svg";

const AboutHero = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return (
    <section className="relative w-full bg-gradient-to-br from-[#faf6f0] to-[#e7cfa7]/30 py-16 px-4 md:px-8 flex flex-col items-center text-center">
      <h1
        className="text-4xl md:text-5xl font-extrabold text-[#09142b] mb-4 drop-shadow-lg max-w-6xl mx-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {t("aboutPageTitle")}
      </h1>
      <p
        className="text-[#6b7280] text-lg md:text-xl max-w-3xl mx-auto mb-6"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {t("aboutPageIntro")}
      </p>
      <div className="flex items-center justify-center gap-4 mt-4">
        <FiGlobe className="text-[#c8a45e] text-3xl" aria-hidden="true" />
        <span className="text-[#c8a45e] font-semibold text-lg">SOS Law</span>
      </div>
    </section>
  );
};

const AboutMission = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return (
    <section className="w-full bg-white py-12 px-4 md:px-8 border-t border-[#e7cfa7]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div
          className={`flex-1 text-center md:text-left ${
            isRTL ? "text-right" : "text-left"
          }`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <h2
            className={`text-2xl md:text-3xl font-bold ${
              isRTL ? "text-right" : "text-left"
            } text-[#c8a45e] mb-4`}
          >
            <FiCheckCircle className="inline mr-2 text-[#b48b5a]" />
            {t("aboutPageGoalTitle", "Our Mission")}
          </h2>
          <p
            className={`text-[#09142b] text-base md:text-lg ${
              isRTL ? "text-right" : "text-left"
            } opacity-90`}
          >
            {t("aboutPageGoal")}
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src={aboutlogo}
            alt="SOS Law Digital Platform"
            className="w-[420px] h-[420px] max-w-full object-contain drop-shadow-2xl px-8 rounded-2xl bg-[#faf6f0] border border-[#e7cfa7]"
            loading="lazy"
            draggable="false"
          />
        </div>
      </div>
    </section>
  );
};

const AboutFeatures = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const features = [
    {
      icon: <FiUsers className="text-2xl text-[#b48b5a]" aria-hidden="true" />,
      title: t("aboutFeature1", "For Everyone"),
      desc: t(
        "aboutFeature1Desc",
        "Accessible to individuals and companies, regardless of their legal needs."
      ),
    },
    {
      icon: (
        <FiCheckCircle className="text-2xl text-[#b48b5a]" aria-hidden="true" />
      ),
      title: t("aboutFeature2", "Comprehensive Legal Fields"),
      desc: t(
        "aboutFeature2Desc",
        "Covers criminal, civil, commercial, labor, real estate law, and more."
      ),
    },
    {
      icon: <FiGlobe className="text-2xl text-[#b48b5a]" aria-hidden="true" />,
      title: t("aboutFeature3", "Modern & Digital"),
      desc: t(
        "aboutFeature3Desc",
        "Utilizes the latest technology for easy, flexible, and secure access."
      ),
    },
  ];
  return (
    <section className="w-full bg-[#faf6f0] py-12 px-4 md:px-8 border-t border-[#e7cfa7]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-white rounded-2xl shadow-md border border-[#e7cfa7] p-8 transition-transform duration-200 hover:scale-105 hover:shadow-lg"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="mb-4">{f.icon}</div>
            <h3 className="text-lg font-bold text-[#c8a45e] mb-2">{f.title}</h3>
            <p className="text-[#09142b] text-sm opacity-80">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const About = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const title = t("aboutSeoTitle", "About SOSLAW | للاستشارة القانونية");
  const desc = t(
    "aboutSeoDesc",
    "تعرف على منصة SOSLAW - خدمات استشارية قانونية رقمية، فريق من الخبراء، وميزات حديثة لجميع الفئات."
  );
  const url = "https://soslaw.com/about";
  const image = "/logo.svg";
  return (
    <main className="">
      <Helmet>
        <html lang={lang} />
        <title>{title}</title>
        <meta name="description" content={desc} />
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
      </Helmet>
      <AboutHero />
      <AboutMission />
      <AboutFeatures />
    </main>
  );
};

export default About;
