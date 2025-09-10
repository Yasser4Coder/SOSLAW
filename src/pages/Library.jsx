import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import {
  FiArrowLeft,
  FiBook,
  FiClock,
  FiZap,
  FiTarget,
  FiStar,
  FiUsers,
  FiGlobe,
} from "react-icons/fi";

const Library = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === "ar";
  useScrollToTop();

  return (
    <>
      <Helmet>
        <title>{t("libraryPageTitle")} - SOSLAW</title>
        <meta name="description" content={t("libraryPageDesc")} />
        <html lang={currentLanguage} dir={isRTL ? "rtl" : "ltr"} />
      </Helmet>

      <div className="min-h-screen bg-[#f5f5f5]">
        {/* Header Navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className={`inline-flex items-center px-4 py-2 text-[#09142b] hover:text-[#c8a45e] transition-colors duration-200 ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                <FiArrowLeft className={`mr-2 ${isRTL ? "rotate-180" : ""}`} />
                {t("backToHome", "Back to Home")}
              </Link>
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link
                  to="/contact"
                  className={`inline-flex items-center px-6 py-2 bg-[#09142b] text-white font-semibold rounded-lg hover:bg-[#1a2a4a] transition-colors duration-200 ${
                    isRTL ? "text-sm md:text-base" : "text-base"
                  }`}
                >
                  {t("getStarted", "Get Started")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Coming Soon Header */}
          <div className="text-center mb-16">
            <div className="w-24 h-24 bg-gradient-to-br from-[#c8a45e] to-[#b48b5a] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <FiBook className="w-12 h-12 text-white" />
            </div>
            <h1
              className={`font-bold text-[#09142b] mb-6 ${
                isRTL ? "text-3xl md:text-5xl" : "text-4xl md:text-5xl"
              }`}
            >
              {t("libraryComingSoon", "Legal Library")}
            </h1>
            <p
              className={`text-[#6b7280] max-w-3xl mx-auto leading-relaxed ${
                isRTL ? "text-sm md:text-xl" : "text-xl"
              }`}
            >
              {t(
                "libraryComingSoonDesc",
                "Our comprehensive legal resource center is currently under development. We're building something extraordinary for legal professionals, students, and anyone seeking legal knowledge."
              )}
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBook className="w-6 h-6 text-white" />
              </div>
              <h3
                className={`font-semibold text-[#09142b] mb-2 ${
                  isRTL ? "text-base md:text-lg" : "text-lg"
                }`}
              >
                {t("libraryFeature1Title", "Legal Resources")}
              </h3>
              <p
                className={`text-[#6b7280] ${
                  isRTL ? "text-xs md:text-sm" : "text-sm"
                }`}
              >
                {t(
                  "libraryFeature1Desc",
                  "Comprehensive collection of legal documents, templates, and guides"
                )}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiGlobe className="w-6 h-6 text-white" />
              </div>
              <h3
                className={`font-semibold text-[#09142b] mb-2 ${
                  isRTL ? "text-base md:text-lg" : "text-lg"
                }`}
              >
                {t("libraryFeature2Title", "Multilingual")}
              </h3>
              <p
                className={`text-[#6b7280] ${
                  isRTL ? "text-xs md:text-sm" : "text-sm"
                }`}
              >
                {t(
                  "libraryFeature2Desc",
                  "Legal resources available in Arabic, French, and English"
                )}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <h3
                className={`font-semibold text-[#09142b] mb-2 ${
                  isRTL ? "text-base md:text-lg" : "text-lg"
                }`}
              >
                {t("libraryFeature3Title", "Expert Content")}
              </h3>
              <p
                className={`text-[#6b7280] ${
                  isRTL ? "text-xs md:text-sm" : "text-sm"
                }`}
              >
                {t(
                  "libraryFeature3Desc",
                  "Curated by legal professionals and experts"
                )}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiZap className="w-6 h-6 text-white" />
              </div>
              <h3
                className={`font-semibold text-[#09142b] mb-2 ${
                  isRTL ? "text-base md:text-lg" : "text-lg"
                }`}
              >
                {t("libraryFeature4Title", "Quick Access")}
              </h3>
              <p
                className={`text-[#6b7280] ${
                  isRTL ? "text-xs md:text-sm" : "text-sm"
                }`}
              >
                {t(
                  "libraryFeature4Desc",
                  "Fast and easy access to legal information"
                )}
              </p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-16">
            <div className="text-center mb-8">
              <h2
                className={`font-bold text-[#09142b] mb-4 ${
                  isRTL ? "text-xl md:text-2xl" : "text-2xl"
                }`}
              >
                {t("libraryProgressTitle", "Development Progress")}
              </h2>
              <p
                className={`text-[#6b7280] ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                {t(
                  "libraryProgressDesc",
                  "We're working hard to bring you the best legal resource center"
                )}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`font-medium text-[#09142b] ${
                    isRTL ? "text-xs md:text-sm" : "text-sm"
                  }`}
                >
                  {t("libraryProgressLabel", "Development Progress")}
                </span>
                <span
                  className={`font-medium text-[#c8a45e] ${
                    isRTL ? "text-xs md:text-sm" : "text-sm"
                  }`}
                >
                  75%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* What's Coming Section */}
          <div className="bg-gradient-to-r from-[#2d3748] to-[#1a2a4a] rounded-lg p-8 text-white mb-16">
            <div className="text-center mb-8">
              <h2
                className={`font-bold mb-4 ${
                  isRTL ? "text-xl md:text-2xl" : "text-2xl"
                }`}
              >
                {t("libraryWhatsComingTitle", "What's Coming")}
              </h2>
              <p
                className={`text-gray-300 ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                {t(
                  "libraryWhatsComingDesc",
                  "Discover what we're building for you"
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <FiStar className="text-[#c8a45e] mt-1 mr-3 flex-shrink-0 w-5 h-5" />
                <div>
                  <h3
                    className={`font-semibold mb-2 ${
                      isRTL ? "text-sm md:text-base" : "text-base"
                    }`}
                  >
                    {t("libraryComing1Title", "Legal Document Templates")}
                  </h3>
                  <p
                    className={`text-gray-300 ${
                      isRTL ? "text-xs md:text-sm" : "text-sm"
                    }`}
                  >
                    {t(
                      "libraryComing1Desc",
                      "Ready-to-use templates for contracts, agreements, and legal documents"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <FiTarget className="text-[#c8a45e] mt-1 mr-3 flex-shrink-0 w-5 h-5" />
                <div>
                  <h3
                    className={`font-semibold mb-2 ${
                      isRTL ? "text-sm md:text-base" : "text-base"
                    }`}
                  >
                    {t("libraryComing2Title", "Case Studies")}
                  </h3>
                  <p
                    className={`text-gray-300 ${
                      isRTL ? "text-xs md:text-sm" : "text-sm"
                    }`}
                  >
                    {t(
                      "libraryComing2Desc",
                      "Real-world legal cases with analysis and insights"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <FiClock className="text-[#c8a45e] mt-1 mr-3 flex-shrink-0 w-5 h-5" />
                <div>
                  <h3
                    className={`font-semibold mb-2 ${
                      isRTL ? "text-sm md:text-base" : "text-base"
                    }`}
                  >
                    {t("libraryComing3Title", "Legal Updates")}
                  </h3>
                  <p
                    className={`text-gray-300 ${
                      isRTL ? "text-xs md:text-sm" : "text-sm"
                    }`}
                  >
                    {t(
                      "libraryComing3Desc",
                      "Stay updated with the latest legal developments and changes"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <FiBook className="text-[#c8a45e] mt-1 mr-3 flex-shrink-0 w-5 h-5" />
                <div>
                  <h3
                    className={`font-semibold mb-2 ${
                      isRTL ? "text-sm md:text-base" : "text-base"
                    }`}
                  >
                    {t("libraryComing4Title", "Educational Resources")}
                  </h3>
                  <p
                    className={`text-gray-300 ${
                      isRTL ? "text-xs md:text-sm" : "text-sm"
                    }`}
                  >
                    {t(
                      "libraryComing4Desc",
                      "Comprehensive guides and tutorials for legal professionals"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-8">
              <h2
                className={`font-bold text-[#09142b] mb-4 ${
                  isRTL ? "text-xl md:text-2xl" : "text-2xl"
                }`}
              >
                {t("libraryCTATitle", "Stay Updated")}
              </h2>
              <p
                className={`text-[#6b7280] mb-6 max-w-2xl mx-auto ${
                  isRTL ? "text-sm md:text-base" : "text-base"
                }`}
              >
                {t(
                  "libraryCTADesc",
                  "Be the first to know when our legal library launches. Get early access and exclusive content."
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className={`inline-flex items-center px-8 py-3 bg-[#c8a45e] text-white font-semibold rounded-lg hover:bg-[#b48b5a] transition-colors duration-200 ${
                    isRTL ? "text-sm md:text-base" : "text-base"
                  }`}
                >
                  <FiUsers className="mr-2" />
                  {t("libraryCTAButton", "Get Early Access")}
                </Link>
                <Link
                  to="/"
                  className={`inline-flex items-center px-8 py-3 border-2 border-[#c8a45e] text-[#c8a45e] font-semibold rounded-lg hover:bg-[#c8a45e] hover:text-white transition-colors duration-200 ${
                    isRTL ? "text-sm md:text-base" : "text-base"
                  }`}
                >
                  <FiArrowLeft
                    className={`mr-2 ${isRTL ? "rotate-180" : ""}`}
                  />
                  {t("backToHome", "Back to Home")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Library;
