import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Check,
  X,
  Move,
  Crop as CropIcon,
  Sparkles
} from 'lucide-react';
import Button from '../../common/Button';
import { loadImage, generateCroppedImage } from '../../../utils/imageCrop';

export const ImageCropper = ({
  imageSrc,
  initialParams = {},
  initialCaption = '',
  onSave,
  onCancel
}) => {
  const [zoom, setZoom] = useState(initialParams.zoom || 1.0);
  const [panX, setPanX] = useState(initialParams.panX || 0);
  const [panY, setPanY] = useState(initialParams.panY || 0);
  const [rotation, setRotation] = useState(initialParams.rotation || 0);
  const [caption, setCaption] = useState(initialCaption || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialPanX: 0, initialPanY: 0 });
  const viewportRef = useRef(null);

  // Keyboard accessibility (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  // Drag Pan handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: panX,
      initialPanY: panY
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    // Scale pixel delta to percentage offset
    const sensitivity = 0.25 / zoom;
    setPanX(Math.max(-45, Math.min(45, dragStartRef.current.initialPanX + dx * sensitivity)));
    setPanY(Math.max(-45, Math.min(45, dragStartRef.current.initialPanY + dy * sensitivity)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag Pan handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        initialPanX: panX,
        initialPanY: panY
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    const sensitivity = 0.25 / zoom;
    setPanX(Math.max(-45, Math.min(45, dragStartRef.current.initialPanX + dx * sensitivity)));
    setPanY(Math.max(-45, Math.min(45, dragStartRef.current.initialPanY + dy * sensitivity)));
  };

  const handleReset = () => {
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleApplyCrop = async () => {
    try {
      setIsProcessing(true);
      const imgElement = await loadImage(imageSrc);
      const cropParams = { zoom, panX, panY, rotation };
      const croppedResult = await generateCroppedImage(imgElement, cropParams);

      onSave({
        croppedDataUrl: croppedResult.dataUrl,
        croppedBlob: croppedResult.blob,
        cropParams,
        caption: caption.trim() || null,
        width: croppedResult.width,
        height: croppedResult.height
      });
    } catch (err) {
      console.error('Crop processing failed:', err);
      alert('Could not crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="image-cropper-backdrop"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cropper-title"
    >
      <div className="image-cropper-card paper-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="cropper-header">
          <div className="cropper-title-wrap">
            <CropIcon size={18} color="var(--color-rakhi-red)" />
            <h3 id="cropper-title" className="cropper-title">
              Crop & Position Memory (4:3)
            </h3>
          </div>
          <button
            type="button"
            className="cropper-close-btn"
            onClick={onCancel}
            aria-label="Close crop modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Interactive 4:3 Crop Viewport */}
        <div
          ref={viewportRef}
          className={`cropper-viewport-frame ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Rule of Thirds Overlay Grid */}
          <div className="cropper-grid-overlay">
            <span className="grid-line h h1" />
            <span className="grid-line h h2" />
            <span className="grid-line v v1" />
            <span className="grid-line v v2" />
            <span className="crop-ratio-badge">4:3 Fixed Ratio</span>
          </div>

          {/* Transformed Image Preview */}
          <img
            src={imageSrc}
            alt="Crop Preview"
            className="cropper-preview-img"
            style={{
              transform: `scale(${zoom}) translate(${panX}%, ${panY}%) rotate(${rotation}deg)`
            }}
            draggable={false}
          />
        </div>

        <p className="cropper-hint-text">
          <Move size={12} /> Drag image to adjust position inside the 4:3 frame.
        </p>

        {/* Toolbar Controls (Zoom, Rotate, Reset) */}
        <div className="cropper-controls-strip">
          <div className="zoom-control-group">
            <button
              type="button"
              className="tool-btn"
              onClick={() => setZoom((z) => Math.max(1.0, z - 0.1))}
              disabled={zoom <= 1.0}
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>

            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="zoom-slider"
              aria-label="Zoom level"
            />

            <button
              type="button"
              className="tool-btn"
              onClick={() => setZoom((z) => Math.min(3.0, z + 0.1))}
              disabled={zoom >= 3.0}
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          <div className="action-buttons-group">
            <button
              type="button"
              className="tool-btn"
              onClick={handleRotate}
              title="Rotate 90°"
            >
              <RotateCw size={14} />
              <span>Rotate</span>
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={handleReset}
              title="Reset Crop"
            >
              <RefreshCw size={14} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Optional Caption Input */}
        <div className="cropper-caption-section">
          <div className="caption-label-row">
            <label className="caption-label">Memory Caption (Optional)</label>
            <span className="caption-counter">{caption.length}/80</span>
          </div>
          <input
            type="text"
            className="caption-input-field"
            placeholder="e.g. Partners in crime ❤️, Road trip 2022..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={80}
          />
        </div>

        {/* Footer Actions */}
        <div className="cropper-footer-actions">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleApplyCrop}
            disabled={isProcessing}
            icon={<Check size={16} />}
          >
            {isProcessing ? 'Normalizing Image...' : 'Save 4:3 Crop'}
          </Button>
        </div>
      </div>

      <style>{`
        .image-cropper-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(28, 25, 23, 0.82);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: var(--z-modal-backdrop);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          animation: fadeIn 0.2s ease-out;
        }

        .image-cropper-card {
          max-width: 580px;
          width: 100%;
          padding: var(--space-6);
          box-shadow: var(--shadow-xl);
          animation: fadeInUp 0.25s var(--ease-soft);
        }

        .cropper-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--border-light);
        }

        .cropper-title-wrap {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .cropper-title {
          font-size: 1.25rem;
          color: var(--text-primary);
          margin: 0;
        }

        .cropper-close-btn {
          color: var(--text-muted);
          background: transparent;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .cropper-close-btn:hover {
          background: var(--bg-subtle);
          color: var(--text-primary);
        }

        /* 4:3 Aspect Ratio Viewport Frame */
        .cropper-viewport-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          background: #1C1917;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: grab;
          border: 2px solid var(--color-gold);
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.6);
        }

        .cropper-viewport-frame.is-dragging {
          cursor: grabbing;
        }

        .cropper-grid-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
        }

        .grid-line {
          position: absolute;
          background: rgba(255, 255, 255, 0.25);
        }

        .grid-line.h {
          left: 0;
          right: 0;
          height: 1px;
        }

        .grid-line.h.h1 { top: 33.33%; }
        .grid-line.h.h2 { top: 66.66%; }

        .grid-line.v {
          top: 0;
          bottom: 0;
          width: 1px;
        }

        .grid-line.v.v1 { left: 33.33%; }
        .grid-line.v.v2 { left: 66.66%; }

        .crop-ratio-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(28, 25, 23, 0.75);
          color: #FFFDF9;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .cropper-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform-origin: center center;
          transition: transform 0.05s ease-out;
        }

        .cropper-hint-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-top: 6px;
          margin-bottom: var(--space-4);
        }

        /* Controls Strip */
        .cropper-controls-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          margin-bottom: var(--space-4);
          flex-wrap: wrap;
        }

        .zoom-control-group {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex: 1;
          min-width: 180px;
        }

        .zoom-slider {
          flex: 1;
          accent-color: var(--color-gold);
          cursor: pointer;
        }

        .tool-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #FFFFFF;
          border: 1px solid var(--border-default);
          color: var(--text-primary);
          padding: 5px 10px;
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tool-btn:hover:not(:disabled) {
          border-color: var(--color-gold);
          background: var(--bg-subtle);
        }

        .tool-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        /* Caption Section */
        .cropper-caption-section {
          margin-bottom: var(--space-5);
        }

        .caption-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .caption-label {
          font-size: var(--text-xs);
          font-weight: 700;
          color: var(--text-primary);
        }

        .caption-counter {
          font-size: 11px;
          color: var(--text-muted);
        }

        .caption-input-field {
          width: 100%;
          padding: 8px 12px;
          font-size: var(--text-sm);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.2s;
        }

        .caption-input-field:focus {
          border-color: var(--color-gold);
          box-shadow: 0 0 0 2px var(--color-gold-glow);
        }

        /* Footer */
        .cropper-footer-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--space-3);
          padding-top: var(--space-3);
          border-top: 1px solid var(--border-light);
        }
      `}</style>
    </div>
  );
};

export default ImageCropper;
