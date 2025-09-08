import { useQuery } from "@tanstack/react-query";
import contactInfoService from "../services/contactInfoService";

export const useContactInfo = () => {
  const {
    data: contactInfoData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contactInfo"],
    queryFn: contactInfoService.getFormattedContactInfo,
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  const contactInfo = contactInfoData || {
    phones: [
      { key: "main_phone", value: "+ 383 (21) 23 43984", order: 1 },
      { key: "contact_phone", value: "+213 555 123 456", order: 2 },
    ],
    emails: [
      { key: "main_email", value: "Sos.law.35@gmail.com", order: 1 },
      { key: "contact_email", value: "info@soslaw.com", order: 2 },
    ],
    addresses: [
      { key: "main_address", value: "الجزائر العاصمة، الجزائر", order: 1 },
    ],
    hours: [
      { key: "main_hours", value: "السبت - الخميس 8:30ص - 6:00م", order: 1 },
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/soslaw",
      linkedin: "https://www.linkedin.com/company/soslaw",
      instagram: "https://www.instagram.com/soslaw",
      twitter: "https://www.twitter.com/soslaw",
      youtube: "https://www.youtube.com/soslaw",
    },
  };

  // Helper functions to get specific contact info
  const getMainPhone = () => {
    return (
      contactInfo.phones?.find((phone) => phone.key === "main_phone")?.value ||
      "+ 383 (21) 23 43984"
    );
  };

  const getContactPhone = () => {
    return (
      contactInfo.phones?.find((phone) => phone.key === "contact_phone")
        ?.value || "+213 555 123 456"
    );
  };

  const getMainEmail = () => {
    return (
      contactInfo.emails?.find((email) => email.key === "main_email")?.value ||
      "Sos.law.35@gmail.com"
    );
  };

  const getContactEmail = () => {
    return (
      contactInfo.emails?.find((email) => email.key === "contact_email")
        ?.value || "info@soslaw.com"
    );
  };

  const getMainAddress = () => {
    return (
      contactInfo.addresses?.find((address) => address.key === "main_address")
        ?.value || "الجزائر العاصمة، الجزائر"
    );
  };

  const getMainHours = () => {
    return (
      contactInfo.hours?.find((hour) => hour.key === "main_hours")?.value ||
      "السبت - الخميس 8:30ص - 6:00م"
    );
  };

  const getSocialMedia = () => {
    return contactInfo.socialMedia || {};
  };

  const forceRefresh = () => {
    refetch();
  };

  return {
    contactInfo,
    isLoading,
    error,
    refetch,
    forceRefresh,
    getMainPhone,
    getContactPhone,
    getMainEmail,
    getContactEmail,
    getMainAddress,
    getMainHours,
    getSocialMedia,
  };
};
