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
  FiAward,
} from "react-icons/fi";
import DataTable from "./DataTable";
import roleService from "../../services/roleService";
import toast from "react-hot-toast";

const RoleManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingRole, setViewingRole] = useState(null);

  // Form data for multi-language support
  const [formData, setFormData] = useState({
    titleAr: "",
    titleEn: "",
    titleFr: "",
    descriptionAr: "",
    descriptionEn: "",
    descriptionFr: "",
    requirementsAr: [],
    requirementsEn: [],
    requirementsFr: [],
    responsibilitiesAr: [],
    responsibilitiesEn: [],
    responsibilitiesFr: [],
    benefitsAr: [],
    benefitsEn: [],
    benefitsFr: [],
    skillsAr: [],
    skillsEn: [],
    skillsFr: [],
    icon: "📋",
    category: "administrative",
    experience: "Not specified",
    location: "Remote",
    type: "full-time",
    salary: "Competitive",
    slug: "",
    order: 0,
    status: "active",
  });

  // Keyboard shortcut for search (Ctrl+F or Cmd+F)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="البحث في الأدوار"]'
        );
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch roles with React Query - only filter by status, not search
  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useQuery({
    queryKey: ["roles", selectedFilter],
    queryFn: () => {
      return roleService.getAllRoles({
        status: selectedFilter,
        language: "ar",
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch role statistics
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["roleStats"],
    queryFn: roleService.getRoleStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: roleService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roleStats"] });
      toast.success("تم إضافة الدور الجديد بنجاح");
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في إضافة الدور");
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }) => roleService.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roleStats"] });
      toast.success("تم تحديث الدور بنجاح");
      handleCloseForm();
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث الدور");
    },
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: roleService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roleStats"] });
      toast.success("تم حذف الدور بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في حذف الدور");
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: roleService.toggleRoleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roleStats"] });
      toast.success("تم تغيير حالة الدور بنجاح");
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تغيير حالة الدور");
    },
  });

  // Extract roles from API response
  // Protected endpoint structure: { data: { success: true, message: "...", data: { roles: [...], total: number } } }
  const allRoles = rolesData?.data?.data?.roles || [];
  const totalRoles = rolesData?.data?.data?.total || 0;

  // Filter roles based on search term (client-side filtering)
  const roles = React.useMemo(() => {
    if (!searchTerm.trim()) return allRoles;

    const searchLower = searchTerm.toLowerCase().trim();

    return allRoles.filter((role) => {
      return (
        (role.titleAr && role.titleAr.toLowerCase().includes(searchLower)) ||
        (role.titleEn && role.titleEn.toLowerCase().includes(searchLower)) ||
        (role.titleFr && role.titleFr.toLowerCase().includes(searchLower)) ||
        (role.descriptionAr && role.descriptionAr.toLowerCase().includes(searchLower)) ||
        (role.descriptionEn && role.descriptionEn.toLowerCase().includes(searchLower)) ||
        (role.descriptionFr && role.descriptionFr.toLowerCase().includes(searchLower)) ||
        (role.slug && role.slug.toLowerCase().includes(searchLower))
      );
    });
  }, [allRoles, searchTerm]);

  // Table columns
  const columns = [
    {
      key: "title",
      label: "اسم الدور",
      sortable: true,
      render: (value, role) => (
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="text-2xl">{role.icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-900">{role.title}</p>
            <p className="text-xs text-gray-500">Slug: {role.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "الوصف",
      sortable: false,
      render: (value, role) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 line-clamp-2">
            {role.description || "لا يوجد وصف"}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      label: "الفئة",
      sortable: true,
      render: (value, role) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {role.category === "administrative" && "إداري"}
          {role.category === "content" && "محتوى"}
          {role.category === "legal" && "قانوني"}
          {role.category === "training" && "تدريب"}
        </span>
      ),
    },
    {
      key: "experience",
      label: "الخبرة",
      sortable: true,
      render: (value, role) => (
        <span className="text-sm font-medium text-gray-900">
          {role.experience}
        </span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (value, role) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            role.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {role.status === "active" ? (
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
      render: (value, role) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => handleView(role)}
            className="text-green-600 hover:text-green-900 transition-colors"
            title="عرض التفاصيل"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(role)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
            title="تعديل"
          >
            <FiEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(role.id)}
            className={`transition-colors ${
              role.status === "active"
                ? "text-orange-600 hover:text-orange-900"
                : "text-green-600 hover:text-green-900"
            }`}
            title={role.status === "active" ? "إلغاء التفعيل" : "تفعيل"}
          >
            {role.status === "active" ? (
              <FiXCircle className="w-4 h-4" />
            ) : (
              <FiCheckCircle className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => handleDelete(role.id)}
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
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Auto-generate slug when English title changes
      if (name === "titleEn" && !isEditing) {
        const slug = value
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
        newData.slug = slug;
      }

      return newData;
    });
  };

  // Handle array field changes (requirements, responsibilities, benefits, skills)
  const handleArrayFieldChange = (field, language, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [`${field}${language.charAt(0).toUpperCase() + language.slice(1)}`]: [
        ...prev[
          `${field}${language.charAt(0).toUpperCase() + language.slice(1)}`
        ].slice(0, index),
        value,
        ...prev[
          `${field}${language.charAt(0).toUpperCase() + language.slice(1)}`
        ].slice(index + 1),
      ],
    }));
  };

  // Add new item to array field
  const addArrayItem = (field, language) => {
    setFormData((prev) => ({
      ...prev,
      [`${field}${language.charAt(0).toUpperCase() + language.slice(1)}`]: [
        ...prev[
          `${field}${language.charAt(0).toUpperCase() + language.slice(1)}`
        ],
        "",
      ],
    }));
  };

  // Remove item from array field
  const removeArrayItem = (field, language, index) => {
    setFormData((prev) => ({
      ...prev,
      [`${field}${language.charAt(0).toUpperCase() + language.slice(1)}`]: prev[
        `${field}${language.charAt(0).toUpperCase() + language.slice(1)}`
      ].filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.titleAr || !formData.titleEn || !formData.titleFr) {
      toast.error("يرجى ملء العنوان في جميع اللغات");
      return;
    }

    if (
      !formData.descriptionAr ||
      !formData.descriptionEn ||
      !formData.descriptionFr
    ) {
      toast.error("يرجى ملء الوصف في جميع اللغات");
      return;
    }

    // Generate slug if not provided
    let finalFormData = { ...formData };
    if (!finalFormData.slug) {
      finalFormData.slug = finalFormData.titleEn
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    }

    try {
      if (isEditing) {
        await updateRoleMutation.mutateAsync({
          id: selectedRole.id,
          data: finalFormData,
        });
      } else {
        await createRoleMutation.mutateAsync(finalFormData);
      }
    } catch {
      // Error is handled by mutation onError
    }
  };

  // Handle edit
  const handleEdit = async (role) => {
    try {
      // Use the role data directly from the table since it already has the current language data
      // This ensures the form is pre-filled with the data we can see in the table
      setSelectedRole(role);
      setFormData({
        titleAr: role.title || "",
        titleEn: role.title || "",
        titleFr: role.title || "",
        descriptionAr: role.description || "",
        descriptionEn: role.description || "",
        descriptionFr: role.description || "",
        requirementsAr: role.requirements || [],
        requirementsEn: role.requirements || [],
        requirementsFr: role.requirements || [],
        responsibilitiesAr: role.responsibilities || [],
        responsibilitiesEn: role.responsibilities || [],
        responsibilitiesFr: role.responsibilities || [],
        benefitsAr: role.benefits || [],
        benefitsEn: role.benefits || [],
        benefitsFr: role.benefits || [],
        skillsAr: role.skills || [],
        skillsEn: role.skills || [],
        skillsFr: role.skills || [],
        icon: role.icon || "📋",
        category: role.category || "administrative",
        experience: role.experience || "Not specified",
        location: role.location || "Remote",
        type: role.type || "full-time",
        salary: role.salary || "Competitive",
        slug: role.slug || "",
        order: role.order || 0,
        status: role.status || "active",
      });
      setIsEditing(true);
      setShowAddForm(true);
    } catch {
      toast.error("فشل في تحميل بيانات الدور للتعديل");
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    setRoleToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    deleteRoleMutation.mutate(roleToDelete);
    setShowDeleteConfirm(false);
    setRoleToDelete(null);
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setRoleToDelete(null);
  };

  // Handle view role details
  const handleView = async (role) => {
    try {
      const response = await roleService.getRoleByIdAllLanguages(role.id);
      const roleData = response.data?.data || response.data; // Handle both nested and flat structures
      setViewingRole(roleData);
      setShowViewModal(true);
    } catch {
      toast.error("فشل في تحميل تفاصيل الدور");
    }
  };

  // Handle toggle status
  const handleToggleStatus = (id) => {
    toggleStatusMutation.mutate(id);
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedRole(null);
    setFormData({
      titleAr: "",
      titleEn: "",
      titleFr: "",
      descriptionAr: "",
      descriptionEn: "",
      descriptionFr: "",
      requirementsAr: [],
      requirementsEn: [],
      requirementsFr: [],
      responsibilitiesAr: [],
      responsibilitiesEn: [],
      responsibilitiesFr: [],
      benefitsAr: [],
      benefitsEn: [],
      benefitsFr: [],
      skillsAr: [],
      skillsEn: [],
      skillsFr: [],
      icon: "📋",
      category: "administrative",
      experience: "Not specified",
      location: "Remote",
      type: "full-time",
      salary: "Competitive",
      slug: "",
      order: 0,
      status: "active",
    });
  };

  // Handle add new
  const handleAddNew = () => {
    setIsEditing(false);
    setSelectedRole(null);
    setFormData({
      titleAr: "",
      titleEn: "",
      titleFr: "",
      descriptionAr: "",
      descriptionEn: "",
      descriptionFr: "",
      requirementsAr: [],
      requirementsEn: [],
      requirementsFr: [],
      responsibilitiesAr: [],
      responsibilitiesEn: [],
      responsibilitiesFr: [],
      benefitsAr: [],
      benefitsEn: [],
      benefitsFr: [],
      skillsAr: [],
      skillsEn: [],
      skillsFr: [],
      icon: "📋",
      category: "administrative",
      experience: "Not specified",
      location: "Remote",
      type: "full-time",
      salary: "Competitive",
      slug: "",
      order: 0,
      status: "active",
    });
    setShowAddForm(true);
  };

  if (isLoadingRoles || isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  // Show error page if there's an error
  if (rolesError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg mb-2">خطأ في تحميل البيانات</div>
        <div className="text-gray-600 mb-4">{rolesError.message}</div>
        {rolesError.response?.status === 401 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-yellow-800 font-medium mb-2">
              يجب تسجيل الدخول أولاً
            </p>
            <p className="text-yellow-700 text-sm mb-3">
              بيانات تسجيل الدخول الافتراضية:
            </p>
            <div className="bg-white p-3 rounded border text-sm">
              <p>
                <strong>البريد الإلكتروني:</strong> admin@soslaw.com
              </p>
              <p>
                <strong>كلمة المرور:</strong> Admin123!
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/auth")}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              الذهاب إلى صفحة تسجيل الدخول
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة الأدوار</h2>
          <p className="text-sm text-gray-600">إجمالي الأدوار: {totalRoles}</p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 space-x-reverse"
        >
          <FiPlus className="w-4 h-4" />
          <span>إضافة دور جديد</span>
        </button>
      </div>

      {/* Statistics */}
      {statsData?.data?.data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiList className="w-8 h-8 text-blue-600" />
              <div className="mr-3">
                <p className="text-sm text-gray-600">إجمالي الأدوار</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.data.totalRoles || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
              <div className="mr-3">
                <p className="text-sm text-gray-600">الأدوار النشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.data.activeRoles || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FiXCircle className="w-8 h-8 text-red-600" />
              <div className="mr-3">
                <p className="text-sm text-gray-600">الأدوار غير النشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsData.data.data.inactiveRoles || 0}
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
                placeholder="البحث في الأدوار... (Ctrl+F)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
                title="البحث في الأدوار - استخدم Ctrl+F للوصول السريع"
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
        data={roles}
        columns={columns}
        pagination={{
          total: totalRoles,
          limit: 10,
          offset: 0,
          onPageChange: () => {
            // Handle page change if needed
          },
        }}
        searchTerm={searchTerm}
      />

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isEditing ? "تعديل الدور" : "إضافة دور جديد"}
              </h3>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Multi-language Title Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان (عربي) *
                  </label>
                  <input
                    type="text"
                    name="titleAr"
                    value={formData.titleAr}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان (إنجليزي) *
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    value={formData.titleEn}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان (فرنسي) *
                  </label>
                  <input
                    type="text"
                    name="titleFr"
                    value={formData.titleFr}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Multi-language Description Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف (عربي) *
                  </label>
                  <textarea
                    name="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف (إنجليزي) *
                  </label>
                  <textarea
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف (فرنسي) *
                  </label>
                  <textarea
                    name="descriptionFr"
                    value={formData.descriptionFr}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Requirements Arrays */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  المتطلبات
                </h4>
                {["ar", "en", "fr"].map((lang) => (
                  <div
                    key={`requirements-${lang}`}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        المتطلبات (
                        {lang === "ar"
                          ? "عربي"
                          : lang === "en"
                          ? "إنجليزي"
                          : "فرنسي"}
                        )
                      </label>
                      <button
                        type="button"
                        onClick={() => addArrayItem("requirements", lang)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + إضافة متطلب
                      </button>
                    </div>
                    {formData[
                      `requirements${
                        lang.charAt(0).toUpperCase() + lang.slice(1)
                      }`
                    ].map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleArrayFieldChange(
                              "requirements",
                              lang,
                              index,
                              e.target.value
                            )
                          }
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`متطلب ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem("requirements", lang, index)
                          }
                          className="text-red-600 hover:text-red-800 px-2"
                        >
                          <FiXCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Responsibilities Arrays */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  المسؤوليات
                </h4>
                {["ar", "en", "fr"].map((lang) => (
                  <div
                    key={`responsibilities-${lang}`}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        المسؤوليات (
                        {lang === "ar"
                          ? "عربي"
                          : lang === "en"
                          ? "إنجليزي"
                          : "فرنسي"}
                        )
                      </label>
                      <button
                        type="button"
                        onClick={() => addArrayItem("responsibilities", lang)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + إضافة مسؤولية
                      </button>
                    </div>
                    {formData[
                      `responsibilities${
                        lang.charAt(0).toUpperCase() + lang.slice(1)
                      }`
                    ].map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleArrayFieldChange(
                              "responsibilities",
                              lang,
                              index,
                              e.target.value
                            )
                          }
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`مسؤولية ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem("responsibilities", lang, index)
                          }
                          className="text-red-600 hover:text-red-800 px-2"
                        >
                          <FiXCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Benefits Arrays */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">الفوائد</h4>
                {["ar", "en", "fr"].map((lang) => (
                  <div
                    key={`benefits-${lang}`}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        الفوائد (
                        {lang === "ar"
                          ? "عربي"
                          : lang === "en"
                          ? "إنجليزي"
                          : "فرنسي"}
                        )
                      </label>
                      <button
                        type="button"
                        onClick={() => addArrayItem("benefits", lang)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + إضافة فائدة
                      </button>
                    </div>
                    {formData[
                      `benefits${lang.charAt(0).toUpperCase() + lang.slice(1)}`
                    ].map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleArrayFieldChange(
                              "benefits",
                              lang,
                              index,
                              e.target.value
                            )
                          }
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`فائدة ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem("benefits", lang, index)
                          }
                          className="text-red-600 hover:text-red-800 px-2"
                        >
                          <FiXCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Skills Arrays */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  المهارات
                </h4>
                {["ar", "en", "fr"].map((lang) => (
                  <div key={`skills-${lang}`} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        المهارات (
                        {lang === "ar"
                          ? "عربي"
                          : lang === "en"
                          ? "إنجليزي"
                          : "فرنسي"}
                        )
                      </label>
                      <button
                        type="button"
                        onClick={() => addArrayItem("skills", lang)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + إضافة مهارة
                      </button>
                    </div>
                    {formData[
                      `skills${lang.charAt(0).toUpperCase() + lang.slice(1)}`
                    ].map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleArrayFieldChange(
                              "skills",
                              lang,
                              index,
                              e.target.value
                            )
                          }
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`مهارة ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("skills", lang, index)}
                          className="text-red-600 hover:text-red-800 px-2"
                        >
                          <FiXCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Other Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الأيقونة
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="administrative">إداري</option>
                    <option value="content">محتوى</option>
                    <option value="legal">قانوني</option>
                    <option value="training">تدريب</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الخبرة
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الموقع
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    النوع
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="full-time">دوام كامل</option>
                    <option value="part-time">دوام جزئي</option>
                    <option value="contract">عقد</option>
                    <option value="internship">تدريب</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الراتب
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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

              {/* Preview Section */}
              <div className="border-t pt-6 mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  معاينة الدور
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">العربية</h5>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>العنوان:</strong> {formData.titleAr || "غير محدد"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>الوصف:</strong>{" "}
                      {formData.descriptionAr
                        ? formData.descriptionAr.substring(0, 100) + "..."
                        : "غير محدد"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">English</h5>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Title:</strong>{" "}
                      {formData.titleEn || "Not specified"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Description:</strong>{" "}
                      {formData.descriptionEn
                        ? formData.descriptionEn.substring(0, 100) + "..."
                        : "Not specified"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Français</h5>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Titre:</strong>{" "}
                      {formData.titleFr || "Non spécifié"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Description:</strong>{" "}
                      {formData.descriptionFr
                        ? formData.descriptionFr.substring(0, 100) + "..."
                        : "Non spécifié"}
                    </p>
                  </div>
                </div>
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
                    createRoleMutation.isPending || updateRoleMutation.isPending
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                >
                  {createRoleMutation.isPending ||
                  updateRoleMutation.isPending ? (
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
              هل أنت متأكد من حذف هذا الدور؟ لا يمكن التراجع عن هذا الإجراء.
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
                disabled={deleteRoleMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
              >
                {deleteRoleMutation.isPending ? (
                  <FiLoader className="animate-spin w-4 h-4 ml-2" />
                ) : null}
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Role Details Modal */}
      {showViewModal && viewingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">تفاصيل الدور</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">العربية</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>العنوان:</strong> {viewingRole.titleAr}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>الوصف:</strong> {viewingRole.descriptionAr}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">English</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Title:</strong> {viewingRole.titleEn}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Description:</strong> {viewingRole.descriptionEn}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Français</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Titre:</strong> {viewingRole.titleFr}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Description:</strong> {viewingRole.descriptionFr}
                  </p>
                </div>
              </div>

              {/* Technical Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">الأيقونة</p>
                  <p className="text-2xl">{viewingRole.icon}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">الفئة</p>
                  <p className="font-medium">{viewingRole.category}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">الخبرة</p>
                  <p className="font-medium">{viewingRole.experience}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">الموقع</p>
                  <p className="font-medium">{viewingRole.location}</p>
                </div>
              </div>

              {/* Arrays */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    المتطلبات (عربي)
                  </h4>
                  <ul className="space-y-1">
                    {viewingRole.requirementsAr?.map((req, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <FiCheckCircle className="w-3 h-3 text-green-500 ml-2" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    المسؤوليات (عربي)
                  </h4>
                  <ul className="space-y-1">
                    {viewingRole.responsibilitiesAr?.map((resp, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <FiCheckCircle className="w-3 h-3 text-blue-500 ml-2" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    الفوائد (عربي)
                  </h4>
                  <ul className="space-y-1">
                    {viewingRole.benefitsAr?.map((benefit, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <FiAward className="w-3 h-3 text-yellow-500 ml-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    المهارات (عربي)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingRole.skillsAr?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
