import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import * as hopeForumService from "../services/hopeForumService";

const PACKAGES = [
  {
    value: "vip",
    title: "VIP",
    price: "6500 دج",
    desc: "شهادة + حقيبة + غداء فاخر في الفندق",
  },
  {
    value: "standard",
    title: "Standard",
    price: "4000 دج",
    desc: "شهادة + حقيبة الملتقى",
  },
  {
    value: "student",
    title: "Student",
    price: "2000 دج",
    desc: "شهادة مشاركة — للطلبة",
  },
];

const HopeForumRegistration = () => {
  const location = useLocation();
  const initialPkg = location.state?.package;

  const [packageChoice, setPackageChoice] = useState(
    ["vip", "standard", "student"].includes(initialPkg) ? initialPkg : "standard"
  );
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => agreed, [agreed]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    if (!canSubmit) {
      toast.error("يرجى الموافقة على صحة المعلومات قبل الإرسال");
      return;
    }

    const payload = {
      fullName: fd.get("fullName")?.toString().trim(),
      email: fd.get("email")?.toString().trim().toLowerCase(),
      phone: fd.get("phone")?.toString().trim(),
      wilaya: fd.get("wilaya")?.toString().trim(),
      organization: fd.get("organization")?.toString().trim() || undefined,
      package: packageChoice,
      notes: fd.get("notes")?.toString().trim() || undefined,
      agreed: true,
    };

    try {
      setIsSubmitting(true);
      const res = await hopeForumService.createHopeForumRegistration(payload);
      toast.success(res?.message || "تم تسجيل مشاركتك بنجاح");
      form.reset();
      setAgreed(false);
      setPackageChoice("standard");
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
        <title>التسجيل — ملتقى الأمل | SOS Law</title>
        <html lang="ar" dir="rtl" />
      </Helmet>

      <main className="min-h-screen bg-[#faf6f0]" dir="rtl">
        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-4xl px-4 md:px-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#c8a45e]">استمارة التسجيل</p>
                <h1 className="text-2xl font-extrabold text-[#09142b] md:text-4xl">
                  الملتقى العلمي «الأمل» — الطبعة الثالثة
                </h1>
                <p className="mt-2 text-[#4b5563]">
                  16 ماي 2026 — فندق بلازا، بومرداس. بعد الإرسال ستصلك رسالة تأكيد على بريدك.
                </p>
              </div>
              <Link
                to="/hope-forum"
                className="inline-flex items-center gap-2 font-semibold text-[#09142b] hover:text-[#c8a45e]"
              >
                <FiArrowLeft className="h-5 w-5" />
                العودة لتفاصيل الملتقى
              </Link>
            </div>

            <div className="rounded-3xl border border-[#e7cfa7] bg-white/95 p-6 shadow-2xl backdrop-blur md:p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div>
                  <h2 className="mb-4 text-lg font-bold text-[#09142b]">اختر الباقة</h2>
                  <p className="mb-6 text-sm text-[#6b7280]">
                    جميع الباقات تشمل حضور الملتقى وجميع المحاور التكوينية.
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    {PACKAGES.map((p) => {
                      const selected = packageChoice === p.value;
                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setPackageChoice(p.value)}
                          className={`rounded-2xl border-2 p-5 text-right transition ${
                            selected
                              ? "border-[#c8a45e] bg-[#fffdf8] shadow-md ring-1 ring-[#c8a45e]/40"
                              : "border-slate-200 bg-slate-50 hover:border-[#e7cfa7]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-[#09142b]">{p.title}</p>
                              <p className="mt-1 text-lg font-extrabold text-[#c8a45e]">{p.price}</p>
                            </div>
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                                selected
                                  ? "border-[#c8a45e] bg-[#c8a45e] text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {selected ? <FiCheck className="h-4 w-4" /> : null}
                            </span>
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-[#6b7280]">{p.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#09142b]">الاسم الكامل *</label>
                    <input
                      name="fullName"
                      required
                      minLength={3}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#09142b]">البريد الإلكتروني *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#09142b]">رقم الهاتف *</label>
                    <input
                      name="phone"
                      required
                      minLength={6}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#09142b]">الولاية *</label>
                    <input
                      name="wilaya"
                      required
                      minLength={2}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#09142b]">
                      المؤسسة / الجهة (اختياري)
                    </label>
                    <input
                      name="organization"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/30"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#09142b]">ملاحظات (اختياري)</label>
                    <textarea
                      name="notes"
                      rows={3}
                      maxLength={2000}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/30"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#c8a45e] focus:ring-[#c8a45e]"
                  />
                  <span className="text-sm leading-relaxed text-[#374151]">
                    أقر بأن المعلومات أعلاه صحيحة، وأوافق على التواصل معي بخصوص تسجيلي في ملتقى الأمل.
                  </span>
                </label>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !canSubmit}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#09142b] px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#132f52] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <FiLoader className="h-5 w-5 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "إرسال التسجيل"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default HopeForumRegistration;
