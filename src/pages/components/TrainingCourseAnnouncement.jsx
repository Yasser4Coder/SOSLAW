import React from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiTarget,
  FiArrowLeft,
} from "react-icons/fi";

const TrainingCourseAnnouncement = () => {
  return (
    <section className="relative w-full bg-[#faf6f0]" dir="rtl">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/80 via-white/40 to-transparent" />
        <div className="absolute top-10 right-12 h-24 w-24 rounded-full bg-[#c8a45e]/15 blur-3xl" />
        <div className="absolute bottom-16 left-12 h-32 w-32 rounded-full bg-[#09142b]/12 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 md:px-8 md:py-20">
        <header className="flex flex-col gap-4 text-right">
          <span className="self-start rounded-full bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] px-5 py-2 text-xs font-semibold text-white shadow-lg">
            إعلان دورة تدريبية حضورية
          </span>
          <h2 className="text-2xl font-extrabold text-[#09142b] md:text-3xl lg:text-4xl">
            كيفية إعداد نموذج مؤسسة اقتصادية ناجحة
          </h2>
          <p className="max-w-3xl text-sm text-[#4b5563] md:text-base">
            تنظم مؤسسة SOS Law دورة تكوينية حضورية مجانية بمناسبة الافتتاح الرسمي
            للمؤسسة، مع خيار دورة مجانية عن بعد عبر تقنية غوغل ميت. المحتوى عملي
            وموجّه للشباب ورواد الأعمال.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="flex h-full flex-col gap-3 rounded-2xl border border-[#e7cfa7] bg-white/95 p-5 shadow-sm">
            <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#c8a45e] to-[#b48b5a] px-4 py-3 text-white">
              <FiCalendar className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#09142b]">التاريخ</h3>
            <p className="text-sm leading-relaxed text-[#4b5563]">
              يوم 14 فيفري 2026
            </p>
          </article>
          <article className="flex h-full flex-col gap-3 rounded-2xl border border-[#e7cfa7] bg-white/95 p-5 shadow-sm">
            <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#09142b] to-[#1a2a4a] px-4 py-3 text-white">
              <FiClock className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#09142b]">الوقت</h3>
            <p className="text-sm leading-relaxed text-[#4b5563]">
              من 09:30 صباحًا إلى 12:00 ظهرًا
            </p>
          </article>
          <article className="flex h-full flex-col gap-3 rounded-2xl border border-[#e7cfa7] bg-white/95 p-5 shadow-sm">
            <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#b48b5a] to-[#c8a45e] px-4 py-3 text-white">
              <FiMapPin className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#09142b]">المكان</h3>
            <p className="text-sm leading-relaxed text-[#4b5563]">
              المركز التجاري المحمدية مول، الطابق الأرضي – الجزائر العاصمة
            </p>
          </article>
        </section>

        <section className="rounded-3xl border border-[#09142b]/10 bg-white p-6 shadow-xl">
          <div className="flex items-center gap-3 text-[#09142b]">
            <FiTarget className="h-6 w-6 text-[#c8a45e]" />
            <h3 className="text-lg font-semibold">
              شعار الدورة: نؤمن بأن الفكرة القوية تحتاج تخطيطًا صحيحًا لتنجح.
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#4b5563] md:text-base">
            عدد الأماكن محدود، والأولوية للمسجلين مسبقًا. التسجيل مجاني ومتاح
            للجميع.
          </p>
        </section>

        <section className="flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-r from-[#09142b] to-[#1a2a4a] px-6 py-8 text-center text-white md:flex-row md:justify-between md:text-right">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold md:text-2xl">
              احجز مقعدك الآن في الدورة الحضورية
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              صفحة التسجيل تحتوي على تفاصيل الدورة الكاملة واستمارة التسجيل.
            </p>
          </div>
          <Link
            to="/training-course"
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-3 text-sm font-semibold text-[#09142b] shadow-xl transition-transform duration-300 hover:-translate-y-1"
          >
            انتقل إلى صفحة الدورة
            <FiArrowLeft className="h-5 w-5 text-[#c8a45e] transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </section>
      </div>
    </section>
  );
};

export default TrainingCourseAnnouncement;
