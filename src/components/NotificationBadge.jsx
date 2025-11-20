import React from "react";
import { FiBell } from "react-icons/fi";

const NotificationBadge = ({ count = 0, className = "" }) => {
  if (count === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <FiBell className="w-5 h-5" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce shadow-lg">
        {count > 9 ? "9+" : count}
      </span>
    </div>
  );
};

export default NotificationBadge;
