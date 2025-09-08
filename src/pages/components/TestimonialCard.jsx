import React from "react";
import { FiStar, FiCheckCircle, FiUser } from "react-icons/fi";
import Avatar from "../../components/common/Avatar";

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

  // Extract data based on current language
  const name =
    testimonial.name ||
    testimonial.nameAr ||
    testimonial.nameEn ||
    testimonial.nameFr;
  const role =
    testimonial.role ||
    testimonial.roleAr ||
    testimonial.roleEn ||
    testimonial.roleFr;
  const company =
    testimonial.company ||
    testimonial.companyAr ||
    testimonial.companyEn ||
    testimonial.companyFr;
  const review =
    testimonial.review ||
    testimonial.reviewAr ||
    testimonial.reviewEn ||
    testimonial.reviewFr;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Avatar
              src={testimonial.avatar}
              alt={name}
              name={name}
              size="lg"
              fallbackBg="gradient"
            />
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
            <p className="text-xs text-gray-500 truncate">{role}</p>
            <p className="text-xs text-[#c8a45e] font-medium truncate">
              {company}
            </p>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {renderStars(testimonial.rating)}
        <span className="text-sm text-gray-600 mr-2">
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
