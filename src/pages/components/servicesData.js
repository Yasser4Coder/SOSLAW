// Service data for the ServicesSection
// key: unique id, icon: react-icons name, titleKey/descKey: translation keys
export const services = [
  {
    key: "remoteLegalTraining",
    icon: "FiUsers",
    titleKey: "serviceRemoteLegalTraining",
    descKey: "serviceRemoteLegalTrainingDesc",
    subItems: [
      { key: "onlineCourses", titleKey: "serviceOnlineCourses" },
      { key: "workshops", titleKey: "serviceWorkshops" },
    ],
  },
  {
    key: "startupLegalPack",
    icon: "FiBriefcase",
    titleKey: "serviceStartupLegalPack",
    descKey: "serviceStartupLegalPackDesc",
    subItems: [
      { key: "startupFormation", titleKey: "serviceStartupFormation" },
      { key: "partnershipContracts", titleKey: "servicePartnershipContracts" },
      { key: "ipProtection", titleKey: "serviceIpProtection" },
      { key: "legalFollowUp", titleKey: "serviceLegalFollowUp" },
    ],
  },
  {
    key: "legalAudit",
    icon: "FiShield",
    titleKey: "serviceLegalAudit",
    descKey: "serviceLegalAuditDesc",
    subItems: [
      { key: "legalStatusReview", titleKey: "serviceLegalStatusReview" },
      {
        key: "contractRiskExamination",
        titleKey: "serviceContractRiskExamination",
      },
    ],
  },
  {
    key: "digitalArbitration",
    icon: "FaGavel",
    titleKey: "serviceDigitalArbitration",
    descKey: "serviceDigitalArbitrationDesc",
    subItems: [
      {
        key: "onlineDisputeResolution",
        titleKey: "serviceOnlineDisputeResolution",
      },
    ],
  },
  {
    key: "legalTemplates",
    icon: "FiFileText",
    titleKey: "serviceLegalTemplates",
    descKey: "serviceLegalTemplatesDesc",
    subItems: [
      { key: "contractTemplates", titleKey: "serviceContractTemplates" },
      { key: "legalDocuments", titleKey: "serviceLegalDocuments" },
    ],
  },
  {
    key: "legalHotline",
    icon: "FiPhone",
    titleKey: "serviceLegalHotline",
    descKey: "serviceLegalHotlineDesc",
    subItems: [
      { key: "urgentConsultations", titleKey: "serviceUrgentConsultations" },
      { key: "emergencyHours", titleKey: "serviceEmergencyHours" },
    ],
  },
  {
    key: "legalContent",
    icon: "FiEdit",
    titleKey: "serviceLegalContent",
    descKey: "serviceLegalContentDesc",
    subItems: [
      { key: "privacyPolicies", titleKey: "servicePrivacyPolicies" },
      { key: "companyDocuments", titleKey: "serviceCompanyDocuments" },
    ],
  },
  {
    key: "smartLegalNotification",
    icon: "FiBell",
    titleKey: "serviceSmartLegalNotification",
    descKey: "serviceSmartLegalNotificationDesc",
    subItems: [{ key: "legalUpdates", titleKey: "serviceLegalUpdates" }],
  },
];
