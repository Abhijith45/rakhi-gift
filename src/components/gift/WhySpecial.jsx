import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Sparkles, Award, Play, Pause, Quote } from 'lucide-react';
import { getGiftSectionConfig } from './giftSectionConfig';

export const WhySpecial = ({
  gift,
  plan
}) => {
  const normalizedPlan = (plan || gift?.plan || 'PREMIUM').toUpperCase();
  const config = getGiftSectionConfig(normalizedPlan);

  // STRICT PACKAGE RULE: Basic plan NEVER shows Why You're Special
  if (!config.whySpecial?.enabled || normalizedPlan === 'BASIC') {
    return null;
  }

  const reasons = gift?.reasons;
  if (!reasons || !Array.isArray(reasons) || reasons.length === 0) {
    return null;
  }

  const isDeluxe = normalizedPlan === 'DELUXE';
  const totalSlides = reasons.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance slider
  const nextSlide = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    if (index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Timer interval for auto-play (4.5 seconds per slide)
  useEffect(() => {
    if (!isPlaying || isHovered || totalSlides <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, nextSlide, totalSlides]);

  // Reset animation flag
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const currentReason = reasons[currentIndex] || reasons[0];
  const numFormatted = currentReason.number || String(currentIndex + 1).padStart(2, '0');
  const title = currentReason.title || currentReason.name || `Special Memory #${currentIndex + 1}`;
  const desc = currentReason.text || currentReason.description || currentReason.desc || '';

  return (
    <section
      id="why-special"
      className={`section gift-reasons-section plan-${normalizedPlan.toLowerCase()}`}
      aria-label="Reasons You're My Person Carousel"
    >
      <div className="container reasons-container">
        {/* Section Header */}
        <div className="section-header reasons-header">
          <div className="section-tag reasons-tag">
            {isDeluxe ? <Award size={13} /> : <Heart size={13} />}
            <span>{config.whySpecial.eyebrow}</span>
          </div>
          <h2 className="section-title reasons-title">
            {config.whySpecial.title}
          </h2>
          {config.whySpecial.subtitle && (
            <p className="section-subtitle reasons-subtitle">
              {config.whySpecial.subtitle}
            </p>
          )}
        </div>

        {/* Testimonial Carousel Area */}
        <div
          className="reasons-carousel-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Slide Card */}
          <div
            className={`reason-slide-card paper-card ${isDeluxe ? 'deluxe-slide-card' : ''} ${isAnimating ? 'slide-animating' : ''}`}
            aria-live="polite"
          >
            {/* Deluxe Golden Corner Accent */}
            {isDeluxe && <div className="deluxe-slide-corner" aria-hidden="true" />}

            {/* Decorative Quote Watermark Background */}
            <div className="card-quote-watermark" aria-hidden="true">
              <Quote size={88} />
            </div>

            {/* Top Meta Bar */}
            <div className="slide-card-header">
              <div className={`slide-num-badge ${isDeluxe ? 'badge-deluxe-num' : ''}`}>
                <Sparkles size={13} className="num-sparkle" />
                <span>REASON {numFormatted} OF {String(totalSlides).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Slide Content Body */}
            <div className="slide-card-body">
              <h3 className="slide-card-title">
                "{title}"
              </h3>
              {desc && (
                <p className="slide-card-desc">
                  {desc}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Carousel Controls: Clickable Dots & Play/Pause Button */}
          <div className="reasons-controls-bar">
            {/* Clickable Dots Navigation */}
            <div
              className="carousel-dots-group"
              role="tablist"
              aria-label="Reason slides navigation"
            >
              {reasons.map((_, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={`dot-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`View reason ${index + 1}`}
                    className={`carousel-dot-btn ${isActive ? 'dot-active' : ''}`}
                    onClick={() => goToSlide(index)}
                  >
                    <span className="dot-inner" />
                  </button>
                );
              })}
            </div>
          </div>
          <div className='reasons-controls-bar'>
            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              className={`carousel-playback-btn ${!isPlaying ? 'playback-paused' : ''}`}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause auto-sliding' : 'Play auto-sliding'}
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? (
                <Pause size={14} className="playback-icon" />
              ) : (
                <Play size={14} className="playback-icon" />
              )}
              <span className="playback-text">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .gift-reasons-section {
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: var(--space-8, 2rem);
          padding-bottom: var(--space-8, 2rem);
          position: relative;
          background: transparent;
        }

        .reasons-container {
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          padding: 0 clamp(0.75rem, 3.5vw, 1.5rem);
        }

        .reasons-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto var(--space-6, 1.5rem) auto;
        }

        .reasons-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--gift-tag-color, #9B2226);
          background: var(--gift-tag-bg, #FBF0EF);
          padding: 4px 14px;
          border-radius: var(--radius-full, 9999px);
          font-size: var(--text-xs, 0.75rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: var(--space-3, 0.75rem);
          border: 1px solid var(--gift-tag-border, rgba(155, 34, 38, 0.15));
        }

        .plan-deluxe .reasons-tag {
          color: var(--gift-gold-dark, #7D5728);
          background: linear-gradient(135deg, var(--gift-gold-light, #FFF6E5) 0%, var(--gift-canvas, #FAEDD2) 100%);
          border-color: var(--gift-border-gold, #DFC9A8);
        }

        .reasons-title {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.85rem, 4vw, 2.75rem);
          font-weight: 700;
          color: var(--gift-text, #1E1B18);
          margin-bottom: var(--space-2, 0.5rem);
          letter-spacing: -0.015em;
          line-height: 1.2;
        }

        .plan-deluxe .reasons-title {
          color: var(--gift-text, #2D1D13);
        }

        .reasons-subtitle {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: clamp(0.875rem, 1.6vw, 1rem);
          color: var(--gift-text-secondary, #59524C);
          line-height: 1.6;
          margin: 0 auto;
          max-width: 580px;
        }

        /* --- Carousel Card Area --- */
        .reasons-carousel-wrapper {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
        }

        .reason-slide-card {
          position: relative;
          background: var(--gift-surface, #FFFDF9);
          border: 1px solid var(--gift-border, #E5D9C8);
          border-radius: var(--radius-xl, 24px);
          padding: clamp(1.5rem, 4vw, 3rem) clamp(1.15rem, 3.5vw, 2.5rem);
          box-shadow: 
            0 16px 40px -8px var(--gift-shadow-tone, rgba(60, 45, 25, 0.08)),
            0 4px 14px -2px var(--gift-shadow-tone, rgba(60, 45, 25, 0.04));
          overflow: hidden;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: opacity 0.3s cubic-bezier(0.2, 0, 0, 1), transform 0.3s cubic-bezier(0.2, 0, 0, 1);
        }
          transition: opacity 0.3s cubic-bezier(0.2, 0, 0, 1), transform 0.3s cubic-bezier(0.2, 0, 0, 1);
        }

        .slide-animating {
          opacity: 0.85;
          transform: translateY(2px) scale(0.995);
        }

        /* Deluxe Card Treatment */
        .deluxe-slide-card {
          background: linear-gradient(180deg, var(--gift-surface, #FFFDFB) 0%, var(--gift-canvas, #FAF5ED) 100%);
          border: 1px solid var(--gift-border-gold, #DECDB4);
          box-shadow: 
            0 20px 48px -10px var(--gift-shadow-tone, rgba(60, 40, 20, 0.12)),
            0 6px 18px -2px var(--gift-gold-muted, rgba(198, 146, 52, 0.08));
        }

        .deluxe-slide-corner {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 16px;
          height: 16px;
          border-top: 2px solid var(--gift-gold-muted, rgba(198, 146, 52, 0.5));
          border-right: 2px solid var(--gift-gold-muted, rgba(198, 146, 52, 0.5));
          border-top-right-radius: 4px;
          pointer-events: none;
        }

        /* Decorative Quote Watermark */
        .card-quote-watermark {
          position: absolute;
          top: 1.5rem;
          right: 2rem;
          color: var(--gift-accent-muted, rgba(155, 34, 38, 0.04));
          pointer-events: none;
          user-select: none;
        }

        .plan-deluxe .card-quote-watermark {
          color: var(--gift-gold-muted, rgba(198, 146, 52, 0.06));
        }

        /* Card Header Pill */
        .slide-card-header {
          margin-bottom: 1.25rem;
          position: relative;
          z-index: 1;
        }

        .slide-num-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--gift-tag-bg, #FBF0EF);
          color: var(--gift-tag-color, #9B2226);
          padding: 4px 12px;
          border-radius: var(--radius-full, 9999px);
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid var(--gift-tag-border, rgba(155, 34, 38, 0.15));
        }

        .num-sparkle {
          color: var(--gift-gold, #C69234);
        }

        .badge-deluxe-num {
          background: linear-gradient(135deg, var(--gift-gold-light, #FAF2E2) 0%, var(--gift-canvas, #F5E5C4) 100%);
          color: var(--gift-gold-dark, #7A531C);
          border: 1px solid var(--gift-border-gold, #DFC49A);
          box-shadow: 0 1px 4px rgba(185, 145, 75, 0.12);
        }

        /* Card Content */
        .slide-card-body {
          position: relative;
          z-index: 1;
        }

        .slide-card-title {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.4rem, 2.6vw, 1.85rem);
          font-weight: 700;
          color: var(--gift-text, #1E1B18);
          line-height: 1.3;
          margin-bottom: 0.85rem;
        }

        .deluxe-slide-card .slide-card-title {
          color: var(--gift-text, #2D1D13);
        }

        .slide-card-desc {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: clamp(0.975rem, 1.8vw, 1.125rem);
          line-height: 1.75;
          color: var(--gift-text-secondary, #4A423B);
          margin: 0;
        }

        /* --- Bottom Controls Bar --- */
        .reasons-controls-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          margin-top: 1.75rem;
        }

        /* Dots Group */
        .carousel-dots-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .carousel-dot-btn {
          background: none;
          border: none;
          padding: 6px 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
          transition: transform 0.2s ease;
        }

        .carousel-dot-btn:focus-visible {
          outline: 2px solid var(--color-gold, #C69234);
          border-radius: 4px;
        }

        .dot-inner {
          display: block;
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full, 9999px);
          background-color: var(--border-default, #D6C8B5);
          transition: all 0.28s cubic-bezier(0.2, 0, 0, 1);
        }

        .carousel-dot-btn:hover .dot-inner {
          background-color: var(--color-gold, #C69234);
          transform: scale(1.15);
        }

        .carousel-dot-btn.dot-active .dot-inner {
          width: 28px;
          height: 8px;
          background: linear-gradient(135deg, var(--color-rakhi-red, #9B2226), var(--color-coral, #D96B43));
          box-shadow: 0 2px 6px rgba(155, 34, 38, 0.25);
        }

        .plan-deluxe .carousel-dot-btn.dot-active .dot-inner {
          background: linear-gradient(135deg, #A47833, #C69234);
          box-shadow: 0 2px 6px rgba(164, 120, 51, 0.3);
        }

        /* Play / Pause Button */
        .carousel-playback-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          background: var(--bg-surface, #FFFDF9);
          border: 1px solid var(--border-default, #E5D9C8);
          border-radius: var(--radius-full, 9999px);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary, #59524C);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(45, 30, 15, 0.04);
          transition: all 0.2s ease;
          outline: none;
        }

        .carousel-playback-btn:hover {
          color: var(--color-rakhi-red, #9B2226);
          border-color: var(--color-gold-border, #E8D5B0);
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(45, 30, 15, 0.08);
        }

        .carousel-playback-btn:focus-visible {
          outline: 2px solid var(--color-gold, #C69234);
        }

        .playback-icon {
          color: var(--color-rakhi-red, #9B2226);
        }

        .plan-deluxe .playback-icon {
          color: #8C6214;
        }

        .playback-paused {
          background: #FDF7EC;
          border-color: #DECDB4;
        }

        @media (max-width: 640px) {
          .reason-slide-card {
            padding: 1.75rem 1.25rem;
            min-height: 220px;
            border-radius: var(--radius-lg, 16px);
          }
          .reasons-controls-bar {
            gap: 1rem;
            margin-top: 1.25rem;
          }
          .card-quote-watermark {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .reason-slide-card {
            transition: none !important;
          }
          .dot-inner {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default WhySpecial;
