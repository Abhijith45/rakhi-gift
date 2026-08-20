import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  RefreshCw
} from 'lucide-react';
import DropZone from './DropZone';
import ImageCard from './ImageCard';
import ImageCropper from './ImageCropper';
import Button from '../../common/Button';
import { validateBatchFiles, MAX_IMAGES } from '../../../utils/imageValidation';
import { loadImage, getDefaultCrop, generateCroppedImage } from '../../../utils/imageCrop';
import { uploadGiftPhotos } from '../../../services/api';

export const ImageUploader = ({
  giftId,
  initialPhotos = [],
  onChange,
  onOpenPreview
}) => {
  const [photos, setPhotos] = useState([]);
  const [croppingPhoto, setCroppingPhoto] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  // Initialize from initialPhotos prop if available
  useEffect(() => {
    if (initialPhotos && initialPhotos.length > 0 && photos.length === 0) {
      const mapped = initialPhotos.map((p, idx) => ({
        id: p.id || `init-photo-${idx}`,
        previewUrl: p.imageUrl || p.url,
        croppedDataUrl: p.imageUrl || p.url,
        caption: p.caption || '',
        status: p.cloudinaryPublicId ? 'UPLOADED' : 'READY',
        cloudinaryPublicId: p.cloudinaryPublicId || null,
        url: p.imageUrl || p.url,
        displayOrder: p.displayOrder !== undefined ? p.displayOrder : idx
      }));
      setPhotos(mapped);
    }
  }, [initialPhotos]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p.previewUrl && p.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(p.previewUrl);
        }
      });
    };
  }, []);

  // Notify parent of photos changes for live preview
  const notifyParent = useCallback((updatedPhotos) => {
    if (onChange) {
      const exportPhotos = updatedPhotos.map((p, idx) => ({
        id: p.id,
        imageUrl: p.croppedDataUrl || p.previewUrl || p.url,
        url: p.url || p.croppedDataUrl || p.previewUrl,
        cloudinaryPublicId: p.cloudinaryPublicId,
        caption: p.caption,
        frameVariant: p.caption ? 'caption' : 'classic',
        displayOrder: idx,
        aspectRatio: 1.333
      }));
      onChange(exportPhotos);
    }
  }, [onChange]);

  // Handle files selected via file input or drag-and-drop
  const handleFilesSelected = async (newFiles) => {
    setValidationErrors([]);
    const { validFiles, errors } = validateBatchFiles(newFiles, photos.length);

    if (errors.length > 0) {
      setValidationErrors(errors);
    }

    if (validFiles.length === 0) return;

    const newPhotoObjects = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const blobUrl = URL.createObjectURL(file);

      try {
        const imgElement = await loadImage(blobUrl);
        const defaultCrop = getDefaultCrop(imgElement.naturalWidth, imgElement.naturalHeight);
        const croppedResult = await generateCroppedImage(imgElement, defaultCrop);

        newPhotoObjects.push({
          id: `local-photo-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          file,
          previewUrl: blobUrl,
          croppedDataUrl: croppedResult.dataUrl,
          croppedBlob: croppedResult.blob,
          cropParams: defaultCrop,
          caption: '',
          status: 'READY',
          cloudinaryPublicId: null,
          url: null,
          displayOrder: photos.length + i
        });
      } catch (err) {
        console.error('Failed to process image:', file.name, err);
        setValidationErrors((prev) => [
          ...prev,
          `Could not decode "${file.name}". Please check the image file.`
        ]);
      }
    }

    const updated = [...photos, ...newPhotoObjects];
    setPhotos(updated);
    notifyParent(updated);
  };

  // Open Cropper modal for a specific photo
  const handleEditCrop = (photo) => {
    setCroppingPhoto(photo);
  };

  // Save Crop edits
  const handleSaveCrop = (cropResult) => {
    if (!croppingPhoto) return;

    const updated = photos.map((p) => {
      if (p.id === croppingPhoto.id) {
        return {
          ...p,
          croppedDataUrl: cropResult.croppedDataUrl,
          croppedBlob: cropResult.croppedBlob,
          cropParams: cropResult.cropParams,
          caption: cropResult.caption !== undefined ? cropResult.caption : p.caption,
          status: 'READY'
        };
      }
      return p;
    });

    setPhotos(updated);
    notifyParent(updated);
    setCroppingPhoto(null);
  };

  // Update caption
  const handleCaptionChange = (photoId, newCaption) => {
    const updated = photos.map((p) =>
      p.id === photoId ? { ...p, caption: newCaption } : p
    );
    setPhotos(updated);
    notifyParent(updated);
  };

  // Remove photo
  const handleRemovePhoto = (photoId) => {
    const photoToRemove = photos.find((p) => p.id === photoId);
    if (photoToRemove && photoToRemove.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.previewUrl);
    }

    const updated = photos.filter((p) => p.id !== photoId).map((p, idx) => ({
      ...p,
      displayOrder: idx
    }));

    setPhotos(updated);
    notifyParent(updated);
  };

  // Reorder photos
  const handleMoveUp = (index) => {
    if (index <= 0) return;
    const nextList = [...photos];
    const temp = nextList[index - 1];
    nextList[index - 1] = nextList[index];
    nextList[index] = temp;

    const updated = nextList.map((p, idx) => ({ ...p, displayOrder: idx }));
    setPhotos(updated);
    notifyParent(updated);
  };

  const handleMoveDown = (index) => {
    if (index >= photos.length - 1) return;
    const nextList = [...photos];
    const temp = nextList[index + 1];
    nextList[index + 1] = nextList[index];
    nextList[index] = temp;

    const updated = nextList.map((p, idx) => ({ ...p, displayOrder: idx }));
    setPhotos(updated);
    notifyParent(updated);
  };

  // Upload processed 4:3 images to backend / Cloudinary
  const handleUploadAllToCloudinary = async () => {
    if (!giftId) {
      console.warn('Cannot upload to Cloudinary: giftId missing.');
      return;
    }

    const photosToUpload = photos.filter(
      (p) => p.status !== 'UPLOADED' && (p.croppedDataUrl || p.croppedBlob)
    );

    if (photosToUpload.length === 0) return;

    try {
      setIsUploading(true);
      setUploadProgress({ current: 0, total: photosToUpload.length });

      // Mark items as uploading
      setPhotos((prev) =>
        prev.map((p) =>
          photosToUpload.some((u) => u.id === p.id) ? { ...p, status: 'UPLOADING' } : p
        )
      );

      const payloadPhotos = photosToUpload.map((p) => ({
        data: p.croppedDataUrl,
        caption: p.caption || null,
        frameVariant: p.caption ? 'caption' : 'classic',
        displayOrder: p.displayOrder
      }));

      const res = await uploadGiftPhotos(giftId, { photos: payloadPhotos });

      if (res && Array.isArray(res)) {
        // Match uploaded records
        const updated = photos.map((p, idx) => {
          const uploadedMatch = res.find((r) => r.displayOrder === p.displayOrder) || res[idx];
          if (uploadedMatch) {
            return {
              ...p,
              status: 'UPLOADED',
              url: uploadedMatch.url,
              cloudinaryPublicId: uploadedMatch.cloudinaryPublicId
            };
          }
          return p;
        });

        setPhotos(updated);
        notifyParent(updated);
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      setPhotos((prev) =>
        prev.map((p) =>
          p.status === 'UPLOADING' ? { ...p, status: 'FAILED' } : p
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="image-uploader-root">
      {/* Upload Zone */}
      <DropZone
        onFilesSelected={handleFilesSelected}
        disabled={isUploading || photos.length >= MAX_IMAGES}
        currentCount={photos.length}
        errors={validationErrors}
      />

      {/* Upload Progress Strip */}
      {isUploading && (
        <div className="upload-progress-bar-card">
          <div className="progress-info-row">
            <span className="progress-label">
              <Loader2 size={14} className="spin-icon" /> Uploading Memories to Cloudinary...
            </span>
            <span className="progress-count">
              {uploadProgress.current} of {uploadProgress.total} uploaded
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${
                  uploadProgress.total > 0
                    ? (uploadProgress.current / uploadProgress.total) * 100
                    : 15
                }%`
              }}
            />
          </div>
        </div>
      )}

      {/* Photos Grid Area */}
      {photos.length > 0 && (
        <div className="uploaded-photos-section">
          <div className="photos-header-row">
            <div className="section-title-wrap">
              <h4 className="photos-grid-title">
                Arranged Memories ({photos.length} of {MAX_IMAGES})
              </h4>
              <p className="photos-grid-sub">
                All photos are cropped to 4:3. Click any image to adjust crop or add captions.
              </p>
            </div>

            {onOpenPreview && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onOpenPreview}
                icon={<Eye size={14} />}
              >
                Preview Memory Wall
              </Button>
            )}
          </div>

          <div className="photos-grid-layout">
            {photos.map((photo, index) => (
              <ImageCard
                key={photo.id}
                photo={photo}
                index={index}
                total={photos.length}
                onEditCrop={handleEditCrop}
                onRemove={handleRemovePhoto}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onCaptionChange={handleCaptionChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Crop Modal */}
      {croppingPhoto && (
        <ImageCropper
          imageSrc={croppingPhoto.previewUrl || croppingPhoto.croppedDataUrl}
          initialParams={croppingPhoto.cropParams}
          initialCaption={croppingPhoto.caption}
          onSave={handleSaveCrop}
          onCancel={() => setCroppingPhoto(null)}
        />
      )}

      <style>{`
        .image-uploader-root {
          width: 100%;
        }

        .upload-progress-bar-card {
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          margin-bottom: var(--space-4);
        }

        .progress-info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--text-xs);
          font-weight: 600;
          color: #1E40AF;
          margin-bottom: 6px;
        }

        .progress-label {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background: #DBEAFE;
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--color-rakhi-red);
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }

        .uploaded-photos-section {
          margin-top: var(--space-2);
        }

        .photos-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
          flex-wrap: wrap;
        }

        .photos-grid-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 2px 0;
        }

        .photos-grid-sub {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin: 0;
        }

        .photos-grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--space-4);
        }

        @media (max-width: 640px) {
          .photos-grid-layout {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-2);
          }
          .photos-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageUploader;
