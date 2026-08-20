import React from 'react';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import Button from '../common/Button';
import MemoryWall from '../memory-wall/MemoryWall';
import { mockGift } from '../../data/mockGift';

export const MemoryWallShowcase = () => {
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
        </div>

        {/* 3D Memory Wall Component */}
        <div className="showcase-wall-container">
          <MemoryWall gift={mockGift} />
        </div>

        {/* Showcase Bottom Banner */}
        <div className="showcase-footer">
          <div className="showcase-caption">
            <Heart size={16} className="caption-heart" />
            <span>Shown: Demo memory keepsake for Aarav created by Ananya</span>
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
