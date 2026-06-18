// String normalization utilities to reduce redundant operations

/**
 * Normalize an email address for comparison/storage
 * Converts to string, trims whitespace, and converts to lowercase
 * @param {*} email - The email value to normalize (can be any type)
 * @returns {string} Normalized email address or empty string if input is null/undefined
 */
const normalizeEmail = (email) => {
  return email ? String(email).trim().toLowerCase() : '';
};

/**
 * Normalize a string value (trim and optional lowercase)
 * @param {*} value - The value to normalize
 * @param {boolean} toLowerCase - Whether to convert to lowercase (default: false)
 * @returns {string} Normalized string or empty string if input is null/undefined
 */
const normalizeString = (value, toLowerCase = false) => {
  if (!value) return '';
  let result = String(value).trim();
  return toLowerCase ? result.toLowerCase() : result;
};

export {
  normalizeEmail,
  normalizeString
};