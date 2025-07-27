import React, { useState, useMemo } from "react";
import {
  FiBell,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";
import DataTable from "./DataTable";
import CustomAlert from "./CustomAlert";

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "تم تسجيل مستخدم جديد",
      message: "تم تسجيل المستخدم أحمد محمد بنجاح في النظام",
      time: "منذ 5 دقائق",
      read: false,
      category: "users",
    },
    {
      id: 2,
      type: "warning",
      title: "طلب استشارة قانونية جديد",
      message: "تم إرسال طلب استشارة في القانون المدني من المستخدم سارة أحمد",
      time: "منذ 15 دقيقة",
      read: false,
      category: "consultations",
    },
    {
      id: 3,
      type: "info",
      title: "تحديث النظام",
      message: "تم تحديث النظام إلى الإصدار الجديد 2.1.0",
      time: "منذ ساعة",
      read: true,
      category: "system",
    },
    {
      id: 4,
      type: "success",
      title: "تم قبول طلب الانضمام",
      message: "تم قبول طلب انضمام المحامي سارة أحمد للفريق",
      time: "منذ ساعتين",
      read: true,
      category: "join-team",
    },
    {
      id: 5,
      type: "warning",
      title: "طلب تواصل جديد",
      message: "تم استلام طلب تواصل جديد من العميل محمد علي",
      time: "منذ 3 ساعات",
      read: false,
      category: "contact",
    },
    {
      id: 6,
      type: "info",
      title: "نسخة احتياطية",
      message: "تم إنشاء نسخة احتياطية من قاعدة البيانات بنجاح",
      time: "منذ 5 ساعات",
      read: true,
      category: "system",
    },
    {
      id: 7,
      type: "success",
      title: "تم إضافة مستشار جديد",
      message: "تم إضافة المستشار أحمد خالد إلى قائمة المستشارين",
      time: "منذ 6 ساعات",
      read: true,
      category: "consultants",
    },
    {
      id: 8,
      type: "warning",
      title: "سؤال شائع جديد",
      message: "تم إضافة سؤال شائع جديد حول القانون التجاري",
      time: "منذ يوم",
      read: false,
      category: "faq",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" || notification.type === filterType;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "read" && notification.read) ||
        (filterStatus === "unread" && !notification.read);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [notifications, searchTerm, filterType, filterStatus]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    showSuccessAlert("تم تحديد الإشعار كمقروء");
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    showSuccessAlert("تم تحديد جميع الإشعارات كمقروءة");
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
    showSuccessAlert("تم حذف الإشعار بنجاح");
  };

  const deleteAllRead = () => {
    setNotifications((prev) =>
      prev.filter((notification) => !notification.read)
    );
    showSuccessAlert("تم حذف جميع الإشعارات المقروءة");
  };

  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setAlertType("success");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <FiCheck className="text-green-500" size={16} />;
      case "warning":
        return <FiAlertCircle className="text-yellow-500" size={16} />;
      case "info":
        return <FiInfo className="text-blue-500" size={16} />;
      default:
        return <FiBell className="text-gray-500" size={16} />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "success":
        return "نجاح";
      case "warning":
        return "تحذير";
      case "info":
        return "معلومات";
      default:
        return "عام";
    }
  };

  const getStatusLabel = (read) => {
    return read ? "مقروء" : "غير مقروء";
  };

  const columns = [
    {
      key: "type",
      label: "النوع",
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-reverse space-x-2">
          {getNotificationIcon(value)}
          <span className="text-sm">{getTypeLabel(value)}</span>
        </div>
      ),
    },
    {
      key: "title",
      label: "العنوان",
      sortable: true,
    },
    {
      key: "message",
      label: "الرسالة",
      sortable: false,
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "time",
      label: "الوقت",
      sortable: true,
    },
    {
      key: "read",
      label: "الحالة",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {getStatusLabel(value)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "الإجراءات",
      sortable: false,
      render: (_, notification) => (
        <div className="flex items-center space-x-reverse space-x-2">
          {!notification.read && (
            <button
              onClick={() => markAsRead(notification.id)}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors duration-200"
              title="تحديد كمقروء"
            >
              <FiCheckCircle size={12} />
            </button>
          )}
          <button
            onClick={() => deleteNotification(notification.id)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors duration-200"
            title="حذف"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      ),
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-right">
        <h1 className="text-2xl font-bold text-gray-900">جميع الإشعارات</h1>
        <p className="text-gray-600">إدارة وعرض جميع إشعارات النظام</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiBell className="text-blue-600" size={20} />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">
                إجمالي الإشعارات
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertCircle className="text-red-600" size={20} />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">غير مقروءة</p>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheck className="text-green-600" size={20} />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">مقروءة</p>
              <p className="text-2xl font-bold text-gray-900">{readCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-reverse lg:space-x-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="البحث في الإشعارات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-reverse space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع الأنواع</option>
              <option value="success">نجاح</option>
              <option value="warning">تحذير</option>
              <option value="info">معلومات</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="unread">غير مقروءة</option>
              <option value="read">مقروءة</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-reverse space-x-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors duration-200"
              >
                <FiCheckCircle className="ml-2" size={16} />
                تحديد الكل كمقروء
              </button>
            )}
            {readCount > 0 && (
              <button
                onClick={deleteAllRead}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors duration-200"
              >
                <FiTrash2 className="ml-2" size={16} />
                حذف المقروءة
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          data={filteredNotifications}
          columns={columns}
          searchTerm={searchTerm}
        />
      </div>

      {/* Custom Alert */}
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
};

export default AllNotifications;
