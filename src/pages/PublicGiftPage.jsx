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
import GiftHeader from '../components/gift/GiftHeader';
import GiftFooter from '../components/gift/GiftFooter';
import GiftHero from '../components/gift/GiftHero';
import RakhiMessage from '../components/gift/RakhiMessage';
import WhySpecial from '../components/gift/WhySpecial';
import MemoryTimeline from '../components/gift/MemoryTimeline';
import SiblingFun from '../components/gift/SiblingFun';
import SurpriseReveal from '../components/gift/SurpriseReveal';
import FinalWish from '../components/gift/FinalWish';
import KeepsakeShare from '../components/gift/KeepsakeShare';
import { getPublicGift, trackEvent } from '../services/api';
import { useGiftTheme } from '../hooks/useGiftTheme';

export const PublicGiftPage = () => {
  const { slug } = useParams();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const { themeId, cssVariables } = useGiftTheme(gift?.theme);

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
        <GiftHeader gift={gift} plan="PREMIUM" />
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
        <GiftHeader gift={gift} plan="PREMIUM" />
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

  return (
    <div
      className="public-gift-root"
      data-theme={themeId}
      style={cssVariables}
    >
      <GiftHeader gift={gift} plan={gift.plan} />

      <main className="gift-main">
        {/* Recipient Hero Opening */}
        <GiftHero
          gift={gift}
          plan={gift.plan}
          onOpenQrModal={() => setQrModalOpen(true)}
          onCopyLink={handleCopyLink}
          copied={copied}
        />

        {/* 3D Connected Memory Wall */}
        <section id="memory-wall" className="section gift-wall-section">
          <div className="container-wide">
            <MemoryWall gift={gift} plan={gift.plan} theme={themeId} />
          </div>
        </section>

        {/* Heartfelt Rakhi Letter */}
        <RakhiMessage gift={gift} plan={gift.plan} />

        {/* Why You're Special (Package Gated — Premium & Deluxe only) */}
        <WhySpecial gift={gift} plan={gift.plan} />

        {/* Memory Timeline (Package Gated — Premium & Deluxe only) */}
        <MemoryTimeline gift={gift} plan={gift.plan} />

        {/* Sibling Fun / Inside Jokes (Package Gated — Premium & Deluxe only) */}
        <SiblingFun gift={gift} plan={gift.plan} />

        {/* Interactive Surprise Envelope Reveal */}
        <SurpriseReveal
          gift={gift}
          plan={gift.plan}
          onReveal={() => trackEvent('surprise_revealed', { slug, giftId: gift?.id })}
        />

        {/* Final Rakhi Wish & Blessing */}
        <FinalWish gift={gift} plan={gift.plan} />

        {/* Final Share & Permanent Keepsake QR Card */}
        <KeepsakeShare
          gift={gift}
          plan={gift.plan}
          qrDataUrl={qrDataUrl}
          onOpenQrModal={() => setQrModalOpen(true)}
          onCopyLink={handleCopyLink}
          copied={copied}
        />
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

      <GiftFooter gift={gift} plan={gift.plan} />

      <style>{`
        .public-gift-root {
          min-height: 100vh;
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }

        .gift-wall-section {
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: var(--space-20, 4rem);
          padding-bottom: var(--space-10, 2.5rem);
          position: relative;
        }

        /* Surprise Section */
        .surprise-stage-wrapper {
          max-width: 680px;
          margin: 0 auto;
          padding: clamp(2rem, 5vw, 3.5rem);
          text-align: center;
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
