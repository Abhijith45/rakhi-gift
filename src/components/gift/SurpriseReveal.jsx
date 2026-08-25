import React, { useState } from 'react';
import { Lock, Unlock, Award, Gift, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getGiftSectionConfig } from './giftSectionConfig';

export const SurpriseReveal = ({
  gift,
  plan,
  onReveal
}) => {
  const [opened, setOpened] = useState(false);
  const normalizedPlan = (plan || gift?.plan || 'PREMIUM').toUpperCase();
  const config = getGiftSectionConfig(normalizedPlan);

  const surpriseData = gift?.surprise;
  const hasSurprise = surpriseData && (surpriseData.voucher || surpriseData.giftVoucher || surpriseData.message || surpriseData.title);

  if (!hasSurprise) {
    return null;
  }

  const voucherCode = surpriseData.voucher || surpriseData.giftVoucher || '';

  const isDeluxe = normalizedPlan === 'DELUXE';
  const senderDisplayName = gift?.senderNickname || gift?.senderName || 'Your Sibling';

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    if (onReveal) onReveal();

    try {
      if (isDeluxe) {
        // Multi-burst deluxe celebration confetti
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#9B2226', '#D4AF37', '#8E1616', '#FFF8F0', '#E5C158']
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0.1, y: 0.65 },
            colors: ['#D4AF37', '#9B2226']
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 0.9, y: 0.65 },
            colors: ['#D4AF37', '#9B2226']
          });
        }, 200);
      } else {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#9B2226', '#D4AF37', '#D96B43', '#FFF8F0']
        });
      }
    } catch (e) {}
  };

  return (
    <section id="surprise" className={`section gift-surprise-section plan-${normalizedPlan.toLowerCase()}`}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header surprise-header">
          <div className="section-tag surprise-tag">
            {isDeluxe ? <Award size={13} /> : <Gift size={13} />}
            <span>A Special Discovery</span>
          </div>
          <h2 className="section-title surprise-title">
            The Surprise Reveal
          </h2>
          <p className="section-subtitle surprise-subtitle">
            One last unwritten promise, sealed especially for this moment.
          </p>
        </div>

        {/* Interactive Envelope / Voucher Card */}
        <div className="surprise-stage-wrapper paper-card">
          {!opened ? (
            <div
              className="envelope-closed-view"
              onClick={handleOpen}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen(); }}
              aria-label={`Break seal and open surprise promise from ${senderDisplayName}`}
            >
              {/* Physical Wax Envelope Visual */}
              <div className={`wax-envelope-visual ${isDeluxe ? 'envelope-deluxe' : ''}`}>
                <div className="flap-poly" />
                <div className={`wax-seal-center ${isDeluxe ? 'seal-deluxe-crest' : ''}`}>
                  <Lock size={18} color="#FFFDF9" />
                </div>
              </div>

              <h3 className="surprise-prompt-heading">A Sealed Rakhi Promise</h3>
              <p className="surprise-prompt-text">
                Click or tap to break the wax seal and discover {senderDisplayName}'s secret surprise!
              </p>

              <button type="button" className="btn btn-gold btn-md surprise-open-btn">
                <Unlock size={16} />
                <span>Break Seal & Open</span>
              </button>
            </div>
          ) : (
            <div className="envelope-opened-view animate-fade-in-up">
              {/* Unlocked Keepsake Voucher Ticket */}
              <div className={`gift-voucher-card ${isDeluxe ? 'voucher-deluxe-pass' : ''}`}>
                {isDeluxe && <div className="voucher-deluxe-corners" aria-hidden="true" />}

                {/* Badge Tag */}
                <div className="voucher-gold-tag">
                  <Sparkles size={14} />
                  <span>{surpriseData.badge || 'A Little Surprise For You'}</span>
                </div>

                {/* Title */}
                <h3 className="voucher-main-title">
                  {surpriseData.title || 'One Last Promise...'}
                </h3>

                {/* Custom Message */}
                {surpriseData.message && (
                  <p className="voucher-custom-msg">{surpriseData.message}</p>
                )}

                {/* Highlighted Voucher Pass Code */}
                {voucherCode && (
                  <div className="voucher-code-highlight">
                    <span className="voucher-code-text">{voucherCode}</span>
                  </div>
                )}

                {/* Sub-note */}
                {surpriseData.note && (
                  <p className="voucher-sub-note">{surpriseData.note}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .gift-surprise-section {
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: var(--space-8, 2rem);
          padding-bottom: var(--space-10, 2.5rem);
          position: relative;
        }

        .surprise-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto var(--space-6, 1.5rem) auto;
        }

        .surprise-tag {
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

        .plan-deluxe .surprise-tag {
          color: var(--gift-gold-dark, #7D5728);
          background: linear-gradient(135deg, var(--gift-gold-light, #FFF6E5) 0%, var(--gift-canvas, #FAEDD2) 100%);
          border: 1px solid var(--gift-border-gold, #DFC9A8);
        }

        .surprise-title {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.85rem, 3.6vw, 2.6rem);
          color: var(--gift-text, #1E1B18);
          margin-bottom: var(--space-2, 0.5rem);
          letter-spacing: -0.01em;
        }

        .plan-deluxe .surprise-title {
          color: var(--gift-text, #2D1D13);
        }

        .surprise-subtitle {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: var(--text-sm, 0.875rem);
          color: var(--gift-text-secondary, #59524C);
          line-height: 1.65;
          margin: 0 auto;
        }

        /* --- Surprise Card Wrapper --- */
        .surprise-stage-wrapper {
          max-width: 720px;
          margin: 0 auto;
          padding: clamp(1.75rem, 5vw, 3.25rem) clamp(1rem, 4vw, 2.5rem);
          background: var(--gift-surface, #FFFDF9);
          border: 1px solid var(--gift-border, #E5D9C8);
          border-radius: var(--radius-lg, 12px);
          box-shadow: 
            0 10px 30px -4px var(--gift-shadow-tone, rgba(60, 45, 25, 0.12)),
            0 4px 10px -2px var(--gift-shadow-tone, rgba(60, 45, 25, 0.06));
          text-align: center;
        }

        .plan-deluxe .surprise-stage-wrapper {
          border-color: #DFCDB4;
          box-shadow: 0 16px 40px rgba(60, 40, 20, 0.15);
        }

        .envelope-closed-view {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          outline: none;
        }

        .envelope-closed-view:focus-visible {
          outline: 2px solid var(--color-gold, #C69234);
          border-radius: var(--radius-md, 8px);
        }

        /* Physical Wax Envelope */
        .wax-envelope-visual {
          width: 148px;
          height: 100px;
          background: linear-gradient(135deg, #EFE6D8 0%, #DFD2C0 100%);
          border: 2px solid #C8B9A6;
          border-radius: var(--radius-md, 8px);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-5, 1.25rem);
          box-shadow: 0 8px 22px rgba(60, 45, 25, 0.16);
          transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.24s ease;
        }

        .envelope-closed-view:hover .wax-envelope-visual {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 14px 30px rgba(60, 45, 25, 0.22);
        }

        .envelope-deluxe {
          background: linear-gradient(135deg, #F8EEDA 0%, #EBDBC1 100%);
          border: 2px solid #D4AF37;
          box-shadow: 0 10px 26px rgba(185, 145, 75, 0.25);
        }

        .flap-poly {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 0;
          border-left: 74px solid transparent;
          border-right: 74px solid transparent;
          border-top: 52px solid #D8CABB;
        }

        .envelope-deluxe .flap-poly {
          border-top-color: #E2CFAC;
        }

        .wax-seal-center {
          position: relative;
          z-index: 2;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #C23838 0%, #8F181B 70%, #5E0D0F 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(143, 24, 27, 0.45);
          border: 1.5px solid #701316;
        }

        .seal-deluxe-crest {
          background: radial-gradient(circle at 35% 35%, #E54549 0%, #9B2226 60%, #4A0B0D 100%);
          box-shadow: 0 4px 12px rgba(155, 34, 38, 0.5), 0 0 0 2px rgba(212, 175, 55, 0.7);
          border-color: #6E1215;
        }

        .surprise-prompt-heading {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: 1.55rem;
          font-weight: 700;
          color: var(--text-primary, #1E1B18);
          margin-bottom: 6px;
        }

        .surprise-prompt-text {
          font-size: var(--text-sm, 0.875rem);
          color: var(--text-secondary, #59524C);
          line-height: 1.6;
          max-width: 520px;
          margin: 0 auto var(--space-6, 1.5rem) auto;
        }

        .surprise-open-btn {
          pointer-events: none; /* Clicking envelope triggers it */
        }

        /* --- Opened Voucher Ticket --- */
        .gift-voucher-card {
          position: relative;
          background: linear-gradient(135deg, #FAF4E8 0%, #FFFDF9 100%);
          border: 2px solid var(--color-gold, #C69234);
          border-radius: var(--radius-lg, 12px);
          padding: clamp(1.75rem, 4vw, 2.75rem);
          box-shadow: 0 8px 24px rgba(60, 45, 25, 0.12);
        }

        .voucher-deluxe-pass {
          background: linear-gradient(135deg, #FFFDFB 0%, #FAF2E2 100%);
          border: 2px solid #C5A059;
          box-shadow: 
            0 12px 34px rgba(60, 40, 20, 0.16),
            inset 0 0 0 1px rgba(255, 255, 255, 0.9);
        }

        .voucher-deluxe-corners {
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(198, 146, 52, 0.35);
          border-radius: calc(var(--radius-lg, 12px) - 4px);
          pointer-events: none;
        }

        .voucher-gold-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #C69234 0%, #9B701E 100%);
          color: #FFFFFF;
          font-size: var(--text-xs, 0.75rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 4px 16px;
          border-radius: var(--radius-full, 9999px);
          margin-bottom: var(--space-4, 1rem);
          box-shadow: 0 2px 6px rgba(198, 146, 52, 0.25);
        }

        .voucher-main-title {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.45rem, 3vw, 1.85rem);
          font-weight: 700;
          color: var(--text-primary, #1E1B18);
          margin-bottom: var(--space-3, 0.75rem);
        }

        .voucher-custom-msg {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-style: italic;
          font-size: 1.05rem;
          color: #382F27;
          line-height: 1.75;
          margin-bottom: var(--space-6, 1.5rem);
          max-width: 580px;
          margin-left: auto;
          margin-right: auto;
        }

        .voucher-code-highlight {
          background: #FFFFFF;
          border: 1.5px dashed var(--color-gold, #C69234);
          padding: var(--space-3, 0.75rem) var(--space-6, 1.5rem);
          border-radius: var(--radius-md, 8px);
          display: inline-block;
          margin-bottom: var(--space-4, 1rem);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
          max-width: 100%;
          box-sizing: border-box;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .voucher-code-text {
          font-family: monospace;
          font-weight: 700;
          font-size: 1rem;
          color: var(--color-rakhi-red, #9B2226);
          letter-spacing: 0.08em;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .voucher-sub-note {
          font-size: var(--text-xs, 0.75rem);
          color: var(--text-secondary, #59524C);
          font-style: italic;
          margin: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .envelope-opened-view {
            animation: none !important;
          }
          .envelope-closed-view:hover .wax-envelope-visual {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SurpriseReveal;
