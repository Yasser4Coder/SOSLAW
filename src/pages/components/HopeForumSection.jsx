import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiMapPin, FiZap } from "react-icons/fi";

const HopeForumSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0b2545] via-[#132f52] to-[#09142b] py-12 md:py-16">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#c8a45e]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8" dir="rtl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4 text-right">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-[#e7cfa7] backdrop-blur">
              <FiZap className="h-4 w-4" />
              ملتقى علمي — الطبعة الثالثة
            </div>
            <h2 className="text-2xl font-extrabold leading-tight text-white md:text-4xl">
              الملتقى العلمي «الأمل»
            </h2>
            <p className="text-lg font-medium text-[#e7cfa7] md:text-xl">
              ريادة الأعمال: انطلاقة نحو الاستقلالية والنجاح
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2">
                <FiMapPin className="text-[#c8a45e]" />
                فندق بلازا، بومرداس
              </span>
              <span className="inline-flex items-center gap-2">
                <FiCalendar className="text-[#c8a45e]" />
                16 ماي 2026
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              خمسة محاور تكوينية شاملة، وباقات تسجيل تناسب الجميع — تنظيم مؤسسة SOS Law.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/hope-forum"
                className="inline-flex items-center gap-2 rounded-xl bg-[#c8a45e] px-6 py-3 text-sm font-bold text-[#09142b] shadow-lg transition hover:bg-[#d4b06e]"
              >
                اكتشف المحاور والعروض
                <FiArrowLeft className="h-5 w-5" />
              </Link>
              <Link
                to="/hope-forum/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                سجّل مشاركتك
              </Link>
            </div>
          </div>

          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-right shadow-xl backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#e7cfa7]/80">
              باقات التسجيل
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-100">
              <li className="flex justify-between gap-3 border-b border-white/10 pb-3">
                <span className="font-medium">VIP</span>
                <span className="text-[#e7cfa7]">6500 دج</span>
              </li>
              <li className="flex justify-between gap-3 border-b border-white/10 pb-3">
                <span className="font-medium">Standard</span>
                <span className="text-[#e7cfa7]">4000 دج</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="font-medium">Student</span>
                <span className="text-[#e7cfa7]">2000 دج</span>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              جميع الباقات تشمل حضور الملتقى والاستفادة من المحاور التكوينية الخمسة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HopeForumSection;
