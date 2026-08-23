import React, { useRef, useEffect, useCallback } from 'react';
import { getWallConfig } from './wallConfig';

/**
 * Pure 2D Canvas Sacred Thread Network
 * Renders physical crimson silk threads connecting photo mounting pins with natural sag.
 * Fully responsive, high-DPI calibrated, zero continuous redraw loops.
 */
export const ThreadLayer = ({
  photos = [],
  connections = [],
  viewport = 'desktop',
  isMobile = false,
  plan = 'PREMIUM',
  theme = null
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const config = getWallConfig(plan);
  const normalizedPlan = (plan || 'PREMIUM').toUpperCase();
  const isDeluxe = normalizedPlan === 'DELUXE';
  const resolvedMode = viewport || (isMobile ? 'mobile' : 'desktop');

  // Draw thread network onto the 2D canvas
  const drawThreads = useCallback((width, height) => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0 || photos.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Set high-DPI buffer dimensions
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    // Reset transform & scale to DPR
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Clear previous drawing
    ctx.clearRect(0, 0, width, height);

    if (connections.length === 0) return;

    // Calculate deterministic pin anchor points in actual pixels
    const yOffsetPercent = resolvedMode === 'mobile' ? 0.75 : resolvedMode === 'tablet' ? 0.65 : 0.55;
    const pinCoords = photos.map((p) => {
      const x = ((p.left + (p.width / 2)) / 100) * width;
      const y = ((p.top + yOffsetPercent) / 100) * height;
      return { x, y };
    });

    // Theme-aware Silk thread color
    let themeThreadColor = null;
    if (theme && typeof theme === 'object' && theme.wall?.threadColor) {
      themeThreadColor = theme.wall.threadColor;
    } else if (typeof window !== 'undefined' && canvas) {
      const computedVar = getComputedStyle(canvas).getPropertyValue('--gift-thread').trim();
      if (computedVar) themeThreadColor = computedVar;
    }

    const threadColor = themeThreadColor || (isDeluxe ? '#841519' : (config.threadColor || '#9B2226'));
    const threadWidth = resolvedMode === 'mobile' ? 1.5 : resolvedMode === 'tablet' ? 1.8 : (isDeluxe ? 2.3 : 2.0);

    // 1. Draw subtle ambient contact shadow below threads
    ctx.save();
    ctx.strokeStyle = isDeluxe ? 'rgba(40, 14, 10, 0.28)' : 'rgba(58, 28, 18, 0.22)';
    ctx.lineWidth = threadWidth + 1.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    connections.forEach(([idxA, idxB]) => {
      const p1 = pinCoords[idxA];
      const p2 = pinCoords[idxB];
      if (!p1 || !p2) return;

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Natural gravitational sag
      const sag = Math.min(38, Math.max(8, dist * 0.065));

      // Control points for cubic Bézier curve with shadow offset
      const cx1 = p1.x + dx * 0.33;
      const cy1 = p1.y + dy * 0.33 + sag + 1.8;
      const cx2 = p1.x + dx * 0.67;
      const cy2 = p1.y + dy * 0.67 + sag + 1.8;

      ctx.beginPath();
      ctx.moveTo(p1.x + 0.8, p1.y + 1.8);
      ctx.bezierCurveTo(cx1, cy1, cx2, cy2, p2.x + 0.8, p2.y + 1.8);
      ctx.stroke();
    });
    ctx.restore();

    // 2. Draw the primary crimson silk threads
    ctx.save();
    ctx.strokeStyle = threadColor;
    ctx.lineWidth = threadWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = config.threadOpacity || 0.92;

    connections.forEach(([idxA, idxB]) => {
      const p1 = pinCoords[idxA];
      const p2 = pinCoords[idxB];
      if (!p1 || !p2) return;

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Natural gravitational sag
      const sag = Math.min(36, Math.max(7, dist * 0.062));

      const cx1 = p1.x + dx * 0.33;
      const cy1 = p1.y + dy * 0.33 + sag;
      const cx2 = p1.x + dx * 0.67;
      const cy2 = p1.y + dy * 0.67 + sag;

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.bezierCurveTo(cx1, cy1, cx2, cy2, p2.x, p2.y);
      ctx.stroke();
    });
    ctx.restore();

    // 3. For Deluxe tier: add subtle golden filament accent along alternate threads
    if (isDeluxe) {
      ctx.save();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
      ctx.lineWidth = 0.8;
      ctx.lineCap = 'round';

      connections.forEach(([idxA, idxB], i) => {
        if (i % 2 !== 0) return;
        const p1 = pinCoords[idxA];
        const p2 = pinCoords[idxB];
        if (!p1 || !p2) return;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const sag = Math.min(36, Math.max(7, dist * 0.062));

        const cx1 = p1.x + dx * 0.33;
        const cy1 = p1.y + dy * 0.33 + sag - 0.4;
        const cx2 = p1.x + dx * 0.67;
        const cy2 = p1.y + dy * 0.67 + sag - 0.4;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y - 0.4);
        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, p2.x, p2.y - 0.4);
        ctx.stroke();
      });
      ctx.restore();
    }
  }, [photos, connections, resolvedMode, isDeluxe, config]);

  // Monitor container size with ResizeObserver to render once and adjust on resize
  useEffect(() => {
    const container = containerRef.current?.parentElement;
    if (!container) return;

    const handleResize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth > 0 && clientHeight > 0) {
        drawThreads(clientWidth, clientHeight);
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [drawThreads]);

  return (
    <div ref={containerRef} className="memory-wall-thread-canvas-container" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="memory-wall-thread-canvas"
      />

      <style>{`
        .memory-wall-thread-canvas-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 3;
          overflow: hidden;
        }

        .memory-wall-thread-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default ThreadLayer;
