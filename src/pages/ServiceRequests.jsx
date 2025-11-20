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
  FiDownload,
  FiAlertCircle,
  FiCreditCard,
  FiPhone,
} from "react-icons/fi";

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

  // Helper function to map API data to display format
  const mapServiceRequestData = (request) => {
    const service = request.service || {};
    const payment =
      request.payments && request.payments.length > 0
        ? request.payments[0]
        : null;

    return {
      id: request.id,
      serviceName:
        service.titleAr || request.serviceDescription || "خدمة قانونية",
      serviceNameEn: service.titleEn || "Legal Service",
      serviceNameFr: service.titleFr || "Service juridique",
      status: getStatusText(request.status, "ar"), // Default to Arabic
      statusAr: getStatusText(request.status, "ar"),
      statusEn: getStatusText(request.status, "en"),
      statusFr: getStatusText(request.status, "fr"),
      createdAt: (request.createdAt || request.created_at)
        ? new Date(request.createdAt || request.created_at).toLocaleDateString("en-US")
        : "غير محدد",
      description: request.serviceDescription || "طلب خدمة قانونية",
      descriptionEn: "Legal service request",
      descriptionFr: "Demande de service juridique",
      priority: getPriorityText(request.urgency || "normal", "ar"), // Default to Arabic
      priorityAr: getPriorityText(request.urgency || "normal", "ar"),
      priorityEn: getPriorityText(request.urgency || "normal", "en"),
      priorityFr: getPriorityText(request.urgency || "normal", "fr"),
      consultant: (() => {
        // Find consultant name from the consultants list using assignedTo
        const consultant = consultants.find((c) => c.id === request.assignedTo);

        return (
          consultant?.name ||
          request.assignedConsultant?.fullName ||
          "لم يتم تعيين مستشار بعد"
        );
      })(),
      consultantEn: "No consultant assigned yet",
      consultantFr: "Aucun consultant assigné",
      replies: request.replies || [],
      paymentRequired: request.paymentRequired || false,
      paymentAmount: request.paymentAmount || 0,
      paymentCurrency: request.paymentCurrency || "DA",
      paymentStatus: getPaymentStatusText(
        request.paymentStatus || "pending",
        "ar"
      ), // Default to Arabic
      paymentStatusAr: getPaymentStatusText(
        request.paymentStatus || "pending",
        "ar"
      ),
      paymentStatusEn: getPaymentStatusText(
        request.paymentStatus || "pending",
        "en"
      ),
      paymentStatusFr: getPaymentStatusText(
        request.paymentStatus || "pending",
        "fr"
      ),
      paymentId: request.paymentId || `PAY-${request.id}`,
      paymentMethod: request.paymentMethod || "ccp",
    };
  };

  const getPriorityText = (priority, lang) => {
    const priorityMap = {
      urgent: { ar: "عاجل", en: "Urgent", fr: "Urgent" },
      high: { ar: "عالية", en: "High", fr: "Élevée" },
      normal: { ar: "عادية", en: "Normal", fr: "Normale" },
      low: { ar: "منخفضة", en: "Low", fr: "Faible" },
    };
    return priorityMap[priority]?.[lang] || priorityMap.normal[lang];
  };

  const getStatusText = (status, lang) => {
    const statusMap = {
      pending: { ar: "في الانتظار", en: "Pending", fr: "En attente" },
      pending_payment: {
        ar: "في انتظار الدفع",
        en: "Pending Payment",
        fr: "En attente de paiement",
      },
      in_progress: { ar: "قيد التنفيذ", en: "In Progress", fr: "En cours" },
      completed: { ar: "مكتمل", en: "Completed", fr: "Terminé" },
      rejected: { ar: "مرفوض", en: "Rejected", fr: "Rejeté" },
    };
    return statusMap[status]?.[lang] || statusMap.pending[lang];
  };

  const getPaymentStatusText = (status, lang) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending_payment":
        return <FiDollarSign className="w-5 h-5 text-yellow-500" />;
      case "in_progress":
        return <FiClock className="w-5 h-5 text-blue-500" />;
      case "completed":
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_payment":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={title}
        description={desc}
        keywords="طلبات الخدمات, الخدمات القانونية, تتبع الطلبات"
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[#09142b] mb-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {title}
          </h1>
          <p className="text-[#6b7280]" dir={isRTL ? "rtl" : "ltr"}>
            {desc}
          </p>
        </div>

        {/* Service Requests List */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8a45e] mx-auto mb-4"></div>
              <p className="text-gray-600">{t("loading")}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                {t("error")}
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : serviceRequests.length === 0 ? (
            <div className="text-center py-12">
              <FiMessageCircle className="w-16 h-16 text-[#c8a45e] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#09142b] mb-2">
                {t("noServiceRequests")}
              </h3>
              <p className="text-gray-600">{t("noServiceRequestsDesc")}</p>
            </div>
          ) : (
            serviceRequests.map((request) => {
              const mappedRequest = mapServiceRequestData(request);
              return (
                <div
                  key={request.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Request Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        {getStatusIcon(request.status)}
                        <div className="flex-1">
                          <h3
                            className="text-lg font-semibold text-[#09142b] mb-1"
                            dir={isRTL ? "rtl" : "ltr"}
                          >
                            {getLocalizedText(mappedRequest, "serviceName")}
                          </h3>
                          <p
                            className="text-[#6b7280] text-sm mb-2"
                            dir={isRTL ? "rtl" : "ltr"}
                          >
                            {getLocalizedText(mappedRequest, "description")}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                mappedRequest.status
                              )}`}
                            >
                              {getLocalizedText(mappedRequest, "status")}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                mappedRequest.priority
                              )}`}
                            >
                              {getLocalizedText(mappedRequest, "priority")}
                            </span>
                            {mappedRequest.paymentRequired && (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  mappedRequest.paymentStatus === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {getLocalizedText(
                                  mappedRequest,
                                  "paymentStatus"
                                )}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-[#6b7280]">
                            <span>
                              {t("createdAt", "تاريخ الإنشاء")}:{" "}
                              {mappedRequest.createdAt}
                            </span>
                            {mappedRequest.consultant && (
                              <span className="mr-4">
                                {t("consultant", "المستشار")}:{" "}
                                {getLocalizedText(mappedRequest, "consultant")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {mappedRequest.paymentRequired && (
                        <button
                          onClick={() =>
                            window.open(
                              `/payment-details/${mappedRequest.id}`,
                              "_blank"
                            )
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-[#c8a45e] text-white rounded-lg hover:bg-[#c8a45e]/80 transition-colors cursor-pointer"
                        >
                          <FiCreditCard className="w-4 h-4" />
                          {mappedRequest.paymentStatus === "pending"
                            ? t("payNow", "ادفع الآن")
                            : t("viewPayment", "عرض الدفع")}
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(mappedRequest)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#09142b] text-white rounded-lg hover:bg-[#09142b]/80 transition-colors cursor-pointer"
                      >
                        <FiEye className="w-4 h-4" />
                        {t("viewDetails", "عرض التفاصيل")}
                      </button>
                    </div>
                  </div>

                  {/* Payment Amount */}
                  {mappedRequest.paymentRequired && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6b7280]">
                          {t("amount", "المبلغ")}:
                        </span>
                        <span className="text-lg font-semibold text-[#09142b]">
                          {mappedRequest.paymentAmount.toLocaleString()}{" "}
                          {mappedRequest.paymentCurrency}
                        </span>
                      </div>
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
            window.open(`/payment-details/${selectedRequest.id}`, "_blank")
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

  const getLocalizedText = (request, field) => {
    const lang = i18n.language;
    if (lang === "ar") return request[field];
    if (lang === "fr") return request[`${field}Fr`];
    return request[`${field}En`];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending_payment":
        return <FiDollarSign className="w-5 h-5 text-yellow-500" />;
      case "in_progress":
        return <FiClock className="w-5 h-5 text-blue-500" />;
      case "completed":
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending_payment":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            className="text-xl font-semibold text-[#09142b]"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {t("requestDetails", "تفاصيل الطلب")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <FiXCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Request Info */}
          <div className="space-y-4">
            <h3
              className="text-lg font-semibold text-[#09142b]"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("requestInfo", "معلومات الطلب")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(request.status)}
                <div>
                  <p className="font-medium text-[#09142b]">
                    {getLocalizedText(request, "serviceName")}
                  </p>
                  <p className="text-sm text-[#6b7280]">
                    {getLocalizedText(request, "description")}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    request.status
                  )}`}
                >
                  {getLocalizedText(request, "status")}
                </span>
              </div>
              <div className="text-sm text-[#6b7280] space-y-1">
                <p>
                  <span className="font-medium">
                    {t("createdAt", "تاريخ الإنشاء")}:
                  </span>{" "}
                  {(request.createdAt || request.created_at)
                    ? new Date(request.createdAt || request.created_at).toLocaleDateString("en-US")
                    : "غير محدد"}
                </p>
                {request.consultant && (
                  <p>
                    <span className="font-medium">
                      {t("consultant", "المستشار")}:
                    </span>{" "}
                    {getLocalizedText(request, "consultant")}
                  </p>
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
            <div className="space-y-4">
              <h3
                className="text-lg font-semibold text-[#09142b]"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t("paymentInfo", "معلومات الدفع")}
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-yellow-800">
                      {t("amount", "المبلغ")}: {request.paymentAmount}{" "}
                      {request.paymentCurrency}
                    </p>
                    <p className="text-sm text-yellow-700">
                      {t("paymentStatus", "حالة الدفع")}:{" "}
                      {getLocalizedText(request, "paymentStatus")}
                    </p>
                  </div>
                  <button
                    onClick={onPay}
                    className="px-4 py-2 bg-[#c8a45e] text-white rounded-lg hover:bg-[#b8944f] transition-colors cursor-pointer"
                  >
                    {t("payNow", "ادفع الآن")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {t("close", "إغلاق")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequests;
