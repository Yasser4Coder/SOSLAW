import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiStar,
  FiUsers,
  FiAward,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi";
import TestimonialCard from "./TestimonialCard";
import { testimonials, testimonialsStats } from "./testimonialsData";

const TestimonialsSection = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === "ar";

  const [activeTab, setActiveTab] = useState("all");

  const filteredTestimonials =
    activeTab === "all"
      ? testimonials
      : testimonials.filter((t) => t.rating === parseInt(activeTab));

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-3">
              <FiStar className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-[#09142b] mb-1">
              {testimonialsStats.averageRating}
            </div>
            <div className="text-sm text-[#6b7280]">
              {t("averageRating", "Average Rating")}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-3">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-[#09142b] mb-1">
              {testimonialsStats.totalReviews.toLocaleString()}
            </div>
            <div className="text-sm text-[#6b7280]">
              {t("totalReviews", "Total Reviews")}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-3">
              <FiAward className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-[#09142b] mb-1">
              {testimonialsStats.satisfiedClients}%
            </div>
            <div className="text-sm text-[#6b7280]">
              {t("satisfiedClients", "Satisfied Clients")}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-[#c8a45e] rounded-full flex items-center justify-center mx-auto mb-3">
              <FiClock className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-[#09142b] mb-1">
              {testimonialsStats.yearsOfService}+
            </div>
            <div className="text-sm text-[#6b7280]">
              {t("yearsOfService", "Years of Service")}
            </div>
          </div>
        </div>

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
              {testimonialsStats.averageRating} {t("outOf", "out of")} 5
            </span>
            <span className="text-sm text-[#6b7280]">
              ({testimonialsStats.totalReviews.toLocaleString()}{" "}
              {t("reviews", "reviews")})
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              currentLanguage={currentLanguage}
            />
          ))}
        </div>

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
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-3 bg-white text-[#c8a45e] font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FiUsers className={`${isRTL ? "ml-2" : "mr-2"}`} />
                {t("getStarted", "Get Started")}
              </a>
              <a
                href="#services"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#c8a45e] transition-colors duration-200"
              >
                {t("viewServices", "View Services")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
