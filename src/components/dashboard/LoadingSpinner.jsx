import React from "react";

const LoadingSpinner = ({
  size = "md",
  color = "blue",
  text = "",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const colorClasses = {
    blue: "border-blue-600",
    green: "border-green-600",
    red: "border-red-600",
    yellow: "border-yellow-600",
    gray: "border-gray-600",
    white: "border-white",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2 space-y-reverse">
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}
        />
        {text && <p className="text-sm text-gray-600 text-center">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
