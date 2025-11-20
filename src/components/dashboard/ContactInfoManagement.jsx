import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  FiSave,
  FiEdit3,
  FiTrash2,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiShare2,
  FiPlus,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
} from "react-icons/fi";
import contactInfoService from "../../services/contactInfoService";
import LoadingSpinner from "./LoadingSpinner";
import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "../../contexts/useAuth";

const ContactInfoManagement = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    type: "phone",
    keyName: "",
    value: "",
    displayOrder: 0,
    isActive: true,
  });
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });
  const queryClient = useQueryClient();

  // Fetch all contact info
  const {
    data: contactInfoData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contactInfoAdmin"],
    queryFn: contactInfoService.getAllContactInfoAdmin,
    enabled: isAuthenticated && isAdmin, // Only fetch if user is authenticated and is admin
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      if (error?.response?.status === 401) {
        toast.error("يرجى تسجيل الدخول أولاً");
      } else {
        toast.error("حدث خطأ أثناء تحميل معلومات التواصل");
      }
    },
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: contactInfoService.bulkUpdateContactInfo,
    onSuccess: () => {
      // Invalidate both admin and public contact info queries
      queryClient.invalidateQueries(["contactInfoAdmin"]);
      queryClient.invalidateQueries(["contactInfo"]);
      toast.success("تم تحديث معلومات التواصل بنجاح");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء تحديث معلومات التواصل");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: contactInfoService.deleteContactInfo,
    onSuccess: () => {
      // Invalidate both admin and public contact info queries
      queryClient.invalidateQueries(["contactInfoAdmin"]);
      queryClient.invalidateQueries(["contactInfo"]);
      toast.success("تم حذف العنصر بنجاح");
      setDeleteModal({ show: false, item: null });
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء حذف العنصر");
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: contactInfoService.toggleContactInfoStatus,
    onSuccess: () => {
      // Invalidate both admin and public contact info queries
      queryClient.invalidateQueries(["contactInfoAdmin"]);
      queryClient.invalidateQueries(["contactInfo"]);
      toast.success("تم تغيير حالة العنصر بنجاح");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء تغيير حالة العنصر");
    },
  });

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleSave = () => {
    if (!editingItem) return;

    const updates = [
      {
        id: editingItem.id, // Include the ID for existing items
        type: editingItem.type,
        keyName: editingItem.keyName,
        value: editingItem.value,
        displayOrder: editingItem.displayOrder,
        isActive: editingItem.isActive,
      },
    ];

    bulkUpdateMutation.mutate(updates);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  const handleDelete = (item) => {
    setDeleteModal({ show: true, item });
  };

  const confirmDelete = () => {
    if (deleteModal.item) {
      deleteMutation.mutate(deleteModal.item.id);
    }
  };

  const handleToggleStatus = (item) => {
    toggleStatusMutation.mutate(item.id);
  };

  const handleAddNew = () => {
    setNewItem({
      type: "phone",
      keyName: "",
      value: "",
      displayOrder: 0,
      isActive: true,
    });
    setShowAddForm(true);
  };

  const handleSaveNew = () => {
    if (!newItem.keyName || !newItem.value) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const updates = [newItem];
    bulkUpdateMutation.mutate(updates);
    setShowAddForm(false);
    setNewItem({
      type: "phone",
      keyName: "",
      value: "",
      displayOrder: 0,
      isActive: true,
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "phone":
        return <FiPhone className="w-4 h-4" />;
      case "email":
        return <FiMail className="w-4 h-4" />;
      case "address":
        return <FiMapPin className="w-4 h-4" />;
      case "hours":
        return <FiClock className="w-4 h-4" />;
      case "social_media":
        return <FiShare2 className="w-4 h-4" />;
      default:
        return <FiEdit3 className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "phone":
        return "هاتف";
      case "email":
        return "بريد إلكتروني";
      case "address":
        return "عنوان";
      case "hours":
        return "ساعات العمل";
      case "social_media":
        return "وسائل التواصل الاجتماعي";
      default:
        return type;
    }
  };

  // Check if user is authenticated and is admin
  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              غير مصرح بالوصول
            </h3>
            <p className="mt-1 text-sm text-yellow-700">
              يرجى تسجيل الدخول للوصول إلى إدارة معلومات التواصل
            </p>
            <div className="mt-3">
              <button
                onClick={() => (window.location.href = "/auth")}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm"
              >
                تسجيل الدخول
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800">
              غير مصرح بالوصول
            </h3>
            <p className="mt-1 text-sm text-red-700">
              يجب أن تكون مديراً للوصول إلى إدارة معلومات التواصل
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    const isAuthError = error?.response?.status === 401;
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800">
              {isAuthError ? "خطأ في المصادقة" : "خطأ في تحميل البيانات"}
            </h3>
            <p className="mt-1 text-sm text-red-700">
              {isAuthError
                ? "يرجى تسجيل الدخول أولاً للوصول إلى إدارة معلومات التواصل"
                : "حدث خطأ أثناء تحميل معلومات التواصل. يرجى المحاولة مرة أخرى."}
            </p>
            {isAuthError && (
              <div className="mt-3">
                <button
                  onClick={() => (window.location.href = "/auth")}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  تسجيل الدخول
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const contactInfo = contactInfoData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          إدارة معلومات التواصل
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              refetch();
              queryClient.invalidateQueries(["contactInfo"]);
              toast.success("تم تحديث البيانات");
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            تحديث
          </button>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            إضافة جديد
          </button>
        </div>
      </div>

      {/* Add New Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            إضافة معلومات تواصل جديدة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النوع
              </label>
              <select
                value={newItem.type}
                onChange={(e) =>
                  setNewItem({ ...newItem, type: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="phone">هاتف</option>
                <option value="email">بريد إلكتروني</option>
                <option value="address">عنوان</option>
                <option value="hours">ساعات العمل</option>
                <option value="social_media">وسائل التواصل الاجتماعي</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المفتاح
              </label>
              <input
                type="text"
                value={newItem.keyName}
                onChange={(e) =>
                  setNewItem({ ...newItem, keyName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: main_phone"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                القيمة
              </label>
              <input
                type="text"
                value={newItem.value}
                onChange={(e) =>
                  setNewItem({ ...newItem, value: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: +213 555 123 456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ترتيب العرض
              </label>
              <input
                type="number"
                value={newItem.displayOrder}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    displayOrder: parseInt(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newItemActive"
                checked={newItem.isActive}
                onChange={(e) =>
                  setNewItem({ ...newItem, isActive: e.target.checked })
                }
                className="mr-2"
              />
              <label
                htmlFor="newItemActive"
                className="text-sm font-medium text-gray-700"
              >
                نشط
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSaveNew}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <FiSave className="w-4 h-4" />
              حفظ
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Contact Info List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  النوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المفتاح
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  القيمة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ترتيب العرض
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contactInfo.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span className="text-sm font-medium text-gray-900">
                        {getTypeLabel(item.type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingItem?.id === item.id ? (
                      <input
                        type="text"
                        value={editingItem.keyName}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            keyName: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">
                        {item.keyName}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingItem?.id === item.id ? (
                      <input
                        type="text"
                        value={editingItem.value}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            value: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">
                        {item.value}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingItem?.id === item.id ? (
                      <input
                        type="number"
                        value={editingItem.displayOrder}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            displayOrder: parseInt(e.target.value),
                          })
                        }
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                        min="0"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">
                        {item.displayOrder}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingItem?.id === item.id ? (
                      <input
                        type="checkbox"
                        checked={editingItem.isActive}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            isActive: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.isActive ? (
                          <>
                            <FiEye className="w-3 h-3" />
                            نشط
                          </>
                        ) : (
                          <>
                            <FiEyeOff className="w-3 h-3" />
                            غير نشط
                          </>
                        )}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingItem?.id === item.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiSave className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, item: null })}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف ${getTypeLabel(
          deleteModal.item?.type
        )} "${deleteModal.item?.keyName}"؟`}
        confirmText="حذف"
        cancelText="إلغاء"
        type="danger"
      />
    </div>
  );
};

export default ContactInfoManagement;
