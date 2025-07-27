import React from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiFileText,
} from "react-icons/fi";

const ChartWidget = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">إحصائيات الموقع</h3>
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-sm text-gray-500">آخر 30 يوم</span>
        </div>
      </div>

      {/* Mock Chart */}
      <div className="h-64 bg-gray-50 rounded-lg mb-6 flex items-end justify-between p-4">
        {[20, 35, 25, 45, 30, 50, 40, 60, 55, 70, 65, 80].map(
          (height, index) => (
            <div
              key={index}
              className="bg-blue-500 rounded-t"
              style={{ height: `${height}%`, width: "6%" }}
            />
          )
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center p-4 bg-green-50 rounded-lg">
          <div className="p-2 bg-green-100 rounded-full mr-3">
            <FiTrendingUp className="text-green-600" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              زيادة المستخدمين
            </p>
            <p className="text-lg font-bold text-gray-900">+24%</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-blue-50 rounded-lg">
          <div className="p-2 bg-blue-100 rounded-full mr-3">
            <FiFileText className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              الاستشارات الجديدة
            </p>
            <p className="text-lg font-bold text-gray-900">+18%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartWidget;
