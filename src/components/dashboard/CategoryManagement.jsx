import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiFilter,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiList,
  FiPlus,
  FiTag,
  FiHash,
  FiAlertTriangle,
} from "react-icons/fi";
import DataTable from "./DataTable";
import categoryService from "../../services/categoryService";
import toast from "react-hot-toast";

const CategoryManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form data for multi-language support
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    nameFr: "",
    descriptionAr: "",
    descriptionEn: "",
    descriptionFr: "",
    slug: "",
    order: 0,
    status: "active",
    icon: "",
    color: "#3B82F6",
  });

  // Keyboard shortcut for search (Ctrl+F or Cmd+F)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="البحث في الفئات"]'
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

  // Fetch categories with React Query - only filter by status, not search
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories", selectedFilter, currentPage, itemsPerPage],
    queryFn: () => {
      const offset = (currentPage - 1) * itemsPerPage;
      return categoryService.getAllCategories({
        status: selectedFilter === "all" ? undefined : selectedFilter,
        language: "ar",
        limit: itemsPerPage,
        offset: offset,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch category statistics
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["categoryStats"],
    queryFn: categoryService.getCategoryStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryStats"] });
      toast.success("تم إضافة الفئة الجديدة بنجاح");
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في إضافة الفئة");
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryStats"] });
      toast.success("تم تحديث الفئة بنجاح");
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث الفئة");
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryStats"] });
      toast.success("تم حذف الفئة بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حذف الفئة");
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: categoryService.toggleCategoryStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryStats"] });
      toast.success("تم تغيير حالة الفئة بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تغيير حالة الفئة");
    },
  });

  // Extract categories from API response
  const allCategories = categoriesData?.data?.categories || [];
  const totalCategories = categoriesData?.data?.total || 0;

  // Filter categories based on search term (client-side filtering)
  const categories = React.useMemo(() => {
    if (!searchTerm.trim()) return allCategories;

    const searchLower = searchTerm.toLowerCase().trim();

    return allCategories.filter((category) => {
      return (
        (category.nameAr &&
          category.nameAr.toLowerCase().includes(searchLower)) ||
        (category.nameEn &&
          category.nameEn.toLowerCase().includes(searchLower)) ||
        (category.nameFr &&
          category.nameFr.toLowerCase().includes(searchLower)) ||
        (category.descriptionAr &&
          category.descriptionAr.toLowerCase().includes(searchLower)) ||
        (category.slug && category.slug.toLowerCase().includes(searchLower))
      );
    });
  }, [allCategories, searchTerm]);

  // Table columns
  const columns = [
    {
      key: "name",
      label: "اسم الفئة",
      sortable: true,
      render: (value, category) => (
        <div className="flex items-center space-x-3 space-x-reverse">
          {category.icon && (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: category.color || "#3B82F6" }}
            >
              <FiTag />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">{category.name}</p>
            <p className="text-xs text-gray-500">Slug: {category.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "الوصف",
      sortable: false,
      render: (value, category) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 line-clamp-2">
            {category.description || "لا يوجد وصف"}
          </p>
        </div>
      ),
    },
    {
      key: "order",
      label: "الترتيب",
      sortable: true,
      render: (value, category) => (
        <span className="text-sm font-medium text-gray-900">
          {category.order}
        </span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (value, category) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            category.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {category.status === "active" ? (
            <>
              <FiCheckCircle className="w-3 h-3 mr-1" />
              نشط
            </>
          ) : (
            <>
              <FiXCircle className="w-3 h-3 mr-1" />
              غير نشط
            </>
          )}
        </span>
      ),
    },
    {
      key: "actions",
      label: "الإجراءات",
      sortable: false,
      render: (value, category) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => handleEdit(category)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="تعديل"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(category.id)}
            className={`transition-colors ${
              category.status === "active"
                ? "text-orange-600 hover:text-orange-900"
                : "text-green-600 hover:text-green-900"
            }`}
            title={category.status === "active" ? "إلغاء التفعيل" : "تفعيل"}
          >
            {category.status === "active" ? (
              <FiXCircle className="w-4 h-4" />
            ) : (
              <FiCheckCircle className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => handleDelete(category.id)}
            className="text-red-600 hover:text-red-900 transition-colors"
            title="حذف"
          >
            <FiTrash2 className="w-4 h-4" />
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

    // Validate required fields
    if (!formData.nameAr || !formData.nameEn || !formData.nameFr) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      if (isEditing) {
        await updateCategoryMutation.mutateAsync({
          id: selectedCategory.id,
          data: formData,
        });
      } else {
        await createCategoryMutation.mutateAsync(formData);
      }
    } catch (error) {
    }
  };

  // Handle edit
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      nameAr: category.ar?.name || "",
      nameEn: category.en?.name || "",
      nameFr: category.fr?.name || "",
      descriptionAr: category.ar?.description || "",
      descriptionEn: category.en?.description || "",
      descriptionFr: category.fr?.description || "",
      slug: category.slug || "",
      order: category.order || 0,
      status: category.status || "active",
      icon: category.icon || "",
      color: category.color || "#3B82F6",
    });
    setIsEditing(true);
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    deleteCategoryMutation.mutate(categoryToDelete);
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  // Handle toggle status
  const handleToggleStatus = (id) => {
    toggleStatusMutation.mutate(id);
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedCategory(null);
    setFormData({
      nameAr: "",
      nameEn: "",
      nameFr: "",
      descriptionAr: "",
      descriptionEn: "",
      descriptionFr: "",
      slug: "",
      order: 0,
      status: "active",
      icon: "",
      color: "#3B82F6",
    });
  };

  // Handle add new
  const handleAddNew = () => {
    setIsEditing(false);
    setSelectedCategory(null);
    setFormData({
      nameAr: "",
      nameEn: "",
      nameFr: "",
      descriptionAr: "",
      descriptionEn: "",
      descriptionFr: "",
      slug: "",
      order: 0,
      status: "active",
      icon: "",
      color: "#3B82F6",
    });
    setShowAddForm(true);
  };

  if (isLoadingCategories || isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg mb-2">خطأ في تحميل البيانات</div>
        <div className="text-gray-600">{categoriesError.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة الفئات</h2>
          <p className="text-sm text-gray-600">
            إجمالي الفئات: {totalCategories}
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 space-x-reverse"
        >
          <FiPlus className="w-4 h-4" />
          <span>إضافة فئة جديدة</span>
        </button>
      </div>

      {/* Statistics */}
      {statsData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiList className="w-8 h-8 text-blue-600" />
              <div className="mr-3">
                <p className="text-sm text-gray-600">إجمالي الفئات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.totalCategories}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
              <div className="mr-3">
                <p className="text-sm text-gray-600">الفئات النشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.activeCategories}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiXCircle className="w-8 h-8 text-red-600" />
              <div className="mr-3">
                <p className="text-sm text-gray-600">الفئات غير النشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.inactiveCategories}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الفئات... (Ctrl+F)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
                title="البحث في الفئات - استخدم Ctrl+F للوصول السريع"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <FiFilter className="text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={categories}
        columns={columns}
        pagination={{
          total: totalCategories,
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
          onPageChange: (offset) => {
            const newPage = Math.floor(offset / itemsPerPage) + 1;
            setCurrentPage(newPage);
          }
        }}
        searchTerm={searchTerm}
        isLoading={isLoadingCategories}
      />

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isEditing ? "تعديل الفئة" : "إضافة فئة جديدة"}
              </h3>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Multi-language Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Arabic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم (عربي) *
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    value={formData.nameAr}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* English */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم (إنجليزي) *
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* French */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم (فرنسي) *
                  </label>
                  <input
                    type="text"
                    name="nameFr"
                    value={formData.nameFr}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف (عربي)
                  </label>
                  <textarea
                    name="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف (إنجليزي)
                  </label>
                  <textarea
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف (فرنسي)
                  </label>
                  <textarea
                    name="descriptionFr"
                    value={formData.descriptionFr}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Other Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرابط المختصر
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="سيتم إنشاؤه تلقائياً"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الأيقونة
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="help-circle"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اللون
                </label>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 space-x-reverse">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={
                    createCategoryMutation.isPending ||
                    updateCategoryMutation.isPending
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                >
                  {createCategoryMutation.isPending ||
                  updateCategoryMutation.isPending ? (
                    <FiLoader className="animate-spin w-4 h-4 ml-2" />
                  ) : null}
                  {isEditing ? "تحديث" : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <FiAlertTriangle className="text-yellow-600 w-6 h-6 ml-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                تأكيد الحذف
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex justify-end space-x-3 space-x-reverse">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteCategoryMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
              >
                {deleteCategoryMutation.isPending ? (
                  <FiLoader className="animate-spin w-4 h-4 ml-2" />
                ) : null}
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
