/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import {
  FiArrowLeft,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiAward,
  FiCheckCircle,
  FiBook,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiCalendar,
  FiStar,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiLoader,
  FiTag,
  FiHash,
} from "react-icons/fi";
import publicRoleService from "../services/publicRoleService";

const RoleDetails = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const isRTL = lang === "ar";

  const [activeTab, setActiveTab] = useState("overview");

  // Fetch role details from API
  const {
    data: roleData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roleDetails", roleId, lang],
    queryFn: () => publicRoleService.getRoleBySlug(roleId, { language: lang }),
    enabled: !!roleId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const role = roleData?.data;

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-[#c8a45e] text-3xl mx-auto mb-4" />
          <p className="text-[#09142b]">{t("loading", "Loading...")}</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {t("errorLoadingData", "Error loading data")}
          </p>
          <button
            onClick={() => navigate("/join-team")}
            className="px-4 py-2 bg-[#09142b] text-white rounded-lg hover:bg-[#1a2a4a] transition-colors"
          >
            {t("backToRoles", "Back to Roles")}
          </button>
        </div>
      </div>
    );
  }

  // Handle role not found
  if (!role) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#09142b] mb-4">
            {t("roleNotFound", "Role not found")}
          </p>
          <button
            onClick={() => navigate("/join-team")}
            className="px-4 py-2 bg-[#09142b] text-white rounded-lg hover:bg-[#1a2a4a] transition-colors"
          >
            {t("backToRoles", "Back to Roles")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{role.title} | SOSLAW</title>
        <meta name="description" content={role.description} />
      </Helmet>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-[#09142b] via-[#1a2a4a] to-[#09142b] py-20 px-4 md:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-[#c8a45e] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#e7cfa7] rounded-full blur-3xl"></div>
        </div>

        <div
          className="max-w-4xl mx-auto relative z-10 font-arabic"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate("/join-team")}
            className="flex items-center text-[#e7cfa7] hover:text-white transition-colors mb-8 group"
          >
            <FiArrowLeft className="ml-2 group-hover:-translate-x-1 transition-transform" />
            {t("backToRoles", "Back to Roles")}
          </button>

          {/* Role Header */}
          <div className="text-center">
            <div className="text-4xl md:text-6xl mb-6">{role.icon}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {role.title}
            </h1>
            <p className="text-[#e7cfa7] text-lg md:text-xl max-w-2xl mx-auto mb-8">
              {role.description}
            </p>

            {/* Quick Info */}
            <div className="flex flex-wrap justify-center gap-6 text-[#e7cfa7]">
              <div className="flex items-center gap-2">
                <FiMapPin className="text-[#c8a45e]" />
                <span>{role.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-[#c8a45e]" />
                <span>{role.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-[#c8a45e]" />
                <span>{role.salary}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="text-[#c8a45e]" />
                <span>{role.experience}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section
        className="w-full bg-[#faf6f0] py-16 px-4 md:px-8 font-arabic"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "overview"
                  ? "bg-[#09142b] text-white shadow-lg"
                  : "bg-white text-[#6b7280] border-2 border-[#e7cfa7] hover:border-[#c8a45e] hover:text-[#09142b]"
              }`}
            >
              {t("overview", "Overview")}
            </button>
            <button
              onClick={() => setActiveTab("requirements")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "requirements"
                  ? "bg-[#09142b] text-white shadow-lg"
                  : "bg-white text-[#6b7280] border-2 border-[#e7cfa7] hover:border-[#c8a45e] hover:text-[#09142b]"
              }`}
            >
              {t("requirements", "Requirements")}
            </button>
            <button
              onClick={() => setActiveTab("responsibilities")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "responsibilities"
                  ? "bg-[#09142b] text-white shadow-lg"
                  : "bg-white text-[#6b7280] border-2 border-[#e7cfa7] hover:border-[#c8a45e] hover:text-[#09142b]"
              }`}
            >
              {t("responsibilities", "Responsibilities")}
            </button>
            <button
              onClick={() => setActiveTab("benefits")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "benefits"
                  ? "bg-[#09142b] text-white shadow-lg"
                  : "bg-white text-[#6b7280] border-2 border-[#e7cfa7] hover:border-[#c8a45e] hover:text-[#09142b]"
              }`}
            >
              {t("benefits", "Benefits")}
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "skills"
                  ? "bg-[#09142b] text-white shadow-lg"
                  : "bg-white text-[#6b7280] border-2 border-[#e7cfa7] hover:border-[#c8a45e] hover:text-[#09142b]"
              }`}
            >
              {t("skills", "Skills")}
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-[#09142b] mb-4">
                    {t("roleOverview", "Role Overview")}
                  </h3>
                  <p className="text-[#6b7280] leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#faf6f0] p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <FiMapPin className="text-[#c8a45e] text-xl" />
                      <h4 className="font-semibold text-[#09142b]">
                        {t("location", "Location")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">{role.location}</p>
                  </div>

                  <div className="bg-[#faf6f0] p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <FiClock className="text-[#c8a45e] text-xl" />
                      <h4 className="font-semibold text-[#09142b]">
                        {t("employmentType", "Employment Type")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">{role.type}</p>
                  </div>

                  <div className="bg-[#faf6f0] p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <FiDollarSign className="text-[#c8a45e] text-xl" />
                      <h4 className="font-semibold text-[#09142b]">
                        {t("salary", "Salary")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">{role.salary}</p>
                  </div>

                  <div className="bg-[#faf6f0] p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <FiUsers className="text-[#c8a45e] text-xl" />
                      <h4 className="font-semibold text-[#09142b]">
                        {t("experience", "Experience")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">{role.experience}</p>
                  </div>

                  <div className="bg-[#faf6f0] p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <FiTag className="text-[#c8a45e] text-xl" />
                      <h4 className="font-semibold text-[#09142b]">
                        {t("category", "Category")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">
                      {role.category === "administrative" && "إداري"}
                      {role.category === "content" && "محتوى"}
                      {role.category === "legal" && "قانوني"}
                      {role.category === "training" && "تدريب"}
                    </p>
                  </div>

                  <div className="bg-[#faf6f0] p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <FiHash className="text-[#c8a45e] text-xl" />
                      <h4 className="font-semibold text-[#09142b]">
                        {t("roleId", "Role ID")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">#{role.id}</p>
                  </div>

                  <div className="bg-[#faf6f0] p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <FiBook className="text-[#c8a45e] text-xl" />
                      <h4 className="font-semibold text-[#09142b]">
                        {t("slug", "Slug")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">{role.slug}</p>
                  </div>

                  <div className="bg-[#faf6f0] p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <FiTrendingUp className="text-[#c8a45e] text-xl" />
                      <h4 className="font-semibold text-[#09142b]">
                        {t("order", "Order")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">{role.order}</p>
                  </div>

                  <div className="bg-[#faf6f0] p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <FiCheckCircle className="text-[#c8a45e] text-xl" />
                      <h4 className="font-semibold text-[#09142b]">
                        {t("status", "Status")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">
                      {role.status === "active" ? "نشط" : "غير نشط"}
                    </p>
                  </div>

                  <div className="bg-[#faf6f0] p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <FiCalendar className="text-[#c8a45e] text-xl" />
                      <h4 className="font-semibold text-[#09142b]">
                        {t("createdAt", "Created At")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">
                      {new Date(role.createdAt).toLocaleDateString("ar-SA")}
                    </p>
                  </div>

                  <div className="bg-[#faf6f0] p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <FiCalendar className="text-[#c8a45e] text-xl" />
                      <h4 className="font-semibold text-[#09142b]">
                        {t("updatedAt", "Updated At")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">
                      {new Date(role.updatedAt).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "requirements" && (
              <div>
                <h3 className="text-2xl font-bold text-[#09142b] mb-6">
                  {t("requirements", "Requirements")}
                </h3>
                <div className="space-y-4">
                  {role.requirements &&
                    role.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheckCircle className="text-[#c8a45e] mt-1 flex-shrink-0" />
                        <p className="text-[#6b7280]">{requirement}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "responsibilities" && (
              <div>
                <h3 className="text-2xl font-bold text-[#09142b] mb-6">
                  {t("responsibilities", "Responsibilities")}
                </h3>
                <div className="space-y-4">
                  {role.responsibilities &&
                    role.responsibilities.map((responsibility, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiCheckCircle className="text-[#c8a45e] mt-1 flex-shrink-0" />
                        <p className="text-[#6b7280]">{responsibility}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "benefits" && (
              <div>
                <h3 className="text-2xl font-bold text-[#09142b] mb-6">
                  {t("benefits", "Benefits")}
                </h3>
                <div className="space-y-4">
                  {role.benefits &&
                    role.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FiAward className="text-[#c8a45e] mt-1 flex-shrink-0" />
                        <p className="text-[#6b7280]">{benefit}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div>
                <h3 className="text-2xl font-bold text-[#09142b] mb-6">
                  {t("requiredSkills", "Required Skills")}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {role.skills &&
                    role.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#faf6f0] text-[#09142b] rounded-full text-sm font-medium border border-[#e7cfa7]"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply Button */}
          <div className="text-center mt-12">
            <Link
              to={`/join-team?role=${role.id}`}
              className="inline-flex items-center px-8 py-4 bg-[#09142b] text-white font-semibold rounded-full hover:bg-[#1a2a4a] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FiMail className="ml-2" />
              {t("applyNow", "Apply Now")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default RoleDetails;
