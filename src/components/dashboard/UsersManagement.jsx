import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import DataTable from "./DataTable";
import CustomAlert from "./CustomAlert";

const UsersManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock users data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+213 123 456 789",
      role: "مستخدم",
      status: "نشط",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima@example.com",
      phone: "+213 987 654 321",
      role: "مستخدم",
      status: "نشط",
      joinDate: "2024-01-20",
    },
    {
      id: 3,
      name: "محمد أحمد",
      email: "mohamed@example.com",
      phone: "+213 555 123 456",
      role: "مستخدم",
      status: "غير نشط",
      joinDate: "2024-01-10",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "مستخدم",
    status: "نشط",
  });

  const columns = [
    { key: "name", label: "الاسم", sortable: true },
    { key: "email", label: "البريد الإلكتروني", sortable: true },
    { key: "phone", label: "رقم الهاتف", sortable: false },
    { key: "role", label: "الدور", sortable: true },
    { key: "status", label: "الحالة", sortable: true },
    { key: "joinDate", label: "تاريخ الانضمام", sortable: true },
    { key: "actions", label: "الإجراءات", sortable: false },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      showAlert("error", "خطأ", "يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (isEditing && selectedUser) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, ...formData } : user
        )
      );
      showAlert("success", "تم التحديث", "تم تحديث بيانات المستخدم بنجاح");
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        ...formData,
        joinDate: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, newUser]);
      showAlert("success", "تم الإضافة", "تم إضافة المستخدم الجديد بنجاح");
    }

    handleCloseForm();
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      setUsers(users.filter((user) => user.id !== userId));
      showAlert("success", "تم الحذف", "تم حذف المستخدم بنجاح");
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "مستخدم",
      status: "نشط",
    });
  };

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ show: false, type: "info", title: "", message: "" });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableData = filteredUsers.map((user) => ({
    ...user,
    actions: (
      <div className="flex items-center space-x-2 space-x-reverse">
        <button
          onClick={() => handleEdit(user)}
          className="text-blue-600 hover:text-blue-800 p-1"
          title="تعديل"
        >
          <FiEdit size={16} />
        </button>
        <button
          onClick={() => handleDelete(user.id)}
          className="text-red-600 hover:text-red-800 p-1"
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
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-600">إدارة حسابات المستخدمين في النظام</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
        >
          <FiPlus size={16} />
          <span>إضافة مستخدم</span>
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
              placeholder="البحث في المستخدمين..."
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

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <DataTable data={tableData} columns={columns} searchTerm={searchTerm} />
      </div>

      {/* Add/Edit User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
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
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الدور
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="مستخدم">مستخدم</option>
                  <option value="مدير">مدير</option>
                  <option value="مشرف">مشرف</option>
                </select>
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
                  <option value="نشط">نشط</option>
                  <option value="غير نشط">غير نشط</option>
                  <option value="معلق">معلق</option>
                </select>
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

export default UsersManagement;
