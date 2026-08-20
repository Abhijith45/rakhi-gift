import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Plus, AlertCircle } from 'lucide-react';
import { MAX_IMAGES } from '../../../utils/imageValidation';

export const DropZone = ({
  onFilesSelected,
  disabled = false,
  currentCount = 0,
  errors = []
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const remainingSlots = MAX_IMAGES - currentCount;

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
      // Reset input value so re-selecting same file triggers change
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
        aria-label="Upload memories"
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
        aria-label="Drag and drop photos or click to browse"
      >
        <div className="dropzone-icon-circle">
          <UploadCloud size={28} className="dropzone-icon" />
        </div>

        <div className="dropzone-content">
          <h4 className="dropzone-headline">
            {remainingSlots > 0 ? (
              <>
                Drag & drop your photos here, or <span className="highlight-text">browse device</span>
              </>
            ) : (
              'Maximum 8 photos selected'
            )}
          </h4>
          <p className="dropzone-subtext">
            Up to 8 photos • Max 6 MB each • JPG, PNG, WEBP (Cropped to 4:3)
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
          >
            <Plus size={16} />
            <span>Add Memories</span>
          </button>
        )}
      </div>

      {/* Validation Error Notices */}
      {errors.length > 0 && (
        <div className="dropzone-errors-list">
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
          cursor: pointer;
          transition: all 0.25s var(--ease-soft);
          gap: var(--space-3);
        }

        .dropzone-card:hover:not(.is-disabled) {
          border-color: var(--color-gold);
          background: rgba(255, 250, 238, 0.95);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .dropzone-card.is-dragover {
          border-color: var(--color-gold);
          background: rgba(212, 175, 55, 0.12);
          border-style: solid;
          transform: scale(1.01);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }

        .dropzone-card.is-disabled {
          opacity: 0.6;
          cursor: not-allowed;
          border-color: var(--border-default);
        }

        .dropzone-icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-rakhi-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-rakhi-red);
          transition: transform 0.25s;
        }

        .dropzone-card:hover:not(.is-disabled) .dropzone-icon-circle {
          transform: scale(1.08);
        }

        .dropzone-headline {
          font-size: 1.05rem;
          color: var(--text-primary);
          margin: 0 0 4px 0;
          font-weight: 600;
        }

        .highlight-text {
          color: var(--color-rakhi-red);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .dropzone-subtext {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin: 0;
        }

        .btn-add-photos {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid var(--color-gold);
          color: var(--text-primary);
          padding: 8px 18px;
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: 600;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s;
          cursor: pointer;
        }

        .btn-add-photos:hover {
          background: var(--color-gold);
          color: #FFFFFF;
        }

        .dropzone-errors-list {
          margin-top: var(--space-3);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .error-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #B91C1C;
          border-radius: var(--radius-md);
          font-size: var(--text-xs);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default DropZone;
