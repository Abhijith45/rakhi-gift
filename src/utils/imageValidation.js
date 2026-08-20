/**
 * Image Upload Validation Utilities
 * Enforces hard constraints: max 8 photos, max 6 MB per file, supported formats (JPG, PNG, WEBP).
 */

export const MAX_IMAGES = 8;
export const MAX_FILE_SIZE_BYTES = 6 * 1024 * 1024; // 6 MB
export const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Validates a single File object
 * @param {File} file 
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // 1. Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" is larger than 6 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please choose a smaller image.`
    };
  }

  // 2. Check MIME type or extension
  const isMimeValid = SUPPORTED_MIME_TYPES.includes(file.type.toLowerCase());
  const hasValidExt = SUPPORTED_EXTENSIONS.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );

  if (!isMimeValid && !hasValidExt) {
    return {
      valid: false,
      error: `"${file.name}" has an unsupported format. Please upload JPG, PNG, or WEBP images.`
    };
  }

  return { valid: true, error: null };
}

/**
 * Validates a batch of files against existing photos count
 * @param {File[]} newFiles 
 * @param {number} currentCount 
 * @returns {{ validFiles: File[], errors: string[] }}
 */
export function validateBatchFiles(newFiles = [], currentCount = 0) {
  const errors = [];
  const validFiles = [];

  const availableSlots = MAX_IMAGES - currentCount;

  if (availableSlots <= 0) {
    errors.push(`You have reached the maximum limit of ${MAX_IMAGES} memories.`);
    return { validFiles: [], errors };
  }

  const filesToProcess = newFiles.slice(0, availableSlots);

  if (newFiles.length > availableSlots) {
    errors.push(
      `You can add up to ${MAX_IMAGES} memories in total. Only the first ${availableSlots} ${availableSlots === 1 ? 'photo was' : 'photos were'} selected.`
    );
  }

  for (const file of filesToProcess) {
    const check = validateImageFile(file);
    if (!check.valid) {
      errors.push(check.error);
    } else {
      validFiles.push(file);
    }
  }

  return { validFiles, errors };
}

export default {
  MAX_IMAGES,
  MAX_FILE_SIZE_BYTES,
  SUPPORTED_MIME_TYPES,
  validateImageFile,
  validateBatchFiles
};
