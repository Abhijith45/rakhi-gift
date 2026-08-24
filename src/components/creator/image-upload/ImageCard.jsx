import React from 'react';
import {
  Crop as CropIcon,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Check,
  XCircle,
  MessageSquare
} from 'lucide-react';

export const ImageCard = ({
  photo,
  index,
  total,
  allowCaptions = true,
  allowDates = true,
  onEditCrop,
  onRemove,
  onMoveUp,
  onMoveDown,
  onCaptionChange,
  onDateChange
}) => {
  const {
    previewUrl,
    croppedDataUrl,
    caption = '',
    date = '',
    status = 'READY', // 'NEEDS_CROP' | 'READY' | 'UPLOADING' | 'UPLOADED' | 'FAILED'
    error = null
  } = photo;

  const displayImage = croppedDataUrl || previewUrl;

  const renderStatusBadge = () => {
    switch (status) {
      case 'UPLOADING':
        return (
          <span className="status-badge status-uploading">
            <Loader2 size={11} className="spin-icon" /> Uploading...
          </span>
        );
      case 'UPLOADED':
        return (
          <span className="status-badge status-uploaded">
            <Check size={11} /> Saved to Cloud
          </span>
        );
      case 'FAILED':
        return (
          <span className="status-badge status-failed">
            <XCircle size={11} /> Upload Failed
          </span>
        );
      case 'NEEDS_CROP':
        return (
          <span className="status-badge status-needs-crop">
            <AlertTriangle size={11} /> Needs 4:3 Crop
          </span>
        );
      case 'READY':
      default:
        return (
          <span className="status-badge status-ready">
            <CheckCircle2 size={11} /> 4:3 Ready
          </span>
        );
    }
  };

  return (
    <div className={`memory-image-card ${status === 'FAILED' ? 'has-error' : ''}`}>
      {/* Top Card Header */}
      <div className="card-top-bar">
        <div className="card-order-chip">
          <span>#{index + 1}</span>
        </div>

        {renderStatusBadge()}

        {/* Remove Button */}
        <button
          type="button"
          className="btn-remove-photo"
          onClick={() => onRemove(photo.id)}
          title="Remove this photo"
          aria-label={`Remove photo ${index + 1}`}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* 4:3 Cropped Thumbnail Viewport */}
      <div className="photo-thumbnail-box" onClick={() => onEditCrop(photo)}>
        <img
          src={displayImage}
          alt={`Memory ${index + 1}`}
          className="thumbnail-img"
          loading="lazy"
        />

        {/* Hover overlay hint */}
        <div className="thumbnail-hover-overlay">
          <CropIcon size={20} />
          <span>Click to Adjust 4:3 Crop</span>
        </div>
      </div>

      {/* Caption & Date Inputs Area */}
      <div className="card-bottom-content">
        {allowCaptions && (
          <div className="caption-input-container">
            <MessageSquare size={13} className="caption-icon" />
            <input
              type="text"
              className="card-caption-input"
              placeholder="Add caption (e.g. Partners in crime ❤️)"
              value={caption}
              onChange={(e) => onCaptionChange && onCaptionChange(photo.id, e.target.value)}
              maxLength={80}
              aria-label={`Caption for photo ${index + 1}`}
            />
          </div>
        )}

        {allowDates && (
          <div className="caption-input-container date-input-container">
            <input
              type="text"
              className="card-caption-input"
              placeholder="Memory date (optional, e.g. Diwali 2019)"
              value={date}
              onChange={(e) => onDateChange && onDateChange(photo.id, e.target.value)}
              maxLength={24}
              aria-label={`Date for photo ${index + 1}`}
            />
          </div>
        )}

        {/* Bottom Toolbar: Reorder & Edit Buttons */}
        <div className="card-actions-strip">
          <button
            type="button"
            className="btn-edit-crop"
            onClick={() => onEditCrop(photo)}
          >
            <CropIcon size={13} />
            <span>Edit Crop</span>
          </button>

          <div className="reorder-btn-group">
            <button
              type="button"
              className="btn-reorder"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              title="Move earlier"
              aria-label="Move photo earlier"
            >
              <ArrowUp size={13} />
            </button>
            <button
              type="button"
              className="btn-reorder"
              onClick={() => onMoveDown(index)}
              disabled={index === total - 1}
              title="Move later"
              aria-label="Move photo later"
            >
              <ArrowDown size={13} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .memory-image-card {
          background: #FFFDF9;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: var(--space-3);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          transition: all 0.2s var(--ease-soft);
          position: relative;
        }

        .memory-image-card:hover {
          box-shadow: var(--shadow-md);
          border-color: #D6C2A0;
          transform: translateY(-2px);
        }

        .memory-image-card.has-error {
          border-color: #FCA5A5;
          background: #FEF2F2;
        }

        .card-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-2);
        }

        .card-order-chip {
          background: #FAF5ED;
          color: var(--text-secondary);
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-light);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10.5px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .status-ready {
          background: #ECFDF5;
          color: #047857;
          border: 1px solid #A7F3D0;
        }

        .status-needs-crop {
          background: #FFFBEB;
          color: #B45309;
          border: 1px solid #FDE68A;
        }

        .status-uploading {
          background: #EFF6FF;
          color: #1D4ED8;
          border: 1px solid #BFDBFE;
        }

        .status-uploaded {
          background: #F0FDF4;
          color: #15803D;
          border: 1px solid #BBF7D0;
        }

        .status-failed {
          background: #FEF2F2;
          color: #B91C1C;
          border: 1px solid #FECACA;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        .btn-remove-photo {
          background: transparent;
          color: var(--text-muted);
          border: none;
          padding: 6px;
          min-width: 32px;
          min-height: 32px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-remove-photo:hover {
          background: #FEE2E2;
          color: #DC2626;
        }

        /* 4:3 Aspect Ratio Viewport */
        .photo-thumbnail-box {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-subtle);
          cursor: pointer;
        }

        .thumbnail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.25s;
        }

        .thumbnail-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(28, 25, 23, 0.65);
          color: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          opacity: 0;
          transition: opacity 0.2s;
          font-size: var(--text-xs);
          font-weight: 600;
          backdrop-filter: blur(2px);
        }

        .photo-thumbnail-box:hover .thumbnail-hover-overlay {
          opacity: 1;
        }

        .photo-thumbnail-box:hover .thumbnail-img {
          transform: scale(1.04);
        }

        .card-bottom-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .caption-input-container {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-sm);
          padding: 4px 8px;
        }

        .caption-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .card-caption-input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: var(--text-xs);
          color: var(--text-primary);
        }

        .card-caption-input::placeholder {
          color: var(--text-muted);
        }

        .card-actions-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-2);
        }

        .btn-edit-crop {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #FAF5ED;
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          padding: 5px 10px;
          min-height: 32px;
          border-radius: var(--radius-sm);
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-edit-crop:hover {
          background: var(--color-gold);
          color: #FFFFFF;
          border-color: var(--color-gold);
        }

        .reorder-btn-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-reorder {
          background: #FFFFFF;
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          width: 32px;
          height: 32px;
          min-width: 32px;
          min-height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-reorder:hover:not(:disabled) {
          background: var(--bg-subtle);
          color: var(--text-primary);
          border-color: var(--color-gold);
        }

        .btn-reorder:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ImageCard;
