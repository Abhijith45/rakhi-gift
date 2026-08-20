import React from 'react';
import { Sparkles, UploadCloud, Palette, Gift, CheckCircle2 } from 'lucide-react';
import { howItWorksSteps } from '../../data/features';

export const HowItWorks = () => {
  const stepIcons = [
    <UploadCloud size={24} color="var(--color-rakhi-red)" />,
    <Palette size={24} color="var(--color-gold)" />,
    <Gift size={24} color="var(--color-wine)" />
  ];

  return (
    <section id="how-it-works" className="section how-it-works-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={13} />
            <span>Effortless Creation</span>
          </div>
          <h2 className="section-title">
            How it works in <span className="title-serif-accent">three simple steps.</span>
          </h2>
          <p className="section-subtitle">
            No complicated apps or accounts. Create a bespoke digital memory gift in under 5 minutes.
          </p>
        </div>

        {/* 3 Step Editorial Cards */}
        <div className="steps-grid">
          {howItWorksSteps.map((item, index) => (
            <div key={item.step} className="step-card paper-card">
              {/* Step Number Badge */}
              <div className="step-header">
                <span className="step-number">{item.step}</span>
                <div className="step-icon-badge">
                  {stepIcons[index]}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="step-title">{item.title}</h3>
              <p className="step-description">{item.description}</p>

              {/* Feature Pill */}
              <div className="step-footer">
                <CheckCircle2 size={15} className="step-check" />
                <span>{item.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .how-it-works-section {
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-8);
          position: relative;
        }

        .step-card {
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
        }

        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .step-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-6);
        }

        .step-number {
          font-family: var(--font-serif);
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--color-rakhi-red);
          line-height: 1;
          opacity: 0.85;
        }

        .step-icon-badge {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--bg-primary);
          border: 1px solid var(--border-default);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-xs);
        }

        .step-title {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          color: var(--text-primary);
          margin-bottom: var(--space-3);
        }

        .step-description {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: var(--space-6);
          flex-grow: 1;
        }

        .step-footer {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-primary);
          padding-top: var(--space-4);
          border-top: 1px dashed var(--border-default);
        }

        .step-check {
          color: var(--color-gold);
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .steps-grid {
            grid-template-columns: 1fr;
            gap: var(--space-6);
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
