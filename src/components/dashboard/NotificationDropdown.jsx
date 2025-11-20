import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiX, FiCheck, FiAlertCircle, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useNotifications from "../../hooks/useNotifications";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications: apiNotifications,
    notificationCounts,
    markAsRead,
  } = useNotifications();

  // Use API notifications only
  const notifications = apiNotifications || [];

  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = () => {
    // Mark all notifications as read
    notifications.forEach((notification) => {
      if (!notification.read) {
        handleMarkAsRead(notification.id);
      }
    });
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

  const unreadCount =
    notificationCounts.total || notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="الإشعارات"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 left-0 block h-2 w-2 rounded-full bg-red-400"></span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">الإشعارات</h3>
            <div className="flex items-center space-x-reverse space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200 hover:shadow-sm border border-blue-200"
                >
                  تحديد الكل كمقروء
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => {
                      if (notification.link) {
                        navigate(notification.link);
                        setIsOpen(false);
                      }
                    }}
                  >
                    <div className="flex items-start space-x-reverse space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors duration-200 hover:shadow-sm"
                            >
                              تحديد كمقروء
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FiBell className="mx-auto text-gray-400" size={32} />
                <p className="mt-2 text-sm text-gray-500">
                  لا توجد إشعارات جديدة
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate("/dashboard/notifications");
                  setIsOpen(false);
                }}
                className="w-full py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200 hover:shadow-sm border border-blue-200"
              >
                عرض جميع الإشعارات
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
