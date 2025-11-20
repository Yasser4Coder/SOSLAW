import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiMessageSquare,
  FiStar,
  FiFilter,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiAward,
  FiUser,
} from "react-icons/fi";
import DataTable from "./DataTable";
import CustomAlert from "./CustomAlert";
import testimonialService from "../../services/testimonialService";
import toast from "react-hot-toast";
import Avatar from "../common/Avatar";

const TestimonialsManagement = () => {
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
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form data for multi-language support
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    nameFr: "",
    roleAr: "",
    roleEn: "",
    roleFr: "",
    companyAr: "",
    companyEn: "",
    companyFr: "",
    reviewAr: "",
    reviewEn: "",
    reviewFr: "",
    rating: 5,
    avatar: "",
    verified: true,
    featured: false,
    status: "active",
  });

  // Keyboard shortcut for search (Ctrl+F or Cmd+F)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="البحث في التوصيات"]'
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

  // Fetch testimonials with React Query - only filter by status, not search
  const {
    data: testimonialsData,
    isLoading: isLoadingTestimonials,
    error: testimonialsError,
  } = useQuery({
    queryKey: ["testimonials", selectedFilter, currentPage, itemsPerPage],
    queryFn: () => {
      const offset = (currentPage - 1) * itemsPerPage;
      return testimonialService.getAllTestimonials({
        status: selectedFilter === "all" ? undefined : selectedFilter,
        language: "ar",
        limit: itemsPerPage,
        offset: offset,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch testimonial statistics
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["testimonialStats"],
    queryFn: testimonialService.getTestimonialStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create testimonial mutation
  const createTestimonialMutation = useMutation({
    mutationFn: testimonialService.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonialStats"] });
      toast.success("تم إضافة التوصية الجديدة بنجاح");
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في إضافة التوصية");
    },
  });

  // Update testimonial mutation
  const updateTestimonialMutation = useMutation({
    mutationFn: ({ id, data }) =>
      testimonialService.updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonialStats"] });
      toast.success("تم تحديث التوصية بنجاح");
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث التوصية");
    },
  });

  // Delete testimonial mutation
  const deleteTestimonialMutation = useMutation({
    mutationFn: testimonialService.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonialStats"] });
      toast.success("تم حذف التوصية بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حذف التوصية");
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: testimonialService.toggleTestimonialStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonialStats"] });
      toast.success("تم تغيير حالة التوصية بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تغيير حالة التوصية");
    },
  });

  // Toggle verification mutation
  const toggleVerificationMutation = useMutation({
    mutationFn: testimonialService.toggleTestimonialVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonialStats"] });
      toast.success("تم تغيير حالة التحقق بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تغيير حالة التحقق");
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: testimonialService.toggleTestimonialFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonialStats"] });
      toast.success("تم تغيير حالة التميز بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تغيير حالة التميز");
    },
  });

  // Extract testimonials from API response
  const allTestimonials = testimonialsData?.data?.testimonials || [];
  const totalTestimonials = testimonialsData?.data?.total || 0;

  // Filter testimonials based on search term (client-side filtering)
  const testimonials = React.useMemo(() => {
    if (!searchTerm.trim()) return allTestimonials;

    const searchLower = searchTerm.toLowerCase().trim();

    return allTestimonials.filter((testimonial) => {
      return (
        (testimonial.nameAr &&
          testimonial.nameAr.toLowerCase().includes(searchLower)) ||
        (testimonial.nameEn &&
          testimonial.nameEn.toLowerCase().includes(searchLower)) ||
        (testimonial.nameFr &&
          testimonial.nameFr.toLowerCase().includes(searchLower)) ||
        (testimonial.contentAr &&
          testimonial.contentAr.toLowerCase().includes(searchLower)) ||
        (testimonial.contentEn &&
          testimonial.contentEn.toLowerCase().includes(searchLower)) ||
        (testimonial.contentFr &&
          testimonial.contentFr.toLowerCase().includes(searchLower)) ||
        (testimonial.positionAr &&
          testimonial.positionAr.toLowerCase().includes(searchLower)) ||
        (testimonial.positionEn &&
          testimonial.positionEn.toLowerCase().includes(searchLower)) ||
        (testimonial.positionFr &&
          testimonial.positionFr.toLowerCase().includes(searchLower))
      );
    });
  }, [allTestimonials, searchTerm]);

  // Table columns
  const columns = [
    {
      key: "name",
      label: "الاسم",
      sortable: true,
      render: (value, testimonial) => (
        <div className="flex items-center">
          <Avatar
            src={testimonial.avatar}
            alt={testimonial.name}
            name={testimonial.name}
            size="md"
            className="ml-3"
            fallbackBg="gradient"
          />
          <div>
            <div className="font-medium text-gray-900">{testimonial.name}</div>
            <div className="text-sm text-gray-500">{testimonial.role}</div>
            <div className="text-xs text-blue-600">{testimonial.company}</div>
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      label: "التقييم",
      sortable: true,
      render: (value, testimonial) => (
        <div className="flex items-center">
          <div className="flex items-center">
            {Array.from({ length: 5 }, (_, index) => (
              <FiStar
                key={index}
                className={`w-4 h-4 ${
                  index < testimonial.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium mr-2">{testimonial.rating}</span>
        </div>
      ),
    },
    {
      key: "review",
      label: "التوصية",
      sortable: false,
      render: (value, testimonial) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 line-clamp-2">
            "{testimonial.review}"
          </p>
        </div>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (value, testimonial) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${
            testimonial.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
          onClick={() => handleToggleStatus(testimonial.id)}
          title="انقر لتغيير الحالة"
        >
          {testimonial.status === "active" ? "نشط" : "غير نشط"}
        </span>
      ),
    },
    {
      key: "verified",
      label: "التحقق",
      sortable: true,
      render: (value, testimonial) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${
            testimonial.verified
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => handleToggleVerification(testimonial.id)}
          title="انقر لتغيير حالة التحقق"
        >
          {testimonial.verified ? "محقق" : "غير محقق"}
        </span>
      ),
    },
    {
      key: "featured",
      label: "مميز",
      sortable: true,
      render: (value, testimonial) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${
            testimonial.featured
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => handleToggleFeatured(testimonial.id)}
          title="انقر لتغيير حالة التميز"
        >
          {testimonial.featured ? "مميز" : "عادي"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "الإجراءات",
      sortable: false,
      render: (_, testimonial) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => handleViewTestimonial(testimonial)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="عرض"
          >
            <FiEye size={16} />
          </button>
          <button
            onClick={() => handleEditTestimonial(testimonial)}
            className="p-1 text-green-600 hover:text-green-800"
            title="تعديل"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => handleDeleteTestimonial(testimonial.id)}
            className="p-1 text-red-600 hover:text-red-800"
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields for all languages
    const requiredFields = [
      "nameAr",
      "nameEn",
      "nameFr",
      "roleAr",
      "roleEn",
      "roleFr",
      "companyAr",
      "companyEn",
      "companyFr",
      "reviewAr",
      "reviewEn",
      "reviewFr",
    ];

    // Validate required fields
    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].trim() === ""
    );
    if (missingFields.length > 0) {
      const fieldNames = {
        nameAr: "الاسم (العربية)",
        nameEn: "الاسم (الإنجليزية)",
        nameFr: "الاسم (الفرنسية)",
        roleAr: "المسمى الوظيفي (العربية)",
        roleEn: "المسمى الوظيفي (الإنجليزية)",
        roleFr: "المسمى الوظيفي (الفرنسية)",
        companyAr: "الشركة (العربية)",
        companyEn: "الشركة (الإنجليزية)",
        companyFr: "الشركة (الفرنسية)",
        reviewAr: "التوصية (العربية)",
        reviewEn: "التوصية (الإنجليزية)",
        reviewFr: "التوصية (الفرنسية)",
      };
      const missingFieldNames = missingFields
        .map((field) => fieldNames[field])
        .join(", ");
      toast.error(`الحقول التالية مطلوبة: ${missingFieldNames}`);
      return;
    }

    // Validate field lengths
    const fieldValidations = [
      { field: "nameAr", min: 2, max: 100, name: "الاسم (العربية)" },
      { field: "nameEn", min: 2, max: 100, name: "الاسم (الإنجليزية)" },
      { field: "nameFr", min: 2, max: 100, name: "الاسم (الفرنسية)" },
      { field: "roleAr", min: 2, max: 100, name: "المسمى الوظيفي (العربية)" },
      {
        field: "roleEn",
        min: 2,
        max: 100,
        name: "المسمى الوظيفي (الإنجليزية)",
      },
      { field: "roleFr", min: 2, max: 100, name: "المسمى الوظيفي (الفرنسية)" },
      { field: "companyAr", min: 2, max: 100, name: "الشركة (العربية)" },
      { field: "companyEn", min: 2, max: 100, name: "الشركة (الإنجليزية)" },
      { field: "companyFr", min: 2, max: 100, name: "الشركة (الفرنسية)" },
      { field: "reviewAr", min: 10, max: 1000, name: "التوصية (العربية)" },
      { field: "reviewEn", min: 10, max: 1000, name: "التوصية (الإنجليزية)" },
      { field: "reviewFr", min: 10, max: 1000, name: "التوصية (الفرنسية)" },
    ];

    for (const validation of fieldValidations) {
      const value = formData[validation.field];
      if (value.length < validation.min || value.length > validation.max) {
        toast.error(
          `${validation.name} يجب أن يكون بين ${validation.min} و ${validation.max} حرف`
        );
        return;
      }
    }

    // Validate avatar URL if provided
    if (formData.avatar && formData.avatar.trim() !== "") {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(formData.avatar)) {
        toast.error("رابط الصورة يجب أن يبدأ بـ http:// أو https://");
        return;
      }
    }

    // Validate rating
    if (formData.rating < 1 || formData.rating > 5) {
      toast.error("التقييم يجب أن يكون بين 1 و 5");
      return;
    }

    try {
      if (isEditing) {
        await updateTestimonialMutation.mutateAsync({
          id: selectedTestimonial.id,
          data: formData,
        });
      } else {
        await createTestimonialMutation.mutateAsync(formData);
      }
    } catch (error) {
    }
  };

  // Handle edit testimonial
  const handleEditTestimonial = async (testimonial) => {
    try {
      // Fetch testimonial with all languages
      const response = await testimonialService.getTestimonialByIdAllLanguages(
        testimonial.id
      );
      const testimonialData = response.data;

      setSelectedTestimonial(testimonial);
      setFormData({
        nameAr: testimonialData.ar.name,
        nameEn: testimonialData.en.name,
        nameFr: testimonialData.fr.name,
        roleAr: testimonialData.ar.role,
        roleEn: testimonialData.en.role,
        roleFr: testimonialData.fr.role,
        companyAr: testimonialData.ar.company,
        companyEn: testimonialData.en.company,
        companyFr: testimonialData.fr.company,
        reviewAr: testimonialData.ar.review,
        reviewEn: testimonialData.en.review,
        reviewFr: testimonialData.fr.review,
        rating: testimonialData.rating,
        avatar: testimonialData.avatar || "",
        verified: testimonialData.verified,
        featured: testimonialData.featured,
        status: testimonialData.status,
      });
      setIsEditing(true);
      setShowAddForm(true);
    } catch {
      toast.error("فشل في تحميل بيانات التوصية للتعديل");
    }
  };

  // Handle delete testimonial
  const handleDeleteTestimonial = async (testimonialId) => {
    if (window.confirm("هل أنت متأكد من حذف هذه التوصية؟")) {
      await deleteTestimonialMutation.mutateAsync(testimonialId);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (testimonialId) => {
    await toggleStatusMutation.mutateAsync(testimonialId);
  };

  // Handle toggle verification
  const handleToggleVerification = async (testimonialId) => {
    await toggleVerificationMutation.mutateAsync(testimonialId);
  };

  // Handle toggle featured
  const handleToggleFeatured = async (testimonialId) => {
    await toggleFeaturedMutation.mutateAsync(testimonialId);
  };

  // Handle view testimonial
  const handleViewTestimonial = (testimonial) => {
    setSelectedTestimonial(testimonial);
    showAlert("info", "عرض التوصية", `عرض تفاصيل التوصية: ${testimonial.name}`);
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedTestimonial(null);
    setFormData({
      nameAr: "",
      nameEn: "",
      nameFr: "",
      roleAr: "",
      roleEn: "",
      roleFr: "",
      companyAr: "",
      companyEn: "",
      companyFr: "",
      reviewAr: "",
      reviewEn: "",
      reviewFr: "",
      rating: 5,
      avatar: "",
      verified: true,
      featured: false,
      status: "active",
    });
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
  if (isLoadingTestimonials) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
        <span className="mr-3 text-lg text-gray-600">
          جاري تحميل التوصيات...
        </span>
      </div>
    );
  }

  // Error state
  if (testimonialsError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg mb-2">خطأ في تحميل البيانات</div>
        <div className="text-gray-600">{testimonialsError.message}</div>
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
              إدارة التوصيات
            </h2>
            <p className="text-sm text-gray-600">
              إجمالي التوصيات: {totalTestimonials}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FiMessageSquare className="ml-2" size={16} />
            إضافة توصية جديدة
          </button>
        </div>
      </div>

      {/* Statistics */}
      {!isLoadingStats && statsData && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {statsData.data.totalTestimonials}
              </div>
              <div className="text-sm text-gray-600">إجمالي التوصيات</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statsData.data.activeTestimonials}
              </div>
              <div className="text-sm text-gray-600">التوصيات النشطة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {statsData.data.averageRating}
              </div>
              <div className="text-sm text-gray-600">متوسط التقييم</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {statsData.data.featuredTestimonials}
              </div>
              <div className="text-sm text-gray-600">التوصيات المميزة</div>
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
                placeholder="البحث في التوصيات... (Ctrl+F)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
                title="البحث في التوصيات - استخدم Ctrl+F للوصول السريع"
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
          data={testimonials}
          columns={columns}
          pagination={{
            total: totalTestimonials,
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
            onPageChange: (offset) => {
              const newPage = Math.floor(offset / itemsPerPage) + 1;
              setCurrentPage(newPage);
            }
          }}
          searchTerm={searchTerm}
          isLoading={isLoadingTestimonials}
        />
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditing ? "تعديل التوصية" : "إضافة توصية جديدة"}
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
              {/* Validation notice */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="mr-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      متطلبات التحقق
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          الحقول المطلوبة محددة بعلامة{" "}
                          <span className="text-red-500">*</span>
                        </li>
                        <li>الاسم والمسمى الوظيفي والشركة: 2-100 حرف</li>
                        <li>التوصية: 10-1000 حرف</li>
                        <li>
                          رابط الصورة اختياري ويجب أن يبدأ بـ http:// أو
                          https://
                        </li>
                        <li>التقييم: من 1 إلى 5 نجوم</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-language form fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Arabic Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">
                    البيانات بالعربية
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nameAr"
                      value={formData.nameAr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      يجب أن يكون الاسم بين 2 و 100 حرف
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المسمى الوظيفي <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="roleAr"
                      value={formData.roleAr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      يجب أن يكون المسمى الوظيفي بين 2 و 100 حرف
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الشركة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyAr"
                      value={formData.companyAr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      يجب أن يكون اسم الشركة بين 2 و 100 حرف
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      التوصية <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="reviewAr"
                      value={formData.reviewAr}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={10}
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      يجب أن تكون التوصية بين 10 و 1000 حرف
                    </p>
                  </div>
                </div>

                {/* English Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">
                    English Data
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nameEn"
                      value={formData.nameEn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Name must be between 2 and 100 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="roleEn"
                      value={formData.roleEn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Role must be between 2 and 100 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyEn"
                      value={formData.companyEn}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Company name must be between 2 and 100 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="reviewEn"
                      value={formData.reviewEn}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={10}
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Review must be between 10 and 1000 characters
                    </p>
                  </div>
                </div>

                {/* French Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">
                    Données en Français
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nameFr"
                      value={formData.nameFr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Le nom doit contenir entre 2 et 100 caractères
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="roleFr"
                      value={formData.roleFr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Le rôle doit contenir entre 2 et 100 caractères
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entreprise <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyFr"
                      value={formData.companyFr}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Le nom de l'entreprise doit contenir entre 2 et 100
                      caractères
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avis <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="reviewFr"
                      value={formData.reviewFr}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={10}
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      L'avis doit contenir entre 10 et 1000 caractères
                    </p>
                  </div>
                </div>
              </div>

              {/* Common fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    التقييم
                  </label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>5 نجوم</option>
                    <option value={4}>4 نجوم</option>
                    <option value={3}>3 نجوم</option>
                    <option value={2}>2 نجوم</option>
                    <option value={1}>1 نجمة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رابط الصورة{" "}
                    <span className="text-gray-500 text-xs">(اختياري)</span>
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    اترك هذا الحقل فارغاً إذا كنت لا تريد إضافة صورة، أو أدخل
                    رابط صورة صحيح يبدأ بـ http:// أو https://
                  </p>
                </div>

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

                <div className="flex items-center space-x-4 space-x-reverse">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="verified"
                      checked={formData.verified}
                      onChange={handleInputChange}
                      className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      محقق
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      مميز
                    </span>
                  </label>
                </div>
              </div>

              {/* Form actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={
                    createTestimonialMutation.isPending ||
                    updateTestimonialMutation.isPending
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                >
                  {createTestimonialMutation.isPending ||
                  updateTestimonialMutation.isPending ? (
                    <>
                      <FiLoader className="animate-spin ml-2" size={16} />
                      جاري الإرسال...
                    </>
                  ) : isEditing ? (
                    "تحديث التوصية"
                  ) : (
                    "إضافة التوصية"
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

export default TestimonialsManagement;
