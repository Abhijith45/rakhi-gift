import React from 'react';
import {
  Sliders,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Loader2,
  XCircle,
  MessageSquare,
  Calendar
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
    status = 'READY',
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
      case 'FAILED':
        return (
          <span className="status-badge status-failed">
            <XCircle size={11} /> Upload Failed
          </span>
        );
      case 'UPLOADED':
      case 'READY':
      default:
        return (
          <span className="status-badge status-ready">
            <CheckCircle2 size={11} /> Ready
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

      {/* 4:3 Composed Thumbnail Viewport — Clickable to Adjust Photo */}
      <div
        className="photo-thumbnail-box"
        onClick={() => onEditCrop(photo)}
        role="button"
        tabIndex={0}
        aria-label={`Adjust photo ${index + 1}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEditCrop(photo);
          }
        }}
      >
        <img
          src={displayImage}
          alt={`Memory ${index + 1}`}
          className="thumbnail-img"
          loading="lazy"
        />

        {/* Hover overlay hint */}
        <div className="thumbnail-hover-overlay">
          <Sliders size={20} />
          <span>Adjust Photo</span>
        </div>
      </div>

      {/* Caption & Date Inputs Area (Package-aware) */}
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
            <Calendar size={13} className="caption-icon" />
            <input
              type="text"
              className="card-caption-input"
              placeholder="Memory date (optional, e.g. Summer 2018)"
              value={date}
              onChange={(e) => onDateChange && onDateChange(photo.id, e.target.value)}
              maxLength={24}
              aria-label={`Date for photo ${index + 1}`}
            />
          </div>
        )}

        {/* Bottom Toolbar: Adjust Photo Action & Reorder Buttons */}
        <div className="card-actions-strip">
          <button
            type="button"
            className="btn-edit-crop"
            onClick={() => onEditCrop(photo)}
            aria-label={`Adjust composition for photo ${index + 1}`}
          >
            <Sliders size={13} />
            <span>Adjust Photo</span>
          </button>

          <div className="reorder-btn-group">
            <button
              type="button"
              className="btn-reorder"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              title="Move photo earlier"
              aria-label={`Move photo ${index + 1} earlier`}
            >
              <ArrowUp size={13} />
            </button>
            <button
              type="button"
              className="btn-reorder"
              onClick={() => onMoveDown(index)}
              disabled={index === total - 1}
              title="Move photo later"
              aria-label={`Move photo ${index + 1} later`}
            >
              <ArrowDown size={13} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .memory-image-card {
          background: #FFFFFF;
          border: 1px solid #EAE0D0;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: all var(--transition-normal);
          position: relative;
        }

        .memory-image-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-gold-light, #E8D3A2);
        }

        .memory-image-card.has-error {
          border-color: #EF4444;
        }

        .card-top-bar {
          padding: var(--space-2) var(--space-3);
          background: #FAF6EF;
          border-bottom: 1px solid #F0E6D8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-2);
        }

        .card-order-chip {
          background: #E8DFCE;
          color: var(--color-stone-700);
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .status-ready {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }

        .status-uploading {
          background: #EFF6FF;
          color: #1E40AF;
          border: 1px solid #BFDBFE;
        }

        .status-failed {
          background: #FEF2F2;
          color: #991B1B;
          border: 1px solid #FECACA;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        .btn-remove-photo {
          background: none;
          border: none;
          color: var(--color-stone-400);
          cursor: pointer;
          padding: 4px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color var(--transition-fast), background var(--transition-fast);
        }

        .btn-remove-photo:hover {
          color: #DC2626;
          background: #FEE2E2;
        }

        .photo-thumbnail-box {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          background: #FFFFFF;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #F0E6D8;
        }

        .photo-thumbnail-box:focus-visible {
          outline: 2px solid var(--color-rakhi-red);
          outline-offset: -2px;
        }

        .thumbnail-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #FFFFFF;
          display: block;
          transition: transform var(--transition-normal);
        }

        .photo-thumbnail-box:hover .thumbnail-img {
          transform: scale(1.02);
        }

        .thumbnail-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(28, 25, 23, 0.72);
          backdrop-filter: blur(2px);
          color: #FFF;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: var(--text-xs);
          font-weight: 600;
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .photo-thumbnail-box:hover .thumbnail-hover-overlay {
          opacity: 1;
        }

        .card-bottom-content {
          padding: var(--space-3);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          flex: 1;
        }

        .caption-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .caption-icon {
          position: absolute;
          left: 10px;
          color: var(--color-stone-400);
          pointer-events: none;
        }

        .card-caption-input {
          width: 100%;
          padding: 6px 10px 6px 30px;
          font-size: var(--text-xs);
          border: 1px solid #E2D7C3;
          border-radius: var(--radius-sm);
          background: #FFFDF9;
          color: var(--color-stone-800);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .card-caption-input:focus {
          outline: none;
          border-color: var(--color-gold);
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.15);
          background: #FFF;
        }

        .card-actions-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-2);
          margin-top: auto;
          padding-top: var(--space-1);
        }

        .btn-edit-crop {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FAF6EE;
          border: 1px solid #D6C7AE;
          color: var(--color-stone-800);
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
          min-height: 28px;
        }

        .btn-edit-crop:hover {
          background: var(--color-gold, #D4AF37);
          color: var(--color-stone-900);
          border-color: var(--color-gold-dark, #B8860B);
        }

        .reorder-btn-group {
          display: flex;
          gap: 2px;
        }

        .btn-reorder {
          background: #FAF6EE;
          border: 1px solid #E2D7C3;
          color: var(--color-stone-600);
          padding: 4px 6px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          min-width: 26px;
          min-height: 26px;
        }

        .btn-reorder:hover:not(:disabled) {
          background: #E8DFCE;
          color: var(--color-stone-900);
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
