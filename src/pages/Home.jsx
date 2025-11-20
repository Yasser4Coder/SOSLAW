import HeroSection from "./components/HeroSection";
import NationalConferenceAnnouncement from "./components/NationalConferenceAnnouncement";
import ConsultantsSection from "./components/ConsultantsSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ConsultationBranchesSection from "./components/ConsultationBranchesSection";
import FAQSection from "./components/FAQSection";
import SEO from "../components/SEO";
import EmailVerificationBanner from "../components/EmailVerificationBanner";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/useAuth";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import emailVerificationService from "../services/emailVerificationService";

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const { scrollToSection } = useSmoothScroll();
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Check if user needs email verification
  useEffect(() => {
    if (isAuthenticated && user && !user.isEmailVerified) {
      setShowVerificationBanner(true);
    }
  }, [isAuthenticated, user]);

  // Handle section scrolling from navigation state
  useEffect(() => {
    if (location.state?.scrollTo) {
      // Use setTimeout to ensure the page has fully loaded
      setTimeout(() => {
        scrollToSection(location.state.scrollTo);
      }, 100);
      // Clear the scrollTo from location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.scrollTo, scrollToSection]);

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleResendVerification = async () => {
    try {
      await emailVerificationService.sendVerificationEmail(user.email);
      // You might want to show a success toast here
    } catch (error) {
      console.error("Failed to resend verification email:", error);
    }
  };
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
      {showVerificationBanner && (
        <div className="container mx-auto px-4 py-6">
          <EmailVerificationBanner
            onClose={() => setShowVerificationBanner(false)}
            onResend={handleResendVerification}
          />
        </div>
      )}
      {successMessage && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage("")}
                className="text-green-600 hover:text-green-800 cursor-pointer ml-4"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <HeroSection />
      <NationalConferenceAnnouncement />
      <ConsultantsSection />
      <ServicesSection />
      <TestimonialsSection />
      <ConsultationBranchesSection />
      <FAQSection />
    </main>
  );
};

export default Home;
