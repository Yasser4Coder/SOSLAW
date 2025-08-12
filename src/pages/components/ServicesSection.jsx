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
  };

  return (
    <section id="services" className="w-full bg-white py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c8a45e] rounded-full mb-6">
            <FaGavel className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#09142b] mb-4">
            {t("servicesTitle", "Our Legal Services")}
          </h2>
          <p className="text-lg text-[#6b7280] max-w-3xl mx-auto">
            {t(
              "servicesDesc",
              "Comprehensive legal services tailored to meet your specific needs. From consultation to document preparation, we've got you covered."
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => {
            const IconComponent = iconMap[service.id] || FiBriefcase;
            return (
              <ServiceCard
                key={service.id}
                icon={IconComponent}
                title={service.title[currentLanguage] || service.title.en}
                desc={
                  service.description[currentLanguage] || service.description.en
                }
                route={`/services/${service.id}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
