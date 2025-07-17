import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import FAQItem from "./FAQItem";

const FAQSection = () => {
  const { t, i18n } = useTranslation();
  let faqs = t("faq", { returnObjects: true }) || [];
  const isRTL = i18n.language === "ar";
  const [openIndex, setOpenIndex] = useState(null);

  // Ensure faqs is always an array
  if (!Array.isArray(faqs)) {
    faqs = [];
  }

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="w-full bg-[#faf6f0] py-16 px-4 md:px-8 border-t border-[#e7cfa7]"
    >
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#09142b] mb-4">
          {t("faqSectionTitle")}
        </h2>
      </div>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {Array.isArray(faqs) &&
          faqs.length > 0 &&
          faqs.map((faq, idx) => (
            <FAQItem
              key={idx}
              idx={idx}
              faq={faq}
              isOpen={openIndex === idx}
              onToggle={() => handleToggle(idx)}
              isRTL={isRTL}
            />
          ))}
      </div>
    </section>
  );
};

export default FAQSection;
