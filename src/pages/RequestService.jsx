import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiSend,
} from "react-icons/fi";
import serviceRequestService from "../services/serviceRequestService";
import toast from "react-hot-toast";
import { services } from "./components/servicesData";
import { getServiceDatabaseId } from "../utils/serviceMapping";
import Cookies from "js-cookie";
import API_BASE_URL from "../config/api.js";

const RequestService = () => {
  const { serviceId: urlServiceId } = useParams();
  const navigate = useNavigate();

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

  // Fetch consultants on component mount
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setLoadingConsultants(true);
        console.log('Fetching consultants from API...');
        const response = await fetch(`${API_BASE_URL}/api/v1/consultants/public`);
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Consultants data:', data);
          setConsultants(data.data || []);
        } else {
          console.error('API response not ok:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching consultants:', error);
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
    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      const token = Cookies.get("jwt");
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً لطلب الخدمة");
        navigate("/login");
        setIsSubmitting(false);
        return;
      }

      // Validate required fields
      const requiredFields = [
        "serviceId",
        "clientName",
        "clientEmail",
        "clientPhone",
        "serviceDescription",
      ];

      const missingFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].trim() === ""
      );

      if (missingFields.length > 0) {
        toast.error("يرجى ملء جميع الحقول المطلوبة");
        setIsSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.clientEmail)) {
        toast.error("يرجى إدخال بريد إلكتروني صحيح");
        setIsSubmitting(false);
        return;
      }

      // Validate phone format (basic validation)
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
      if (!phoneRegex.test(formData.clientPhone)) {
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
      const requestData = {
        ...formData,
        serviceId: databaseServiceId,
      };

      // Log the data being sent for debugging
      console.log('📤 Sending service request data:', requestData);
      console.log('📤 Selected Plan:', requestData.selectedPlan);

      // Send the request to the backend
      const response = await serviceRequestService.createServiceRequest(
        requestData
      );

      if (response.success) {
        toast.success(
          "تم إرسال طلب الخدمة بنجاح! يمكنك مراجعة طلباتك في صفحة 'طلباتك'"
        );

        // Force refresh of notification counts to update the badge immediately
        window.dispatchEvent(new CustomEvent("refreshNotifications"));
        console.log("Service request created - refreshing notifications");

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
        toast.error("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى");
        navigate("/login");
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

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "normal":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "عاجل";
      case "high":
        return "عالية";
      case "normal":
        return "عادية";
      case "low":
        return "منخفضة";
      default:
        return "عادية";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">اطلب الخدمة</h1>
          {selectedService ? (
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-4">
                <span className="text-blue-600 font-medium">
                  الخدمة المختارة: {selectedService.title.ar}
                </span>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {selectedService.description.ar}
              </p>
            </div>
          ) : (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اختر الخدمة التي تحتاجها واملأ النموذج أدناه. سنقوم بمراجعة طلبك
              والتواصل معك في أقرب وقت ممكن.
            </p>
          )}
        </div>

        {/* Service Request Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Information */}
            {selectedService && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <FiFileText className="ml-2" />
                  معلومات الخدمة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الخدمة
                    </label>
                    <div className="px-4 py-3 bg-white border border-gray-300 rounded-lg">
                      <span className="text-gray-900 font-medium">
                        {selectedService.title.ar}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف الخدمة
                    </label>
                    <div className="px-4 py-3 bg-white border border-gray-300 rounded-lg">
                      <span className="text-gray-700 text-sm">
                        {selectedService.description.ar}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Service Selection (if no service pre-selected) */}
            {!selectedService && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الخدمة <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر الخدمة</option>
                  {servicesList.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title.ar}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Client Information */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FiUser className="ml-2" />
                المعلومات الشخصية
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+213 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    name="clientAddress"
                    value={formData.clientAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل عنوانك"
                  />
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FiFileText className="ml-2" />
                تفاصيل الخدمة
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف الخدمة المطلوبة <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="serviceDescription"
                    value={formData.serviceDescription}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اشرح بالتفصيل الخدمة التي تحتاجها..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مستوى الأولوية
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">منخفضة</option>
                      <option value="normal">عادية</option>
                      <option value="high">عالية</option>
                      <option value="urgent">عاجل</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التاريخ المفضل
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    متطلبات إضافية
                  </label>
                  <textarea
                    name="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أي متطلبات إضافية أو ملاحظات..."
                  />
                </div>

                {/* Plan Selection - Only for legal-consultation service */}
                {formData.serviceId === 'legal-consultation' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      اختر الباقة التي تناسبك <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Free Plan for Special Needs */}
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, selectedPlan: 'free-special-needs' }))}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.selectedPlan === 'free-special-needs'
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <FiUser className="text-orange-500 text-xl" />
                        </div>
                        <h4 className="text-center text-sm font-semibold text-gray-900 mb-2">
                          ذوي الاحتياجات الخاصة
                        </h4>
                        <div className="space-y-1 text-xs text-gray-600 mb-2">
                          <div className="flex items-center justify-center">
                            <FiClock className="ml-1 text-gray-400" size={12} />
                            <span>30 دقيقة</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <FiCheckCircle className="ml-1 text-gray-400" size={12} />
                            <span>عن بُعد أو حضوري</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-base font-bold text-green-600">مجانًا</span>
                        </div>
                      </div>

                      {/* Mini Plan */}
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, selectedPlan: 'mini-15min' }))}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.selectedPlan === 'mini-15min'
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <FiClock className="text-blue-500 text-xl" />
                        </div>
                        <h4 className="text-center text-sm font-semibold text-gray-900 mb-2">
                          باقة Mini
                        </h4>
                        <div className="space-y-1 text-xs text-gray-600 mb-2">
                          <div className="flex items-center justify-center">
                            <FiClock className="ml-1 text-gray-400" size={12} />
                            <span>15 دقيقة</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <FiCheckCircle className="ml-1 text-gray-400" size={12} />
                            <span>سؤال محدد</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <FiPhone className="ml-1 text-gray-400" size={12} />
                            <span>عن بُعد</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-base font-bold text-blue-600">1000 دج</span>
                        </div>
                      </div>

                      {/* Standard Plan */}
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, selectedPlan: 'standard-30min' }))}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.selectedPlan === 'standard-30min'
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <FiFileText className="text-green-500 text-xl" />
                        </div>
                        <h4 className="text-center text-sm font-semibold text-gray-900 mb-2">
                          باقة Standard
                        </h4>
                        <div className="space-y-1 text-xs text-gray-600 mb-2">
                          <div className="flex items-center justify-center">
                            <FiClock className="ml-1 text-gray-400" size={12} />
                            <span>30 دقيقة</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <FiCheckCircle className="ml-1 text-gray-400" size={12} />
                            <span>تحليل + توجيه</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <FiPhone className="ml-1 text-gray-400" size={12} />
                            <span>عن بُعد</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-base font-bold text-green-600">2000 دج</span>
                        </div>
                      </div>

                      {/* Premium Plan */}
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, selectedPlan: 'premium-45min' }))}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.selectedPlan === 'premium-45min'
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-2">
                          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <h4 className="text-center text-sm font-semibold text-gray-900 mb-2">
                          باقة Premium
                        </h4>
                        <div className="space-y-1 text-xs text-gray-600 mb-2">
                          <div className="flex items-center justify-center">
                            <FiClock className="ml-1 text-gray-400" size={12} />
                            <span>45 دقيقة</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <FiCheckCircle className="ml-1 text-gray-400" size={12} />
                            <span>استشارة معمقة</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <FiFileText className="ml-1 text-gray-400" size={12} />
                            <span>ملاحظات مكتوبة</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-base font-bold text-purple-600">3000 دج</span>
                        </div>
                      </div>
                    </div>
                    {!formData.selectedPlan && (
                      <p className="text-red-500 text-sm mt-2">يرجى اختيار باقة للمتابعة</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المستشار المفضل (اختياري)
                  </label>
                  {loadingConsultants ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                      <FiLoader className="animate-spin ml-2" />
                      <span className="text-gray-500">جاري تحميل المستشارين...</span>
                    </div>
                  ) : (
                    <select
                      name="preferredConsultantId"
                      value={formData.preferredConsultantId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">اختر مستشار (اختياري)</option>
                      {consultants.map((consultant) => (
                        <option key={consultant.id} value={consultant.id}>
                          {consultant.name} - {consultant.specialization || 'مستشار قانوني'}
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    يمكنك اختيار مستشار معين إذا كان لديك تفضيل، أو ترك هذا الحقل فارغاً
                  </p>
                </div>
              </div>
            </div>

            {/* Priority Indicator */}
            {formData.urgency && (
              <div className="border-t border-gray-200 pt-6">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full border ${getUrgencyColor(
                    formData.urgency
                  )}`}
                >
                  <FiClock className="ml-2" />
                  <span className="font-medium">
                    مستوى الأولوية: {getUrgencyText(formData.urgency)}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="border-t border-gray-200 pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin ml-2" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <FiSend className="ml-2" />
                    إرسال طلب الخدمة
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
            <FiCheckCircle className="ml-2" />
            ما يحدث بعد إرسال الطلب؟
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-blue-900 mb-2">مراجعة الطلب</h4>
              <p className="text-blue-700 text-sm">
                سنقوم بمراجعة طلبك بعناية وتحديد المتطلبات
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-blue-900 mb-2">التواصل معك</h4>
              <p className="text-blue-700 text-sm">
                سنتواصل معك خلال 24 ساعة لمناقشة التفاصيل
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-blue-900 mb-2">بدء العمل</h4>
              <p className="text-blue-700 text-sm">
                بعد الموافقة على الشروط، سنبدأ في تنفيذ الخدمة
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestService;
