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

const AboutHero = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return (
    <section className="relative w-full bg-gradient-to-br from-[#faf6f0] via-[#e7cfa7]/20 to-[#c8a45e]/10 py-20 px-4 md:px-8 flex flex-col items-center text-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#c8a45e] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#09142b] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <FiStar className="text-[#c8a45e] text-2xl animate-pulse" />
          <span className="text-[#c8a45e] font-bold text-lg">SOS Law</span>
          <FiStar className="text-[#c8a45e] text-2xl animate-pulse" />
        </div>

        <h1
          className="text-4xl md:text-6xl font-extrabold text-[#09142b] mb-6 leading-tight"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t("aboutPageTitle", "About Us")}
        </h1>

        <p
          className="text-[#6b7280] text-lg md:text-xl max-w-4xl mx-auto mb-8 leading-relaxed"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t(
            "aboutPageIntro",
            "SOS Law is an Algerian legal institution and innovative digital platform, aiming to revolutionize access to legal information and consultations in Algeria and the Arab world."
          )}
        </p>

        <div className="flex items-center justify-center gap-4">
          <FiGlobe className="text-[#c8a45e] text-3xl" aria-hidden="true" />
          <span className="text-[#c8a45e] font-semibold text-xl">
            {t("aboutInnovativePlatform", "Innovative Digital Legal Platform")}
          </span>
        </div>
      </div>
    </section>
  );
};

const AboutWhoWeAre = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return (
    <section className="w-full bg-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#faf6f0] px-4 py-2 rounded-full mb-4">
            <FiCheckCircle className="text-[#c8a45e] text-lg" />
            <span className="text-[#09142b] font-semibold">
              {t("aboutWhoWeAreTitle", "Who We Are")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <p className="text-[#09142b] text-lg leading-relaxed">
              {t(
                "aboutWhoWeAreDesc1",
                "We operate under a dual model that combines physical presence through a licensed legal institution and technical interaction through an integrated digital platform, providing individuals and companies with a modern and secure way to access reliable legal services."
              )}
            </p>

            <p className="text-[#09142b] text-lg leading-relaxed">
              {t(
                "aboutWhoWeAreDesc2",
                "At SOS Law, we believe that legal knowledge is not exclusive to specialists only, but a right for every individual. That's why we've made technology a means to spread awareness, simplify access to lawyers and consultants, and provide fast and modern legal solutions that consider the needs of Algerian society in all its segments."
              )}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <img
              src={aboutlogo}
              alt="SOS Law Digital Platform"
              className="w-full max-w-md object-contain drop-shadow-2xl"
              loading="lazy"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutDistinctiveFeatures = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const features = [
    {
      icon: <FiZap className="text-2xl" />,
      text: t(
        "aboutFeature1",
        "First Algerian legal platform offering fully interactive services"
      ),
    },
    {
      icon: <FiUsers className="text-2xl" />,
      text: t(
        "aboutFeature2",
        "Direct connection between client and lawyer via the application"
      ),
    },
    {
      icon: <FiTrendingUp className="text-2xl" />,
      text: t("aboutFeature3", "Legal consultation available within minutes"),
    },
    {
      icon: <FiEye className="text-2xl" />,
      text: t("aboutFeature4", "Transparent and announced prices"),
    },
    {
      icon: <FiGlobe className="text-2xl" />,
      text: t(
        "aboutFeature5",
        "Professional legal coverage for interior and remote areas"
      ),
    },
    {
      icon: <FiAward className="text-2xl" />,
      text: t(
        "aboutFeature6",
        "Special portal for companies and startup owners"
      ),
    },
    {
      icon: <FiStar className="text-2xl" />,
      text: t("aboutFeature7", "Trilingual content: Arabic, English, French"),
    },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-[#faf6f0] to-[#e7cfa7]/30 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-4 shadow-md">
            <FiStar className="text-[#c8a45e] text-lg" />
            <span className="text-[#09142b] font-semibold">
              {t("aboutDistinctiveTitle", "What Distinguishes SOS Law?")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 shadow-md border border-[#e7cfa7] transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-[#c8a45e] rounded-lg flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <p className="text-[#09142b] font-medium leading-relaxed">
                  {feature.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutValues = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const values = [
    {
      icon: <FiAward className="text-2xl" />,
      title: t("aboutValue1Title", "Professionalism"),
      desc: t(
        "aboutValue1Desc",
        "We commit to the highest standards of legal quality."
      ),
    },
    {
      icon: <FiZap className="text-2xl" />,
      title: t("aboutValue2Title", "Innovation"),
      desc: t(
        "aboutValue2Desc",
        "We integrate technology in the service of law."
      ),
    },
    {
      icon: <FiEye className="text-2xl" />,
      title: t("aboutValue3Title", "Transparency"),
      desc: t(
        "aboutValue3Desc",
        "We put the client's interest first and clarify all procedures."
      ),
    },
    {
      icon: <FiLock className="text-2xl" />,
      title: t("aboutValue4Title", "Confidentiality"),
      desc: t(
        "aboutValue4Desc",
        "We respect the privacy and data of our clients."
      ),
    },
    {
      icon: <FiHeart className="text-2xl" />,
      title: t("aboutValue5Title", "Fair Access"),
      desc: t(
        "aboutValue5Desc",
        "We make law accessible to everyone, without complexity."
      ),
    },
  ];

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#faf6f0] px-4 py-2 rounded-full mb-4">
            <FiHeart className="text-[#c8a45e] text-lg" />
            <span className="text-[#09142b] font-semibold">
              {t("aboutValuesTitle", "Our Values")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br from-[#faf6f0] to-[#e7cfa7]/30 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                isRTL ? "text-right" : "text-left"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="w-16 h-16 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-[#09142b] mb-3">
                {value.title}
              </h3>
              <p className="text-[#6b7280] leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutVisionMission = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <section className="w-full bg-gradient-to-br from-[#faf6f0] via-[#e7cfa7]/40 to-[#c8a45e]/20 py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#c8a45e] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#09142b] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Vision */}
          <div
            className={`bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7] ${
              isRTL ? "text-right" : "text-left"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#c8a45e] to-[#b48b5a] rounded-full flex items-center justify-center shadow-md">
                <FiTarget className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#09142b]">
                {t("aboutVisionTitle", "Our Vision")}
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-[#6b7280]">
              {t(
                "aboutVisionDesc",
                "To be the first digital legal reference in Algeria and the region, by combining real-world expertise with modern technology."
              )}
            </p>
          </div>

          {/* Mission */}
          <div
            className={`bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7] ${
              isRTL ? "text-right" : "text-left"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#c8a45e] to-[#b48b5a] rounded-full flex items-center justify-center shadow-md">
                <FiShield className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#09142b]">
                {t("aboutMissionTitle", "Our Mission")}
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-[#6b7280]">
              {t(
                "aboutMissionDesc",
                "To provide professional, simplified, and secure legal services that ensure individuals and companies access their legal rights, and contribute to building a more law-aware society."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const { t } = useTranslation();
  const title = t(
    "aboutSeoTitle",
    "عن منصة SOSLAW | منصة جزائرية رقمية للاستشارات والخدمات القانونية"
  );
  const desc = t(
    "aboutSeoDesc",
    "تعرف على منصة SOSLAW، منصة جزائرية رقمية رائدة في مجال الاستشارات والخدمات القانونية. نؤسس لثقافة قانونية رقمية حديثة تناسب الجيل الجديد وتلبي احتياجات المجتمع الجزائري المتطور."
  );
  const keywords =
    "عن SOSLAW, منصة قانونية, خدمات قانونية, استشارات قانونية, محاماة رقمية, قانون جزائري, فريق قانوني, خبراء قانونيين";

  // Structured data for About page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "عن منصة SOSLAW",
    description: desc,
    url: "https://soslaw.com/about",
    mainEntity: {
      "@type": "LegalService",
      name: "SOSLAW",
      description: "منصة جزائرية رقمية للاستشارات والخدمات القانونية",
      founder: {
        "@type": "Organization",
        name: "SOSLAW Team",
      },
      foundingDate: "2024",
      areaServed: {
        "@type": "Country",
        name: "Algeria",
      },
    },
  };

  return (
    <main className="">
      <SEOHead
        title={title}
        description={desc}
        keywords={keywords}
        canonical="/about"
        structuredData={structuredData}
      />

      <AboutHero />
      <AboutWhoWeAre />
      <AboutDistinctiveFeatures />
      <AboutValues />
      <AboutVisionMission />
    </main>
  );
};

export default About;
