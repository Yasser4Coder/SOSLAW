import HeroSection from "./components/HeroSection";
import ConsultantsSection from "./components/ConsultantsSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ConsultationBranchesSection from "./components/ConsultationBranchesSection";
import FAQSection from "./components/FAQSection";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const title = t("homeSeoTitle", "SOSLAW | Legal Consultations & Services");
  const desc = t(
    "homeSeoDesc",
    "SOS Law ⚖ Algerian digital platform for legal consultations and services. Request your legal consultation wherever you are."
  );
  const url = "https://soslaw.com/";
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
