import React from "react";
import { useTranslation } from "react-i18next";
import SEOHead from "../components/SEOHead";
import {
  FiStar,
  FiCheckCircle,
  FiUsers,
  FiShield,
  FiTarget,
  FiEye,
  FiGlobe,
  FiZap,
  FiTrendingUp,
  FiAward,
  FiHeart,
  FiLock,
} from "react-icons/fi";
import aboutlogo from "../assets/soslawLogoHorizontalColor.svg";

// —— Hero: full-bleed with one bold headline; bg image from public/bgs/65.png ——
const AboutHero = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return (
    <section
      className="relative min-h-[50vh] flex items-center bg-[#09142b] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: "url(/bgs/65.png)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-l from-[#09142b]/85 via-[#09142b]/50 to-[#09142b]/25" />
      <div className="absolute inset-0 bg-[#09142b]/20" />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className={`max-w-2xl ${isRTL ? "mr-0 ml-auto" : "ml-0 mr-auto"} text-white`}>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl mb-4">
            {t(
              "aboutHeroHeadline",
              "شركاؤك القانونيون الموثوقون — مستشارون مكرّسون لاحتياجاتك القانونية"
            )}
          </h1>
          <p className="text-[#e7cfa7] text-base md:text-lg leading-relaxed">
            {t(
              "aboutPageIntro",
              "SOS Law هي مؤسسة قانونية جزائرية ومنصة رقمية مبتكرة، تهدف إلى إحداث ثورة في كيفية الوصول إلى المعلومات والاستشارات القانونية في الجزائر والعالم العربي."
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

// —— Specialization: what the platform focuses on (no emojis) ——
const AboutSpecialization = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const items = [
    t("aboutSpecItem1", "الاستشارات والخدمات القانونية"),
    t("aboutSpecItem2", "مرافقة المشاريع وريادة الأعمال"),
    t("aboutSpecItem3", "التكوين والتدريب الاحترافي"),
    t("aboutSpecItem4", "الموارد التعليمية القانونية"),
  ];
  return (
    <section
      className="w-full bg-[#faf6f0] py-12 md:py-16 px-4 md:px-8 border-y border-[#e7cfa7]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-xl md:text-2xl font-bold text-[#09142b] mb-6 ${isRTL ? "text-right" : "text-left"}`}>
          {t("aboutSpecializationTitle", "منصة متخصصة في:")}
        </h2>
        <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${isRTL ? "text-right" : "text-left"}`}>
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-[#09142b] font-medium shadow-sm"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#c8a45e]" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

// —— Who We Are: large heading + subtitle, then two columns (text + logo) ——
const AboutWhoWeAre = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return (
    <section
      id="who-we-are"
      className="w-full bg-white py-14 md:py-20 px-4 md:px-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        <header className={`mb-12 md:mb-16 ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl font-bold text-[#09142b] md:text-4xl lg:text-5xl mb-3">
            {t("aboutWhoWeAreTitle", "Who We Are")}
          </h2>
          <p className="text-[#4b5563] text-base md:text-lg max-w-2xl">
            {t(
              "aboutWhoWeAreSubtitle",
              "مؤسسة قانونية رقمية توفّر الوصول إلى الاستشارات والخدمات القانونية بثقة وشفافية."
            )}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className={`space-y-6 ${isRTL ? "lg:order-2" : "lg:order-1"}`}>
            <p className="text-[#09142b] text-base md:text-lg leading-relaxed">
              {t(
                "aboutWhoWeAreDesc1",
                "We operate under a dual model that combines physical presence through a licensed legal institution and technical interaction through an integrated digital platform, providing individuals and companies with a modern and secure way to access reliable legal services."
              )}
            </p>
            <p className="text-[#4b5563] text-base md:text-lg leading-relaxed">
              {t(
                "aboutWhoWeAreDesc2",
                "At SOS Law, we believe that legal knowledge is not exclusive to specialists only, but a right for every individual. That's why we've made technology a means to spread awareness, simplify access to lawyers and consultants, and provide fast and modern legal solutions that consider the needs of Algerian society in all its segments."
              )}
            </p>
          </div>
          <div className={`flex justify-center ${isRTL ? "lg:order-1" : "lg:order-2"}`}>
            <div className="rounded-2xl border border-[#e7cfa7] bg-[#fefcf8] p-8 shadow-sm">
              <img
                src={aboutlogo}
                alt="SOS Law"
                className="w-full max-w-sm object-contain"
                loading="lazy"
                draggable="false"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// —— Features: long title + 3-column grid (icon, title, short desc) ——
const AboutDistinctiveFeatures = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const features = [
    { icon: FiZap, text: t("aboutFeature1", "First Algerian legal platform offering fully interactive services") },
    { icon: FiUsers, text: t("aboutFeature2", "Direct connection between client and lawyer via the application") },
    { icon: FiTrendingUp, text: t("aboutFeature3", "Legal consultation available within minutes") },
    { icon: FiEye, text: t("aboutFeature4", "Transparent and announced prices") },
    { icon: FiGlobe, text: t("aboutFeature5", "Professional legal coverage for interior and remote areas") },
    { icon: FiAward, text: t("aboutFeature6", "Special portal for companies and startup owners") },
    { icon: FiStar, text: t("aboutFeature7", "Trilingual content: Arabic, English, French") },
  ];

  return (
    <section
      id="what-distinguishes-us"
      className="w-full bg-[#09142b] py-14 md:py-20 px-4 md:px-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        <header className={`mb-12 md:mb-14 ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl mb-2">
            {t("aboutDistinctiveTitle", "What Distinguishes SOS Law?")}
          </h2>
          <p className="text-[#e7cfa7] text-base md:text-lg max-w-2xl">
            {t("aboutDistinctiveSubtitle", "لماذا يختارنا الأفراد والشركات للاستشارات والخدمات القانونية.")}
          </p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <li key={index}>
                <div
                  className={`rounded-xl border border-[#e7cfa7]/40 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-[#c8a45e]/50 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#c8a45e] text-white mb-4" aria-hidden>
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="text-white font-medium text-sm md:text-base leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

// —— Values: compact grid ——
const AboutValues = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const values = [
    { icon: FiAward, title: t("aboutValue1Title", "Professionalism"), desc: t("aboutValue1Desc", "We commit to the highest standards of legal quality.") },
    { icon: FiZap, title: t("aboutValue2Title", "Innovation"), desc: t("aboutValue2Desc", "We integrate technology in the service of law.") },
    { icon: FiEye, title: t("aboutValue3Title", "Transparency"), desc: t("aboutValue3Desc", "We put the client's interest first and clarify all procedures.") },
    { icon: FiLock, title: t("aboutValue4Title", "Confidentiality"), desc: t("aboutValue4Desc", "We respect the privacy and data of our clients.") },
    { icon: FiHeart, title: t("aboutValue5Title", "Fair Access"), desc: t("aboutValue5Desc", "We make law accessible to everyone, without complexity.") },
  ];

  return (
    <section
      id="our-values"
      className="w-full bg-[#faf6f0] py-14 md:py-20 px-4 md:px-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        <header className={`mb-12 ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl font-bold text-[#09142b] md:text-4xl mb-2">
            {t("aboutValuesTitle", "Our Values")}
          </h2>
          <p className="text-[#4b5563] text-base md:text-lg max-w-2xl">
            {t("aboutValuesSubtitle", "المبادئ التي نعمل بها في كل استشارة وخدمة نقدمها.")}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className={`rounded-xl border border-[#e7cfa7] bg-white p-6 transition-all hover:shadow-md hover:border-[#c8a45e]/50 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#09142b] text-[#c8a45e] mb-4" aria-hidden>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-bold text-[#09142b] text-lg mb-1">{value.title}</h3>
                <p className="text-[#4b5563] text-sm leading-relaxed">{value.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// —— Vision & Mission: two cards side by side ——
const AboutVisionMission = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <section
      id="vision-mission"
      className="w-full bg-white py-14 md:py-20 px-4 md:px-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <article className="rounded-2xl border border-[#e7cfa7] bg-[#fefcf8] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#09142b] text-[#c8a45e]">
                <FiTarget className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="font-bold text-[#09142b] text-xl md:text-2xl">
                {t("aboutVisionTitle", "Our Vision")}
              </h2>
            </div>
            <p className={`text-[#4b5563] text-base md:text-lg leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>
              {t("aboutVisionDesc", "To be the first digital legal reference in Algeria and the region, by combining real-world expertise with modern technology.")}
            </p>
          </article>

          <article className="rounded-2xl border border-[#e7cfa7] bg-[#fefcf8] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#09142b] text-[#c8a45e]">
                <FiShield className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="font-bold text-[#09142b] text-xl md:text-2xl">
                {t("aboutMissionTitle", "Our Mission")}
              </h2>
            </div>
            <p className={`text-[#4b5563] text-base md:text-lg leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>
              {t("aboutMissionDesc", "To provide professional, simplified, and secure legal services that ensure individuals and companies access their legal rights, and contribute to building a more law-aware society.")}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const title = t("aboutSeoTitle", "عن منصة SOSLAW | خدمات واستشارات قانونية رقمية في الجزائر");
  const desc = t("aboutSeoDesc", "تعرف على منصة SOSLAW، منصة جزائرية رقمية رائدة في مجال الاستشارات والخدمات القانونية. نؤسس لثقافة قانونية رقمية حديثة تناسب الجيل الجديد وتلبي احتياجات المجتمع الجزائري المتطور.");
  const keywords = "عن SOSLAW, منصة قانونية, خدمات قانونية, استشارات قانونية, محاماة رقمية, قانون جزائري, فريق قانوني, خبراء قانونيين";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "عن منصة SOSLAW",
    description: desc,
    url: "https://soslawdz.com/about",
    mainEntity: {
      "@type": "LegalService",
      name: "SOSLAW",
      description: "خدمات واستشارات قانونية رقمية في الجزائر",
      founder: { "@type": "Organization", name: "SOSLAW Team" },
      foundingDate: "2024",
      areaServed: { "@type": "Country", name: "Algeria" },
    },
  };

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="min-h-screen">
      <SEOHead
        title={title}
        description={desc}
        keywords={keywords}
        canonical="/about"
        structuredData={structuredData}
      />

      <AboutHero />
      <AboutSpecialization />
      <AboutWhoWeAre />
      <AboutDistinctiveFeatures />
      <AboutValues />
      <AboutVisionMission />
    </main>
  );
};

export default About;
