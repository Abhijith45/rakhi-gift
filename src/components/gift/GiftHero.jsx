import React, { useState } from 'react';
import { Sparkles, Heart, Copy, Check, QrCode, ArrowDown, Award } from 'lucide-react';
import { getGiftSectionConfig } from './giftSectionConfig';

export const GiftHero = ({
  gift,
  plan,
  onOpenQrModal,
  onCopyLink,
  copied = false
}) => {
  const normalizedPlan = (plan || gift?.plan || 'PREMIUM').toUpperCase();
  const config = getGiftSectionConfig(normalizedPlan);
  const isDeluxe = normalizedPlan === 'DELUXE';
  const isBasic = normalizedPlan === 'BASIC';

  const recipientDisplayName = gift?.recipientNickname || gift?.recipientName || 'You';
  const senderDisplayName = gift?.senderNickname || gift?.senderName || 'Someone who loves you';
  const relationship = (gift?.relationship || 'Sibling').toLowerCase();

  const handleScrollToWall = () => {
    const wallEl = document.getElementById('memory-wall-section') || document.querySelector('.gift-wall-section');
    if (wallEl) {
      wallEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className={`gift-hero-section plan-${normalizedPlan.toLowerCase()}`}>
      {/* Ambient background glow */}
      <div className="hero-ambient-glow" aria-hidden="true" />

      <div className="container gift-hero-container">
        {/* Eyebrow Pill Badge */}
        <div className={`gift-hero-badge ${config.hero.badgeClass}`}>
          {isDeluxe ? (
            <Award size={14} className="badge-icon-deluxe" />
          ) : (
            <Sparkles size={14} className="badge-icon-gold" />
          )}
          <span>{config.hero.eyebrow}</span>
        </div>

        {/* Primary Emotional Title */}
        <h1 className="gift-hero-title">
          For my favorite {relationship},{' '}
          <span className="title-serif-accent">
            {recipientDisplayName} <span className="heart-accent">❤️</span>
          </span>
        </h1>

        {/* Emotional Subtitle */}
        <p className="gift-hero-sub">
          A little collection of our laughter, shared memories, secret jokes, and everything that makes our bond irreplaceable — lovingly curated for you by <strong>{senderDisplayName}</strong>.
        </p>

        {/* Utility Actions Bar */}
        <div className="gift-hero-actions">
          {onCopyLink && (
            <button
              type="button"
              className="hero-action-btn btn-secondary-pill"
              onClick={onCopyLink}
              aria-label="Copy gift link to share"
            >
              {copied ? <Check size={14} className="btn-icon-green" /> : <Copy size={14} />}
              <span>{copied ? 'Link Copied!' : 'Copy Gift Link'}</span>
            </button>
          )}

          {onOpenQrModal && (
            <button
              type="button"
              className="hero-action-btn btn-gold-pill"
              onClick={onOpenQrModal}
              aria-label="Open shareable QR Code"
            >
              <QrCode size={14} />
              <span>Show QR Code</span>
            </button>
          )}

          {/* Smooth Scroll Cue to Memory Wall */}
          <button
            type="button"
            className="hero-action-btn btn-explore-pill"
            onClick={handleScrollToWall}
            aria-label="Scroll down to memory wall"
          >
            <span>Explore Memories</span>
            <ArrowDown size={13} className="animate-subtle-bounce" />
          </button>
        </div>
      </div>

      <style>{`
        .gift-hero-section {
          position: relative;
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: calc(var(--header-height, 64px) + 2rem);
          padding-bottom: var(--space-8, 2rem);
          text-align: center;
          overflow: hidden;
        }

        .hero-ambient-glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          max-width: 900px;
          height: 380px;
          background: radial-gradient(circle at 50% 20%, var(--gift-gold-muted, rgba(212, 175, 55, 0.16)) 0%, var(--gift-accent-muted, rgba(155, 34, 38, 0.06)) 45%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        .gift-hero-container {
          position: relative;
          z-index: 2;
          max-width: 780px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: heroFadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        @keyframes heroFadeIn {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* --- Eyebrow Badge Pill --- */
        .gift-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: var(--radius-full, 9999px);
          font-size: var(--text-xs, 0.75rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: var(--space-4, 1rem);
          background: var(--gift-tag-bg, #FBF0EF);
          color: var(--gift-tag-color, #9B2226);
          border: 1px solid var(--gift-tag-border, rgba(155, 34, 38, 0.15));
          box-shadow: 0 2px 8px var(--gift-shadow-tone, rgba(0, 0, 0, 0.04));
        }

        .plan-deluxe .gift-hero-badge {
          background: linear-gradient(135deg, var(--gift-gold-light, #FFF6E5) 0%, var(--gift-canvas, #FAEDD2) 100%);
          color: var(--gift-gold-dark, #7D5728);
          border-color: var(--gift-border-gold, #DFC9A8);
        }

        .badge-icon-gold {
          color: var(--gift-gold, #C69234);
        }

        .badge-icon-deluxe {
          color: var(--gift-gold-dark, #7D5728);
        }

        /* --- Title & Typography --- */
        .gift-hero-title {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(2.1rem, 5.2vw, 3.75rem);
          font-weight: 700;
          line-height: 1.15;
          color: var(--gift-text, #1E1B18);
          margin-bottom: var(--space-4, 1rem);
          letter-spacing: -0.015em;
        }

        .title-serif-accent {
          display: inline-block;
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          color: var(--gift-accent, #9B2226);
        }

        .plan-deluxe .title-serif-accent {
          background: linear-gradient(135deg, var(--gift-accent, #8E1616) 0%, var(--gift-accent-secondary, #D4AF37) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .heart-accent {
          display: inline-block;
          font-style: normal;
          -webkit-text-fill-color: initial;
          vertical-align: middle;
        }

        /* --- Emotional Subtitle --- */
        .gift-hero-sub {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          line-height: 1.65;
          color: var(--gift-text-secondary, #59524C);
          max-width: 640px;
          margin: 0 auto var(--space-8, 2rem) auto;
        }

        .gift-hero-sub strong {
          color: var(--gift-text, #1E1B18);
          font-weight: 700;
        }

        /* --- Actions Row --- */
        .gift-hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: var(--space-3, 0.75rem);
        }

        .hero-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-full, 9999px);
          font-size: var(--text-xs, 0.75rem);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1.5px solid transparent;
        }

        .btn-secondary-pill {
          background: var(--gift-surface, #FFFDF9);
          border-color: var(--gift-border, #E5D9C8);
          color: var(--gift-text, #1E1B18);
          box-shadow: 0 2px 6px var(--gift-shadow-tone, rgba(45, 30, 15, 0.04));
        }

        .btn-secondary-pill:hover {
          color: var(--text-primary, #1E1B18);
          border-color: var(--border-strong, #C8B9A6);
          transform: translateY(-1px);
        }

        .btn-gold-pill {
          background: linear-gradient(135deg, #FAF4E8 0%, #F5E8D0 100%);
          border-color: #DFC79B;
          color: #735105;
          box-shadow: 0 2px 6px rgba(198, 146, 52, 0.12);
        }

        .btn-gold-pill:hover {
          background: linear-gradient(135deg, #F5E8D0 0%, #EEDBBE 100%);
          color: #523903;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(198, 146, 52, 0.18);
        }

        .btn-explore-pill {
          background: transparent;
          border-color: transparent;
          color: var(--color-rakhi-red, #9B2226);
          padding: 8px 12px;
        }

        .btn-explore-pill:hover {
          background: rgba(155, 34, 38, 0.05);
          color: var(--color-rakhi-dark, #74171A);
        }

        .btn-icon-green {
          color: #2E7D32;
        }

        .animate-subtle-bounce {
          animation: subtleBounce 2s infinite ease-in-out;
        }

        @keyframes subtleBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(3px);
          }
        }

        @media (max-width: 640px) {
          .gift-hero-section {
            padding-top: calc(var(--header-height, 64px) + 1.75rem);
            padding-bottom: var(--space-6, 1.5rem);
          }
          .gift-hero-actions {
            width: 100%;
            flex-direction: column;
            gap: 8px;
          }
          .hero-action-btn {
            width: 100%;
            justify-content: center;
            padding: 9px 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gift-hero-container {
            animation: none !important;
          }
          .animate-subtle-bounce {
            animation: none !important;
          }
          .hero-action-btn:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default GiftHero;
