import React, { useState } from "react";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiHelpCircle,
  FiEye,
  FiFilter,
} from "react-icons/fi";
import DataTable from "./DataTable";
import CustomAlert from "./CustomAlert";

const FAQManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "ما هي الخدمات القانونية التي تقدمونها؟",
      answer:
        "نقدم مجموعة شاملة من الخدمات القانونية تشمل الاستشارات المدنية والتجارية والعائلية والجنائية وغيرها",
      category: "general",
      status: "active",
      order: 1,
    },
    {
      id: 2,
      question: "كيف يمكنني طلب استشارة قانونية؟",
      answer:
        "يمكنك طلب استشارة قانونية من خلال ملء النموذج الموجود على موقعنا أو التواصل معنا عبر الهاتف",
      category: "consultation",
      status: "active",
      order: 2,
    },
    {
      id: 3,
      question: "ما هي تكلفة الاستشارة القانونية؟",
      answer:
        "تختلف تكلفة الاستشارة حسب نوع القضية وتعقيدها. يمكنك التواصل معنا للحصول على عرض سعر مخصص",
      category: "pricing",
      status: "active",
      order: 3,
    },
  ]);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
    status: "active",
    order: 1,
  });

  const columns = [
    {
      key: "question",
      label: "السؤال",
      sortable: true,
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "answer",
      label: "الإجابة",
      sortable: false,
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "category",
      label: "الفئة",
      sortable: true,
      render: (value) => {
        const categoryConfig = {
          general: {
            label: "عام",
            class: "bg-blue-100 text-blue-800",
          },
          consultation: {
            label: "استشارة",
            class: "bg-green-100 text-green-800",
          },
          pricing: {
            label: "الأسعار",
            class: "bg-yellow-100 text-yellow-800",
          },
        };
        const config = categoryConfig[value] || categoryConfig.general;
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
      key: "order",
      label: "الترتيب",
      sortable: true,
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value === "active" ? "نشط" : "غير نشط"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "الإجراءات",
      sortable: false,
      render: (_, faq) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => handleViewFAQ(faq)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="عرض"
          >
            <FiEye size={16} />
          </button>
          <button
            onClick={() => handleEditFAQ(faq)}
            className="p-1 text-green-600 hover:text-green-800"
            title="تعديل"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => handleDeleteFAQ(faq.id)}
            className="p-1 text-red-600 hover:text-red-800"
            title="حذف"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update existing FAQ
      setFaqs((prev) =>
        prev.map((faq) =>
          faq.id === selectedFAQ.id ? { ...faq, ...formData } : faq
        )
      );
      showAlert("success", "تم التحديث", "تم تحديث السؤال بنجاح");
    } else {
      // Add new FAQ
      const newFAQ = {
        id: Date.now(),
        ...formData,
        order: faqs.length + 1,
      };
      setFaqs((prev) => [...prev, newFAQ]);
      showAlert("success", "تم الإضافة", "تم إضافة السؤال الجديد بنجاح");
    }

    handleCloseForm();
  };

  const handleEditFAQ = (faq) => {
    setSelectedFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      status: faq.status,
      order: faq.order,
    });
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleDeleteFAQ = (faqId) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== faqId));
    showAlert("success", "تم الحذف", "تم حذف السؤال بنجاح");
  };

  const handleViewFAQ = (faq) => {
    setSelectedFAQ(faq);
    // You can add a view modal here if needed
    showAlert("info", "عرض السؤال", `عرض تفاصيل السؤال: ${faq.question}`);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedFAQ(null);
    setFormData({
      question: "",
      answer: "",
      category: "general",
      status: "active",
      order: 1,
    });
  };

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ show: false, type: "info", title: "", message: "" });
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || faq.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const tableData = filteredFAQs.map((faq) => ({
    ...faq,
    actions: (
      <div className="flex items-center space-x-2 space-x-reverse">
        <button
          onClick={() => handleViewFAQ(faq)}
          className="p-1 text-blue-600 hover:text-blue-800"
          title="عرض"
        >
          <FiEye size={16} />
        </button>
        <button
          onClick={() => handleEditFAQ(faq)}
          className="p-1 text-green-600 hover:text-green-800"
          title="تعديل"
        >
          <FiEdit size={16} />
        </button>
        <button
          onClick={() => handleDeleteFAQ(faq.id)}
          className="p-1 text-red-600 hover:text-red-800"
          title="حذف"
        >
          <FiTrash2 size={16} />
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
            إدارة الأسئلة الشائعة
          </h1>
          <p className="text-gray-600">
            إدارة الأسئلة الشائعة المعروضة على الموقع
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
        >
          <FiPlus size={16} />
          <span>إضافة سؤال</span>
        </button>
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
              placeholder="البحث في الأسئلة..."
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
            <option value="all">جميع الأسئلة</option>
            <option value="active">الأسئلة النشطة</option>
            <option value="inactive">الأسئلة غير النشطة</option>
          </select>
          <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiFilter size={16} />
            <span>تصفية</span>
          </button>
        </div>
      </div>

      {/* FAQs Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <DataTable data={tableData} columns={columns} searchTerm={searchTerm} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full ml-4">
              <FiHelpCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                إجمالي الأسئلة
              </p>
              <p className="text-2xl font-bold text-gray-900">{faqs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full ml-4">
              <FiEye className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                الأسئلة النشطة
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {faqs.filter((f) => f.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full ml-4">
              <FiEdit className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">الفئات</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(faqs.map((f) => f.category)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit FAQ Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "تعديل السؤال" : "إضافة سؤال جديد"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السؤال
                </label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل السؤال"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الإجابة
                </label>
                <textarea
                  name="answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل الإجابة"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">عام</option>
                    <option value="consultation">استشارة</option>
                    <option value="pricing">الأسعار</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isEditing ? "تحديث" : "إضافة"}
                </button>
              </div>
            </form>
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

export default FAQManagement;
