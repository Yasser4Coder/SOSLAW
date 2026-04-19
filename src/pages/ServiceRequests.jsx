import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "../components/SEOHead";
import useServiceRequests from "../hooks/useServiceRequests";
import useNotifications from "../hooks/useNotifications";
import consultantService from "../services/consultantService";
import API_BASE_URL from "../config/api.js";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiMessageCircle,
  FiEye,
  FiAlertCircle,
  FiCreditCard,
  FiLoader,
  FiCalendar,
} from "react-icons/fi";

// Order status: one source of truth for labels and styling
const ORDER_STATUS_CONFIG = {
  pending: {
    ar: "في الانتظار",
    en: "Pending",
    fr: "En attente",
    color: "bg-amber-50 text-amber-800 border-amber-200",
    icon: FiClock,
  },
  pending_payment: {
    ar: "في انتظار الدفع",
    en: "Pending Payment",
    fr: "En attente de paiement",
    color: "bg-orange-50 text-orange-800 border-orange-200",
    icon: FiDollarSign,
  },
  approved: {
    ar: "مقبول",
    en: "Approved",
    fr: "Approuvé",
    color: "bg-green-50 text-green-800 border-green-200",
    icon: FiCheckCircle,
  },
  in_progress: {
    ar: "قيد التنفيذ",
    en: "In Progress",
    fr: "En cours",
    color: "bg-blue-50 text-blue-800 border-blue-200",
    icon: FiLoader,
  },
  completed: {
    ar: "مكتمل",
    en: "Completed",
    fr: "Terminé",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: FiCheckCircle,
  },
  rejected: {
    ar: "مرفوض",
    en: "Rejected",
    fr: "Rejeté",
    color: "bg-red-50 text-red-800 border-red-200",
    icon: FiXCircle,
  },
};

const PAYMENT_STATUS_CONFIG = {
  pending: { ar: "في الانتظار", en: "Pending", fr: "En attente", color: "bg-amber-50 text-amber-800 border-amber-200" },
  processing: { ar: "قيد المعالجة", en: "Processing", fr: "En cours", color: "bg-blue-50 text-blue-800 border-blue-200" },
  completed: { ar: "مُدفوع", en: "Paid", fr: "Payé", color: "bg-green-50 text-green-800 border-green-200" },
  failed: { ar: "فشل", en: "Failed", fr: "Échoué", color: "bg-red-50 text-red-800 border-red-200" },
  cancelled: { ar: "ملغي", en: "Cancelled", fr: "Annulé", color: "bg-slate-100 text-slate-600 border-slate-200" },
  refunded: { ar: "مسترد", en: "Refunded", fr: "Remboursé", color: "bg-purple-50 text-purple-800 border-purple-200" },
};

const ServiceRequests = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Get service requests from API
  const { serviceRequests, loading, error } = useServiceRequests();

  // Get notifications hook for updating count
  const { refetchCounts, refetch } = useNotifications();

  // Fetch consultants for mapping consultant names
  const { data: consultantsData } = useQuery({
    queryKey: ["public-consultants-for-assignment"],
    queryFn: async () => {
      try {
        const result =
          await consultantService.getPublicConsultantsForAssignment();
        return result;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const consultants = consultantsData?.data || [];
  const lang = i18n.language === "ar" ? "ar" : i18n.language === "fr" ? "fr" : "en";

  const getOrderStatusLabel = (rawStatus) => {
    const c = ORDER_STATUS_CONFIG[rawStatus] || ORDER_STATUS_CONFIG.pending;
    return c[lang];
  };
  const getPaymentStatusLabel = (rawPaymentStatus) => {
    const c = PAYMENT_STATUS_CONFIG[rawPaymentStatus] || PAYMENT_STATUS_CONFIG.pending;
    return c[lang];
  };
  const getPriorityText = (priority, l) => {
    const priorityMap = {
      urgent: { ar: "عاجل", en: "Urgent", fr: "Urgent" },
      high: { ar: "عالية", en: "High", fr: "Élevée" },
      normal: { ar: "عادية", en: "Normal", fr: "Normale" },
      low: { ar: "منخفضة", en: "Low", fr: "Faible" },
    };
    return priorityMap[priority]?.[l] || priorityMap.normal[l];
  };

  // Handle view details click - mark as viewed in backend
  const handleViewDetails = async (mappedRequest) => {
    setSelectedRequest(mappedRequest);

    try {
      // Mark service request as viewed in backend
      const response = await fetch(
        `${API_BASE_URL}/api/v1/service-requests/my-requests/${mappedRequest.id}/viewed`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("jwt=")[1]?.split(";")[0]
            }`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Service request marked as viewed");
        // Force refresh of notification counts by dispatching a custom event
        window.dispatchEvent(new CustomEvent("refreshNotifications"));

        // Also try the direct refetch
        try {
          await refetchCounts();
          console.log("Notification counts refreshed successfully");
        } catch (error) {
          console.error("Error refreshing notification counts:", error);
        }
      } else {
        console.error(
          "Failed to mark service request as viewed:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error marking service request as viewed:", error);
    }
  };

  // Map API data to display format (raw status keys for styling)
  const mapServiceRequestData = (request) => {
    const service = request.service || {};
    const rawStatus = request.status || "pending";
    const rawPaymentStatus = request.paymentStatus || "pending";

    return {
      id: request.id,
      receiptToken: request.receiptToken || null,
      rawStatus,
      rawPaymentStatus,
      serviceName: service.titleAr || "خدمة قانونية",
      serviceNameEn: service.titleEn || "Legal Service",
      serviceNameFr: service.titleFr || "Service juridique",
      status: getOrderStatusLabel(rawStatus),
      statusAr: ORDER_STATUS_CONFIG[rawStatus]?.ar ?? ORDER_STATUS_CONFIG.pending.ar,
      statusEn: ORDER_STATUS_CONFIG[rawStatus]?.en ?? ORDER_STATUS_CONFIG.pending.en,
      statusFr: ORDER_STATUS_CONFIG[rawStatus]?.fr ?? ORDER_STATUS_CONFIG.pending.fr,
      createdAt: (request.createdAt || request.created_at)
        ? new Date(request.createdAt || request.created_at).toLocaleDateString("ar-DZ", { year: "numeric", month: "short", day: "numeric" })
        : "—",
      description: request.serviceDescription || "طلب خدمة قانونية",
      descriptionEn: "Legal service request",
      descriptionFr: "Demande de service juridique",
      rawPriority: request.urgency || "normal",
      priority: getPriorityText(request.urgency || "normal", "ar"),
      priorityAr: getPriorityText(request.urgency || "normal", "ar"),
      priorityEn: getPriorityText(request.urgency || "normal", "en"),
      priorityFr: getPriorityText(request.urgency || "normal", "fr"),
      consultant: (() => {
        const consultant = consultants.find((c) => c.id === request.assignedTo);
        return consultant?.name || request.assignedConsultant?.fullName || null;
      })(),
      consultantEn: null,
      consultantFr: null,
      replies: request.replies || [],
      paymentRequired: !!request.paymentRequired,
      paymentAmount: request.paymentAmount != null ? Number(request.paymentAmount) : 0,
      paymentCurrency: request.paymentCurrency || "د.ج",
      paymentStatus: getPaymentStatusLabel(rawPaymentStatus),
      paymentStatusAr: PAYMENT_STATUS_CONFIG[rawPaymentStatus]?.ar ?? PAYMENT_STATUS_CONFIG.pending.ar,
      paymentStatusEn: PAYMENT_STATUS_CONFIG[rawPaymentStatus]?.en ?? PAYMENT_STATUS_CONFIG.pending.en,
      paymentStatusFr: PAYMENT_STATUS_CONFIG[rawPaymentStatus]?.fr ?? PAYMENT_STATUS_CONFIG.pending.fr,
      paymentId: request.paymentId || `PAY-${request.id}`,
      paymentMethod: request.paymentMethod || "chargily",
    };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLocalizedText = (request, field) => {
    const lang = i18n.language;
    if (lang === "ar") return request[field];
    if (lang === "fr") return request[`${field}Fr`];
    return request[`${field}En`];
  };

  const title = t("serviceRequestsTitle", "طلبات الخدمات");
  const desc = t(
    "serviceRequestsDesc",
    "تتبع طلبات الخدمات القانونية الخاصة بك"
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title={title}
        description={desc}
        keywords="طلبات الخدمات, الخدمات القانونية, تتبع الطلبات"
      />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#09142b] mb-2" dir={isRTL ? "rtl" : "ltr"}>
            {title}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base" dir={isRTL ? "rtl" : "ltr"}>
            {desc}
          </p>
        </div>

        {/* Service Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-[#09142b] mx-auto mb-4" />
              <p className="text-slate-600 text-sm">{t("loading")}</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 text-center">
              <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-red-700 mb-1">{t("error")}</h3>
              <p className="text-slate-600 text-sm">{error}</p>
            </div>
          ) : serviceRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
              <FiMessageCircle className="w-14 h-14 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#09142b] mb-1">{t("noServiceRequests")}</h3>
              <p className="text-slate-600 text-sm">{t("noServiceRequestsDesc")}</p>
            </div>
          ) : (
            serviceRequests.map((request) => {
              const mappedRequest = mapServiceRequestData(request);
              const orderStatus = ORDER_STATUS_CONFIG[mappedRequest.rawStatus] || ORDER_STATUS_CONFIG.pending;
              const OrderIcon = orderStatus.icon;
              const payStatusConfig = mappedRequest.paymentRequired
                ? (PAYMENT_STATUS_CONFIG[mappedRequest.rawPaymentStatus] || PAYMENT_STATUS_CONFIG.pending)
                : null;
              const isPaid = mappedRequest.rawPaymentStatus === "completed";

              return (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {/* Card header: ref + service name */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-500 text-sm font-medium mb-0.5">
                          {mappedRequest.receiptToken
                            ? `طلب · مرجع …${mappedRequest.receiptToken.slice(-6)}`
                            : "طلب"}
                        </p>
                        <h3 className="text-lg font-bold text-[#09142b] truncate">
                          {getLocalizedText(mappedRequest, "serviceName")}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Status row: one pill for order status, one for payment if applicable */}
                  <div className="px-5 pb-4 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${orderStatus.color}`}>
                      <OrderIcon className="w-4 h-4 shrink-0" />
                      {getLocalizedText(mappedRequest, "status")}
                    </span>
                    {mappedRequest.paymentRequired && payStatusConfig && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${payStatusConfig.color}`}>
                        <FiCreditCard className="w-4 h-4 shrink-0" />
                        {getLocalizedText(mappedRequest, "paymentStatus")}
                      </span>
                    )}
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${getPriorityColor(mappedRequest.rawPriority)}`}>
                      {getLocalizedText(mappedRequest, "priority")}
                    </span>
                  </div>

                  {/* Meta: date, consultant */}
                  <div className="px-5 pb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <FiCalendar className="w-4 h-4 text-slate-400" />
                      {mappedRequest.createdAt}
                    </span>
                    {mappedRequest.consultant && (
                      <span>{t("consultant", "المستشار")}: {mappedRequest.consultant}</span>
                    )}
                  </div>

                  {/* Payment summary (if applicable) */}
                  {mappedRequest.paymentRequired && (
                    <div className="px-5 py-4 bg-slate-50/80 border-t border-slate-100">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">{t("amount", "المبلغ")}</p>
                          <p className="text-lg font-bold text-[#09142b]">
                            {mappedRequest.paymentAmount.toLocaleString("ar-DZ")} {mappedRequest.paymentCurrency}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {!isPaid && (
                            <button
                              type="button"
                              onClick={() => window.open(`/payment-details/${encodeURIComponent(mappedRequest.receiptToken || mappedRequest.id)}`, "_blank")}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 transition-colors"
                            >
                              <FiCreditCard className="w-4 h-4" />
                              {t("payNow", "ادفع الآن")}
                            </button>
                          )}
                          {isPaid && (
                            <button
                              type="button"
                              onClick={() => window.open(`/payment-details/${encodeURIComponent(mappedRequest.receiptToken || mappedRequest.id)}`, "_blank")}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-300 transition-colors"
                            >
                              <FiCreditCard className="w-4 h-4" />
                              {t("viewPayment", "عرض الدفع")}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleViewDetails(mappedRequest)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#09142b] text-white font-medium text-sm hover:bg-[#0b1a36] transition-colors"
                          >
                            <FiEye className="w-4 h-4" />
                            {t("viewDetails", "عرض التفاصيل")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions when no payment */}
                  {!mappedRequest.paymentRequired && (
                    <div className="px-5 py-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(mappedRequest)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#09142b] text-white font-medium text-sm hover:bg-[#0b1a36] transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                        {t("viewDetails", "عرض التفاصيل")}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onPay={() =>
            window.open(`/payment-details/${encodeURIComponent(selectedRequest.receiptToken || selectedRequest.id)}`, "_blank")
          }
        />
      )}
    </div>
  );
};

// Request Details Modal Component
const RequestDetailsModal = ({ request, onClose, onPay }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const orderStatus = ORDER_STATUS_CONFIG[request.rawStatus] || ORDER_STATUS_CONFIG.pending;
  const OrderIcon = orderStatus.icon;
  const payStatusConfig = request.paymentRequired
    ? (PAYMENT_STATUS_CONFIG[request.rawPaymentStatus] || PAYMENT_STATUS_CONFIG.pending)
    : null;
  const isPaid = request.rawPaymentStatus === "completed";

  const getLocalizedText = (req, field) => {
    const l = i18n.language;
    if (l === "ar") return req[field];
    if (l === "fr") return req[`${field}Fr`];
    return req[`${field}En`];
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-[#09142b]" dir={isRTL ? "rtl" : "ltr"}>
            {t("requestDetails", "تفاصيل الطلب")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="إغلاق"
          >
            <FiXCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Request Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              {t("requestInfo", "معلومات الطلب")}
            </h3>
            <div className="space-y-3">
              <p className="font-bold text-lg text-[#09142b]">
                {getLocalizedText(request, "serviceName")}
              </p>
              <p className="text-sm text-slate-600" dir={isRTL ? "rtl" : "ltr"}>
                {getLocalizedText(request, "description")}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${orderStatus.color}`}>
                  <OrderIcon className="w-4 h-4" />
                  {getLocalizedText(request, "status")}
                </span>
                {request.paymentRequired && payStatusConfig && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${payStatusConfig.color}`}>
                    <FiCreditCard className="w-4 h-4" />
                    {getLocalizedText(request, "paymentStatus")}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <FiCalendar className="w-4 h-4 text-slate-400" />
                  {request.createdAt}
                </span>
                {request.consultant && (
                  <span>{t("consultant", "المستشار")}: {request.consultant}</span>
                )}
              </div>
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-4">
            <h3
              className="text-lg font-semibold text-[#09142b] flex items-center gap-2"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <FiMessageCircle className="w-5 h-5" />
              {t("replies", "الردود")}
              {request.replies && request.replies.length > 0 && (
                <span className="bg-[#c8a45e] text-white text-xs px-2 py-1 rounded-full">
                  {request.replies.length}
                </span>
              )}
            </h3>

            {request.replies && request.replies.length > 0 ? (
              <div className="space-y-4">
                {request.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-blue-50 border border-blue-100 p-4 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#c8a45e] rounded-full flex items-center justify-center text-white font-semibold">
                        {reply.user?.fullName?.charAt(0) || "ع"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-[#09142b]">
                            {reply.user?.fullName || "فريق الدعم"}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              reply.replyType === "admin"
                                ? "bg-red-100 text-red-800"
                                : reply.replyType === "consultant"
                                ? "bg-[#c8a45e] text-white"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {reply.replyType === "admin"
                              ? "إدارة"
                              : reply.replyType === "consultant"
                              ? "مستشار"
                              : "دعم"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {reply.created_at
                              ? new Date(reply.created_at).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )
                              : "غير محدد"}
                          </span>
                        </div>
                        <p
                          className="text-[#09142b]"
                          dir={isRTL ? "rtl" : "ltr"}
                        >
                          {reply.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiMessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {t("noReplies", "لا توجد ردود بعد")}
                </p>
                <p className="text-sm text-gray-400">
                  {t("noRepliesDesc", "سيتم إضافة الردود من قبل فريقنا")}
                </p>
              </div>
            )}
          </div>

          {/* Payment Info */}
          {request.paymentRequired && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                {t("paymentInfo", "معلومات الدفع")}
              </h3>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">{t("amount", "المبلغ")}</p>
                    <p className="text-xl font-bold text-[#09142b]">
                      {request.paymentAmount != null ? request.paymentAmount.toLocaleString("ar-DZ") : "—"} {request.paymentCurrency}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {t("paymentStatus", "حالة الدفع")}: {getLocalizedText(request, "paymentStatus")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!isPaid && (
                      <button
                        type="button"
                        onClick={onPay}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 transition-colors"
                      >
                        {t("payNow", "ادفع الآن")}
                      </button>
                    )}
                    {isPaid && (
                      <button
                        type="button"
                        onClick={onPay}
                        className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-300 transition-colors"
                      >
                        {t("viewPayment", "عرض الدفع")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
          >
            {t("close", "إغلاق")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequests;
