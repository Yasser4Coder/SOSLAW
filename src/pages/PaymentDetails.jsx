import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import usePaymentDetails from "../hooks/usePaymentDetails";
import SEOHead from "../components/SEOHead";
import {
  FiPrinter,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";
import "./PaymentDetails.css";

// Mock data for service request
const mockServiceRequest = {
  id: "SR-2025-001", // Payment ID for specific service request of specific client
  serviceName: "استشارة قانونية - قانون تجاري",
  serviceNameEn: "Legal Consultation - Commercial Law",
  serviceNameFr: "Consultation juridique - Droit commercial",
  status: "paid", // Payment status of the service request
  statusAr: "مسددة",
  statusEn: "Paid",
  statusFr: "Payée",
  createdAt: "2025-01-07",
  description: "طلب استشارة حول تأسيس شركة جديدة",
  descriptionEn: "Request for consultation on establishing a new company",
  descriptionFr:
    "Demande de consultation sur la création d'une nouvelle société",
  amount: 15000,
  currency: "DA",
  paymentMethod: "CCP/Baridimob - Particuliers",
  paymentMethodAr: "CCP/Baridimob - أفراد",
  paymentMethodEn: "CCP/Baridimob - Individuals",
  paymentMethodFr: "CCP/Baridimob - Particuliers",
  clientInfo: {
    name: "Sos law",
  },
  items: [
    {
      id: 1,
      details: "استشارة قانونية - قانون تجاري",
      detailsAr: "استشارة قانونية - قانون تجاري",
      detailsEn: "Legal Consultation - Commercial Law",
      detailsFr: "Consultation juridique - Droit commercial",
      amount: 15000,
    },
    {
      id: 2,
      details: "خدمات إضافية",
      detailsAr: "خدمات إضافية",
      detailsEn: "Additional Services",
      detailsFr: "Services Supplémentaires",
      amount: 0,
    },
  ],
  paymentHistory: [
    {
      depositDate: "2025-01-07",
      paymentMethod: "CCP/Baridimob - Particuliers",
      paymentMethodAr: "CCP/Baridimob - أفراد",
      paymentMethodEn: "CCP/Baridimob - Individuals",
      paymentMethodFr: "CCP/Baridimob - Particuliers",
      transactionNumber: "",
      depositAmount: 15000, // This should be the actual service price from the request
    },
  ],
};

const PaymentDetails = () => {
  const { t, i18n } = useTranslation();
  const { requestId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isRTL = i18n.language === "ar";
  const urlStatus = searchParams?.get("status"); // success | failed from Chargily redirect

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {t("authenticationRequired", "مطلوب تسجيل الدخول")}
          </h2>
          <p className="text-gray-600 mb-4">
            {t("authenticationRequiredDesc", "يجب تسجيل الدخول لعرض تفاصيل الدفع")}
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-2 bg-[#c8a45e] text-white rounded-lg hover:bg-[#b8944f] transition-colors"
          >
            {t("login", "تسجيل الدخول")}
          </button>
        </div>
      </div>
    );
  }

  // Use receipt token (unguessable) when param is not numeric; else fallback to legacy numeric id
  const fetchType = requestId && /^\d+$/.test(requestId) ? "serviceRequest" : "reference";
  const { paymentDetails, loading, error, refetch } = usePaymentDetails(
    requestId,
    fetchType
  );

  // Refetch when returning from Chargily success so status can update
  React.useEffect(() => {
    if (urlStatus === "success" && requestId) refetch();
  }, [urlStatus, requestId, refetch]);

  // Helper function to map API data to display format
  const mapPaymentData = (data) => {
    if (!data) return mockServiceRequest; // Fallback to mock data

    // Check if data already has payment fields at top level (new API structure)
    // or if payment is nested under data.payment (old structure)
    const hasPaymentAtTopLevel = data.paymentId && data.serviceRequest;
    const payment = hasPaymentAtTopLevel ? data : (data.payment || {});
    const serviceRequest = data.serviceRequest || data;
    const client = data.client || serviceRequest.client || {};

    console.log('🔍 mapPaymentData received data:', data);
    console.log('🔍 payment object:', payment);
    console.log('🔍 payment.paymentId:', payment.paymentId);

    return {
      id: payment.paymentId || `PAY-${serviceRequest.id}`,
      paymentId: payment.paymentId || `PAY-${serviceRequest.id}`,
      serviceName:
        serviceRequest.service?.titleAr ||
        serviceRequest.serviceDescription ||
        "خدمة قانونية",
      serviceNameEn: serviceRequest.service?.titleEn || "Legal Service",
      serviceNameFr: serviceRequest.service?.titleFr || "Service juridique",
      status: payment.paymentStatus || "pending",
      statusAr: getStatusText(payment.paymentStatus || "pending", "ar"),
      statusEn: getStatusText(payment.paymentStatus || "pending", "en"),
      statusFr: getStatusText(payment.paymentStatus || "pending", "fr"),
      createdAt: new Date(serviceRequest.createdAt || serviceRequest.created_at).toLocaleDateString(),
      description: serviceRequest.serviceDescription || "طلب خدمة قانونية",
      descriptionEn: "Legal service request",
      descriptionFr: "Demande de service juridique",
      amount: payment.amount || serviceRequest.paymentAmount || 15000,
      currency: payment.currency || serviceRequest.paymentCurrency || "DA",
      paymentMethod: payment.paymentMethod || "ccp",
      paymentMethodAr: getPaymentMethodText(payment.paymentMethod || "ccp", "ar"),
      paymentMethodEn: getPaymentMethodText(payment.paymentMethod || "ccp", "en"),
      paymentMethodFr: getPaymentMethodText(payment.paymentMethod || "ccp", "fr"),
      paymentReference: payment.paymentReference || "",
      transactionId: payment.transactionId || "",
      chargilyCheckoutUrl: payment.chargilyCheckoutUrl || null,
      dueDate: payment.dueDate || serviceRequest.paymentDueDate || "",
      paidAt: payment.paidAt || "",
      clientInfo: {
        name: client.fullName || payment.clientName || user?.fullName || "Client",
        email: client.email || payment.clientEmail || user?.email || "client@example.com",
        phone: client.phoneNumber || payment.clientPhone || user?.phoneNumber || "+213 123456789",
      },
      items: [
        {
          id: 1,
          details: serviceRequest.serviceDescription || "استشارة قانونية - قانون تجاري",
          detailsAr: serviceRequest.serviceDescription || "استشارة قانونية - قانون تجاري",
          detailsEn: "Legal Consultation - Commercial Law",
          detailsFr: "Consultation juridique - Droit commercial",
          amount: payment.amount || serviceRequest.paymentAmount || 15000,
        },
      ],
      total: payment.amount || serviceRequest.paymentAmount || 15000,
      paymentHistory: [
        {
          depositDate: payment.paidAt || payment.createdAt || new Date().toISOString().split('T')[0],
          paymentMethod: getPaymentMethodText(payment.paymentMethod || "ccp", i18n.language),
          paymentMethodAr: getPaymentMethodText(payment.paymentMethod || "ccp", "ar"),
          paymentMethodEn: getPaymentMethodText(payment.paymentMethod || "ccp", "en"),
          paymentMethodFr: getPaymentMethodText(payment.paymentMethod || "ccp", "fr"),
          transactionNumber: payment.transactionId || payment.paymentReference || "",
          depositAmount: payment.amount || serviceRequest.paymentAmount || 15000,
        },
      ],
    };
  };

  const getStatusText = (status, lang) => {
    const statusMap = {
      pending: { ar: "في الانتظار", en: "Pending", fr: "En attente" },
      processing: {
        ar: "قيد المعالجة",
        en: "Processing",
        fr: "En cours de traitement",
      },
      completed: { ar: "مكتمل", en: "Completed", fr: "Terminé" },
      failed: { ar: "فشل", en: "Failed", fr: "Échoué" },
      cancelled: { ar: "ملغي", en: "Cancelled", fr: "Annulé" },
      refunded: { ar: "مسترد", en: "Refunded", fr: "Remboursé" },
    };
    return statusMap[status]?.[lang] || statusMap.pending[lang];
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: "text-amber-600 bg-amber-50 border-amber-200",
      processing: "text-blue-600 bg-blue-50 border-blue-200",
      completed: "text-green-600 bg-green-50 border-green-200",
      failed: "text-red-600 bg-red-50 border-red-200",
      cancelled: "text-gray-600 bg-gray-50 border-gray-200",
      refunded: "text-purple-600 bg-purple-50 border-purple-200",
    };
    return colorMap[status] || colorMap.pending;
  };

  const getPaymentMethodText = (method, lang) => {
    const methodMap = {
      chargily: { ar: "EDAHABIA - CIB", en: "EDAHABIA - CIB", fr: "EDAHABIA - CIB" },
      ccp: { ar: "CCP/Baridimob - أفراد", en: "CCP/Baridimob - Individuals", fr: "CCP/Baridimob - Particuliers" },
      baridimob: { ar: "Baridimob", en: "Baridimob", fr: "Baridimob" },
      bank_transfer: { ar: "تحويل بنكي", en: "Bank Transfer", fr: "Virement bancaire" },
      cash: { ar: "نقداً", en: "Cash", fr: "Espèces" },
    };
    return methodMap[method]?.[lang] ?? methodMap.ccp[lang];
  };

  const getLocalizedText = (item, field) => {
    const lang = i18n.language;
    if (lang === "ar") return item[field];
    if (lang === "fr") return item[`${field}Fr`];
    return item[`${field}En`];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      i18n.language === "ar"
        ? "ar-DZ"
        : i18n.language === "fr"
        ? "fr-FR"
        : "en-US"
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // Map the data for display
  const displayData = mapPaymentData(paymentDetails);

  // Check if we need to show a "no payment required" message
  if (paymentDetails && paymentDetails.needsPayment && !paymentDetails.payment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-yellow-500 text-6xl mb-4">💳</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {t("noPaymentRequired", "لا يتطلب دفع")}
          </h2>
          <p className="text-gray-600 mb-4">
            {t("noPaymentRequiredDesc", "هذا الطلب لا يتطلب دفع أو لم يتم إنشاء سجل دفع بعد")}
          </p>
          <button
            onClick={() => navigate("/service-requests")}
            className="px-4 py-2 bg-[#c8a45e] text-white rounded-lg hover:bg-[#b8944f] transition-colors"
          >
            {t("back", "العودة")}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8a45e] mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading", "جاري التحميل...")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Check if it's an unauthorized access error
    if (error.includes("not found") || error.includes("access denied") || error.includes("404")) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              {t("accessDenied", "غير مصرح بالوصول")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("accessDeniedDesc", "لا يمكنك الوصول إلى تفاصيل الدفع هذه. قد تكون غير مخصصة لك أو غير موجودة.")}
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-[#c8a45e] text-white rounded-lg hover:bg-[#b8944f] transition-colors"
            >
              {t("goToDashboard", "الذهاب إلى لوحة التحكم")}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            {t("error", "خطأ")}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/service-requests")}
            className="px-4 py-2 bg-[#c8a45e] text-white rounded-lg hover:bg-[#b8944f] transition-colors"
          >
            {t("back", "العودة")}
          </button>
        </div>
      </div>
    );
  }

  const title = t("paymentDetails", "تفاصيل الدفع");
  const desc = t("paymentDetailsDesc", "تفاصيل الدفع لطلب الخدمة");

  return (
    <div className="min-h-screen bg-white print:bg-white print:min-h-0">
      <SEOHead
        title={title}
        description={desc}
        keywords="تفاصيل الدفع, إيصال الدفع, الخدمات القانونية"
        canonical={`/payment-details/${requestId}`}
      />

      {/* Header - Only visible on screen, hidden when printing */}
      <div className="bg-white border-b border-gray-200 p-4 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/service-requests")}
            className="flex items-center gap-2 text-[#09142b] hover:text-[#c8a45e] transition-colors cursor-pointer"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>{t("back", "العودة")}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#c8a45e] text-white rounded-lg hover:bg-[#c8a45e]/80 transition-colors cursor-pointer"
          >
            <FiPrinter className="w-4 h-4" />
            <span>{t("print", "طباعة")}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 print:p-3 print:max-w-none">
        {/* Chargily redirect status banner */}
        {urlStatus === "success" && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 flex items-center gap-3">
            <FiCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">{t("paymentSuccess", "تم الدفع بنجاح")}</p>
              <p className="text-sm text-green-700">{t("paymentSuccessDesc", "سنراجع الطلب ونعلمك عند التأكيد.")}</p>
            </div>
          </div>
        )}
        {urlStatus === "failed" && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
            <FiAlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-800">{t("paymentFailed", "لم يتم إتمام الدفع")}</p>
              <p className="text-sm text-amber-700">{t("paymentFailedDesc", "يمكنك المحاولة مرة أخرى بالضغط على زر الدفع أدناه.")}</p>
            </div>
          </div>
        )}

        {/* Receipt card – professional layout for screen and PDF */}
        <div className="receipt-card bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden print:shadow-none print:border print:rounded-lg">
          {/* Receipt header */}
          <div className="receipt-header bg-[#09142b] text-white px-6 py-5 print:py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center print:w-10 print:h-10">
                  <img src="/logo.svg" alt="SOS Law" className="w-8 h-8 print:w-6 print:h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight" dir="rtl">SOS LAW</h1>
                  <p className="text-white/80 text-sm" dir="rtl">إيصال طلب خدمة</p>
                </div>
              </div>
              <span className="px-4 py-2 rounded-lg text-sm font-semibold bg-white text-[#09142b] border border-white/30" dir="rtl">
                {displayData.statusAr || getStatusText(displayData.status, "ar")}
              </span>
            </div>
          </div>

          <div className="p-6 print:p-5 space-y-5">
            {/* رقم الطلبية + Service name */}
            <div className="receipt-section">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5" dir="rtl">{t("paymentId", "رقم الطلبية")}</p>
              <p className="text-sm font-mono font-semibold text-[#09142b] mb-3" dir="ltr">
                {displayData.paymentId || displayData.id || "—"}
              </p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1" dir="rtl">{t("serviceName", "الخدمة")}</p>
              <p className="text-lg font-bold text-[#09142b]" dir={isRTL ? "rtl" : "ltr"}>
                {getLocalizedText(displayData, "serviceName")}
              </p>
            </div>

            {/* Client & date & payment method */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 receipt-section border-t border-slate-100 pt-5">
              <div>
                <p className="text-xs text-slate-500 mb-0.5" dir="rtl">{t("orderCreatedFor", "العميل")}</p>
                <p className="font-semibold text-[#09142b]">{displayData.clientInfo.name}</p>
                {displayData.clientInfo.email && <p className="text-sm text-slate-600">{displayData.clientInfo.email}</p>}
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5" dir="rtl">{t("orderDate", "تاريخ الطلب")}</p>
                <p className="font-semibold text-[#09142b]">{displayData.createdAt}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5" dir="rtl">{t("paymentMethod", "طريقة الدفع")}</p>
                <p className="font-semibold text-[#09142b]">{getPaymentMethodText(displayData.paymentMethod, isRTL ? "ar" : i18n.language === "fr" ? "fr" : "en")}</p>
              </div>
            </div>

            {/* Amount table – receipt style */}
            <div className="receipt-section border-t border-slate-100 pt-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-right py-2 font-semibold text-[#09142b]" dir="rtl">{t("details", "البيان")}</th>
                    <th className="text-left py-2 font-semibold text-[#09142b]" dir="rtl">{t("amount", "المبلغ")}</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.items.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-3 text-[#09142b]" dir={isRTL ? "rtl" : "ltr"}>{getLocalizedText(displayData, "serviceName")}</td>
                      <td className="py-3 text-[#09142b] font-medium">{item.amount != null ? `${Number(item.amount).toLocaleString("ar-DZ")} ${displayData.currency}` : `—`}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold text-[#09142b]">
                    <td className="py-3" dir="rtl">{t("grandTotal", "الإجمالي")}</td>
                    <td className="py-3">{displayData.total != null ? `${Number(displayData.total).toLocaleString("ar-DZ")} ${displayData.currency}` : `—`}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Chargily Pay button – when pending */}
            {displayData.status === "pending" && displayData.chargilyCheckoutUrl && (
              <div className="receipt-section print:hidden bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-sm font-semibold text-[#09142b] mb-2" dir="rtl">{t("payNow", "ادفع الآن")}</p>
                <a
                  href={displayData.chargilyCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#09142b] text-white rounded-xl font-semibold text-sm hover:bg-[#0b1a36] transition-colors"
                >
                  <FiCreditCard className="w-4 h-4" />
                  {t("payWithChargily", "الدفع عبر EDAHABIA - CIB")}
                </a>
              </div>
            )}

            {/* ملاحظات هامة */}
            <div className="receipt-section border-t border-slate-200 pt-5 mt-5 bg-slate-50/80 rounded-xl p-4 print:bg-transparent">
              <h3 className="text-sm font-bold text-[#09142b] mb-3" dir="rtl">
                ملاحظات هامة
              </h3>
              <div className="space-y-2 text-sm text-slate-700 leading-relaxed" dir="rtl">
                <p>تم استلام المبلغ بنجاح وسيتم الشروع في تنفيذ الخدمة وفقًا للإجراءات المعتمدة.</p>
                <p>في حال وجود أي استفسار بخصوص هذه العملية أو مواجهة أي مشكلة تقنية، يرجى التواصل مع فريق الدعم.</p>
                <p>يحتفظ هذا الإيصال كمرجع رسمي لعملية الدفع.</p>
              </div>
            </div>

            {/* Receipt footer */}
            <div className="receipt-footer border-t border-slate-200 pt-4 text-center">
              <p className="text-xs text-slate-600 font-medium" dir="rtl">SOS LAW — الخدمات القانونية والاستشارات</p>
            </div>
          </div>
        </div>

        {/* Save as PDF hint – screen only */}
        <p className="mt-4 text-center text-sm text-slate-500 print:hidden" dir="rtl">
          يمكنك تحميل هذا الإيصال بصيغة PDF عبر الضغط على زر &quot;طباعة&quot; ثم اختيار &quot;حفظ كـ PDF&quot;.
        </p>
      </div>

    </div>
  );
};

export default PaymentDetails;
