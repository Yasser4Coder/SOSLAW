import React from "react";
import { Link } from "react-router-dom";

const RecentActivity = ({ activities }) => {
  const getActivityStyles = (type) => {
    switch (type) {
      case "user":
        return "text-blue-600 bg-blue-100";
      case "consultation":
        return "text-green-600 bg-green-100";
      case "contact":
        return "text-purple-600 bg-purple-100";
      case "join":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const safeActivities = Array.isArray(activities) ? activities : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">النشاطات الأخيرة</h3>
        <Link
          to="/dashboard/notifications"
          className="text-sm font-medium text-[#09142b] hover:text-[#1a2a4a]"
        >
          عرض الكل
        </Link>
      </div>
      <div className="space-y-3">
        {safeActivities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 text-sm">لا توجد نشاطات حديثة</p>
            <Link
              to="/dashboard/contact"
              className="inline-block mt-2 text-sm text-[#09142b] hover:underline"
            >
              عرض طلبات التواصل
            </Link>
          </div>
        ) : (
          safeActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id || activity.time}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${getActivityStyles(
                    activity.type
                  )}`}
                >
                  <Icon size={16} className="block" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
