import React from 'react';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import Button from '../common/Button';

export const FinalCTA = () => {
  return (
    <section className="section final-cta-section">
      {/* Warm Ambient Glow Backdrop */}
      <div className="final-cta-backdrop" />

      <div className="container final-cta-container">
        {/* Sacred Thread Decorative Top Accent */}
        <div className="cta-thread-emblem">
          <div className="cta-thread-line" />
          <div className="cta-thread-center">
            <Heart size={16} className="cta-thread-heart" />
          </div>
          <div className="cta-thread-line" />
        </div>

        {/* Climax Headline */}
        <h2 className="final-cta-title">
          Some memories deserve more than a <span className="title-serif-accent">photo gallery.</span>
        </h2>

        {/* Emotional Subtitle */}
        <p className="final-cta-subtitle">
          Turn your favorite sibling moments into a living, tactile keepsake they will treasure, smile at, and return to for years to come.
        </p>

        {/* Primary Action Button */}
        <div className="final-cta-action">
          <Button
            href="/create"
            variant="gold"
            size="lg"
            icon={<ArrowRight size={18} />}
            iconPosition="right"
          >
            Create Your Rakhi Gift
          </Button>
        </div>

        <p className="final-cta-foot-note">
          Instant creation &bull; No app download &bull; 100% private
        </p>
      </div>

      <style>{`
        .final-cta-section {
          position: relative;
          background: linear-gradient(180deg, #FAF7F2 0%, #F3ECE1 100%);
          text-align: center;
          overflow: hidden;
          padding-top: clamp(5rem, 10vw, 8rem);
          padding-bottom: clamp(5rem, 10vw, 8rem);
        }

        .final-cta-backdrop {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 500px;
          background: radial-gradient(circle, rgba(198, 146, 52, 0.14) 0%, rgba(250, 247, 242, 0) 70%);
          pointer-events: none;
        }

        .final-cta-container {
          position: relative;
          z-index: 1;
          max-width: 760px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cta-thread-emblem {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
          width: 100%;
          max-width: 320px;
        }

        .cta-thread-line {
          flex-grow: 1;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--color-rakhi-red), transparent);
        }

        .cta-thread-center {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: 1px solid var(--border-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }

        .cta-thread-heart {
          color: var(--color-rakhi-red);
          fill: var(--color-rakhi-red);
        }

        .final-cta-title {
          margin-bottom: var(--space-4);
          color: var(--text-primary);
        }

        .final-cta-subtitle {
          font-size: clamp(1.05rem, 2vw, 1.2rem);
          line-height: 1.65;
          color: var(--text-secondary);
          max-width: 620px;
          margin-bottom: var(--space-8);
        }

        .final-cta-action {
          margin-bottom: var(--space-4);
        }

        .final-cta-foot-note {
          font-size: var(--text-xs);
          color: var(--text-muted);
          font-weight: 500;
        }
      `}</style>
    </section>
  );
};

export default FinalCTA;
