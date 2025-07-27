import React, { useState } from "react";
import {
  FiSearch,
  FiEye,
  FiMail,
  FiFileText,
  FiUser,
  FiCalendar,
  FiClock,
  FiFilter,
  FiPhone,
  FiMessageSquare,
} from "react-icons/fi";
import DataTable from "./DataTable";
import CustomAlert from "./CustomAlert";

const LegalConsultations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const [consultations, setConsultations] = useState([
    {
      id: 1,
      clientName: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+213 123 456 789",
      consultationType: "civil",
      consultationTitle: "قضية مدنية - عقد إيجار",
      description: "أحتاج إلى استشارة في قضية تتعلق بعقد إيجار تجاري",
      status: "pending",
      priority: "high",
      submissionDate: "2024-01-21",
      assignedTo: "د. ليلى حسن",
    },
    {
      id: 2,
      clientName: "سارة أحمد",
      email: "sara@example.com",
      phone: "+213 987 654 321",
      consultationType: "commercial",
      consultationTitle: "تأسيس شركة",
      description: "أريد استشارة حول إجراءات تأسيس شركة تجارية",
      status: "in_progress",
      priority: "medium",
      submissionDate: "2024-01-20",
      assignedTo: "عمر الفاروق",
    },
    {
      id: 3,
      clientName: "محمد علي",
      email: "mohamed@example.com",
      phone: "+213 555 123 456",
      consultationType: "family",
      consultationTitle: "قضية طلاق",
      description: "أحتاج إلى استشارة في قضية طلاق وحضانة الأطفال",
      status: "completed",
      priority: "high",
      submissionDate: "2024-01-19",
      assignedTo: "سارة خالد",
    },
  ]);

  const columns = [
    {
      key: "clientName",
      label: "اسم العميل",
      sortable: true,
    },
    {
      key: "consultationTitle",
      label: "عنوان الاستشارة",
      sortable: true,
    },
    {
      key: "consultationType",
      label: "نوع الاستشارة",
      sortable: true,
      render: (value) => {
        const typeConfig = {
          civil: {
            label: "مدني",
            class: "bg-blue-100 text-blue-800",
          },
          commercial: {
            label: "تجاري",
            class: "bg-green-100 text-green-800",
          },
          family: {
            label: "أحوال شخصية",
            class: "bg-purple-100 text-purple-800",
          },
          criminal: {
            label: "جنائي",
            class: "bg-red-100 text-red-800",
          },
        };
        const config = typeConfig[value] || typeConfig.civil;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (value) => {
        const statusConfig = {
          pending: {
            label: "معلق",
            class: "bg-yellow-100 text-yellow-800",
          },
          in_progress: {
            label: "قيد المعالجة",
            class: "bg-blue-100 text-blue-800",
          },
          completed: {
            label: "مكتمل",
            class: "bg-green-100 text-green-800",
          },
          cancelled: {
            label: "ملغي",
            class: "bg-red-100 text-red-800",
          },
        };
        const config = statusConfig[value] || statusConfig.pending;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      key: "priority",
      label: "الأولوية",
      sortable: true,
      render: (value) => {
        const priorityConfig = {
          high: { label: "عالية", class: "bg-red-100 text-red-800" },
          medium: {
            label: "متوسطة",
            class: "bg-yellow-100 text-yellow-800",
          },
          low: {
            label: "منخفضة",
            class: "bg-green-100 text-green-800",
          },
        };
        const config = priorityConfig[value] || priorityConfig.medium;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${config.class}`}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      key: "assignedTo",
      label: "المسؤول",
      sortable: true,
    },
    {
      key: "submissionDate",
      label: "تاريخ الطلب",
      sortable: true,
    },
    {
      key: "actions",
      label: "الإجراءات",
      sortable: false,
      render: (_, consultation) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => handleViewConsultation(consultation)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="عرض"
          >
            <FiEye size={16} />
          </button>
          <button
            onClick={() => handleContactClient(consultation)}
            className="p-1 text-green-600 hover:text-green-800"
            title="تواصل"
          >
            <FiMail size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleViewConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    setShowDetailsModal(true);
  };

  const handleContactClient = (consultation) => {
    setSelectedConsultation(consultation);
    setContactMessage("");
    setShowContactModal(true);
  };

  const handleSendContact = () => {
    if (!contactMessage.trim()) {
      showAlert("error", "خطأ", "يرجى كتابة رسالة");
      return;
    }

    showAlert("success", "تم الإرسال", "تم إرسال الرسالة للعميل بنجاح");
    setShowContactModal(false);
    setContactMessage("");
  };

  const handleStatusChange = (consultationId, newStatus) => {
    setConsultations((prev) =>
      prev.map((consultation) =>
        consultation.id === consultationId
          ? { ...consultation, status: newStatus }
          : consultation
      )
    );
    showAlert("success", "تم التحديث", "تم تحديث حالة الاستشارة بنجاح");
  };

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ show: false, type: "info", title: "", message: "" });
  };

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.clientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      consultation.consultationTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      consultation.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || consultation.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const tableData = filteredConsultations.map((consultation) => ({
    ...consultation,
    actions: (
      <div className="flex items-center space-x-2 space-x-reverse">
        <button
          onClick={() => handleViewConsultation(consultation)}
          className="p-1 text-blue-600 hover:text-blue-800"
          title="عرض"
        >
          <FiEye size={16} />
        </button>
        <button
          onClick={() => handleContactClient(consultation)}
          className="p-1 text-green-600 hover:text-green-800"
          title="تواصل"
        >
          <FiMail size={16} />
        </button>
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900">
            الاستشارات القانونية
          </h1>
          <p className="text-gray-600">إدارة طلبات الاستشارات القانونية</p>
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
              placeholder="البحث في الاستشارات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">جميع الاستشارات</option>
            <option value="pending">الاستشارات المعلقة</option>
            <option value="in_progress">قيد المعالجة</option>
            <option value="completed">المكتملة</option>
          </select>
          <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiFilter size={16} />
            <span>تصفية</span>
          </button>
        </div>
      </div>

      {/* Consultations Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <DataTable data={tableData} columns={columns} searchTerm={searchTerm} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full ml-4">
              <FiFileText className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                إجمالي الاستشارات
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {consultations.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full ml-4">
              <FiClock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                الاستشارات المعلقة
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {consultations.filter((c) => c.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full ml-4">
              <FiUser className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">قيد المعالجة</p>
              <p className="text-2xl font-bold text-gray-900">
                {consultations.filter((c) => c.status === "in_progress").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full ml-4">
              <FiCalendar className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">المكتملة</p>
              <p className="text-2xl font-bold text-gray-900">
                {consultations.filter((c) => c.status === "completed").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Details Modal */}
      {showDetailsModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                تفاصيل الاستشارة
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
                    اسم العميل
                  </label>
                  <p className="text-gray-900">
                    {selectedConsultation.clientName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <p className="text-gray-900">{selectedConsultation.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <p className="text-gray-900">{selectedConsultation.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع الاستشارة
                  </label>
                  <p className="text-gray-900">
                    {selectedConsultation.consultationType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان الاستشارة
                  </label>
                  <p className="text-gray-900">
                    {selectedConsultation.consultationTitle}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الأولوية
                  </label>
                  <p className="text-gray-900">
                    {selectedConsultation.priority}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المسؤول
                  </label>
                  <p className="text-gray-900">
                    {selectedConsultation.assignedTo}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاريخ الطلب
                  </label>
                  <p className="text-gray-900">
                    {selectedConsultation.submissionDate}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  وصف الاستشارة
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedConsultation.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تغيير الحالة
                  </label>
                  <select
                    value={selectedConsultation.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedConsultation.id,
                        e.target.value
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">معلق</option>
                    <option value="in_progress">قيد المعالجة</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleContactClient(selectedConsultation);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 space-x-reverse"
                  >
                    <FiMessageSquare size={16} />
                    <span>تواصل مع العميل</span>
                  </button>
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
        </div>
      )}

      {/* Contact Client Modal */}
      {showContactModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                تواصل مع العميل
              </h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إلى: {selectedConsultation.clientName}
                </label>
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                  <FiMail size={14} />
                  <span>{selectedConsultation.email}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 mt-1">
                  <FiPhone size={14} />
                  <span>{selectedConsultation.phone}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رسالة التواصل
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="اكتب رسالة التواصل هنا..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 space-x-reverse pt-4">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSendContact}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  إرسال
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

export default LegalConsultations;
