import React from "react";
import { getFirstLetterOfName } from "../../utils/nameUtils";

const Avatar = ({
  src,
  alt,
  name,
  size = "md",
  className = "",
  showBorder = true,
  fallbackBg = "gradient",
}) => {
  // Check if image exists and is valid
  const hasValidImage =
    src && src !== "" && src !== "null" && src !== "undefined";

  // Get the first letter of the name (skipping titles)
  const firstLetter = getFirstLetterOfName(name || alt || "?");

  // Size classes
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
    "3xl": "w-24 h-24 text-3xl",
  };

  // Background styles
  const bgStyles = {
    gradient: {
      background: "linear-gradient(135deg, #c8a45e 0%, #b48b5a 100%)",
      color: "white",
    },
    solid: {
      background: "#c8a45e",
      color: "white",
    },
    gray: {
      background: "#6b7280",
      color: "white",
    },
  };

  return (
    <div className={`relative ${className}`}>
      {/* Image Avatar */}
      {hasValidImage ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className={`${sizeClasses[size]} rounded-full object-cover ${
            showBorder ? "border-2 border-gray-200" : ""
          }`}
          loading="lazy"
          onError={(e) => {
            // Hide the image and show fallback
            e.target.style.display = "none";
            const fallback = e.target.nextSibling;
            if (fallback) fallback.style.display = "flex";
          }}
        />
      ) : null}

      {/* Fallback Avatar with First Letter */}
      <div
        className={`${
          sizeClasses[size]
        } rounded-full flex items-center justify-center font-bold ${
          hasValidImage ? "hidden" : "flex"
        } ${showBorder ? "border-2 border-gray-200" : ""}`}
        style={{
          ...bgStyles[fallbackBg],
          display: hasValidImage ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          lineHeight: "1",
          fontSize: "inherit",
          fontWeight: "bold",
          userSelect: "none",
        }}
      >
        <span style={{ display: "block", width: "100%", textAlign: "center" }}>
          {firstLetter}
        </span>
      </div>
    </div>
  );
};

export default Avatar;
