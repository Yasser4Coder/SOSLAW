import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiFileText,
  FiLoader,
} from "react-icons/fi";
import dashboardService from "../../services/dashboardService";

const ChartWidget = () => {
  // Fetch chart data
  const {
    data: chartDataResponse,
    isLoading: isLoadingChart,
    error: chartError,
  } = useQuery({
    queryKey: ["dashboardChart"],
    queryFn: () => dashboardService.getChartData(30),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const chartData = chartDataResponse?.data?.chartData || [];
  const usersGrowth = chartDataResponse?.data?.usersGrowth || "+0%";
  const consultationsGrowth = chartDataResponse?.data?.consultationsGrowth || "+0%";

  // Calculate max value for scaling the bars
  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  // Get last 12 data points for display
  const displayData = chartData.slice(-12);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">إحصائيات الموقع</h3>
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-sm text-gray-500">آخر 30 يوم</span>
        </div>
      </div>

      {/* Chart */}
      {isLoadingChart ? (
        <div className="h-64 flex items-center justify-center">
          <FiLoader className="animate-spin text-2xl text-blue-600" />
        </div>
      ) : chartError ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">حدث خطأ أثناء تحميل البيانات</p>
        </div>
      ) : (
        <div className="h-64 bg-gray-50 rounded-lg mb-6 flex items-end justify-between p-4">
          {displayData.map((item, index) => {
            const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            return (
              <div
                key={index}
                className="bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer relative group"
                style={{ 
                  height: `${Math.max(height, 5)}%`, 
                  width: "6%" 
                }}
                title={`${item.date}: ${item.count} طلب`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.count}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
            <p className="text-lg font-bold text-gray-900">{usersGrowth}</p>
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
            <p className="text-lg font-bold text-gray-900">{consultationsGrowth}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartWidget;
