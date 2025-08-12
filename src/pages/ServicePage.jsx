import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useScrollToTop } from "../hooks/useScrollToTop";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiUsers,
  FiFileText,
  FiTarget,
  FiAward,
  FiShield,
  FiGlobe,
  FiBook,
  FiBriefcase,
  FiStar,
  FiPhone,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { services } from "./components/servicesData";

const ServicePage = () => {
  const { serviceId } = useParams();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === "ar";
  useScrollToTop();

  // Find the service by ID
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiTarget className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#09142b] mb-4">
              Service Not Found
            </h1>
            <p className="text-[#6b7280] mb-8 leading-relaxed">
              The requested service could not be found.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-[#c8a45e] text-white font-semibold rounded-lg hover:bg-[#b48b5a] transition-colors duration-200"
            >
              <FiArrowLeft className={`mr-2 ${isRTL ? "rotate-180" : ""}`} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get localized content
  const getLocalizedContent = (field) => {
    if (typeof field === "string") return field;
    if (typeof field === "object" && field[currentLanguage]) {
      return field[currentLanguage];
    }
    return field.en || field.ar || field.fr || "";
  };

  const title = getLocalizedContent(service.title);
  const description = getLocalizedContent(service.description);
  const details = getLocalizedContent(service.details);
  const availability = getLocalizedContent(service.availability);

  // Helper function to render lists
  const renderList = (items) => {
    if (!items || !Array.isArray(items)) return null;

    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start">
            <div className="w-5 h-5 bg-[#c8a45e] rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
              <FiCheck className="w-3 h-3 text-white" />
            </div>
            <p className="text-[#09142b] leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    );
  };

  // Helper function to render process steps
  const renderProcess = (steps) => {
    if (!steps || !Array.isArray(steps)) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#c8a45e] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">
                  {index + 1}
                </span>
              </div>
              <h4 className="font-semibold text-[#09142b]">Step {index + 1}</h4>
            </div>
            <p className="text-[#6b7280] text-sm leading-relaxed">{step}</p>
          </div>
        ))}
      </div>
    );
  };

  // Helper function to render difference comparison
  const renderDifferenceComparison = (differenceData) => {
    if (!differenceData || typeof differenceData !== "object") return null;

    const keys = Object.keys(differenceData);
    if (keys.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {keys.map((key) => (
          <div
            key={key}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <h4 className="font-semibold text-[#09142b] mb-3 text-lg">{key}</h4>
            <p className="text-[#6b7280] leading-relaxed">
              {getLocalizedContent(differenceData[key])}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{title} - SOSLAW</title>
        <meta name="description" content={description} />
        <html lang={currentLanguage} dir={isRTL ? "rtl" : "ltr"} />
      </Helmet>

      <div className="min-h-screen bg-[#f5f5f5]">
        {/* Header Navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 text-[#09142b] hover:text-[#c8a45e] transition-colors duration-200"
              >
                <FiArrowLeft className={`mr-2 ${isRTL ? "rotate-180" : ""}`} />
                {t("backToHome", "Back to Home")}
              </Link>
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-2 bg-[#09142b] text-white font-semibold rounded-lg hover:bg-[#1a2a4a] transition-colors duration-200"
                >
                  {t("getStarted", "Get Started")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Service Header */}
          <div className="bg-gradient-to-r from-[#2d3748] to-[#1a2a4a] text-white rounded-lg p-8 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBriefcase className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-4">
                {description}
              </p>
              <div className="flex items-center justify-center text-sm text-gray-300">
                <FiClock className="mr-2" />
                {availability}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-[#09142b] mb-6">
              {t("serviceDetails", "Service Details")}
            </h2>
            <p className="text-[#6b7280] leading-relaxed text-lg">{details}</p>
          </div>

          {/* What We Translate/Provide Section */}
          {service.what_we_translate && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("whatWeTranslate", "What We Translate")}
              </h2>
              {renderList(getLocalizedContent(service.what_we_translate))}
            </div>
          )}

          {service.what_we_provide && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("whatWeProvide", "What We Provide")}
              </h2>
              {renderList(getLocalizedContent(service.what_we_provide))}
            </div>
          )}

          {/* Features Section */}
          {service.features && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("keyFeatures", "Key Features")}
              </h2>
              {renderList(getLocalizedContent(service.features))}
            </div>
          )}

          {/* Process Section */}
          {service.process && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("ourProcess", "Our Process")}
              </h2>
              {renderProcess(getLocalizedContent(service.process))}
            </div>
          )}

          {/* Difference Between Section */}
          {service.difference_between && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("differenceBetween", "Difference Between")}
              </h2>
              {renderDifferenceComparison(service.difference_between)}
            </div>
          )}

          {/* Cases We Handle Section */}
          {service.cases_we_handle && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("casesWeHandle", "Cases We Handle")}
              </h2>
              {renderList(getLocalizedContent(service.cases_we_handle))}
            </div>
          )}

          {/* Advantages Section */}
          {service.advantages && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("advantages", "Advantages")}
              </h2>
              {renderList(getLocalizedContent(service.advantages))}
            </div>
          )}

          {/* Main Services Section (for nursery package) */}
          {service.main_services && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("mainServices", "Main Services")}
              </h2>
              {renderList(getLocalizedContent(service.main_services))}
            </div>
          )}

          {/* Additional Features */}
          {service.additional_feature && (
            <div className="bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] rounded-lg p-8 text-white mb-8">
              <h3 className="text-xl font-bold mb-4">
                {t("additionalFeature", "Additional Feature")}
              </h3>
              <p className="text-lg opacity-90">
                {getLocalizedContent(service.additional_feature)}
              </p>
            </div>
          )}

          {/* How We Deliver Section */}
          {service.how_we_deliver && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("howWeDeliver", "How We Deliver")}
              </h2>
              <p className="text-[#6b7280] leading-relaxed text-lg">
                {getLocalizedContent(service.how_we_deliver)}
              </p>
            </div>
          )}

          {/* Why Choose Us Section */}
          {service.why_choose && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("whyChooseUs", "Why Choose Us")}
              </h2>
              <p className="text-[#6b7280] leading-relaxed text-lg">
                {getLocalizedContent(service.why_choose)}
              </p>
            </div>
          )}

          {/* Supervision Section */}
          {service.supervision && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("supervision", "Supervision")}
              </h2>
              <p className="text-[#6b7280] leading-relaxed text-lg">
                {getLocalizedContent(service.supervision)}
              </p>
            </div>
          )}

          {/* How to Benefit Section */}
          {service.how_to_benefit && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("howToBenefit", "How to Benefit")}
              </h2>
              <p className="text-[#6b7280] leading-relaxed text-lg">
                {getLocalizedContent(service.how_to_benefit)}
              </p>
            </div>
          )}

          {/* Modes Section */}
          {service.modes && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("serviceModes", "Service Modes")}
              </h2>
              {renderList(getLocalizedContent(service.modes))}
            </div>
          )}

          {/* Deliverables Section */}
          {service.deliverables && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("deliverables", "Deliverables")}
              </h2>
              {renderList(getLocalizedContent(service.deliverables))}
            </div>
          )}

          {/* Target Audience Section */}
          {service.target_audience && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("targetAudience", "Target Audience")}
              </h2>
              {renderList(getLocalizedContent(service.target_audience))}
            </div>
          )}

          {/* What We Offer Section */}
          {service.what_we_offer && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("whatWeOffer", "What We Offer")}
              </h2>
              {renderList(getLocalizedContent(service.what_we_offer))}
            </div>
          )}

          {/* Formats Section */}
          {service.formats && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-[#09142b] mb-6">
                {t("formats", "Formats")}
              </h2>
              {typeof service.formats === "string" ? (
                <p className="text-[#6b7280] leading-relaxed text-lg">
                  {getLocalizedContent(service.formats)}
                </p>
              ) : (
                renderList(getLocalizedContent(service.formats))
              )}
            </div>
          )}

          {/* Tags Section */}
          {service.tags && (
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h3 className="text-xl font-bold text-[#09142b] mb-4">
                {t("serviceTags", "Service Categories")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#c8a45e] text-white text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              {t("readyToGetStarted", "Ready to Get Started?")}
            </h2>
            <p className="text-lg mb-6 opacity-90">
              {t(
                "contactUsToday",
                "Contact us today to discuss your legal needs and get started with our professional services."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-3 bg-white text-[#c8a45e] font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
              >
                <FiPhone className="mr-2" />
                {t("requestService", "Request Service Now")}
              </Link>
              <Link
                to="/"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#c8a45e] transition-colors duration-200 text-lg"
              >
                <FiArrowRight className={`mr-2 ${isRTL ? "rotate-180" : ""}`} />
                {t("backToHome", "Back to Home")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicePage;
