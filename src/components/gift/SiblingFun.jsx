import React, { useState, useEffect } from 'react';
import { Smile, Sparkles, Award, Flame, Zap, Shield, Coffee } from 'lucide-react';
import { getGiftSectionConfig } from './giftSectionConfig';

export const SiblingFun = ({
  gift,
  plan
}) => {
  const normalizedPlan = (plan || gift?.plan || 'PREMIUM').toUpperCase();
  const config = getGiftSectionConfig(normalizedPlan);

  // STRICT PACKAGE RULE: Hidden on Basic plan
  if (!config.siblingFun?.enabled || normalizedPlan === 'BASIC') {
    return null;
  }

  const recipientDisplayName = gift?.recipientNickname || gift?.recipientName || 'You';
  const senderDisplayName = gift?.senderNickname || gift?.senderName || 'Me';

  // Curated sibling banter items
  const defaultFunItems = [
    {
      id: 'fun-1',
      icon: 'flame',
      tag: 'The TV Remote Contract',
      title: 'Whoever holds it first, owns it forever',
      verdict: `Declared valid by ${recipientDisplayName} in 2014. Non-negotiable.`
    },
    {
      id: 'fun-2',
      icon: 'zap',
      tag: 'Crisis Management',
      title: 'Roasting each other at home, defending each other to the world',
      verdict: `100% sibling loyalty guaranteed under any external threat.`
    },
    {
      id: 'fun-3',
      icon: 'coffee',
      tag: 'Late Night Cravings',
      title: 'Splitting the last slice of pizza / midnight Maggi',
      verdict: `Officially measured down to the exact millimetre.`
    },
    {
      id: 'fun-4',
      icon: 'shield',
      tag: 'Secret Keepers',
      title: 'Vault of confidential childhood secrets',
      verdict: `Will take all classified family gossip to the grave.`
    }
  ];

  const rawFunItems = gift?.funItems || gift?.siblingFun;
  const funItems = (Array.isArray(rawFunItems) && rawFunItems.length > 0)
    ? rawFunItems.map((item, idx) => ({
        id: item.id || `fun-${idx}`,
        icon: idx % 4 === 0 ? 'flame' : idx % 4 === 1 ? 'zap' : idx % 4 === 2 ? 'coffee' : 'shield',
        tag: `Truth #${idx + 1}`,
        title: item.question || item.title || `Inside Joke #${idx + 1}`,
        verdict: item.answer || item.verdict || ''
      }))
    : defaultFunItems;

  const totalSlides = funItems.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Autoplay changing slide every 4500ms (bottom to top progression)
  useEffect(() => {
    if (isHovered || totalSlides <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => clearInterval(timer);
  }, [isHovered, totalSlides]);

  const isDeluxe = normalizedPlan === 'DELUXE';

  const renderIcon = (type) => {
    switch (type) {
      case 'flame': return <Flame size={16} />;
      case 'zap': return <Zap size={16} />;
      case 'shield': return <Shield size={16} />;
      case 'coffee': return <Coffee size={16} />;
      default: return <Smile size={16} />;
    }
  };

  // Compute 3D vertical carousel styles for upward rotation
  const getCardStyle = (index) => {
    let offset = index - currentIndex;
    while (offset > totalSlides / 2) offset -= totalSlides;
    while (offset < -totalSlides / 2) offset += totalSlides;

    // Active Center Slide (Sharp, elevated, prominent)
    if (offset === 0) {
      return {
        transform: 'translate3d(0, 0px, 80px) scale(1) rotateX(0deg)',
        opacity: 1,
        zIndex: 10,
        pointerEvents: 'auto',
        visibility: 'visible',
        transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease, box-shadow 0.8s ease, border-color 0.8s ease'
      };
    }

    // Top Preview Slide (Moved up, semi-transparent preview)
    if (offset === -1) {
      return {
        transform: 'translate3d(0, -112px, -45px) scale(0.88) rotateX(6deg)',
        opacity: 0.45,
        zIndex: 5,
        pointerEvents: 'none',
        visibility: 'visible',
        transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease, box-shadow 0.8s ease'
      };
    }

    // Bottom Preview Slide (Coming up towards center, semi-transparent preview)
    if (offset === 1) {
      return {
        transform: 'translate3d(0, 112px, -45px) scale(0.88) rotateX(-6deg)',
        opacity: 0.45,
        zIndex: 5,
        pointerEvents: 'none',
        visibility: 'visible',
        transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease, box-shadow 0.8s ease'
      };
    }

    // Offscreen Hidden Slides (Quietly repositioned offscreen)
    const isTopHidden = offset < 0;
    return {
      transform: isTopHidden
        ? 'translate3d(0, -220px, -110px) scale(0.74) rotateX(14deg)'
        : 'translate3d(0, 220px, -110px) scale(0.74) rotateX(-14deg)',
      opacity: 0,
      zIndex: 1,
      pointerEvents: 'none',
      visibility: 'hidden',
      transition: 'none'
    };
  };

  return (
    <section
      id="sibling-fun"
      className={`section gift-fun-section plan-${normalizedPlan.toLowerCase()}`}
      aria-label="Sibling Superlatives 3D Vertical Carousel"
    >
      <div className="container fun-container">
        {/* Section Header */}
        <div className="section-header fun-header">
          <div className="section-tag fun-tag">
            {isDeluxe ? <Award size={13} /> : <Smile size={13} />}
            <span>{config.siblingFun.eyebrow}</span>
          </div>
          <h2 className="section-title fun-title">
            {config.siblingFun.title}
          </h2>
          {config.siblingFun.subtitle && (
            <p className="section-subtitle fun-subtitle">
              {config.siblingFun.subtitle}
            </p>
          )}
        </div>

        {/* 3D Vertical Carousel Stage (Centered in Viewport) */}
        <div
          className="carousel-3d-stage"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="region"
          aria-live="polite"
        >
          <div className="carousel-3d-viewport">
            {funItems.map((item, index) => {
              const diff = (index - currentIndex + totalSlides) % totalSlides;
              const cardStyle = getCardStyle(index);
              const isActive = diff === 0;

              return (
                <div
                  key={item.id || index}
                  style={cardStyle}
                  className={`fun-banter-card paper-card carousel-3d-card ${isActive ? 'card-active' : 'card-preview'} ${isDeluxe ? 'card-deluxe-banter' : ''}`}
                  aria-hidden={!isActive}
                >
                  {/* Deluxe Gold Corner Flourish */}
                  {isDeluxe && <div className="deluxe-card-corner" aria-hidden="true" />}

                  {/* Tag Header with Icon */}
                  <div className="fun-card-tag-row">
                    <div className="fun-icon-bubble">
                      {renderIcon(item.icon)}
                    </div>
                    <span className="fun-category-tag">{item.tag}</span>
                  </div>

                  {/* Main Banter Title */}
                  <h3 className="fun-item-title">{item.title}</h3>

                  {/* Verdict / Punchline Ruling Box */}
                  <div className="fun-verdict-box">
                    <span className="verdict-label">The Ruling:</span>
                    <p className="verdict-text">{item.verdict}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .gift-fun-section {
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: var(--space-8, 2rem);
          padding-bottom: var(--space-8, 2rem);
          position: relative;
          background: transparent;
          box-sizing: border-box;
        }

        .fun-container {
          max-width: 960px;
          width: 100%;
          margin: 0 auto;
          padding: 0 clamp(0.75rem, 3.5vw, 1.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .fun-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto var(--space-6, 1.5rem) auto;
        }

        .fun-tag {
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

        .plan-deluxe .fun-tag {
          color: var(--gift-gold-dark, #7D5728);
          background: linear-gradient(135deg, var(--gift-gold-light, #FFF6E5) 0%, var(--gift-canvas, #FAEDD2) 100%);
          border-color: var(--gift-border-gold, #DFC9A8);
        }

        .fun-title {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 700;
          color: var(--gift-text, #1E1B18);
          margin-bottom: var(--space-2, 0.5rem);
          letter-spacing: -0.015em;
          line-height: 1.2;
        }

        .plan-deluxe .fun-title {
          color: var(--gift-text, #2D1D13);
        }

        .fun-subtitle {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: clamp(0.875rem, 1.6vw, 1rem);
          color: var(--gift-text-secondary, #59524C);
          line-height: 1.6;
          margin: 0 auto;
          max-width: 580px;
        }

        /* --- 3D Vertical Carousel Stage (Centered in Viewport) --- */
        .carousel-3d-stage {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
          margin: 0 auto;
          padding: 1rem 0;
        }

        .carousel-3d-viewport {
          position: relative;
          width: min(720px, 92vw);
          height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }

        /* Base Carousel Slide Card (Streamlined height, zero blur, crisp text) */
        .fun-banter-card.carousel-3d-card {
          position: absolute;
          width: 100%;
          height: 165px;
          background: var(--gift-surface, #FFFDF9);
          border: 1.5px solid var(--gift-border, #E5D9C8);
          border-radius: var(--radius-xl, 18px);
          padding: 1.15rem 1.5rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          backface-visibility: hidden;
          will-change: transform, opacity;
          user-select: none;
          filter: none !important;
        }

        /* Active Card Style (Crisp, High Contrast, Elevated) */
        .carousel-3d-card.card-active {
          box-shadow: 
            0 24px 56px -12px var(--gift-shadow-tone, rgba(60, 45, 25, 0.18)),
            0 8px 24px -4px var(--gift-shadow-tone, rgba(60, 45, 25, 0.08));
          background-color: var(--gift-surface, #FFFDF9);
          border-color: var(--gift-border, #E5D9C8);
        }

        /* Preview Cards Style */
        .carousel-3d-card.card-preview {
          background-color: var(--gift-surface, rgba(255, 253, 249, 0.72));
          border-color: var(--gift-border, rgba(229, 217, 200, 0.65));
          box-shadow: 0 8px 20px var(--gift-shadow-tone, rgba(60, 45, 25, 0.06));
        }

        /* Deluxe Card Treatment */
        .card-deluxe-banter.card-active {
          background: linear-gradient(180deg, var(--gift-surface, #FFFDFB) 0%, var(--gift-canvas, #FAF5EE) 100%);
          border-color: var(--gift-border-gold, #DFCDB4);
          box-shadow: 
            0 28px 60px -12px var(--gift-shadow-tone, rgba(60, 40, 20, 0.22)),
            0 0 24px var(--gift-gold-muted, rgba(198, 146, 52, 0.12));
        }

        .deluxe-card-corner {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 12px;
          height: 12px;
          border-top: 1.5px solid var(--gift-gold-muted, rgba(198, 146, 52, 0.5));
          border-right: 1.5px solid var(--gift-gold-muted, rgba(198, 146, 52, 0.5));
          border-top-right-radius: 3px;
          pointer-events: none;
        }

        /* Tag Header with Icon */
        .fun-card-tag-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2px;
        }

        .fun-icon-bubble {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--gift-tag-bg, #FBF0EF);
          color: var(--gift-tag-color, #9B2226);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-deluxe-banter .fun-icon-bubble {
          background: linear-gradient(135deg, var(--gift-gold-light, #FAF2E2) 0%, var(--gift-canvas, #F5E5C4) 100%);
          color: var(--gift-gold-dark, #7A531C);
        }

        .fun-category-tag {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--gift-text-secondary, #59524C);
        }

        .card-deluxe-banter .fun-category-tag {
          color: var(--gift-gold-dark, #7D5728);
        }

        /* Main Banter Title */
        .fun-item-title {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.05rem, 2.2vw, 1.25rem);
          font-weight: 700;
          color: var(--gift-text, #1E1B18);
          margin: 0;
          line-height: 1.3;
        }

        .card-deluxe-banter .fun-item-title {
          color: var(--gift-text, #2D1D13);
        }

        /* Verdict Box */
        .fun-verdict-box {
          background: var(--gift-canvas, rgba(245, 239, 230, 0.6));
          border-left: 2.5px solid var(--gift-accent, #9B2226);
          padding: 6px 10px;
          border-radius: 0 var(--radius-sm, 6px) var(--radius-sm, 6px) 0;
          margin-top: 2px;
        }

        .card-deluxe-banter .fun-verdict-box {
          border-left-color: var(--gift-accent, #8E1616);
          background: var(--gift-canvas, rgba(248, 240, 226, 0.7));
        }

        .verdict-label {
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--gift-accent, #9B2226);
          display: block;
          margin-bottom: 1px;
        }

        .card-deluxe-banter .verdict-label {
          color: var(--gift-gold-dark, #7D5728);
        }

        .verdict-text {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.8125rem;
          color: var(--gift-text-secondary, #59524C);
          margin: 0;
          line-height: 1.4;
          font-style: italic;
        }

        /* Responsive Mobile Layout */
        @media (max-width: 640px) {
          .carousel-3d-viewport {
            height: 380px;
          }

          .fun-banter-card.carousel-3d-card {
            height: 160px;
            padding: 0.95rem 1.15rem;
            border-radius: var(--radius-lg, 16px);
          }

          .carousel-3d-card.card-preview-top {
            transform: translate3d(0, -98px, -40px) scale(0.88);
          }

          .carousel-3d-card.card-preview-bottom {
            transform: translate3d(0, 98px, -40px) scale(0.88);
          }

          .fun-item-title {
            font-size: 0.95rem;
          }

          .verdict-text {
            font-size: 0.75rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fun-banter-card.carousel-3d-card {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SiblingFun;
