import React from "react";
import { useTranslation } from "react-i18next";
import {
  FiBriefcase,
  FiUsers,
  FiShield,
  FiFileText,
  FiPhone,
  FiEdit,
  FiBell,
  FiGlobe,
  FiBook,
  FiAward,
  FiTrendingUp,
  FiHome,
} from "react-icons/fi";
import { FaGavel, FaHandshake, FaBalanceScale } from "react-icons/fa";
import ServiceCard from "./ServiceCard";
import { services } from "./servicesData";

const ServicesSection = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Icon mapping for services
  const iconMap = {
    "legal-translation": FiFileText,
    "legal-documents": FiEdit,
    "arbitration-mediation": FaHandshake,
    "legal-content": FiEdit,
    "legal-audit": FiShield,
    "legal-consultation": FiPhone,
    "nursery-legal-package": FiHome,
    "legal-training": FiBook,
    "comprehensive-business-support": FiTrendingUp,
    "elite-legal-package-students": FiUsers,
    "academic-leadership-support": FiAward,
  };

  return (
    <section id="services" className="w-full bg-white py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header - consistent on all screens */}
        <div className="mb-10 text-center sm:mb-12 md:mb-16">
          <h2
            className="mb-3 max-w-full break-words font-bold text-[#09142b] text-xl leading-tight sm:mb-4 sm:text-2xl md:text-3xl lg:text-4xl"
          >
            {t("servicesTitle", "Our Legal Services")}
          </h2>
          <p
            className="mx-auto max-w-3xl break-words px-1 text-sm leading-relaxed text-[#6b7280] sm:text-base md:text-lg"
          >
            {t(
              "servicesDesc",
              "Comprehensive legal services tailored to meet your specific needs. From consultation to document preparation, we've got you covered."
            )}
          </p>
        </div>

        {/* Services Grid - equal height cards, responsive gap */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
          {services.map((service) => {
            const IconComponent = iconMap[service.id] || FiBriefcase;
            return (
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title[currentLanguage] || service.title.en}
                desc={
                  service.description[currentLanguage] || service.description.en
                }
                route={`/services/${service.id}`}
                serviceId={service.id}
                trustLine={
                  service.trustLine
                    ? service.trustLine[currentLanguage] || service.trustLine.ar
                    : undefined
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
