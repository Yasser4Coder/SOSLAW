import React from "react";
import { FiClock } from "react-icons/fi";
import Avatar from "../../components/common/Avatar";

const ConsultantCard = ({
  name,
  title,
  bio,
  img,
  rating,
  consultations,
  experience,
}) => {
  const hasImage = img && img !== "" && img !== "null" && img !== "undefined";

  return (
    <article
      className="group flex h-full min-h-[400px] cursor-pointer flex-col overflow-hidden rounded-xl border border-transparent bg-white shadow-md shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:border-[#c8a45e]/20 hover:shadow-xl hover:shadow-slate-300/40 focus-within:-translate-y-1 focus-within:border-[#c8a45e]/25 focus-within:shadow-xl focus:outline-none sm:min-h-[440px]"
      tabIndex={0}
      aria-label={`Consultant: ${name}`}
    >
      {/* Photo - responsive height so mobile isn't too tall */}
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-64 md:h-72 lg:h-80">
        {hasImage ? (
          <img
            src={img}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              const next = e.target.nextElementSibling;
              if (next) next.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-[#09142b] to-[#162544] ${hasImage ? "hidden" : ""}`}
          aria-hidden
        >
          <Avatar
            src={null}
            alt={name}
            name={name}
            size="2xl"
            showBorder={false}
            fallbackBg="gradient"
          />
        </div>
      </div>

      {/* Content - consistent heights so cards align */}
      <div className="flex min-h-[180px] flex-1 flex-col p-4 sm:p-5 sm:pt-4">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-bold tracking-tight text-[#09142b] sm:min-h-[3rem] sm:text-lg" dir="auto" title={name}>
          {name}
        </h3>
        {title && (
          <p className="mt-1 line-clamp-1 min-h-[1.5rem] text-sm font-medium text-[#c8a45e]" dir="auto" title={title}>
            {title}
          </p>
        )}
        {bio && (
          <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-slate-500 sm:min-h-[4rem]" dir="auto">
            {bio}
          </p>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 sm:mt-5">
          <div className="h-0.5 w-12 shrink-0 rounded-full bg-[#c8a45e]/60" aria-hidden />
          {experience && (
            <div className="mt-3 flex min-h-[1.5rem] items-center gap-2 text-slate-500">
              <FiClock className="h-4 w-4 shrink-0 text-[#c8a45e]/80" aria-hidden />
              <span className="truncate text-xs">{experience}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ConsultantCard;
