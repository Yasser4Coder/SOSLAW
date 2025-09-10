import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ConsultantCard from "./ConsultantCard";
import { useTranslation } from "react-i18next";
import publicConsultantService from "../../services/publicConsultantService";
import { FiLoader } from "react-icons/fi";

const ConsultantsSection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "ar";

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
        className="w-full bg-[#faf6f0] py-16 px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto text-center mb-12">
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
        <div className="flex items-center justify-center h-64">
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
        className="w-full bg-[#faf6f0] py-16 px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto text-center mb-12">
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
        <div className="text-center py-8">
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
        className="w-full bg-[#faf6f0] py-16 px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto text-center mb-12">
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
        <div className="text-center py-8">
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
      className="w-full bg-[#faf6f0] py-16 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto text-center mb-12">
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
      <div className="relative w-full max-w-6xl mx-auto">
        <Swiper
          key={lang}
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={24}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          a11y={{
            prevSlideMessage: "Previous consultants",
            nextSlideMessage: "Next consultants",
          }}
          className="!pb-12"
          dir={lang === "ar" ? "rtl" : "ltr"}
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
        {/* Custom Swiper styles for arrows and pagination */}
        <style>{`
          .swiper-button-next, .swiper-button-prev {
            color: #c8a45e;
            background: #fff;
            border-radius: 9999px;
            box-shadow: 0 2px 8px 0 #e7cfa7;
            width: 2.5rem;
            height: 2.5rem;
            top: 50%;
            transform: translateY(-50%);
          }
          .swiper-button-next {
            right: -1.25rem;
          }
          .swiper-button-prev {
            left: -1.25rem;
          }
          .swiper-pagination-bullet {
            background: #c8a45e;
            opacity: 0.5;
          }
          .swiper-pagination-bullet-active {
            opacity: 1;
          }
        `}</style>
      </div>
    </section>
  );
};

export default ConsultantsSection;
