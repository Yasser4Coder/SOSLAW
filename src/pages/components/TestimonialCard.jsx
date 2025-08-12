import React from "react";
import { FiStar, FiCheckCircle, FiUser } from "react-icons/fi";

const TestimonialCard = ({ testimonial, currentLanguage }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const name = testimonial.name[currentLanguage] || testimonial.name.en;
  const role = testimonial.role[currentLanguage] || testimonial.role.en;
  const company =
    testimonial.company[currentLanguage] || testimonial.company.en;
  const review = testimonial.review[currentLanguage] || testimonial.review.en;

  // Check if avatar is a URL or emoji
  const isImageUrl =
    testimonial.avatar && testimonial.avatar.startsWith("http");

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {isImageUrl ? (
              <img
                src={testimonial.avatar}
                alt={name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                loading="lazy"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            {/* Fallback icon - hidden by default if image is provided */}
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br from-[#c8a45e] to-[#b48b5a] flex items-center justify-center text-white text-lg font-semibold ${
                isImageUrl ? "hidden" : "flex"
              }`}
            >
              {isImageUrl ? <FiUser className="w-6 h-6" /> : testimonial.avatar}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#09142b] text-sm truncate">
                {name}
              </h3>
              {testimonial.verified && (
                <FiCheckCircle className="w-4 h-4 text-[#c8a45e] flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-[#6b7280] truncate">{role}</p>
            <p className="text-xs text-[#c8a45e] font-medium truncate">
              {company}
            </p>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {renderStars(testimonial.rating)}
        <span className="text-sm text-[#6b7280] ml-2">
          {testimonial.rating}.0
        </span>
      </div>

      {/* Review Text */}
      <p className="text-[#09142b] text-sm leading-relaxed line-clamp-4">
        "{review}"
      </p>
    </div>
  );
};

export default TestimonialCard;
