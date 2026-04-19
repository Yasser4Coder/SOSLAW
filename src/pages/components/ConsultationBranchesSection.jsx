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
  FiArrowLeft,
} from "react-icons/fi";
import { FaGavel } from "react-icons/fa";

const consultationBranchesData = [
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
  },
  {
    id: "intellectualProperty",
    icon: FiGlobe,
    titleKey: "intellectualPropertyConsultationTitle",
    services: ["trademarkProtection", "patentProtection", "digitalContent"],
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
  },
];

const ConsultationBranchesSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <section
      id="consultation-branches"
      className="relative w-full overflow-hidden py-14 px-4 md:py-18 md:px-8"
      style={{
        background: "linear-gradient(165deg, #f5f0e8 0%, #faf6f0 40%, #f2ebe0 100%)",
      }}
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 z-0 min-h-full" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(200, 164, 94, 0.12) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 100% 80%, rgba(9, 20, 43, 0.06) 0%, transparent 50%)",
          }}
        />
        <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-[#c8a45e] opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#09142b] opacity-6 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-10 text-center sm:mb-12 md:mb-14">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#09142b] text-[#c8a45e] shadow-md">
            <FaGavel className="h-6 w-6" aria-hidden />
          </div>
          <h2 className="mb-3 max-w-full break-words font-extrabold text-[#09142b] text-xl leading-tight sm:mb-4 sm:text-2xl md:text-3xl lg:text-4xl">
            {t("consultationBranchesTitle")}
          </h2>
          <p className="mx-auto max-w-2xl break-words px-1 text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
            {t("consultationBranchesDesc")}
          </p>
        </div>

        {/* Branches Grid - uniform cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:gap-8">
          {consultationBranchesData.map((branch) => {
            const Icon = branch.icon;
            return (
              <article
                key={branch.id}
                className="group flex min-h-[200px] flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c8a45e]/30 hover:shadow-lg focus-within:shadow-lg focus:outline-none"
                tabIndex={0}
              >
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="mb-3 flex items-start gap-3 sm:gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#09142b] text-[#c8a45e] transition-transform duration-200 group-hover:scale-105 sm:h-11 sm:w-11">
                      <Icon className="h-5 w-5 sm:h-5 sm:w-5" aria-hidden />
                    </span>
                    <h3
                      className="min-h-[2.5rem] line-clamp-2 text-base font-bold leading-snug text-[#09142b] transition-colors group-hover:text-[#c8a45e] sm:text-lg"
                      dir="auto"
                      title={t(branch.titleKey)}
                    >
                      {t(branch.titleKey)}
                    </h3>
                  </div>
                  <ul className="space-y-2" dir={isRTL ? "rtl" : "ltr"}>
                    {branch.services.slice(0, 4).map((serviceKey, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm"
                      >
                        <FiCheck
                          className="h-3.5 w-3.5 shrink-0 text-[#c8a45e]"
                          aria-hidden
                        />
                        <span className="line-clamp-1">{t(serviceKey)}</span>
                      </li>
                    ))}
                    {branch.services.length > 4 && (
                      <li className="text-[#c8a45e] text-xs font-medium">
                        {isRTL ? "...والمزيد" : "...and more"}
                      </li>
                    )}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA Block */}
        <div className="mt-12 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-md backdrop-blur-sm sm:mt-14 sm:p-8 md:p-10">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-bold text-[#09142b] sm:text-xl" dir="auto">
              {t("getLegalConsultationNow")}
            </h3>
            <p className="mx-auto mb-6 max-w-xl text-sm text-slate-600 sm:text-base" dir="auto">
              {t("getLegalConsultationDesc")}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/request-service/legal-consultation"
                className="inline-flex min-h-[44px] min-w-[180px] items-center justify-center gap-2 rounded-xl bg-[#c8a45e] px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#b48b5a] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2"
              >
                <FiArrowLeft className={`h-4 w-4 shrink-0 ${isRTL ? "rotate-180" : ""}`} aria-hidden />
                {t("bookConsultationNow")}
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-[44px] min-w-[180px] items-center justify-center gap-2 rounded-xl border-2 border-[#09142b] bg-transparent px-6 py-3 font-semibold text-[#09142b] transition-all hover:bg-[#09142b] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#09142b] focus:ring-offset-2"
              >
                <FiPhone className="h-4 w-4 shrink-0" aria-hidden />
                {t("contactUs")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationBranchesSection;
