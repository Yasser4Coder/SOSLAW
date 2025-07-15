import React, { useEffect, useRef } from "react";

const TestimonialCard = ({ isRTL = false, quote, name, role, avatar }) => {
  const cardRef = useRef(null);
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.classList.add("opacity-100", "translate-y-0");
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-3xl shadow-xl p-6 md:p-10 bg-white/80 backdrop-blur border border-[#e7cfa7] w-full max-w-full md:max-w-lg mx-auto opacity-0 translate-y-8 transition-all duration-700`}
      aria-label="Testimonial"
    >
      {/* Modern Quote Icon */}
      <svg
        className={`absolute -top-8 ${
          isRTL ? "-left-8" : "-right-8"
        } w-16 h-16 text-[#c8a45e] opacity-30`}
        fill="none"
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <path
          d="M20 44c0-12 12-12 12-24V8H8v12c0 12 12 12 12 24zm32 0c0-12 12-12 12-24V8H40v12c0 12 12 12 12 24z"
          fill="currentColor"
        />
      </svg>
      {/* Quote Text */}
      <blockquote
        className={`relative text-[#09142b] text-lg md:text-2xl font-serif italic mb-6 leading-relaxed pl-4 pr-4 ${
          isRTL
            ? "md:pr-8 md:border-r-4 border-[#c8a45e] text-right"
            : "md:pl-8 md:border-l-4 border-[#c8a45e] text-left"
        }`}
      >
        {quote}
      </blockquote>
      {/* Author Info */}
      <div className={`flex items-center gap-4 ${isRTL ? "justify-end" : ""}`}>
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c8a45e] to-[#e7cfa7] flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-white font-bold text-2xl">{name[0]}</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-[#c8a45e] font-bold text-lg underline underline-offset-4 decoration-[#c8a45e]">
            {name}
          </span>
          <span className="text-[#09142b] text-sm opacity-80">{role}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
