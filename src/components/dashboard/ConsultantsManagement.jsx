import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  FiLoader,
} from "react-icons/fi";
import DataTable from "./DataTable";
import CustomAlert from "./CustomAlert";
import consultantService from "../../services/consultantService";
import toast from "react-hot-toast";
import Avatar from "../common/Avatar";

const ConsultantsManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form data for multi-language support
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    nameFr: "",
    titleAr: "",
    titleEn: "",
    titleFr: "",
    specializationAr: "",
    specializationEn: "",
    specializationFr: "",
    experienceAr: "",
    experienceEn: "",
    experienceFr: "",
    status: "active",
    rating: 0.0,
    consultations: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keyboard shortcut for search (Ctrl+F or Cmd+F)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="البحث في المستشارين"]'
        );
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  // Fetch consultants with React Query - only filter by status, not search
  const {
    data: consultantsData,
    isLoading: isLoadingConsultants,
    error: consultantsError,
  } = useQuery({
    queryKey: ["consultants", selectedFilter, currentPage, itemsPerPage],
    queryFn: () => {
      const offset = (currentPage - 1) * itemsPerPage;
      return consultantService.getAllConsultants({
        status: selectedFilter === "all" ? undefined : selectedFilter,
        language: "ar",
        limit: itemsPerPage,
        offset: offset,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch consultant statistics
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["consultantStats"],
    queryFn: consultantService.getConsultantStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create consultant mutation
  const createConsultantMutation = useMutation({
    mutationFn: (data) =>
      consultantService.createConsultant(data.consultantData, data.imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultants"] });
      queryClient.invalidateQueries({ queryKey: ["consultantStats"] });
      toast.success("تم إضافة المستشار الجديد بنجاح");
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في إضافة المستشار");
    },
  });

  // Update consultant mutation
  const updateConsultantMutation = useMutation({
    mutationFn: (data) =>
      consultantService.updateConsultant(
        data.id,
        data.consultantData,
        data.imageFile
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultants"] });
      queryClient.invalidateQueries({ queryKey: ["consultantStats"] });
      toast.success("تم تحديث بيانات المستشار بنجاح");
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث المستشار");
    },
  });

  // Delete consultant mutation
  const deleteConsultantMutation = useMutation({
    mutationFn: consultantService.deleteConsultant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultants"] });
      queryClient.invalidateQueries({ queryKey: ["consultantStats"] });
      toast.success("تم حذف المستشار بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حذف المستشار");
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: consultantService.toggleConsultantStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultants"] });
      queryClient.invalidateQueries({ queryKey: ["consultantStats"] });
      toast.success("تم تغيير حالة المستشار بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تغيير حالة المستشار");
    },
  });

  // Extract consultants from API response
  const allConsultants = consultantsData?.data?.consultants || [];
  const totalConsultants = consultantsData?.data?.total || 0;

  // Filter consultants based on search term (client-side filtering)
  const consultants = React.useMemo(() => {
    if (!searchTerm.trim()) return allConsultants;

    const searchLower = searchTerm.toLowerCase().trim();

    return allConsultants.filter((consultant) => {
      return (
        (consultant.nameAr && consultant.nameAr.toLowerCase().includes(searchLower)) ||
        (consultant.nameEn && consultant.nameEn.toLowerCase().includes(searchLower)) ||
        (consultant.nameFr && consultant.nameFr.toLowerCase().includes(searchLower)) ||
        (consultant.titleAr && consultant.titleAr.toLowerCase().includes(searchLower)) ||
        (consultant.specializationAr && consultant.specializationAr.toLowerCase().includes(searchLower)) ||
        (consultant.experienceAr && consultant.experienceAr.toLowerCase().includes(searchLower))
      );
    });
  }, [allConsultants, searchTerm]);

  // Table columns
  const columns = [
    {
      key: "name",
      label: "الاسم",
      sortable: true,
      render: (value, consultant) => (
        <div className="flex items-center">
          <Avatar
            src={consultant.imageUrl}
            alt={consultant.name}
            name={consultant.name}
            size="md"
            className="ml-3"
            fallbackBg="gradient"
          />

          <div>
            <div className="font-medium text-gray-900">{consultant.name}</div>
            <div className="text-sm text-gray-500">{consultant.title}</div>
          </div>
        </div>
      ),
    },
    {
      key: "specialization",
      label: "التخصص",
      sortable: true,
      render: (value, consultant) => consultant.specialization,
    },
    {
      key: "experience",
      label: "الخبرة",
      sortable: true,
      render: (value, consultant) => consultant.experience,
    },
    {
      key: "rating",
      label: "التقييم",
      sortable: true,
      render: (value, consultant) => (
        <div className="flex items-center">
          <FiStar className="text-yellow-400 ml-1" size={14} />
          <span className="text-sm font-medium">{consultant.rating}</span>
        </div>
      ),
    },
    {
      key: "consultations",
      label: "الاستشارات",
      sortable: true,
      render: (value, consultant) => consultant.consultations,
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (value, consultant) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${
            consultant.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
          onClick={() => handleToggleStatus(consultant.id)}
          title="انقر لتغيير الحالة"
        >
          {consultant.status === "active" ? "نشط" : "غير نشط"}
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
            disabled={isSubmitting}
            className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            title="عرض"
          >
            <FiEye size={16} />
          </button>
          <button
            onClick={() => handleEditConsultant(consultant)}
            disabled={isSubmitting}
            className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
            title="تعديل"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => handleDeleteConsultant(consultant.id)}
            disabled={isSubmitting}
            className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            title="حذف"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setIsImageLoading(true);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setIsImageLoading(false);
      };
      reader.onerror = () => {
        setIsImageLoading(false);
        toast.error("فشل في قراءة الصورة");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate required fields for all languages
    const requiredFields = [
      "nameAr",
      "nameEn",
      "nameFr",
      "titleAr",
      "titleEn",
      "titleFr",
      "specializationAr",
      "specializationEn",
      "specializationFr",
      "experienceAr",
      "experienceEn",
      "experienceFr",
    ];

    // Validate rating and consultations
    if (formData.rating < 0 || formData.rating > 5) {
      toast.error("التقييم يجب أن يكون بين 0 و 5");
      return;
    }

    if (formData.consultations < 0) {
      toast.error("عدد الاستشارات يجب أن يكون 0 أو أكثر");
      return;
    }

    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // Validate image for new consultants
    if (!isEditing && !imageFile) {
      toast.error("يرجى اختيار صورة للمستشار الجديد");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateConsultantMutation.mutateAsync({
          id: selectedConsultant.id,
          consultantData: formData,
          imageFile: imageFile || null,
        });
      } else {
        await createConsultantMutation.mutateAsync({
          consultantData: formData,
          imageFile,
        });
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit consultant
  const handleEditConsultant = async (consultant) => {
    if (isSubmitting) return;

    try {
      // Fetch consultant with all languages
      const response = await consultantService.getConsultantByIdAllLanguages(
        consultant.id
      );
      const consultantData = response.data;

      setSelectedConsultant(consultant);
      setFormData({
        nameAr: consultantData.ar.name,
        nameEn: consultantData.en.name,
        nameFr: consultantData.fr.name,
        titleAr: consultantData.ar.title,
        titleEn: consultantData.en.title,
        titleFr: consultantData.fr.title,
        specializationAr: consultantData.ar.specialization,
        specializationEn: consultantData.en.specialization,
        specializationFr: consultantData.fr.specialization,
        experienceAr: consultantData.ar.experience,
        experienceEn: consultantData.en.experience,
        experienceFr: consultantData.fr.experience,
        status: consultantData.status,
        rating: parseFloat(consultantData.rating) || 0.0,
        consultations: parseInt(consultantData.consultations) || 0,
      });
      setImagePreview(consultantData.imageUrl);
      setImageFile(null);
      setIsEditing(true);
      setShowAddForm(true);
    } catch {
      toast.error("فشل في تحميل بيانات المستشار للتعديل");
    }
  };

  // Handle delete consultant
  const handleDeleteConsultant = async (consultantId) => {
    if (isSubmitting) return;

    if (window.confirm("هل أنت متأكد من حذف هذا المستشار؟")) {
      await deleteConsultantMutation.mutateAsync(consultantId);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (consultantId) => {
    if (isSubmitting) return;
    await toggleStatusMutation.mutateAsync(consultantId);
  };

  // Handle view consultant
  const handleViewConsultant = (consultant) => {
    if (isSubmitting) return;
    setSelectedConsultant(consultant);
    showAlert(
      "info",
      "عرض المستشار",
      `عرض تفاصيل المستشار: ${consultant.name}`
    );
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedConsultant(null);
    setFormData({
      nameAr: "",
      nameEn: "",
      nameFr: "",
      titleAr: "",
      titleEn: "",
      titleFr: "",
      specializationAr: "",
      specializationEn: "",
      specializationFr: "",
      experienceAr: "",
      experienceEn: "",
      experienceFr: "",
      status: "active",
      rating: 0.0,
      consultations: 0,
    });
    setImageFile(null);
    setImagePreview("");
    setIsImageLoading(false);
    setIsSubmitting(false);
  };

  // Show alert
  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  // Close alert
  const closeAlert = () => {
    setAlert({ show: false, type: "info", title: "", message: "" });
  };

  // Loading state
  if (isLoadingConsultants) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
        <span className="mr-3 text-lg text-gray-600">
          جاري تحميل المستشارين...
        </span>
      </div>
    );
  }

  // Error state
  if (consultantsError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg mb-2">خطأ في تحميل البيانات</div>
        <div className="text-gray-600">{consultantsError.message}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              إدارة المستشارين
            </h2>
            <p className="text-sm text-gray-600">
              إجمالي المستشارين: {totalConsultants}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FiUserPlus className="ml-2" size={16} />
            إضافة مستشار جديد
          </button>
        </div>
      </div>

      {/* Statistics */}
      {!isLoadingStats && statsData && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {statsData.data.totalConsultants}
              </div>
              <div className="text-sm text-gray-600">إجمالي المستشارين</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statsData.data.activeConsultants}
              </div>
              <div className="text-sm text-gray-600">المستشارين النشطين</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {statsData.data.averageRating}
              </div>
              <div className="text-sm text-gray-600">متوسط التقييم</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {statsData.data.activePercentage}%
              </div>
              <div className="text-sm text-gray-600">نسبة النشاط</div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="البحث في المستشارين... (Ctrl+F)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
                title="البحث في المستشارين - استخدم Ctrl+F للوصول السريع"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="px-6 py-4">
        <DataTable
          data={consultants}
          columns={columns}
          pagination={{
            total: totalConsultants,
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
            onPageChange: (offset) => {
              const newPage = Math.floor(offset / itemsPerPage) + 1;
              setCurrentPage(newPage);
            }
          }}
          searchTerm={searchTerm}
          isLoading={isLoadingConsultants}
        />
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditing ? "تعديل المستشار" : "إضافة مستشار جديد"}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4">
              {/* Multi-language form fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Arabic Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">
                    البيانات بالعربية
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم
                    </label>
                    <input
                      type="text"
                      name="nameAr"
                      value={formData.nameAr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المسمى الوظيفي
                    </label>
                    <input
                      type="text"
                      name="titleAr"
                      value={formData.titleAr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التخصص
                    </label>
                    <input
                      type="text"
                      name="specializationAr"
                      value={formData.specializationAr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الخبرة
                    </label>
                    <input
                      type="text"
                      name="experienceAr"
                      value={formData.experienceAr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* English Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">
                    English Data
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="nameEn"
                      value={formData.nameEn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="titleEn"
                      value={formData.titleEn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specializationEn"
                      value={formData.specializationEn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experienceEn"
                      value={formData.experienceEn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* French Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">
                    Données en Français
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="nameFr"
                      value={formData.nameFr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre
                    </label>
                    <input
                      type="text"
                      name="titleFr"
                      value={formData.titleFr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Spécialisation
                    </label>
                    <input
                      type="text"
                      name="specializationFr"
                      value={formData.specializationFr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expérience
                    </label>
                    <input
                      type="text"
                      name="experienceFr"
                      value={formData.experienceFr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Common fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التقييم
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاستشارات
                  </label>
                  <input
                    type="number"
                    name="consultations"
                    value={formData.consultations}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الصورة
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!isEditing}
                  />
                  {isImageLoading && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center">
                      <FiLoader className="animate-spin ml-2" size={14} />
                      جاري معالجة الصورة...
                    </div>
                  )}
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Form actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin ml-2" size={16} />
                      جاري الإرسال...
                    </>
                  ) : isEditing ? (
                    "تحديث المستشار"
                  ) : (
                    "إضافة المستشار"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert */}
      {alert.show && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={closeAlert}
        />
      )}
    </div>
  );
};

export default ConsultantsManagement;
