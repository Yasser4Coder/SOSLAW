// SEO Utility Functions for SOSLAW

export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

export const generateFAQStructuredData = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

export const generateServiceStructuredData = (service) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LegalService",
      name: "SOSLAW",
      url: "https://soslaw.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Algeria",
    },
    serviceType: service.category,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "DZD",
    },
  };
};

export const generatePersonStructuredData = (person) => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.title,
    description: person.bio,
    worksFor: {
      "@type": "LegalService",
      name: "SOSLAW",
    },
    knowsAbout: person.specialties || [],
    alumniOf: person.education || [],
  };
};

export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "SOSLAW",
    alternateName: "SOS Law",
    description:
      "خدمات واستشارات قانونية رقمية في الجزائر. استشارتك القانونية أينما كنت.",
    url: "https://soslaw.com",
    logo: "https://soslaw.com/logo.svg",
    image: "https://soslaw.com/logo.svg",
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
    foundingDate: "2024",
    sameAs: [
      "https://www.facebook.com/soslaw",
      "https://www.linkedin.com/company/soslaw",
      "https://www.instagram.com/soslaw",
    ],
  };
};

export const generateWebSiteStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SOSLAW",
    alternateName: "SOS Law",
    url: "https://soslaw.com",
    description: "خدمات واستشارات قانونية رقمية في الجزائر",
    inLanguage: "ar",
    copyrightYear: "2024",
    publisher: {
      "@type": "Organization",
      name: "SOSLAW",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://soslaw.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
};

export const generateLocalBusinessStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "SOSLAW",
    image: "https://soslaw.com/logo.svg",
    telephone: "+213-XXX-XXX-XXX",
    email: "info@soslaw.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "شارع الاستقلال",
      addressLocality: "الجزائر",
      addressRegion: "الجزائر",
      postalCode: "16000",
      addressCountry: "DZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 36.7538,
      longitude: 3.0588,
    },
    url: "https://soslaw.com",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
      opens: "08:30",
      closes: "18:00",
    },
    areaServed: {
      "@type": "Country",
      name: "Algeria",
    },
  };
};

// SEO Keywords for different pages
export const SEO_KEYWORDS = {
  home: "استشارات قانونية, خدمات قانونية, محامي الجزائر, استشارة قانونية أونلاين, قانون جزائري, محاماة, عدالة, قانون تجاري, قانون مدني, قانون جنائي, قانون أسرة, قانون عقارات, قانون ضرائب, ملكية فكرية, تقاضي, وساطة, حل نزاعات",

  about:
    "عن SOSLAW, منصة قانونية, خدمات قانونية, استشارات قانونية, محاماة رقمية, قانون جزائري, فريق قانوني, خبراء قانونيين",

  contact:
    "تواصل معنا, استشارة قانونية, محامي, قانون, خدمات قانونية, SOSLAW, الجزائر, استشارة أونلاين",

  services:
    "خدمات قانونية, استشارات قانونية, قانون تجاري, قانون مدني, قانون جنائي, قانون أسرة, قانون عقارات, قانون ضرائب, ملكية فكرية, تقاضي, وساطة",

  consultants:
    "مستشارون قانونيون, محامون, خبراء قانونيين, فريق قانوني, استشارات قانونية متخصصة",

  library:
    "مكتبة قانونية, موارد قانونية, مقالات قانونية, أدلة قانونية, قوانين جزائرية, أنظمة قانونية",

  joinTeam:
    "انضم إلى فريقنا, وظائف قانونية, فرص عمل, محامون, مستشارون قانونيون, مهنة قانونية",

  requestService:
    "اطلب خدمة قانونية, استشارة قانونية فورية, طلب استشارة, خدمات قانونية أونلاين",
};

// Default SEO titles and descriptions
export const SEO_DEFAULTS = {
  home: {
    title: "SOSLAW | خدمات واستشارات قانونية رقمية في الجزائر",
    description:
      "خدمات واستشارات قانونية رقمية في الجزائر. استشارتك القانونية أينما كنت. في SOS Law، نحن لا نقدّم فقط خدمة قانونية، بل نؤسس لثقافة قانونية رقمية حديثة، تناسب الجيل الجديد، وتلبي احتياجات المجتمع الجزائري المتطور. معًا نحو عدالة أسرع، أوضح، وأقرب للجميع.",
  },
  about: {
    title: "عن منصة SOSLAW | خدمات واستشارات قانونية رقمية في الجزائر",
    description:
      "تعرف على منصة SOSLAW، منصة جزائرية رقمية رائدة في مجال الاستشارات والخدمات القانونية. نؤسس لثقافة قانونية رقمية حديثة تناسب الجيل الجديد وتلبي احتياجات المجتمع الجزائري المتطور.",
  },
  contact: {
    title: "تواصل معنا | SOSLAW - منصة الاستشارات القانونية",
    description:
      "تواصل مع فريق SOSLAW للحصول على استشارتك القانونية. نحن متاحون لمساعدتك في جميع القضايا القانونية. استشارتك القانونية أينما كنت.",
  },
};
