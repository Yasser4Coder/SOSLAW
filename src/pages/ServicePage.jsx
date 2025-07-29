import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { services } from "./components/servicesData";
import {
  FiArrowLeft,
  FiBriefcase,
  FiSearch,
  FiPhone,
  FiBook,
  FiGlobe,
  FiCheck,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiFileText,
  FiEdit,
  FiBell,
  FiShield,
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
  FiTrendingUp,
};

const ServicePage = () => {
  const { serviceId } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  useScrollToTop();

  // Find the service by route
  const service = services.find((s) => s.route === `/services/${serviceId}`);

  if (!service) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#09142b] mb-4">
            {t("serviceNotFound")}
          </h1>
          <p className="text-[#6b7280] mb-6">{t("serviceNotFoundDesc")}</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-[#c8a45e] text-white font-semibold rounded-lg hover:bg-[#b48b5a] transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            {t("backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent =
    service.icon === "FaGavel" ? iconMap.FaGavel : iconMap[service.icon];

  return (
    <>
      <Helmet>
        <title>{t(service.titleKey)} - SOSLAW</title>
        <meta name="description" content={t(service.descKey)} />
        <html lang={i18n.language} dir={isRTL ? "rtl" : "ltr"} />
      </Helmet>

      <div className="min-h-screen bg-[#faf6f0]">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-[#e7cfa7]">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 text-[#09142b] hover:text-[#c8a45e] transition-colors duration-200"
                >
                  <FiArrowLeft className="mr-2" />
                  {t("backToServices")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          {/* Service Header */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-[#e7cfa7] mb-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Icon */}
              <div className="bg-[#c8a45e] text-white p-6 rounded-2xl shadow-lg">
                <IconComponent size={48} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-[#09142b] mb-4">
                  {t(service.titleKey)}
                </h1>
                <p className="text-[#6b7280] text-lg leading-relaxed mb-6">
                  {t(service.descKey)}
                </p>

                {/* CTA Button */}
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-3 bg-[#c8a45e] text-white font-semibold rounded-lg hover:bg-[#b48b5a] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2"
                >
                  {t("requestService")}
                </Link>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Features Section */}
              {service.features && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiCheck className="text-[#c8a45e]" />
                    {t("serviceFeatures")}
                  </h2>
                  <div className="space-y-4">
                    {service.features.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Section */}
              {service.services && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiBriefcase className="text-[#c8a45e]" />
                    {t("services")}
                  </h2>
                  <div className="space-y-4">
                    {service.services.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What We Do Section */}
              {service.whatWeDo && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiSearch className="text-[#c8a45e]" />
                    {t("whatWeDo")}
                  </h2>
                  <div className="space-y-4">
                    {service.whatWeDo.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What We Help Section */}
              {service.whatWeHelp && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiPhone className="text-[#c8a45e]" />
                    {t("whatWeHelp")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.whatWeHelp.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What We Offer Section */}
              {service.whatWeOffer && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiBook className="text-[#c8a45e]" />
                    {t("whatWeOffer")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.whatWeOffer.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* For Companies Section */}
              {service.forCompanies && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiBriefcase className="text-[#c8a45e]" />
                    {t("forCompanies")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.forCompanies.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* For Platforms Section */}
              {service.forPlatforms && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiGlobe className="text-[#c8a45e]" />
                    {t("forPlatforms")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.forPlatforms.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* For E-commerce Section */}
              {service.forEcommerce && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiTrendingUp className="text-[#c8a45e]" />
                    {t("forEcommerce")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.forEcommerce.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Includes Section */}
              {service.includes && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiCheck className="text-[#c8a45e]" />
                    {t("serviceIncludes")}
                  </h2>
                  <div className="space-y-4">
                    {service.includes.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outputs Section */}
              {service.outputs && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiFileText className="text-[#c8a45e]" />
                    {t("serviceOutputs")}
                  </h2>
                  <div className="space-y-4">
                    {service.outputs.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* For Whom Section */}
              {service.forWhom && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiUsers className="text-[#c8a45e]" />
                    {t("forWhom")}
                  </h2>
                  <div className="space-y-4">
                    {service.forWhom.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cases Section */}
              {service.cases && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiBriefcase className="text-[#c8a45e]" />
                    {t("serviceCases")}
                  </h2>
                  <div className="space-y-4">
                    {service.cases.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process Section */}
              {service.process && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiAward className="text-[#c8a45e]" />
                    {t("serviceProcess")}
                  </h2>
                  <div className="space-y-4">
                    {service.process.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advantages Section */}
              {service.advantages && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiCheck className="text-[#c8a45e]" />
                    {t("serviceAdvantages")}
                  </h2>
                  <div className="space-y-4">
                    {service.advantages.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What We Provide Section */}
              {service.whatWeProvide && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiFileText className="text-[#c8a45e]" />
                    {t("whatWeProvide")}
                  </h2>
                  <div className="space-y-4">
                    {service.whatWeProvide.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How We Work Section */}
              {service.howWeWork && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiAward className="text-[#c8a45e]" />
                    {t("howWeWork")}
                  </h2>
                  <div className="space-y-4">
                    {service.howWeWork.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages Section */}
              {service.languages && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiGlobe className="text-[#c8a45e]" />
                    {t("serviceLanguages")}
                  </h2>
                  <div className="space-y-4">
                    {service.languages.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What We Translate Section */}
              {service.whatWeTranslate && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiEdit className="text-[#c8a45e]" />
                    {t("whatWeTranslate")}
                  </h2>
                  <div className="space-y-4">
                    {service.whatWeTranslate.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicePage;
