import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiTarget,
  FiCheck,
  FiUser,
  FiUsers,
  FiBriefcase,
  FiPhone,
  FiMail,
  FiHelpCircle,
  FiMap,
  FiHome,
} from "react-icons/fi";
import API_BASE_URL from "../config/api";

const trainingBenefits = [
  "دورة حضورية مجانية + حضور فعاليات الافتتاح الرسمي للمؤسسة",
  "محتوى تطبيقي قابل للتنفيذ",
  "شهادة مشاركة اختيارية + كتاب ريادة الأعمال (اختياري)",
  "أولوية في عروض الافتتاح",
  "فرصة التواصل مع مختصين",
  "الانضمام لمجتمع ريادي شبابي",
];

const trainingTopics = [
  "كيف تحوّل فكرتك إلى مشروع واقعي",
  "كيفية بناء نموذج مؤسسة اقتصادية منظم",
  "فهم أسس التخطيط والإدارة",
  "ربط الفكرة بالسوق",
  "تجنب أخطاء البداية الشائعة",
];

const participationOptions = [
  "الدورة المجانية الحضورية السبت 14 فيفري المحمدية مول الجزائر العاصمة",
  "الدورة المجانية عن بعد عبر تقنية غوغل ميت يوم 16 فيفري 2026",
];

const awarenessOptions = [
  "وسائل التواصل الاجتماعي",
  "من صديق أو زميل",
  "من خلال فعالية أو إعلان",
  "عن طريق بحث في الإنترنت",
  "أخرى",
];

const TrainingCourse = () => {
  const [formStatus, setFormStatus] = useState(null);
  const [awarenessSource, setAwarenessSource] = useState("");
  const [awarenessSourceOther, setAwarenessSourceOther] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      firstName: formData.get("firstName")?.toString().trim(),
      lastName: formData.get("lastName")?.toString().trim(),
      birthDate: formData.get("birthDate")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      profession: formData.get("profession")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      participationType: formData.get("participationType")?.toString().trim(),
      entrepreneurshipInterest: formData
        .get("entrepreneurshipInterest")
        ?.toString()
        .trim(),
      awarenessSource: formData.get("awarenessSource")?.toString().trim(),
      awarenessSourceOther: formData
        .get("awarenessSourceOther")
        ?.toString()
        .trim(),
      wilaya: formData.get("wilaya")?.toString().trim(),
      residence: formData.get("residence")?.toString().trim(),
    };

    try {
      setIsSubmitting(true);
      setFormStatus(null);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/training-course/registrations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "خطأ غير متوقع" }));

        if (response.status === 409) {
          throw new Error(
            errorData.message ||
              "تم استخدام هذا البريد الإلكتروني للتسجيل مسبقًا."
          );
        }

        throw new Error(
          errorData.message || "تعذر إرسال الاستمارة، يرجى المحاولة لاحقًا."
        );
      }

      setFormStatus({
        type: "success",
        message:
          "تم إرسال طلب التسجيل بنجاح. سيتم التواصل معك لتأكيد الحضور وإرسال دعوة المشاركة.",
      });
      form.reset();
      setAwarenessSource("");
      setAwarenessSourceOther("");
    } catch (error) {
      setFormStatus({
        type: "error",
        message: error.message || "تعذر إرسال الاستمارة، يرجى المحاولة لاحقًا.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#faf6f0] min-h-screen py-16 md:py-20" dir="rtl">
      <Helmet>
        <title>دورة تدريبية حضورية | SOS Law</title>
        <meta
          name="description"
          content="دورة تكوينية بعنوان كيفية إعداد نموذج مؤسسة اقتصادية ناجحة. التسجيل مجاني والأماكن محدودة."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <header className="flex flex-col gap-4 text-right">
          <span className="self-start rounded-full bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] px-5 py-2 text-xs font-semibold text-white shadow-lg">
            إعلان دورة تدريبية حضورية
          </span>
          <h1 className="text-3xl font-extrabold text-[#09142b] md:text-4xl lg:text-5xl">
            كيفية إعداد نموذج مؤسسة اقتصادية ناجحة
          </h1>
          <p className="max-w-3xl text-sm text-[#4b5563] md:text-base">
            تنظم مؤسسة SOS Law دورة تكوينية حضورية مجانية بمناسبة الافتتاح الرسمي
            للمؤسسة.
          </p>
          <div className="flex items-center gap-3 rounded-2xl border border-[#c8a45e]/30 bg-white/90 px-4 py-3 text-[#09142b] shadow-sm">
            <FiTarget className="h-5 w-5 text-[#c8a45e]" />
            <span className="text-sm font-semibold md:text-base">
              نؤمن بأن الفكرة القوية تحتاج تخطيطًا صحيحًا لتنجح.
            </span>
          </div>
          <p className="max-w-3xl text-sm text-[#4b5563] md:text-base">
            ورشة مجانية تجمع بين ريادة الأعمال والقانون، لتمكينك من تحويل فكرتك
            إلى مشروع قابل للتجسيد، مع إعداد نموذج مؤسسة اقتصادية، حماية الفكرة
            قانونيًا، تنظيم الشراكة، واختيار رمز النشاط الصحيح في السجل التجاري.
          </p>
        </header>

        <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="flex h-full flex-col gap-3 rounded-2xl border border-[#e7cfa7] bg-white/95 p-5 shadow-sm">
            <div className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#c8a45e] to-[#b48b5a] px-4 py-3 text-white">
              <FiCalendar className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#09142b]">التاريخ</h3>
            <p className="text-sm leading-relaxed text-[#4b5563]">
              يوم 14 فيفري 2026
            </p>
            <p className="text-xs text-[#b48b5a]">
              بمناسبة الافتتاح الرسمي للمؤسسة
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

        <section className="mt-8 rounded-3xl border border-[#e7cfa7] bg-white/95 p-6 shadow-lg">
          <div className="flex items-center gap-3 text-[#09142b]">
            <FiUsers className="h-6 w-6 text-[#c8a45e]" />
            <h3 className="text-lg font-semibold">خيارات المشاركة</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-[#4b5563] md:text-base">
            {participationOptions.map((option) => (
              <li key={option} className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-[#c8a45e]" />
                <span>{option}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
          <article className="rounded-3xl border border-[#09142b]/10 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 text-[#09142b]">
              <FiTarget className="h-6 w-6 text-[#c8a45e]" />
              <h3 className="text-xl font-semibold">لماذا هذه الدورة مهمة؟</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#4b5563] md:text-base">
              لأن أغلب الأفكار تفشل ليس لضعفها، بل لغياب نموذج اقتصادي واضح.
              هذه الورشة عملية ومبسطة وموجهة خصيصًا للشباب ورواد الأعمال.
            </p>
            <ul className="mt-5 space-y-2 rounded-2xl bg-[#faf6f0] p-4 text-sm text-[#09142b] shadow-inner">
              {trainingTopics.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#c8a45e]" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-[#e7cfa7] bg-white/95 p-6 shadow-lg">
            <div className="flex items-center gap-3 text-[#09142b]">
              <FiCheck className="h-6 w-6 text-[#c8a45e]" />
              <h3 className="text-xl font-semibold">مزايا المشاركة</h3>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-[#4b5563] md:text-base">
              {trainingBenefits.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#c8a45e]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-10 rounded-3xl border border-[#c8a45e]/40 bg-white/90 p-6 shadow-xl">
          <div className="flex items-center gap-3 text-[#09142b]">
            <FiUser className="h-6 w-6 text-[#c8a45e]" />
            <h3 className="text-xl font-semibold">مقدم الدورة</h3>
          </div>
          <div className="mt-3 text-sm text-[#4b5563] md:text-base">
            المدرب: منصوري شيت – مدير المؤسسة
          </div>
          <div className="mt-2 text-sm text-[#4b5563] md:text-base">
            المدرب القانوني: اسلام ضيافي
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[#e7cfa7] bg-white p-6 shadow-xl">
          <div className="flex items-center gap-3 text-[#09142b]">
            <FiHelpCircle className="h-6 w-6 text-[#c8a45e]" />
            <h3 className="text-xl font-semibold">نموذج التسجيل</h3>
          </div>
          <p className="mt-2 text-sm text-[#4b5563] md:text-base">
            التسجيل مجاني والأماكن محدودة. الأولوية للمسجلين مسبقًا.
          </p>
          <p className="mt-3 text-xs text-[#6b7280] md:text-sm">
            هذا التسجيل مبدئي فقط، ولا يُعد نهائيًا إلا بعد تواصل فريق العمل معك
            لتأكيد الحجز وإرسال دعوة الحضور.
          </p>

          <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <fieldset className="md:col-span-2">
              <legend className="text-sm font-semibold text-[#09142b]">
                تريد المشاركة في
              </legend>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {participationOptions.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm"
                  >
                    <input
                      type="radio"
                      name="participationType"
                      value={option}
                      required
                      className="mt-1 accent-[#b48b5a]"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="flex flex-col gap-2 text-sm text-[#09142b]">
              الاسم
              <div className="relative">
                <FiUser className="absolute right-3 top-3 h-4 w-4 text-[#b48b5a]" />
                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full rounded-xl border border-[#e7cfa7] bg-white px-10 py-2 text-sm text-[#09142b] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#b48b5a]"
                  placeholder="أدخل الاسم"
                />
              </div>
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#09142b]">
              اللقب
              <div className="relative">
                <FiUser className="absolute right-3 top-3 h-4 w-4 text-[#b48b5a]" />
                <input
                  type="text"
                  name="lastName"
                  required
                  className="w-full rounded-xl border border-[#e7cfa7] bg-white px-10 py-2 text-sm text-[#09142b] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#b48b5a]"
                  placeholder="أدخل اللقب"
                />
              </div>
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#09142b]">
              تاريخ الميلاد
              <div className="relative">
                <FiCalendar className="absolute right-3 top-3 h-4 w-4 text-[#b48b5a]" />
                <input
                  type="date"
                  name="birthDate"
                  required
                  className="w-full rounded-xl border border-[#e7cfa7] bg-white px-10 py-2 text-sm text-[#09142b] focus:outline-none focus:ring-2 focus:ring-[#b48b5a]"
                />
              </div>
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#09142b]">
              رقم الهاتف (واتساب)
              <div className="relative">
                <FiPhone className="absolute right-3 top-3 h-4 w-4 text-[#b48b5a]" />
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full rounded-xl border border-[#e7cfa7] bg-white px-10 py-2 text-sm text-[#09142b] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#b48b5a]"
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#09142b]">
              المهنة
              <div className="relative">
                <FiBriefcase className="absolute right-3 top-3 h-4 w-4 text-[#b48b5a]" />
                <input
                  type="text"
                  name="profession"
                  required
                  className="w-full rounded-xl border border-[#e7cfa7] bg-white px-10 py-2 text-sm text-[#09142b] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#b48b5a]"
                  placeholder="مثال: طالب، رائد أعمال، موظف"
                />
              </div>
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#09142b]">
              البريد الإلكتروني
              <div className="relative">
                <FiMail className="absolute right-3 top-3 h-4 w-4 text-[#b48b5a]" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-xl border border-[#e7cfa7] bg-white px-10 py-2 text-sm text-[#09142b] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#b48b5a]"
                  placeholder="example@email.com"
                />
              </div>
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#09142b]">
              هل أنت مهتم بريادة الأعمال؟
              <select
                name="entrepreneurshipInterest"
                required
                className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-2 text-sm text-[#09142b] focus:outline-none focus:ring-2 focus:ring-[#b48b5a]"
                defaultValue=""
              >
                <option value="" disabled>
                  اختر إجابة
                </option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#09142b]">
              من أين سمعت عنا؟
              <select
                name="awarenessSource"
                required
                className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-2 text-sm text-[#09142b] focus:outline-none focus:ring-2 focus:ring-[#b48b5a]"
                value={awarenessSource}
                onChange={(event) => setAwarenessSource(event.target.value)}
              >
                <option value="" disabled>
                  اختر مصدر المعرفة
                </option>
                {awarenessOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            {awarenessSource === "أخرى" && (
              <label className="flex flex-col gap-2 text-sm text-[#09142b] md:col-span-2">
                يرجى التوضيح
                <input
                  type="text"
                  name="awarenessSourceOther"
                  className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-2 text-sm text-[#09142b] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#b48b5a]"
                  placeholder="اكتب المصدر"
                  value={awarenessSourceOther}
                  onChange={(event) => setAwarenessSourceOther(event.target.value)}
                />
              </label>
            )}
            <label className="flex flex-col gap-2 text-sm text-[#09142b]">
              من أي ولاية أنت؟
              <div className="relative">
                <FiMap className="absolute right-3 top-3 h-4 w-4 text-[#b48b5a]" />
                <input
                  type="text"
                  name="wilaya"
                  required
                  className="w-full rounded-xl border border-[#e7cfa7] bg-white px-10 py-2 text-sm text-[#09142b] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#b48b5a]"
                  placeholder="أدخل الولاية"
                />
              </div>
            </label>
            <label className="flex flex-col gap-2 text-sm text-[#09142b]">
              مكان الإقامة
              <div className="relative">
                <FiHome className="absolute right-3 top-3 h-4 w-4 text-[#b48b5a]" />
                <input
                  type="text"
                  name="residence"
                  required
                  className="w-full rounded-xl border border-[#e7cfa7] bg-white px-10 py-2 text-sm text-[#09142b] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#b48b5a]"
                  placeholder="المدينة أو الحي"
                />
              </div>
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-2xl bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 ${
                  isSubmitting ? "opacity-70" : "hover:-translate-y-0.5"
                }`}
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال طلب التسجيل"}
              </button>
              {formStatus && (
                <div
                  className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                    formStatus.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {formStatus.message}
                </div>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default TrainingCourse;
