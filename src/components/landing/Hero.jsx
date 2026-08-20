import React from 'react';
import { Sparkles, ArrowRight, Heart, Shield, QrCode } from 'lucide-react';
import Button from '../common/Button';
import { mockGift } from '../../data/mockGift';

export const Hero = () => {
  return (
    <section className="hero-section">
      {/* Ambient Warm Gradient Backdrop */}
      <div className="hero-backdrop" />

      <div className="container hero-container">
        {/* Editorial Pill */}
        <div className="hero-pill-badge">
          <span className="pill-dot" />
          <Sparkles size={14} className="pill-icon" />
          <span>A Personalized Digital Raksha Bandhan Keepsake</span>
        </div>

        {/* Main Emotional Headline */}
        <h1 className="hero-title">
          Turn your memories into a <span className="title-serif-accent">Rakhi gift.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="hero-subtitle">
          Celebrate your sibling bond with a tactile digital memory wall, connected by sacred thread, 
          filled with your personal photos, heartfelt letters, and a surprise reveal they will cherish forever.
        </p>

        {/* Dual CTAs */}
        <div className="hero-cta-group btn-group-mobile-stack">
          <Button
            href="/create"
            variant="primary"
            size="lg"
            icon={<ArrowRight size={18} />}
            iconPosition="right"
          >
            Create Your Memory Gift
          </Button>

          <Button
            href="#memory-wall"
            variant="secondary"
            size="lg"
            icon={<Heart size={18} color="var(--color-rakhi-red)" />}
          >
            See How It Feels
          </Button>
        </div>

        {/* Quick Highlights / Trust Badges */}
        <div className="hero-trust-bar">
          <div className="trust-item">
            <span className="trust-icon-circle">
              <Sparkles size={13} color="var(--color-gold)" />
            </span>
            <span>3D Connected Thread Wall</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-icon-circle">
              <QrCode size={13} color="var(--color-rakhi-red)" />
            </span>
            <span>Instant Share Link & QR Card</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-icon-circle">
              <Shield size={13} color="var(--color-wine)" />
            </span>
            <span>No App Download Needed</span>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          padding-top: calc(var(--header-height) + 3.5rem);
          padding-bottom: clamp(3rem, 6vw, 5.5rem);
          text-align: center;
          overflow: hidden;
          background: linear-gradient(180deg, #FAF7F2 0%, #F5EFEB 100%);
        }

        .hero-backdrop {
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 600px;
          background: radial-gradient(circle, rgba(235, 214, 185, 0.4) 0%, rgba(250, 247, 242, 0) 70%);
          pointer-events: none;
          z-index: 0;
        }

        .hero-container {
          position: relative;
          z-index: 1;
          max-width: 880px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: 6px 16px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--color-rakhi-red);
          box-shadow: var(--shadow-sm);
          margin-bottom: var(--space-6);
        }

        .pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--color-gold);
        }

        .pill-icon {
          color: var(--color-gold);
        }

        .hero-title {
          margin-bottom: var(--space-5);
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .title-serif-accent {
          font-style: italic;
          color: var(--color-rakhi-red);
          position: relative;
        }

        .hero-subtitle {
          font-size: clamp(1.05rem, 2vw, 1.25rem);
          line-height: 1.65;
          color: var(--text-secondary);
          max-width: 720px;
          margin-bottom: var(--space-8);
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-10);
        }

        .hero-trust-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: var(--space-4);
          padding: var(--space-3) var(--space-6);
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          color: var(--text-secondary);
          font-weight: 500;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .trust-icon-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--bg-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trust-divider {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--border-strong);
        }

        @media (max-width: 640px) {
          .hero-trust-bar {
            flex-direction: column;
            border-radius: var(--radius-lg);
            width: 100%;
            gap: var(--space-3);
          }
          .trust-divider {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
