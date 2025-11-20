import React from "react";

const Logo = ({ size = "default", className = "" }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-12 h-12";
      case "medium":
        return "w-16 h-16";
      case "large":
        return "w-20 h-20";
      case "xl":
        return "w-24 h-24";
      default:
        return "w-20 h-20";
    }
  };

  return (
    <div className={`${getSizeClasses()} ${className}`}>
      <img
        src="/logo.svg"
        alt="SOS Law Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;
