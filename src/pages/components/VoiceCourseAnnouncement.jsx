import React from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiTarget,
  FiArrowLeft,
  FiMic,
  FiCheck,
  FiGift,
} from "react-icons/fi";

const VoiceCourseAnnouncement = () => {
  return (
    <section className="relative w-full bg-[#faf6f0]" dir="rtl">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/80 via-white/40 to-transparent" />
        <div className="absolute top-10 right-12 h-24 w-24 rounded-full bg-[#c8a45e]/15 blur-3xl" />
        <div className="absolute bottom-16 left-12 h-32 w-32 rounded-full bg-[#09142b]/12 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 md:px-8 md:py-20">
        {/* Top: clear "free course" badge */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#c8a45e] px-5 py-2.5 text-sm font-bold text-white shadow-lg">
            <FiGift className="h-5 w-5" />
            دورة مجانية بالكامل
          </span>
          <span className="rounded-full bg-[#09142b]/10 px-4 py-2 text-xs font-semibold text-[#09142b]">
            عرض رمضان
          </span>
        </div>

        <header className="flex flex-col gap-4 text-right">
          <h2 className="text-2xl font-extrabold text-[#09142b] md:text-3xl lg:text-4xl">
            دورة الإلقاء والتأثير الصوتي
          </h2>
          <blockquote className="rounded-2xl border-r-4 border-[#c8a45e] bg-white/90 px-5 py-4 text-lg font-medium italic text-[#09142b] shadow-sm">
            استثمر في صوتك… فهو أول ما يسمعه الناس منك، وأول ما يصنع انطباعهم عنك.
          </blockquote>
          <p className="max-w-3xl text-sm text-[#4b5563] md:text-base">
            الدورة مجانية للجميع عبر Google Meet. يمكنك لاحقاً اختيار باقة مدفوعة للاستفادة الكاملة: شهادة مشاركة، كتاب الدليل الشامل، أو ورشة مسجلة عبر تلغرام. انضم لمجموعة التلغرام لمتابعة المستجدات.
          </p>
        </header>

        {/* Highlight: ما الذي تحصل عليه مجاناً */}
        <div className="rounded-2xl border-2 border-[#c8a45e]/40 bg-[#fefcf8] p-5 shadow-md md:p-6">
          <div className="flex items-center gap-2 text-[#09142b] mb-3">
            <FiCheck className="h-6 w-6 text-[#c8a45e]" />
            <h3 className="text-lg font-bold">الحضور مجاني — لا توجد رسوم</h3>
          </div>
          <p className="text-sm text-[#4b5563] md:text-base">
            يمكنك حضور الدورة كاملة عبر Google Meet دون دفع أي مبلغ. التسجيل والدخول إلى اللقاء مجاني للجميع.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="flex h-full flex-col gap-3 rounded-2xl border border-[#e7cfa7] bg-white/95 p-5 shadow-sm">
            <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#c8a45e] to-[#b48b5a] px-4 py-3 text-white">
              <FiCalendar className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#09142b]">التاريخ</h3>
            <p className="text-sm leading-relaxed text-[#4b5563]">
              الأحد 08 مارس 2026
            </p>
          </article>
          <article className="flex h-full flex-col gap-3 rounded-2xl border border-[#e7cfa7] bg-white/95 p-5 shadow-sm">
            <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#09142b] to-[#1a2a4a] px-4 py-3 text-white">
              <FiClock className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#09142b]">الوقت</h3>
            <p className="text-sm leading-relaxed text-[#4b5563]">
              الساعة 21:45
            </p>
          </article>
          <article className="flex h-full flex-col gap-3 rounded-2xl border border-[#e7cfa7] bg-white/95 p-5 shadow-sm">
            <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#b48b5a] to-[#c8a45e] px-4 py-3 text-white">
              <FiMic className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#09142b]">طريقة الحضور</h3>
            <p className="text-sm leading-relaxed text-[#4b5563]">
              مجاني — عبر Google Meet
            </p>
          </article>
        </section>

        {/* Optional packages — clearly separated */}
        <section className="rounded-3xl border border-[#09142b]/10 bg-white p-6 shadow-xl">
          <div className="flex items-center gap-3 text-[#09142b]">
            <FiTarget className="h-6 w-6 text-[#c8a45e]" />
            <h3 className="text-lg font-semibold">
              باقات اختيارية للاستفادة الكاملة (مدفوعة)
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#4b5563] md:text-base">
            الحضور مجاني للجميع. إذا أردت الاستفادة الإضافية، يمكنك اختيار إحدى الباقات: <strong>شهادة مشاركة إلكترونية (1000 دج)</strong>، <strong>كتاب الدليل الشامل + الورشة المسجلة (2500 دج)</strong>، أو <strong>الباقة الكاملة (3000 دج)</strong>. التسجيل عبر الاستمارة أدناه.
          </p>
        </section>

        <section className="flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-r from-[#09142b] to-[#1a2a4a] px-6 py-8 text-center text-white md:flex-row md:justify-between md:text-right">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold md:text-2xl">
              سجّل في دورة الإلقاء والتأثير الصوتي
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              استمارة التسجيل تحتوي على التفاصيل الكاملة والباقات المتاحة. الأحد 08 مارس 2026 – الساعة 21:45.
            </p>
          </div>
          <Link
            to="/voice-course-registration"
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-3 text-sm font-semibold text-[#09142b] shadow-xl transition-transform duration-300 hover:-translate-y-1"
          >
            انتقل إلى استمارة التسجيل
            <FiArrowLeft className="h-5 w-5 text-[#c8a45e] transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </section>
      </div>
    </section>
  );
};

export default VoiceCourseAnnouncement;
