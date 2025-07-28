import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { services } from "./components/servicesData";
import {
  FiArrowRight,
  FiCheck,
  FiStar,
  FiUsers,
  FiShield,
  FiEdit,
  FiFileText,
  FiGlobe,
  FiBriefcase,
  FiSearch,
  FiPhone,
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
  FiGlobe,
  FiSearch,
  FiBook,
  FiAward,
};

const ServicePage = () => {
  const { serviceId } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  // Scroll to top on route change
  useScrollToTop();

  // Find the service by converting route to key
  const service = services.find((s) => s.route === `/services/${serviceId}`);

  if (!service) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#09142b] mb-4">
            {isRTL ? "الخدمة غير موجودة" : "Service Not Found"}
          </h1>
          <Link
            to="/"
            className="px-6 py-3 bg-[#c8a45e] text-white font-semibold rounded-lg hover:bg-[#b48b5a] transition-colors duration-200"
          >
            {isRTL ? "العودة للرئيسية" : "Back to Home"}
          </Link>
        </div>
      </div>
    );
  }

  const Icon =
    service.icon === "FaGavel" ? iconMap.FaGavel : iconMap[service.icon];

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <Helmet>
        <title>{t(service.titleKey)} | SOSLAW</title>
        <meta name="description" content={t(service.descKey)} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#09142b] to-[#1a365d] text-white py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#c8a45e] hover:text-white transition-colors duration-200"
            >
              <FiArrowRight
                className={`transform ${isRTL ? "rotate-180" : ""}`}
              />
              <span>{isRTL ? "العودة للرئيسية" : "Back to Home"}</span>
            </Link>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#c8a45e] bg-opacity-20 border-2 border-[#c8a45e]">
              {Icon && <Icon className="text-4xl text-[#c8a45e]" />}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {t(service.titleKey)}
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                {t(service.descKey)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Content */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Features Section */}
              {service.features && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiStar className="text-[#c8a45e]" />
                    {isRTL ? "مجالات الاستشارة" : "Consultation Areas"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                        <p className="text-[#09142b] leading-relaxed">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formats Section */}
              {service.formats && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiUsers className="text-[#c8a45e]" />
                    {isRTL ? "صيغ الاستشارة" : "Consultation Formats"}
                  </h2>
                  <div className="space-y-4">
                    {service.formats.map((format, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] leading-relaxed">
                          {format}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What We Audit Section */}
              {service.whatWeAudit && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiShield className="text-[#c8a45e]" />
                    {isRTL ? "ما الذي نُدققه؟" : "What We Audit?"}
                  </h2>
                  <div className="space-y-4">
                    {service.whatWeAudit.map((item, index) => (
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
                    {isRTL ? "ماذا نوفر لك؟" : "What We Provide?"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.whatWeProvide.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
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
                    <FaGavel className="text-[#c8a45e]" />
                    {isRTL
                      ? "نحن نتدخل في حالات مثل"
                      : "We Intervene in Cases Like"}
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

              {/* What We Translate Section */}
              {service.whatWeTranslate && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiGlobe className="text-[#c8a45e]" />
                    {isRTL ? "نترجم باحتراف" : "We Translate Professionally"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.whatWeTranslate.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
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
                    {isRTL ? "الخدمات" : "Services"}
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
                    {isRTL ? "ماذا نفعل؟" : "What We Do?"}
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
                    {isRTL ? "نساعدك فورًا في" : "We Help You Immediately With"}
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
                    {isRTL ? "ماذا نقدم لك؟" : "What We Offer?"}
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
                    {isRTL
                      ? "للشركات والمقاولات"
                      : "For Companies and Contractors"}
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
                    {isRTL
                      ? "للمنصات والمواقع الإلكترونية"
                      : "For Platforms and Websites"}
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
                    <FiEdit className="text-[#c8a45e]" />
                    {isRTL ? "للتجار الإلكترونيين" : "For E-commerce Merchants"}
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

              {/* Features Section */}
              {service.features && service.key !== "legalConsultation" && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiStar className="text-[#c8a45e]" />
                    {isRTL ? "مميزات الخدمة" : "Service Features"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
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
                    <FaGavel className="text-[#c8a45e]" />
                    {isRTL ? "كيف نعمل؟" : "How We Work?"}
                  </h2>
                  <div className="space-y-4">
                    {service.process.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#c8a45e] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
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
                    <FiFileText className="text-[#c8a45e]" />
                    {isRTL ? "كيف نعمل؟" : "How We Work?"}
                  </h2>
                  <div className="space-y-4">
                    {service.howWeWork.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#c8a45e] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
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
                    {isRTL ? "اللغات المتوفرة" : "Available Languages"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {service.languages.map((item, index) => (
                      <div
                        key={index}
                        className="bg-[#faf6f0] p-4 rounded-lg text-center"
                      >
                        <p className="text-[#09142b] font-semibold">{item}</p>
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
                    {isRTL ? "مخرجات الخدمة" : "Service Outputs"}
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

              {/* Advantages Section */}
              {service.advantages && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiStar className="text-[#c8a45e]" />
                    {isRTL ? "مزايا هذه الخدمة" : "Advantages of This Service"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.advantages.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Includes Section */}
              {service.includes && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiSearch className="text-[#c8a45e]" />
                    {isRTL
                      ? "تشمل خدمة التدقيق القانوني"
                      : "Legal Audit Service Includes"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.includes.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits Section */}
              {service.benefits && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e7cfa7]">
                  <h2 className="text-2xl font-bold text-[#09142b] mb-6 flex items-center gap-3">
                    <FiStar className="text-[#c8a45e]" />
                    {isRTL ? "لماذا SOS LAW؟" : "Why SOS LAW?"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.benefits.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                        <p className="text-[#09142b] leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* For Whom Section */}
              {(service.forWhom ||
                service.forCompanies ||
                service.forPlatforms ||
                service.forEcommerce) && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#e7cfa7]">
                  <h3 className="text-xl font-bold text-[#09142b] mb-4 flex items-center gap-2">
                    <FiUsers className="text-[#c8a45e]" />
                    {isRTL ? "لمن هذه الخدمة؟" : "Who is this service for?"}
                  </h3>
                  <div className="space-y-3">
                    {(
                      service.forWhom ||
                      service.forCompanies ||
                      service.forPlatforms ||
                      service.forEcommerce
                    )?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-[#09142b] text-sm leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Section */}
              <div className="bg-gradient-to-br from-[#c8a45e] to-[#b48b5a] rounded-2xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-4">
                  {isRTL ? "جاهز للبدء؟" : "Ready to Start?"}
                </h3>
                <p className="text-sm mb-6 opacity-90">
                  {isRTL
                    ? "تواصل معنا الآن واحصل على استشارتك القانونية"
                    : "Contact us now and get your legal consultation"}
                </p>
                <Link
                  to="/contact"
                  className="inline-block px-6 py-3 bg-white text-[#c8a45e] font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  {isRTL ? "اطلب الخدمة الآن" : "Request Service Now"}
                </Link>
              </div>

              {/* Why Choose Us */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#e7cfa7]">
                <h3 className="text-xl font-bold text-[#09142b] mb-4 flex items-center gap-2">
                  <FiAward className="text-[#c8a45e]" />
                  {isRTL ? "لماذا تختار SOS LAW؟" : "Why Choose SOS LAW?"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                    <p className="text-[#09142b] text-sm">
                      {isRTL
                        ? "فريق قانوني محترف ومتخصص"
                        : "Professional and specialized legal team"}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                    <p className="text-[#09142b] text-sm">
                      {isRTL
                        ? "أسعار شفافة ومنافسة"
                        : "Transparent and competitive prices"}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                    <p className="text-[#09142b] text-sm">
                      {isRTL
                        ? "خدمة سريعة وفعالة"
                        : "Fast and efficient service"}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiCheck className="text-[#c8a45e] mt-1 flex-shrink-0" />
                    <p className="text-[#09142b] text-sm">
                      {isRTL
                        ? "سرية تامة وخصوصية"
                        : "Complete confidentiality and privacy"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
