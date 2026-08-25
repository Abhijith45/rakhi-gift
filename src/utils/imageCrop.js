/**
 * Client-Side 4:3 Image Composition & Normalization Utilities
 * Generates normalized 1600x1200 (4:3) presentation images on a solid white (#FFFFFF) background.
 *
 * Core Principle: 4:3 is the final frame/canvas ratio, NOT an automatic destructive crop requirement.
 * By default, images use 'fit' (contain) mode so the full image is preserved with white padding.
 * Users can switch to 'fill' (cover) or manually zoom, pan, and rotate to compose their photo.
 */

export const TARGET_ASPECT_RATIO = 4 / 3; // 1.33333...
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
    img.onerror = () => reject(new Error('Failed to decode image.'));
    img.src = url;
  });
}

/**
 * Returns default non-destructive 4:3 composition parameters.
 * Defaults to 'fit' (contain) with zero pan and 1.0 zoom.
 */
export function getDefaultComposition(naturalWidth = 1600, naturalHeight = 1200) {
  return {
    mode: 'fit', // 'fit' (contain full image) | 'fill' (cover canvas)
    zoom: 1.0,
    panX: 0,     // Offset percentage (-50 to 50)
    panY: 0,
    rotation: 0  // 0, 90, 180, 270 degrees
  };
}

// Backwards compatibility alias
export const getDefaultCrop = getDefaultComposition;

/**
 * Computes draw dimensions and positioning for 4:3 canvas composition
 */
export function calculateCompositionBounds({
  naturalWidth,
  naturalHeight,
  mode = 'fit',
  zoom = 1.0,
  panX = 0,
  panY = 0,
  rotation = 0,
  canvasWidth = OUTPUT_WIDTH,
  canvasHeight = OUTPUT_HEIGHT
}) {
  const canvasRatio = canvasWidth / canvasHeight; // 4/3

  // Account for orientation swap when rotated 90 or 270 degrees
  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const isRotated90 = normalizedRotation === 90 || normalizedRotation === 270;
  const effectiveWidth = isRotated90 ? naturalHeight : naturalWidth;
  const effectiveHeight = isRotated90 ? naturalWidth : naturalHeight;
  const effectiveRatio = effectiveWidth / effectiveHeight;

  let baseWidth, baseHeight;

  if (mode === 'fill') {
    // COVER: Scale so canvas is completely covered without white space
    if (effectiveRatio > canvasRatio) {
      baseHeight = canvasHeight;
      baseWidth = baseHeight * effectiveRatio;
    } else {
      baseWidth = canvasWidth;
      baseHeight = baseWidth / effectiveRatio;
    }
  } else {
    // FIT (Default): Scale so entire image fits inside canvas with white letterbox/pillarbox
    if (effectiveRatio > canvasRatio) {
      // Wider than 4:3 (e.g. 16:9) -> fits full width, white top/bottom
      baseWidth = canvasWidth;
      baseHeight = baseWidth / effectiveRatio;
    } else {
      // Taller than 4:3 (e.g. 9:16 portrait, 1:1 square) -> fits full height, white left/right
      baseHeight = canvasHeight;
      baseWidth = baseHeight * effectiveRatio;
    }
  }

  // Apply user zoom (1.0 = exact fit/fill scale)
  const currentZoom = Math.max(0.5, Math.min(4.0, zoom));
  const drawWidth = baseWidth * currentZoom;
  const drawHeight = baseHeight * currentZoom;

  // Scale factor to map back to original image dimensions before rotation
  const scale = drawWidth / effectiveWidth;
  const originalDrawWidth = naturalWidth * scale;
  const originalDrawHeight = naturalHeight * scale;

  // Compute panning offsets in canvas pixel space
  const maxPanX = Math.max(canvasWidth * 0.5, (drawWidth - canvasWidth) / 2 + canvasWidth * 0.25);
  const maxPanY = Math.max(canvasHeight * 0.5, (drawHeight - canvasHeight) / 2 + canvasHeight * 0.25);

  const clampedOffsetX = Math.max(-maxPanX, Math.min(maxPanX, (panX / 100) * canvasWidth));
  const clampedOffsetY = Math.max(-maxPanY, Math.min(maxPanY, (panY / 100) * canvasHeight));

  return {
    drawWidth,
    drawHeight,
    originalDrawWidth,
    originalDrawHeight,
    clampedOffsetX,
    clampedOffsetY,
    normalizedRotation
  };
}

/**
 * Draws the composed image onto any HTML5 canvas context.
 * Used for both real-time interactive editor preview and final 1600x1200 export.
 */
export function drawCompositionOnCanvas(canvas, image, compositionParams = {}) {
  if (!canvas || !image) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // 1. Fill entire 4:3 canvas with solid pure white (#FFFFFF) — never black, never transparent
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // 2. Enable high quality multi-sampling smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 3. Calculate positioning
  const bounds = calculateCompositionBounds({
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
    mode: compositionParams.mode || 'fit',
    zoom: compositionParams.zoom !== undefined ? compositionParams.zoom : 1.0,
    panX: compositionParams.panX || 0,
    panY: compositionParams.panY || 0,
    rotation: compositionParams.rotation || 0,
    canvasWidth: width,
    canvasHeight: height
  });

  ctx.save();

  // Translate to center of canvas + user pan offset
  ctx.translate(
    width / 2 + bounds.clampedOffsetX,
    height / 2 + bounds.clampedOffsetY
  );

  // Apply user rotation
  if (bounds.normalizedRotation !== 0) {
    ctx.rotate((bounds.normalizedRotation * Math.PI) / 180);
  }

  // Draw image centered at origin
  ctx.drawImage(
    image,
    -bounds.originalDrawWidth / 2,
    -bounds.originalDrawHeight / 2,
    bounds.originalDrawWidth,
    bounds.originalDrawHeight
  );

  ctx.restore();
}

/**
 * Generates a high-resolution 4:3 composed image on a solid white background (#FFFFFF)
 * @param {HTMLImageElement} image 
 * @param {object} compositionParams 
 * @returns {Promise<{ dataUrl: string, blob: Blob, width: number, height: number }>}
 */
export async function generateComposedImage(image, compositionParams = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;

  drawCompositionOnCanvas(canvas, image, compositionParams);

  // Export as optimized web-friendly image (JPEG at 0.92 quality)
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

  const blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92);
  });

  return {
    dataUrl,
    blob,
    width: OUTPUT_WIDTH,
    height: OUTPUT_HEIGHT,
    compositionParams: {
      mode: compositionParams.mode || 'fit',
      zoom: compositionParams.zoom !== undefined ? compositionParams.zoom : 1.0,
      panX: compositionParams.panX || 0,
      panY: compositionParams.panY || 0,
      rotation: compositionParams.rotation || 0
    }
  };
}

// Backwards compatibility alias
export const generateCroppedImage = generateComposedImage;

export default {
  TARGET_ASPECT_RATIO,
  OUTPUT_WIDTH,
  OUTPUT_HEIGHT,
  loadImage,
  getDefaultComposition,
  getDefaultCrop,
  calculateCompositionBounds,
  drawCompositionOnCanvas,
  generateComposedImage,
  generateCroppedImage
};
