import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  FiCalendar,
  FiClock,
  FiMic,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";
import API_BASE_URL from "../config/api";

import voiceCourseImg1 from "../assets/Voice Course images/img1.jpeg";
import voiceCourseImg2 from "../assets/Voice Course images/img2.jpeg";
import voiceCourseImg3 from "../assets/Voice Course images/img3.jpeg";

const VOICE_COURSE_IMAGES = [voiceCourseImg1, voiceCourseImg2, voiceCourseImg3];

const PACKAGES = [
  {
    value: "حضور الدورة فقط (مجاني)",
    title: "حضور الدورة فقط",
    price: "مجاني",
    description: null,
  },
  {
    value: "أطلب شهادة مشاركة إلكترونية قابلة للطبع – 1000 دج",
    title: "شهادة مشاركة إلكترونية قابلة للطبع",
    price: "1000 دج",
    description: null,
  },
  {
    value: "أطلب كتاب \"الدليل الشامل لمهارات العرض والإلقاء\" + الورشة المسجلة عبر تلغرام – 2500 دج",
    title: "كتاب «الدليل الشامل لمهارات العرض والإلقاء» + الورشة المسجلة عبر تلغرام",
    price: "2500 دج",
    description: null,
  },
  {
    value: "أطلب الباقة الكاملة (الكتاب + الورشة المسجلة + شهادة المشاركة) – 3000 دج",
    title: "الباقة الكاملة",
    price: "3000 دج",
    description: "الكتاب + الورشة المسجلة + شهادة المشاركة",
  },
];

const ROLES = [
  "طالب",
  "خريج",
  "مدرب",
  "صاحب مشروع",
  "موظف",
  "أخرى",
];

const INTERESTS = [
  "ريادة الأعمال وإنشاء المؤسسات الناشئة",
  "تطوير المهارات الشخصية وبناء الثقة",
  "التدريب وصناعة المحتوى التعليمي",
  "تقديم مذكرات التخرج والعروض الجامعية",
  "مهارات الإلقاء والخطابة",
  "التسويق والعرض أمام المستثمرين",
  "القانون والمجال القانوني للمؤسسات",
  "التجارة الإلكترونية والمشاريع الرقمية",
  "البحث عن فرص عمل وتطوير المسار المهني",
  "أخرى",
];

const VoiceCourseRegistration = () => {
  const [role, setRole] = useState("");
  const [roleOther, setRoleOther] = useState("");
  const [interests, setInterests] = useState([]);
  const [interestsOther, setInterestsOther] = useState("");
  const [agreeMeet, setAgreeMeet] = useState(false);
  const [agreeTelegram, setAgreeTelegram] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!previewImage) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") setPreviewImage(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [previewImage]);

  const toggleInterest = (item) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    if (item === "أخرى") setInterestsOther("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!agreeMeet || !agreeTelegram) {
      setFormStatus({
        type: "error",
        message: "يرجى الموافقة على الالتزام بحضور الدورة عبر Google Meet والانضمام لمجموعة التلغرام.",
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: formData.get("fullName")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      email: formData.get("email")?.toString().trim().toLowerCase(),
      wilaya: formData.get("wilaya")?.toString().trim(),
      role: role || formData.get("role")?.toString().trim(),
      roleOther: role === "أخرى" ? roleOther.trim() : undefined,
      whyAttend: formData.get("whyAttend")?.toString().trim() || undefined,
      package: formData.get("package")?.toString().trim(),
      agreeMeet: true,
      agreeTelegram: true,
      interests: interests.filter(Boolean),
      interestsOther: interests.includes("أخرى") ? interestsOther.trim() : undefined,
    };

    try {
      setIsSubmitting(true);
      setFormStatus(null);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/voice-course/registrations`,
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
            errorData.message || "تم استخدام هذا البريد الإلكتروني للتسجيل مسبقًا."
          );
        }
        throw new Error(
          errorData.message || "تعذر إرسال الاستمارة، يرجى المحاولة لاحقًا."
        );
      }

      setFormStatus({
        type: "success",
        message:
          "تم إرسال طلب التسجيل بنجاح. سيتم التواصل معك لتأكيد الحضور ومتابعة المستجدات عبر البريد والتلغرام.",
      });
      form.reset();
      setRole("");
      setRoleOther("");
      setInterests([]);
      setInterestsOther("");
      setAgreeMeet(false);
      setAgreeTelegram(false);
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
        <title>استمارة التسجيل – دورة الإلقاء والتأثير الصوتي (عرض رمضان) | SOS Law</title>
        <meta
          name="description"
          content="سجّل في دورة الإلقاء والتأثير الصوتي المجانية. الأحد 08 مارس 2026 الساعة 21:45 عبر Google Meet. باقات اختيارية: شهادة، كتاب، ورشة مسجلة."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Hero + Date/Time clear */}
        <header className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] text-white text-sm font-semibold shadow-lg">
            عرض رمضان – دورة مجانية
          </span>
          <h1 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#09142b] leading-tight">
            استمارة التسجيل – دورة الإلقاء والتأثير الصوتي
          </h1>
          <p className="mt-4 text-lg text-[#09142b] font-semibold">
            استثمر في صوتك… فهو أول ما يسمعه الناس منك، وأول ما يصنع انطباعهم عنك.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-[#e7cfa7] bg-white p-4 shadow-sm">
              <span className="p-3 rounded-xl bg-[#c8a45e]/15 text-[#c8a45e]">
                <FiCalendar className="w-6 h-6" />
              </span>
              <div className="text-right">
                <div className="text-sm font-semibold text-[#09142b]">التاريخ</div>
                <div className="text-base font-bold text-[#b48b5a]">الأحد 08 مارس 2026</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[#e7cfa7] bg-white p-4 shadow-sm">
              <span className="p-3 rounded-xl bg-[#c8a45e]/15 text-[#c8a45e]">
                <FiClock className="w-6 h-6" />
              </span>
              <div className="text-right">
                <div className="text-sm font-semibold text-[#09142b]">الوقت</div>
                <div className="text-base font-bold text-[#b48b5a]">21:45</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[#e7cfa7] bg-white p-4 shadow-sm">
              <span className="p-3 rounded-xl bg-[#c8a45e]/15 text-[#c8a45e]">
                <FiMic className="w-6 h-6" />
              </span>
              <div className="text-right">
                <div className="text-sm font-semibold text-[#09142b]">طريقة الحضور</div>
                <div className="text-sm text-[#4b5563]">دورة مجانية عبر Google Meet</div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-base text-[#4b5563] max-w-2xl mx-auto">
            الدورة مجانية. للاستفادة الكاملة يمكنك اختيار إحدى الباقات في الاستمارة أدناه.
          </p>
        </header>

        {/* 3 images */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {VOICE_COURSE_IMAGES.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPreviewImage(src)}
              className="rounded-2xl overflow-hidden border border-[#e7cfa7] shadow-lg aspect-[4/3] bg-slate-100 w-full text-left focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2 hover:opacity-95 transition"
            >
              <img
                src={src}
                alt={`دورة الإلقاء والتأثير الصوتي ${i + 1}`}
                className="w-full h-full object-cover pointer-events-none"
              />
            </button>
          ))}
        </section>

        {/* Full photo preview modal */}
        {previewImage && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="معاينة الصورة"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setPreviewImage(null)}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 left-4 z-10 rounded-full bg-white/90 p-2 text-[#09142b] shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#c8a45e]"
              aria-label="إغلاق"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={previewImage}
              alt="معاينة الصورة"
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <section className="bg-white/95 backdrop-blur rounded-3xl border border-[#e7cfa7] shadow-2xl p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 1. المعلومات الأساسية */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-3 rounded-xl bg-[#c8a45e]/15 text-[#c8a45e]">
                  <FiUser className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-[#09142b]">1️⃣ المعلومات الأساسية</h3>
                  <p className="text-sm text-[#6b7280]">الاسم، الهاتف، البريد، الولاية، الصفة</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="fullName">
                    الاسم واللقب (إجباري)
                  </label>
                  <div className="relative">
                    <FiUser className="absolute right-3 top-3.5 h-4 w-4 text-[#c8a45e]" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white pl-4 pr-10 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="الاسم واللقب"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="phone">
                    رقم الهاتف (واتساب)
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute right-3 top-3.5 h-4 w-4 text-[#c8a45e]" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white pl-4 pr-10 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="مثال: 0550 000 000"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="email">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <FiMail className="absolute right-3 top-3.5 h-4 w-4 text-[#c8a45e]" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white pl-4 pr-10 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[#09142b]" htmlFor="wilaya">
                    الولاية
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute right-3 top-3.5 h-4 w-4 text-[#c8a45e]" />
                    <input
                      id="wilaya"
                      name="wilaya"
                      type="text"
                      required
                      className="w-full rounded-xl border border-[#e7cfa7] bg-white pl-4 pr-10 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                      placeholder="مثال: الجزائر"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-semibold text-[#09142b]">الصفة</label>
                  <select
                    name="role"
                    required
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (e.target.value !== "أخرى") setRoleOther("");
                    }}
                    className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                  >
                    <option value="">اختر الصفة</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {role === "أخرى" && (
                    <input
                      type="text"
                      name="roleOther"
                      value={roleOther}
                      onChange={(e) => setRoleOther(e.target.value)}
                      placeholder="يُذكر"
                      required
                      className="mt-2 w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 2. لماذا ترغب في حضور الدورة */}
            <div className="rounded-2xl border border-[#e7cfa7] bg-[#faf6f0]/70 p-6">
              <h3 className="text-lg font-semibold text-[#09142b] mb-2">2️⃣ لماذا ترغب في حضور الدورة؟ (اختياري)</h3>
              <p className="text-sm text-[#6b7280] mb-3">اذكر في سطرين ما الذي تريد تطويره في مهارات الإلقاء؟</p>
              <textarea
                id="whyAttend"
                name="whyAttend"
                rows={4}
                className="w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                placeholder="اكتب هنا..."
              />
            </div>

            {/* 3. باقة الاستفادة */}
            <div className="rounded-2xl border border-[#c8a45e]/30 bg-white p-6 md:p-8 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-[#09142b] px-3 py-1 text-xs font-bold text-white">
                  الدورة مجانية
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[#09142b] mb-1">باقة الاستفادة</h3>
              <p className="text-sm text-[#4b5563] mb-6">
                للاستفادة الكاملة يرجى اختيار إحدى الباقات التالية:
              </p>
              <div className="space-y-4">
                {PACKAGES.map((p) => (
                  <label
                    key={p.value}
                    className="flex cursor-pointer items-start gap-4 rounded-xl border-2 border-[#e7cfa7] bg-[#faf6f0]/60 px-4 py-4 text-right transition hover:border-[#c8a45e]/50 hover:bg-[#faf6f0] focus-within:ring-2 focus-within:ring-[#c8a45e]/40 focus-within:ring-offset-2"
                  >
                    <input
                      type="radio"
                      name="package"
                      value={p.value}
                      required
                      className="mt-1.5 h-5 w-5 shrink-0 accent-[#b48b5a]"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block font-semibold text-[#09142b]">{p.title}</span>
                      {p.description && (
                        <span className="mt-0.5 block text-sm text-[#4b5563]">{p.description}</span>
                      )}
                      <span
                        className={`mt-1 inline-block text-sm font-bold ${p.price === "مجاني" ? "text-emerald-600" : "text-[#b48b5a]"}`}
                      >
                        {p.price}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. تأكيد */}
            <div className="rounded-2xl border border-[#e7cfa7] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#09142b] mb-4">4️⃣ تأكيد مهم</h3>
              <label className="flex items-center gap-3 text-sm font-medium text-[#09142b] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeMeet}
                  onChange={(e) => setAgreeMeet(e.target.checked)}
                  className="rounded border-[#c8a45e] text-[#c8a45e] focus:ring-[#c8a45e]"
                />
                أتعهد بالالتزام بحضور الدورة عبر Google Meet
              </label>
              <label className="flex items-center gap-3 mt-3 text-sm font-medium text-[#09142b] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTelegram}
                  onChange={(e) => setAgreeTelegram(e.target.checked)}
                  className="rounded border-[#c8a45e] text-[#c8a45e] focus:ring-[#c8a45e]"
                />
                أتعهد بالانضمام إلى مجموعة التلغرام الخاصة بالدورة لمتابعة المستجدات
              </label>
            </div>

            {/* 5. مجالات الاهتمام */}
            <div className="rounded-2xl border border-[#e7cfa7] bg-[#faf6f0]/70 p-6">
              <h3 className="text-lg font-semibold text-[#09142b] mb-2">5️⃣ ما هي مجالات اهتمامك؟ (يمكن اختيار أكثر من إجابة)</h3>
              <p className="text-sm text-[#6b7280] mb-4">
                اختياراتك تساعدنا على تطوير برامج تدريبية تناسب احتياجاتك الفعلية.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INTERESTS.map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#e7cfa7] bg-white px-4 py-2.5 text-sm text-[#09142b] hover:border-[#c8a45e]/60"
                  >
                    <input
                      type="checkbox"
                      checked={interests.includes(item)}
                      onChange={() => toggleInterest(item)}
                      className="rounded border-[#c8a45e] text-[#c8a45e] focus:ring-[#c8a45e]"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              {interests.includes("أخرى") && (
                <input
                  type="text"
                  name="interestsOther"
                  value={interestsOther}
                  onChange={(e) => setInterestsOther(e.target.value)}
                  placeholder="يُذكر"
                  required
                  className="mt-3 w-full rounded-xl border border-[#e7cfa7] bg-white px-4 py-3 text-sm text-[#09142b] shadow-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/40"
                />
              )}
            </div>

            {formStatus && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  formStatus.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {formStatus.message}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#09142b] to-[#1a2a4a] text-white font-bold shadow-xl transition-transform duration-300 ${
                  isSubmitting ? "opacity-60" : "hover:shadow-2xl hover:-translate-y-1"
                }`}
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال الاستمارة"}
                <FiArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </section>

        <p className="mt-8 text-center text-sm text-[#6b7280]">
          التاريخ: الأحد 08 مارس 2026 – الساعة 21:45 | الدورة مجانية عبر Google Meet
        </p>
      </div>
    </main>
  );
};

export default VoiceCourseRegistration;
