import React, { useState } from "react";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiUserPlus,
  FiUser,
  FiBriefcase,
  FiStar,
  FiFilter,
} from "react-icons/fi";
import DataTable from "./DataTable";
import CustomAlert from "./CustomAlert";

const ConsultantsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [consultants, setConsultants] = useState([
    {
      id: 1,
      name: "د. ليلى حسن",
      title: "مستشار قانوني أول",
      bio: "خبيرة في قانون الشركات والعقود والأعمال الدولية مع خبرة 15+ سنة",
      specialization: "قانون الشركات",
      experience: "15+ سنة",
      education: "دكتوراه في القانون",
      image: "/consultant1.jpg",
      status: "active",
      rating: 4.8,
      consultations: 150,
    },
    {
      id: 2,
      name: "عمر الفاروق",
      title: "أخصائي التقاضي",
      bio: "متخصص في التقاضي المدني والجنائي وحل النزاعات",
      specialization: "التقاضي",
      experience: "12 سنة",
      education: "ماجستير في القانون",
      image: "/consultant2.jpg",
      status: "active",
      rating: 4.9,
      consultations: 120,
    },
    {
      id: 3,
      name: "سارة خالد",
      title: "مستشارة قانون الأسرة",
      bio: "تركز على قانون الأسرة والوساطة وحماية الأطفال",
      specialization: "قانون الأسرة",
      experience: "10 سنة",
      education: "بكالوريوس في القانون",
      image: "/consultant3.jpg",
      status: "active",
      rating: 4.7,
      consultations: 95,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    specialization: "",
    experience: "",
    education: "",
    image: "",
    status: "active",
  });

  const columns = [
    {
      key: "name",
      label: "الاسم",
      sortable: true,
      render: (value, consultant) => (
        <div className="flex items-center">
          <img
            src={consultant.image}
            alt={value}
            className="w-10 h-10 rounded-full ml-3"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/40x40?text=" + value.charAt(0);
            }}
          />
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{consultant.title}</div>
          </div>
        </div>
      ),
    },
    {
      key: "specialization",
      label: "التخصص",
      sortable: true,
    },
    {
      key: "experience",
      label: "الخبرة",
      sortable: true,
    },
    {
      key: "rating",
      label: "التقييم",
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <FiStar className="text-yellow-400 ml-1" size={14} />
          <span className="text-sm font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "consultations",
      label: "الاستشارات",
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
      render: (_, consultant) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => handleViewConsultant(consultant)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="عرض"
          >
            <FiEye size={16} />
          </button>
          <button
            onClick={() => handleEditConsultant(consultant)}
            className="p-1 text-green-600 hover:text-green-800"
            title="تعديل"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => handleDeleteConsultant(consultant.id)}
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
      // Update existing consultant
      setConsultants((prev) =>
        prev.map((consultant) =>
          consultant.id === selectedConsultant.id
            ? { ...consultant, ...formData }
            : consultant
        )
      );
      showAlert("success", "تم التحديث", "تم تحديث بيانات المستشار بنجاح");
    } else {
      // Add new consultant
      const newConsultant = {
        id: Date.now(),
        ...formData,
        rating: 0,
        consultations: 0,
      };
      setConsultants((prev) => [...prev, newConsultant]);
      showAlert("success", "تم الإضافة", "تم إضافة المستشار الجديد بنجاح");
    }

    handleCloseForm();
  };

  const handleEditConsultant = (consultant) => {
    setSelectedConsultant(consultant);
    setFormData({
      name: consultant.name,
      title: consultant.title,
      bio: consultant.bio,
      specialization: consultant.specialization,
      experience: consultant.experience,
      education: consultant.education,
      image: consultant.image,
      status: consultant.status,
    });
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleDeleteConsultant = (consultantId) => {
    setConsultants((prev) =>
      prev.filter((consultant) => consultant.id !== consultantId)
    );
    showAlert("success", "تم الحذف", "تم حذف المستشار بنجاح");
  };

  const handleViewConsultant = (consultant) => {
    setSelectedConsultant(consultant);
    // You can add a view modal here if needed
    showAlert(
      "info",
      "عرض المستشار",
      `عرض تفاصيل المستشار: ${consultant.name}`
    );
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedConsultant(null);
    setFormData({
      name: "",
      title: "",
      bio: "",
      specialization: "",
      experience: "",
      education: "",
      image: "",
      status: "active",
    });
  };

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ show: false, type: "info", title: "", message: "" });
  };

  const filteredConsultants = consultants.filter((consultant) => {
    const matchesSearch =
      consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.specialization
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      consultant.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || consultant.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const tableData = filteredConsultants.map((consultant) => ({
    ...consultant,
    actions: (
      <div className="flex items-center space-x-2 space-x-reverse">
        <button
          onClick={() => handleViewConsultant(consultant)}
          className="p-1 text-blue-600 hover:text-blue-800"
          title="عرض"
        >
          <FiEye size={16} />
        </button>
        <button
          onClick={() => handleEditConsultant(consultant)}
          className="p-1 text-green-600 hover:text-green-800"
          title="تعديل"
        >
          <FiEdit size={16} />
        </button>
        <button
          onClick={() => handleDeleteConsultant(consultant.id)}
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستشارين</h1>
          <p className="text-gray-600">
            إدارة المستشارين القانونيين المعروضين على الموقع
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
        >
          <FiUserPlus size={16} />
          <span>إضافة مستشار</span>
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
              placeholder="البحث في المستشارين..."
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
            <option value="all">جميع المستشارين</option>
            <option value="active">المستشارين النشطين</option>
            <option value="inactive">المستشارين غير النشطين</option>
          </select>
          <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiFilter size={16} />
            <span>تصفية</span>
          </button>
        </div>
      </div>

      {/* Consultants Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <DataTable data={tableData} columns={columns} searchTerm={searchTerm} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full ml-4">
              <FiUser className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                إجمالي المستشارين
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {consultants.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full ml-4">
              <FiBriefcase className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                المستشارين النشطين
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {consultants.filter((c) => c.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full ml-4">
              <FiStar className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">متوسط التقييم</p>
              <p className="text-2xl font-bold text-gray-900">
                {(
                  consultants.reduce((acc, c) => acc + c.rating, 0) /
                  consultants.length
                ).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Consultant Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "تعديل المستشار" : "إضافة مستشار جديد"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المسمى الوظيفي
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل المسمى الوظيفي"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التخصص
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل التخصص"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنوات الخبرة
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: 10+ سنة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المؤهل العلمي
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل المؤهل العلمي"
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط الصورة
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل رابط الصورة"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السيرة الذاتية
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل السيرة الذاتية للمستشار"
                  />
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

export default ConsultantsManagement;
