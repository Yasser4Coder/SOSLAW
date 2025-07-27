import React from "react";

const RecentActivity = ({ activities }) => {
  const getActivityColor = (type) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          النشاطات الأخيرة
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          عرض الكل
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-3 space-x-reverse"
            >
              <div
                className={`p-2 rounded-full bg-gray-100 ${getActivityColor(
                  activity.type
                )}`}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.message}
                </p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
