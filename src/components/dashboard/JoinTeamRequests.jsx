import React, { useState } from "react";
import { FiEye, FiCheck, FiX, FiSearch, FiFilter } from "react-icons/fi";
import DataTable from "./DataTable";
import CustomAlert from "./CustomAlert";

const JoinTeamRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock join team requests data
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+213 123 456 789",
      position: "محامي",
      experience: "5 سنوات",
      status: "قيد المراجعة",
      submitDate: "2024-01-15",
      cv: "ahmed_cv.pdf",
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima@example.com",
      phone: "+213 987 654 321",
      position: "مستشار قانوني",
      experience: "3 سنوات",
      status: "مقبول",
      submitDate: "2024-01-10",
      cv: "fatima_cv.pdf",
    },
    {
      id: 3,
      name: "محمد أحمد",
      email: "mohamed@example.com",
      phone: "+213 555 123 456",
      position: "محامي متدرب",
      experience: "1 سنة",
      status: "مرفوض",
      submitDate: "2024-01-05",
      cv: "mohamed_cv.pdf",
    },
  ]);

  const columns = [
    { key: "name", label: "الاسم", sortable: true },
    { key: "email", label: "البريد الإلكتروني", sortable: true },
    { key: "phone", label: "رقم الهاتف", sortable: false },
    { key: "position", label: "المنصب المطلوب", sortable: true },
    { key: "experience", label: "الخبرة", sortable: true },
    { key: "status", label: "الحالة", sortable: true },
    { key: "submitDate", label: "تاريخ التقديم", sortable: true },
    { key: "actions", label: "الإجراءات", sortable: false },
  ];

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleStatusChange = (requestId, newStatus) => {
    setRequests(
      requests.map((request) =>
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );

    const statusText = newStatus === "مقبول" ? "قبول" : "رفض";
    showAlert("success", "تم التحديث", `تم ${statusText} الطلب بنجاح`);
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
      request.position.toLowerCase().includes(searchTerm.toLowerCase())
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
        {request.status === "قيد المراجعة" && (
          <>
            <button
              onClick={() => handleStatusChange(request.id, "مقبول")}
              className="text-green-600 hover:text-green-800 p-1"
              title="قبول"
            >
              <FiCheck size={16} />
            </button>
            <button
              onClick={() => handleStatusChange(request.id, "مرفوض")}
              className="text-red-600 hover:text-red-800 p-1"
              title="رفض"
            >
              <FiX size={16} />
            </button>
          </>
        )}
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900">
            طلبات الانضمام للفريق
          </h1>
          <p className="text-gray-600">إدارة طلبات الانضمام لفريق SOSLAW</p>
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
                تفاصيل طلب الانضمام
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
                    المنصب المطلوب
                  </label>
                  <p className="text-gray-900">{selectedRequest.position}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الخبرة
                  </label>
                  <p className="text-gray-900">{selectedRequest.experience}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الحالة
                  </label>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedRequest.status === "مقبول"
                        ? "bg-green-100 text-green-800"
                        : selectedRequest.status === "مرفوض"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاريخ التقديم
                  </label>
                  <p className="text-gray-900">{selectedRequest.submitDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    السيرة الذاتية
                  </label>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 underline"
                    onClick={(e) => {
                      e.preventDefault();
                      showAlert(
                        "info",
                        "تحميل الملف",
                        "سيتم تحميل السيرة الذاتية"
                      );
                    }}
                  >
                    {selectedRequest.cv}
                  </a>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  معلومات إضافية
                </label>
                <p className="text-gray-900">
                  هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم
                  توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا
                  النص أو العديد من النصوص الأخرى.
                </p>
              </div>

              {/* Action Buttons */}
              {selectedRequest.status === "قيد المراجعة" && (
                <div className="flex items-center justify-end space-x-3 space-x-reverse pt-4 border-t">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, "مرفوض");
                      setShowDetailsModal(false);
                    }}
                    className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
                  >
                    رفض الطلب
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, "مقبول");
                      setShowDetailsModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    قبول الطلب
                  </button>
                </div>
              )}
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

export default JoinTeamRequests;
