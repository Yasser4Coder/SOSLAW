import React, { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
} from "react-icons/fi";

const CustomAlert = ({
  type = "info",
  title,
  message,
  isVisible = false,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
}) => {
  const [isOpen, setIsOpen] = useState(isVisible);

  useEffect(() => {
    setIsOpen(isVisible);

    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return {
          container: "bg-green-50 border-green-200",
          icon: "text-green-600",
          title: "text-green-800",
          message: "text-green-700",
          closeButton: "text-green-400 hover:text-green-600",
        };
      case "error":
        return {
          container: "bg-red-50 border-red-200",
          icon: "text-red-600",
          title: "text-red-800",
          message: "text-red-700",
          closeButton: "text-red-400 hover:text-red-600",
        };
      case "warning":
        return {
          container: "bg-yellow-50 border-yellow-200",
          icon: "text-yellow-600",
          title: "text-yellow-800",
          message: "text-yellow-700",
          closeButton: "text-yellow-400 hover:text-yellow-600",
        };
      case "info":
      default:
        return {
          container: "bg-blue-50 border-blue-200",
          icon: "text-blue-600",
          title: "text-blue-800",
          message: "text-blue-700",
          closeButton: "text-blue-400 hover:text-blue-600",
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle size={20} />;
      case "error":
        return <FiXCircle size={20} />;
      case "warning":
        return <FiAlertTriangle size={20} />;
      case "info":
      default:
        return <FiInfo size={20} />;
    }
  };

  if (!isOpen) return null;

  const styles = getAlertStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full animate-slide-in`}
    >
      <div className={`border rounded-lg p-4 shadow-lg ${styles.container}`}>
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${styles.icon}`}>{getIcon()}</div>
          <div className="mr-3 flex-1">
            {title && (
              <h3 className={`text-sm font-medium ${styles.title}`}>{title}</h3>
            )}
            {message && (
              <p className={`text-sm mt-1 ${styles.message}`}>{message}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className={`flex-shrink-0 ${styles.closeButton} transition-colors`}
          >
            <FiX size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
