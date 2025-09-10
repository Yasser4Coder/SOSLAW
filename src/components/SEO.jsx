import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  keywords,
  image = "https://soslawdz.com/logo.svg",
  url,
  type = "website",
  lang = "ar",
  structuredData,
  noindex = false,
}) => {
  const isRTL = lang === "ar";
  const fullTitle = title
    ? `${title} | SOSLAW`
    : "SOSLAW | استشارات قانونية في الجزائر";
  const fullUrl = url ? `https://soslawdz.com${url}` : "https://soslawdz.com/";

  const defaultDescription =
    "حلولك القانونية في متناول يدك | SOSLAW منصة الاستشارات القانونية في الجزائر. استشارات قانونية فورية، محامون خبراء، خدمات قانونية شاملة.";
  const defaultKeywords =
    "استشارات قانونية, خدمات قانونية, محامي الجزائر, استشارة قانونية أونلاين, قانون جزائري, محاماة, عدالة, soslaw, soslawdz, اس او اس لو";
  const allKeywords = keywords
    ? `${defaultKeywords}, ${keywords}`
    : defaultKeywords;

  return (
    <Helmet>
      <html lang={lang} dir={isRTL ? "rtl" : "ltr"} />
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="SOSLAW" />
      <meta
        property="og:locale"
        content={lang === "ar" ? "ar_DZ" : lang === "en" ? "en_US" : "fr_FR"}
      />
      <meta property="og:locale:alternate" content="ar_DZ" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="fr_FR" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta
        property="twitter:description"
        content={description || defaultDescription}
      />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:site" content="@soslawdz" />
      <meta property="twitter:creator" content="@soslawdz" />

      {/* Alternate Language Versions */}
      <link
        rel="alternate"
        hreflang="ar"
        href={`https://soslawdz.com${url || ""}?lang=ar`}
      />
      <link
        rel="alternate"
        hreflang="en"
        href={`https://soslawdz.com${url || ""}?lang=en`}
      />
      <link
        rel="alternate"
        hreflang="fr"
        href={`https://soslawdz.com${url || ""}?lang=fr`}
      />
      <link rel="alternate" hreflang="x-default" href={fullUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
