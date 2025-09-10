import HeroSection from "./components/HeroSection";
import ConsultantsSection from "./components/ConsultantsSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ConsultationBranchesSection from "./components/ConsultationBranchesSection";
import FAQSection from "./components/FAQSection";
import SEO from "../components/SEO";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const title = t(
    "homeSeoTitle",
    "SOSLAW | خدمات واستشارات قانونية رقمية في الجزائر"
  );
  const desc = t(
    "homeSeoDesc",
    "خدمات واستشارات قانونية رقمية في الجزائر. استشارتك القانونية أينما كنت. في SOS Law، نحن لا نقدّم فقط خدمة قانونية، بل نؤسس لثقافة قانونية رقمية حديثة، تناسب الجيل الجديد، وتلبي احتياجات المجتمع الجزائري المتطور. معًا نحو عدالة أسرع، أوضح، وأقرب للجميع."
  );
  const keywords =
    "استشارات قانونية, خدمات قانونية, محامي الجزائر, استشارة قانونية أونلاين, قانون جزائري, محاماة, عدالة, قانون تجاري, قانون مدني, قانون جنائي, قانون أسرة, قانون عقارات, قانون ضرائب, ملكية فكرية, تقاضي, وساطة, حل نزاعات";

  // Enhanced structured data for homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "SOSLAW",
    alternateName: "SOS Law",
    description: desc,
    url: "https://soslawdz.com",
    logo: "https://soslawdz.com/logo.svg",
    image: "https://soslawdz.com/logo.svg",
    telephone: "+213-XXX-XXX-XXX",
    email: "info@soslawdz.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "DZ",
      addressLocality: "الجزائر",
      addressRegion: "الجزائر",
    },
    areaServed: {
      "@type": "Country",
      name: "Algeria",
    },
    serviceType: [
      "استشارات قانونية",
      "خدمات قانونية",
      "محاماة",
      "تقاضي",
      "وساطة",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "الخدمات القانونية",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "القانون التجاري والشركات",
            description:
              "دعم قانوني شامل للأعمال والعقود والاندماجات والامتثال",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "التقاضي وتسوية النزاعات",
            description: "تمثيل خبير في القضايا المدنية والجنائية والتجارية",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "قانون الأسرة",
            description: "استشارات قانونية متخصصة في قضايا الأسرة والوساطة",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "قانون العقارات",
            description: "إرشاد قانوني في معاملات العقارات والتخطيط العمراني",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "قانون الضرائب والمالية",
            description: "مشورة قانونية في قانون الضرائب والامتثال المالي",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "الملكية الفكرية",
            description:
              "حماية الأفكار والعلامات التجارية وحقوق الملكية الفكرية",
          },
        },
      ],
    },
    sameAs: [
      "https://www.facebook.com/soslawdz",
      "https://www.linkedin.com/company/soslawdz",
      "https://www.instagram.com/soslawdz",
      "https://twitter.com/soslawdz",
    ],
  };

  return (
    <main className="">
      <SEO
        title={title}
        description={desc}
        keywords={keywords}
        structuredData={structuredData}
        url="/"
      />
      <HeroSection />
      <ConsultantsSection />
      <ServicesSection />
      <TestimonialsSection />
      <ConsultationBranchesSection />
      <FAQSection />
    </main>
  );
};

export default Home;
