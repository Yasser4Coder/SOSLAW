import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ServiceCard = ({ icon: Icon, title, desc, subItems = [], route }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <article
      className="bg-white rounded-2xl shadow-md border border-[#e7cfa7] p-6 flex flex-col items-center text-center transition-transform duration-200 hover:scale-105 hover:shadow-lg focus-within:scale-105 focus-within:shadow-lg min-h-80"
      tabIndex={0}
      aria-label={title}
    >
      <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[#faf6f0] border-2 border-[#c8a45e]">
        {Icon && (
          <Icon className="text-3xl text-[#c8a45e]" aria-hidden="true" />
        )}
      </div>
      <h3 className="text-lg font-bold text-[#c8a45e] mb-3">{title}</h3>
      {desc && (
        <p className="text-[#09142b] text-sm opacity-80 mb-4 leading-relaxed">
          {desc}
        </p>
      )}
      {subItems && subItems.length > 0 && (
        <ul
          className={`text-[#09142b] text-sm opacity-90 ${
            isRTL ? "text-right" : "text-left"
          } list-disc list-inside text-left mt-2 space-y-1 w-full max-w-xs mx-auto mb-6`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {subItems.slice(0, 3).map((item) => (
            <li key={item.key}>{item.label}</li>
          ))}
          {subItems.length > 3 && (
            <li className="text-[#c8a45e] font-medium">
              {isRTL ? "...والمزيد" : "...and more"}
            </li>
          )}
        </ul>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full mt-auto">
        {route && (
          <Link
            to={route}
            className="px-6 py-2 bg-[#c8a45e] text-white font-semibold rounded-lg hover:bg-[#b48b5a] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2"
            aria-label={isRTL ? "عرض المزيد" : "See More"}
          >
            {isRTL ? "عرض المزيد" : "See More"}
          </Link>
        )}
        <Link
          to="/contact"
          className="px-6 py-2 bg-white text-[#c8a45e] font-semibold rounded-lg border-2 border-[#c8a45e] hover:bg-[#faf6f0] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2"
          aria-label={isRTL ? "اطلب الخدمة" : "Request Service"}
        >
          {isRTL ? "اطلب الخدمة" : "Request Service"}
        </Link>
      </div>
    </article>
  );
};

export default ServiceCard;
