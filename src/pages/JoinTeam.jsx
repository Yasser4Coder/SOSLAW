import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

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
} from "react-icons/fi";

const JoinTeam = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const isRTL = lang === "ar";

  const [selectedRole, setSelectedRole] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const formRef = useRef(null);
  const rolesRef = useRef(null);

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
    expectedSalary: "",
    availability: "",
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

  const roles = [
    {
      id: "legal-writer",
      title: "legalWriter",
      description: "legalWriterDesc",
      icon: "✍️",
    },
    {
      id: "administrative-manager",
      title: "administrativeManager",
      description: "administrativeManagerDesc",
      icon: "📋",
    },
    {
      id: "legal-translator",
      title: "legalTranslator",
      description: "legalTranslatorDesc",
      icon: "🌐",
    },
    {
      id: "legal-trainer",
      title: "legalTrainer",
      description: "legalTrainerDesc",
      icon: "🎓",
    },
    {
      id: "legal-content-creator",
      title: "legalContentCreator",
      description: "legalContentCreatorDesc",
      icon: "🎬",
    },
    {
      id: "digital-platform-manager",
      title: "digitalPlatformManager",
      description: "digitalPlatformManagerDesc",
      icon: "📱",
    },
    {
      id: "legal-content-editor",
      title: "legalContentEditor",
      description: "legalContentEditorDesc",
      icon: "📝",
    },
    {
      id: "legal-instructor",
      title: "legalInstructor",
      description: "legalInstructorDesc",
      icon: "👨‍🏫",
    },
    {
      id: "professional-legal-translator",
      title: "professionalLegalTranslator",
      description: "professionalLegalTranslatorDesc",
      icon: "🔤",
    },
    {
      id: "graphic-designer",
      title: "graphicDesigner",
      description: "graphicDesignerDesc",
      icon: "🎨",
    },
    {
      id: "legal-accounting-specialist",
      title: "legalAccountingSpecialist",
      description: "legalAccountingSpecialistDesc",
      icon: "💰",
    },
  ];

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

    // Simulate form submission
    setTimeout(() => {
      console.log("Application submitted:", { selectedRole, formData, cvFile });
      setIsSubmitting(false);
      alert(
        t(
          "joinTeamSuccessMessage",
          "Your application has been submitted successfully!"
        )
      );
    }, 2000);
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("joinTeamPageTitle", "Join Our Team")}
          </h1>
          <p className="text-[#e7cfa7] text-lg md:text-xl max-w-2xl mx-auto">
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#09142b] mb-4">
                {t("joinTeamSelectRole", "Choose the Right Role for You")}
              </h2>
              <p className="text-[#6b7280] text-lg max-w-2xl mx-auto">
                {t(
                  "joinTeamSelectRoleDesc",
                  "Choose the role that matches your skills and experience. You can review the details of each role before applying"
                )}
              </p>
            </div>

            {/* Role Categories */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button
                  onClick={() => setSelectedRole("")}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedRole === ""
                      ? "bg-[#09142b] text-white shadow-lg"
                      : "bg-white text-[#6b7280] border-2 border-[#e7cfa7] hover:border-[#c8a45e] hover:text-[#09142b]"
                  }`}
                >
                  {t("joinTeamAllRoles", "All Roles")}
                </button>
                <button
                  onClick={() => setSelectedRole("content")}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedRole === "content"
                      ? "bg-[#09142b] text-white shadow-lg"
                      : "bg-white text-[#6b7280] border-2 border-[#e7cfa7] hover:border-[#c8a45e] hover:text-[#09142b]"
                  }`}
                >
                  {t("joinTeamContentRoles", "Content Roles")}
                </button>
                <button
                  onClick={() => setSelectedRole("administrative")}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedRole === "administrative"
                      ? "bg-[#09142b] text-white shadow-lg"
                      : "bg-white text-[#6b7280] border-2 border-[#e7cfa7] hover:border-[#c8a45e] hover:text-[#09142b]"
                  }`}
                >
                  {t("joinTeamAdministrativeRoles", "Administrative Roles")}
                </button>
                <button
                  onClick={() => setSelectedRole("training")}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedRole === "training"
                      ? "bg-[#09142b] text-white shadow-lg"
                      : "bg-white text-[#6b7280] border-2 border-[#e7cfa7] hover:border-[#c8a45e] hover:text-[#09142b]"
                  }`}
                >
                  {t("joinTeamTrainingRoles", "Training Roles")}
                </button>
              </div>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles
                .filter((role) => {
                  if (selectedRole === "") return true;
                  if (selectedRole === "content") {
                    return [
                      "legal-writer",
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
                    return ["legal-trainer", "legal-instructor"].includes(
                      role.id
                    );
                  }
                  return true;
                })
                .map((role) => (
                  <div
                    key={role.id}
                    className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-xl ${
                      selectedRole === role.id
                        ? "border-[#c8a45e] bg-gradient-to-br from-white to-[#faf6f0] shadow-lg"
                        : "border-[#e7cfa7] bg-white hover:border-[#c8a45e]"
                    }`}
                    onClick={() => handleRoleSelection(role.id)}
                  >
                    {/* Selection Indicator */}
                    {selectedRole === role.id && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#c8a45e] rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-5 h-5 text-white"
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
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {role.icon}
                    </div>

                    {/* Role Title */}
                    <h3 className="text-xl font-bold text-[#09142b] mb-3 group-hover:text-[#c8a45e] transition-colors duration-300">
                      {t(role.title)}
                    </h3>

                    {/* Role Description */}
                    <p className="text-[#6b7280] text-base leading-relaxed mb-4">
                      {t(role.description)}
                    </p>

                    {/* Role Features */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-[#6b7280]">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mr-2"></div>
                        {t(`${role.id}Feature1`, "Experience in legal field")}
                      </div>
                      <div className="flex items-center text-sm text-[#6b7280]">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mr-2"></div>
                        {t(
                          `${role.id}Feature2`,
                          "Excellent communication skills"
                        )}
                      </div>
                      <div className="flex items-center text-sm text-[#6b7280]">
                        <div className="w-2 h-2 bg-[#c8a45e] rounded-full mr-2"></div>
                        {t(
                          `${role.id}Feature3`,
                          "Teamwork in multidisciplinary environment"
                        )}
                      </div>
                    </div>

                    {/* Select Button */}
                    <div className="mt-4 pt-4 border-t border-[#e7cfa7]">
                      <button
                        type="button"
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                          selectedRole === role.id
                            ? "bg-[#09142b] text-white"
                            : "bg-[#faf6f0] text-[#09142b] hover:bg-[#c8a45e] hover:text-white"
                        }`}
                      >
                        {selectedRole === role.id
                          ? t("joinTeamSelected", "Selected")
                          : t("joinTeamSelect", "Select This Role")}
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* No Roles Message */}
            {roles.filter((role) => {
              if (selectedRole === "") return true;
              if (selectedRole === "content") {
                return [
                  "legal-writer",
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
                return ["legal-trainer", "legal-instructor"].includes(role.id);
              }
              return true;
            }).length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-[#09142b] mb-2">
                  {t("joinTeamNoRolesFound", "No Roles Available")}
                </h3>
                <p className="text-[#6b7280]">
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
                    <h3 className="text-xl font-bold mb-1">
                      {t("joinTeamRoleSelected", "Role Selected Successfully!")}
                    </h3>
                    <p className="text-white/90">
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
                  className="flex items-center space-x-2 space-x-reverse bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300"
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
                  <h3 className="text-2xl font-bold text-[#09142b] mb-2">
                    {t("joinTeamApplicationForm", "Application Form")}
                  </h3>
                  <p className="text-[#6b7280]">
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
                    <label className="block text-[#09142b] font-semibold mb-2">
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
                      {t("joinTeamLinkedin", "LinkedIn")}
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
                      {t("joinTeamWebsite", "Website")}
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

                {/* Salary and Availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("joinTeamExpectedSalary", "Expected Salary")}
                    </label>
                    <input
                      type="text"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                      placeholder={t(
                        "joinTeamExpectedSalaryPlaceholder",
                        "Mention your expected salary"
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-[#09142b] font-semibold mb-2">
                      {t("joinTeamAvailability", "Availability Date")}
                    </label>
                    <input
                      type="date"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#e7cfa7] rounded-xl focus:ring-2 focus:ring-[#c8a45e] focus:border-transparent transition-all duration-300"
                    />
                  </div>
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
                  className="w-full bg-gradient-to-r from-[#09142b] to-[#1a2a4a] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#1a2a4a] hover:to-[#09142b] transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
