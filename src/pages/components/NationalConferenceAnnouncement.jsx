import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiTarget,
  FiLayers,
  FiTrendingUp,
  FiArrowLeft,
} from "react-icons/fi";

const META_CARDS = [
  {
    icon: FiCalendar,
    title: "التاريخ",
    value: "07 – 09 ديسمبر 2025",
    accent: "from-[#c8a45e] to-[#b48b5a]",
  },
  {
    icon: FiMapPin,
    title: "المكان",
    value:
      "مركب القاعات، كلية الحقوق والعلوم السياسية – جامعة أمحمد بوقرة بومرداس",
    accent: "from-[#09142b] to-[#1a2a4a]",
  },
  {
    icon: FiUsers,
    title: "الفئات المستهدفة",
    list: [
      "الباحثون",
      "الطلبة الجامعيون",
      "رواد الأعمال",
      "أصحاب المؤسسات الناشئة",
      "الطلبة حاملي الأفكار والمشاريع",
      "الشركاء المؤسساتيون",
      "الإعلاميون",
      "المتطوعون",
    ],
    accent: "from-[#b48b5a] to-[#c8a45e]",
  },
];

const FOCUS_LINES = [
  "تعزيز التكامل بين المبادرة الاقتصادية والفكر القانوني لضمان بيئة أعمال مستدامة.",
  "إبراز الحلول القانونية والأدوات المعرفية التي تمكّن مشاريع الاقتصاد الجديد.",
  "فتح جسور عملية بين الجامعة والقطاع الاقتصادي من خلال شراكات ومبادرات مشتركة.",
];

const PARTICIPATION_TRACKS = [
  {
    title: "المشاركة العلمية",
    description:
      "مداخلات بحثية لأساتذة وطلبة وباحثين ضمن محاور متعددة حول الإطار القانوني والابتكار.",
    bullets: [
      "الإطار القانوني لريادة الأعمال، حماية الابتكار، العقود والشراكات، التحديات الميدانية، التجارب الوطنية.",
      "ملخص علمي (300 كلمة) مع تحديد محور المشاركة والكلمات المفتاحية.",
    ],
  },
  {
    title: "الشركاء والمؤسسات",
    description:
      "دعوة للفاعلين الاقتصاديين والهيئات لتقديم مساهمات أو شراكات تدعم مسار الملتقى.",
    bullets: [
      "دعم لوجستي أو مادي، مرافقة تدريبية، مشاركة بخبراء ومحاضرين.",
      "تغطية إعلامية أو شراكات استراتيجية أخرى يتم الاتفاق عليها مع اللجنة التنظيمية.",
    ],
  },
  {
    title: "الحضور والتطوع",
    description:
      "متاح للحضور العام والمتطوعين للمساهمة التنظيمية واكتساب خبرة ميدانية في تنظيم الملتقيات.",
    bullets: [
      "متابعة الجلسات والنقاشات المتخصصة طوال أيام الملتقى.",
      "المشاركة ضمن فرق الاستقبال والمرافقة والتنظيم اللوجستي.",
    ],
  },
];

const FORM_SECTIONS = [
  {
    title: "القسم الأول: المعلومات الشخصية",
    detail:
      "الاسم الكامل، الصفة، المؤسسة أو الجهة، البريد الإلكتروني، رقم الهاتف (واتساب).",
  },
  {
    title: "القسم الثاني: نوع المشاركة",
    detail:
      "مداخلة علمية، حضور عام، مساهمة أو شراكة، تغطية إعلامية، تطوع ومرافقة تنظيمية.",
  },
  {
    title: "القسم الثالث: المشاركات العلمية",
    detail:
      "يظهر عند اختيار “مداخلة علمية”: عنوان، محور مقترح، ملخص في حدود 300 كلمة، كلمات مفتاحية.",
  },
  {
    title: "القسم الرابع: المساهمون والشركاء",
    detail:
      "تفاصيل طبيعة المساهمة (دعم لوجستي/مادي، خبراء، تدريب، تغطية إعلامية) مع مساحة لملاحظات إضافية.",
  },
  {
    title: "القسم الخامس: الملاحظات العامة",
    detail:
      "مساحة للاقتراحات العامة وسؤال “كيف سمعت عن الملتقى؟” مع خيارات متعددة.",
  },
  {
    title: "القسم السادس: التأكيد",
    detail:
      "إقرار بصحة البيانات والموافقة على استلام إشعارات الملتقى عبر البريد الإلكتروني.",
  },
];

const NationalConferenceAnnouncement = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#faf6f0]"
      dir="rtl"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/80 via-white/40 to-transparent" />
        <div className="absolute top-12 right-12 h-32 w-32 rounded-full bg-[#c8a45e]/15 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 left-20 h-40 w-40 rounded-full bg-[#09142b]/12 blur-3xl animate-[pulse_9s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-18 transition-all duration-700 md:px-8 md:py-24">
        <header
          className={`flex flex-col gap-4 text-right transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span className="self-start rounded-full bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] px-5 py-2 text-xs font-semibold text-white shadow-lg">
            الملتقى الوطني الثالث
            </span>
          <h2 className="text-3xl font-extrabold text-[#09142b] md:text-4xl lg:text-5xl">
            ريادة الأعمال والقانون: تكامل لبناء اقتصاد المعرفة
              </h2>
          <p className="text-lg font-semibold text-[#b48b5a] md:text-xl">
            تحت شعار: “جيلٌ ريادي... بفكرٍ قانوني ورؤيةٍ معرفية”
          </p>
          <p className="max-w-3xl text-sm text-[#4b5563] md:text-base">
            تدعو كلية الحقوق والعلوم السياسية بجامعة أمحمد بوقرة بومرداس، بالشراكة مع النادي العلمي الثقافي
            “السنهوري”، جميع الفاعلين في المنظومة القانونية والاقتصادية للمشاركة في ملتقى وطني يرسم ملامح اقتصاد
            المعرفة ويقترح حلولًا تشريعية وعملية تدعم المبادرة الريادية.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {META_CARDS.map(({ icon: Icon, title, value, list, accent }) => (
            <article
              key={title}
              className="flex h-full flex-col gap-3 rounded-2xl border border-[#e7cfa7] bg-white/95 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${accent} px-4 py-3 text-white`}
              >
                <Icon className="h-6 w-6" />
                    </div>
              <h3 className="text-sm font-semibold text-[#09142b]">{title}</h3>
              {value ? (
                <p className="text-sm leading-relaxed text-[#4b5563]">{value}</p>
              ) : list ? (
                <ul className="space-y-1 text-sm text-[#4b5563]">
                  {list.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-[#c8a45e]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
          <article className="rounded-3xl border border-[#09142b]/10 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 text-[#09142b]">
              <FiTarget className="h-6 w-6 text-[#c8a45e]" />
              <h3 className="text-xl font-semibold">الرؤية والمسارات الأساسية</h3>
                  </div>
            <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
              يجمع الملتقى بين الأكاديميين ورواد الأعمال وصناع القرار لمناقشة التحديات القانونية
              والاقتصادية التي تواجه الاقتصاد الجديد، وطرح حلول ومشاريع تسهم في نمو منظومة ريادة الأعمال الوطنية.
            </p>
            <ul className="mt-5 space-y-2 rounded-2xl bg-[#faf6f0] p-4 text-sm text-[#09142b] shadow-inner">
              {FOCUS_LINES.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#c8a45e]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl border border-[#c8a45e]/40 bg-[#c8a45e]/10 p-4 text-xs text-[#4b5563] md:text-sm">
              الرجاء الاطلاع على مسارات المشاركة أدناه وتحديد فئة التسجيل الأنسب لك قبل تعبئة الاستمارة، لضمان
              معالجة أسرع من طرف اللجنة التنظيمية.
                  </div>
          </article>

          <article className="rounded-3xl border border-[#e7cfa7] bg-white/95 p-6 shadow-lg">
            <div className="flex items-center gap-3 text-[#09142b]">
              <FiLayers className="h-6 w-6 text-[#c8a45e]" />
              <h3 className="text-xl font-semibold">مداخل المشاركة</h3>
                  </div>
            <div className="mt-5 space-y-4">
              {PARTICIPATION_TRACKS.map(({ title, description, bullets }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-[#e7cfa7] bg-[#faf6f0]/80 p-4 transition duration-150 hover:border-[#c8a45e]/60"
                >
                  <div className="text-sm font-semibold text-[#09142b]">{title}</div>
                  <p className="mt-2 text-xs text-[#4b5563] md:text-sm">{description}</p>
                  <ul className="mt-3 space-y-1.5 text-xs text-[#4b5563] md:text-sm">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#c8a45e]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
                    </div>
          </article>
        </section>

        <section className="rounded-3xl border border-[#c8a45e]/40 bg-white/90 p-6 shadow-xl">
          <div className="flex items-center gap-3 text-[#09142b]">
            <FiTrendingUp className="h-6 w-6 text-[#c8a45e]" />
            <h3 className="text-xl font-semibold">أقسام استمارة المشاركة</h3>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {FORM_SECTIONS.map(({ title, detail }) => (
              <div
                key={title}
                className="rounded-2xl border border-[#e7cfa7] bg-[#faf6f0]/70 p-4 text-sm text-[#4b5563]"
              >
                <div className="text-[#09142b] font-semibold">{title}</div>
                <p className="mt-2 text-xs leading-relaxed md:text-sm">{detail}</p>
              </div>
            ))}
            </div>
          <div className="mt-5 rounded-2xl border border-[#09142b]/15 bg-[#09142b]/5 p-5 text-xs text-[#4b5563] md:text-sm">
            بعد الإرسال ستصلك رسالة تأكيد آلية، ثم تتواصل معك اللجنة التنظيمية لتأكيد مشاركتك أو استكمال أي معلومات إضافية.
          </div>
        </section>

        <section className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-r from-[#09142b] to-[#1a2a4a] px-6 py-10 text-center text-white md:flex-row md:justify-between md:text-right">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold">سجّل مشاركتك الآن</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              تعبئة الاستمارة خطوة أساسية للانضمام إلى فعاليات الملتقى والمساهمة في جلساته وورشاته. ندعوك لاختيار الفئة المناسبة لك
              وسيقوم فريق التنظيم بالتواصل معك للتنسيق والمتابعة.
            </p>
          </div>
          <Link
            to="/national-conference-registration"
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-3 text-sm font-semibold text-[#09142b] shadow-xl transition-transform duration-300 hover:-translate-y-1"
          >
            انتقل إلى استمارة المشاركة
            <FiArrowLeft className="h-5 w-5 text-[#c8a45e] transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </section>
      </div>
    </section>
  );
};

export default NationalConferenceAnnouncement;

