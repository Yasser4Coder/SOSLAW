import React, { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollToTop } = useSmoothScroll();

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const handleClick = () => {
    scrollToTop();
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={handleClick}
          className="fixed bottom-8 right-8 z-50 bg-[#c8a45e] hover:bg-[#b48b5a] text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2"
          aria-label="Back to top"
        >
          <FiArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default BackToTop;
