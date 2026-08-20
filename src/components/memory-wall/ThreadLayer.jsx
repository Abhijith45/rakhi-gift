import React, { useMemo } from 'react';

/**
 * Pure SVG Thread Layer
 * Renders smooth cubic Bézier sag curves between photo frame pins in sacred crimson thread.
 */
export const ThreadLayer = ({
  photos = [],
  connections = [],
  isMobile = false
}) => {
  // Compute pin anchor coordinates (% of container width/height)
  const pinPoints = useMemo(() => {
    return photos.map((p) => {
      // Frame top-center anchor:
      // X = left + (width / 2)
      // Y = top + slight offset for the clip
      const x = p.left + (p.width / 2);
      const y = p.top - 0.5;
      return { x, y };
    });
  }, [photos]);

  // Generate curved SVG path strings
  const paths = useMemo(() => {
    const list = [];

    connections.forEach(([idxA, idxB], i) => {
      const p1 = pinPoints[idxA];
      const p2 = pinPoints[idxB];
      if (!p1 || !p2) return;

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Natural gravity sag percentage based on span distance
      const sag = Math.min(6.5, Math.max(1.8, dist * 0.08));

      // Control points for cubic Bézier curve
      const cx1 = p1.x + dx * 0.3;
      const cy1 = p1.y + dy * 0.3 + sag;
      const cx2 = p1.x + dx * 0.7;
      const cy2 = p1.y + dy * 0.7 + sag;

      const d = `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
      list.push({ id: `thread-${i}`, d });
    });

    return list;
  }, [pinPoints, connections]);

  return (
    <svg
      className="memory-wall-thread-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="thread-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.3" floodColor="#3A1C12" floodOpacity="0.35" />
        </filter>
      </defs>

      {paths.map(({ id, d }) => (
        <path
          key={id}
          d={d}
          className="thread-path"
          filter="url(#thread-shadow)"
        />
      ))}

      <style>{`
        .memory-wall-thread-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 4;
        }

        .thread-path {
          fill: none;
          stroke: #9B2226; /* Rakhi Crimson */
          stroke-width: 0.28;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: 0.88;
        }

        @media (max-width: 768px) {
          .thread-path {
            stroke-width: 0.35;
          }
        }
      `}</style>
    </svg>
  );
};

export default ThreadLayer;
