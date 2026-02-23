import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useScrollToTop } from "../hooks/useScrollToTop";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiBriefcase,
  FiPhone,
  FiTarget,
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

  const relatedServices = useMemo(() => {
    const currentTags = new Set(service.tags || []);
    const others = services
      .filter((s) => s.id !== service.id)
      .map((s) => {
        const tags = s.tags || [];
        const shared = tags.filter((t) => currentTags.has(t)).length;
        return { service: s, shared };
      })
      .sort((a, b) => b.shared - a.shared);
    return others.slice(0, 3).map(({ service: s }) => s);
  }, [service.id, service.tags]);

  // Helper function to render lists
  const renderList = (items) => {
    if (!items || !Array.isArray(items)) return null;

    return (
      <ul className="space-y-3" role="list">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3 items-start">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c8a45e]">
              <FiCheck className="h-3 w-3 text-white" aria-hidden />
            </span>
            <span className="text-slate-700 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  const stepLabel = t("step", "Step");

  // Helper function to render process steps
  const renderProcess = (steps) => {
    if (!steps || !Array.isArray(steps)) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#09142b] text-sm font-bold text-[#c8a45e]">
              {index + 1}
            </div>
            <div>
              <h4 className="font-semibold text-[#09142b] mb-1">{stepLabel} {index + 1}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{step}</p>
            </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keys.map((key) => (
          <div
            key={key}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h4 className="font-semibold text-[#09142b] mb-2 text-lg">{key}</h4>
            <p className="text-slate-600 leading-relaxed">
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

      <div className="min-h-screen bg-slate-100" dir={isRTL ? "rtl" : "ltr"}>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#09142b]"
          >
            <FiArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} aria-hidden />
            {t("backToHome", "Back to Home")}
          </Link>

          {/* Hero */}
          <div className="mb-10 flex flex-col items-center gap-8 rounded-2xl bg-[#09142b] px-6 py-10 text-white shadow-xl sm:flex-row sm:gap-10 sm:px-10 sm:py-12">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#1e3a5f] sm:h-28 sm:w-28">
              {service.image ? (
                <img src={service.image} className="h-full w-full object-cover" alt="" />
              ) : (
                (() => {
                  const Icon = service.icon;
                  return Icon ? <Icon className="h-12 w-12 text-[#c8a45e] sm:h-14 sm:w-14" /> : null;
                })()
              )}
            </div>
            <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-start">
              <h1 className="text-2xl font-bold text-[#c8a45e] sm:text-3xl md:text-4xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-slate-300 leading-relaxed">{description}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#1e3a5f] px-4 py-2 text-sm text-slate-200">
                  <FiClock className="h-4 w-4" aria-hidden />
                  {availability}
                </span>
                <Link
                  to={`/request-service/${service.id}`}
                  className="inline-flex items-center rounded-xl bg-[#c8a45e] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[#b48b5a] focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2 focus:ring-offset-[#09142b]"
                  aria-label={isRTL ? "اطلب الخدمة" : "Request Service"}
                >
                  {isRTL ? "اطلب الخدمة" : "Request Service"}
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            {/* Main content */}
            <div className="min-w-0 flex-1 space-y-8">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                  {t("serviceDetails", "Service Details")}
                </h2>
                <p className="text-slate-600 leading-relaxed">{details}</p>
              </section>

              {/* What We Translate/Provide - keep same structure, improve wrapper */}
            {/* What We Translate/Provide Section */}
              {service.what_we_translate && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("whatWeTranslate", "What We Translate")}
                  </h2>
                  {renderList(getLocalizedContent(service.what_we_translate))}
                </section>
              )}

              {service.what_we_provide && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("whatWeProvide", "What We Provide")}
                  </h2>
                  {renderList(getLocalizedContent(service.what_we_provide))}
                </section>
              )}

              {service.features && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("keyFeatures", "Key Features")}
                  </h2>
                  {renderList(getLocalizedContent(service.features))}
                </section>
              )}

              {service.process && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("ourProcess", "Our Process")}
                  </h2>
                  {renderProcess(getLocalizedContent(service.process))}
                </section>
              )}

              {service.difference_between && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("differenceBetween", "Difference Between")}
                  </h2>
                  {renderDifferenceComparison(service.difference_between)}
                </section>
              )}

              {service.cases_we_handle && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("casesWeHandle", "Cases We Handle")}
                  </h2>
                  {renderList(getLocalizedContent(service.cases_we_handle))}
                </section>
              )}

              {service.advantages && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("advantages", "Advantages")}
                  </h2>
                  {renderList(getLocalizedContent(service.advantages))}
                </section>
              )}

              {service.main_services && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("mainServices", "Main Services")}
                  </h2>
                  {renderList(getLocalizedContent(service.main_services))}
                </section>
              )}

              {service.additional_feature && (
                <section className="rounded-2xl bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] p-6 text-white shadow-sm sm:p-8">
                  <h3 className="text-xl font-bold mb-2">
                    {t("additionalFeature", "Additional Feature")}
                  </h3>
                  <p className="opacity-95 leading-relaxed">
                    {getLocalizedContent(service.additional_feature)}
                  </p>
                </section>
              )}

              {service.how_we_deliver && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("howWeDeliver", "How We Deliver")}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {getLocalizedContent(service.how_we_deliver)}
                  </p>
                </section>
              )}

              {service.modes && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("serviceModes", "Service Modes")}
                  </h2>
                  {renderList(getLocalizedContent(service.modes))}
                </section>
              )}

              {service.deliverables && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("deliverables", "Deliverables")}
                  </h2>
                  {renderList(getLocalizedContent(service.deliverables))}
                </section>
              )}

              {service.why_choose && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("whyChooseUs", "Why Choose Us")}
                  </h2>
                  {(() => {
                    const content = getLocalizedContent(service.why_choose);
                    const items = Array.isArray(content) ? content : [content];
                    if (items.length === 1 && typeof items[0] === "string") {
                      return (
                        <p className="text-slate-600 leading-relaxed">
                          {items[0]}
                        </p>
                      );
                    }
                    return (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {items.map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-5 text-center"
                          >
                            <div className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c8a45e]">
                              <FiCheck className="h-6 w-6 text-white" aria-hidden />
                            </div>
                            <p className="font-medium text-[#09142b]">{item}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </section>
              )}

              {service.supervision && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("supervision", "Supervision")}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {getLocalizedContent(service.supervision)}
                  </p>
                </section>
              )}

              {service.how_to_benefit && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("howToBenefit", "How to Benefit")}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {getLocalizedContent(service.how_to_benefit)}
                  </p>
                </section>
              )}

              {service.target_audience && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("targetAudience", "Target Audience")}
                  </h2>
                  {renderList(getLocalizedContent(service.target_audience))}
                </section>
              )}

              {service.what_we_offer && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("whatWeOffer", "What We Offer")}
                  </h2>
                  {renderList(getLocalizedContent(service.what_we_offer))}
                </section>
              )}

              {service.formats && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("formats", "Formats")}
                  </h2>
                  {typeof service.formats === "string" ? (
                    <p className="text-slate-600 leading-relaxed">
                      {getLocalizedContent(service.formats)}
                    </p>
                  ) : (
                    renderList(getLocalizedContent(service.formats))
                  )}
                </section>
              )}

              {service.tags && service.tags.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h3 className="text-lg font-bold text-[#09142b] mb-3">
                    {t("serviceTags", "Service Categories")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-[#09142b] px-4 py-1.5 text-sm font-medium text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Related services */}
              {relatedServices.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4 sm:text-2xl">
                    {t("relatedServices", "Related services")}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {relatedServices.map((related) => {
                      const RelatedIcon = related.icon;
                      const relatedTitle = getLocalizedContent(related.title);
                      const relatedDesc = getLocalizedContent(related.description);
                      return (
                        <Link
                          key={related.id}
                          to={`/services/${related.id}`}
                          className="group flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#c8a45e] hover:bg-amber-50/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2"
                        >
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#09142b] text-[#c8a45e] transition group-hover:bg-[#0b1a36]">
                            {related.image ? (
                              <img
                                src={related.image}
                                alt=""
                                className="h-8 w-8 rounded-lg object-cover"
                              />
                            ) : RelatedIcon ? (
                              <RelatedIcon className="h-6 w-6" aria-hidden />
                            ) : null}
                          </div>
                          <h3 className="font-semibold text-[#09142b] group-hover:text-[#b48b5a]">
                            {relatedTitle}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                            {relatedDesc}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#c8a45e]">
                            {t("learnMore", "Learn more")}
                            <FiArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} aria-hidden />
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* CTA */}
              <section className="rounded-2xl bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] p-6 text-white shadow-lg sm:p-8">
                <h2 className="text-xl font-bold mb-2 sm:text-2xl">
                  {t("readyToGetStarted", "Ready to Get Started?")}
                </h2>
                <p className="mb-6 opacity-95 max-w-xl">
                  {t(
                    "contactUsToday",
                    "Contact us today to discuss your legal needs and get started with our professional services."
                  )}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Link
                    to={`/request-service/${service.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#09142b] transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#b48b5a]"
                  >
                    <FiBriefcase className="h-5 w-5" aria-hidden />
                    {isRTL ? "اطلب الخدمة" : "Request this service"}
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-[#09142b] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#b48b5a]"
                  >
                    <FiPhone className="h-5 w-5" aria-hidden />
                    {t("requestService", "Request Service Now")}
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/80 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#b48b5a]"
                  >
                    <FiArrowRight className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} aria-hidden />
                    {t("backToHome", "Back to Home")}
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar: quick info + CTA (sticky on large screens, below header) */}
            <aside className="lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#09142b] mb-3">
                    {isRTL ? "معلومات سريعة" : "Quick info"}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-slate-600">
                      <FiClock className="h-5 w-5 shrink-0 text-[#c8a45e]" aria-hidden />
                      <span>{availability}</span>
                    </div>
                  </div>
                  <Link
                    to={`/request-service/${service.id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#09142b] px-4 py-3 font-semibold text-white transition hover:bg-[#0b1a36] focus:outline-none focus:ring-2 focus:ring-[#09142b] focus:ring-offset-2"
                  >
                    {isRTL ? "اطلب الخدمة" : "Request this service"}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicePage;
