/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
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
} from "react-icons/fi";

const RoleDetails = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const isRTL = lang === "ar";

  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const roles = [
    {
      id: "administrative-manager",
      title: "administrativeManager",
      description: "administrativeManagerDesc",
      icon: "📋",
      category: "administrative",
      requirements: [
        t("roleRequirements.administrativeManager.req1"),
        t("roleRequirements.administrativeManager.req2"),
        t("roleRequirements.administrativeManager.req3"),
        t("roleRequirements.administrativeManager.req4"),
        t("roleRequirements.administrativeManager.req5"),
      ],
      responsibilities: [
        t("roleResponsibilities.administrativeManager.resp1"),
        t("roleResponsibilities.administrativeManager.resp2"),
        t("roleResponsibilities.administrativeManager.resp3"),
        t("roleResponsibilities.administrativeManager.resp4"),
        t("roleResponsibilities.administrativeManager.resp5"),
      ],
      benefits: [
        t("roleBenefits.administrativeManager.ben1"),
        t("roleBenefits.administrativeManager.ben2"),
        t("roleBenefits.administrativeManager.ben3"),
        t("roleBenefits.administrativeManager.ben4"),
        t("roleBenefits.administrativeManager.ben5"),
      ],
      skills: [
        "Administration",
        "Leadership",
        "Contract Management",
        "Financial Procedures",
        "Organization",
      ],
      experience: "5-7 years",
      location: "Algiers, Algeria",
      type: "Full-time",
      salary: "Competitive",
    },
    {
      id: "legal-translator",
      title: "legalTranslator",
      description: "legalTranslatorDesc",
      icon: "🌐",
      category: "content",
      requirements: [
        t("roleRequirements.legalTranslator.req1"),
        t("roleRequirements.legalTranslator.req2"),
        t("roleRequirements.legalTranslator.req3"),
        t("roleRequirements.legalTranslator.req4"),
        t("roleRequirements.legalTranslator.req5"),
      ],
      responsibilities: [
        t("roleResponsibilities.legalTranslator.resp1"),
        t("roleResponsibilities.legalTranslator.resp2"),
        t("roleResponsibilities.legalTranslator.resp3"),
        t("roleResponsibilities.legalTranslator.resp4"),
        t("roleResponsibilities.legalTranslator.resp5"),
      ],
      benefits: [
        t("roleBenefits.legalTranslator.ben1"),
        t("roleBenefits.legalTranslator.ben2"),
        t("roleBenefits.legalTranslator.ben3"),
        t("roleBenefits.legalTranslator.ben4"),
        t("roleBenefits.legalTranslator.ben5"),
      ],
      skills: [
        "Legal Translation",
        "Arabic/French/English",
        "Legal Terminology",
        "Proofreading",
        "Quality Assurance",
      ],
      experience: "4-6 years",
      location: "Remote/Hybrid",
      type: "Full-time",
      salary: "Competitive",
    },
    {
      id: "legal-content-creator",
      title: "legalContentCreator",
      description: "legalContentCreatorDesc",
      icon: "🎬",
      category: "content",
      requirements: [
        t("roleRequirements.legalContentCreator.req1"),
        t("roleRequirements.legalContentCreator.req2"),
        t("roleRequirements.legalContentCreator.req3"),
        t("roleRequirements.legalContentCreator.req4"),
        t("roleRequirements.legalContentCreator.req5"),
      ],
      responsibilities: [
        t("roleResponsibilities.legalContentCreator.resp1"),
        t("roleResponsibilities.legalContentCreator.resp2"),
        t("roleResponsibilities.legalContentCreator.resp3"),
        t("roleResponsibilities.legalContentCreator.resp4"),
        t("roleResponsibilities.legalContentCreator.resp5"),
      ],
      benefits: [
        t("roleBenefits.legalContentCreator.ben1"),
        t("roleBenefits.legalContentCreator.ben2"),
        t("roleBenefits.legalContentCreator.ben3"),
        t("roleBenefits.legalContentCreator.ben4"),
        t("roleBenefits.legalContentCreator.ben5"),
      ],
      skills: [
        "Content Creation",
        "Video Editing",
        "Graphic Design",
        "Social Media",
        "Legal Communication",
      ],
      experience: "3-5 years",
      location: "Algiers, Algeria",
      type: "Full-time",
      salary: "Competitive",
    },
    {
      id: "digital-platform-manager",
      title: "digitalPlatformManager",
      description: "digitalPlatformManagerDesc",
      icon: "📱",
      category: "administrative",
      requirements: [
        t("roleRequirements.digitalPlatformManager.req1"),
        t("roleRequirements.digitalPlatformManager.req2"),
        t("roleRequirements.digitalPlatformManager.req3"),
        t("roleRequirements.digitalPlatformManager.req4"),
        t("roleRequirements.digitalPlatformManager.req5"),
      ],
      responsibilities: [
        t("roleResponsibilities.digitalPlatformManager.resp1"),
        t("roleResponsibilities.digitalPlatformManager.resp2"),
        t("roleResponsibilities.digitalPlatformManager.resp3"),
        t("roleResponsibilities.digitalPlatformManager.resp4"),
        t("roleResponsibilities.digitalPlatformManager.resp5"),
      ],
      benefits: [
        t("roleBenefits.digitalPlatformManager.ben1"),
        t("roleBenefits.digitalPlatformManager.ben2"),
        t("roleBenefits.digitalPlatformManager.ben3"),
        t("roleBenefits.digitalPlatformManager.ben4"),
        t("roleBenefits.digitalPlatformManager.ben5"),
      ],
      skills: [
        "Digital Marketing",
        "Social Media Management",
        "Content Strategy",
        "Analytics",
        "Legal Industry Knowledge",
      ],
      experience: "4-6 years",
      location: "Algiers, Algeria",
      type: "Full-time",
      salary: "Competitive",
    },
    {
      id: "legal-content-editor",
      title: "legalContentEditor",
      description: "legalContentEditorDesc",
      icon: "📝",
      category: "content",
      requirements: [
        t("roleRequirements.legalContentEditor.req1"),
        t("roleRequirements.legalContentEditor.req2"),
        t("roleRequirements.legalContentEditor.req3"),
        t("roleRequirements.legalContentEditor.req4"),
        t("roleRequirements.legalContentEditor.req5"),
      ],
      responsibilities: [
        t("roleResponsibilities.legalContentEditor.resp1"),
        t("roleResponsibilities.legalContentEditor.resp2"),
        t("roleResponsibilities.legalContentEditor.resp3"),
        t("roleResponsibilities.legalContentEditor.resp4"),
        t("roleResponsibilities.legalContentEditor.resp5"),
      ],
      benefits: [
        t("roleBenefits.legalContentEditor.ben1"),
        t("roleBenefits.legalContentEditor.ben2"),
        t("roleBenefits.legalContentEditor.ben3"),
        t("roleBenefits.legalContentEditor.ben4"),
        t("roleBenefits.legalContentEditor.ben5"),
      ],
      skills: [
        "Legal Writing",
        "Content Editing",
        "Arabic Language",
        "Educational Content",
        "Legal Knowledge",
      ],
      experience: "4-6 years",
      location: "Algiers, Algeria",
      type: "Full-time",
      salary: "Competitive",
    },
    {
      id: "professional-legal-translator",
      title: "professionalLegalTranslator",
      description: "professionalLegalTranslatorDesc",
      icon: "🔤",
      category: "content",
      requirements: [
        t("roleRequirements.professionalLegalTranslator.req1"),
        t("roleRequirements.professionalLegalTranslator.req2"),
        t("roleRequirements.professionalLegalTranslator.req3"),
        t("roleRequirements.professionalLegalTranslator.req4"),
        t("roleRequirements.professionalLegalTranslator.req5"),
      ],
      responsibilities: [
        t("roleResponsibilities.professionalLegalTranslator.resp1"),
        t("roleResponsibilities.professionalLegalTranslator.resp2"),
        t("roleResponsibilities.professionalLegalTranslator.resp3"),
        t("roleResponsibilities.professionalLegalTranslator.resp4"),
        t("roleResponsibilities.professionalLegalTranslator.resp5"),
      ],
      benefits: [
        t("roleBenefits.professionalLegalTranslator.ben1"),
        t("roleBenefits.professionalLegalTranslator.ben2"),
        t("roleBenefits.professionalLegalTranslator.ben3"),
        t("roleBenefits.professionalLegalTranslator.ben4"),
        t("roleBenefits.professionalLegalTranslator.ben5"),
      ],
      skills: [
        "Professional Translation",
        "Legal Documents",
        "Quality Assurance",
        "Team Leadership",
        "Multilingual",
      ],
      experience: "5-8 years",
      location: "Remote/Hybrid",
      type: "Full-time",
      salary: "Competitive",
    },
    {
      id: "graphic-designer",
      title: "graphicDesigner",
      description: "graphicDesignerDesc",
      icon: "🎨",
      category: "content",
      requirements: [
        t("roleRequirements.graphicDesigner.req1"),
        t("roleRequirements.graphicDesigner.req2"),
        t("roleRequirements.graphicDesigner.req3"),
        t("roleRequirements.graphicDesigner.req4"),
        t("roleRequirements.graphicDesigner.req5"),
      ],
      responsibilities: [
        t("roleResponsibilities.graphicDesigner.resp1"),
        t("roleResponsibilities.graphicDesigner.resp2"),
        t("roleResponsibilities.graphicDesigner.resp3"),
        t("roleResponsibilities.graphicDesigner.resp4"),
        t("roleResponsibilities.graphicDesigner.resp5"),
      ],
      benefits: [
        t("roleBenefits.graphicDesigner.ben1"),
        t("roleBenefits.graphicDesigner.ben2"),
        t("roleBenefits.graphicDesigner.ben3"),
        t("roleBenefits.graphicDesigner.ben4"),
        t("roleBenefits.graphicDesigner.ben5"),
      ],
      skills: [
        "Graphic Design",
        "Adobe Creative Suite",
        "Brand Design",
        "Digital Marketing",
        "Legal Industry",
      ],
      experience: "3-5 years",
      location: "Algiers, Algeria",
      type: "Full-time",
      salary: "Competitive",
    },
    {
      id: "legal-accounting-specialist",
      title: "legalAccountingSpecialist",
      description: "legalAccountingSpecialistDesc",
      icon: "💰",
      category: "administrative",
      requirements: [
        t("roleRequirements.legalAccountingSpecialist.req1"),
        t("roleRequirements.legalAccountingSpecialist.req2"),
        t("roleRequirements.legalAccountingSpecialist.req3"),
        t("roleRequirements.legalAccountingSpecialist.req4"),
        t("roleRequirements.legalAccountingSpecialist.req5"),
      ],
      responsibilities: [
        t("roleResponsibilities.legalAccountingSpecialist.resp1"),
        t("roleResponsibilities.legalAccountingSpecialist.resp2"),
        t("roleResponsibilities.legalAccountingSpecialist.resp3"),
        t("roleResponsibilities.legalAccountingSpecialist.resp4"),
        t("roleResponsibilities.legalAccountingSpecialist.resp5"),
      ],
      benefits: [
        t("roleBenefits.legalAccountingSpecialist.ben1"),
        t("roleBenefits.legalAccountingSpecialist.ben2"),
        t("roleBenefits.legalAccountingSpecialist.ben3"),
        t("roleBenefits.legalAccountingSpecialist.ben4"),
        t("roleBenefits.legalAccountingSpecialist.ben5"),
      ],
      skills: [
        "Accounting",
        "Financial Management",
        "Tax Regulations",
        "Financial Software",
        "Legal Industry",
      ],
      experience: "5-7 years",
      location: "Algiers, Algeria",
      type: "Full-time",
      salary: "Competitive",
    },
    {
      id: "lawyer",
      title: "lawyer",
      description: "lawyerDesc",
      icon: "⚖️",
      category: "legal",
      requirements: [
        t("roleRequirements.lawyer.req1"),
        t("roleRequirements.lawyer.req2"),
        t("roleRequirements.lawyer.req3"),
        t("roleRequirements.lawyer.req4"),
        t("roleRequirements.lawyer.req5"),
        t("roleRequirements.lawyer.req6"),
      ],
      responsibilities: [
        t("roleResponsibilities.lawyer.resp1"),
        t("roleResponsibilities.lawyer.resp2"),
        t("roleResponsibilities.lawyer.resp3"),
        t("roleResponsibilities.lawyer.resp4"),
        t("roleResponsibilities.lawyer.resp5"),
        t("roleResponsibilities.lawyer.resp6"),
        t("roleResponsibilities.lawyer.resp7"),
      ],
      benefits: [
        t("roleBenefits.lawyer.ben1"),
        t("roleBenefits.lawyer.ben2"),
        t("roleBenefits.lawyer.ben3"),
        t("roleBenefits.lawyer.ben4"),
        t("roleBenefits.lawyer.ben5"),
        t("roleBenefits.lawyer.ben6"),
      ],
      skills: [
        "Legal Practice",
        "Court Representation",
        "Contract Law",
        "Legal Research",
        "Client Advocacy",
        "Negotiation",
        "Arabic & French",
      ],
      experience: "5-10 years",
      location: "Algiers, Algeria",
      type: "Full-time",
      salary: "Competitive",
    },
    {
      id: "legal-advisor",
      title: "legalAdvisor",
      description: "legalAdvisorDesc",
      icon: "⚖️",
      category: "legal",
      requirements: [
        t("roleRequirements.legalAdvisor.req1"),
        t("roleRequirements.legalAdvisor.req2"),
        t("roleRequirements.legalAdvisor.req3"),
        t("roleRequirements.legalAdvisor.req4"),
        t("roleRequirements.legalAdvisor.req5"),
      ],
      responsibilities: [
        t("roleResponsibilities.legalAdvisor.resp1"),
        t("roleResponsibilities.legalAdvisor.resp2"),
        t("roleResponsibilities.legalAdvisor.resp3"),
        t("roleResponsibilities.legalAdvisor.resp4"),
        t("roleResponsibilities.legalAdvisor.resp5"),
      ],
      benefits: [
        t("roleBenefits.legalAdvisor.ben1"),
        t("roleBenefits.legalAdvisor.ben2"),
        t("roleBenefits.legalAdvisor.ben3"),
        t("roleBenefits.legalAdvisor.ben4"),
        t("roleBenefits.legalAdvisor.ben5"),
      ],
      skills: [
        "Legal Advisory",
        "Risk Management",
        "Strategic Planning",
        "Business Law",
        "Regulatory Compliance",
      ],
      experience: "7+ years",
      location: "Algiers, Algeria",
      type: "Full-time",
      salary: "Competitive",
    },
    {
      id: "legal-instructor-new",
      title: "legalInstructorNew",
      description: "legalInstructorNewDesc",
      icon: "🎓",
      category: "training",
      requirements: [
        t("roleRequirements.legalInstructorNew.req1"),
        t("roleRequirements.legalInstructorNew.req2"),
        t("roleRequirements.legalInstructorNew.req3"),
        t("roleRequirements.legalInstructorNew.req4"),
        t("roleRequirements.legalInstructorNew.req5"),
      ],
      responsibilities: [
        t("roleResponsibilities.legalInstructorNew.resp1"),
        t("roleResponsibilities.legalInstructorNew.resp2"),
        t("roleResponsibilities.legalInstructorNew.resp3"),
        t("roleResponsibilities.legalInstructorNew.resp4"),
        t("roleResponsibilities.legalInstructorNew.resp5"),
      ],
      benefits: [
        t("roleBenefits.legalInstructorNew.ben1"),
        t("roleBenefits.legalInstructorNew.ben2"),
        t("roleBenefits.legalInstructorNew.ben3"),
        t("roleBenefits.legalInstructorNew.ben4"),
        t("roleBenefits.legalInstructorNew.ben5"),
      ],
      skills: [
        "Legal Education",
        "Curriculum Development",
        "Training Delivery",
        "Assessment Design",
        "Educational Content Creation",
      ],
      experience: "5-7 years",
      location: "Algiers, Algeria",
      type: "Full-time",
      salary: "Competitive",
    },
  ];

  useEffect(() => {
    const foundRole = roles.find((r) => r.id === roleId);
    if (foundRole) {
      setRole(foundRole);
    } else {
      navigate("/join-team");
    }
  }, [roleId, navigate]);

  if (!role) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8a45e] mx-auto mb-4"></div>
          <p className="text-[#09142b]">{t("roleDetails.loading")}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: t("roleDetails.overview"), icon: FiBook },
    {
      id: "requirements",
      label: t("roleDetails.requirements"),
      icon: FiCheckCircle,
    },
    {
      id: "responsibilities",
      label: t("roleDetails.responsibilities"),
      icon: FiBriefcase,
    },
    { id: "benefits", label: t("roleDetails.benefits"), icon: FiAward },
  ];

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <title>{t(role.title)} | SOSLAW</title>
        <meta name="description" content={t(role.description)} />
      </Helmet>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-[#09142b] via-[#1a2a4a] to-[#09142b] py-20 px-4 md:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-[#c8a45e] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#e7cfa7] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              to="/join-team"
              className="inline-flex items-center gap-2 text-[#e7cfa7] hover:text-white transition-colors duration-300"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>{t("backToRoles", "Back to Roles")}</span>
            </Link>
          </div>

          {/* Role Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1">
              <div className="text-6xl mb-4">{role.icon}</div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t(role.title)}
              </h1>
              <p className="text-[#e7cfa7] text-lg md:text-xl max-w-3xl">
                {t(role.description)}
              </p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 w-full lg:w-64">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <FiMapPin className="text-[#c8a45e] w-5 h-5" />
                  <span className="text-white/80 text-sm">
                    {t("roleDetails.location")}
                  </span>
                </div>
                <p className="text-white font-semibold">{role.location}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <FiClock className="text-[#c8a45e] w-5 h-5" />
                  <span className="text-white/80 text-sm">
                    {t("roleDetails.type")}
                  </span>
                </div>
                <p className="text-white font-semibold">{role.type}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <FiBriefcase className="text-[#c8a45e] w-5 h-5" />
                  <span className="text-white/80 text-sm">
                    {t("roleDetails.experience")}
                  </span>
                </div>
                <p className="text-white font-semibold">{role.experience}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <FiDollarSign className="text-[#c8a45e] w-5 h-5" />
                  <span className="text-white/80 text-sm">
                    {t("roleDetails.salary")}
                  </span>
                </div>
                <p className="text-white font-semibold">{role.salary}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-[#faf6f0] py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-[#09142b] text-white shadow-lg"
                      : "bg-white text-[#6b7280] border-2 border-[#e7cfa7] hover:border-[#c8a45e] hover:text-[#09142b]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-[#e7cfa7]">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-[#09142b] mb-4">
                    {t("roleDetails.roleOverview")}
                  </h3>
                  <p className="text-[#6b7280] text-lg leading-relaxed">
                    {t(role.description)}
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-[#09142b] mb-4">
                    {t("roleDetails.keySkills")}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {role.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#faf6f0] text-[#09142b] rounded-full font-medium border border-[#e7cfa7]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-[#faf6f0] to-white p-6 rounded-xl border border-[#e7cfa7]">
                    <div className="flex items-center gap-3 mb-4">
                      <FiTrendingUp className="text-[#c8a45e] w-6 h-6" />
                      <h4 className="text-lg font-semibold text-[#09142b]">
                        {t("roleDetails.growthOpportunities")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">
                      {t("roleDetails.growthOpportunitiesDesc")}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-[#faf6f0] to-white p-6 rounded-xl border border-[#e7cfa7]">
                    <div className="flex items-center gap-3 mb-4">
                      <FiShield className="text-[#c8a45e] w-6 h-6" />
                      <h4 className="text-lg font-semibold text-[#09142b]">
                        {t("roleDetails.workEnvironment")}
                      </h4>
                    </div>
                    <p className="text-[#6b7280]">
                      {t("roleDetails.workEnvironmentDesc")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "requirements" && (
              <div>
                <h3 className="text-2xl font-bold text-[#09142b] mb-6">
                  {t("roleDetails.requirementsQualifications")}
                </h3>
                <div className="space-y-4">
                  {role.requirements.map((requirement, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-[#faf6f0] rounded-xl border border-[#e7cfa7]"
                    >
                      <div className="w-6 h-6 bg-[#c8a45e] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-[#09142b] font-medium">
                        {requirement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "responsibilities" && (
              <div>
                <h3 className="text-2xl font-bold text-[#09142b] mb-6">
                  {t("roleDetails.keyResponsibilities")}
                </h3>
                <div className="space-y-4">
                  {role.responsibilities.map((responsibility, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-[#faf6f0] rounded-xl border border-[#e7cfa7]"
                    >
                      <div className="w-6 h-6 bg-[#09142b] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <FiCheckCircle className="text-white w-4 h-4" />
                      </div>
                      <p className="text-[#09142b] font-medium">
                        {responsibility}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "benefits" && (
              <div>
                <h3 className="text-2xl font-bold text-[#09142b] mb-6">
                  {t("roleDetails.benefitsPerks")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {role.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#faf6f0] to-white rounded-xl border border-[#e7cfa7]"
                    >
                      <div className="w-10 h-10 bg-[#c8a45e] rounded-full flex items-center justify-center flex-shrink-0">
                        <FiStar className="text-white w-5 h-5" />
                      </div>
                      <p className="text-[#09142b] font-medium">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply Section */}
          <div className="mt-12 bg-gradient-to-r from-[#09142b] to-[#1a2a4a] rounded-2xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">
                {t("roleDetails.readyToJoin")}
              </h3>
              <p className="text-[#e7cfa7] text-lg mb-8">
                {t("roleDetails.readyToJoinDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={`/join-team?role=${role.id}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c8a45e] text-white font-semibold rounded-xl hover:bg-[#b48b5a] transition-all duration-300 transform hover:scale-105"
                >
                  <FiZap className="w-5 h-5" />
                  {t("roleDetails.applyNow")}
                </Link>
                <Link
                  to="/join-team"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-[#09142b] transition-all duration-300"
                >
                  <FiUsers className="w-5 h-5" />
                  {t("roleDetails.viewAllRoles")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RoleDetails;
