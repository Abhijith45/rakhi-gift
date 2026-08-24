import React, { useState } from 'react';
import { Copy, Check, QrCode, Share2, Bookmark, Download, Heart } from 'lucide-react';
import { getGiftSectionConfig } from './giftSectionConfig';

export const KeepsakeShare = ({
  gift,
  plan,
  qrDataUrl,
  onOpenQrModal,
  onCopyLink,
  copied = false
}) => {
  const normalizedPlan = (plan || gift?.plan || 'PREMIUM').toUpperCase();
  const config = getGiftSectionConfig(normalizedPlan);
  const isDeluxe = normalizedPlan === 'DELUXE';

  const recipientDisplayName = gift?.recipientNickname || gift?.recipientName || 'You';
  const senderDisplayName = gift?.senderNickname || gift?.senderName || 'Your Sibling';

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://rakhigift.me/g/${gift?.slug || ''}`;

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🎁 A special Rakhi memory keepsake for ${recipientDisplayName} created by ${senderDisplayName} ❤️\n\nOpen your gift: ${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <section id="share" className={`section gift-share-section plan-${normalizedPlan.toLowerCase()}`}>
      <div className="container">
        <div className={`keepsake-share-card paper-card ${isDeluxe ? 'share-card-deluxe' : ''}`}>
          {isDeluxe && <div className="deluxe-share-corner" aria-hidden="true" />}

          <div className="share-icon-emblem">
            <Bookmark size={20} />
          </div>

          <h3 className="share-card-title">
            Preserve & Share This Keepsake
          </h3>

          <p className="share-card-desc">
            This digital Rakhi gift is permanently stored and always accessible. Bookmark this URL or share it with family across the world.
          </p>

          {/* Permanent URL Display & Copy Box */}
          <div className="share-url-pill-box">
            <span className="share-url-text" title={currentUrl}>{currentUrl}</span>
            <button
              type="button"
              className="btn btn-secondary btn-sm copy-pill-btn"
              onClick={onCopyLink}
              aria-label="Copy permanent gift URL"
            >
              {copied ? <Check size={14} className="icon-green" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="share-actions-group">
            <button
              type="button"
              className="btn btn-gold btn-sm"
              onClick={onOpenQrModal}
              aria-label="Show shareable QR code"
            >
              <QrCode size={15} />
              <span>Show QR Card</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm btn-whatsapp"
              onClick={handleWhatsAppShare}
              aria-label="Share gift on WhatsApp"
            >
              <Share2 size={15} />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .gift-share-section {
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: var(--space-6, 1.5rem);
          padding-bottom: var(--space-12, 3rem);
          position: relative;
        }

        .keepsake-share-card {
          position: relative;
          max-width: 680px;
          margin: 0 auto;
          background: var(--gift-surface, #FFFDF9);
          border: 1px solid var(--gift-border, #E5D9C8);
          border-radius: var(--radius-lg, 12px);
          padding: clamp(2rem, 5vw, 3rem);
          text-align: center;
          box-shadow: 
            0 8px 24px -4px var(--gift-shadow-tone, rgba(60, 45, 25, 0.08)),
            0 2px 6px var(--gift-shadow-tone, rgba(60, 45, 25, 0.04));
        }

        .share-card-deluxe {
          background: linear-gradient(180deg, var(--gift-surface, #FFFDFB) 0%, var(--gift-canvas, #FAF4E8) 100%);
          border: 1px solid var(--gift-border-gold, #DFCDB4);
          box-shadow: 0 14px 34px var(--gift-shadow-tone, rgba(60, 40, 20, 0.12));
        }

        .deluxe-share-corner {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 10px;
          height: 10px;
          border-top: 1.5px solid var(--gift-gold-muted, rgba(198, 146, 52, 0.45));
          border-right: 1.5px solid var(--gift-gold-muted, rgba(198, 146, 52, 0.45));
          border-top-right-radius: 2px;
          pointer-events: none;
        }

        .share-icon-emblem {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gift-gold-light, #FAF4E8);
          color: var(--gift-gold, #C69234);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px auto;
          box-shadow: 0 2px 6px var(--gift-shadow-tone, rgba(198, 146, 52, 0.15));
        }

        .share-card-title {
          font-family: var(--gift-font-heading, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.35rem, 2.5vw, 1.65rem);
          font-weight: 700;
          color: var(--gift-text, #1E1B18);
          margin-bottom: 8px;
        }

        .share-card-desc {
          font-family: var(--gift-font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: var(--text-sm, 0.875rem);
          color: var(--gift-text-secondary, #59524C);
          line-height: 1.65;
          max-width: 520px;
          margin: 0 auto var(--space-6, 1.5rem) auto;
        }

        .share-url-pill-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--gift-canvas, #F5EFEB);
          border: 1px solid var(--gift-border, #E5D9C8);
          border-radius: var(--radius-md, 8px);
          padding: 6px 6px 6px 14px;
          margin-bottom: var(--space-5, 1.25rem);
          gap: 8px;
          overflow: hidden;
        }

        .share-url-text {
          font-family: monospace;
          font-size: var(--text-xs, 0.75rem);
          color: var(--gift-text, #1E1B18);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
        }

        .copy-pill-btn {
          border-radius: var(--radius-full, 9999px) !important;
          flex-shrink: 0;
          padding: 6px 14px !important;
          font-size: var(--text-xs, 0.75rem) !important;
        }

        .share-actions-group {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .btn-whatsapp {
          background: #FFFDF9;
          border-color: #25D366;
          color: #128C7E;
        }

        .btn-whatsapp:hover {
          background: #25D366;
          color: #FFFFFF;
          border-color: #25D366;
        }

        .icon-green {
          color: #2E7D32;
        }

        @media (max-width: 640px) {
          .share-actions-group {
            flex-direction: column;
            width: 100%;
          }
          .share-actions-group button {
            width: 100%;
            justify-content: center;
          }
          .share-url-pill-box {
            border-radius: var(--radius-md, 8px);
            padding: 8px 10px;
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          .share-url-text {
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};

export default KeepsakeShare;
