import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
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
          {t("aboutPageTitle", "من نحن")}
        </h1>

        <p
          className="text-[#6b7280] text-lg md:text-xl max-w-4xl mx-auto mb-8 leading-relaxed"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t(
            "aboutPageIntro",
            "SOS Law هي مؤسسة قانونية جزائرية ومنصة رقمية مبتكرة، تهدف إلى إحداث ثورة في كيفية الوصول إلى المعلومات والاستشارات القانونية في الجزائر والعالم العربي."
          )}
        </p>

        <div className="flex items-center justify-center gap-4">
          <FiGlobe className="text-[#c8a45e] text-3xl" aria-hidden="true" />
          <span className="text-[#c8a45e] font-semibold text-xl">
            منصة قانونية رقمية مبتكرة
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
              {t("aboutWhoWeAreTitle", "✅ من نحن")}
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
                "نعمل وفق نموذج مزدوج يجمع بين التواجد الفعلي عبر مؤسسة قانونية مرخصة، والتفاعل التقني من خلال منصة رقمية متكاملة، مما يمنح الأفراد والشركات وسيلة حديثة وآمنة للحصول على خدمات قانونية موثوقة."
              )}
            </p>

            <p className="text-[#09142b] text-lg leading-relaxed">
              {t(
                "aboutWhoWeAreDesc2",
                "نحن في SOS Law نؤمن أن المعرفة القانونية ليست حكرًا على المختصين فقط، بل حق لكل فرد. ولهذا جعلنا التكنولوجيا وسيلة لنشر الوعي، وتبسيط الوصول إلى المحامين والمستشارين، وتقديم حلول قانونية سريعة وعصرية، تراعي احتياجات المجتمع الجزائري بمختلف شرائحه."
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
        "أول منصة قانونية جزائرية تقدم خدمات تفاعلية بالكامل"
      ),
    },
    {
      icon: <FiUsers className="text-2xl" />,
      text: t("aboutFeature2", "توصيل مباشر بين العميل والمحامي عبر التطبيق"),
    },
    {
      icon: <FiTrendingUp className="text-2xl" />,
      text: t("aboutFeature3", "إمكانية استشارة قانونية خلال دقائق"),
    },
    {
      icon: <FiEye className="text-2xl" />,
      text: t("aboutFeature4", "أسعار شفافة ومعلنة"),
    },
    {
      icon: <FiGlobe className="text-2xl" />,
      text: t("aboutFeature5", "تغطية قانونية مهنية للمناطق الداخلية والنائية"),
    },
    {
      icon: <FiAward className="text-2xl" />,
      text: t("aboutFeature6", "بوابة خاصة للشركات وأصحاب المشاريع الناشئة"),
    },
    {
      icon: <FiStar className="text-2xl" />,
      text: t("aboutFeature7", "محتوى ثلاثي عربية إنجليزية فرنسية"),
    },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-[#faf6f0] to-[#e7cfa7]/30 py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-4 shadow-md">
            <FiStar className="text-[#c8a45e] text-lg" />
            <span className="text-[#09142b] font-semibold">
              {t("aboutDistinctiveTitle", "🌟 ما الذي يميز SOS Law؟")}
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
      title: t("aboutValue1Title", "الاحترافية"),
      desc: t("aboutValue1Desc", "نلتزم بأعلى معايير الجودة القانونية."),
    },
    {
      icon: <FiZap className="text-2xl" />,
      title: t("aboutValue2Title", "الابتكار"),
      desc: t("aboutValue2Desc", "ندمج التكنولوجيا في خدمة القانون."),
    },
    {
      icon: <FiEye className="text-2xl" />,
      title: t("aboutValue3Title", "الشفافية"),
      desc: t("aboutValue3Desc", "نضع مصلحة العميل أولًا، ونوضح كل الإجراءات."),
    },
    {
      icon: <FiLock className="text-2xl" />,
      title: t("aboutValue4Title", "السرية"),
      desc: t("aboutValue4Desc", "نحترم خصوصية وبيانات عملائنا."),
    },
    {
      icon: <FiHeart className="text-2xl" />,
      title: t("aboutValue5Title", "الوصول العادل"),
      desc: t("aboutValue5Desc", "نجعل القانون متاحًا للجميع، دون تعقيد."),
    },
  ];

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#faf6f0] px-4 py-2 rounded-full mb-4">
            <FiHeart className="text-[#c8a45e] text-lg" />
            <span className="text-[#09142b] font-semibold">
              {t("aboutValuesTitle", "💡 قيمنا")}
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
                {t("aboutVisionTitle", "🔭 رؤيتنا")}
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-[#6b7280]">
              {t(
                "aboutVisionDesc",
                "أن نكون المرجع القانوني الرقمي الأول في الجزائر والمنطقة، من خلال الدمج بين الخبرة الواقعية والتكنولوجيا الحديثة."
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
                {t("aboutMissionTitle", "🎯 رسالتنا")}
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-[#6b7280]">
              {t(
                "aboutMissionDesc",
                "تقديم خدمات قانونية احترافية، مبسطة، وآمنة، تضمن وصول الأفراد والشركات إلى حقوقهم القانونية، وتساهم في بناء مجتمع أكثر وعيًا بالقانون."
              )}
            </p>
          </div>
        </div>
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
      <AboutWhoWeAre />
      <AboutDistinctiveFeatures />
      <AboutValues />
      <AboutVisionMission />
    </main>
  );
};

export default About;
