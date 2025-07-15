import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ConsultantCard from "./ConsultantCard";
import { useTranslation } from "react-i18next";

const ConsultantsSection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const consultants = [
    {
      name: t("consultant1Name"),
      title: t("consultant1Title"),
      bio: t("consultant1Bio"),
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: t("consultant2Name"),
      title: t("consultant2Title"),
      bio: t("consultant2Bio"),
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: t("consultant3Name"),
      title: t("consultant3Title"),
      bio: t("consultant3Bio"),
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: t("consultant4Name"),
      title: t("consultant4Title"),
      bio: t("consultant4Bio"),
      img: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    {
      name: t("consultant5Name"),
      title: t("consultant5Title"),
      bio: t("consultant5Bio"),
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: t("consultant6Name"),
      title: t("consultant6Title"),
      bio: t("consultant6Bio"),
      img: "https://randomuser.me/api/portraits/men/55.jpg",
    },
  ];

  return (
    <section
      id="consultants"
      className="w-full bg-[#faf6f0] py-16 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#09142b] mb-4">
          {t("consultantsTitle")}
        </h2>
        <p className="text-[#6b7280] text-base md:text-lg max-w-2xl mx-auto">
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
          {consultants.map((c) => (
            <SwiperSlide key={c.name}>
              <ConsultantCard {...c} />
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
          .swiper-button-next:after, .swiper-button-prev:after {
            font-size: 1.5rem;
            font-weight: bold;
          }
          .swiper-pagination-bullet {
            background: #fff;
            border: 2px solid #c8a45e;
            opacity: 1;
            width: 0.75rem;
            height: 0.75rem;
            margin: 0 0.25rem !important;
            transition: background 0.2s;
          }
          .swiper-pagination-bullet-active {
            background: #c8a45e;
          }
        `}</style>
      </div>
    </section>
  );
};

export default ConsultantsSection;
