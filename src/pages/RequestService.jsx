import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiUser,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiLoader,
  FiSend,
  FiLogIn,
} from "react-icons/fi";
import serviceRequestService from "../services/serviceRequestService";
import toast from "react-hot-toast";
import { services } from "./components/servicesData";
import { getServiceDatabaseId } from "../utils/serviceMapping";
import API_BASE_URL from "../config/api.js";
import { useAuth } from "../contexts/useAuth";

const RequestService = () => {
  const { serviceId: urlServiceId } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    serviceId: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    serviceDescription: "",
    urgency: "normal",
    preferredDate: "",
    additionalRequirements: "",
    preferredConsultantId: "",
    selectedPlan: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [loadingConsultants, setLoadingConsultants] = useState(false);

  // Use static services data
  const servicesList = services;

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setLoadingConsultants(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/consultants/public`);
        if (response.ok) {
          const data = await response.json();
          setConsultants(data.data || []);
        }
      } catch {
        // ignore
      } finally {
        setLoadingConsultants(false);
      }
    };
    fetchConsultants();
  }, []);

  // Pre-fill service when URL contains serviceId
  useEffect(() => {
    if (urlServiceId && servicesList.length > 0) {
      const selectedService = servicesList.find(
        (service) => service.id === urlServiceId
      );
      if (selectedService) {
        setFormData((prev) => ({
          ...prev,
          serviceId: selectedService.id,
        }));
      }
    }
  }, [urlServiceId, servicesList]);

  // Pre-fill name, email, phone from logged-in user (no need to re-enter)
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        clientName: user.fullName || prev.clientName,
        clientEmail: user.email || prev.clientEmail,
        clientPhone: user.phoneNumber || prev.clientPhone,
      }));
    }
  }, [isAuthenticated, user]);

  // Get selected service details
  const selectedService = servicesList.find(
    (service) => service.id === formData.serviceId
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("يجب تسجيل الدخول لطلب الخدمة وتتبع طلبك");
      return;
    }
    setIsSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = [
        "serviceId",
        "clientName",
        "clientEmail",
        "clientPhone",
        "serviceDescription",
      ];
      const missingFields = requiredFields.filter(
        (field) => !formData[field] || String(formData[field]).trim() === ""
      );
      if (missingFields.length > 0) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        setIsSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.clientEmail.trim())) {
        toast.error("يرجى إدخال بريد إلكتروني صحيح");
        setIsSubmitting(false);
        return;
      }

      // Validate phone format (basic validation)
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
      if (!phoneRegex.test(formData.clientPhone.trim())) {
        toast.error("يرجى إدخال رقم هاتف صحيح");
        setIsSubmitting(false);
        return;
      }

      // Validate plan selection for legal-consultation service
      if (formData.serviceId === 'legal-consultation' && !formData.selectedPlan) {
        toast.error("يرجى اختيار باقة الاستشارة القانونية");
        setIsSubmitting(false);
        return;
      }

      // Convert frontend service ID to database ID
      const databaseServiceId = getServiceDatabaseId(formData.serviceId);
      if (!databaseServiceId) {
        toast.error("خدمة غير صحيحة");
        setIsSubmitting(false);
        return;
      }

      // Prepare data for backend (convert serviceId to numeric)
      // Use form values (pre-filled from account when logged in, client can change them)
      const requestData = {
        ...formData,
        serviceId: databaseServiceId,
      };

      // Send the request to the backend
      const response = await serviceRequestService.createServiceRequest(
        requestData
      );

      if (response.success) {
        const checkoutUrl = response.data?.checkoutUrl;
        if (checkoutUrl) {
          window.dispatchEvent(new CustomEvent("refreshNotifications"));
          window.location.href = checkoutUrl;
          return;
        }
        const isPaidPlan =
          formData.serviceId === "legal-consultation" &&
          formData.selectedPlan &&
          formData.selectedPlan !== "free-special-needs";
        if (isPaidPlan) {
          toast.success(
            "تم حفظ طلبك بنجاح. يمكنك الدفع لاحقاً من صفحة طلباتك."
          );
        } else {
          toast.success(
            "تم إرسال طلب الخدمة بنجاح! يمكنك مراجعة طلباتك في صفحة 'طلباتك'"
          );
        }
        window.dispatchEvent(new CustomEvent("refreshNotifications"));

        // Reset form
        setFormData({
          serviceId: "",
          clientName: "",
          clientEmail: "",
          clientPhone: "",
          clientAddress: "",
          serviceDescription: "",
          urgency: "normal",
          preferredDate: "",
          additionalRequirements: "",
          preferredConsultantId: "",
          selectedPlan: "",
        });
      } else {
        toast.error(response.message || "حدث خطأ أثناء إرسال الطلب");
      }
    } catch (error) {
      console.error("Error submitting service request:", error);

      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error("انتهت صلاحية الجلسة. يرجى المحاولة مرة أخرى");
      } else if (error.response?.status === 403) {
        toast.error("ليس لديك صلاحية لطلب هذه الخدمة");
      } else if (error.response?.data?.message) {
        toast.error(`خطأ: ${error.response.data.message}`);
      } else {
        toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLegalConsultation = formData.serviceId === "legal-consultation";
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 transition focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/30";
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div className="min-h-screen bg-slate-100 py-8 sm:py-12" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <header className="mb-8 text-center sm:mb-10">
          <h1 className="text-2xl font-bold text-[#09142b] sm:text-3xl">
            طلب خدمة
          </h1>
          {selectedService ? (
            <>
              <p className="mt-2 text-[#c8a45e] font-medium">
                {selectedService.title.ar}
              </p>
              <p className="mt-1 max-w-xl mx-auto text-slate-600 text-sm">
                {selectedService.description.ar}
              </p>
            </>
          ) : (
            <p className="mt-2 text-slate-600 text-sm max-w-lg mx-auto">
              اختر الخدمة واملأ البيانات. سنراجع طلبك ونتواصل معك في أقرب وقت.
            </p>
          )}
        </header>

        {/* Login required notice for guests */}
        {!isAuthenticated && (
          <div className="mb-6 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-center shadow-sm">
            <p className="font-medium text-amber-900">
              لطلب الخدمة وتتبع طلبك، يرجى تسجيل الدخول أو إنشاء حساب.
            </p>
            <p className="mt-1 text-sm text-amber-800">
              يمكنك تصفح الصفحة وملء البيانات، لكن إرسال الطلب يتطلب حساباً.
            </p>
            <Link
              to="/auth"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#09142b] px-5 py-2.5 font-semibold text-white transition hover:bg-[#0b1a36]"
            >
              <FiLogIn className="h-5 w-5" />
              تسجيل الدخول / إنشاء حساب
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service picker (when no service in URL) */}
          {!selectedService && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className={labelClass}>
                الخدمة <span className="text-rose-500">*</span>
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleInputChange}
                required
                className={inputClass}
              >
                <option value="">اختر الخدمة</option>
                {servicesList.map((s) => (
                  <option key={s.id} value={s.id}>{s.title.ar}</option>
                ))}
              </select>
            </section>
          )}

          {/* Plan selection – legal consultation only, shown first */}
          {isLegalConsultation && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#09142b] mb-1">
                اختر الباقة <span className="text-rose-500">*</span>
              </h2>
              <p className="text-slate-600 text-sm mb-4">
                حدد الباقة المناسبة لاحتياجك. الدفع يتم لاحقاً بعد التأكيد.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    id: "free-special-needs",
                    title: "ذوي الاحتياجات الخاصة",
                    desc: "30 دقيقة · عن بُعد أو حضوري",
                    price: "مجانًا",
                    icon: FiUser,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    border: "border-amber-200",
                  },
                  {
                    id: "mini-15min",
                    title: "باقة Mini",
                    desc: "15 دقيقة · سؤال محدد · عن بُعد",
                    price: "1000 دج",
                    icon: FiClock,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                  },
                  {
                    id: "standard-30min",
                    title: "باقة Standard",
                    desc: "30 دقيقة · تحليل + توجيه · عن بُعد",
                    price: "2000 دج",
                    icon: FiFileText,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                    border: "border-emerald-200",
                  },
                  {
                    id: "premium-45min",
                    title: "باقة Premium",
                    desc: "45 دقيقة · استشارة معمقة · ملاحظات مكتوبة",
                    price: "3000 دج",
                    icon: FiCheckCircle,
                    color: "text-violet-600",
                    bg: "bg-violet-50",
                    border: "border-violet-200",
                  },
                ].map((plan) => {
                  const Icon = plan.icon;
                  const selected = formData.selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, selectedPlan: plan.id }))
                      }
                      className={`flex items-start gap-4 rounded-xl border-2 p-4 text-right transition hover:shadow-md ${
                        selected
                          ? `border-[#c8a45e] bg-amber-50/50 shadow-sm`
                          : `border-slate-200 bg-white hover:border-slate-300`
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${selected ? "bg-[#c8a45e] text-white" : plan.bg + " " + plan.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[#09142b]">
                          {plan.title}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {plan.desc}
                        </div>
                        <div className="mt-2 font-bold text-[#09142b]">
                          {plan.price}
                        </div>
                      </div>
                      {selected && (
                        <span className="shrink-0 text-[#c8a45e]">
                          <FiCheckCircle className="h-6 w-6" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {!formData.selectedPlan && (
                <p className="mt-2 text-sm text-rose-600">
                  يرجى اختيار باقة للمتابعة
                </p>
              )}
            </section>
          )}

          {/* Your details — pre-filled when logged in, always editable */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#09142b] mb-4 flex items-center gap-2">
              <FiUser className="h-5 w-5 text-[#c8a45e]" />
              بياناتك
            </h2>
            {isAuthenticated && user && (
              <p className="text-sm text-slate-600 mb-4">
                تم تعبئة البيانات من حسابك. يمكنك تعديلها إن رغبت.
              </p>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  الاسم الكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                  placeholder="الاسم الكامل"
                />
              </div>
              <div>
                <label className={labelClass}>
                  البريد الإلكتروني <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className={labelClass}>
                  رقم الهاتف <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                  placeholder="+213 550 00 00 00"
                />
              </div>
              <div>
                <label className={labelClass}>العنوان (اختياري)</label>
                <input
                  type="text"
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="المدينة أو العنوان"
                />
              </div>
            </div>
          </section>

          {/* Service details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#09142b] mb-4 flex items-center gap-2">
              <FiFileText className="h-5 w-5 text-[#c8a45e]" />
              تفاصيل الطلب
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  وصف الخدمة المطلوبة <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={inputClass + " resize-y min-h-[100px]"}
                  placeholder="اشرح ما تحتاجه بالتفصيل..."
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>مستوى الأولوية</label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="low">منخفضة</option>
                    <option value="normal">عادية</option>
                    <option value="high">عالية</option>
                    <option value="urgent">عاجل</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>التاريخ المفضل (اختياري)</label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>متطلبات إضافية (اختياري)</label>
                <textarea
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleInputChange}
                  rows={2}
                  className={inputClass + " resize-y"}
                  placeholder="ملاحظات أو متطلبات إضافية..."
                />
              </div>
              <div>
                <label className={labelClass}>المستشار المفضل (اختياري)</label>
                {loadingConsultants ? (
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
                    <FiLoader className="h-5 w-5 animate-spin" />
                    <span className="text-sm">جاري تحميل المستشارين...</span>
                  </div>
                ) : (
                  <select
                    name="preferredConsultantId"
                    value={formData.preferredConsultantId}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="">بدون تفضيل</option>
                    {consultants.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} – {c.specialization || "مستشار قانوني"}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </section>

          {/* Submit / Go to payment */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !isAuthenticated}
              className="w-full rounded-xl bg-[#09142b] py-4 px-6 font-semibold text-white shadow-lg transition hover:bg-[#0b1a36] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="h-5 w-5 animate-spin" />
                  {isLegalConsultation && formData.selectedPlan && formData.selectedPlan !== "free-special-needs"
                    ? "جاري التحويل لصفحة الدفع..."
                    : "جاري الإرسال..."}
                </>
              ) : (
                <>
                  <FiSend className="h-5 w-5" />
                  {isLegalConsultation && formData.selectedPlan && formData.selectedPlan !== "free-special-needs"
                    ? "متابعة للدفع"
                    : "إرسال طلب الخدمة"}
                </>
              )}
            </button>
            <p className="text-center text-slate-500 text-sm">
              {isLegalConsultation && formData.selectedPlan && formData.selectedPlan !== "free-special-needs"
                ? "سيتم تحويلك لصفحة الدفع الآمنة (Chargily Pay) لإتمام الطلب."
                : isAuthenticated
                ? "سنراجع طلبك ونتواصل معك خلال 24 ساعة. يمكنك تتبع الطلب من صفحة طلباتك."
                : "سجّل الدخول لتمكين إرسال الطلب وتتبّع طلباتك."}
            </p>
          </div>
        </form>

        {/* What happens next */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#09142b] mb-4 flex items-center gap-2">
            <FiCheckCircle className="h-5 w-5 text-[#c8a45e]" />
            ماذا يحدث بعد الإرسال؟
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { step: 1, title: "مراجعة الطلب", text: "نراجع طلبك ونحدد المتطلبات" },
              { step: 2, title: "التواصل معك", text: "نتواصل خلال 24 ساعة لمناقشة التفاصيل" },
              { step: 3, title: "بدء الخدمة", text: "بعد الموافقة نبدأ تنفيذ الخدمة" },
            ].map(({ step, title, text }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#09142b] text-sm font-bold text-[#c8a45e]">
                  {step}
                </div>
                <h4 className="font-semibold text-[#09142b]">{title}</h4>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RequestService;
