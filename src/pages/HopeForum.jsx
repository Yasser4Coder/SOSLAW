import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiAward,
  FiCalendar,
  FiCheck,
  FiMapPin,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const AXES = [
  {
    icon: FiZap,
    title: "بناء العقلية الريادية",
    accent: "from-amber-500/20 to-orange-500/10",
    bullets: ["كيف تفكر كرائد أعمال", "كسر الخوف وبناء الثقة", "من الفكرة إلى القرار"],
  },
  {
    icon: FiTrendingUp,
    title: "من الفكرة إلى مشروع",
    accent: "from-emerald-500/20 to-teal-500/10",
    bullets: ["كيف تختار فكرة ناجحة", "دراسة السوق بشكل مبسط", "بناء نموذج مشروع أولي"],
  },
  {
    icon: FiShield,
    title: "الجانب القانوني للمشاريع",
    accent: "from-slate-500/20 to-blue-500/10",
    bullets: ["كيف تبدأ مشروعك بشكل قانوني", "اختيار الشكل القانوني", "حماية الفكرة والعلامة"],
  },
  {
    icon: FiUsers,
    title: "التسويق وبناء الجمهور",
    accent: "from-violet-500/20 to-fuchsia-500/10",
    bullets: ["كيف تسوّق لنفسك ولمشروعك", "استهداف الجمهور الصحيح", "أساسيات البيع والإقناع"],
  },
  {
    icon: FiAward,
    title: "المهارات الشخصية والعمل الجماعي",
    accent: "from-rose-500/20 to-red-500/10",
    bullets: ["الإلقاء والتواصل الفعال", "العمل ضمن فريق", "القيادة والتأثير"],
  },
];

const PACKAGES = [
  {
    id: "vip",
    badge: "🥇",
    name: "العرض الأول – VIP",
    price: "6500 دج",
    tagline: "تجربة مميزة ومتكاملة",
    features: ["شهادة مشاركة", "حقيبة الملتقى", "غداء فاخر في الفندق"],
    highlight: true,
  },
  {
    id: "standard",
    badge: "🥈",
    name: "العرض الثاني – Standard",
    price: "4000 دج",
    tagline: "تجربة متوازنة",
    features: ["شهادة مشاركة", "حقيبة الملتقى"],
    highlight: false,
  },
  {
    id: "student",
    badge: "🥉",
    name: "العرض الثالث – Student",
    price: "2000 دج",
    tagline: "موجّه خصيصًا للطلبة",
    features: ["شهادة مشاركة"],
    highlight: false,
  },
];

const HopeForum = () => {
  return (
    <>
      <Helmet>
        <title>الملتقى العلمي «الأمل» — SOS Law</title>
        <meta
          name="description"
          content="ملتقى الأمل الطبعة الثالثة: ريادة الأعمال، خمسة محاور تكوينية، فندق بلازا بومرداس، 16 ماي 2026. تنظيم مؤسسة SOS Law."
        />
        <html lang="ar" dir="rtl" />
      </Helmet>

      <main className="min-h-screen bg-[#f6f3ec]" dir="rtl">
        <section className="relative overflow-hidden bg-[#09142b] py-16 text-white md:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(200,164,94,0.18),transparent_45%)]" />
          <div className="relative mx-auto max-w-6xl px-4 md:px-8">
            <p className="mb-3 text-sm font-semibold text-[#e7cfa7]">
              🎓 تنظم مؤسسة SOS Law — الملتقى العلمي «الأمل» في طبعته الثالثة
            </p>
            <h1 className="mb-4 max-w-4xl text-3xl font-extrabold leading-tight md:text-5xl">
              ريادة الأعمال: انطلاقة نحو الاستقلالية والنجاح
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              يوم تكويني مكثّف يجمع الخبرة العملية والمحتوى القانوني والتسويقي في مكان واحد، لدعم
              مسيرتك نحو مشروع مستدام.
            </p>
            <div className="mb-10 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
                <FiMapPin className="text-[#c8a45e]" />
                فندق بلازا، بومرداس
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
                <FiCalendar className="text-[#c8a45e]" />
                16 ماي 2026
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/hope-forum/register"
                className="inline-flex items-center gap-2 rounded-xl bg-[#c8a45e] px-8 py-3.5 text-base font-bold text-[#09142b] shadow-lg transition hover:bg-[#d4b06e]"
              >
                التسجيل والباقات
                <FiArrowLeft className="h-5 w-5" />
              </Link>
              <a
                href="tel:0550069695"
                className="inline-flex items-center gap-2 rounded-xl border border-[#e7cfa7]/40 px-8 py-3.5 text-base font-semibold text-[#e7cfa7] transition hover:bg-white/5"
              >
                استفسار: 0550069695
              </a>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-extrabold text-[#09142b] md:text-3xl">المحاور الرئيسية</h2>
              <p className="mx-auto mt-3 max-w-2xl text-[#4b5563]">
                خمسة محاور متكاملة تغطي العقلية الريادية، المشروع، القانون، التسويق، والمهارات الشخصية.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {AXES.map((axis, index) => {
                const Icon = axis.icon;
                return (
                  <article
                    key={axis.title}
                    className="group relative overflow-hidden rounded-2xl border border-[#e7cfa7]/60 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${axis.accent} opacity-60`}
                    />
                    <div className="relative">
                      <div className="mb-3 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#09142b] text-lg text-[#e7cfa7]">
                          {index + 1}
                        </span>
                        <Icon className="h-6 w-6 text-[#c8a45e]" />
                      </div>
                      <h3 className="text-lg font-bold text-[#09142b]">{axis.title}</h3>
                      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#4b5563]">
                        {axis.bullets.map((b) => (
                          <li key={b} className="flex gap-2">
                            <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-[#e7cfa7]/40 bg-white py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-extrabold text-[#09142b] md:text-3xl">
                اختر العرض المناسب لك
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-[#4b5563]">
                جميع العروض تشمل حضور الملتقى والاستفادة من جميع المحاور التكوينية.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col rounded-3xl border p-8 ${
                    pkg.highlight
                      ? "border-[#c8a45e] bg-gradient-to-b from-[#fffdf8] to-white shadow-xl ring-2 ring-[#c8a45e]/30"
                      : "border-[#e7cfa7]/70 bg-[#faf6f0]"
                  }`}
                >
                  {pkg.highlight && (
                    <span className="absolute -top-3 right-6 rounded-full bg-[#09142b] px-3 py-1 text-xs font-bold text-[#e7cfa7]">
                      الأكثر اكتمالاً
                    </span>
                  )}
                  <div className="mb-4 text-3xl">{pkg.badge}</div>
                  <h3 className="text-xl font-bold text-[#09142b]">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-[#6b7280]">{pkg.tagline}</p>
                  <p className="mt-6 text-3xl font-extrabold text-[#c8a45e]">{pkg.price}</p>
                  <ul className="mt-6 flex-1 space-y-3 text-sm text-[#374151]">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/hope-forum/register"
                    state={{ package: pkg.id }}
                    className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-bold transition ${
                      pkg.highlight
                        ? "bg-[#09142b] text-white hover:bg-[#132f52]"
                        : "border border-[#09142b] text-[#09142b] hover:bg-[#09142b] hover:text-white"
                    }`}
                  >
                    اختر هذه الباقة
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
            <h2 className="text-2xl font-extrabold text-[#09142b]">جاهز للانطلاق؟</h2>
            <p className="mt-3 text-[#4b5563]">
              أكمل استمارة التسجيل واختر باقتك. سيتم تأكيد استلام طلبك عبر البريد الإلكتروني.
            </p>
            <Link
              to="/hope-forum/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#c8a45e] px-10 py-4 text-base font-bold text-[#09142b] shadow-lg transition hover:bg-[#d4b06e]"
            >
              الانتقال إلى استمارة التسجيل
              <FiArrowLeft className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default HopeForum;
