import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiX, FiUser, FiMail, FiPhone, FiCalendar } from "react-icons/fi";

const UserModal = ({ user, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active",
    registrationDate: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.status || "active",
        registrationDate: user.registrationDate || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "active",
        registrationDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: user?.id,
    });
  };

  const isFormValid = formData.name && formData.email && formData.phone;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {user
                ? t("editUser", "تعديل المستخدم")
                : t("addUser", "إضافة مستخدم")}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("name", "الاسم")} *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent"
                  placeholder={t("enterName", "أدخل الاسم")}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("email", "البريد الإلكتروني")} *
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent"
                  placeholder={t("enterEmail", "أدخل البريد الإلكتروني")}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("phone", "الهاتف")} *
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent"
                  placeholder={t("enterPhone", "أدخل رقم الهاتف")}
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("status", "الحالة")}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent"
              >
                <option value="active">{t("active", "نشط")}</option>
                <option value="inactive">{t("inactive", "غير نشط")}</option>
              </select>
            </div>

            {/* Registration Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("registrationDate", "تاريخ التسجيل")}
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t("cancel", "إلغاء")}
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="px-4 py-2 bg-[#09142b] text-white rounded-lg hover:bg-[#1a2a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {user ? t("update", "تحديث") : t("create", "إنشاء")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
