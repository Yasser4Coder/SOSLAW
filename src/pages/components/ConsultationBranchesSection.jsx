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
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
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
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
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
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
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
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
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
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
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
      color: "bg-pink-50 border-pink-200",
      iconColor: "text-pink-600",
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
      color: "bg-indigo-50 border-indigo-200",
      iconColor: "text-indigo-600",
    },
    {
      id: "intellectualProperty",
      icon: FiGlobe,
      titleKey: "intellectualPropertyConsultationTitle",
      services: ["trademarkProtection", "patentProtection", "digitalContent"],
      color: "bg-teal-50 border-teal-200",
      iconColor: "text-teal-600",
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
      color: "bg-amber-50 border-amber-200",
      iconColor: "text-amber-600",
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
      color: "bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-600",
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#09142b] mb-6">
            ⚖ {t("consultationBranchesTitle")}
          </h2>
          <p className="text-[#6b7280] text-lg max-w-3xl mx-auto leading-relaxed">
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
                  className={`${branch.iconColor} p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                >
                  <branch.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#09142b] mb-4 group-hover:text-[#c8a45e] transition-colors duration-300">
                    {t(branch.titleKey)}
                  </h3>
                  <ul className="space-y-2">
                    {branch.services.map((service, serviceIndex) => (
                      <li
                        key={serviceIndex}
                        className="flex items-center text-[#6b7280] text-sm hover:text-[#09142b] transition-colors duration-200"
                      >
                        <FiCheck
                          className={`text-[#c8a45e] flex-shrink-0 ${
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
          <h4 className="text-xl font-bold text-[#09142b] mb-4">
            {t("getLegalConsultationNow")}
          </h4>
          <p className="text-[#6b7280] mb-6">{t("getLegalConsultationDesc")}</p>
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
