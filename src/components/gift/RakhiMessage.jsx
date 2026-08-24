import React from 'react';
import { Heart, Feather } from 'lucide-react';
import { getGiftSectionConfig } from './giftSectionConfig';

export const RakhiMessage = ({
  gift,
  plan
}) => {
  const normalizedPlan = (plan || gift?.plan || 'PREMIUM').toUpperCase();
  const config = getGiftSectionConfig(normalizedPlan);
  const isDeluxe = normalizedPlan === 'DELUXE';
  const isBasic = normalizedPlan === 'BASIC';

  const recipientDisplayName = gift?.recipientNickname || gift?.recipientName || 'You';
  const senderDisplayName = gift?.senderNickname || gift?.senderName || 'Your Sibling';

  // Extract message details safely
  const rawMessage = gift?.message;
  let salutation = `Dearest ${recipientDisplayName},`;
  let body = '';
  let signoff = 'With all my love & lifelong promises,';
  let sender = senderDisplayName;

  if (typeof rawMessage === 'string') {
    body = rawMessage;
  } else if (rawMessage && typeof rawMessage === 'object') {
    salutation = rawMessage.salutation || salutation;
    body = rawMessage.body || '';
    signoff = rawMessage.signoff || signoff;
    sender = rawMessage.sender || sender;
  }

  // Graceful fallback if body is empty
  const displayBody = body || `No matter how far we are or how fast life moves, you will always be my first friend, biggest cheerleader, and lifelong partner in crime. Happy Raksha Bandhan! ❤️`;

  // Split multi-paragraph message cleanly
  const paragraphs = displayBody.split(/\n\n+/).filter(Boolean);

  return (
    <section id="rakhi-message" className={`section gift-message-section plan-${normalizedPlan.toLowerCase()}`}>
      <div className="container">
        {/* Section Tag */}
        <div className="message-section-tag">
          <Feather size={13} />
          <span>A Letter From The Heart</span>
        </div>

        {/* Physical Paper Letter Container */}
        <div className="letter-paper-wrapper paper-card">
          {/* Deluxe Gilded Outer Trim */}
          {isDeluxe && <div className="deluxe-gilded-inner-border" aria-hidden="true" />}

          {/* Top Wax Seal / Keepsake Tack */}
          <div className={`letter-wax-seal seal-${normalizedPlan.toLowerCase()}`} title="Sealed with love">
            <Heart size={16} className="seal-heart-icon" />
          </div>

          {/* Salutation */}
          <div className="letter-salutation">
            {salutation}
          </div>

          {/* Letter Body Text */}
          <div className="letter-body-content">
            {paragraphs.map((para, index) => (
              <p key={index} className="letter-paragraph">
                {para}
              </p>
            ))}
          </div>

          {/* Signature & Signoff Block */}
          <div className="letter-signature-block">
            <div className="signature-divider" />
            <span className="signature-signoff">{signoff}</span>
            <span className="signature-sender-name">{sender}</span>
          </div>
        </div>
      </div>

      <style>{`
        .gift-message-section {
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: var(--space-8, 2rem);
          padding-bottom: var(--space-10, 2.5rem);
          position: relative;
        }

        .message-section-tag {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: var(--text-xs, 0.75rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--gift-tag-color, #9B2226);
          margin-bottom: var(--space-6, 1.5rem);
        }

        .plan-deluxe .message-section-tag {
          color: var(--gift-accent, #8E1616);
        }

        /* --- Physical Paper Letter --- */
        .letter-paper-wrapper {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
          background: var(--gift-surface, #FFFDF9); /* Warm photographic / fine stationery paper */
          padding: clamp(2.25rem, 5.5vw, 3.75rem) clamp(1.75rem, 5vw, 3.25rem);
          border-radius: var(--radius-lg, 12px);
          border: 1px solid var(--gift-border, #E5D9C8);
          box-shadow: 
            0 10px 30px -4px var(--gift-shadow-tone, rgba(60, 45, 25, 0.12)),
            0 4px 10px -2px var(--gift-shadow-tone, rgba(60, 45, 25, 0.06));
          animation: messageCardFadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        @keyframes messageCardFadeIn {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .plan-basic .letter-paper-wrapper {
          box-shadow: 0 6px 18px var(--gift-shadow-tone, rgba(50, 35, 20, 0.08));
          border-color: var(--gift-border-subtle, #E2D7C7);
        }

        .plan-premium .letter-paper-wrapper {
          background: linear-gradient(180deg, var(--gift-surface, #FFFDFB) 0%, var(--gift-canvas, #FAF5EE) 100%);
          border-color: var(--gift-border, #DFCDB4);
          box-shadow: 
            0 14px 36px -6px var(--gift-shadow-tone, rgba(60, 40, 20, 0.14)),
            0 4px 12px -2px var(--gift-shadow-tone, rgba(60, 40, 20, 0.06));
        }

        .plan-deluxe .letter-paper-wrapper {
          background: linear-gradient(180deg, var(--gift-surface, #FFFEFC) 0%, var(--gift-canvas, #FAF4E8) 100%);
          border: 1px solid var(--gift-border-gold, #DFC9A8);
          box-shadow: 
            0 20px 48px -8px var(--gift-shadow-tone, rgba(60, 40, 15, 0.18)),
            0 6px 16px -2px var(--gift-shadow-tone, rgba(60, 40, 15, 0.08)),
            inset 0 0 0 1px rgba(255, 255, 255, 0.9);
        }

        .deluxe-gilded-inner-border {
          position: absolute;
          inset: 8px;
          border: 1px solid var(--gift-gold-muted, rgba(198, 146, 52, 0.28));
          border-radius: calc(var(--radius-lg, 12px) - 4px);
          pointer-events: none;
        }

        /* --- Wax Seal Detail --- */
        .letter-wax-seal {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }

        .seal-basic {
          background: var(--gift-seal-bg, radial-gradient(circle at 35% 35%, #C4383B 0%, #9B2226 70%, #5E0D0F 100%));
          box-shadow: 0 3px 8px var(--gift-shadow-tone, rgba(155, 34, 38, 0.35));
          border: 1px solid var(--gift-seal-border, #731215);
        }

        .seal-premium {
          background: var(--gift-seal-bg, radial-gradient(circle at 35% 35%, #D44246 0%, #9B2226 65%, #590B0D 100%));
          box-shadow: 
            0 4px 10px var(--gift-accent-glow, rgba(155, 34, 38, 0.4)),
            0 0 0 2px var(--gift-border-gold, rgba(212, 175, 55, 0.35));
          border: 1px solid var(--gift-seal-border, #701114);
        }

        .seal-deluxe {
          width: 42px;
          height: 42px;
          top: -20px;
          background: var(--gift-seal-bg, radial-gradient(circle at 35% 35%, #FF5A5E 0%, #9B2226 55%, #4A0B0D 100%));
          box-shadow: 
            0 4px 12px var(--gift-accent-glow, rgba(142, 22, 22, 0.45)),
            0 0 0 2px var(--gift-border-gold, rgba(212, 175, 55, 0.7)),
            inset 0 1px 2px rgba(255, 255, 255, 0.6);
          border: 1.5px solid var(--gift-seal-border, #6E1215);
        }

        .seal-heart-icon {
          color: var(--gift-seal-text, #FFFDF9);
          fill: var(--gift-seal-text, #FFFDF9);
        }

        /* --- Salutation & Typography --- */
        .letter-salutation {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.4rem, 3.2vw, 1.85rem);
          font-style: italic;
          font-weight: 700;
          color: var(--gift-text, #1E1B18);
          margin-bottom: var(--space-5, 1.25rem);
          line-height: 1.25;
        }

        .plan-deluxe .letter-salutation {
          color: var(--gift-text, #2D1D13);
        }

        .letter-body-content {
          margin-bottom: var(--space-8, 2rem);
        }

        .letter-paragraph {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.05rem, 2vw, 1.22rem);
          line-height: 1.88;
          color: var(--gift-text, #332B24);
          margin-bottom: 1.15rem;
          letter-spacing: -0.005em;
        }

        .letter-paragraph:last-child {
          margin-bottom: 0;
        }

        .plan-deluxe .letter-paragraph {
          color: var(--gift-text, #2B211A);
          line-height: 1.92;
        }

        /* --- Signature Block --- */
        .letter-signature-block {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding-top: var(--space-4, 1rem);
        }

        .signature-divider {
          width: 72px;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, var(--gift-border, #D8C8B4), transparent);
          margin-bottom: var(--space-4, 1rem);
        }

        .signature-signoff {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          font-style: italic;
          color: var(--gift-text-secondary, #59524C);
          margin-bottom: 4px;
        }

        .signature-sender-name {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.2rem, 2.5vw, 1.5rem);
          font-weight: 700;
          color: var(--gift-accent, #9B2226);
          letter-spacing: -0.01em;
        }

        .plan-deluxe .signature-sender-name {
          color: #8E1616;
        }

        @media (max-width: 640px) {
          .letter-paper-wrapper {
            padding: 2.25rem 1.25rem 2rem 1.25rem;
          }
          .letter-salutation {
            font-size: 1.35rem;
          }
          .letter-paragraph {
            font-size: 1rem;
            line-height: 1.75;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .letter-paper-wrapper {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default RakhiMessage;
