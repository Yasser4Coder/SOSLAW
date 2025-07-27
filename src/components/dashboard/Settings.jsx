import React, { useState } from "react";
import {
  FiSave,
  FiGlobe,
  FiMail,
  FiShield,
  FiBell,
  FiUser,
  FiDatabase,
} from "react-icons/fi";
import CustomAlert from "./CustomAlert";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [alert, setAlert] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
  });
  const [settings, setSettings] = useState({
    general: {
      siteName: "SOSLAW",
      siteDescription: "منصة جزائرية رقمية للاستشارات والخدمات القانونية",
      contactEmail: "info@soslaw.com",
      contactPhone: "+213 123 456 789",
      address: "الجزائر العاصمة، الجزائر",
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      newUserNotification: true,
      newConsultationNotification: true,
      newContactNotification: true,
    },
    security: {
      requireEmailVerification: true,
      requirePhoneVerification: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
    },
    integrations: {
      googleAnalytics: true,
      facebookPixel: false,
      emailService: "smtp",
      smsService: "disabled",
    },
  });

  const handleSettingChange = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    // API call to save settings
    console.log("Saving settings:", settings);
    showAlert("success", "تم الحفظ", "تم حفظ الإعدادات بنجاح");
  };

  const showAlert = (type, title, message) => {
    setAlert({ show: true, type, title, message });
  };

  const closeAlert = () => {
    setAlert({ show: false, type: "info", title: "", message: "" });
  };

  const tabs = [
    {
      id: "general",
      label: "الإعدادات العامة",
      icon: FiGlobe,
    },
    {
      id: "notifications",
      label: "الإشعارات",
      icon: FiBell,
    },
    { id: "security", label: "الأمان", icon: FiShield },
    {
      id: "integrations",
      label: "التكاملات",
      icon: FiDatabase,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
          <p className="text-gray-600">إدارة إعدادات الموقع واللوحة</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
        >
          <FiSave size={16} />
          <span>حفظ الإعدادات</span>
        </button>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 space-x-reverse px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="ml-2" size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                الإعدادات العامة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الموقع
                  </label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) =>
                      handleSettingChange("general", "siteName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني للتواصل
                  </label>
                  <input
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) =>
                      handleSettingChange(
                        "general",
                        "contactEmail",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف للتواصل
                  </label>
                  <input
                    type="tel"
                    value={settings.general.contactPhone}
                    onChange={(e) =>
                      handleSettingChange(
                        "general",
                        "contactPhone",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={settings.general.address}
                    onChange={(e) =>
                      handleSettingChange("general", "address", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف الموقع
                  </label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) =>
                      handleSettingChange(
                        "general",
                        "siteDescription",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">الإشعارات</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      إشعارات البريد الإلكتروني
                    </h4>
                    <p className="text-sm text-gray-500">
                      استلام إشعارات عبر البريد الإلكتروني
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "emailNotifications",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      إشعارات المستخدمين الجدد
                    </h4>
                    <p className="text-sm text-gray-500">
                      إشعار عند تسجيل مستخدم جديد
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.newUserNotification}
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "newUserNotification",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      إشعارات الاستشارات الجديدة
                    </h4>
                    <p className="text-sm text-gray-500">
                      إشعار عند طلب استشارة جديدة
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        settings.notifications.newConsultationNotification
                      }
                      onChange={(e) =>
                        handleSettingChange(
                          "notifications",
                          "newConsultationNotification",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">الأمان</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      تأكيد البريد الإلكتروني
                    </h4>
                    <p className="text-sm text-gray-500">
                      تطلب تأكيد البريد الإلكتروني عند التسجيل
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.requireEmailVerification}
                      onChange={(e) =>
                        handleSettingChange(
                          "security",
                          "requireEmailVerification",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مهلة الجلسة (دقائق)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "sessionTimeout",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحد الأقصى لمحاولات تسجيل الدخول
                  </label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "maxLoginAttempts",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">التكاملات</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Google Analytics
                    </h4>
                    <p className="text-sm text-gray-500">
                      تفعيل تتبع الزيارات عبر Google Analytics
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.integrations.googleAnalytics}
                      onChange={(e) =>
                        handleSettingChange(
                          "integrations",
                          "googleAnalytics",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    خدمة البريد الإلكتروني
                  </label>
                  <select
                    value={settings.integrations.emailService}
                    onChange={(e) =>
                      handleSettingChange(
                        "integrations",
                        "emailService",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="smtp">SMTP</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="disabled">معطل</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    خدمة الرسائل النصية
                  </label>
                  <select
                    value={settings.integrations.smsService}
                    onChange={(e) =>
                      handleSettingChange(
                        "integrations",
                        "smsService",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="disabled">معطل</option>
                    <option value="twilio">Twilio</option>
                    <option value="nexmo">Nexmo</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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

export default Settings;
