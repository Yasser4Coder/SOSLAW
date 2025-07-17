import React from "react";
import { useTranslation } from "react-i18next";

const ServiceCard = ({ icon: Icon, title, desc, subItems = [] }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  return (
    <article
      className="bg-white rounded-2xl shadow-md border border-[#e7cfa7] p-6 flex flex-col items-center text-center transition-transform duration-200 hover:scale-105 hover:shadow-lg focus-within:scale-105 focus-within:shadow-lg cursor-pointer min-h-64"
      tabIndex={0}
      aria-label={title}
    >
      <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[#faf6f0] border-2 border-[#c8a45e]">
        {Icon && (
          <Icon className="text-3xl text-[#c8a45e]" aria-hidden="true" />
        )}
      </div>
      <h3 className="text-lg font-bold text-[#c8a45e] mb-2">{title}</h3>
      {desc && <p className="text-[#09142b] text-sm opacity-80 mb-2">{desc}</p>}
      {subItems && subItems.length > 0 && (
        <ul
          className={`text-[#09142b] text-sm opacity-90 ${
            isRTL ? "text-right" : "text-left"
          } list-disc list-inside text-left mt-2 space-y-1 w-full max-w-xs mx-auto`}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {subItems.map((item) => (
            <li key={item.key}>{item.label}</li>
          ))}
        </ul>
      )}
    </article>
  );
};

export default ServiceCard;
