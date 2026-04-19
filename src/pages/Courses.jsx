import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiClock, FiMapPin, FiArrowLeft, FiLoader } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import * as courseService from "../services/courseService";

const TYPE_LABELS = {
  training: "دورة تدريبية",
  voice: "دورة صوتية",
  conference: "مؤتمر",
  general: "تكوين",
};

const Courses = () => {
  const { t } = useTranslation();
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["publicCourses"],
    queryFn: () => courseService.getCourses(),
  });

  return (
    <>
      <Helmet>
        <title>{t("coursesPageTitle", "التكوين والدورات | SOS Law")}</title>
        <meta
          name="description"
          content={t("coursesPageDesc", "دورات تدريبية ومؤتمرات وبرامج SOS Law.")}
        />
      </Helmet>
      <main className="min-h-screen bg-[#faf6f0] py-12 md:py-16 px-4" dir="rtl">
        <div className="max-w-6xl mx-auto">
          <header className="text-right mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#09142b] mb-3">
              {t("coursesHomeTitle", "التكوين والدورات")}
            </h1>
            <p className="text-[#4b5563] max-w-2xl mr-0 ml-auto">
              {t(
                "coursesHomeSubtitle",
                "اكتشف دوراتنا التدريبية والمؤتمرات والبرامج الصوتية — تسجيل مجاني أو مدفوع حسب كل برنامج."
              )}
            </p>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <FiLoader className="w-10 h-10 animate-spin text-[#09142b]" />
            </div>
          ) : courses.length === 0 ? (
            <p className="text-center text-[#6b7280] py-16">{t("coursesEmpty", "لا توجد دورات منشورة حالياً.")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courses.map((c) => (
                <article
                  key={c.id}
                  className="bg-white rounded-2xl border border-[#e7cfa7] overflow-hidden shadow-sm flex flex-col md:flex-row"
                >
                  {c.image && (
                    <Link to={`/courses/${c.id}`} className="md:w-2/5 h-48 md:h-auto shrink-0">
                      <img
                        src={courseService.getCourseImageUrl(c.image)}
                        alt=""
                        className="w-full h-full object-cover min-h-[12rem]"
                        loading="lazy"
                      />
                    </Link>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="self-start text-xs font-semibold px-2 py-1 rounded-full bg-[#09142b]/10 text-[#09142b] mb-2">
                      {TYPE_LABELS[c.type] || c.type}
                    </span>
                    <h2 className="text-xl font-bold text-[#09142b] mb-2">
                      <Link to={`/courses/${c.id}`} className="hover:text-[#c8a45e]">
                        {c.titleAr}
                      </Link>
                    </h2>
                    {c.summaryAr && <p className="text-sm text-[#4b5563] mb-4 flex-1">{c.summaryAr}</p>}
                    <div className="space-y-1 text-sm text-[#6b7280] mb-4">
                      {c.dateLabel && (
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-[#c8a45e]" />
                          {c.dateLabel}
                        </div>
                      )}
                      {c.timeLabel && (
                        <div className="flex items-center gap-2">
                          <FiClock className="text-[#c8a45e]" />
                          {c.timeLabel}
                        </div>
                      )}
                      {c.locationLabel && (
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-[#c8a45e]" />
                          {c.locationLabel}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-semibold text-[#c8a45e]">
                        {c.isFree ? t("courseFree", "مجاني") : `${c.price} ${c.currency}`}
                      </span>
                      <Link
                        to={`/courses/${c.id}`}
                        className="inline-flex items-center gap-1 text-[#09142b] font-semibold hover:text-[#c8a45e]"
                      >
                        {t("courseDetailsCta", "التفاصيل والتسجيل")}
                        <FiArrowLeft />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Courses;
