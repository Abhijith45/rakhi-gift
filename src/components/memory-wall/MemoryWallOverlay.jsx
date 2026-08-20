import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Heart, Sparkles } from 'lucide-react';

export const MemoryWallOverlay = ({
  photo,
  allPhotos = [],
  onClose,
  onSelectPhoto
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, allPhotos]);

  if (!photo) return null;

  const currentIndex = allPhotos.findIndex((p) => p.id === photo.id);
  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectPhoto(allPhotos[currentIndex - 1]);
    } else {
      onSelectPhoto(allPhotos[allPhotos.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < allPhotos.length - 1) {
      onSelectPhoto(allPhotos[currentIndex + 1]);
    } else {
      onSelectPhoto(allPhotos[0]);
    }
  };

  return (
    <div
      className="memory-overlay-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-photo-title"
    >
      <div className="memory-overlay-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="overlay-close-btn"
          onClick={onClose}
          aria-label="Close photo memory dialog"
        >
          <X size={20} />
        </button>

        {/* Previous Navigation Arrow */}
        <button
          className="overlay-nav-btn overlay-nav-prev"
          onClick={handlePrev}
          aria-label="Previous photo memory"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Modal Card Body */}
        <div className="overlay-card paper-card">
          {/* Decorative Brass Pin Header */}
          <div className="overlay-pin-container">
            <div className="overlay-pin-dome" />
          </div>

          <div className="overlay-photo-wrapper">
            <img
              src={photo.imageUrl || photo.url}
              alt={photo.title || 'Memory Photo'}
              className="overlay-photo-img"
            />
          </div>

          <div className="overlay-info">
            <div className="overlay-meta">
              <span className="overlay-date-badge">
                <Calendar size={13} />
                {photo.date}
              </span>
              <span className="overlay-counter">
                {currentIndex + 1} of {allPhotos.length}
              </span>
            </div>

            <h3 id="modal-photo-title" className="overlay-title">
              {photo.title}
            </h3>

            <blockquote className="overlay-caption">
              "{photo.caption}"
            </blockquote>

            <div className="overlay-footer">
              <div className="overlay-sibling-badge">
                <Heart size={14} className="overlay-heart" />
                <span>Memory shared with Aarav</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Navigation Arrow */}
        <button
          className="overlay-nav-btn overlay-nav-next"
          onClick={handleNext}
          aria-label="Next photo memory"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <style>{`
        .memory-overlay-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(28, 25, 23, 0.78);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: var(--z-modal-backdrop);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          animation: fadeIn 0.2s ease-out;
        }

        .memory-overlay-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 620px;
          width: 100%;
          animation: fadeInUp 0.3s var(--ease-soft);
        }

        .overlay-close-btn {
          position: absolute;
          top: -46px;
          right: 0;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #FFFFFF;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .overlay-close-btn:hover {
          background: rgba(255, 255, 255, 0.35);
        }

        .overlay-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: #FFFFFF;
          color: var(--text-primary);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-default);
          z-index: 10;
          transition: transform 0.2s, background 0.2s;
        }

        .overlay-nav-btn:hover {
          transform: translateY(-50%) scale(1.08);
          background: var(--bg-surface);
        }

        .overlay-nav-prev {
          left: -58px;
        }

        .overlay-nav-next {
          right: -58px;
        }

        .overlay-card {
          width: 100%;
          background: #FFFDF9;
          padding: var(--space-6) var(--space-6) var(--space-8) var(--space-6);
          border-radius: var(--radius-lg);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
          position: relative;
        }

        .overlay-pin-container {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
        }

        .overlay-pin-dome {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #FFF0A8, #D4AF37 50%, #8B6508 100%);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
          border: 2px solid #735105;
        }

        .overlay-photo-wrapper {
          width: 100%;
          max-height: 380px;
          overflow: hidden;
          border-radius: var(--radius-sm);
          border: 1px solid #EADBCE;
          background: #E8DDD0;
          margin-bottom: var(--space-5);
        }

        .overlay-photo-img {
          width: 100%;
          height: 100%;
          max-height: 380px;
          object-fit: cover;
        }

        .overlay-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-3);
        }

        .overlay-date-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-xs);
          color: var(--color-rakhi-red);
          background: var(--color-rakhi-light);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .overlay-counter {
          font-size: var(--text-xs);
          color: var(--text-muted);
          font-weight: 500;
        }

        .overlay-title {
          font-family: var(--font-serif);
          font-size: 1.45rem;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .overlay-caption {
          font-size: 1.05rem;
          font-style: italic;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: var(--space-5);
          padding-left: var(--space-3);
          border-left: 2px solid var(--color-gold);
        }

        .overlay-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: var(--space-4);
          border-top: 1px solid var(--border-light);
        }

        .overlay-sibling-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .overlay-heart {
          color: var(--color-rakhi-red);
          fill: var(--color-rakhi-red);
        }

        @media (max-width: 768px) {
          .overlay-nav-prev {
            left: 8px;
          }
          .overlay-nav-next {
            right: 8px;
          }
          .overlay-nav-btn {
            background: rgba(255, 255, 255, 0.9);
          }
        }
      `}</style>
    </div>
  );
};

export default MemoryWallOverlay;
