import React, { useState, useEffect } from 'react';
import { useParams, Link } from '../router';
import {
  Sparkles,
  Heart,
  Share2,
  QrCode,
  Lock,
  Unlock,
  Award,
  Calendar,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import MemoryWall from '../components/memory-wall/MemoryWall';
import { getPublicGift, trackEvent } from '../services/api';
import { getThemeById } from '../data/themes';

export const PublicGiftPage = () => {
  const { slug } = useParams();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Add noindex, nofollow to head for gift privacy
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = 'noindex, nofollow';

    // Fetch gift
    const fetchGiftData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicGift(slug);
        setGift(data);

        // Generate QR code data URL
        const fullUrl = window.location.href;
        const qr = await QRCode.toDataURL(fullUrl, {
          width: 320,
          margin: 2,
          color: { dark: '#1C1917', light: '#FFFDF9' }
        });
        setQrDataUrl(qr);

        // Track view
        trackEvent('gift_viewed', { slug, giftId: data.id });
      } catch (err) {
        console.error('Error loading public gift:', err);
        setError(err.message || 'This gift could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchGiftData();
  }, [slug]);

  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    trackEvent('surprise_revealed', { slug, giftId: gift?.id });
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#9B2226', '#D4AF37', '#D96B43', '#FFF8F0']
      });
    } catch (e) {}
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    trackEvent('share_clicked', { slug });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="gift-page-loading">
        <Header />
        <div className="loading-content">
          <div className="loading-emblem animate-float">
            <Heart size={32} color="var(--color-rakhi-red)" />
          </div>
          <h2 className="loading-title">Unwrapping Your Rakhi Keepsake...</h2>
          <p className="loading-sub">Connecting memories and preparing the 3D wall</p>
        </div>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="gift-page-error">
        <Header />
        <div className="container error-container">
          <div className="error-card paper-card">
            <AlertCircle size={44} color="var(--color-rakhi-red)" />
            <h2 className="error-title">Gift Not Found</h2>
            <p className="error-desc">{error || 'This gift link does not exist or has expired.'}</p>
            <div className="error-actions">
              <Button href="/" variant="secondary" size="md">
                Visit Home
              </Button>
              <Button href="/create" variant="primary" size="md">
                Create a Rakhi Gift
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const themeConfig = getThemeById(gift.theme);

  return (
    <div
      className="public-gift-root"
      style={{
        '--bg-primary': themeConfig.palette.bgPrimary,
        '--bg-surface': themeConfig.palette.bgSurface,
        '--color-rakhi-red': themeConfig.palette.accent,
        '--color-gold': themeConfig.palette.gold
      }}
    >
      <Header />

      <main className="gift-main">
        {/* Recipient Hero Opening */}
        <section className="gift-hero-section">
          <div className="container gift-hero-container">
            <div className="gift-hero-badge">
              <Sparkles size={14} className="sparkle-gold" />
              <span>A Personalized Raksha Bandhan Tribute</span>
            </div>

            <h1 className="gift-hero-title">
              For my favorite {gift.relationship.toLowerCase()},{' '}
              <span className="title-serif-accent">
                {gift.recipientNickname || gift.recipientName} ❤️
              </span>
            </h1>

            <p className="gift-hero-sub">
              A collection of our shared laughter, road trips, secret jokes, and lifelong memories — 
              handcrafted with love by <strong>{gift.senderNickname || gift.senderName}</strong>.
            </p>

            <div className="gift-hero-share-bar">
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopyLink}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Link Copied!' : 'Copy Gift Link'}</span>
              </button>
              <button
                type="button"
                className="btn btn-gold btn-sm"
                onClick={() => setQrModalOpen(true)}
              >
                <QrCode size={14} />
                <span>Show QR Code</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3D Connected Memory Wall */}
        <section className="section gift-wall-section">
          <div className="container-wide">
            <div className="section-header">
              <div className="section-tag">
                <Sparkles size={13} />
                <span>Mounted Memories</span>
              </div>
              <h2 className="section-title">Our Memory Wall</h2>
              <p className="section-subtitle">
                Hover or tap any photo frame to explore our cherished moments together.
              </p>
            </div>

            <MemoryWall gift={gift} />
          </div>
        </section>

        {/* Heartfelt Rakhi Letter */}
        <section className="section gift-letter-section">
          <div className="container">
            <div className="letter-container paper-card">
              <div className="letter-wax-seal">
                <span>❤️</span>
              </div>
              <div className="letter-salutation">{gift.message.salutation}</div>
              <p className="letter-body-text">{gift.message.body}</p>
              <div className="letter-footer-block">
                <span className="letter-signoff-line">{gift.message.signoff}</span>
                <span className="letter-sender-name">{gift.message.sender}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why You're Special */}
        {gift.reasons && gift.reasons.length > 0 && (
          <section className="section gift-reasons-section">
            <div className="container">
              <div className="section-header">
                <div className="section-tag">
                  <Heart size={13} />
                  <span>The Sibling Bond</span>
                </div>
                <h2 className="section-title">
                  {gift.reasons.length} Reasons Why You're Special
                </h2>
              </div>

              <div className="reasons-display-grid">
                {gift.reasons.map((r) => (
                  <div key={r.id} className="reason-display-card paper-card">
                    <div className="reason-num-bubble">{r.number}</div>
                    <div>
                      <h4 className="reason-card-title">{r.title}</h4>
                      <p className="reason-card-desc">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Interactive Surprise Envelope Reveal */}
        {gift.surprise && (gift.surprise.giftVoucher || gift.surprise.message) && (
          <section className="section gift-surprise-section">
            <div className="container">
              <div className="surprise-stage-wrapper paper-card">
                {!envelopeOpened ? (
                  <div className="envelope-closed-view" onClick={handleOpenEnvelope}>
                    <div className="wax-envelope-visual">
                      <div className="flap-poly" />
                      <div className="wax-seal-center">
                        <Lock size={18} color="#FFFDF9" />
                      </div>
                    </div>
                    <h3 className="surprise-prompt-heading">A Sealed Rakhi Promise</h3>
                    <p className="surprise-prompt-text">
                      Click to break the seal and reveal {gift.senderName}'s secret surprise!
                    </p>
                    <button type="button" className="btn btn-gold btn-md">
                      <Unlock size={16} />
                      <span>Break Seal & Open</span>
                    </button>
                  </div>
                ) : (
                  <div className="envelope-opened-view animate-fade-in-up">
                    <div className="gift-voucher-card">
                      <div className="voucher-gold-tag">
                        <Award size={16} />
                        <span>{gift.surprise.badge || 'A Little Surprise For You'}</span>
                      </div>
                      <h3 className="voucher-main-title">
                        {gift.surprise.title || 'One Last Promise...'}
                      </h3>
                      {gift.surprise.message && (
                        <p className="voucher-custom-msg">{gift.surprise.message}</p>
                      )}
                      {gift.surprise.giftVoucher && (
                        <div className="voucher-code-highlight">
                          <span>{gift.surprise.giftVoucher}</span>
                        </div>
                      )}
                      {gift.surprise.giftNote && (
                        <p className="voucher-sub-note">{gift.surprise.giftNote}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* QR Code Modal Dialog */}
      {qrModalOpen && (
        <div className="qr-modal-backdrop" onClick={() => setQrModalOpen(false)}>
          <div className="qr-modal-card paper-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="qr-modal-title">Shareable QR Code Card</h3>
            <p className="qr-modal-sub">
              Scan this code on any phone to open {gift.recipientName}'s memory gift!
            </p>
            <div className="qr-modal-img-wrap">
              <img src={qrDataUrl} alt="Gift QR Code" className="qr-modal-img" />
            </div>
            <div className="qr-modal-actions">
              <a
                href={qrDataUrl}
                download={`rakhi-gift-${gift.slug}.png`}
                className="btn btn-gold btn-sm"
              >
                Download QR Image
              </a>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setQrModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style>{`
        .public-gift-root {
          min-height: 100vh;
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }

        .gift-hero-section {
          padding-top: calc(var(--header-height) + 3rem);
          padding-bottom: var(--space-8);
          text-align: center;
        }

        .gift-hero-container {
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .gift-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          padding: 4px 14px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--color-rakhi-red);
          margin-bottom: var(--space-4);
        }

        .gift-hero-title {
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          margin-bottom: var(--space-4);
        }

        .gift-hero-sub {
          font-size: var(--text-base);
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: var(--space-6);
        }

        .gift-hero-share-bar {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        /* Letter Box */
        .letter-container {
          max-width: 760px;
          margin: 0 auto;
          padding: clamp(2rem, 5vw, 3.5rem);
          position: relative;
          box-shadow: var(--shadow-md);
        }

        .letter-wax-seal {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #C23838, #8F181B 70%, #5E0D0F 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(143, 24, 27, 0.4);
          border: 1px solid #701316;
          font-size: 16px;
        }

        .letter-salutation {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: var(--space-4);
          color: var(--text-primary);
        }

        .letter-body-text {
          font-size: 1.15rem;
          line-height: 1.85;
          color: var(--text-primary);
          margin-bottom: var(--space-8);
        }

        .letter-footer-block {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          border-top: 1px dashed var(--border-default);
          padding-top: var(--space-4);
        }

        .letter-signoff-line {
          font-size: var(--text-sm);
          font-style: italic;
          color: var(--text-secondary);
        }

        .letter-sender-name {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          color: var(--color-rakhi-red);
          font-weight: 700;
        }

        /* Reasons Grid */
        .reasons-display-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-5);
          max-width: 860px;
          margin: 0 auto;
        }

        .reason-display-card {
          display: flex;
          gap: var(--space-4);
          padding: var(--space-6);
        }

        .reason-num-bubble {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-rakhi-light);
          color: var(--color-rakhi-red);
          font-weight: 700;
          font-size: var(--text-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .reason-card-title {
          font-size: 1.15rem;
          margin-bottom: 4px;
        }

        .reason-card-desc {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Surprise Section */
        .surprise-stage-wrapper {
          max-width: 680px;
          margin: 0 auto;
          padding: clamp(2rem, 5vw, 3.5rem);
          text-align: center;
        }

        .envelope-closed-view {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .wax-envelope-visual {
          width: 140px;
          height: 96px;
          background: linear-gradient(135deg, #E6DCCD 0%, #DFD2C2 100%);
          border: 2px solid #C8B9A6;
          border-radius: var(--radius-md);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-4);
          box-shadow: var(--shadow-md);
        }

        .flap-poly {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 0;
          border-left: 70px solid transparent;
          border-right: 70px solid transparent;
          border-top: 50px solid #D6C7B3;
        }

        .wax-seal-center {
          position: relative;
          z-index: 2;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #C23838, #8F181B 70%, #5E0D0F 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(143, 24, 27, 0.4);
          border: 1px solid #701316;
        }

        .surprise-prompt-heading {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .surprise-prompt-text {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-5);
        }

        .gift-voucher-card {
          background: linear-gradient(135deg, #FAF4E8 0%, #FFFDF9 100%);
          border: 2px solid var(--color-gold);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          box-shadow: var(--shadow-md);
        }

        .voucher-gold-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--color-gold);
          color: #FFFFFF;
          font-size: var(--text-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 14px;
          border-radius: var(--radius-full);
          margin-bottom: var(--space-4);
        }

        .voucher-main-title {
          font-size: 1.6rem;
          margin-bottom: var(--space-3);
        }

        .voucher-custom-msg {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: var(--space-5);
        }

        .voucher-code-highlight {
          background: #FFFFFF;
          border: 1px dashed var(--color-gold);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          font-family: monospace;
          font-weight: 700;
          font-size: var(--text-sm);
          color: var(--color-rakhi-red);
          margin-bottom: var(--space-3);
        }

        .voucher-sub-note {
          font-size: var(--text-xs);
          color: var(--text-muted);
          font-style: italic;
        }

        /* QR Modal */
        .qr-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(28, 25, 23, 0.75);
          backdrop-filter: blur(8px);
          z-index: var(--z-modal-backdrop);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
        }

        .qr-modal-card {
          max-width: 440px;
          width: 100%;
          padding: var(--space-8);
          text-align: center;
          box-shadow: var(--shadow-xl);
        }

        .qr-modal-title {
          font-size: 1.4rem;
          margin-bottom: var(--space-2);
        }

        .qr-modal-sub {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }

        .qr-modal-img-wrap {
          background: #FFFFFF;
          padding: var(--space-3);
          border-radius: var(--radius-md);
          display: inline-block;
          margin-bottom: var(--space-6);
          border: 1px solid var(--border-default);
        }

        .qr-modal-img {
          width: 200px;
          height: 200px;
        }

        .qr-modal-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
        }

        /* Loading & Error States */
        .gift-page-loading,
        .gift-page-error {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-primary);
        }

        .loading-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-8);
          text-align: center;
        }

        .loading-emblem {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--color-rakhi-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-4);
        }

        .loading-title {
          font-size: 1.75rem;
          margin-bottom: var(--space-2);
        }

        .loading-sub {
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .error-container {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-12) var(--space-4);
        }

        .error-card {
          text-align: center;
          padding: var(--space-10);
          max-width: 520px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .error-title {
          font-size: 1.8rem;
          margin-top: var(--space-4);
          margin-bottom: var(--space-2);
        }

        .error-desc {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }

        .error-actions {
          display: flex;
          gap: var(--space-4);
        }

        @media (max-width: 768px) {
          .reasons-display-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PublicGiftPage;
