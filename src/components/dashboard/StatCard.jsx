import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const colorMap = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
};

const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  const colors = colorMap[color] || colorMap.blue;
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl flex-shrink-0 ${colors.bg}`}>
          <Icon className={`h-6 w-6 ${colors.text}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center flex-wrap gap-x-1">
        {changeType === "positive" ? (
          <FiTrendingUp className="text-green-600 h-4 w-4 flex-shrink-0" />
        ) : (
          <FiTrendingDown className="text-red-600 h-4 w-4 flex-shrink-0" />
        )}
        <span
          className={`text-sm font-medium ${
            changeType === "positive" ? "text-green-600" : "text-red-600"
          }`}
        >
          {change}
        </span>
        <span className="text-sm text-gray-500">من الشهر الماضي</span>
      </div>
    </div>
  );
};

export default StatCard;
