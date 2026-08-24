import React from 'react';
import { Check, Sparkles, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { PLAN_CONFIG } from '../../config/planConfig.js';
import Button from '../common/Button.jsx';

export const PackageSelector = ({
  selectedPlan = 'PREMIUM',
  onSelectPlan,
  onContinue
}) => {
  const plans = [PLAN_CONFIG.BASIC, PLAN_CONFIG.PREMIUM, PLAN_CONFIG.DELUXE];

  return (
    <div className="package-selector-card paper-card animate-fade-in">
      <div className="package-selector-header">
        <h3 className="card-title">Choose How Special You'd Like to Make It</h3>
        <p className="card-subtitle">
          Select the package tier that best fits your memories. You can switch packages anytime during creation.
        </p>
      </div>

      <div className="package-cards-grid">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`package-card ${isSelected ? 'selected' : ''} plan-${plan.id.toLowerCase()}`}
              onClick={() => onSelectPlan && onSelectPlan(plan.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectPlan && onSelectPlan(plan.id)}
              aria-selected={isSelected}
            >
              {plan.badge && (
                <div className={`package-badge ${plan.id.toLowerCase()}-badge`}>
                  {plan.id === 'DELUXE' && <Award size={11} />}
                  <span>{plan.badge}</span>
                </div>
              )}

              <div className="package-card-top">
                <h4 className="package-name">{plan.name}</h4>
                <div className="package-price-wrap">
                  <span className="package-price">{plan.formattedPrice}</span>
                  <span className="price-term">one-time</span>
                </div>
                <p className="package-tagline">{plan.tagline}</p>
              </div>

              {/* Feature Entitlements Breakdown */}
              <ul className="package-features-list">
                <li className="feature-item">
                  <Check size={14} className="feature-check" />
                  <span>
                    Memory Wall (up to <strong>{plan.maxPhotos} photos</strong>)
                  </span>
                </li>

                <li className="feature-item">
                  <Check size={14} className="feature-check" />
                  <span>Personalized Rakhi letter</span>
                </li>

                <li className="feature-item">
                  <Check size={14} className="feature-check" />
                  <span>Sealed Surprise promise</span>
                </li>

                <li className={`feature-item ${!plan.captions ? 'disabled-feature' : ''}`}>
                  <Check size={14} className="feature-check" />
                  <span>Photo captions & custom dates</span>
                </li>

                <li className={`feature-item ${!plan.reasons ? 'disabled-feature' : ''}`}>
                  <Check size={14} className="feature-check" />
                  <span>Why You're Special list (3–5 items)</span>
                </li>

                <li className={`feature-item ${!plan.timeline ? 'disabled-feature' : ''}`}>
                  <Check size={14} className="feature-check" />
                  <span>Memory Timeline & Sibling Fun</span>
                </li>

                <li className="feature-item">
                  <Check size={14} className="feature-check" />
                  <span>
                    {plan.availableThemes.length === 1
                      ? 'Signature Warm Theme'
                      : 'All 4 Visual Themes'}
                  </span>
                </li>
              </ul>

              <div className="package-select-btn-wrap">
                <div className={`select-indicator ${isSelected ? 'active-indicator' : ''}`}>
                  {isSelected ? 'Selected Tier ✓' : 'Select Package'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="step-actions">
        <div />
        <Button
          variant="primary"
          size="md"
          onClick={onContinue}
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        >
          Continue to Memories
        </Button>
      </div>

      <style>{`
        .package-selector-card {
          width: 100%;
        }

        .package-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4, 1rem);
          margin: 1.5rem 0;
        }

        .package-card {
          position: relative;
          background: #FFFDF9;
          border: 2px solid var(--border-light, #EFE6D8);
          border-radius: var(--radius-xl, 16px);
          padding: 1.25rem 1rem 1rem 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          min-height: 440px;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }

        .package-card:hover {
          border-color: #D4AF37;
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -4px rgba(45, 30, 15, 0.1);
        }

        .package-card.selected {
          border-color: var(--color-rakhi-red, #9B2226);
          background: linear-gradient(180deg, #FFFDFB 0%, #FAF5EE 100%);
          box-shadow: 0 14px 28px -6px rgba(155, 34, 38, 0.16), 0 0 0 1px var(--color-rakhi-red, #9B2226);
        }

        .package-card.plan-deluxe.selected {
          border-color: #B58428;
          box-shadow: 0 14px 28px -6px rgba(181, 132, 40, 0.2), 0 0 0 1px #B58428;
        }

        .package-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-rakhi-red, #9B2226);
          color: #FFF;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 9999px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .deluxe-badge {
          background: linear-gradient(135deg, #B58428 0%, #7D550A 100%);
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .package-card-top {
          text-align: center;
          margin-bottom: 1rem;
        }

        .package-name {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary, #1E1B18);
          margin: 0 0 4px 0;
        }

        .package-price-wrap {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
          margin-bottom: 6px;
        }

        .package-price {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-rakhi-red, #9B2226);
        }

        .plan-deluxe .package-price {
          color: #8E1616;
        }

        .price-term {
          font-size: 0.75rem;
          color: var(--text-secondary, #59524C);
        }

        .package-tagline {
          font-size: 0.775rem;
          color: var(--text-secondary, #59524C);
          margin: 0;
          line-height: 1.35;
        }

        .package-features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.775rem;
          color: var(--text-primary, #1E1B18);
          line-height: 1.3;
        }

        .feature-check {
          color: #15803D;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .disabled-feature {
          opacity: 0.45;
          text-decoration: line-through;
        }

        .disabled-feature .feature-check {
          color: #9CA3AF;
        }

        .package-select-btn-wrap {
          margin-top: auto;
        }

        .select-indicator {
          width: 100%;
          padding: 10px;
          border-radius: var(--radius-md, 8px);
          background: #EFE6D8;
          color: var(--text-primary, #1E1B18);
          font-size: 0.825rem;
          font-weight: 700;
          text-align: center;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .package-card.selected .select-indicator {
          background: var(--color-rakhi-red, #9B2226);
          color: #FFF;
        }

        .package-card.plan-deluxe.selected .select-indicator {
          background: linear-gradient(135deg, #B58428 0%, #7D550A 100%);
          color: #FFF;
        }

        @media (max-width: 900px) {
          .package-cards-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .package-card {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default PackageSelector;
