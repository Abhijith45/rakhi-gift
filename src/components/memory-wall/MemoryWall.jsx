import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Info, Heart } from 'lucide-react';
import WallBackground from './WallBackground';
import ThreadLayer from './ThreadLayer';
import PhotoFrame from './PhotoFrame';
import DecorativeCard from './DecorativeCard';
import MemoryWallOverlay from './MemoryWallOverlay';
import { getWallLayout, getThreadConnections } from './layoutUtils';

export const MemoryWall = ({ gift, mode = 'full' }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const rawPhotos = useMemo(() => {
    return gift?.photos && gift.photos.length > 0 ? gift.photos : [];
  }, [gift]);

  // Window resize handler
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Compute positioned photos & thread pairings
  const positionedPhotos = useMemo(() => {
    return getWallLayout(rawPhotos, isMobile);
  }, [rawPhotos, isMobile]);

  const threadPairs = useMemo(() => {
    return getThreadConnections(rawPhotos.length);
  }, [rawPhotos.length]);

  return (
    <div className={`memory-wall-wrapper mode-${mode}`}>
      {/* Top Interactive Banner / Hint */}
      <div className="memory-wall-toolbar">
        <div className="wall-status-pill">
          <Sparkles size={14} className="sparkle-gold" />
          <span>Interactive Memory Wall — Mounted with brass clips & sacred thread</span>
        </div>

        <div className="wall-photo-counter">
          <Heart size={13} className="counter-heart" />
          <span>{rawPhotos.length} Memories Connected</span>
        </div>
      </div>

      {/* Main Physical Wall Stage */}
      <div className="memory-wall-stage">
        <WallBackground>
          {/* Crimson Thread Layer (Behind Frames) */}
          <ThreadLayer
            photos={positionedPhotos}
            connections={threadPairs}
            isMobile={isMobile}
          />

          {/* Mounted Physical Photo Frames */}
          {positionedPhotos.map((photo, index) => (
            <PhotoFrame
              key={photo.id || `photo-${index}`}
              photo={photo}
              index={index}
              onClick={setSelectedPhoto}
              isMobile={isMobile}
            />
          ))}

          {/* Center-Bottom Decorative Quote Card */}
          {!isMobile && (
            <DecorativeCard top={72} left={50.5} rot={0.5} />
          )}
        </WallBackground>

        {/* Ambient Subtle Instructions Banner */}
        <div className="wall-hint-overlay">
          <Info size={13} />
          <span>Click any photo to explore the memory & story</span>
        </div>
      </div>

      {/* Click-to-inspect Modal Overlay */}
      <MemoryWallOverlay
        photo={selectedPhoto}
        allPhotos={rawPhotos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={setSelectedPhoto}
      />

      <style>{`
        .memory-wall-wrapper {
          position: relative;
          width: 100%;
          border-radius: var(--radius-xl);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }

        .memory-wall-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3) var(--space-6);
          background: #FAF5ED;
          border-bottom: 1px solid var(--border-light);
          font-size: var(--text-xs);
        }

        .wall-status-pill {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: 600;
          color: var(--text-secondary);
        }

        .sparkle-gold {
          color: var(--color-gold);
        }

        .wall-photo-counter {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--color-rakhi-red);
          background: var(--color-rakhi-light);
          padding: 3px 12px;
          border-radius: var(--radius-full);
        }

        .counter-heart {
          fill: var(--color-rakhi-red);
        }

        .memory-wall-stage {
          position: relative;
          width: 100%;
          overflow: visible;
        }

        .wall-hint-overlay {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 253, 249, 0.92);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid var(--border-light);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          color: var(--text-secondary);
          box-shadow: var(--shadow-sm);
          pointer-events: none;
          z-index: 15;
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .memory-wall-toolbar {
            flex-direction: column;
            gap: var(--space-2);
            align-items: flex-start;
          }
          .wall-hint-overlay {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MemoryWall;
