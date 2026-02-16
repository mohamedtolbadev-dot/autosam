import DOMPurify from 'dompurify';

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true
  });
};

/**
 * Sanitize input but allow specific HTML tags (for rich text)
 * @param {string} input - Raw user input
 * @param {string[]} allowedTags - Array of allowed HTML tags
 * @returns {string} Sanitized string with allowed tags
 */
export const sanitizeRichText = (input, allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br']) => {
  if (typeof input !== 'string') return '';
  
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: [], // Still no attributes for security
    KEEP_CONTENT: true
  });
};

/**
 * Validate and sanitize file name
 * @param {string} fileName - Original file name
 * @returns {string} Sanitized file name
 */
export const sanitizeFileName = (fileName) => {
  if (typeof fileName !== 'string') return '';
  
  // Remove path traversal characters and control characters
  return fileName
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
    .replace(/\.\./g, '')
    .replace(/^\.+/, '')
    .substring(0, 255);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  if (typeof phone !== 'string') return false;
  const phoneRegex = /^\+?[\d\s-]{8,20}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate car ID (should be valid UUID - any version)
 * @param {string} id - ID to validate
 * @returns {boolean} Is valid UUID
 */
export const isValidCarId = (id) => {
  if (typeof id !== 'string') return false;
  // General UUID regex - accepts v1, v4, and other versions
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Strip all HTML tags (for plain text fields)
 * @param {string} input - Input with potential HTML
 * @returns {string} Plain text without HTML
 */
export const stripHtml = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '');
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};
