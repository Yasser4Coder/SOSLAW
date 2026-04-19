import React from "react";
import { Link } from "react-router-dom";
import {
  FiUserPlus,
  FiUsers,
  FiCreditCard,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";

const steps = [
  {
    id: 1,
    title: "سجّل حسابك مجاناً",
    description:
      "أنشئ حسابك في دقائق دون رسوم، وافتح لنفسك باب الاستشارات والخدمات القانونية أونلاين.",
    icon: FiUserPlus,
    href: "/auth",
    cta: "سجّل الآن",
  },
  {
    id: 2,
    title: "اختر مستشارك المناسب",
    description:
      "اطّلع على قائمة مستشارينا المختصين واختر من تناسب خبرته واحترافيته قضيتك.",
    icon: FiUsers,
    href: "/#consultants",
    cta: "تصفّح المستشارين",
  },
  {
    id: 3,
    title: "ادفع بثقة وأمان",
    description:
      "ادفع عبر CCP أو نقداً عند التواصل مع الفريق — معاملات آمنة وشفافة دون تعقيد.",
    icon: FiCreditCard,
    href: null,
    cta: null,
  },
  {
    id: 4,
    title: "استلم خدمتك أو استشارتك",
    description:
      "احصل على استشارتك أو خدمتك أونلاين بالطريقة التي تناسبك: مكالمة، واتساب، أو لقاء افتراضي.",
    icon: FiCheckCircle,
    href: "/#services",
    cta: "قدّم طلبك",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="relative w-full overflow-hidden bg-[#faf6f0] py-16 md:py-20"
      dir="rtl"
    >
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#c8a45e]/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#09142b]/8 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e7cfa7]/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
        {/* Heading */}
        <header className="mb-12 text-center md:mb-16">
          <h2 className="text-2xl font-bold text-[#09142b] md:text-3xl lg:text-4xl">
            تبحث عن خدمة أو استشارة قانونية؟
          </h2>
          <p className="mt-2 text-lg font-medium text-[#c8a45e] md:text-xl">
            أنت في المكان المناسب
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-[#4b5563] md:text-base">
            من التسجيل حتى استلام الخدمة: أربع خطوات واضحة تقرّبك من حلك القانوني بثقة وسهولة.
          </p>
        </header>

        {/* Steps: horizontal on large screens with connector, stacked on mobile */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <div key={step.id} className="relative flex flex-col">
                {/* Card */}
                <article
                  className="group flex h-full flex-col rounded-2xl border border-[#e7cfa7] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c8a45e]/50 hover:shadow-lg hover:shadow-[#09142b]/5 md:p-6"
                  aria-labelledby={`step-title-${step.id}`}
                >
                  {/* Step number + icon */}
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#c8a45e] bg-[#fefcf8] text-lg font-bold text-[#09142b] transition-colors group-hover:border-[#b48b5a] group-hover:bg-[#c8a45e]/10"
                      aria-hidden
                    >
                      {step.id}
                    </span>
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c8a45e] to-[#b48b5a] text-white shadow-md transition-transform group-hover:scale-105">
                      <Icon className="h-7 w-7" aria-hidden />
                    </span>
                  </div>

                  <h3
                    id={`step-title-${step.id}`}
                    className="text-lg font-bold text-[#09142b] md:text-xl"
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#4b5563] md:text-base">
                    {step.description}
                  </p>

                  {step.href && step.cta && (
                    <div className="mt-4">
                      <Link
                        to={step.href}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#09142b] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#09142b]/90 focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2"
                      >
                        {step.cta}
                        <FiArrowLeft className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </article>

                {/* Optional: decorative connector on large screens */}
                {!isLast && (
                  <div className="absolute -left-3 top-1/2 hidden -translate-y-1/2 lg:flex" aria-hidden>
                    <span className="h-0.5 w-6 rounded bg-[#e7cfa7]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center md:mt-16">
          <Link
            to="/request-service"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#c8a45e] px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-[#b48b5a] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2"
          >
            ابدأ خطوتك الأولى وقدم طلبك
            <FiArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
