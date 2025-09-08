import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  FiStar,
  FiUsers,
  FiAward,
  FiClock,
  FiMessageSquare,
  FiLoader,
} from "react-icons/fi";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import TestimonialCard from "./TestimonialCard";
import testimonialService from "../../services/testimonialService";

const TestimonialsSection = () => {
  const { t, i18n } = useTranslation();
  const { scrollToSection } = useSmoothScroll();
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === "ar";

  const [activeTab, setActiveTab] = useState("all");

  // Fetch testimonials from API
  const {
    data: testimonialsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["publicTestimonials", currentLanguage, activeTab],
    queryFn: () => {
      const options = {
        language: currentLanguage,
        limit: 10,
      };

      if (activeTab !== "all") {
        options.rating = parseInt(activeTab);
      }

      return testimonialService.getPublicTestimonials(options);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch testimonial statistics
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["testimonialStats"],
    queryFn: testimonialService.getTestimonialStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Extract testimonials from API response
  const testimonials = testimonialsData?.data || [];
  const testimonialsStats = statsData?.data;

  const renderStars = (rating) => {
    if (!rating || rating === 0) return null;
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  // Loading state
  if (isLoading || statsLoading) {
    return (
      <section
        id="testimonials"
        className="w-full bg-[#f8fafc] py-16 px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c8a45e] rounded-full mb-6">
            <FiMessageSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#09142b] mb-4">
            {t("testimonialsTitle", "What Our Clients Say")}
          </h2>
          <div className="flex items-center justify-center h-64">
            <FiLoader className="animate-spin text-4xl text-blue-600" />
            <span className="mr-3 text-lg text-gray-600">
              جاري تحميل التوصيات...
            </span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || statsError) {
    return (
      <section
        id="testimonials"
        className="w-full bg-[#f8fafc] py-16 px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c8a45e] rounded-full mb-6">
            <FiMessageSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#09142b] mb-4">
            {t("testimonialsTitle", "What Our Clients Say")}
          </h2>
          <div className="text-center py-8">
            <div className="text-red-600 text-lg mb-2">
              خطأ في تحميل البيانات
            </div>
            <div className="text-gray-600">{error.message}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      className="w-full bg-[#f8fafc] py-16 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#c8a45e] rounded-full mb-6">
            <FiMessageSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#09142b] mb-4">
            {t("testimonialsTitle", "What Our Clients Say")}
          </h2>
          <p className="text-lg text-[#6b7280] max-w-3xl mx-auto">
            {t(
              "testimonialsDesc",
              "Discover why thousands of clients trust SOS Law for their legal needs. Read authentic reviews from satisfied customers across various industries."
            )}
          </p>
        </div>

        {/* Statistics */}
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded mx-auto mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : testimonialsStats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-3">
                <FiStar className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-[#09142b] mb-1">
                {testimonialsStats.averageRating || 0}
              </div>
              <div className="text-sm text-gray-600">
                {t("averageRating", "Average Rating")}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-[#09142b] mb-1">
                {(testimonialsStats.totalTestimonials || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {t("totalReviews", "Total Reviews")}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-3">
                <FiAward className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-[#09142b] mb-1">
                {testimonialsStats.satisfiedClients || 0}%
              </div>
              <div className="text-sm text-gray-600">
                {t("satisfiedClients", "Satisfied Clients")}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-3">
                <FiClock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-[#09142b] mb-1">
                {testimonialsStats.yearsOfService || 5}+
              </div>
              <div className="text-sm text-gray-600">
                {t("yearsOfService", "Years of Service")}
              </div>
            </div>
          </div>
        ) : null}

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["all", "5", "4", "3"].map((rating) => (
            <button
              key={rating}
              onClick={() => setActiveTab(rating)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === rating
                  ? "bg-[#c8a45e] text-white"
                  : "bg-white text-[#6b7280] hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {rating === "all"
                ? t("allReviews", "All Reviews")
                : `${rating} ${t("stars", "Stars")}`}
            </button>
          ))}
        </div>

        {/* Overall Rating Display */}
        {statsLoading ? (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white rounded-lg px-6 py-3 shadow-sm border border-gray-200">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <span className="h-6 bg-gray-200 rounded w-20 animate-pulse"></span>
              <span className="h-4 bg-gray-200 rounded w-32 animate-pulse"></span>
            </div>
          </div>
        ) : testimonialsStats ? (
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center gap-2 bg-white rounded-lg px-6 py-3 shadow-sm border border-gray-200 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex items-center gap-1 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {renderStars(testimonialsStats.averageRating)}
              </div>
              <span className="text-lg font-semibold text-[#09142b]">
                {testimonialsStats.averageRating || 0} {t("outOf", "out of")} 5
              </span>
              <span className="text-sm text-[#6b7280]">
                ({(testimonialsStats.totalTestimonials || 0).toLocaleString()}{" "}
                {t("reviews", "reviews")})
              </span>
            </div>
          </div>
        ) : null}

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                currentLanguage={currentLanguage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              لا توجد توصيات متاحة حالياً
            </div>
            <div className="text-gray-400 text-sm">
              سيتم عرض التوصيات هنا عند توفرها
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {t("testimonialsCTA", "Join Our Satisfied Clients")}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {t(
                "testimonialsCTADesc",
                "Experience the same level of excellence that our clients rave about. Get started with SOS Law today."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center px-8 py-3 bg-white text-[#c8a45e] font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FiUsers className={`${isRTL ? "ml-2" : "mr-2"}`} />
                {t("getStarted", "Get Started")}
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#c8a45e] transition-colors duration-200"
              >
                {t("viewServices", "View Services")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
