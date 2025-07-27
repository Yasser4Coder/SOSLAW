/* eslint-disable no-unused-vars */
import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`p-3 rounded-full ${color
            .replace("text-", "bg-")
            .replace("-600", "-100")}`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {changeType === "positive" ? (
          <FiTrendingUp className="text-green-600 h-4 w-4" />
        ) : (
          <FiTrendingDown className="text-red-600 h-4 w-4" />
        )}
        <span
          className={`text-sm font-medium mr-1 ${
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
