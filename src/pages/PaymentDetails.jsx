import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import usePaymentDetails from "../hooks/usePaymentDetails";
import SEOHead from "../components/SEOHead";
import {
  FiPrinter,
  FiArrowLeft,
  FiCheckCircle,
  FiPhone,
  FiMail,
  FiMapPin,
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
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isRTL = i18n.language === "ar";

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

  // Get payment details from API
  const { paymentDetails, loading, error } = usePaymentDetails(
    requestId,
    "serviceRequest"
  );

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
      ccp: { 
        ar: "CCP/Baridimob - أفراد", 
        en: "CCP/Baridimob - Individuals", 
        fr: "CCP/Baridimob - Particuliers" 
      },
      baridimob: { 
        ar: "Baridimob", 
        en: "Baridimob", 
        fr: "Baridimob" 
      },
      bank_transfer: { 
        ar: "تحويل بنكي", 
        en: "Bank Transfer", 
        fr: "Virement bancaire" 
      },
      cash: { 
        ar: "نقداً", 
        en: "Cash", 
        fr: "Espèces" 
      },
    };
    return methodMap[method]?.[lang] || methodMap.ccp[lang];
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
            onClick={() => navigate(-1)}
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
            onClick={() => navigate(-1)}
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
            onClick={() => navigate(-1)}
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
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(displayData.status)}`}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {displayData.statusAr || getStatusText(displayData.status, "ar")}
              </span>
            </div>
            <p className="text-xs text-gray-500" dir={isRTL ? "rtl" : "ltr"}>
              {t("paymentId", "رقم الطلبية")}: {displayData.paymentId || displayData.id}
            </p>
          </div>
          <div className="text-right">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-1">
              <img 
                src="/logo.svg" 
                alt="SOS Law Logo" 
                className="w-8 h-8"
              />
            </div>
            <p className="text-xs text-gray-500">SOS Law</p>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3
                className="text-sm font-semibold text-[#09142b] mb-2"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("orderCreatedFor", "أنشأت هذه الطلبية لـ")}
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-[#09142b] font-medium">
                  {displayData.clientInfo.name}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <h4
                  className="text-sm font-semibold text-[#09142b] mb-1"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("orderDate", "تاريخ الطلبية")}
                </h4>
                <p className="text-sm text-[#09142b]">
                  {displayData.createdAt}
                </p>
              </div>
              <div>
                <h4
                  className="text-sm font-semibold text-[#09142b] mb-1"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("paymentMethod", "طريقة الدفع")}
                </h4>
                <p className="text-sm text-[#09142b]">
                  {getLocalizedText(displayData, "paymentMethod")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="mb-4">
          <h3
            className="text-sm font-semibold text-[#09142b] mb-2"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {t("orderItems", "عناصر الطلبية")}
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-2 py-2 text-left text-xs font-semibold text-[#09142b]"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {t("details", "تفاصيل")}
                  </th>
                  <th
                    className="px-2 py-2 text-right text-xs font-semibold text-[#09142b]"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {t("amount", "المبلغ")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayData.items.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td
                      className="px-2 py-2 text-[#09142b]"
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {getLocalizedText(item, "details")}
                    </td>
                    <td className="px-2 py-2 text-right text-[#09142b] font-medium">
                      {item.amount > 0
                        ? `${item.amount.toLocaleString()} ${
                            displayData.currency
                          }`
                        : `0.00 ${displayData.currency}`}
                    </td>
                  </tr>
                ))}
                {/* Summary Rows */}
                <tr className="border-t-2 border-gray-300 bg-gray-50">
                  <td
                    className="px-2 py-2 font-semibold text-[#09142b]"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {t("total", "المجموع")}
                  </td>
                  <td className="px-2 py-2 text-right font-semibold text-[#09142b]">
                    {displayData.total.toLocaleString()} {displayData.currency}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td
                    className="px-2 py-2 text-[#09142b]"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {t("deductedBalance", "رصيد مستقطع")}
                  </td>
                  <td className="px-2 py-2 text-right text-[#09142b]">
                    0.00 {displayData.currency}
                  </td>
                </tr>
                <tr className="border-t-2 border-gray-400 bg-gray-100">
                  <td
                    className="px-2 py-2 font-bold text-sm text-[#09142b]"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {t("grandTotal", "الإجمالي")}
                  </td>
                  <td className="px-2 py-2 text-right font-bold text-sm text-[#09142b]">
                    {displayData.currency} {displayData.total.toLocaleString()}
                    .00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Steps */}
        <div className="bg-[#f8f9fa] p-4 rounded-lg mb-4 print:block">
          <h3
            className="text-sm font-semibold text-[#09142b] mb-3"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {t("paymentSteps", "خطوات الدفع")}
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="bg-[#c8a45e] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0">
                1
              </span>
              <div>
                <h5
                  className="text-sm font-semibold text-[#09142b] mb-1"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("step1Title", "الخطوة 1")}
                </h5>
                <p
                  className="text-sm text-[#09142b]"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t(
                    "step1Payment",
                    "قم بإرسال المبلغ المطلوب عبر إحدى وسائل الدفع المتاحة لدينا."
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-[#c8a45e] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0">
                2
              </span>
              <div>
                <h5
                  className="text-sm font-semibold text-[#09142b] mb-1"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("step2Title", "الخطوة 2")}
                </h5>
                <p
                  className="text-sm text-[#09142b]"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t(
                    "step2Payment",
                    "أرسل وصل الدفع مرفقًا بالاسم واللقب ورقم الطلبية او قم بطباعة الوصل و ارسالة إلى بريدنا الإلكتروني الرسمي."
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-[#c8a45e] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold flex-shrink-0">
                3
              </span>
              <div>
                <h5
                  className="text-sm font-semibold text-[#09142b] mb-1"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t("step3Title", "الخطوة 3")}
                </h5>
                <p
                  className="text-sm text-[#09142b]"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t(
                    "step3Payment",
                    "انتظر تأكيدنا بعد التحقق من عملية الدفع ومعالجة طلبك."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Payment Info - Only visible on mobile */}
        <div className="bg-[#f8f9fa] p-4 rounded-lg mb-4 print:hidden md:hidden">
          <h4
            className="text-sm font-semibold text-[#09142b] mb-3"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {t("paymentInfo", "معلومات الدفع")}
          </h4>

          {/* Email */}
          <div className="mb-3">
            <p
              className="text-xs text-gray-600 mb-1"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("sendReceiptTo", "إرسال الوصل إلى")}:
            </p>
            <p className="text-sm font-semibold text-[#09142b] break-all">
              payment@soslawdz.com
            </p>
          </div>

          {/* CCP Account */}
          <div className="mb-3">
            <p
              className="text-xs text-gray-600 mb-1"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("ccpAccount", "حساب CCP")}:
            </p>
            <p className="text-sm font-mono font-bold text-[#09142b]">
              1234567890123456789
            </p>
          </div>

          {/* Baridimob Account */}
          <div>
            <p
              className="text-xs text-gray-600 mb-1"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("baridimobAccount", "حساب Baridimob")}:
            </p>
            <p className="text-sm font-mono font-bold text-[#09142b]">
              007 12345 6789012345678 89
            </p>
          </div>
        </div>

        {/* Print Button - Only visible when printing */}
        <div className="print:block hidden text-center">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#09142b] text-white rounded-lg hover:bg-[#09142b]/80 transition-colors cursor-pointer"
          >
            <FiPrinter className="w-5 h-5" />
            <span>{t("print", "طباعة")}</span>
          </button>
        </div>
      </div>

      {/* Floating Payment Info - Hidden when printing */}
      <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm print:hidden z-50 hidden md:block">
        <h4
          className="text-sm font-semibold text-[#09142b] mb-3"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {t("paymentInfo", "معلومات الدفع")}
        </h4>

        {/* Email */}
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1" dir={isRTL ? "rtl" : "ltr"}>
            {t("sendReceiptTo", "إرسال الوصل إلى")}:
          </p>
          <p className="text-sm font-semibold text-[#09142b] break-all">
            payment@soslawdz.com
          </p>
        </div>

        {/* CCP Account */}
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1" dir={isRTL ? "rtl" : "ltr"}>
            {t("ccpAccount", "حساب CCP")}:
          </p>
          <p className="text-sm font-mono flex items-center justify-end flex-row-reverse gap-1 font-bold text-[#09142b]">
          <span>0041584624</span> clé <span>71</span>
          </p>  
        </div>

        {/* Baridimob Account */}
        <div>
          <p className="text-xs text-gray-600 mb-1" dir={isRTL ? "rtl" : "ltr"}>
            {t("baridimobAccount", "حساب Baridimob")}:
          </p>
          <p className="text-sm font-mono flex items-center justify-end flex-row-reverse gap-1 font-bold text-[#09142b]">
            00799999004158462471
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
