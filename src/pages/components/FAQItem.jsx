import React, { useRef, useEffect, useState } from "react";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";

const FAQItem = ({ idx, faq, isOpen, onToggle, isRTL }) => {
  const contentRef = useRef(null);
  const [showFade, setShowFade] = useState(false);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const el = contentRef.current;
      setShowFade(el.scrollHeight > el.clientHeight + 2);
    } else {
      setShowFade(false);
    }
  }, [isOpen, faq.a]);

  return (
    <div
      className={`rounded-xl border bg-white shadow-sm transition-all duration-200 ${
        isOpen
          ? "border-[#c8a45e]/40 shadow-md"
          : "border-slate-200/90 hover:border-slate-300"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <button
        type="button"
        className={`flex w-full items-center gap-3 px-4 py-4 text-start transition-colors focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-inset sm:gap-4 sm:px-5 sm:py-4 ${
          isOpen ? "bg-slate-50/80" : "hover:bg-slate-50/50"
        }`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${idx}`}
        onClick={onToggle}
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#c8a45e] transition-colors sm:h-9 sm:w-9 ${
            isOpen ? "bg-[#c8a45e]/15" : "bg-slate-100"
          }`}
          aria-hidden
        >
          <FiHelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <span className="min-h-[2rem] flex-1 font-semibold leading-snug text-[#09142b] text-sm sm:text-base">
          {faq.q}
        </span>
        <FiChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#c8a45e]" : ""
          }`}
          aria-hidden
        />
      </button>
      <div
        id={`faq-panel-${idx}`}
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-[28rem]" : "max-h-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className={`border-t border-slate-100 ${
            isRTL ? "border-r-4 border-r-[#c8a45e]" : "border-l-4 border-l-[#c8a45e]"
          } bg-slate-50/50`}
          style={{
            direction: isRTL ? "rtl" : "ltr",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
            <div
              ref={contentRef}
              className="relative max-h-60 overflow-y-auto pr-2"
              tabIndex={isOpen ? 0 : -1}
              aria-live="polite"
            >
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
                {faq.a}
              </p>
              {showFade && (
                <div
                  className="pointer-events-none absolute bottom-0 h-8 w-full"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(248,250,252,0.9), transparent)",
                  }}
                  aria-hidden
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
