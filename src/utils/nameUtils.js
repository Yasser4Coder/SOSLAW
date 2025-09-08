/**
 * Extracts the first letter of a name, skipping common titles
 * @param {string} fullName - The full name of the person
 * @returns {string} - The first letter of the actual name (not title)
 *
 * @example
 * getFirstLetterOfName("Dr. Ahmed Ali") // Returns "A" (from Ahmed)
 * getFirstLetterOfName("دكتور محمد حسن") // Returns "م" (from محمد)
 * getFirstLetterOfName("Prof. Sarah Johnson") // Returns "S" (from Sarah)
 * getFirstLetterOfName("مهندس علي أحمد") // Returns "ع" (from علي)
 * getFirstLetterOfName("Mr. John Smith") // Returns "J" (from John)
 */
export const getFirstLetterOfName = (fullName) => {
  if (!fullName || typeof fullName !== "string") {
    return "?";
  }

  // Common titles to skip (Arabic and English)
  const titles = [
    "dr",
    "doctor",
    "دكتور",
    "د",
    "دك",
    "prof",
    "professor",
    "أستاذ",
    "أستاذة",
    "أ",
    "mr",
    "mrs",
    "miss",
    "ms",
    "السيد",
    "السيدة",
    "الآنسة",
    "eng",
    "engineer",
    "مهندس",
    "مهندسة",
    "م",
    "att",
    "attorney",
    "محامي",
    "محامية",
    "م",
    "adv",
    "advocate",
    "محامي",
    "محامية",
    "م",
    "judge",
    "قاضي",
    "ق",
    "captain",
    "كابتن",
    "ك",
    "colonel",
    "عقيد",
    "ع",
    "general",
    "جنرال",
    "ج",
  ];

  // Split the name into parts
  const nameParts = fullName.trim().split(/\s+/);

  // Find the first part that's not a title
  for (const part of nameParts) {
    const cleanPart = part.toLowerCase().replace(/[^\w\u0600-\u06FF]/g, "");
    if (!titles.includes(cleanPart)) {
      return part.charAt(0).toUpperCase();
    }
  }

  // If all parts are titles, return the first letter of the first part
  return nameParts[0]?.charAt(0)?.toUpperCase() || "?";
};

/**
 * Creates initials from a full name
 * @param {string} fullName - The full name of the person
 * @param {number} maxInitials - Maximum number of initials to return (default: 2)
 * @returns {string} - The initials
 *
 * @example
 * getInitials("Dr. Ahmed Ali Hassan", 2) // Returns "AH" (from Ahmed Hassan)
 * getInitials("دكتور محمد حسن علي", 2) // Returns "مح" (from محمد حسن)
 * getInitials("Prof. Sarah Johnson", 2) // Returns "SJ" (from Sarah Johnson)
 */
export const getInitials = (fullName, maxInitials = 2) => {
  if (!fullName || typeof fullName !== "string") {
    return "?";
  }

  const nameParts = fullName.trim().split(/\s+/);
  const titles = [
    "dr",
    "doctor",
    "دكتور",
    "د",
    "دك",
    "prof",
    "professor",
    "أستاذ",
    "أستاذة",
    "أ",
    "mr",
    "mrs",
    "miss",
    "ms",
    "السيد",
    "السيدة",
    "الآنسة",
    "eng",
    "engineer",
    "مهندس",
    "مهندسة",
    "م",
    "att",
    "attorney",
    "محامي",
    "محامية",
    "م",
    "adv",
    "advocate",
    "محامي",
    "محامية",
    "م",
    "judge",
    "قاضي",
    "ق",
    "captain",
    "كابتن",
    "ك",
    "colonel",
    "عقيد",
    "ع",
    "general",
    "جنرال",
    "ج",
  ];

  const validParts = nameParts.filter((part) => {
    const cleanPart = part.toLowerCase().replace(/[^\w\u0600-\u06FF]/g, "");
    return !titles.includes(cleanPart);
  });

  if (validParts.length === 0) {
    return nameParts[0]?.charAt(0)?.toUpperCase() || "?";
  }

  return validParts
    .slice(0, maxInitials)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};
