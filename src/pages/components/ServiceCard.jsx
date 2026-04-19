import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiChevronLeft } from "react-icons/fi";

const ServiceCard = ({
  icon: Icon,
  title,
  desc,
  subItems = [],
  route,
  serviceId,
  trustLine: trustLineProp,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const requestLabel = isRTL ? "اطلب الخدمة" : "Request Service";
  const moreLabel = isRTL ? "عرض التفاصيل" : "View Details";
  const serviceTag = isRTL ? "خدمة قانونية" : "Legal Service";
  const defaultTrust = isRTL ? "استشارة احترافية • سرية تامة" : "Professional • Confidential";
  const trustLine = trustLineProp || defaultTrust;

  return (
    <article
      className="group flex h-full min-h-[380px] flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-[#c8a45e]/30 hover:shadow-xl hover:shadow-slate-300/40 focus-within:-translate-y-1 focus-within:shadow-xl focus:outline-none"
      tabIndex={0}
      aria-label={title}
    >
      {/* Service badge */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 sm:px-5 sm:py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#c8a45e]">
          {serviceTag}
        </span>
        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#09142b] text-[#c8a45e] sm:h-9 sm:w-9" aria-hidden>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
        )}
      </div>

      {/* Content - fixed heights so all cards look the same */}
      <div className="flex min-h-[260px] flex-1 flex-col p-4 sm:p-5 sm:pt-4">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-bold leading-snug text-[#09142b] sm:min-h-[3rem] sm:text-xl" dir="auto" title={title}>
          {title}
        </h3>
        {desc && (
          <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-slate-600 sm:min-h-[4rem]" dir="auto">
            {desc}
          </p>
        )}
        {subItems && subItems.length > 0 && (
          <ul
            className={`mt-3 space-y-1.5 text-sm text-slate-600 sm:mt-4 sm:space-y-2 ${
              isRTL ? "text-right" : "text-left"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {subItems.slice(0, 3).map((item) => (
              <li key={item.key} className="flex items-start gap-2">
                <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#c8a45e]" aria-hidden />
                <span className="line-clamp-1">{item.label}</span>
              </li>
            ))}
            {subItems.length > 3 && (
              <li className="text-[#c8a45e] font-medium">
                {isRTL ? "...والمزيد" : "...and more"}
              </li>
            )}
          </ul>
        )}

        {/* Trust line */}
        <div className="mt-3 flex shrink-0 items-center gap-1.5 text-xs text-slate-500 sm:mt-4">
          <FiCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden />
          <span className="truncate">{trustLine}</span>
        </div>

        {/* CTAs - touch-friendly on mobile */}
        <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:gap-3">
          <Link
            to={`/request-service/${serviceId}`}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#c8a45e] px-4 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#b48b5a] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2 sm:px-5"
            aria-label={requestLabel}
          >
            <span className="truncate">{requestLabel}</span>
            <FiArrowLeft className={`h-4 w-4 shrink-0 ${isRTL ? "rotate-180" : ""}`} aria-hidden />
          </Link>
          {route && (
            <Link
              to={route}
              className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium text-[#09142b] transition-colors hover:text-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#09142b] focus:ring-offset-2 focus:ring-offset-white"
              aria-label={moreLabel}
            >
              <span className="truncate">{moreLabel}</span>
              <FiChevronLeft className={`h-4 w-4 shrink-0 ${isRTL ? "rotate-180" : ""}`} aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
