import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiHome,
  FiBriefcase,
  FiShield,
  FiHeart,
  FiFileText,
  FiGlobe,
  FiAward,
  FiTrendingUp,
  FiCheck,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";
import { FaGavel } from "react-icons/fa";

const ConsultationBranchesSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const consultationBranches = [
    {
      id: "civil",
      icon: FaGavel,
      titleKey: "civilConsultationTitle",
      services: [
        "contractDisputes",
        "civilLiabilityCases",
        "rentalHousingIssues",
        "damageCompensation",
      ],
      color: "bg-white border-[#09142b]",
      iconColor: "text-[#c8a45e]",
    },
    {
      id: "commercial",
      icon: FiUsers,
      titleKey: "commercialLawConsultationTitle",
      services: [
        "companyFormation",
        "partnershipSalesContracts",
        "commercialDisputes",
        "bankruptcyJudicialSettlement",
      ],
      color: "bg-white border-[#09142b]",
      iconColor: "text-[#c8a45e]",
    },
    {
      id: "realEstate",
      icon: FiHome,
      titleKey: "realEstateConsultationTitle",
      services: [
        "realEstateBuySell",
        "propertyDisputes",
        "documentationRegistration",
        "propertyRental",
      ],
      color: "bg-white border-[#09142b]",
      iconColor: "text-[#c8a45e]",
    },
    {
      id: "labor",
      icon: FiBriefcase,
      titleKey: "laborLawConsultationTitle",
      services: [
        "unfairDismissal",
        "workerEmployerRights",
        "employmentContracts",
        "socialSecurityDisputes",
      ],
      color: "bg-white border-[#09142b]",
      iconColor: "text-[#c8a45e]",
    },
    {
      id: "criminal",
      icon: FiShield,
      titleKey: "criminalConsultationTitle",
      services: [
        "misdemeanorCrimeCases",
        "investigationDefense",
        "criminalCourtProcedures",
      ],
      color: "bg-white border-[#09142b]",
      iconColor: "text-[#c8a45e]",
    },
    {
      id: "family",
      icon: FiHeart,
      titleKey: "familyConsultationTitle",
      services: [
        "divorceKhulaAlimony",
        "custodyChildVisitation",
        "inheritanceWills",
      ],
      color: "bg-white border-[#09142b]",
      iconColor: "text-[#c8a45e]",
    },
    {
      id: "administrative",
      icon: FiFileText,
      titleKey: "administrativeConsultationTitle",
      services: [
        "administrativeAppeals",
        "administrativeDisputes",
        "publicEmployment",
      ],
      color: "bg-white border-[#09142b]",
      iconColor: "text-[#c8a45e]",
    },
    {
      id: "intellectualProperty",
      icon: FiGlobe,
      titleKey: "intellectualPropertyConsultationTitle",
      services: ["trademarkProtection", "patentProtection", "digitalContent"],
      color: "bg-white border-[#09142b]",
      iconColor: "text-[#c8a45e]",
    },
    {
      id: "publicProcurement",
      icon: FiAward,
      titleKey: "publicProcurementConsultationTitle",
      services: [
        "tenderPreparation",
        "procurementAppeals",
        "governmentContracting",
      ],
      color: "bg-white border-[#09142b]",
      iconColor: "text-[#c8a45e]",
    },
    {
      id: "investment",
      icon: FiTrendingUp,
      titleKey: "investmentConsultationTitle",
      services: [
        "foreignInvestmentLaws",
        "taxFinancialLegislation",
        "newInvestorSupport",
      ],
      color: "bg-white border-[#09142b]",
      iconColor: "text-[#c8a45e]",
    },
  ];

  return (
    <section
      id="consultation-branches"
      className="w-full bg-[#faf6f0] py-16 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`font-extrabold text-[#09142b] mb-6 ${
              isRTL ? "text-2xl md:text-4xl" : "text-3xl md:text-4xl"
            }`}
          >
            ⚖ {t("consultationBranchesTitle")}
          </h2>
          <p
            className={`text-[#6b7280] max-w-3xl mx-auto leading-relaxed ${
              isRTL ? "text-sm md:text-lg" : "text-lg"
            }`}
          >
            {t("consultationBranchesDesc")}
          </p>
        </div>

        {/* Consultation Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {consultationBranches.map((branch) => (
            <div
              key={branch.id}
              className={`${branch.color} border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer`}
            >
              <div
                className={`flex items-start ${
                  isRTL ? "space-x-reverse space-x-6" : "space-x-6"
                }`}
              >
                <div
                  className={`${branch.iconColor} p-3 rounded-xl ml-[10px] bg-[#09142b] shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                >
                  <branch.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-bold text-[#09142b] mb-4 group-hover:text-[#c8a45e] transition-colors duration-300 ${
                      isRTL ? "text-base md:text-lg" : "text-lg"
                    }`}
                  >
                    {t(branch.titleKey)}
                  </h3>
                  <ul className="space-y-2">
                    {branch.services.map((service, serviceIndex) => (
                      <li
                        key={serviceIndex}
                        className={`flex items-center text-[#6b7280] hover:text-[#09142b] transition-colors duration-200 ${
                          isRTL ? "text-xs md:text-sm" : "text-sm"
                        }`}
                      >
                        <FiCheck
                          className={`text-[#09142b ] flex-shrink-0 ${
                            isRTL ? "ml-2 mr-2" : "mr-2 ml-2"
                          }`}
                          size={14}
                        />
                        <span>{t(service)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h4
            className={`font-bold text-[#09142b] mb-4 ${
              isRTL ? "text-lg md:text-xl" : "text-xl"
            }`}
          >
            {t("getLegalConsultationNow")}
          </h4>
          <p
            className={`text-[#6b7280] mb-6 ${
              isRTL ? "text-sm md:text-base" : "text-base"
            }`}
          >
            {t("getLegalConsultationDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#c8a45e] text-white font-semibold rounded-lg hover:bg-[#b48b5a] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2"
            >
              <FiPhone
                className={`${isRTL ? "ml-3 mr-3" : "mr-3 ml-3"}`}
                size={18}
              />
              {t("bookConsultationNow")}
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#c8a45e] font-semibold rounded-lg border-2 border-[#c8a45e] hover:bg-[#faf6f0] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2"
            >
              <FiCalendar
                className={`${isRTL ? "ml-3 mr-3" : "mr-3 ml-3"}`}
                size={18}
              />
              {t("signIn")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationBranchesSection;
