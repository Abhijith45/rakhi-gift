import fs from 'fs';
import path from 'path';

let cloudinary = null;

// Dynamically import cloudinary SDK
try {
  const mod = await import('cloudinary');
  cloudinary = mod.v2;
} catch (e) {
  // Cloudinary module not installed; fallback to local storage
}

const isCloudinaryConfigured = !!(
  cloudinary &&
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured && cloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

/**
 * Uploads buffer to Cloudinary or saves locally to uploads directory
 */
export async function uploadImageBuffer(buffer, originalname = 'memory.jpg') {
  if (isCloudinaryConfigured && cloudinary) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'rakhi_memories',
          resource_type: 'image',
          transformation: [
            { width: 1600, height: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            thumbnailUrl: cloudinary.url(result.public_id, {
              width: 480,
              height: 360,
              crop: 'fill',
              quality: 'auto',
              fetch_format: 'auto'
            }),
            publicId: result.public_id,
            width: result.width || 1600,
            height: result.height || 1200,
            format: result.format,
            bytes: result.bytes
          });
        }
      );

      uploadStream.end(buffer);
    });
  }

  // Local storage fallback for offline/development environments
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(originalname) || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, buffer);

  const localUrl = `/uploads/${filename}`;
  return {
    url: localUrl,
    thumbnailUrl: localUrl,
    publicId: filename,
    width: 1600,
    height: 1200,
    format: ext.replace('.', ''),
    bytes: buffer.length
  };
}

export default {
  uploadImageBuffer,
  isCloudinaryConfigured
};
