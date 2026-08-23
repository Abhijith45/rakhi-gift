import React, { useState } from 'react';
import { Sparkles, ArrowRight, Heart, Award, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';
import MemoryWall from '../memory-wall/MemoryWall';
import { mockGift } from '../../data/mockGift';

export const MemoryWallShowcase = () => {
  const [activePlan, setActivePlan] = useState('PREMIUM');

  return (
    <section id="memory-wall" className="section showcase-section">
      <div className="container-wide">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={13} />
            <span>The Signature Experience</span>
          </div>
          <h2 className="section-title">
            Your memories, <span className="title-serif-accent">beautifully connected.</span>
          </h2>
          <p className="section-subtitle">
            Every photo becomes part of a tactile, interconnected story. Mounted with gold pins and woven together with sacred thread on a warm dimensional canvas.
          </p>

          {/* Interactive Tier Switcher Tabs */}
          <div className="showcase-plan-tabs" role="tablist" aria-label="Select memory wall tier">
            <button
              type="button"
              role="tab"
              aria-selected={activePlan === 'BASIC'}
              className={`plan-tab-btn ${activePlan === 'BASIC' ? 'active' : ''}`}
              onClick={() => setActivePlan('BASIC')}
            >
              <span className="tab-name">Basic Keepsake</span>
              <span className="tab-price">₹99 · 4 Photos</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activePlan === 'PREMIUM'}
              className={`plan-tab-btn ${activePlan === 'PREMIUM' ? 'active' : ''}`}
              onClick={() => setActivePlan('PREMIUM')}
            >
              <span className="tab-badge-popular">Most Loved</span>
              <span className="tab-name">Premium Wall</span>
              <span className="tab-price">₹249 · 8 Photos</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activePlan === 'DELUXE'}
              className={`plan-tab-btn ${activePlan === 'DELUXE' ? 'active' : ''}`}
              onClick={() => setActivePlan('DELUXE')}
            >
              <span className="tab-badge-deluxe">
                <Award size={10} /> Deluxe
              </span>
              <span className="tab-name">Keepsake Hamper</span>
              <span className="tab-price">₹449 · Handcrafted</span>
            </button>
          </div>
        </div>

        {/* 2.5D Physical Memory Wall Component */}
        <div className="showcase-wall-container">
          <MemoryWall gift={mockGift} plan={activePlan} />
        </div>

        {/* Showcase Bottom Banner */}
        <div className="showcase-footer">
          <div className="showcase-caption">
            <Heart size={16} className="caption-heart" />
            <span>
              Previewing: <strong>{activePlan === 'BASIC' ? 'Basic (4 Photos)' : activePlan === 'DELUXE' ? 'Deluxe Keepsake Wall' : 'Premium (8 Photos)'}</strong> for Aarav by Ananya
            </span>
          </div>
          <Button
            href="/create"
            variant="gold"
            size="md"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
          >
            Create My Memory
          </Button>
        </div>
      </div>

      <style>{`
        .showcase-section {
          background-color: var(--bg-primary);
          padding-top: var(--space-8);
        }

        .showcase-plan-tabs {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          background: #EFE6D8;
          padding: 5px;
          border-radius: var(--radius-full);
          margin-top: var(--space-4);
          margin-bottom: var(--space-2);
          border: 1px solid var(--border-default);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
        }

        .plan-tab-btn {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 18px;
          border-radius: var(--radius-full);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          color: var(--text-secondary);
        }

        .plan-tab-btn:hover {
          color: var(--text-primary);
        }

        .plan-tab-btn.active {
          background: #FFFDF9;
          color: var(--text-primary);
          box-shadow: 0 3px 10px rgba(50, 35, 15, 0.12), 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        .tab-name {
          font-weight: 700;
          font-size: var(--text-xs);
          letter-spacing: -0.01em;
        }

        .tab-price {
          font-size: 11px;
          opacity: 0.8;
          font-weight: 500;
        }

        .tab-badge-popular {
          position: absolute;
          top: -9px;
          background: var(--color-rakhi-red);
          color: #FFF;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: var(--radius-full);
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .tab-badge-deluxe {
          position: absolute;
          top: -9px;
          background: linear-gradient(135deg, #B58428 0%, #7D550A 100%);
          color: #FFF;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: var(--radius-full);
          display: inline-flex;
          align-items: center;
          gap: 3px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .showcase-wall-container {
          margin-bottom: var(--space-8);
        }

        .showcase-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-6);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .showcase-caption {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .caption-heart {
          color: var(--color-rakhi-red);
          fill: var(--color-rakhi-red);
        }

        @media (max-width: 768px) {
          .showcase-plan-tabs {
            flex-direction: column;
            border-radius: var(--radius-lg);
            width: 100%;
            padding: 6px;
          }
          .plan-tab-btn {
            width: 100%;
            border-radius: var(--radius-md);
            padding: 8px 12px;
          }
          .tab-badge-popular,
          .tab-badge-deluxe {
            position: static;
            margin-bottom: 2px;
          }
          .showcase-footer {
            flex-direction: column;
            gap: var(--space-4);
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
};

export default MemoryWallShowcase;
