// Service data for the ServicesSection
// key: unique id, icon: react-icons name, titleKey/descKey: translation keys
export const services = [
  {
    key: "contracts",
    icon: "FiBriefcase",
    titleKey: "serviceGroupContracts",
    descKey: null,
    subItems: [
      { key: "public", titleKey: "serviceContractsPublic" },
      { key: "sale", titleKey: "serviceContractsSale" },
      { key: "lease", titleKey: "serviceContractsLease" },
      { key: "private", titleKey: "serviceContractsPrivate" },
      { key: "electronic", titleKey: "serviceContractsElectronic" },
    ],
  },
  {
    key: "companyFormation",
    icon: "FiUsers",
    titleKey: "serviceGroupCompanyFormation",
    descKey: null,
    subItems: [
      { key: "jointStock", titleKey: "serviceCompanyJointStock" },
      { key: "llc", titleKey: "serviceCompanyLLC" },
      { key: "sole", titleKey: "serviceCompanySole" },
      { key: "civil", titleKey: "serviceCompanyCivil" },
      { key: "general", titleKey: "serviceCompanyGeneral" },
    ],
  },
  {
    key: "associations",
    icon: "FiHome",
    titleKey: "serviceGroupAssociations",
    descKey: null,
    subItems: [],
  },
  {
    key: "startups",
    icon: "FiDollarSign",
    titleKey: "serviceGroupStartups",
    descKey: null,
    subItems: [],
  },
  {
    key: "arbitration",
    icon: "FaGavel",
    titleKey: "serviceGroupArbitration",
    descKey: null,
    subItems: [],
  },
  {
    key: "translation",
    icon: "FiShield",
    titleKey: "serviceGroupTranslation",
    descKey: null,
    subItems: [{ key: "form", titleKey: "serviceTranslationForm" }],
  },
];
