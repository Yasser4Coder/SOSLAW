import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { FiLoader, FiMessageCircle } from "react-icons/fi";
import FAQItem from "./FAQItem";
import publicFaqService from "../../services/publicFaqService";
import categoryService from "../../services/categoryService";

const FAQSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const lang = i18n.language || "ar";

  const { data: categoriesData } = useQuery({
    queryKey: ["faqCategories"],
    queryFn: categoryService.getPublicCategories,
    staleTime: 10 * 60 * 1000,
  });

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
    staleTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const faqs = faqsData?.data || [];
  const categories = categoriesData?.data || [];

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setOpenIndex(null);
  };

  const sectionBg = {
    background: "linear-gradient(180deg, #faf8f5 0%, #faf6f0 30%, #faf6f0 100%)",
  };

  const loadingAndErrorContent = (
    <>
      <div className="relative z-10 max-w-3xl mx-auto text-center mb-10">
        <h2 className="mb-3 max-w-full break-words font-extrabold text-[#09142b] text-xl sm:mb-4 sm:text-2xl md:text-3xl lg:text-4xl">
          {t("faqSectionTitle")}
        </h2>
      </div>
    </>
  );

  if (isLoading) {
    return (
      <section
        id="faq"
        className="relative w-full overflow-hidden py-14 px-4 md:py-16 md:px-8"
        style={sectionBg}
      >
        <div className="pointer-events-none absolute inset-0 z-0 min-h-full" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 100% 50% at 50% -10%, rgba(200, 164, 94, 0.05) 0%, transparent 45%)",
            }}
          />
        </div>
        {loadingAndErrorContent}
        <div className="relative z-10 flex max-w-3xl mx-auto items-center justify-center py-12">
          <FiLoader className="h-10 w-10 animate-spin text-[#c8a45e]" aria-hidden />
          <span className="ms-3 text-[#09142b] text-sm sm:text-base">
            {t("loading", "جاري التحميل...")}
          </span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="faq"
        className="relative w-full overflow-hidden py-14 px-4 md:py-16 md:px-8"
        style={sectionBg}
      >
        <div className="pointer-events-none absolute inset-0 z-0 min-h-full" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 100% 50% at 50% -10%, rgba(200, 164, 94, 0.05) 0%, transparent 45%)",
            }}
          />
        </div>
        {loadingAndErrorContent}
        <div className="relative z-10 max-w-3xl mx-auto text-center py-12">
          <p className="text-red-600 font-medium mb-2">
            {t("errorLoadingData", "خطأ في تحميل البيانات")}
          </p>
          <p className="text-slate-600 text-sm sm:text-base">
            {error.message || t("tryAgainLater", "يرجى المحاولة مرة أخرى لاحقاً")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden py-14 px-4 md:py-18 md:px-8"
      style={sectionBg}
    >
      {/* Subtle background - one soft glow at top, no blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 min-h-full" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 60% at 50% -20%, rgba(200, 164, 94, 0.06) 0%, transparent 55%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#09142b] text-[#c8a45e] shadow-md">
            <FiMessageCircle className="h-6 w-6" aria-hidden />
          </div>
          <h2 className="mb-2 max-w-full break-words font-extrabold text-[#09142b] text-xl leading-tight sm:mb-3 sm:text-2xl md:text-3xl lg:text-4xl">
            {t("faqSectionTitle")}
          </h2>
          <p className="mx-auto max-w-xl break-words px-1 text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
            {t("faqSectionSubtitle", "إجابات على الأسئلة الأكثر شيوعاً")}
          </p>
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500 sm:text-sm">
              {t("filterByCategory", "تصفية حسب الفئة")}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange("all")}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2 min-h-[40px] ${
                  selectedCategory === "all"
                    ? "bg-[#09142b] text-white shadow-sm"
                    : "bg-white text-slate-700 shadow-sm border border-slate-200 hover:border-[#c8a45e]/50 hover:bg-slate-50"
                }`}
              >
                {t("allCategories", "جميع الفئات")}
              </button>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2 min-h-[40px] ${
                    selectedCategory === category.slug
                      ? "bg-[#09142b] text-white shadow-sm"
                      : "bg-white text-slate-700 shadow-sm border border-slate-200 hover:border-[#c8a45e]/50 hover:bg-slate-50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAQ list */}
        {faqs.length === 0 ? (
          <div className="rounded-xl border border-slate-200/80 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm">
            <p className="text-slate-600 text-sm sm:text-base">
              {selectedCategory === "all"
                ? t("noFAQsAvailable", "لا توجد أسئلة شائعة متاحة حالياً")
                : t("noFAQsInCategory", "لا توجد أسئلة في هذه الفئة")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            {faqs.map((faq, idx) => (
              <FAQItem
                key={faq.id}
                idx={idx}
                faq={{ q: faq.question, a: faq.answer }}
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
