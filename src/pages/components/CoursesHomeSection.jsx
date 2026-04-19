import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiClock, FiMapPin, FiArrowLeft, FiLoader } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import * as courseService from "../../services/courseService";

const TYPE_LABELS = {
  training: "دورة تدريبية",
  voice: "دورة صوتية",
  conference: "مؤتمر",
  general: "تكوين",
};

const CoursesHomeSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["publicCourses"],
    queryFn: () => courseService.getCourses(),
  });

  const display = courses.slice(0, 6);

  return (
    <section className="w-full bg-[#faf6f0] py-14 md:py-20 px-4 md:px-8" dir={isRTL ? "rtl" : "ltr"} id="courses">
      <div className="max-w-6xl mx-auto">
        <header className={`mb-10 ${isRTL ? "text-right" : "text-left"}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-[#09142b] mb-2">
            {t("coursesHomeTitle", "التكوين والدورات")}
          </h2>
          <p className={`text-[#4b5563] max-w-2xl ${isRTL ? "mr-0 ml-auto" : "ml-0 mr-auto"}`}>
            {t(
              "coursesHomeSubtitle",
              "اكتشف دوراتنا التدريبية والمؤتمرات والبرامج الصوتية — تسجيل مجاني أو مدفوع حسب كل برنامج."
            )}
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-16 mb-10">
            <FiLoader className="w-10 h-10 animate-spin text-[#09142b]" aria-label={t("loading", "جاري التحميل")} />
          </div>
        ) : display.length === 0 ? (
          <div className="rounded-2xl border border-[#e7cfa7] bg-white/90 px-6 py-12 text-center mb-10">
            <p className="text-[#4b5563] mb-6 max-w-md mx-auto">
              {t(
                "coursesHomeEmpty",
                "لم ننشر دورات جديدة على الصفحة الرئيسية بعد. يمكنك زيارة صفحة الدورات أو التواصل معنا للاستفسار عن البرامج القادمة."
              )}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#09142b] text-white font-semibold hover:bg-[#1b2742]"
              >
                {t("coursesSeeAll", "عرض جميع الدورات")}
                <FiArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#09142b] text-[#09142b] font-semibold hover:bg-[#09142b]/5"
              >
                {t("coursesHomeContact", "تواصل معنا")}
              </Link>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {display.map((c) => (
            <article
              key={c.id}
              className="bg-white rounded-2xl border border-[#e7cfa7] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {c.image && (
                <Link to={`/courses/${c.id}`} className="block h-40 overflow-hidden">
                  <img
                    src={courseService.getCourseImageUrl(c.image)}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </Link>
              )}
              <div className="p-5 flex flex-col flex-1">
                <span className="self-start text-xs font-semibold px-2 py-1 rounded-full bg-[#09142b]/10 text-[#09142b] mb-2">
                  {TYPE_LABELS[c.type] || c.type}
                </span>
                <h3 className="font-bold text-lg text-[#09142b] mb-2 leading-snug">
                  <Link to={`/courses/${c.id}`} className="hover:text-[#c8a45e]">
                    {c.titleAr}
                  </Link>
                </h3>
                {c.summaryAr && (
                  <p className="text-sm text-[#4b5563] line-clamp-3 mb-3 flex-1">{c.summaryAr}</p>
                )}
                <div className="space-y-1 text-xs text-[#6b7280] mb-3">
                  {c.dateLabel && (
                    <div className="flex items-center gap-1">
                      <FiCalendar className="text-[#c8a45e]" />
                      {c.dateLabel}
                    </div>
                  )}
                  {c.timeLabel && (
                    <div className="flex items-center gap-1">
                      <FiClock className="text-[#c8a45e]" />
                      {c.timeLabel}
                    </div>
                  )}
                  {c.locationLabel && (
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-[#c8a45e]" />
                      {c.locationLabel}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#f3e8d4]">
                  <span className="text-sm font-semibold text-[#c8a45e]">
                    {c.isFree ? t("courseFree", "مجاني") : `${c.price} ${c.currency}`}
                  </span>
                  <Link
                    to={`/courses/${c.id}`}
                    className="text-sm font-semibold text-[#09142b] inline-flex items-center gap-1 hover:text-[#c8a45e]"
                  >
                    التفاصيل
                    <FiArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        )}

        {!isLoading && display.length > 0 && (
        <div className="text-center">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#09142b] text-white font-semibold hover:bg-[#1b2742]"
          >
            {t("coursesSeeAll", "عرض جميع الدورات")}
            <FiArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        )}
      </div>
    </section>
  );
};

export default CoursesHomeSection;
