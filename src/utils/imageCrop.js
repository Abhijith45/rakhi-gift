/**
 * Client-Side 4:3 Image Cropping & Normalization Utilities
 * Generates normalized 1600x1200 (4:3) presentation images via HTML5 Canvas.
 */

export const TARGET_ASPECT_RATIO = 4 / 3; // 1.3333
export const OUTPUT_WIDTH = 1600;
export const OUTPUT_HEIGHT = 1200;

/**
 * Loads an image from a URL into an HTMLImageElement
 * @param {string} url 
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to decode image.'));
    img.src = url;
  });
}

/**
 * Computes default center 4:3 crop coordinates for an image
 */
export function getDefaultCrop(naturalWidth, naturalHeight) {
  const currentRatio = naturalWidth / naturalHeight;
  let cropWidth, cropHeight, x, y;

  if (currentRatio > TARGET_ASPECT_RATIO) {
    // Image is wider than 4:3 (e.g. 16:9, panoramic)
    cropHeight = naturalHeight;
    cropWidth = naturalHeight * TARGET_ASPECT_RATIO;
    x = (naturalWidth - cropWidth) / 2;
    y = 0;
  } else {
    // Image is taller than 4:3 (e.g. portrait, square, 9:16)
    cropWidth = naturalWidth;
    cropHeight = naturalWidth / TARGET_ASPECT_RATIO;
    x = 0;
    y = (naturalHeight - cropHeight) / 2;
  }

  return {
    x: Math.max(0, x),
    y: Math.max(0, y),
    width: Math.min(naturalWidth, cropWidth),
    height: Math.min(naturalHeight, cropHeight),
    zoom: 1.0,
    panX: 0,
    panY: 0,
    rotation: 0
  };
}

/**
 * Generates a high-resolution 4:3 cropped image from source image and crop parameters
 * @param {HTMLImageElement} image 
 * @param {object} cropParams 
 * @returns {Promise<{ dataUrl: string, blob: Blob, width: number, height: number }>}
 */
export async function generateCroppedImage(image, cropParams = {}) {
  const {
    zoom = 1.0,
    panX = 0, // offset in percentage (-50 to 50)
    panY = 0,
    rotation = 0
  } = cropParams;

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context unavailable.');
  }

  // Use high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fill canvas with white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);

  ctx.save();

  // Move to center of canvas for rotation and pan
  ctx.translate(OUTPUT_WIDTH / 2, OUTPUT_HEIGHT / 2);

  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  // Calculate cover sizing for 4:3 canvas
  const canvasRatio = OUTPUT_WIDTH / OUTPUT_HEIGHT;
  const imgRatio = image.naturalWidth / image.naturalHeight;

  let drawWidth, drawHeight;
  if (imgRatio > canvasRatio) {
    drawHeight = OUTPUT_HEIGHT * zoom;
    drawWidth = drawHeight * imgRatio;
  } else {
    drawWidth = OUTPUT_WIDTH * zoom;
    drawHeight = drawWidth / imgRatio;
  }

  // Apply panning offsets
  const maxPanX = Math.max(0, (drawWidth - OUTPUT_WIDTH) / 2);
  const maxPanY = Math.max(0, (drawHeight - OUTPUT_HEIGHT) / 2);

  const clampedOffsetX = Math.min(maxPanX, Math.max(-maxPanX, (panX / 100) * drawWidth));
  const clampedOffsetY = Math.min(maxPanY, Math.max(-maxPanY, (panY / 100) * drawHeight));

  const drawX = -drawWidth / 2 + clampedOffsetX;
  const drawY = -drawHeight / 2 + clampedOffsetY;

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

  ctx.restore();

  // Export as high quality JPEG
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

  const blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92);
  });

  return {
    dataUrl,
    blob,
    width: OUTPUT_WIDTH,
    height: OUTPUT_HEIGHT
  };
}

export default {
  TARGET_ASPECT_RATIO,
  OUTPUT_WIDTH,
  OUTPUT_HEIGHT,
  loadImage,
  getDefaultCrop,
  generateCroppedImage
};
