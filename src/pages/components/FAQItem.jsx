import React, { useRef, useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FAQItem = ({ idx, faq, isOpen, onToggle, isRTL }) => {
  const contentRef = useRef(null);
  const [showFade, setShowFade] = useState(false);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const el = contentRef.current;
      setShowFade(el.scrollHeight > el.clientHeight + 2); // +2 for rounding
    } else {
      setShowFade(false);
    }
  }, [isOpen, faq.a]);

  return (
    <div
      className={`rounded-xl bg-white border border-[#e7cfa7] shadow-sm transition-all duration-200 ${
        isOpen ? "shadow-lg" : ""
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <button
        className={`w-full flex items-center justify-between px-6 py-4 font-semibold text-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e] transition-colors group ${
          isRTL ? "text-sm md:text-lg" : "text-lg"
        }`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${idx}`}
        onClick={onToggle}
      >
        <span>{faq.q}</span>
        <FiChevronDown
          className={`ml-2 transition-transform duration-300 text-2xl ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        id={`faq-panel-${idx}`}
        className={`overflow-hidden transition-all duration-300 px-6 ${
          isOpen ? "max-h-96 py-2" : "max-h-0 py-0"
        }`}
        style={{
          direction: isRTL ? "rtl" : "ltr",
          textAlign: isRTL ? "right" : "left",
        }}
        aria-hidden={!isOpen}
      >
        <div
          ref={contentRef}
          className="relative max-h-60 overflow-y-auto pr-2"
          tabIndex={isOpen ? 0 : -1}
          aria-live="polite"
        >
          <p
            className={`text-[#09142b] whitespace-pre-line opacity-90 ${
              isRTL ? "text-sm md:text-base" : "text-base"
            }`}
          >
            {faq.a}
          </p>
          {/* Fade effect at bottom if scrollable */}
          {showFade && (
            <div
              className="pointer-events-none absolute left-0 right-0 bottom-0 h-8"
              style={{
                background: isRTL
                  ? "linear-gradient(to left, rgba(250,246,240,0), #faf6f0 80%)"
                  : "linear-gradient(to bottom, rgba(250,246,240,0), #faf6f0 80%)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
