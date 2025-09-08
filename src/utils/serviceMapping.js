// Service ID mapping between frontend static data and backend database
export const serviceIdMapping = {
  "legal-translation": 6,
  "legal-documents": 7,
  "arbitration-mediation": 8,
  "legal-content": 9,
  "legal-audit": 10,
  "legal-consultation": 11,
  "nursery-legal-package": 12,
  "legal-training": 13,
  "comprehensive-business-support": 14,
  "elite-legal-package-students": 15,
  "academic-leadership-support": 16,
};

// Function to get database ID from frontend string ID
export const getServiceDatabaseId = (frontendId) => {
  return serviceIdMapping[frontendId] || null;
};

// Function to get frontend string ID from database ID
export const getServiceFrontendId = (databaseId) => {
  const entry = Object.entries(serviceIdMapping).find(
    ([_, id]) => id === databaseId
  );
  return entry ? entry[0] : null;
};
