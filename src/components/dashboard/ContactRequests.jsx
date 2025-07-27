import React, { useState } from "react";
import {
  FiEye,
  FiMail,
  FiSearch,
  FiFilter,
  FiMessageSquare,
} from "react-icons/fi";
import DataTable from "./DataTable";
import CustomAlert from "./CustomAlert";

const ContactRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  // Mock contact requests data
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+213 123 456 789",
      subject: "استفسار عن الخدمات القانونية",
      message:
        "أريد معرفة المزيد عن خدماتكم القانونية وكيف يمكنني الحصول على استشارة.",
      status: "جديد",
      submitDate: "2024-01-15",
      priority: "عادي",
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima@example.com",
      phone: "+213 987 654 321",
      subject: "طلب استشارة عاجلة",
      message: "أحتاج إلى استشارة عاجلة في قضية مدنية، هل يمكنكم مساعدتي؟",
      status: "تم الرد",
      submitDate: "2024-01-10",
      priority: "عالي",
    },
    {
      id: 3,
      name: "محمد أحمد",
      email: "mohamed@example.com",
      phone: "+213 555 123 456",
      subject: "استفسار عن الأسعار",
      message: "أريد معرفة أسعار الخدمات القانونية المختلفة التي تقدمونها.",
      status: "قيد المعالجة",
      submitDate: "2024-01-05",
      priority: "عادي",
    },
  ]);

  const columns = [
    { key: "name", label: "الاسم", sortable: true },
    { key: "email", label: "البريد الإلكتروني", sortable: true },
    { key: "phone", label: "رقم الهاتف", sortable: false },
    { key: "subject", label: "الموضوع", sortable: true },
    { key: "priority", label: "الأولوية", sortable: true },
    { key: "status", label: "الحالة", sortable: true },
    { key: "submitDate", label: "تاريخ الإرسال", sortable: true },
    { key: "actions", label: "الإجراءات", sortable: false },
  ];

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleReply = (request) => {
    setSelectedRequest(request);
    setShowReplyModal(true);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      showAlert("error", "خطأ", "يرجى كتابة رسالة الرد");
      return;
    }

    // Update request status
    setRequests(
      requests.map((request) =>
        request.id === selectedRequest.id
          ? { ...request, status: "تم الرد" }
          : request
      )
    );

    showAlert("success", "تم الإرسال", "تم إرسال الرد بنجاح");
    setShowReplyModal(false);
    setReplyMessage("");
  };

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ show: false, type: "info", title: "", message: "" });
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableData = filteredRequests.map((request) => ({
    ...request,
    actions: (
      <div className="flex items-center space-x-2 space-x-reverse">
        <button
          onClick={() => handleViewDetails(request)}
          className="text-blue-600 hover:text-blue-800 p-1"
          title="عرض التفاصيل"
        >
          <FiEye size={16} />
        </button>
        {request.status !== "تم الرد" && (
          <button
            onClick={() => handleReply(request)}
            className="text-green-600 hover:text-green-800 p-1"
            title="رد"
          >
            <FiMessageSquare size={16} />
          </button>
        )}
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900">طلبات التواصل</h1>
          <p className="text-gray-600">إدارة رسائل التواصل من العملاء</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex-1 relative">
            <FiSearch
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="البحث في الطلبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiFilter size={16} />
            <span>تصفية</span>
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <DataTable data={tableData} columns={columns} searchTerm={searchTerm} />
      </div>

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                تفاصيل طلب التواصل
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الكامل
                  </label>
                  <p className="text-gray-900">{selectedRequest.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <p className="text-gray-900">{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <p className="text-gray-900">{selectedRequest.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الأولوية
                  </label>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedRequest.priority === "عالي"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedRequest.priority}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الحالة
                  </label>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedRequest.status === "جديد"
                        ? "bg-blue-100 text-blue-800"
                        : selectedRequest.status === "تم الرد"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاريخ الإرسال
                  </label>
                  <p className="text-gray-900">{selectedRequest.submitDate}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الموضوع
                </label>
                <p className="text-gray-900 font-medium">
                  {selectedRequest.subject}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الرسالة
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">{selectedRequest.message}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 space-x-reverse pt-4 border-t">
                {selectedRequest.status !== "تم الرد" && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleReply(selectedRequest);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 space-x-reverse"
                  >
                    <FiMessageSquare size={16} />
                    <span>رد</span>
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">رد على الطلب</h2>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إلى: {selectedRequest.name} ({selectedRequest.email})
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رسالة الرد
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="اكتب رسالة الرد هنا..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 space-x-reverse pt-4">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSendReply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  إرسال الرد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert */}
      <CustomAlert
        isVisible={alert.show}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  );
};

export default ContactRequests;
