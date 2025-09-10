import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = "/logo.svg",
  ogType = "website",
  structuredData,
  noIndex = false,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "ar";
  const baseUrl = "https://soslaw.com";
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const fullOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${baseUrl}${ogImage}`;

  // Default structured data for legal services
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "SOSLAW",
    alternateName: "SOS Law",
    description:
      description ||
      "خدمات واستشارات قانونية رقمية في الجزائر. استشارتك القانونية أينما كنت.",
    url: fullCanonical,
    logo: `${baseUrl}/logo.svg`,
    image: fullOgImage,
    telephone: "+213-XXX-XXX-XXX",
    email: "info@soslaw.com",
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
    sameAs: [
      "https://www.facebook.com/soslaw",
      "https://www.linkedin.com/company/soslaw",
      "https://www.instagram.com/soslaw",
    ],
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow"}
      />
      <meta name="language" content="Arabic" />
      <meta name="author" content="SOSLAW" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="SOSLAW" />
      <meta property="og:locale" content="ar_DZ" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImage} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#09142b" />
      <meta name="msapplication-TileColor" content="#09142b" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead;
