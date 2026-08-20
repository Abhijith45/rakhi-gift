import React from 'react';

/**
 * Physical Photo Frame Component
 * Enhanced with realistic brass mounting pins, delicate typography, and compact sticky notes.
 */
export const PhotoFrame = ({
  photo,
  index,
  onClick,
  isMobile = false
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

  const resolvedImageUrl = imageUrl || url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';
  const displayCaption = caption || (variant === 'caption' ? title : null);

  return (
    <div
      className={`photo-frame-container variant-${variant}`}
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: `${width}%`,
        '--frame-rot': `${rot}deg`
      }}
    >
      {/* Top Brass Mounting Pushpin */}
      <div className="frame-mounting-pin" title="Pinned to wall">
        <div className="pin-head-dome" />
        <div className="pin-neck" />
      </div>

      {/* Main Physical Paper Frame Button */}
      <button
        type="button"
        className="photo-frame-card"
        onClick={() => onClick && onClick({ ...photo, imageUrl: resolvedImageUrl })}
        aria-label={`View memory: ${title || 'Photo'} - ${date || ''}`}
      >
        {/* Photo Image Area */}
        <div className="photo-image-viewport">
          <img
            src={resolvedImageUrl}
            alt={title || caption || 'Rakhi Memory'}
            className="photo-actual-img"
            loading="lazy"
          />
        </div>

        {/* Variant B: Caption Area */}
        {variant === 'caption' && displayCaption && (
          <div className="photo-caption-strip">
            <span className="caption-text">{displayCaption}</span>
          </div>
        )}
      </button>

      {/* Variant C: Compact Sticky Memory Note */}
      {variant === 'note' && noteText && (
        <div className={`adjacent-sticky-note note-pos-${notePos}`}>
          <div className="sticky-pin-head" />
          <p className="sticky-text">{noteText}</p>
        </div>
      )}

      <style>{`
        .photo-frame-container {
          position: absolute;
          transform: rotate(var(--frame-rot));
          transform-origin: top center;
          transition: transform 0.22s cubic-bezier(0.2, 0, 0, 1), z-index 0.2s;
          z-index: 5;
          user-select: none;
        }

        .photo-frame-container:hover {
          transform: translateY(-4px) rotate(calc(var(--frame-rot) * 0.35)) scale(1.025);
          z-index: 25;
        }

        /* Top Brass Pushpin */
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
          background: radial-gradient(circle at 35% 35%, #FFF8C6 0%, #D4AF37 45%, #8B6508 90%, #5E4304 100%);
          box-shadow: 
            0 2px 5px rgba(0, 0, 0, 0.4),
            0 0 4px rgba(212, 175, 55, 0.5),
            inset 0 1px 1px rgba(255, 255, 255, 0.8);
          border: 1px solid #735105;
        }

        .pin-neck {
          width: 4px;
          height: 3px;
          background: #4A3503;
          border-radius: 0 0 1px 1px;
          margin-top: -1px;
        }

        /* Physical Paper Frame Card */
        .photo-frame-card {
          width: 100%;
          display: block;
          background: #FFFDF9; /* Warm off-white photographic paper mat */
          padding: 6px 6px 8px 6px;
          border-radius: 2px;
          border: 1px solid #E5DBCB;
          box-shadow: 
            0 6px 16px rgba(45, 30, 15, 0.14),
            0 2px 5px rgba(45, 30, 15, 0.07);
          cursor: pointer;
          text-align: center;
          outline: none;
          transition: box-shadow 0.22s ease;
        }

        .variant-caption .photo-frame-card {
          padding-bottom: 7px;
        }

        .photo-frame-card:focus-visible {
          box-shadow: 0 0 0 3px var(--color-gold), 0 8px 20px rgba(45, 30, 15, 0.2);
        }

        .photo-frame-container:hover .photo-frame-card {
          box-shadow: 
            0 14px 28px rgba(40, 25, 10, 0.22),
            0 4px 10px rgba(40, 25, 10, 0.12);
        }

        /* Photo Viewport */
        .photo-image-viewport {
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #E8DEC8;
          border-radius: 1px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .photo-actual-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        /* Variant B: Caption Strip */
        .photo-caption-strip {
          padding-top: 5px;
          padding-bottom: 1px;
          overflow: hidden;
        }

        .caption-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(10px, 0.85vw, 11.5px);
          font-style: italic;
          color: #382F27;
          line-height: 1.25;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Variant C: Compact Sticky Note */
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

        @media (max-width: 900px) {
          .photo-frame-card {
            padding: 5px 5px 6px 5px;
          }
          .adjacent-sticky-note {
            width: 68px;
            padding: 4px 5px;
          }
          .sticky-text {
            font-size: 9px;
          }
          .note-pos-left {
            left: -48px;
          }
          .note-pos-right {
            right: -48px;
          }
        }

        @media (max-width: 640px) {
          .photo-frame-card {
            padding: 4px 4px 5px 4px;
          }
          .pin-head-dome {
            width: 10px;
            height: 10px;
          }
          .caption-text {
            font-size: 9.5px;
          }
          .adjacent-sticky-note {
            display: none; /* Hide overflow sticky notes on small phones */
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .photo-frame-container {
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
