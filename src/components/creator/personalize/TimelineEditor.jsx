import React, { useState, useRef } from 'react';
import { Plus, Trash2, Calendar, Image as ImageIcon, Upload, X, Crop, Check, Sparkles } from 'lucide-react';
import ImageCropper from '../image-upload/ImageCropper.jsx';
import { loadImage, getDefaultCrop, generateCroppedImage } from '../../../utils/imageCrop.js';

export const TimelineEditor = ({
  memories = [],
  availablePhotos = [],
  onChange,
  maxItems = 5,
  minItems = 3
}) => {
  const [activePhotoPickerIndex, setActivePhotoPickerIndex] = useState(null);
  const [croppingInfo, setCroppingInfo] = useState(null); // { memoryIndex, imageSrc, defaultCrop }
  const fileInputRef = useRef(null);
  const [activeUploadIndex, setActiveUploadIndex] = useState(null);

  const handleAdd = () => {
    if (memories.length >= maxItems) return;
    const updated = [
      ...memories,
      {
        date: '',
        title: '',
        description: '',
        photoId: null,
        imageUrl: null,
        thumbnailUrl: null
      }
    ];
    onChange(updated);
  };

  const handleRemove = (index) => {
    if (memories.length <= minItems) return;
    const filtered = memories.filter((_, i) => i !== index);
    onChange(filtered);
  };

  const handleChange = (index, field, value) => {
    const updated = memories.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    onChange(updated);
  };

  const handleSelectExistingPhoto = (memoryIndex, photo) => {
    const updated = memories.map((m, i) =>
      i === memoryIndex
        ? {
            ...m,
            photoId: photo.id,
            imageUrl: photo.imageUrl || photo.url,
            thumbnailUrl: photo.thumbnailUrl || photo.imageUrl || photo.url
          }
        : m
    );
    onChange(updated);
    setActivePhotoPickerIndex(null);
  };

  const handleTriggerNewUpload = (memoryIndex) => {
    setActiveUploadIndex(memoryIndex);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChosen = async (e) => {
    const file = e.target.files?.[0];
    if (!file || activeUploadIndex === null) return;

    const blobUrl = URL.createObjectURL(file);
    try {
      const img = await loadImage(blobUrl);
      const crop = getDefaultCrop(img.naturalWidth, img.naturalHeight);
      setCroppingInfo({
        memoryIndex: activeUploadIndex,
        imageSrc: blobUrl,
        defaultCrop: crop
      });
    } catch (err) {
      console.error('Error loading image for crop:', err);
    }
  };

  const handleSaveCrop = (cropResult) => {
    if (!croppingInfo) return;
    const { memoryIndex } = croppingInfo;

    const updated = memories.map((m, i) =>
      i === memoryIndex
        ? {
            ...m,
            photoId: null,
            imageUrl: cropResult.croppedDataUrl,
            thumbnailUrl: cropResult.croppedDataUrl
          }
        : m
    );
    onChange(updated);
    setCroppingInfo(null);
    setActivePhotoPickerIndex(null);
  };

  const handleRemoveImage = (index) => {
    const updated = memories.map((m, i) =>
      i === index ? { ...m, photoId: null, imageUrl: null, thumbnailUrl: null } : m
    );
    onChange(updated);
  };

  return (
    <div className="timeline-editor-root">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChosen}
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
      />

      <div className="editor-sub-header">
        <div>
          <h4 className="editor-sub-title">Our Memories Journey (Timeline)</h4>
          <p className="editor-sub-desc">
            Document key milestones and memories from childhood to today ({minItems} to {maxItems} milestones).
          </p>
        </div>
        <div className="count-pill">
          <Calendar size={12} />
          <span>{memories.length}/{maxItems} Milestones</span>
        </div>
      </div>

      <div className="timeline-stack">
        {memories.map((mem, index) => {
          const isReused = Boolean(mem.photoId);
          const hasImage = Boolean(mem.imageUrl);

          return (
            <div key={index} className="timeline-item-card">
              <div className="timeline-card-head">
                <span className="milestone-badge">Milestone #{index + 1}</span>
                {memories.length > minItems && (
                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={() => handleRemove(index)}
                    title="Remove milestone"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="timeline-card-grid">
                <div className="timeline-fields-col">
                  <div className="form-group">
                    <label className="input-label">Date or Year *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 2018 or Diwali 2019"
                      value={mem.date || ''}
                      onChange={(e) => handleChange(index, 'date', e.target.value)}
                      maxLength={20}
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Milestone Title *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Our First Roadtrip"
                      value={mem.title || ''}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      maxLength={50}
                    />
                  </div>

                  <div className="form-group">
                    <label className="input-label">Story / Memory *</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      placeholder="e.g. Flat tire in the pouring rain, but we couldn't stop laughing."
                      value={mem.description || ''}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      maxLength={250}
                    />
                  </div>
                </div>

                {/* Photo Preview / Attachment Column */}
                <div className="timeline-photo-col">
                  <label className="input-label">Milestone Photo (Optional)</label>

                  {hasImage ? (
                    <div className="attached-photo-box">
                      <img src={mem.imageUrl} alt="Timeline milestone" className="attached-thumb" />
                      <div className="photo-info-tag">
                        {isReused ? 'Using Memory Wall photo' : 'New timeline photo'}
                      </div>
                      <div className="photo-actions-overlay">
                        <button
                          type="button"
                          className="btn-thumb-action"
                          onClick={() => setActivePhotoPickerIndex(index)}
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          className="btn-thumb-action btn-danger"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="photo-placeholder-box"
                      onClick={() => setActivePhotoPickerIndex(index)}
                    >
                      <ImageIcon size={22} className="icon-subtle" />
                      <span>Select or Upload Photo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {memories.length < maxItems && (
        <button
          type="button"
          className="btn-add-dashed"
          onClick={handleAdd}
        >
          <Plus size={16} />
          <span>Add Milestone #{memories.length + 1}</span>
        </button>
      )}

      {/* Photo Picker Modal (Existing vs New Upload) */}
      {activePhotoPickerIndex !== null && (
        <div className="picker-modal-backdrop" onClick={() => setActivePhotoPickerIndex(null)}>
          <div className="picker-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h4>Choose Photo for Milestone #{activePhotoPickerIndex + 1}</h4>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setActivePhotoPickerIndex(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Option A: Existing Memory Wall Photos */}
            {availablePhotos.length > 0 && (
              <div className="picker-section">
                <span className="picker-section-label">Option A: Use one of your Memory Wall photos</span>
                <div className="existing-photos-grid">
                  {availablePhotos.map((p, pIdx) => (
                    <div
                      key={p.id || pIdx}
                      className="existing-thumb-option"
                      onClick={() => handleSelectExistingPhoto(activePhotoPickerIndex, p)}
                    >
                      <img src={p.imageUrl || p.url} alt={`Memory ${pIdx + 1}`} />
                      <span className="thumb-order-tag">#{pIdx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Option B: New Upload */}
            <div className="picker-section">
              <span className="picker-section-label">Option B: Upload a new timeline photo</span>
              <button
                type="button"
                className="btn-upload-new-timeline"
                onClick={() => handleTriggerNewUpload(activePhotoPickerIndex)}
              >
                <Upload size={16} />
                <span>Upload & Crop 4:3 Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Cropper for New Timeline Upload */}
      {croppingInfo && (
        <ImageCropper
          imageSrc={croppingInfo.imageSrc}
          initialParams={croppingInfo.defaultCrop}
          onSave={handleSaveCrop}
          onCancel={() => setCroppingInfo(null)}
        />
      )}

      <style>{`
        .timeline-editor-root {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .editor-sub-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .editor-sub-title {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary, #1E1B18);
          margin: 0 0 2px 0;
        }

        .editor-sub-desc {
          font-size: 0.8rem;
          color: var(--text-secondary, #59524C);
          margin: 0;
        }

        .count-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(198, 146, 52, 0.12);
          color: #7A5813;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .timeline-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .timeline-item-card {
          background: #FFFDF9;
          border: 1.5px solid var(--border-light, #EFE6D8);
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 6px rgba(45, 30, 15, 0.03);
          transition: border-color 0.2s ease;
        }

        .timeline-item-card:hover {
          border-color: #D4AF37;
        }

        .timeline-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .milestone-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: #7A5813;
          background: rgba(198, 146, 52, 0.12);
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .timeline-card-grid {
          display: grid;
          grid-template-columns: 1fr 180px;
          gap: 1.25rem;
        }

        .timeline-fields-col {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .timeline-photo-col {
          display: flex;
          flex-direction: column;
        }

        .input-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary, #59524C);
          margin-bottom: 3px;
          display: block;
        }

        .photo-placeholder-box {
          flex: 1;
          min-height: 120px;
          border: 1.5px dashed #D6C2A0;
          border-radius: 8px;
          background: #FAF7F2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          text-align: center;
          cursor: pointer;
          font-size: 0.75rem;
          color: var(--text-secondary, #59524C);
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .photo-placeholder-box:hover {
          background: #F2E8DC;
          border-color: #B58428;
        }

        .attached-photo-box {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--border-default);
        }

        .attached-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .photo-info-tag {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(28, 25, 23, 0.75);
          color: #FFF;
          font-size: 9px;
          font-weight: 600;
          text-align: center;
          padding: 2px 4px;
        }

        .photo-actions-overlay {
          position: absolute;
          top: 4px;
          right: 4px;
          display: flex;
          gap: 4px;
        }

        .btn-thumb-action {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0,0,0,0.1);
          color: #1E1B18;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-thumb-action.btn-danger {
          color: #DC2626;
        }

        .btn-add-dashed {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: 2px dashed #D4AF37;
          border-radius: 12px;
          background: rgba(212, 175, 55, 0.04);
          color: #7A5813;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-add-dashed:hover {
          background: rgba(212, 175, 55, 0.12);
          border-color: #B58428;
        }

        /* Modal Styles */
        .picker-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(28, 25, 23, 0.7);
          backdrop-filter: blur(4px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .picker-modal-card {
          background: #FFFDF9;
          border-radius: 16px;
          padding: 1.25rem;
          max-width: 460px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .modal-head h4 {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: 1.1rem;
          margin: 0;
        }

        .btn-close-modal {
          background: none;
          border: none;
          color: #59524C;
          cursor: pointer;
        }

        .picker-section {
          margin-bottom: 1.25rem;
        }

        .picker-section-label {
          display: block;
          font-size: 0.775rem;
          font-weight: 700;
          color: var(--text-secondary, #59524C);
          margin-bottom: 8px;
        }

        .existing-photos-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .existing-thumb-option {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
        }

        .existing-thumb-option:hover {
          border-color: #D4AF37;
          transform: scale(1.04);
        }

        .existing-thumb-option img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .thumb-order-tag {
          position: absolute;
          top: 2px;
          left: 2px;
          background: rgba(0,0,0,0.6);
          color: #FFF;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 4px;
          border-radius: 3px;
        }

        .btn-upload-new-timeline {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: 8px;
          background: #FAF5ED;
          border: 1px solid #EFE6D8;
          color: var(--text-primary, #1E1B18);
          font-weight: 600;
          font-size: 0.825rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-upload-new-timeline:hover {
          background: #F0E6D8;
        }

        @media (max-width: 640px) {
          .timeline-card-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TimelineEditor;
