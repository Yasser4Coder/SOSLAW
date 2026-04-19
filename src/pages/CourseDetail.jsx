import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiClock, FiMapPin, FiLoader, FiExternalLink, FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import * as courseService from "../services/courseService";

const TYPE_LABELS = {
  training: "دورة تدريبية",
  voice: "دورة صوتية",
  conference: "مؤتمر",
  general: "تكوين",
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { data: course, isLoading, isError } = useQuery({
    queryKey: ["publicCourse", courseId],
    queryFn: () => courseService.getCourseByIdOrSlug(courseId),
    enabled: !!courseId,
  });

  if (isError || (course === null && !isLoading)) {
    navigate("/courses", { replace: true });
    return null;
  }

  if (isLoading || !course) {
    return (
      <main className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <FiLoader className="w-10 h-10 animate-spin text-[#09142b]" />
      </main>
    );
  }

  const img = course.image ? courseService.getCourseImageUrl(course.image) : null;

  return (
    <>
      <Helmet>
        <title>{course.titleAr} | SOS Law</title>
        <meta name="description" content={course.summaryAr || course.titleAr} />
      </Helmet>
      <main className="min-h-screen bg-[#faf6f0]" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-white border-b border-[#e7cfa7] py-3">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-[#4b5563]">
              <Link to="/courses" className="hover:text-[#c8a45e]">
                {t("coursesHomeTitle", "التكوين والدورات")}
              </Link>
              <FiChevronRight className={`w-4 h-4 text-[#c8a45e] ${isRTL ? "rotate-180" : ""}`} />
              <span className="text-[#09142b] font-medium truncate">{course.titleAr}</span>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {img && (
            <div className="rounded-2xl overflow-hidden border border-[#e7cfa7] mb-8 aspect-video bg-gray-100">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#09142b]/10 text-[#09142b] mb-3">
            {TYPE_LABELS[course.type] || course.type}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-[#09142b] mb-4">{course.titleAr}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-6 text-[#4b5563]">
            <span className="text-xl font-semibold text-[#c8a45e]">
              {course.isFree ? t("courseFree", "مجاني") : `${course.price} ${course.currency}`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {course.dateLabel && (
              <div className="rounded-xl border border-[#e7cfa7] bg-white p-4">
                <FiCalendar className="text-[#c8a45e] mb-2" />
                <p className="text-xs font-semibold text-[#09142b]">التاريخ</p>
                <p className="text-sm text-[#4b5563]">{course.dateLabel}</p>
              </div>
            )}
            {course.timeLabel && (
              <div className="rounded-xl border border-[#e7cfa7] bg-white p-4">
                <FiClock className="text-[#c8a45e] mb-2" />
                <p className="text-xs font-semibold text-[#09142b]">الوقت</p>
                <p className="text-sm text-[#4b5563]">{course.timeLabel}</p>
              </div>
            )}
            {course.locationLabel && (
              <div className="rounded-xl border border-[#e7cfa7] bg-white p-4 sm:col-span-1">
                <FiMapPin className="text-[#c8a45e] mb-2" />
                <p className="text-xs font-semibold text-[#09142b]">المكان</p>
                <p className="text-sm text-[#4b5563]">{course.locationLabel}</p>
              </div>
            )}
          </div>

          {course.summaryAr && (
            <p className="text-lg text-[#4b5563] leading-relaxed mb-8 border-r-4 border-[#c8a45e] pr-4">
              {course.summaryAr}
            </p>
          )}

          {course.bodyAr && (
            <div className="prose prose-neutral max-w-none text-[#09142b] whitespace-pre-line leading-relaxed mb-10">
              {course.bodyAr}
            </div>
          )}

          {course.registrationUrl ? (
            <a
              href={course.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#09142b] text-white font-semibold hover:bg-[#1b2742]"
            >
              {t("courseRegisterCta", "التسجيل في البرنامج")}
              <FiExternalLink className="w-5 h-5" />
            </a>
          ) : (
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#09142b] text-white font-semibold hover:bg-[#1b2742]"
            >
              {t("courseContactCta", "تواصل معنا للتسجيل")}
            </Link>
          )}

          <div className="mt-12 text-center">
            <Link to="/courses" className="text-[#09142b] font-medium hover:text-[#c8a45e]">
              ← {t("coursesBackToList", "العودة إلى قائمة الدورات")}
            </Link>
          </div>
        </article>
      </main>
    </>
  );
};

export default CourseDetail;
