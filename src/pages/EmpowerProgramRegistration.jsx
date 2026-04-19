import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiCheckCircle, FiFileText, FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as empowerProgramService from "../services/empowerProgramService";

const INVOLVEMENT = ["نادي جامعي", "جمعية", "منظمة"];
const EXPERIENCE = ["التسويق", "البيع", "إدارة فرق", "صناعة المحتوى", "الادارة واللوجيستيك"];
const RATINGS = ["ضعيف", "متوسط", "جيد", "ممتاز"];

const EmpowerProgramRegistration = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [involvement, setInvolvement] = useState([]);
  const [experience, setExperience] = useState([]);
  const [communicationRating, setCommunicationRating] = useState("");
  const [canSpeakPublicly, setCanSpeakPublicly] = useState(null);

  const [interests, setInterests] = useState({
    law: false,
    entrepreneurship: false,
    training: false,
  });

  const toggle = (arr, value) => (arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);

  const canSubmit = useMemo(() => {
    return agreed && communicationRating && canSpeakPublicly !== null;
  }, [agreed, communicationRating, canSpeakPublicly]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    if (!canSubmit) {
      toast.error("يرجى إكمال الحقول المطلوبة والتعهد قبل الإرسال");
      return;
    }

    const payload = {
      fullName: fd.get("fullName")?.toString().trim(),
      birthDate: fd.get("birthDate")?.toString().trim(),
      phone: fd.get("phone")?.toString().trim(),
      email: fd.get("email")?.toString().trim().toLowerCase(),
      wilaya: fd.get("wilaya")?.toString().trim(),
      commune: fd.get("commune")?.toString().trim(),
      educationLevel: fd.get("educationLevel")?.toString().trim(),
      specialization: fd.get("specialization")?.toString().trim(),
      interests,
      involvement,
      hasStartupIdea: fd.get("hasStartupIdea") === "yes",
      participatedInProgramsBefore: fd.get("participatedInProgramsBefore") === "yes",
      experience,
      communicationRating,
      canSpeakPublicly: canSpeakPublicly === "yes",
      topSkills: fd.get("topSkills")?.toString().trim(),
      projectIdea: fd.get("projectIdea")?.toString().trim() || undefined,
      socialLinks: fd.get("socialLinks")?.toString().trim() || undefined,
      audienceInfo: fd.get("audienceInfo")?.toString().trim() || undefined,
      additionalNotes: fd.get("additionalNotes")?.toString().trim() || undefined,
      agreed,
    };

    try {
      setIsSubmitting(true);
      const res = await empowerProgramService.createEmpowerProgramRegistration(payload);
      if (res?.success === false) {
        throw new Error(res?.message || "فشل التسجيل");
      }
      toast.success(res?.message || "تم تسجيلك بنجاح");
      form.reset();
      setAgreed(false);
      setInvolvement([]);
      setExperience([]);
      setCommunicationRating("");
      setCanSpeakPublicly(null);
      setInterests({ law: false, entrepreneurship: false, training: false });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "حدث خطأ أثناء التسجيل";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>استمارة الترشح – برنامج SOS Law للتكوين والتمكين</title>
        <html lang={i18n.language || "ar"} dir={isRTL ? "rtl" : "ltr"} />
      </Helmet>

      <main className="min-h-screen bg-[#faf6f0]" dir={isRTL ? "rtl" : "ltr"}>
        <section className="py-10 md:py-14">
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
              <div>
                <p className="text-sm font-semibold text-[#c8a45e]">استمارة الترشح</p>
                <h1 className="text-2xl md:text-4xl font-extrabold text-[#09142b]">
                  برنامج SOS Law للتكوين والتمكين
                </h1>
                <p className="text-[#4b5563] mt-2">املأ البيانات بدقة. بعد التسجيل سيتم إرسال رسالة تأكيد إلى بريدك الإلكتروني.</p>
              </div>
              <Link to="/empower-program" className="inline-flex items-center gap-2 text-[#09142b] font-semibold hover:text-[#c8a45e]">
                <FiArrowLeft className="w-5 h-5" />
                معلومات البرنامج
              </Link>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-3xl border border-[#e7cfa7] shadow-2xl p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="p-3 rounded-xl bg-[#c8a45e]/15 text-[#c8a45e]">
                      <FiFileText className="w-6 h-6" />
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-[#09142b]">القسم الأول: المعلومات الأساسية</h2>
                      <p className="text-sm text-[#6b7280]">الحقول بعلامة * إلزامية.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="fullName">الاسم واللقب *</label>
                      <input id="fullName" name="fullName" type="text" required className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="birthDate">تاريخ الميلاد *</label>
                      <input id="birthDate" name="birthDate" type="text" required placeholder="مثال: 2002-01-15" className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="phone">رقم الهاتف *</label>
                      <input id="phone" name="phone" type="tel" required className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="email">البريد الإلكتروني *</label>
                      <input id="email" name="email" type="email" required className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="wilaya">الولاية *</label>
                      <input id="wilaya" name="wilaya" type="text" required className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="commune">البلدية *</label>
                      <input id="commune" name="commune" type="text" required className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="educationLevel">المستوى الدراسي *</label>
                      <input id="educationLevel" name="educationLevel" type="text" required className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="specialization">التخصص *</label>
                      <input id="specialization" name="specialization" type="text" required className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#09142b]/10 bg-[#09142b]/5 p-6">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4">القسم الثاني: الخلفية والاهتمامات</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                      { key: "law", label: "هل لديك اهتمام بمجال القانون؟" },
                      { key: "entrepreneurship", label: "هل لديك اهتمام بمجال ريادة الأعمال؟" },
                      { key: "training", label: "هل لديك اهتمام بمجال التدريب؟" },
                    ].map((q) => (
                      <label key={q.key} className="flex items-center gap-2 text-sm text-[#09142b]">
                        <input
                          type="checkbox"
                          checked={interests[q.key]}
                          onChange={(e) => setInterests((p) => ({ ...p, [q.key]: e.target.checked }))}
                        />
                        <span>{q.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-[#09142b] mb-2">هل سبق لك الانخراط في:</p>
                      <div className="space-y-2">
                        {INVOLVEMENT.map((opt) => (
                          <label key={opt} className="flex items-center gap-2 text-sm text-[#4b5563]">
                            <input
                              type="checkbox"
                              checked={involvement.includes(opt)}
                              onChange={() => setInvolvement((p) => toggle(p, opt))}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-[#09142b] mb-2">هل لديك فكرة مشروع ناشئ؟</p>
                        <div className="flex gap-4 text-sm">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="hasStartupIdea" value="yes" required />
                            نعم
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="hasStartupIdea" value="no" required />
                            لا
                          </label>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#09142b] mb-2">هل شاركت في برامج تدريبية من قبل؟</p>
                        <div className="flex gap-4 text-sm">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="participatedInProgramsBefore" value="yes" required />
                            نعم
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="participatedInProgramsBefore" value="no" required />
                            لا
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#09142b] mb-4">القسم الثالث: الخبرات والمهارات</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-[#e7cfa7] p-5">
                      <p className="text-sm font-semibold text-[#09142b] mb-3">هل لديك تجربة في:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {EXPERIENCE.map((opt) => (
                          <label key={opt} className="flex items-center gap-2 text-sm text-[#4b5563]">
                            <input
                              type="checkbox"
                              checked={experience.includes(opt)}
                              onChange={() => setExperience((p) => toggle(p, opt))}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#e7cfa7] p-5 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-[#09142b] mb-2">كيف تقيم مهاراتك في التواصل؟ *</p>
                        <select
                          value={communicationRating}
                          onChange={(e) => setCommunicationRating(e.target.value)}
                          required
                          className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm bg-white"
                        >
                          <option value="">اختر...</option>
                          {RATINGS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#09142b] mb-2">هل تستطيع التحدث أمام جمهور؟ *</p>
                        <div className="flex gap-4 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="canSpeakPubliclyRadio"
                              checked={canSpeakPublicly === "yes"}
                              onChange={() => setCanSpeakPublicly("yes")}
                            />
                            نعم
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="canSpeakPubliclyRadio"
                              checked={canSpeakPublicly === "no"}
                              onChange={() => setCanSpeakPublicly("no")}
                            />
                            لا
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 mt-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="topSkills">ما هي أهم 3 مهارات تميزك؟ *</label>
                      <input id="topSkills" name="topSkills" required placeholder="مثال: التواصل، التنظيم، الإقناع" className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="projectIdea">هل لديك فكرة مشروع ترغب في تطويرها معنا؟ (اختياري)</label>
                      <textarea id="projectIdea" name="projectIdea" rows={4} className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#09142b]/10 bg-[#09142b]/5 p-6">
                  <h2 className="text-xl font-bold text-[#09142b] mb-4">القسم الرابع: معلومات إضافية</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="socialLinks">
                        حساباتك على مواقع التواصل (Facebook / Instagram / LinkedIn)
                      </label>
                      <input id="socialLinks" name="socialLinks" className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="audienceInfo">
                        هل لديك جمهور أو صفحة؟ كم عدد المتابعين؟ (اختياري)
                      </label>
                      <input id="audienceInfo" name="audienceInfo" className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-semibold text-[#09142b]" htmlFor="additionalNotes">
                        هل لديك أي شيء تريد إضافته؟ (اختياري)
                      </label>
                      <textarea id="additionalNotes" name="additionalNotes" rows={4} className="w-full rounded-xl border border-[#e7cfa7] px-4 py-3 text-sm" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e7cfa7] bg-white p-5">
                  <label className="flex items-start gap-3 text-sm text-[#4b5563]">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <span>
                      <strong className="text-[#09142b]">تعهد:</strong> “أتعهد بأن المعلومات المقدمة صحيحة، وألتزم باحترام قوانين برنامج سفراء SOS Law.”
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#09142b] text-white font-bold hover:bg-[#1b2742] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-5 h-5" />
                      إرسال الطلب
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default EmpowerProgramRegistration;

