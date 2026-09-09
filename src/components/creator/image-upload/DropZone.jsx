import React, { useState, useRef } from 'react';
import { UploadCloud, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { MAX_IMAGES } from '../../../utils/imageValidation';

export const DropZone = ({
  onFilesSelected,
  disabled = false,
  currentCount = 0,
  maxPhotos = MAX_IMAGES,
  errors = []
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const remainingSlots = Math.max(0, maxPhotos - currentCount);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && remainingSlots > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && remainingSlots > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled || remainingSlots <= 0) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    if (!disabled && remainingSlots > 0 && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="dropzone-root">
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleInputChange}
        style={{ display: 'none' }}
        disabled={disabled || remainingSlots <= 0}
        aria-label="Upload memory photos"
      />

      {/* Main Drag & Drop Zone */}
      <div
        className={`dropzone-card ${isDragOver ? 'is-dragover' : ''} ${
          remainingSlots <= 0 ? 'is-disabled' : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        role="button"
        tabIndex={disabled || remainingSlots <= 0 ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerFileInput();
          }
        }}
        aria-label="Drop photos here or choose from your device"
      >
        <div className="dropzone-icon-circle">
          <UploadCloud size={28} className="dropzone-icon" />
        </div>

        <div className="dropzone-content">
          <h4 className="dropzone-headline">
            {remainingSlots > 0 ? (
              <>
                Drop photos here or <span className="highlight-text">choose from your device</span>
              </>
            ) : (
              `Maximum ${maxPhotos} photos selected`
            )}
          </h4>
          <p className="dropzone-subtext">
            Up to {maxPhotos} photos · 6 MB each · JPG, PNG, WEBP (4:3 memory canvas)
          </p>
        </div>

        {remainingSlots > 0 && (
          <button
            type="button"
            className="btn-add-photos"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
            aria-label="Browse device for photos"
          >
            <Plus size={16} />
            <span>Choose Photos</span>
          </button>
        )}
      </div>

      {/* Validation Error Notices */}
      {errors.length > 0 && (
        <div className="dropzone-errors-list animate-fade-in" role="alert">
          {errors.map((err, i) => (
            <div key={i} className="error-pill">
              <AlertCircle size={14} />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .dropzone-root {
          width: 100%;
          margin-bottom: var(--space-6);
        }

        .dropzone-card {
          border: 2px dashed #D6C2A0;
          background: rgba(255, 252, 245, 0.75);
          border-radius: var(--radius-lg);
          padding: var(--space-8) var(--space-6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: var(--space-4);
          cursor: pointer;
          transition: all var(--transition-normal);
          user-select: none;
        }

        .dropzone-card:hover:not(.is-disabled) {
          border-color: var(--color-gold);
          background: rgba(255, 249, 235, 0.95);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .dropzone-card.is-dragover {
          border-color: var(--color-rakhi-red);
          background: rgba(196, 30, 58, 0.05);
          transform: scale(1.01);
          box-shadow: 0 0 0 4px rgba(196, 30, 58, 0.12);
        }

        .dropzone-card.is-disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: rgba(245, 240, 230, 0.5);
          border-color: #E2D7C3;
        }

        .dropzone-card:focus-visible {
          outline: 2px solid var(--color-rakhi-red);
          outline-offset: 2px;
        }

        .dropzone-icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #FFF;
          box-shadow: 0 2px 8px rgba(196, 30, 58, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-rakhi-red);
          transition: transform var(--transition-bounce);
        }

        .dropzone-card:hover .dropzone-icon-circle {
          transform: scale(1.08);
          color: var(--color-gold-dark, #B8860B);
        }

        .dropzone-headline {
          font-family: var(--font-heading);
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--color-stone-800);
          margin-bottom: var(--space-1);
        }

        .highlight-text {
          color: var(--color-rakhi-red);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .dropzone-subtext {
          font-size: var(--text-xs);
          color: var(--color-stone-500);
          font-weight: 400;
        }

        .btn-add-photos {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--color-gold, #D4AF37);
          color: var(--color-stone-900);
          padding: var(--space-2) var(--space-5);
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: 600;
          border: none;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
          min-height: 40px;
        }

        .btn-add-photos:hover {
          background: #E5C158;
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .dropzone-errors-list {
          margin-top: var(--space-3);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .error-pill {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .dropzone-card {
            padding: var(--space-6) var(--space-4);
          }
          .dropzone-icon-circle {
            width: 50px;
            height: 50px;
          }
          .dropzone-headline {
            font-size: var(--text-base);
          }
        }
      `}</style>
    </div>
  );
};

export default DropZone;
