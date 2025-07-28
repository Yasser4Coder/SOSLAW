import React from "react";
import { useTranslation } from "react-i18next";
import { services } from "./servicesData";
import ServiceCard from "./ServiceCard";
import {
  FiBriefcase,
  FiUsers,
  FiShield,
  FiFileText,
  FiPhone,
  FiEdit,
  FiBell,
  FiGlobe,
  FiSearch,
  FiBook,
  FiAward,
} from "react-icons/fi";
import { FaGavel } from "react-icons/fa";

const iconMap = {
  FiBriefcase,
  FaGavel,
  FiUsers,
  FiShield,
  FiFileText,
  FiPhone,
  FiEdit,
  FiBell,
  FiGlobe,
  FiSearch,
  FiBook,
  FiAward,
};

const ServicesSection = () => {
  const { t } = useTranslation();
  return (
    <section id="services" className="w-full bg-white py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#09142b] mb-4">
          {t("servicesSectionTitle")}
        </h2>
        <p className="text-[#6b7280] text-base md:text-lg max-w-2xl mx-auto">
          {t("servicesSectionDesc")}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((s) => (
          <ServiceCard
            key={s.key}
            icon={s.icon === "FaGavel" ? iconMap.FaGavel : iconMap[s.icon]}
            title={t(s.titleKey)}
            desc={s.descKey ? t(s.descKey) : undefined}
            subItems={s.subItems?.map((item) => ({
              ...item,
              label: t(item.titleKey),
            }))}
            route={s.route}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
