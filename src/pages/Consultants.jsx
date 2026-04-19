import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import publicConsultantService from "../services/publicConsultantService";
import ConsultantCard from "./components/ConsultantCard";
import { FiLoader, FiSearch, FiArrowRight } from "react-icons/fi";

const Consultants = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "ar";
  const isRTL = lang === "ar";
  const [search, setSearch] = useState("");

  const {
    data: consultantsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["publicConsultantsAll", lang],
    queryFn: async () => {
      const result = await publicConsultantService.getAllConsultants({
        language: lang,
        status: "active",
        limit: 100,
      });
      return result;
    },
    staleTime: 10 * 60 * 1000,
  });

  const consultants = consultantsData?.data?.consultants || [];

  const filteredConsultants = useMemo(() => {
    if (!search.trim()) return consultants;
    const q = search.trim().toLowerCase();
    return consultants.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.specialization && c.specialization.toLowerCase().includes(q))
    );
  }, [consultants, search]);

  return (
    <>
      <Helmet>
        <title>{t("consultantsTitle")} | SOSLAW</title>
        <meta
          name="description"
          content={t("consultantsDesc")}
        />
      </Helmet>

      <div
        className="relative min-h-screen overflow-hidden py-10 sm:py-14"
        style={{
          background: "linear-gradient(165deg, #f5f0e8 0%, #faf6f0 35%, #f2ebe0 100%)",
        }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Background effects - same as home consultants section */}
        <div className="pointer-events-none absolute inset-0 z-0 min-h-full" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(200, 164, 94, 0.22) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 110% 110%, rgba(9, 20, 43, 0.14) 0%, transparent 50%), radial-gradient(ellipse 60% 45% at -10% 90%, rgba(200, 164, 94, 0.16) 0%, transparent 50%)",
            }}
          />
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[#c8a45e] opacity-20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-[#09142b] opacity-15 blur-3xl" />
          <div className="absolute right-[15%] top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#c8a45e] opacity-15 blur-2xl" />
          <div className="absolute left-[20%] top-1/3 h-40 w-40 rounded-full bg-[#09142b] opacity-10 blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(rgba(9, 20, 43, 0.4) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(9, 20, 43, 0.4) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div
            className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 opacity-20"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(9, 20, 43, 0.15) 25%, rgba(200, 164, 94, 0.35) 50%, rgba(9, 20, 43, 0.15) 75%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-[#09142b] sm:text-4xl">
              {t("consultantsTitle")}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              {t("consultantsDesc")}
            </p>
          </header>

          {/* Search */}
          <div className="mb-10">
            <label htmlFor="consultant-search" className="sr-only">
              {t("consultantsPageSearchPlaceholder")}
            </label>
            <div className="relative max-w-md mx-auto">
              <FiSearch
                className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? "right-4" : "left-4"}`}
                aria-hidden
              />
              <input
                id="consultant-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("consultantsPageSearchPlaceholder")}
                className={`w-full rounded-xl border border-slate-200 bg-white py-3 text-slate-800 placeholder-slate-400 transition focus:border-[#c8a45e] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]/30 ${isRTL ? "pr-12 pl-4 text-right" : "pl-12 pr-4"}`}
              />
            </div>
          </div>

          {/* Content */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <FiLoader className="h-12 w-12 animate-spin text-[#c8a45e]" aria-hidden />
              <p className="mt-4 text-slate-600">
                {t("consultantsPageLoading")}
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
              <p>{error.message}</p>
              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 text-[#09142b] font-medium hover:underline"
              >
                <FiArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                {t("consultantsPageBackHome")}
              </Link>
            </div>
          )}

          {!isLoading && !error && filteredConsultants.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-600">
                {search.trim()
                  ? t("consultantsPageNoResults")
                  : t("consultantsPageNoConsultants")}
              </p>
              {search.trim() && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 text-[#c8a45e] font-medium hover:underline"
                >
                  {t("consultantsPageClearSearch")}
                </button>
              )}
            </div>
          )}

          {!isLoading && !error && filteredConsultants.length > 0 && (
            <>
              <p className="mb-6 text-center text-slate-600">
                {t("consultantsPageCount", { count: filteredConsultants.length })}
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredConsultants.map((consultant) => (
                  <ConsultantCard
                    key={consultant.id}
                    name={consultant.name}
                    title={consultant.title}
                    bio={consultant.specialization}
                    img={consultant.imageUrl}
                    rating={consultant.rating}
                    consultations={consultant.consultations}
                    experience={consultant.experience}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Consultants;
