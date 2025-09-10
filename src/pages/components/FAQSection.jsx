import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { FiLoader } from "react-icons/fi";
import FAQItem from "./FAQItem";
import publicFaqService from "../../services/publicFaqService";
import categoryService from "../../services/categoryService";

const FAQSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get current language
  const lang = i18n.language || "ar";

  // Fetch FAQ categories
  const { data: categoriesData } = useQuery({
    queryKey: ["faqCategories"],
    queryFn: categoryService.getPublicCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch FAQs from API
  const {
    data: faqsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["publicFAQs", lang, selectedCategory],
    queryFn: async () => {
      const result = await publicFaqService.getPublicFAQs({
        language: lang,
        limit: 10,
        category: selectedCategory === "all" ? undefined : selectedCategory,
      });
      return result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Extract FAQs from API response
  const faqs = faqsData?.data || [];
  const categories = categoriesData?.data || [];

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setOpenIndex(null); // Reset open FAQ when changing category
  };

  // Loading state
  if (isLoading) {
    return (
      <section
        id="faq"
        className="w-full bg-[#faf6f0] py-16 px-4 md:px-8 border-t border-[#e7cfa7]"
      >
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2
            className={`font-extrabold text-[#09142b] mb-4 ${
              isRTL ? "text-2xl md:text-4xl" : "text-3xl md:text-4xl"
            }`}
          >
            {t("faqSectionTitle")}
          </h2>
        </div>
        <div className="max-w-3xl mx-auto flex items-center justify-center py-8">
          <FiLoader className="animate-spin text-4xl text-[#c8a45e]" />
          <span
            className={`mr-3 text-[#09142b] ${
              isRTL ? "text-sm md:text-lg" : "text-lg"
            }`}
          >
            {t("loading", "جاري التحميل...")}
          </span>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        id="faq"
        className="w-full bg-[#faf6f0] py-16 px-4 md:px-8 border-t border-[#e7cfa7]"
      >
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2
            className={`font-extrabold text-[#09142b] mb-4 ${
              isRTL ? "text-2xl md:text-4xl" : "text-3xl md:text-4xl"
            }`}
          >
            {t("faqSectionTitle")}
          </h2>
        </div>
        <div className="max-w-3xl mx-auto text-center py-8">
          <div
            className={`text-red-600 mb-2 ${
              isRTL ? "text-base md:text-lg" : "text-lg"
            }`}
          >
            {t("errorLoadingData", "خطأ في تحميل البيانات")}
          </div>
          <div
            className={`text-gray-600 ${
              isRTL ? "text-sm md:text-base" : "text-base"
            }`}
          >
            {error.message ||
              t("tryAgainLater", "يرجى المحاولة مرة أخرى لاحقاً")}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="faq"
      className="w-full bg-[#faf6f0] py-16 px-4 md:px-8 border-t border-[#e7cfa7]"
    >
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2
          className={`font-extrabold text-[#09142b] mb-4 ${
            isRTL ? "text-2xl md:text-4xl" : "text-3xl md:text-4xl"
          }`}
        >
          {t("faqSectionTitle")}
        </h2>
        <p
          className={`text-[#09142b] opacity-80 ${
            isRTL ? "text-sm md:text-lg" : "text-lg"
          }`}
        >
          {t("faqSectionSubtitle", "إجابات على الأسئلة الأكثر شيوعاً")}
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                isRTL ? "text-xs md:text-sm" : "text-sm"
              } ${
                selectedCategory === "all"
                  ? "bg-[#c8a45e] text-white"
                  : "bg-white text-[#09142b] hover:bg-[#e7cfa7] border border-[#e7cfa7]"
              }`}
            >
              {t("allCategories", "جميع الفئات")}
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategoryChange(category.slug)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  isRTL ? "text-xs md:text-sm" : "text-sm"
                } ${
                  selectedCategory === category.slug
                    ? "bg-[#c8a45e] text-white"
                    : "bg-white text-[#09142b] hover:bg-[#e7cfa7] border border-[#e7cfa7]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAQs List */}
      <div className="max-w-3xl mx-auto">
        {faqs.length === 0 ? (
          <div className="text-center py-8">
            <div
              className={`text-gray-600 ${
                isRTL ? "text-base md:text-lg" : "text-lg"
              }`}
            >
              {selectedCategory === "all"
                ? t("noFAQsAvailable", "لا توجد أسئلة شائعة متاحة حالياً")
                : t("noFAQsInCategory", "لا توجد أسئلة في هذه الفئة")}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <FAQItem
                key={faq.id}
                idx={idx}
                faq={{
                  q: faq.question,
                  a: faq.answer,
                }}
                isOpen={openIndex === idx}
                onToggle={() => handleToggle(idx)}
                isRTL={isRTL}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
