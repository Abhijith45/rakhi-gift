import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Heart, Award } from 'lucide-react';
import WallBackground from './WallBackground';
import ThreadLayer from './ThreadLayer';
import PhotoFrame from './PhotoFrame';
import MemoryWallOverlay from './MemoryWallOverlay';
import { getWallLayout, getThreadConnections } from './layoutUtils';
import { getWallConfig } from './wallConfig';

/**
 * Package-Aware 2.5D Physical Memory Wall Component
 * Supports BASIC (₹99), PREMIUM (₹249), and DELUXE (₹449) tiers
 * across Mobile (320-430px), Tablet (768-1024px), and Desktop (1280px+).
 */
export const MemoryWall = ({
  gift,
  plan,
  theme = null,
  mode = 'full'
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewport, setViewport] = useState('desktop');

  const resolvedTheme = theme || gift?.theme || 'warm-memory';

  // Normalize package tier: explicit prop > gift object > default 'PREMIUM'
  const currentPlan = useMemo(() => {
    const p = plan || gift?.plan || 'PREMIUM';
    return (p || 'PREMIUM').toUpperCase();
  }, [plan, gift?.plan]);

  const config = useMemo(() => {
    return getWallConfig(currentPlan);
  }, [currentPlan]);

  // Window resize listener detecting viewport breakpoint
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w <= 640) {
        setViewport('mobile');
      } else if (w <= 1024) {
        setViewport('tablet');
      } else {
        setViewport('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  // Filter raw photos according to package entitlements
  const rawPhotos = useMemo(() => {
    const all = gift?.photos && gift.photos.length > 0 ? gift.photos : [];
    return all.slice(0, config.maxPhotos);
  }, [gift?.photos, config.maxPhotos]);

  // Compute positioned photos & thread pairings
  const positionedPhotos = useMemo(() => {
    return getWallLayout(rawPhotos, viewport, currentPlan);
  }, [rawPhotos, viewport, currentPlan]);

  const threadPairs = useMemo(() => {
    return getThreadConnections(positionedPhotos.length, currentPlan, viewport);
  }, [positionedPhotos.length, currentPlan, viewport]);

  const isDeluxe = currentPlan === 'DELUXE';
  const isBasic = currentPlan === 'BASIC';

  return (
    <div className={`memory-wall-wrapper mode-${mode} plan-${currentPlan.toLowerCase()} viewport-${viewport}`}>
      {/* Main Physical Wall Stage */}
      <div className="memory-wall-stage">
        <WallBackground plan={currentPlan} theme={resolvedTheme}>
          {/* Sacred Silk Thread Layer (Behind Frames) */}
          <ThreadLayer
            photos={positionedPhotos}
            connections={threadPairs}
            viewport={viewport}
            isMobile={isMobile}
            plan={currentPlan}
            theme={resolvedTheme}
          />

          {/* Mounted Physical Photo Frames */}
          {positionedPhotos.map((photo, index) => (
            <PhotoFrame
              key={photo.id || `photo-${index}`}
              photo={photo}
              index={index}
              onClick={setSelectedPhoto}
              viewport={viewport}
              isMobile={isMobile}
              isTablet={isTablet}
              plan={currentPlan}
              theme={resolvedTheme}
            />
          ))}
        </WallBackground>

        {/* Ambient Subtle Keepsake Sentiment Banner */}
        <div className="wall-hint-overlay">
          <Heart size={13} className="counter-heart" />
          <span>Some bonds are meant to be celebrated forever.</span>
        </div>
      </div>

      {/* Click-to-inspect Modal Overlay */}
      <MemoryWallOverlay
        photo={selectedPhoto}
        allPhotos={positionedPhotos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={setSelectedPhoto}
      />

      <style>{`
        .memory-wall-wrapper {
          position: relative;
          width: 100%;
          border-radius: var(--radius-xl, 16px);
          background: var(--bg-surface, #FAF7F2);
          border: 1px solid var(--border-default, #E8DFD3);
          box-shadow: var(--shadow-xl, 0 20px 40px rgba(45, 30, 15, 0.08));
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .memory-wall-wrapper.plan-deluxe {
          border-color: #D5BE9E;
          box-shadow: 
            0 24px 54px -10px rgba(55, 35, 15, 0.18),
            0 10px 24px -5px rgba(55, 35, 15, 0.08);
        }

        .memory-wall-stage {
          position: relative;
          width: 100%;
          overflow: visible;
          display: flex;
          flex-direction: column;
          align-items: center;
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
          border: 1px solid var(--border-light, #EFE6D8);
          padding: 6px 16px;
          border-radius: var(--radius-full, 9999px);
          font-size: var(--text-xs, 0.75rem);
          color: var(--text-secondary, #59524C);
          box-shadow: var(--shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.05));
          pointer-events: none;
          z-index: 15;
          white-space: nowrap;
        }

        .counter-heart {
          color: var(--color-rakhi-red, #9B2226);
          fill: var(--color-rakhi-red, #9B2226);
        }

        .plan-deluxe .counter-heart {
          color: #8E1616;
          fill: #8E1616;
        }

        @media (max-width: 640px) {
          .wall-hint-overlay {
            font-size: 10.5px;
            padding: 4px 12px;
            bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default MemoryWall;
