import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiFileText,
  FiUpload,
  FiX,
  FiBriefcase,
  FiCalendar,
  FiLinkedin,
  FiGlobe,
  FiArrowDown,
  FiCheck,
  FiLoader,
} from "react-icons/fi";
import publicRoleService from "../services/publicRoleService";
import joinTeamApplicationService from "../services/joinTeamApplicationService";

const JoinTeam = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const isRTL = lang === "ar";

  const [selectedRole, setSelectedRole] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const formRef = useRef(null);
  const rolesRef = useRef(null);

  // Fetch roles from API
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: ["publicRoles", lang],
    queryFn: () => publicRoleService.getPublicRoles({ language: lang }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch role categories
  const { data: categoriesData } = useQuery({
    queryKey: ["roleCategories", lang],
    queryFn: () =>
      publicRoleService.getPublicRoleCategories({ language: lang }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const roles = rolesData?.data || [];
  const categories = categoriesData?.data?.categories || [];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    dateOfBirth: "",
    linkedin: "",
    website: "",
    experience: "",
    education: "",
    skills: "",
    motivation: "",
    additionalInfo: "",
  });

  // Scroll to form when role is selected
  useEffect(() => {
    if (selectedRole && formRef.current) {
      setTimeout(() => {
        formRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  }, [selectedRole]);

  const handleRoleSelection = (roleId) => {
    setSelectedRole(roleId);
    setShowForm(true);
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollToRoles = () => {
    if (rolesRef.current) {
      rolesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert(t("joinTeamFileSizeError", "File size must be less than 5MB"));
        return;
      }
      setCvFile(file);
    }
  };

  const removeFile = () => {
    setCvFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      alert(t("joinTeamSelectRoleError", "Please select a role"));
      return;
    }
    if (!cvFile) {
      alert(t("joinTeamUploadCvError", "Please upload your CV"));
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit application
      const formDataToSend = new FormData();
      formDataToSend.append("roleId", selectedRole);
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("linkedin", formData.linkedin);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("education", formData.education);
      formDataToSend.append("skills", formData.skills);
      formDataToSend.append("motivation", formData.motivation);
      formDataToSend.append("additionalInfo", formData.additionalInfo);
      if (cvFile) {
        formDataToSend.append("cv", cvFile);
      }

      const response = await joinTeamApplicationService.createApplication(
        formDataToSend
      );

      // Check if the response is successful
      if (response.data && response.data.success) {
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          country: "",
          dateOfBirth: "",
          linkedin: "",
          website: "",
          experience: "",
          education: "",
          skills: "",
          motivation: "",
          additionalInfo: "",
        });
        setSelectedRole("");
        setCvFile(null);
        setShowForm(false);

        alert(
          t(
            "joinTeamSuccessMessage",
            "Your application has been submitted successfully! We will review it and get back to you soon."
          )
        );
      } else {
        throw new Error(response.data?.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Application submission error:", error);

      // Handle different types of errors
      let errorMessage = t(
        "joinTeamErrorMessage",
        "Failed to submit application. Please try again."
      );

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{t("joinTeamPageTitle", "Join Our Team")} | SOSLAW</title>
        <meta
          name="description"
          content={t(
            "joinTeamMetaDesc",
            "Join SOSLAW team and be part of the digital legal services revolution. We're looking for specialized talents in various fields"
          )}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-[#09142b] via-[#1a2a4a] to-[#09142b] py-20 px-4 md:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-[#c8a45e] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#e7cfa7] rounded-full blur-3xl"></div>
        </div>

        <div
          className="max-w-4xl mx-auto text-center relative z-10 font-arabic"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <h1
            className={`font-bold text-white mb-6 ${
              isRTL ? "text-3xl md:text-5xl" : "text-4xl md:text-5xl"
            }`}
          >
            {t("joinTeamPageTitle", "Join Our Team")}
          </h1>
          <p
            className={`text-[#e7cfa7] max-w-2xl mx-auto ${
              isRTL ? "text-sm md:text-xl" : "text-lg md:text-xl"
            }`}
          >
            {t(
              "joinTeamHeroDesc",
              "Be part of the digital legal services revolution. We're looking for specialized and passionate talents to build the future of law"
            )}
          </p>
        </div>
      </section>

      {/* Application Form Section */}
      <section
        className="w-full bg-[#faf6f0] py-16 px-4 md:px-8 font-arabic"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-4xl mx-auto">
          {/* Role Selection */}
          <div className="mb-12 font-arabic">
            <div className="text-center mb-10">
              <h2
                className={`font-bold text-[#09142b] mb-4 ${
                  isRTL ? "text-2xl md:text-4xl" : "text-3xl md:text-4xl"
                }`}
              >
                {t("joinTeamSelectRole", "Choose the Right Role for You")}
              </h2>
              <p
                className={`text-[#6b7280] max-w-2xl mx-auto ${
                  isRTL ? "text-sm md:text-lg" : "text-lg"
                }`}
              >
                {t(
                  "joinTeamSelectRoleDesc",
                  "Choose the role that matches your skills and experience. You can review the details of each role before applying"
                )}
              </p>
            </div>

            {/* Role Categories */}
            <div className="mb-8">
              {rolesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <FiLoader
                    className={`animate-spin text-[#c8a45e] ${
                      isRTL ? "text-xl md:text-2xl" : "text-2xl"
                    }`}
                  />
                  <span
                    className={`mr-3 text-[#6b7280] ${
                      isRTL ? "text-sm md:text-base" : "text-base"
                    }`}
                  >
                    {t("loading", "Loading...")}
                  </span>
                </div>
              ) : rolesError ? (
                <div className="text-center py-8">
                  <p
                    className={`text-red-600 mb-4 ${
                      isRTL ? "text-sm md:text-base" : "text-base"
                    }`}
                  >
                    {t("errorLoadingData", "Error loading data")}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className={`px-4 py-2 bg-[#09142b] text-white rounded-lg hover:bg-[#1a2a4a] transition-colors ${
                      isRTL ? "text-sm md:text-base" : "text-base"
                    }`}
                  >
                    {t("tryAgainLater", "Try Again")}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        isRTL ? "text-xs md:text-sm" : "text-sm"
                      } ${
                        selectedCategory === ""
                          ? "bg-[#09142b] text-white shadow-lg"
                          : "bg-white text-[#6b7280] border-2 border-[#e7cfa7] hover:border-[#c8a45e] hover:text-[#09142b]"
                      }`}
                    >
                      {t("joinTeamAllRoles", "All Roles")}
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                          isRTL ? "text-xs md:text-sm" : "text-sm"
                        } ${
                          selectedCategory === category
                            ? "bg-[#09142b] text-white shadow-lg"
                            : "bg-white text-[#6b7280] border-2 border-[#e7cfa7] hover:border-[#c8a45e] hover:text-[#09142b]"
                        }`}
                      >
                        {t(`roleCategory.${category}`, category)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Roles Grid */}
            {!rolesLoading && !rolesError && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {roles
                  .filter((role) => {
                    if (selectedCategory === "") return true;
                    return role.category === selectedCategory;
                  })
                  .map((role) => (
                    <div
                      key={role.id}
                      className={`group relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg min-h-[300px] sm:min-h-[320px] flex flex-col ${
                        selectedRole === role.id
                          ? "border-[#c8a45e] bg-gradient-to-br from-white to-[#faf6f0] shadow-md"
                          : "border-[#e7cfa7] bg-white hover:border-[#c8a45e]"
                      }`}
                    >
                      {/* Selection Indicator */}
                      {selectedRole === role.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#c8a45e] rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Role Icon */}
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                        {role.icon}
                      </div>

                      {/* Role Title */}
                      <h3
                        className={`font-bold text-[#09142b] mb-2 group-hover:text-[#c8a45e] transition-colors duration-300 ${
                          isRTL
                            ? "text-sm sm:text-base"
                            : "text-base sm:text-lg"
                        }`}
                      >
                        {role.title}
                      </h3>

                      {/* Role Description - Truncated */}
                      <p
                        className={`text-[#6b7280] leading-relaxed mb-2 sm:mb-3 line-clamp-3 flex-grow ${
                          isRTL ? "text-xs sm:text-xs" : "text-xs sm:text-sm"
                        }`}
                      >
                        {role.description.length > 120
                          ? `${role.description.substring(0, 120)}...`
                          : role.description}
                      </p>

                      {/* Quick Info */}
                      <div className="flex items-center justify-between text-xs text-[#6b7280] mb-2 sm:mb-3">
                        <span className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#c8a45e] rounded-full"></div>
                          <span className="text-xs">
                            {t(`roleCategory.${role.category}`, role.category)}
                          </span>
                        </span>
                        <span className="text-xs">
                          {role.type || "Full-time"}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                        <button
                          type="button"
                          onClick={() => handleRoleSelection(role.id)}
                          className={`flex-1 py-2 px-2 sm:px-3 rounded-lg font-semibold transition-all duration-300 ${
                            isRTL ? "text-xs sm:text-xs" : "text-xs sm:text-sm"
                          } ${
                            selectedRole === role.id
                              ? "bg-[#09142b] text-white"
                              : "bg-[#faf6f0] text-[#09142b] hover:bg-[#c8a45e] hover:text-white"
                          }`}
                        >
                          {selectedRole === role.id
                            ? t("joinTeamSelected", "Selected")
                            : t("joinTeamSelect", "Select")}
                        </button>
                        <Link
                          to={`/role/${role.slug}`}
                          className={`flex-1 py-2 px-2 sm:px-3 rounded-lg font-semibold bg-[#09142b] text-white hover:bg-[#1a2a4a] transition-all duration-300 text-center ${
                            isRTL ? "text-xs sm:text-xs" : "text-xs sm:text-sm"
                          }`}
                        >
                          {t("seeMore", "See More")}
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* No Roles Message */}
            {roles.filter((role) => {
              if (selectedRole === "") return true;
              if (selectedRole === "content") {
                return [
                  "legal-content-creator",
                  "legal-content-editor",
                  "graphic-designer",
                ].includes(role.id);
              }
              if (selectedRole === "administrative") {
                return [
                  "administrative-manager",
                  "legal-accounting-specialist",
                ].includes(role.id);
              }
              if (selectedRole === "training") {
                return ["legal-instructor-new"].includes(role.id);
              }
              if (selectedRole === "legal") {
                return ["lawyer", "legal-advisor"].includes(role.id);
              }
              return true;
            }).length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3
                  className={`font-semibold text-[#09142b] mb-2 ${
                    isRTL ? "text-lg md:text-xl" : "text-xl"
                  }`}
                >
                  {t("joinTeamNoRolesFound", "No Roles Available")}
                </h3>
                <p
                  className={`text-[#6b7280] ${
                    isRTL ? "text-sm md:text-base" : "text-base"
                  }`}
                >
                  {t(
                    "joinTeamNoRolesDesc",
                    "Try selecting a different category or check available roles"
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Role Selection Success Message */}
          {selectedRole && (
            <div className="bg-gradient-to-r from-[#c8a45e] to-[#b48b5a] text-white rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <FiCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3
                      className={`font-bold mb-1 ${
                        isRTL ? "text-lg md:text-xl" : "text-xl"
                      }`}
                    >
                      {t("joinTeamRoleSelected", "Role Selected Successfully!")}
                    </h3>
                    <p
                      className={`text-white/90 ${
                        isRTL ? "text-sm md:text-base" : "text-base"
                      }`}
                    >
                      {t(
                        "joinTeamRoleSelectedDesc",
                        "You have selected the role"
                      )}{" "}
                      {t(roles.find((r) => r.id === selectedRole)?.title || "")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={scrollToForm}
                  className={`flex items-center space-x-2 space-x-reverse bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isRTL ? "text-sm md:text-base" : "text-base"
                  }`}
                >
                  <span>{t("joinTeamContinueToForm", "Continue to Form")}</span>
                  <FiArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Application Form */}
          {showForm && (
            <div
              ref={formRef}
              className="bg-white rounded-2xl p-8 shadow-xl border border-[#e7cfa7] font-arabic relative"
            >
              {/* Form Header with Role Info */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e7cfa7]">
                <div>
                  <h3
                    className={`font-bold text-[#09142b] mb-2 ${
                      isRTL ? "text-xl md:text-2xl" : "text-2xl"
                    }`}
                  >
                    {t("joinTeamApplicationForm", "Application Form")}
                  </h3>
                  <p
                    className={`text-[#6b7280] ${
                      isRTL ? "text-sm md:text-base" : "text-base"
                    }`}
                  >
                    {t(
                      "joinTeamFormDesc",
                      "Complete the following form to apply for the role"
                    )}{" "}
                    {t(roles.find((r) => r.id === selectedRole)?.title || "")}
                  </p>
                </div>
                <button
                  onClick={scrollToRoles}
                  className="text-[#c8a45e] hover:text-[#b48b5a] transition-colors duration-300"
                  title={t("joinTeamChangeRole", "Change Role")}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-[#09142b] font-semibold mb-2 ${
                        isRTL ? "text-sm md:text-base" : "text-base"
                      }`}
                    >
                      {t("joinTeamFullName", "Full Name")} *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                        placeholder={t(
                          "joinTeamFullNamePlaceholder",
                          "Enter your full name"
                        )}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("joinTeamEmail", "Email")} *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                        placeholder={t(
                          "joinTeamEmailPlaceholder",
                          "Enter your email"
                        )}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("joinTeamPhone", "Phone Number")} *
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                        placeholder={t(
                          "joinTeamPhonePlaceholder",
                          "Enter your phone number"
                        )}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("joinTeamDateOfBirth", "Date of Birth")}
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("joinTeamAddress", "Address")} *
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                        placeholder={t(
                          "joinTeamAddressPlaceholder",
                          "Enter your address"
                        )}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("joinTeamCity", "City")} *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                      placeholder={t(
                        "joinTeamCityPlaceholder",
                        "Enter your city"
                      )}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("joinTeamCountry", "Country")} *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                      placeholder={t(
                        "joinTeamCountryPlaceholder",
                        "Enter your country"
                      )}
                      required
                    />
                  </div>
                </div>

                {/* Professional Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("joinTeamLinkedin", "LinkedIn")} (
                      {t("optional", "Optional")})
                    </label>
                    <div className="relative">
                      <FiLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                        placeholder={t(
                          "joinTeamLinkedinPlaceholder",
                          "LinkedIn profile URL"
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("joinTeamWebsite", "Website")} (
                      {t("optional", "Optional")})
                    </label>
                    <div className="relative">
                      <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280]" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                        placeholder={t(
                          "joinTeamWebsitePlaceholder",
                          "Your website URL"
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("joinTeamExperience", "Work Experience")} *
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                      placeholder={t(
                        "joinTeamExperiencePlaceholder",
                        "Describe your previous work experience"
                      )}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("joinTeamEducation", "Education")} *
                    </label>
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                      placeholder={t(
                        "joinTeamEducationPlaceholder",
                        "Describe your educational qualifications"
                      )}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#09142b] font-semibold mb-2">
                    {t("joinTeamSkills", "Skills")} *
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                    placeholder={t(
                      "joinTeamSkillsPlaceholder",
                      "List your main skills"
                    )}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#09142b] font-semibold mb-2">
                    {t("joinTeamMotivation", "Motivation to Join")} *
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                    placeholder={t(
                      "joinTeamMotivationPlaceholder",
                      "Explain why you want to join our team"
                    )}
                    required
                  />
                </div>

                {/* CV Upload */}
                <div>
                  <label className="block text-[#09142b] font-semibold mb-2">
                    {t("joinTeamCvUpload", "Upload CV")} *
                  </label>
                  {!cvFile ? (
                    <div className="border-2 border-dashed border-[#e7cfa7] rounded-xl p-8 text-center hover:border-[#c8a45e] transition-colors">
                      <FiUpload className="mx-auto text-4xl text-[#6b7280] mb-4" />
                      <p className="text-[#6b7280] mb-2">
                        {t(
                          "joinTeamCvUploadText",
                          "Drag and drop your CV file here or"
                        )}
                      </p>
                      <label className="cursor-pointer">
                        <span className="text-[#c8a45e] font-semibold hover:text-[#09142b] transition-colors">
                          {t("joinTeamCvUploadButton", "Choose File")}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                          required
                        />
                      </label>
                      <p className="text-sm text-[#6b7280] mt-2">
                        {t(
                          "joinTeamCvUploadFormat",
                          "PDF, DOC, DOCX (Max 5MB)"
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="border border-[#e7cfa7] rounded-xl p-4 bg-[#faf6f0]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FiFileText className="text-[#c8a45e] text-xl" />
                          <div>
                            <p className="font-semibold text-[#09142b]">
                              {cvFile.name}
                            </p>
                            <p className="text-sm text-[#6b7280]">
                              {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-[#6b7280] hover:text-[#09142b] transition-colors"
                        >
                          <FiX size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-[#09142b] font-semibold mb-2">
                    {t("joinTeamAdditionalInfo", "Additional Information")}
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                    placeholder={t(
                      "joinTeamAdditionalInfoPlaceholder",
                      "Any additional information you want to add"
                    )}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#09142b] to-[#1a2a4a] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#1a2a4a] hover:to-[#09142b] transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRTL ? "text-sm md:text-lg" : "text-lg"
                  }`}
                >
                  {isSubmitting
                    ? t("joinTeamSubmitting", "Submitting...")
                    : t("joinTeamSubmit", "Submit Application")}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default JoinTeam;
