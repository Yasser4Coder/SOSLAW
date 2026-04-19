import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ConsultantCard from "./ConsultantCard";
import { useTranslation } from "react-i18next";
import publicConsultantService from "../../services/publicConsultantService";
import { FiLoader, FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ConsultantsSection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "ar";
  const isRTL = lang === "ar";

  // Manual test function
  const testApiCall = async () => {
    try {
      const result = await publicConsultantService.getAllConsultants({
        language: lang,
        status: "active",
        limit: 10,
      });
    } catch (error) {
      console.error("🔍 Manual API call error:", error);
    }
  };

  // Fetch consultants from API
  const {
    data: consultantsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["publicConsultants", lang, "active"],
    queryFn: async () => {
      const result = await publicConsultantService.getAllConsultants({
        language: lang,
        status: "active",
        limit: 10,
      });
      return result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Extract consultants from API response
  const consultants = consultantsData?.data?.consultants || [];

  // Loading state
  if (isLoading) {
    return (
      <section
        id="consultants"
        className="relative w-full overflow-hidden py-16 px-4 md:px-8"
        style={{ background: "linear-gradient(165deg, #f5f0e8 0%, #faf6f0 35%, #f2ebe0 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0 z-0 min-h-full" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(200, 164, 94, 0.22) 0%, transparent 55%)",
            }}
          />
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#c8a45e] opacity-20 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center mb-12">
          <h2
            className={`font-extrabold text-[#09142b] mb-4 ${
              lang === "ar" ? "text-2xl md:text-4xl" : "text-3xl md:text-4xl"
            }`}
          >
            {t("consultantsTitle")}
          </h2>
          <p
            className={`text-[#6b7280] max-w-2xl mx-auto ${
              lang === "ar" ? "text-sm md:text-lg" : "text-base md:text-lg"
            }`}
          >
            {t("consultantsDesc")}
          </p>
        </div>
        <div className="relative z-10 flex items-center justify-center h-64">
          <FiLoader className="animate-spin text-4xl text-blue-600" />
          <span
            className={`mr-3 text-gray-600 ${
              lang === "ar" ? "text-sm md:text-lg" : "text-lg"
            }`}
          >
            جاري تحميل المستشارين...
          </span>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        id="consultants"
        className="relative w-full overflow-hidden py-16 px-4 md:px-8"
        style={{ background: "linear-gradient(165deg, #f5f0e8 0%, #faf6f0 35%, #f2ebe0 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0 z-0 min-h-full" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 70% 50% at 100% 100%, rgba(9, 20, 43, 0.14) 0%, transparent 50%)",
            }}
          />
          <div className="absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-[#09142b] opacity-15 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center mb-12">
          <h2
            className={`font-extrabold text-[#09142b] mb-4 ${
              lang === "ar" ? "text-2xl md:text-4xl" : "text-3xl md:text-4xl"
            }`}
          >
            {t("consultantsTitle")}
          </h2>
          <p
            className={`text-[#6b7280] max-w-2xl mx-auto ${
              lang === "ar" ? "text-sm md:text-lg" : "text-base md:text-lg"
            }`}
          >
            {t("consultantsDesc")}
          </p>
        </div>
        <div className="relative z-10 text-center py-8">
          <div
            className={`text-red-600 mb-2 ${
              lang === "ar" ? "text-base md:text-lg" : "text-lg"
            }`}
          >
            خطأ في تحميل البيانات
          </div>
          <div
            className={`text-gray-600 ${
              lang === "ar" ? "text-sm md:text-base" : "text-base"
            }`}
          >
            {error.message}
          </div>
        </div>
      </section>
    );
  }

  // No consultants state
  if (!consultants || consultants.length === 0) {
    return (
      <section
        id="consultants"
        className="relative w-full overflow-hidden py-16 px-4 md:px-8"
        style={{ background: "linear-gradient(165deg, #f5f0e8 0%, #faf6f0 35%, #f2ebe0 100%)" }}
      >
        <div className="pointer-events-none absolute inset-0 z-0 min-h-full" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(200, 164, 94, 0.22) 0%, transparent 55%)",
            }}
          />
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#c8a45e] opacity-20 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto text-center mb-12">
          <h2
            className={`font-extrabold text-[#09142b] mb-4 ${
              lang === "ar" ? "text-2xl md:text-4xl" : "text-3xl md:text-4xl"
            }`}
          >
            {t("consultantsTitle")}
          </h2>
          <p
            className={`text-[#6b7280] max-w-2xl mx-auto ${
              lang === "ar" ? "text-sm md:text-lg" : "text-base md:text-lg"
            }`}
          >
            {t("consultantsDesc")}
          </p>
        </div>
        <div className="relative z-10 text-center py-8">
          <div
            className={`text-gray-600 mb-4 ${
              lang === "ar" ? "text-base md:text-lg" : "text-lg"
            }`}
          >
            لا يوجد مستشارين متاحين حالياً
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="consultants"
      className="relative w-full overflow-hidden py-16 px-4 md:px-8"
      style={{
        background: "linear-gradient(165deg, #f5f0e8 0%, #faf6f0 35%, #f2ebe0 100%)",
      }}
    >
      {/* Background effects - decorative only */}
      <div className="pointer-events-none absolute inset-0 z-0 min-h-full" aria-hidden>
        {/* Stronger gradient overlay - clearly visible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(200, 164, 94, 0.22) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 110% 110%, rgba(9, 20, 43, 0.14) 0%, transparent 50%), radial-gradient(ellipse 60% 45% at -10% 90%, rgba(200, 164, 94, 0.16) 0%, transparent 50%)",
          }}
        />
        {/* Large soft blurred circles - more visible */}
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#c8a45e] opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-[#09142b] opacity-15 blur-3xl" />
        <div className="absolute right-[15%] top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#c8a45e] opacity-15 blur-2xl" />
        <div className="absolute left-[20%] top-1/3 h-40 w-40 rounded-full bg-[#09142b] opacity-10 blur-2xl" />
        {/* Visible grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(9, 20, 43, 0.4) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(9, 20, 43, 0.4) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Accent line - visible */}
        <div
          className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 opacity-20"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(9, 20, 43, 0.15) 25%, rgba(200, 164, 94, 0.35) 50%, rgba(9, 20, 43, 0.15) 75%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center mb-10 sm:mb-12">
        <h2
          className="mb-3 max-w-full break-words font-extrabold text-[#09142b] text-xl leading-tight sm:mb-4 sm:text-2xl md:text-3xl lg:text-4xl"
        >
          {t("consultantsTitle")}
        </h2>
        <p
          className="mx-auto max-w-2xl break-words px-1 text-sm leading-relaxed text-[#6b7280] sm:text-base md:text-lg"
        >
          {t("consultantsDesc")}
        </p>
      </div>
      <div className="consultants-section relative z-10 w-full max-w-6xl mx-auto">
        {/* Custom prev/next arrows - small & below on mobile so they don't cover names; normal on md+ */}
        <button
          type="button"
          className={`consultants-swiper-prev absolute z-10 flex items-center justify-center rounded-full border-2 border-[#c8a45e] bg-white text-[#09142b] shadow-lg transition-all hover:bg-[#c8a45e] hover:text-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-40
            h-9 w-9 bottom-4 left-4 md:bottom-auto md:left-[-0.5rem] md:top-1/2 md:-translate-y-1/2 md:h-12 md:w-12
            ${isRTL ? "left-auto right-4 md:right-[-0.5rem] md:left-auto" : ""}`}
          aria-label={isRTL ? "التالي" : "Previous consultants"}
        >
          {isRTL ? <FiChevronRight className="h-4 w-4 md:h-6 md:w-6" aria-hidden /> : <FiChevronLeft className="h-4 w-4 md:h-6 md:w-6" aria-hidden />}
        </button>
        <button
          type="button"
          className={`consultants-swiper-next absolute z-10 flex items-center justify-center rounded-full border-2 border-[#c8a45e] bg-white text-[#09142b] shadow-lg transition-all hover:bg-[#c8a45e] hover:text-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-40
            h-9 w-9 bottom-4 right-4 md:bottom-auto md:right-[-0.5rem] md:top-1/2 md:-translate-y-1/2 md:h-12 md:w-12
            ${isRTL ? "right-auto left-4 md:left-[-0.5rem] md:right-auto" : ""}`}
          aria-label={isRTL ? "السابق" : "Next consultants"}
        >
          {isRTL ? <FiChevronLeft className="h-4 w-4 md:h-6 md:w-6" aria-hidden /> : <FiChevronRight className="h-4 w-4 md:h-6 md:w-6" aria-hidden />}
        </button>

        <Swiper
          key={lang}
          modules={[Navigation, Pagination, A11y, Autoplay]}
          spaceBetween={24}
          navigation={{
            prevEl: ".consultants-swiper-prev",
            nextEl: ".consultants-swiper-next",
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          a11y={{
            prevSlideMessage: isRTL ? "التالي" : "Previous consultants",
            nextSlideMessage: isRTL ? "السابق" : "Next consultants",
          }}
          className="!pb-14 !pt-1 md:!pb-12 md:!pt-0"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {consultants.map((consultant) => (
            <SwiperSlide key={consultant.id}>
              <ConsultantCard
                name={consultant.name}
                title={consultant.title}
                bio={consultant.specialization}
                img={consultant.imageUrl}
                rating={consultant.rating}
                consultations={consultant.consultations}
                experience={consultant.experience}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Swiper pagination dots */}
        <style>{`
          .consultants-section .swiper-button-next,
          .consultants-section .swiper-button-prev {
            display: none;
          }
          .consultants-section .consultants-swiper-prev.swiper-button-disabled,
          .consultants-section .consultants-swiper-next.swiper-button-disabled {
            opacity: 0.4;
            pointer-events: none;
          }
          .consultants-section .swiper-pagination-bullet {
            background: #c8a45e;
            opacity: 0.5;
          }
          .consultants-section .swiper-pagination-bullet-active {
            opacity: 1;
          }
        `}</style>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto mt-10 text-center">
        <Link
          to="/consultants"
          className="inline-flex items-center gap-2 rounded-xl bg-[#09142b] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[#0b1a36] focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2"
        >
          {t("seeAllConsultants")}
          <FiArrowLeft className={`h-5 w-5 ${lang === "ar" ? "rotate-180" : ""}`} aria-hidden />
        </Link>
      </div>
    </section>
  );
};

export default ConsultantsSection;
