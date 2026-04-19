import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiAward, FiUsers, FiTrendingUp } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const EmpowerProgramAnnouncement = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <section className="w-full bg-[#faf6f0] py-12 md:py-16 px-4 md:px-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-[#e7cfa7] bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-[#09142b]/5 via-transparent to-[#c8a45e]/10" />
          <div className="relative p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="text-sm font-semibold tracking-wide text-[#c8a45e] mb-2">
                🎓 برنامج SOS Law للتكوين والتمكين
              </p>
              <h2 className="text-2xl md:text-4xl font-bold text-[#09142b] leading-snug mb-3">
                من متدرب إلى سفير للمؤسسة
              </h2>
              <p className="text-[#4b5563] leading-relaxed mb-6">
                برنامج تكويني متكامل يجمع بين المهارات الشخصية، ريادة الأعمال، الجانب القانوني، التسويق والعمل الجماعي — مع
                فرصة حقيقية للانضمام كسفير للمؤسسة.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/empower-program"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#09142b] text-white font-semibold hover:bg-[#1b2742]"
                >
                  تعرف على البرنامج
                  <FiArrowLeft className="w-5 h-5" />
                </Link>
                <Link
                  to="/empower-program/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#c8a45e] text-[#09142b] font-semibold hover:bg-[#c8a45e]/10"
                >
                  سجل الآن
                </Link>
              </div>
              <p className="text-xs text-[#6b7280] mt-4">
                بداية من 18 أفريل 2026 • عن بعد (Google Meet / Telegram) + أونلاين
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#e7cfa7] bg-[#faf6f0] p-4">
                <FiAward className="w-6 h-6 text-[#c8a45e] mb-3" />
                <p className="font-bold text-[#09142b] mb-1">شهادات مشاركة</p>
                <p className="text-sm text-[#6b7280]">تكوين تطبيقي حقيقي ومخرجات قابلة للاستثمار.</p>
              </div>
              <div className="rounded-2xl border border-[#e7cfa7] bg-[#faf6f0] p-4">
                <FiTrendingUp className="w-6 h-6 text-[#c8a45e] mb-3" />
                <p className="font-bold text-[#09142b] mb-1">تمكين مهني</p>
                <p className="text-sm text-[#6b7280]">مهارات تواصل، تسويق، قانون، وريادة.</p>
              </div>
              <div className="rounded-2xl border border-[#e7cfa7] bg-[#faf6f0] p-4">
                <FiUsers className="w-6 h-6 text-[#c8a45e] mb-3" />
                <p className="font-bold text-[#09142b] mb-1">برنامج السفراء</p>
                <p className="text-sm text-[#6b7280]">اختيار نخبة لتمثيل المؤسسة ومزايا إضافية.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmpowerProgramAnnouncement;

