import React from 'react';
import { Sparkles, Image, Heart, Gift, Share2, QrCode, Palette } from 'lucide-react';
import { featureHighlights } from '../../data/features';

export const FeatureHighlights = () => {
  const iconMap = {
    Image: <Image size={24} color="var(--color-rakhi-red)" />,
    Heart: <Heart size={24} color="var(--color-wine)" />,
    Sparkles: <Sparkles size={24} color="var(--color-gold)" />,
    Gift: <Gift size={24} color="var(--color-rakhi-red)" />,
    Share2: <Share2 size={24} color="var(--color-coral)" />,
    QrCode: <QrCode size={24} color="var(--color-gold)" />
  };

  return (
    <section id="features" className="section features-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={13} />
            <span>Crafted Details</span>
          </div>
          <h2 className="section-title">
            Designed for genuine <span className="title-serif-accent">emotional resonance.</span>
          </h2>
          <p className="section-subtitle">
            Every feature is intentional. No generic SaaS widgets or unnecessary clutter — only elements that deepen the celebration.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="features-grid">
          {featureHighlights.map((feat) => (
            <div key={feat.id} className="feature-card card">
              <div className="feature-icon-wrapper">
                {iconMap[feat.iconName] || <Sparkles size={24} />}
              </div>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-description">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .features-section {
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-6);
        }

        .feature-card {
          padding: var(--space-8);
          background: var(--bg-primary);
          border: 1px solid var(--border-default);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
        }

        .feature-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--border-gold);
          background: #FFFFFF;
        }

        .feature-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-5);
          box-shadow: var(--shadow-xs);
        }

        .feature-title {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .feature-description {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 960px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default FeatureHighlights;
