import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiHelpCircle,
  FiFilter,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiAward,
  FiList,
  FiPlus,
} from "react-icons/fi";
import DataTable from "./DataTable";
import faqService from "../../services/faqService";
import categoryService from "../../services/categoryService";
import toast from "react-hot-toast";

const FAQManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form data for multi-language support
  const [formData, setFormData] = useState({
    questionAr: "",
    questionEn: "",
    questionFr: "",
    answerAr: "",
    answerEn: "",
    answerFr: "",
    category: "",
    order: 0,
    status: "active",
    featured: false,
  });

  // Keyboard shortcut for search (Ctrl+F or Cmd+F)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="البحث في الأسئلة"]'
        );
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, selectedCategory]);

  // Fetch FAQs with React Query - only filter by status and category, not search
  const {
    data: faqsData,
    isLoading: isLoadingFAQs,
    error: faqsError,
  } = useQuery({
    queryKey: ["faqs", selectedFilter, selectedCategory, currentPage, itemsPerPage],
    queryFn: () => {
      const offset = (currentPage - 1) * itemsPerPage;
      return faqService.getAllFAQs({
        status: selectedFilter === "all" ? undefined : selectedFilter,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        language: "ar",
        limit: itemsPerPage,
        offset: offset,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch FAQ statistics
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["faqStats"],
    queryFn: faqService.getFAQStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch FAQ categories
  const { data: categoriesData } = useQuery({
    queryKey: ["faqCategories"],
    queryFn: faqService.getFAQCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch categories for dropdown
  const { data: categoriesForDropdown } = useQuery({
    queryKey: ["categoriesForDropdown"],
    queryFn: categoryService.getAllCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create FAQ mutation
  const createFAQMutation = useMutation({
    mutationFn: faqService.createFAQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqStats"] });
      queryClient.invalidateQueries({ queryKey: ["faqCategories"] });
      toast.success("تم إضافة السؤال الجديد بنجاح");
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في إضافة السؤال");
    },
  });

  // Update FAQ mutation
  const updateFAQMutation = useMutation({
    mutationFn: ({ id, data }) => faqService.updateFAQ(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqStats"] });
      queryClient.invalidateQueries({ queryKey: ["faqCategories"] });
      toast.success("تم تحديث السؤال بنجاح");
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث السؤال");
    },
  });

  // Delete FAQ mutation
  const deleteFAQMutation = useMutation({
    mutationFn: faqService.deleteFAQ,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqStats"] });
      queryClient.invalidateQueries({ queryKey: ["faqCategories"] });
      toast.success("تم حذف السؤال بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حذف السؤال");
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: faqService.toggleFAQStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqStats"] });
      toast.success("تم تغيير حالة السؤال بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تغيير حالة السؤال");
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: faqService.toggleFAQFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqStats"] });
      toast.success("تم تغيير حالة التميز بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تغيير حالة التميز");
    },
  });

  // Extract FAQs from API response
  const allFAQs = faqsData?.data?.faqs || [];
  const totalFAQs = faqsData?.data?.total || 0;

  // Filter FAQs based on search term (client-side filtering)
  const faqs = React.useMemo(() => {
    if (!searchTerm.trim()) return allFAQs;

    const searchLower = searchTerm.toLowerCase().trim();

    return allFAQs.filter((faq) => {
      return (
        (faq.questionAr && faq.questionAr.toLowerCase().includes(searchLower)) ||
        (faq.questionEn && faq.questionEn.toLowerCase().includes(searchLower)) ||
        (faq.questionFr && faq.questionFr.toLowerCase().includes(searchLower)) ||
        (faq.answerAr && faq.answerAr.toLowerCase().includes(searchLower)) ||
        (faq.answerEn && faq.answerEn.toLowerCase().includes(searchLower)) ||
        (faq.answerFr && faq.answerFr.toLowerCase().includes(searchLower)) ||
        (faq.category && faq.category.toLowerCase().includes(searchLower))
      );
    });
  }, [allFAQs, searchTerm]);

  // Table columns
  const columns = [
    {
      key: "question",
      label: "السؤال",
      sortable: true,
      render: (value, faq) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 font-medium line-clamp-2">
            {faq.question}
          </p>
          <p className="text-xs text-gray-500 mt-1">الفئة: {faq.category}</p>
        </div>
      ),
    },
    {
      key: "answer",
      label: "الإجابة",
      sortable: false,
      render: (value, faq) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 line-clamp-3">{faq.answer}</p>
        </div>
      ),
    },
    {
      key: "order",
      label: "الترتيب",
      sortable: true,
      render: (value, faq) => (
        <span className="text-sm font-medium text-gray-900">{faq.order}</span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (value, faq) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${
            faq.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
          onClick={() => handleToggleStatus(faq.id)}
          title="انقر لتغيير الحالة"
        >
          {faq.status === "active" ? "نشط" : "غير نشط"}
        </span>
      ),
    },
    {
      key: "featured",
      label: "مميز",
      sortable: true,
      render: (value, faq) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${
            faq.featured
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => handleToggleFeatured(faq.id)}
          title="انقر لتغيير حالة التميز"
        >
          {faq.featured ? "مميز" : "عادي"}
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
      "questionAr",
      "questionEn",
      "questionFr",
      "answerAr",
      "answerEn",
      "answerFr",
    ];

    // Validate required fields
    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].trim() === ""
    );
    if (missingFields.length > 0) {
      const fieldNames = {
        questionAr: "السؤال (العربية)",
        questionEn: "السؤال (الإنجليزية)",
        questionFr: "السؤال (الفرنسية)",
        answerAr: "الإجابة (العربية)",
        answerEn: "الإجابة (الإنجليزية)",
        answerFr: "الإجابة (الفرنسية)",
      };
      const missingFieldNames = missingFields
        .map((field) => fieldNames[field])
        .join(", ");
      toast.error(`الحقول التالية مطلوبة: ${missingFieldNames}`);
      return;
    }

    // Validate category
    if (!formData.category || formData.category.trim() === "") {
      toast.error("يرجى اختيار الفئة");
      return;
    }

    // Validate field lengths
    const fieldValidations = [
      { field: "questionAr", min: 5, max: 1000, name: "السؤال (العربية)" },
      { field: "questionEn", min: 5, max: 1000, name: "السؤال (الإنجليزية)" },
      { field: "questionFr", min: 5, max: 1000, name: "السؤال (الفرنسية)" },
      { field: "answerAr", min: 10, max: 2000, name: "الإجابة (العربية)" },
      { field: "answerEn", min: 10, max: 2000, name: "الإجابة (الإنجليزية)" },
      { field: "answerFr", min: 10, max: 2000, name: "الإجابة (الفرنسية)" },
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

    try {
      if (isEditing) {
        await updateFAQMutation.mutateAsync({
          id: selectedFAQ.id,
          data: formData,
        });
      } else {
        await createFAQMutation.mutateAsync(formData);
      }
    } catch (error) {
    }
  };

  // Handle edit FAQ
  const handleEditFAQ = async (faq) => {
    try {
      // Fetch FAQ with all languages
      const response = await faqService.getFAQByIdAllLanguages(faq.id);
      const faqData = response.data;

      setSelectedFAQ(faq);
      setFormData({
        questionAr: faqData.ar.question,
        questionEn: faqData.en.question,
        questionFr: faqData.fr.question,
        answerAr: faqData.ar.answer,
        answerEn: faqData.en.answer,
        answerFr: faqData.fr.answer,
        category: faqData.category,
        order: faqData.order,
        status: faqData.status,
        featured: faqData.featured,
      });
      setIsEditing(true);
      setShowAddForm(true);
    } catch {
      toast.error("فشل في تحميل بيانات السؤال للتعديل");
    }
  };

  // Handle delete FAQ
  const handleDeleteFAQ = async (faqId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      await deleteFAQMutation.mutateAsync(faqId);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (faqId) => {
    await toggleStatusMutation.mutateAsync(faqId);
  };

  // Handle toggle featured
  const handleToggleFeatured = async (faqId) => {
    await toggleFeaturedMutation.mutateAsync(faqId);
  };

  // Handle view FAQ
  const handleViewFAQ = (faq) => {
    setSelectedFAQ(faq);
    toast.info(`عرض تفاصيل السؤال: ${faq.question}`, "عرض السؤال");
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedFAQ(null);
    setFormData({
      questionAr: "",
      questionEn: "",
      questionFr: "",
      answerAr: "",
      answerEn: "",
      answerFr: "",
      category: "",
      order: 0,
      status: "active",
      featured: false,
    });
  };

  // Loading state
  if (isLoadingFAQs) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
        <span className="mr-3 text-lg text-gray-600">
          جاري تحميل الأسئلة...
        </span>
      </div>
    );
  }

  // Error state
  if (faqsError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg mb-2">خطأ في تحميل البيانات</div>
        <div className="text-gray-600">{faqsError.message}</div>
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
              إدارة الأسئلة الشائعة
            </h2>
            <p className="text-sm text-gray-600">إجمالي الأسئلة: {totalFAQs}</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FiPlus className="ml-2" size={16} />
            إضافة سؤال جديد
          </button>
        </div>
      </div>

      {/* Statistics */}
      {!isLoadingStats && statsData && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {statsData.data.totalFAQs}
              </div>
              <div className="text-sm text-gray-600">إجمالي الأسئلة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statsData.data.activeFAQs}
              </div>
              <div className="text-sm text-gray-600">الأسئلة النشطة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {statsData.data.featuredFAQs}
              </div>
              <div className="text-sm text-gray-600">الأسئلة المميزة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {statsData.data.totalCategories}
              </div>
              <div className="text-sm text-gray-600">الفئات</div>
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
                placeholder="البحث في الأسئلة... (Ctrl+F)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
                title="البحث في الأسئلة - استخدم Ctrl+F للوصول السريع"
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
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الفئات</option>
              {categoriesData?.data?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="px-6 py-4">
        <DataTable
          data={faqs}
          columns={columns}
          pagination={{
            total: totalFAQs,
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
            onPageChange: (offset) => {
              const newPage = Math.floor(offset / itemsPerPage) + 1;
              setCurrentPage(newPage);
            }
          }}
          searchTerm={searchTerm}
          isLoading={isLoadingFAQs}
        />
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditing ? "تعديل السؤال" : "إضافة سؤال جديد"}
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
                        <li>السؤال: 5-1000 حرف</li>
                        <li>الإجابة: 10-2000 حرف</li>
                        <li>الفئة: مطلوبة</li>
                        <li>الترتيب: رقم موجب</li>
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
                      السؤال <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="questionAr"
                      value={formData.questionAr}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      يجب أن يكون السؤال بين 5 و 1000 حرف
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الإجابة <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="answerAr"
                      value={formData.answerAr}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={10}
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      يجب أن تكون الإجابة بين 10 و 2000 حرف
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
                      Question <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="questionEn"
                      value={formData.questionEn}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Question must be between 5 and 1000 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Answer <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="answerEn"
                      value={formData.answerEn}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={10}
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Answer must be between 10 and 2000 characters
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
                      Question <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="questionFr"
                      value={formData.questionFr}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={5}
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      La question doit contenir entre 5 et 1000 caractères
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Réponse <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="answerFr"
                      value={formData.answerFr}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={10}
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      La réponse doit contenir entre 10 et 2000 caractères
                    </p>
                  </div>
                </div>
              </div>

              {/* Common fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الفئة <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر الفئة</option>
                    {categoriesForDropdown?.data?.categories?.map(
                      (category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      )
                    ) || (
                      <>
                        <option value="general">عام</option>
                        <option value="services">الخدمات</option>
                        <option value="company-formation">تأسيس الشركات</option>
                        <option value="legal-auditing">التدقيق القانوني</option>
                        <option value="training">التدريب</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                    createFAQMutation.isPending || updateFAQMutation.isPending
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                >
                  {createFAQMutation.isPending ||
                  updateFAQMutation.isPending ? (
                    <>
                      <FiLoader className="animate-spin ml-2" size={16} />
                      جاري الإرسال...
                    </>
                  ) : isEditing ? (
                    "تحديث السؤال"
                  ) : (
                    "إضافة السؤال"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;
