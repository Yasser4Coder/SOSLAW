import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import DataTable from "./DataTable";
import CustomAlert from "./CustomAlert";
import ConfirmationModal from "./ConfirmationModal";
import LoadingSpinner from "./LoadingSpinner";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useToggleUserStatus,
  useUserStats,
} from "../../hooks/useUserManagement";

const UsersManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
  });
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "client",
    isActive: true,
  });

  // API hooks
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useUsers({
    ...pagination,
    ...filters,
  });

  const { data: statsData, isLoading: isLoadingStats } = useUserStats();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

  // Extract users from API response
  const users = usersData?.data?.data?.users || [];
  const totalUsers = usersData?.data?.data?.total || 0;

  const columns = [
    { key: "fullName", label: "الاسم الكامل", sortable: true },
    { key: "email", label: "البريد الإلكتروني", sortable: true },
    { key: "phoneNumber", label: "رقم الهاتف", sortable: false },
    { key: "role", label: "الدور", sortable: true },
    { key: "isActive", label: "الحالة", sortable: true },
    { key: "createdAt", label: "تاريخ الإنشاء", sortable: true },
    { key: "actions", label: "الإجراءات", sortable: false },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      showAlert("error", "خطأ", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (!isEditing && !formData.password) {
      showAlert("error", "خطأ", "كلمة المرور مطلوبة للمستخدمين الجدد");
      return;
    }

    try {
      if (isEditing && selectedUser) {
        // Update existing user
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;

        await updateUserMutation.mutateAsync({
          id: selectedUser.id,
          userData: updateData,
        });
      } else {
        // Create new user
        await createUserMutation.mutateAsync(formData);
      }

      handleCloseForm();
    } catch {
      // Error handling is done in the mutation hook
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      password: "", // Don't show password when editing
      role: user.role || "client",
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete.id);
        setShowDeleteModal(false);
        setUserToDelete(null);
      } catch {
        // Error handling is done in the mutation hook
      }
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await toggleStatusMutation.mutateAsync(userId);
    } catch {
      // Error handling is done in the mutation hook
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedUser(null);
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "client",
      isActive: true,
    });
  };

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ show: false, type: "info", title: "", message: "" });
  };

  const handleFilterChange = (key, value) => {
    // Only set filter if it has a value, otherwise remove it
    if (value && value.trim() !== "") {
      setFilters((prev) => ({ ...prev, [key]: value }));
    } else {
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      });
    }
    setPagination((prev) => ({ ...prev, offset: 0 })); // Reset to first page
  };

  const handlePageChange = (newOffset) => {
    setPagination((prev) => ({ ...prev, offset: newOffset }));
  };

  // Keyboard shortcut for search (Ctrl+F or Cmd+F)
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="البحث في المستخدمين"]'
        );
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Use users directly since backend handles pagination and filtering
  const tableData = users.map((user) => ({
    ...user,
    role:
      user.role === "admin"
        ? "مدير"
        : user.role === "consultant"
        ? "مستشار"
        : user.role === "support"
        ? "دعم فني"
        : "عميل",
    isActive: user.isActive ? "نشط" : "غير نشط",
    createdAt: new Date(user.createdAt || user.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    actions: (
      <div className="flex items-center space-x-2 space-x-reverse">
        <button
          onClick={() => handleEdit(user)}
          className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
          title="تعديل"
        >
          <FiEdit size={16} />
        </button>
        <button
          onClick={() => handleToggleStatus(user.id)}
          disabled={toggleStatusMutation.isPending}
          className={`p-1 transition-colors ${
            user.isActive
              ? "text-yellow-600 hover:text-yellow-800"
              : "text-green-600 hover:text-green-800"
          }`}
          title={user.isActive ? "إلغاء التفعيل" : "تفعيل"}
        >
          {user.isActive ? (
            <FiToggleLeft size={16} />
          ) : (
            <FiToggleRight size={16} />
          )}
        </button>
        <button
          onClick={() => handleDelete(user)}
          className="text-red-600 hover:text-red-800 p-1 transition-colors"
          title="حذف"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    ),
  }));

  // Filter data based on search term
  const filteredTableData = React.useMemo(() => {
    if (!searchTerm.trim()) return tableData;

    const searchLower = searchTerm.toLowerCase().trim();

    return tableData.filter((user) => {
      return (
        (user.fullName && user.fullName.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.phoneNumber &&
          user.phoneNumber.toLowerCase().includes(searchLower)) ||
        (user.role && user.role.toLowerCase().includes(searchLower))
      );
    });
  }, [tableData, searchTerm]);

  const isLoading =
    isLoadingUsers ||
    createUserMutation.isPending ||
    updateUserMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-600">إدارة حسابات المستخدمين في النظام</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 space-x-reverse transition-colors"
        >
          <FiPlus size={16} />
          <span>إضافة مستخدم</span>
        </button>
      </div>

      {/* Statistics Cards */}
      {!isLoadingStats && statsData?.data?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.data.data.totalUsers}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">المستخدمين النشطين</p>
              <p className="text-2xl font-bold text-green-600">
                {statsData.data.data.activeUsers}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">المديرين</p>
              <p className="text-2xl font-bold text-blue-600">
                {statsData.data.data.adminUsers}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">العملاء</p>
              <p className="text-2xl font-bold text-purple-600">
                {statsData.data.data.clientUsers}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {searchTerm && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg transition-all duration-200">
            <p className="text-sm text-blue-800 text-right">
              نتائج البحث: {filteredTableData.length} من {tableData.length}{" "}
              مستخدم
              {searchTerm && (
                <span className="text-blue-600 font-medium">
                  {" "}
                  - "{searchTerm}"
                </span>
              )}
            </p>
          </div>
        )}
        {(filters.role || filters.isActive) && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg transition-all duration-200">
            <p className="text-sm text-green-800 text-right">
              المرشحات النشطة:
              {filters.role && (
                <span className="text-green-600 font-medium">
                  {" "}
                  الدور:{" "}
                  {filters.role === "admin"
                    ? "مدير"
                    : filters.role === "consultant"
                    ? "مستشار"
                    : filters.role === "support"
                    ? "دعم فني"
                    : "عميل"}
                </span>
              )}
              {filters.role && filters.isActive && " | "}
              {filters.isActive && (
                <span className="text-green-600 font-medium">
                  {" "}
                  الحالة: {filters.isActive === "true" ? "نشط" : "غير نشط"}
                </span>
              )}
            </p>
          </div>
        )}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 md:space-x-reverse">
          <div className="flex-1 relative w-full">
            <FiSearch
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                searchTerm ? "text-blue-500" : "text-gray-400"
              }`}
              size={16}
            />
            <input
              type="text"
              placeholder="البحث في المستخدمين... (Ctrl+F)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="off"
              title="البحث في المستخدمين - استخدم Ctrl+F للوصول السريع"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors"
                title="مسح البحث"
              >
                ✕
              </button>
            )}
            {searchTerm && (
              <div className="absolute left-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {filteredTableData.length} من {tableData.length}
              </div>
            )}
            {searchTerm && (
              <div className="absolute left-20 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            )}
            {searchTerm && (
              <div className="absolute left-24 top-1/2 transform -translate-y-1/2 text-xs text-blue-500 font-medium">
                بحث...
              </div>
            )}
          </div>

          <select
            value={filters.role || ""}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">جميع الأدوار</option>
            <option value="admin">مدير</option>
            <option value="client">عميل</option>
            <option value="consultant">مستشار</option>
            <option value="support">دعم فني</option>
          </select>

          <select
            value={filters.isActive || ""}
            onChange={(e) => handleFilterChange("isActive", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">جميع الحالات</option>
            <option value="true">نشط</option>
            <option value="false">غير نشط</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({});
              setPagination({ limit: 10, offset: 0 });
            }}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiRefreshCw size={16} />
            <span>إعادة تعيين</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {isLoadingUsers ? (
          <div className="p-8">
            <LoadingSpinner size="lg" text="جاري تحميل المستخدمين..." />
          </div>
        ) : usersError ? (
          <div className="p-8 text-center">
            <p className="text-red-600">حدث خطأ أثناء تحميل المستخدمين</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <>
            {searchTerm && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600 text-right">
                  عرض {filteredTableData.length} من {tableData.length} مستخدم
                  <span className="text-blue-600 font-medium">
                    {" "}
                    - البحث: "{searchTerm}"
                  </span>
                </p>
              </div>
            )}
            {searchTerm && filteredTableData.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">
                  لا توجد نتائج للبحث
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  جرب البحث بكلمات مختلفة أو امسح البحث لعرض جميع المستخدمين
                </p>
                <div className="space-x-3 space-x-reverse">
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    مسح البحث
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilters({});
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    إعادة تعيين الكل
                  </button>
                </div>
              </div>
            ) : (
              <DataTable
                data={filteredTableData}
                columns={columns}
                pagination={{
                  total: totalUsers,
                  limit: pagination.limit,
                  offset: pagination.offset,
                  onPageChange: handlePageChange,
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    كلمة المرور *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!isEditing}
                    disabled={isLoading}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  الدور
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                >
                  <option value="client">عميل</option>
                  <option value="admin">مدير</option>
                  <option value="consultant">مستشار</option>
                  <option value="support">دعم فني</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label className="text-sm font-medium text-gray-700">
                  المستخدم نشط
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 space-x-reverse pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 space-x-reverse"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span>جاري...</span>
                    </>
                  ) : (
                    <span>{isEditing ? "تحديث" : "إضافة"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف المستخدم "${userToDelete?.fullName}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        type="danger"
        isLoading={deleteUserMutation.isPending}
      />

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

export default UsersManagement;
