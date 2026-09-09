import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Check,
  X,
  Move,
  Maximize2,
  Minimize2,
  Sliders
} from 'lucide-react';
import Button from '../../common/Button';
import {
  loadImage,
  generateComposedImage,
  drawCompositionOnCanvas,
  getDefaultComposition
} from '../../../utils/imageCrop';

export const ImageCropper = ({
  imageSrc,
  initialParams = {},
  initialCaption = '',
  allowCaption = true,
  onSave,
  onCancel
}) => {
  const [mode, setMode] = useState(initialParams.mode || 'fit'); // 'fit' (default) | 'fill'
  const [zoom, setZoom] = useState(initialParams.zoom !== undefined ? initialParams.zoom : 1.0);
  const [panX, setPanX] = useState(initialParams.panX || 0);
  const [panY, setPanY] = useState(initialParams.panY || 0);
  const [rotation, setRotation] = useState(initialParams.rotation || 0);
  const [caption, setCaption] = useState(initialCaption || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImageReady, setIsImageReady] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialPanX: 0, initialPanY: 0 });
  const canvasRef = useRef(null);
  const imageElementRef = useRef(null);

  // Load the source image into memory once
  useEffect(() => {
    let isMounted = true;
    setIsImageReady(false);

    loadImage(imageSrc)
      .then((img) => {
        if (isMounted) {
          imageElementRef.current = img;
          setIsImageReady(true);
        }
      })
      .catch((err) => {
        console.error('Failed to load image for composition editor:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [imageSrc]);

  // Redraw interactive 4:3 canvas preview whenever composition parameters change
  const redrawCanvas = useCallback(() => {
    if (!canvasRef.current || !imageElementRef.current) return;
    drawCompositionOnCanvas(canvasRef.current, imageElementRef.current, {
      mode,
      zoom,
      panX,
      panY,
      rotation
    });
  }, [mode, zoom, panX, panY, rotation]);

  useEffect(() => {
    if (isImageReady) {
      redrawCanvas();
    }
  }, [isImageReady, redrawCanvas]);

  // Keyboard accessibility (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  // Drag Pan handlers (Mouse)
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

    const sensitivity = 0.22 / zoom;
    setPanX(Math.max(-50, Math.min(50, dragStartRef.current.initialPanX + dx * sensitivity)));
    setPanY(Math.max(-50, Math.min(50, dragStartRef.current.initialPanY + dy * sensitivity)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag Pan handlers (Mobile)
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
    setPanX(Math.max(-50, Math.min(50, dragStartRef.current.initialPanX + dx * sensitivity)));
    setPanY(Math.max(-50, Math.min(50, dragStartRef.current.initialPanY + dy * sensitivity)));
  };

  // Mode & Transform handlers
  const handleSetFit = () => {
    setMode('fit');
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
  };

  const handleSetFill = () => {
    setMode('fill');
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
  };

  const handleReset = () => {
    const def = getDefaultComposition();
    setMode(def.mode);
    setZoom(def.zoom);
    setPanX(def.panX);
    setPanY(def.panY);
    setRotation(def.rotation);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const imgElement = imageElementRef.current || (await loadImage(imageSrc));
      const compositionParams = { mode, zoom, panX, panY, rotation };
      const composedResult = await generateComposedImage(imgElement, compositionParams);

      onSave({
        croppedDataUrl: composedResult.dataUrl,
        croppedBlob: composedResult.blob,
        cropParams: compositionParams,
        compositionParams,
        caption: caption.trim() || null,
        width: composedResult.width,
        height: composedResult.height
      });
    } catch (err) {
      console.error('Composition processing failed:', err);
      alert('Could not compose photo. Please try again.');
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
            <div className="cropper-icon-badge">
              <Sliders size={18} />
            </div>
            <div>
              <h3 id="cropper-title" className="cropper-title">
                Adjust Your Photo
              </h3>
              <p className="cropper-subtitle">
                Move or zoom the photo to choose exactly what appears in the memory frame.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="cropper-close-btn"
            onClick={onCancel}
            aria-label="Close photo editor"
          >
            <X size={18} />
          </button>
        </div>

        {/* Outer Workspace containing the 4:3 White Canvas */}
        <div className="cropper-workspace">
          <div
            className={`cropper-canvas-frame ${isDragging ? 'is-dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Interactive 4:3 Canvas Rendering (Pixel-identical to export) */}
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="cropper-canvas-element"
            />

            {/* Rule of Thirds Overlay Grid (visible during drag) */}
            <div className={`cropper-grid-overlay ${isDragging ? 'visible' : ''}`}>
              <span className="grid-line h h1" />
              <span className="grid-line h h2" />
              <span className="grid-line v v1" />
              <span className="grid-line v v2" />
            </div>
          </div>

          <div className="workspace-subtle-bar">
            <span className="subtle-frame-tag">Final frame · 4:3</span>
          </div>
        </div>

        {/* Contextual Hint */}
        <p className="cropper-hint-text">
          <Move size={13} /> Your full photo is preserved in Fit mode • White background fills open edges
        </p>

        {/* Composition Controls Strip */}
        <div className="cropper-controls-strip">
          {/* Quick Fit / Fill Modes */}
          <div className="mode-toggle-group" role="group" aria-label="Composition Mode">
            <button
              type="button"
              className={`mode-btn ${mode === 'fit' ? 'is-active' : ''}`}
              onClick={handleSetFit}
              title="Show entire photo with white borders where needed"
              aria-pressed={mode === 'fit'}
            >
              <Minimize2 size={13} />
              <span>Fit Photo</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'fill' ? 'is-active' : ''}`}
              onClick={handleSetFill}
              title="Fill entire 4:3 frame without white borders"
              aria-pressed={mode === 'fill'}
            >
              <Maximize2 size={13} />
              <span>Fill Frame</span>
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="zoom-control-group">
            <button
              type="button"
              className="tool-icon-btn"
              onClick={() => setZoom((z) => Math.max(0.6, parseFloat((z - 0.1).toFixed(2))))}
              disabled={zoom <= 0.6}
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut size={15} />
            </button>

            <input
              type="range"
              min="0.6"
              max="3.0"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="zoom-slider"
              aria-label="Zoom level"
            />

            <button
              type="button"
              className="tool-icon-btn"
              onClick={() => setZoom((z) => Math.min(3.0, parseFloat((z + 0.1).toFixed(2))))}
              disabled={zoom >= 3.0}
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn size={15} />
            </button>
          </div>

          {/* Rotate & Reset */}
          <div className="utility-buttons-group">
            <button
              type="button"
              className="tool-action-btn"
              onClick={handleRotate}
              title="Rotate 90° clockwise"
              aria-label="Rotate photo 90 degrees"
            >
              <RotateCw size={13} />
              <span>Rotate</span>
            </button>
            <button
              type="button"
              className="tool-action-btn"
              onClick={handleReset}
              title="Reset to default Fit"
              aria-label="Reset photo adjustments to default fit"
            >
              <RefreshCw size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Optional Caption Input (if allowed) */}
        {allowCaption && (
          <div className="cropper-caption-section">
            <div className="caption-label-row">
              <label className="caption-label" htmlFor="photo-caption-input">
                Memory Caption (Optional)
              </label>
              <span className="caption-counter">{caption.length}/80</span>
            </div>
            <input
              id="photo-caption-input"
              type="text"
              className="caption-input-field"
              placeholder="e.g. Partners in crime ❤️, Summer trip 2019..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={80}
            />
          </div>
        )}

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
            onClick={handleSave}
            disabled={isProcessing}
            icon={<Check size={16} />}
          >
            {isProcessing ? 'Saving Photo...' : 'Save Photo'}
          </Button>
        </div>
      </div>

      <style>{`
        .image-cropper-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(28, 25, 23, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: var(--z-modal-backdrop, 1000);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          animation: fadeIn 0.2s ease-out;
        }

        .image-cropper-card {
          width: 100%;
          max-width: 580px;
          max-height: 94vh;
          overflow-y: auto;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.28);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          position: relative;
        }

        .cropper-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-3);
          border-bottom: 1px solid #F0E8DC;
          padding-bottom: var(--space-3);
        }

        .cropper-title-wrap {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .cropper-icon-badge {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #FAF3E8;
          color: var(--color-rakhi-red, #C41E3A);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cropper-title {
          font-family: var(--font-heading);
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--color-stone-900);
          margin: 0;
          line-height: 1.2;
        }

        .cropper-subtitle {
          font-size: var(--text-xs);
          color: var(--color-stone-500);
          margin: 2px 0 0 0;
        }

        .cropper-close-btn {
          background: none;
          border: none;
          color: var(--color-stone-400);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .cropper-close-btn:hover {
          color: var(--color-stone-800);
          background: #F5EFEB;
        }

        /* 4:3 Canvas Workspace */
        .cropper-workspace {
          background: #1C1917;
          border-radius: var(--radius-md);
          padding: var(--space-3);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          overflow: hidden;
        }

        .cropper-canvas-frame {
          width: 100%;
          max-width: 480px;
          aspect-ratio: 4 / 3;
          background: #FFFFFF; /* Pure white background for 4:3 canvas */
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
          cursor: grab;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cropper-canvas-frame.is-dragging {
          cursor: grabbing;
        }

        .cropper-canvas-element {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #FFFFFF;
          display: block;
          user-select: none;
          pointer-events: none;
        }

        .workspace-subtle-bar {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .subtle-frame-tag {
          font-size: 11px;
          color: #A8A29E;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .cropper-grid-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease;
          z-index: 5;
        }

        .cropper-grid-overlay.visible {
          opacity: 1;
        }

        .grid-line {
          position: absolute;
          background: rgba(212, 175, 55, 0.45);
        }

        .grid-line.h {
          left: 0;
          right: 0;
          height: 1px;
        }
        .grid-line.h1 { top: 33.333%; }
        .grid-line.h2 { top: 66.666%; }

        .grid-line.v {
          top: 0;
          bottom: 0;
          width: 1px;
        }
        .grid-line.v1 { left: 33.333%; }
        .grid-line.v2 { left: 66.666%; }

        .cropper-hint-text {
          font-size: 11px;
          color: var(--color-stone-500);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin: 0;
          text-align: center;
        }

        /* Controls Strip */
        .cropper-controls-strip {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          background: #FAF6EF;
          border: 1px solid #EAE0D0;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
        }

        .mode-toggle-group {
          display: flex;
          background: #E8DFCE;
          border-radius: var(--radius-sm);
          padding: 2px;
          gap: 2px;
        }

        .mode-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--color-stone-700);
          font-size: 11px;
          font-weight: 600;
          padding: 5px 11px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .mode-btn.is-active {
          background: #FFFFFF;
          color: var(--color-rakhi-red, #C41E3A);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .zoom-control-group {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex: 1;
          min-width: 140px;
          max-width: 200px;
        }

        .tool-icon-btn {
          background: #FFFFFF;
          border: 1px solid #D6C7AE;
          color: var(--color-stone-700);
          border-radius: var(--radius-sm);
          padding: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .tool-icon-btn:hover:not(:disabled) {
          background: #FDF9F2;
          color: var(--color-rakhi-red);
          border-color: var(--color-rakhi-red);
        }

        .tool-icon-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .zoom-slider {
          flex: 1;
          accent-color: var(--color-rakhi-red, #C41E3A);
          cursor: pointer;
        }

        .utility-buttons-group {
          display: flex;
          gap: var(--space-2);
        }

        .tool-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #FFFFFF;
          border: 1px solid #D6C7AE;
          color: var(--color-stone-700);
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .tool-action-btn:hover {
          background: #FAF3E8;
          color: var(--color-stone-900);
          border-color: var(--color-gold);
        }

        /* Caption Section */
        .cropper-caption-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .caption-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--text-xs);
          color: var(--color-stone-600);
          font-weight: 500;
        }

        .caption-counter {
          color: var(--color-stone-400);
          font-size: 11px;
        }

        .caption-input-field {
          width: 100%;
          padding: 8px 12px;
          font-size: var(--text-xs);
          border: 1px solid #D6C7AE;
          border-radius: var(--radius-sm);
          background: #FFFDF9;
          color: var(--color-stone-800);
          transition: all var(--transition-fast);
        }

        .caption-input-field:focus {
          outline: none;
          border-color: var(--color-gold);
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.15);
          background: #FFFFFF;
        }

        /* Footer Actions */
        .cropper-footer-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--space-3);
          border-top: 1px solid #F0E8DC;
          padding-top: var(--space-4);
          margin-top: var(--space-1);
        }

        /* Mobile full/near-full-screen optimization */
        @media (max-width: 640px) {
          .image-cropper-backdrop {
            padding: 0;
            align-items: flex-end;
          }

          .image-cropper-card {
            max-width: 100%;
            max-height: 96vh;
            border-radius: var(--radius-lg) var(--radius-lg) 0 0;
            padding: var(--space-4);
            padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom, 16px));
          }

          .cropper-controls-strip {
            padding: var(--space-2);
            gap: var(--space-2);
          }

          .zoom-control-group {
            order: 3;
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageCropper;
