import React from 'react';

/**
 * Cloudinary CDN Background Wall Assets for all Packages & Viewports:
 * - Deluxe: Desktop (1297x785), Tablet (703x783), Mobile (436x785)
 * - Basic & Premium: Desktop (1295x893), Tablet (695x894), Mobile (452x891)
 */
export const WALL_BACKGROUND_ASSETS = {
  DELUXE: {
    desktop: 'https://res.cloudinary.com/pyn9yyn1/image/upload/v1787479696/delux_desktop.png',
    tablet: 'https://res.cloudinary.com/pyn9yyn1/image/upload/v1787479695/delux_tablet.png',
    mobile: 'https://res.cloudinary.com/pyn9yyn1/image/upload/v1787479695/delux_mobile.png'
  },
  BASIC: {
    desktop: 'https://res.cloudinary.com/pyn9yyn1/image/upload/v1787479696/basic_desktop.png',
    tablet: 'https://res.cloudinary.com/pyn9yyn1/image/upload/v1787479695/basic_tablet.png',
    mobile: 'https://res.cloudinary.com/pyn9yyn1/image/upload/v1787479696/basic_mobile.png'
  },
  PREMIUM: {
    desktop: 'https://res.cloudinary.com/pyn9yyn1/image/upload/v1787479696/basic_desktop.png',
    tablet: 'https://res.cloudinary.com/pyn9yyn1/image/upload/v1787479695/basic_tablet.png',
    mobile: 'https://res.cloudinary.com/pyn9yyn1/image/upload/v1787479696/basic_mobile.png'
  }
};

/**
 * Wallpaper Wall Stage Component
 * Renders authentic high-resolution Cloudinary CDN corkboard wallpaper assets
 * using responsive HTML5 <picture> loading.
 */
export const WallBackground = ({
  children,
  plan = 'PREMIUM',
  theme = 'warm-memory'
}) => {
  const normalizedPlan = (plan || 'PREMIUM').toUpperCase();
  const isDeluxe = normalizedPlan === 'DELUXE';
  const isBasic = normalizedPlan === 'BASIC';

  const bgAssets = WALL_BACKGROUND_ASSETS[normalizedPlan] || WALL_BACKGROUND_ASSETS.PREMIUM;

  return (
    <div className={`wall-background-root plan-${normalizedPlan.toLowerCase()} theme-${theme}`}>
      {/* Script Calligraphy Header */}
      <div className="wall-calligraphy-header">
        <h2 className="wall-script-title">
          {isBasic && (
            <>
              Our <span className="script-accent">Memory Wall</span>
              <span className="script-heart"> ♡</span>
            </>
          )}

          {normalizedPlan === 'PREMIUM' && (
            <>
              Memories that <span className="script-accent">last forever</span>
              <span className="script-heart"> ♡</span>
            </>
          )}

          {isDeluxe && (
            <>
              Our <span className="script-accent">Keepsake Wall</span>
              <span className="script-heart"> ♡</span>
            </>
          )}
        </h2>

        <p className="wall-script-subtitle">
          {isDeluxe
            ? 'Handcrafted memories woven with sacred threads of love'
            : 'Click any photo to relive the moment & read the story behind it.'}
        </p>
      </div>

      {/* Main Corkboard Stage (Rendered with responsive Cloudinary CDN Picture) */}
      <div className="wall-corkboard-stage">
        <picture className="wall-bg-picture">
          <source media="(min-width: 1025px)" srcSet={bgAssets.desktop} />
          <source media="(min-width: 641px)" srcSet={bgAssets.tablet} />
          <img
            src={bgAssets.mobile}
            alt="Rakhi Memory Wall Corkboard"
            className="wall-bg-image"
            loading="eager"
            decoding="async"
            aria-hidden="true"
          />
        </picture>

        {/* Usable collage area holding Canvas Thread layer & Photo Frames */}
        <div className="wall-collage-content-area">
          {children}
        </div>
      </div>

      <style>{`
        .wall-background-root {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem 0 1rem 0;
        }

        /* --- Script Calligraphy Header --- */
        .wall-calligraphy-header {
          text-align: center;
          margin-bottom: var(--space-4, 1rem);
          padding: 0 1rem;
        }

        .wall-script-title {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.6rem, 3.2vw, 2.5rem);
          font-weight: 700;
          color: var(--gift-text, #1E1B18);
          margin: 0 0 4px 0;
          letter-spacing: -0.015em;
        }

        .script-accent {
          color: var(--gift-accent, #9B2226);
          font-style: italic;
        }

        .plan-deluxe .script-accent {
          color: var(--gift-accent, #8E1616);
        }

        .script-heart {
          color: var(--gift-accent, #9B2226);
          font-size: 0.85em;
        }

        .wall-script-subtitle {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: var(--text-sx, 0.775rem);
          color: var(--gift-text-secondary, #59524C);
          margin: 0;
        }

        /* --- Physical Corkboard Stage (Wallpaper Asset) --- */
        .wall-corkboard-stage {
          position: relative;
          width: 100%;
          margin: 0 auto;
          border-radius: var(--radius-3xl, 35px);
          box-shadow: 
            0 16px 40px -8px rgba(60, 40, 20, 0.16),
            0 6px 16px -4px rgba(60, 40, 20, 0.08);
          overflow: visible;
          background: none;
        }

        .plan-deluxe .wall-corkboard-stage {
          box-shadow: 
            0 22px 50px -10px rgba(60, 35, 15, 0.22),
            0 8px 20px -4px rgba(60, 35, 15, 0.1);
        }

        /* Desktop Viewport (1025px+) */
        @media (min-width: 1025px) {
          .plan-deluxe .wall-corkboard-stage {
            aspect-ratio: 1297 / 785;
            max-width: 1100px;
          }
          .plan-basic .wall-corkboard-stage,
          .plan-premium .wall-corkboard-stage {
            aspect-ratio: 1295 / 893;
            max-width: 1100px;
          }
        }

        /* Tablet Viewport (641px - 1024px) */
        @media (min-width: 641px) and (max-width: 1024px) {
          .plan-deluxe .wall-corkboard-stage {
            aspect-ratio: 703 / 783;
            max-width: 680px;
          }
          .plan-basic .wall-corkboard-stage,
          .plan-premium .wall-corkboard-stage {
            aspect-ratio: 695 / 894;
            max-width: 660px;
          }
        }

        /* Mobile Viewport (<= 640px) */
        @media (max-width: 640px) {
          .plan-deluxe .wall-corkboard-stage {
            aspect-ratio: 436 / 785;
            max-width: 440px;
          }
          .plan-basic .wall-corkboard-stage,
          .plan-premium .wall-corkboard-stage {
            aspect-ratio: 452 / 891;
            max-width: 440px;
          }
        }

        /* Picture & Image Elements */
        .wall-bg-picture {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          border-radius: 30px;
        }

        .wall-bg-image {
          width: 100%;
          height: 100%;
          object-fit: fill;
          display: block;
          border-radius: var(--radius-2xl, 34px);
          user-select: none;
          -webkit-user-drag: none;
          overflow: hidden;
        }

        /* Content area spanning inside the wallpaper's wooden frame */
        .wall-collage-content-area {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default WallBackground;
