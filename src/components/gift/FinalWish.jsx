import React from 'react';
import { Heart, Sparkles, Award } from 'lucide-react';
import { getGiftSectionConfig } from './giftSectionConfig';

export const FinalWish = ({
  gift,
  plan
}) => {
  const normalizedPlan = (plan || gift?.plan || 'PREMIUM').toUpperCase();
  const config = getGiftSectionConfig(normalizedPlan);
  const isDeluxe = normalizedPlan === 'DELUXE';

  const recipientDisplayName = gift?.recipientNickname || gift?.recipientName || 'My Dearest Sibling';
  const senderDisplayName = gift?.senderNickname || gift?.senderName || 'Your Sibling';

  return (
    <section id="final-wish" className={`section gift-wish-section plan-${normalizedPlan.toLowerCase()}`}>
      <div className="container">
        <div className={`wish-card-container paper-card ${isDeluxe ? 'wish-card-deluxe' : ''}`}>
          {isDeluxe && <div className="deluxe-wish-corners" aria-hidden="true" />}

          {/* Central Heart / Sacred Motif */}
          <div className={`wish-sacred-emblem ${isDeluxe ? 'emblem-deluxe' : ''}`}>
            {isDeluxe ? <Award size={22} /> : <Heart size={20} className="emblem-heart" />}
          </div>

          <div className="wish-tag-pill">
            <Sparkles size={13} className="sparkle-gold" />
            <span>A Lifelong Blessing</span>
          </div>

          {/* Main Blessing Title */}
          <h2 className="wish-main-heading">
            Happy Raksha Bandhan,{' '}
            <span className="title-serif-accent">{recipientDisplayName}!</span>
          </h2>

          {/* Blessing Body */}
          <p className="wish-body-text">
            May our bond stay as sweet as our favorite festival sweets, as fearless as our childhood dreams, 
            and as unbreakable as the sacred threads tied across our wrists today.
          </p>

          <div className="wish-signature-row">
            <span className="wish-with-love">With infinite love & blessings,</span>
            <span className="wish-sender-name">{senderDisplayName} ❤️</span>
          </div>
        </div>
      </div>

      <style>{`
        .gift-wish-section {
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: var(--space-8, 2rem);
          padding-bottom: var(--space-8, 2rem);
          position: relative;
        }

        .wish-card-container {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
          background: var(--gift-surface, #FFFDF9);
          border: 1px solid var(--gift-border, #E5D9C8);
          border-radius: var(--radius-xl, 16px);
          padding: clamp(2.5rem, 6vw, 4rem) clamp(1.75rem, 5vw, 3.5rem);
          text-align: center;
          box-shadow: 
            0 12px 36px -6px var(--gift-shadow-tone, rgba(60, 45, 25, 0.12)),
            0 4px 12px -2px var(--gift-shadow-tone, rgba(60, 45, 25, 0.06));
          overflow: hidden;
        }

        .wish-card-deluxe {
          background: linear-gradient(180deg, var(--gift-surface, #FFFEFD) 0%, var(--gift-canvas, #FAF3E6) 100%);
          border: 1.5px solid var(--gift-border-gold, #DFC9A8);
          box-shadow: 
            0 20px 50px -10px var(--gift-shadow-tone, rgba(60, 40, 15, 0.18)),
            0 8px 20px -4px var(--gift-shadow-tone, rgba(60, 40, 15, 0.08));
        }

        .deluxe-wish-corners {
          position: absolute;
          inset: 8px;
          border: 1px solid var(--gift-gold-muted, rgba(198, 146, 52, 0.3));
          border-radius: calc(var(--radius-xl, 16px) - 4px);
          pointer-events: none;
        }

        .wish-sacred-emblem {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--gift-tag-bg, #FBF0EF);
          color: var(--gift-tag-color, #9B2226);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-4, 1rem) auto;
          box-shadow: 0 2px 8px var(--gift-shadow-tone, rgba(155, 34, 38, 0.15));
        }

        .emblem-heart {
          fill: var(--gift-accent, #9B2226);
        }

        .emblem-deluxe {
          background: linear-gradient(135deg, var(--gift-gold-light, #FFF5E0) 0%, var(--gift-canvas, #F5E2BD) 100%);
          color: var(--gift-gold-dark, #7D5728);
          border: 1px solid var(--gift-border-gold, #DFC9A8);
          box-shadow: 0 4px 12px var(--gift-gold-muted, rgba(185, 145, 75, 0.2));
        }

        .wish-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-xs, 0.75rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--gift-tag-color, #9B2226);
          background: var(--gift-tag-bg, #FFF8F0);
          padding: 4px 14px;
          border-radius: var(--radius-full, 9999px);
          margin-bottom: var(--space-4, 1rem);
          border: 1px solid var(--gift-tag-border, rgba(155, 34, 38, 0.12));
        }

        .wish-main-heading {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(2rem, 4.5vw, 3rem);
          font-weight: 700;
          color: var(--gift-text, #1E1B18);
          margin-bottom: var(--space-4, 1rem);
          letter-spacing: -0.015em;
        }

        .title-serif-accent {
          color: var(--gift-accent, #9B2226);
        }

        .plan-deluxe .title-serif-accent {
          background: linear-gradient(135deg, var(--gift-accent, #8E1616) 0%, var(--gift-gold, #D4AF37) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .wish-body-text {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: clamp(1rem, 2vw, 1.15rem);
          line-height: 1.75;
          color: var(--gift-text-secondary, #59524C);
          max-width: 620px;
          margin: 0 auto var(--space-8, 2rem) auto;
        }

        .wish-signature-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .wish-with-love {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: var(--text-sm, 0.875rem);
          font-style: italic;
          color: var(--gift-text-secondary, #59524C);
        }

        .wish-sender-name {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.2rem, 2.4vw, 1.5rem);
          font-weight: 700;
          color: var(--gift-accent, #9B2226);
        }

        .plan-deluxe .wish-sender-name {
          color: #8E1616;
        }

        @media (max-width: 640px) {
          .wish-card-container {
            padding: 2.25rem 1.25rem 2rem 1.25rem;
          }
          .wish-main-heading {
            font-size: 1.85rem;
          }
          .wish-body-text {
            font-size: 1rem;
            line-height: 1.7;
          }
        }
      `}</style>
    </section>
  );
};

export default FinalWish;
