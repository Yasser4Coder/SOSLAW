/**
 * Email utility functions
 */

/**
 * Normalize email address (remove dots for Gmail)
 * @param {string} email - Email address to normalize
 * @returns {string} Normalized email address
 */
export const normalizeEmail = (email) => {
  if (!email) return email;

  const [localPart, domain] = email.toLowerCase().split("@");

  // For Gmail, remove dots from local part
  if (domain === "gmail.com") {
    return `${localPart.replace(/\./g, "")}@${domain}`;
  }

  return email.toLowerCase();
};

/**
 * Check if two emails are the same (considering Gmail normalization)
 * @param {string} email1 - First email
 * @param {string} email2 - Second email
 * @returns {boolean} True if emails are the same
 */
export const areEmailsEqual = (email1, email2) => {
  return normalizeEmail(email1) === normalizeEmail(email2);
};
