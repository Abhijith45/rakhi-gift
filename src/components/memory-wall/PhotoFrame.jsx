import React from 'react';

/**
 * Physical Photo Frame Component (Package-Aware 2.5D Experience)
 * Renders Classic Print (Frame A), Caption Print (Frame B), and Memory Note (Frame C)
 * with aesthetic enhancements for Basic, Premium, and Deluxe tiers.
 */
export const PhotoFrame = ({
  photo,
  index = 0,
  onClick,
  viewport = 'desktop',
  isMobile = false,
  isTablet = false,
  plan = 'PREMIUM',
  theme = 'warm-memory'
}) => {
  const {
    imageUrl,
    url,
    title,
    caption,
    date,
    top = 10,
    left = 10,
    rot = 0,
    width = 18.5,
    variant = 'classic',
    noteText = null,
    notePos = 'left'
  } = photo;

  const normalizedPlan = (plan || 'PREMIUM').toUpperCase();
  const isDeluxe = normalizedPlan === 'DELUXE';
  const isBasic = normalizedPlan === 'BASIC';

  const resolvedImageUrl = imageUrl || url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';
  const displayCaption = caption || (variant === 'caption' ? title : null);

  // Staggered entrance animation delay based on index
  const animDelay = `${Math.min(0.6, index * 0.08)}s`;

  return (
    <div
      className={`photo-frame-container variant-${variant} plan-${normalizedPlan.toLowerCase()} theme-${theme} viewport-${viewport}`}
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: `${width}%`,
        '--frame-rot': `${rot}deg`,
        '--anim-delay': animDelay
      }}
    >
      {/* Top Mounting Pushpin (Basic Brass / Premium Gold / Deluxe Jeweled-Brass) */}
      <div className={`frame-mounting-pin pin-tier-${normalizedPlan.toLowerCase()}`} title="Pinned with brass tack">
        <div className="pin-head-dome">
          {isDeluxe && <div className="pin-ruby-core" />}
        </div>
        <div className="pin-neck" />
      </div>

      {/* Main Physical Paper Frame Button */}
      <button
        type="button"
        className="photo-frame-card"
        onClick={() => onClick && onClick({ ...photo, imageUrl: resolvedImageUrl })}
        aria-label={`View memory: ${title || caption || 'Rakhi photo'} ${date ? `(${date})` : ''}`}
      >
        {/* Deluxe Decorative Gold Corner Accents (Subtle, refined) */}
        {isDeluxe && (index % 2 === 0) && (
          <div className="deluxe-corner-trim" aria-hidden="true" />
        )}

        {/* Photo Viewport (Preserves 4:3 Aspect Ratio) */}
        <div className="photo-image-viewport">
          <img
            src={resolvedImageUrl}
            alt={title || caption || 'Rakhi Memory'}
            className="photo-actual-img"
            loading="lazy"
          />
        </div>

        {/* Variant B: Caption Area */}
        {variant === 'caption' && displayCaption && !isBasic && (
          <div className="photo-caption-strip">
            <span className="caption-text">{displayCaption}</span>
          </div>
        )}
      </button>

      {/* Variant C: Compact Sticky Memory Note */}
      {variant === 'note' && noteText && !isBasic && (
        <div className={`adjacent-sticky-note note-pos-${notePos} ${isDeluxe ? 'deluxe-sticky-note' : ''}`}>
          <div className="sticky-pin-head" />
          <p className="sticky-text">{noteText}</p>
        </div>
      )}

      <style>{`
        .photo-frame-container {
          position: absolute;
          transform: rotate(var(--frame-rot));
          transform-origin: top center;
          transition: transform 0.24s cubic-bezier(0.2, 0, 0, 1), z-index 0.2s;
          z-index: 6;
          user-select: none;
          animation: frameEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
          animation-delay: var(--anim-delay, 0s);
        }

        @keyframes frameEntrance {
          0% {
            opacity: 0;
            transform: translateY(14px) rotate(calc(var(--frame-rot) * 0.4)) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: rotate(var(--frame-rot)) scale(1);
          }
        }

        .photo-frame-container:hover {
          transform: translateY(-4px) rotate(calc(var(--frame-rot) * 0.35)) scale(1.028);
          z-index: 25;
        }

        /* --- Mounting Pushpins --- */
        .frame-mounting-pin {
          position: absolute;
          top: -7px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 15;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pin-head-dome {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Basic Plan Pin */
        .pin-tier-basic .pin-head-dome {
          background: radial-gradient(circle at 35% 35%, #F0E6C8 0%, #BFA15F 55%, #735A2B 100%);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          border: 1px solid #5A441B;
        }

        /* Premium Plan Pin */
        .pin-tier-premium .pin-head-dome {
          background: radial-gradient(circle at 35% 35%, #FFF8C6 0%, #D4AF37 45%, #8B6508 90%, #5E4304 100%);
          box-shadow: 
            0 2px 5px rgba(0, 0, 0, 0.4),
            0 0 5px rgba(212, 175, 55, 0.5),
            inset 0 1px 1px rgba(255, 255, 255, 0.8);
          border: 1px solid #735105;
        }

        /* Deluxe Plan Pin (Jeweled Brass with Ruby center) */
        .pin-tier-deluxe .pin-head-dome {
          width: 15px;
          height: 15px;
          background: radial-gradient(circle at 35% 35%, #FFFDF0 0%, #E5C158 40%, #9B7815 85%, #5E4304 100%);
          box-shadow: 
            0 3px 7px rgba(0, 0, 0, 0.45),
            0 0 8px rgba(229, 193, 88, 0.6),
            inset 0 1px 1px rgba(255, 255, 255, 0.9);
          border: 1px solid #634708;
        }

        .pin-ruby-core {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #FF7B7B 0%, #9B2226 65%, #4A0B0D 100%);
          box-shadow: inset 0 0.5px 1px rgba(255, 255, 255, 0.7);
        }

        .pin-neck {
          width: 4px;
          height: 3px;
          background: #4A3503;
          border-radius: 0 0 1px 1px;
          margin-top: -1px;
        }

        /* --- Physical Paper Frame Card --- */
        .photo-frame-card {
          width: 100%;
          display: block;
          background: var(--gift-frame-bg, #FFFDF9);
          padding: 5px 5px 6px 5px;
          border-radius: 2px;
          border: 1px solid var(--gift-frame-border, #E5DBCB);
          box-shadow: 
            0 6px 16px var(--gift-shadow-tone, rgba(45, 30, 15, 0.13)),
            0 2px 5px var(--gift-shadow-tone, rgba(45, 30, 15, 0.06));
          cursor: pointer;
          text-align: center;
          outline: none;
          transition: box-shadow 0.24s ease, border-color 0.24s ease;
          position: relative;
        }

        /* Basic Tier Frame */
        .plan-basic .photo-frame-card {
          box-shadow: 0 4px 12px var(--gift-shadow-tone, rgba(45, 30, 15, 0.1));
          border-color: var(--gift-border-subtle, #E2D7C7);
        }

        /* Deluxe Tier Frame (Layered Fine Art Paper + Gilded Edge Trim) */
        .plan-deluxe .photo-frame-card {
          padding: 7px 7px 9px 7px;
          background: linear-gradient(180deg, var(--gift-surface, #FFFDFB) 0%, var(--gift-canvas, #FAF5EE) 100%);
          border: 1px solid var(--gift-border-gold, #DFCDB4);
          box-shadow: 
            0 8px 22px var(--gift-shadow-tone, rgba(45, 30, 15, 0.16)),
            0 3px 7px var(--gift-shadow-tone, rgba(45, 30, 15, 0.08)),
            inset 0 0 0 1px rgba(255, 255, 255, 0.85);
        }

        .plan-deluxe .photo-frame-container:hover .photo-frame-card {
          border-color: var(--gift-border-gold, #D4AF37);
          box-shadow: 
            0 16px 34px rgba(40, 25, 10, 0.24),
            0 4px 12px var(--gift-gold-muted, rgba(212, 175, 55, 0.2)),
            inset 0 0 0 1px rgba(255, 255, 255, 0.9);
        }

        .photo-frame-card:focus-visible {
          box-shadow: 0 0 0 3px var(--gift-gold, #C69234), 0 8px 20px rgba(45, 30, 15, 0.2);
        }

        .photo-frame-container:hover .photo-frame-card {
          box-shadow: 
            0 14px 28px rgba(40, 25, 10, 0.22),
            0 4px 10px rgba(40, 25, 10, 0.12);
        }

        /* Deluxe Corner Trims */
        .deluxe-corner-trim {
          position: absolute;
          inset: 3px;
          border: 1px solid var(--gift-gold-muted, rgba(198, 146, 52, 0.25));
          pointer-events: none;
          border-radius: 1px;
        }

        /* --- Photo Viewport --- */
        .photo-image-viewport {
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #E8DEC8;
          border-radius: 1px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }

        .photo-actual-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        /* --- Variant B: Caption Strip --- */
        .photo-caption-strip {
          padding-top: 5px;
          padding-bottom: 1px;
          overflow: hidden;
        }

        .caption-text {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(10px, 0.85vw, 11.5px);
          font-style: italic;
          color: var(--gift-text, #382F27);
          line-height: 1.25;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .plan-deluxe .caption-text {
          color: #2B1D14;
          font-weight: 500;
        }

        /* --- Variant C: Compact Sticky Note --- */
        .adjacent-sticky-note {
          position: absolute;
          width: 76px;
          padding: 5px 6px 6px 6px;
          background: linear-gradient(135deg, #FFF8CD 0%, #FDF1AA 100%);
          border-radius: 2px;
          box-shadow: 0 3px 10px rgba(50, 35, 15, 0.18);
          border: 1px solid #EBE088;
          pointer-events: none;
          z-index: 12;
        }

        .deluxe-sticky-note {
          background: linear-gradient(135deg, #FFFBF0 0%, #FBF0D8 100%);
          border: 1px solid #DEC395;
          box-shadow: 0 4px 12px rgba(50, 35, 15, 0.2);
        }

        .note-pos-left {
          left: -58px;
          top: 30%;
          transform: rotate(-6deg);
        }

        .note-pos-right {
          right: -58px;
          top: 25%;
          transform: rotate(5deg);
        }

        .note-pos-bottom {
          left: 50%;
          bottom: -36px;
          transform: translateX(-50%) rotate(-3deg);
        }

        .sticky-pin-head {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #F05555 0%, #9B2226 70%, #5E0D0F 100%);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          margin: 0 auto 3px auto;
        }

        .deluxe-sticky-note .sticky-pin-head {
          background: radial-gradient(circle at 35% 35%, #FFF0AA 0%, #D4AF37 60%, #8B6508 100%);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 3px rgba(212, 175, 55, 0.4);
        }

        .sticky-text {
          font-family: 'Playfair Display', 'Caveat', Georgia, cursive, serif;
          font-style: italic;
          font-size: 10px;
          line-height: 1.2;
          color: #3D3225;
          margin: 0;
          text-align: center;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        @media (max-width: 1024px) {
          .adjacent-sticky-note {
            display: none; /* Keep tablet and mobile layout cleanly contained inside corkboard borders */
          }
        }

        @media (max-width: 425px) {
          .photo-frame-card {
            padding: 3px 3px 4px 3px;
          }
          .pin-head-dome {
            width: 9px;
            height: 9px;
          }
          .caption-text {
            font-size: 7.5px;
          }
        }
        @media (max-width: 680px) {
          .photo-frame-card {
            padding: 4px 4px 5px 4px;
          }
          .pin-head-dome {
            width: 10px;
            height: 10px;
          }
          .caption-text {
            font-size: 8.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .photo-frame-container {
            animation: none !important;
            transition: none !important;
          }
          .photo-frame-container:hover {
            transform: rotate(var(--frame-rot)) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoFrame;
