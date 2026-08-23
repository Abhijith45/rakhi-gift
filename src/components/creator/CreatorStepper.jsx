import React from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';
import { getCreatorSteps, STEP_IDS } from '../../config/stepConfig.js';
import { getPlanConfig } from '../../config/planConfig.js';

export const CreatorStepper = ({
  currentStepId,
  planKey = 'PREMIUM',
  onStepClick
}) => {
  const steps = getCreatorSteps(planKey);
  const plan = getPlanConfig(planKey);
  const currentStep = steps.find((s) => s.id === currentStepId) || steps[0];

  // Exclude system states (PAYMENT & SUCCESS) from progress indicator bar calculation
  const isEditingStep = currentStepId !== STEP_IDS.PAYMENT && currentStepId !== STEP_IDS.SUCCESS;
  if (!isEditingStep) return null;

  const currentStepIndex = currentStep.stepIndex;
  const totalVisibleSteps = currentStep.totalVisibleSteps;
  const progressPercent = Math.min(100, Math.max(10, (currentStepIndex / totalVisibleSteps) * 100));

  return (
    <div className="creator-stepper-header">
      <div className="container stepper-inner">
        <div className="stepper-meta">
          <div className="stepper-pill-row">
            <span className="step-pill">
              Step {currentStepIndex} of {totalVisibleSteps}
            </span>
            <span className="plan-badge-pill">
              {plan.name} ({plan.formattedPrice})
            </span>
          </div>

          <h2 className="step-heading">{currentStep.heading}</h2>
          <p className="step-subheading">{currentStep.subheading}</p>
        </div>

        {/* Responsive Stepper Dots / Track */}
        <div className="stepper-track-wrapper">
          <div className="stepper-track">
            <div className="stepper-progress-bar" style={{ width: `${progressPercent}%` }} />
          </div>

          {/* Mobile-Friendly Compact Step Pills */}
          <div className="stepper-pills-nav" role="tablist" aria-label="Wizard Steps">
            {steps
              .filter((s) => s.id !== STEP_IDS.PAYMENT && s.id !== STEP_IDS.SUCCESS)
              .map((step) => {
                const isActive = step.id === currentStepId;
                const isPast = step.stepIndex < currentStepIndex;

                return (
                  <button
                    key={step.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`stepper-dot-btn ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                    onClick={() => isPast && onStepClick && onStepClick(step.id)}
                    disabled={!isPast && !isActive}
                    title={step.title}
                  >
                    <span className="dot-num">
                      {isPast ? <CheckCircle size={12} /> : step.stepIndex}
                    </span>
                    <span className="dot-label">{step.shortLabel}</span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      <style>{`
        .creator-stepper-header {
          background: #FFFDF9;
          border-bottom: 1px solid var(--border-light, #EFE6D8);
          padding: 1.25rem 0 1rem 0;
          position: sticky;
          top: var(--header-height, 60px);
          z-index: 20;
          box-shadow: 0 4px 12px rgba(45, 30, 15, 0.04);
        }

        .stepper-inner {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .stepper-meta {
          text-align: left;
        }

        .stepper-pill-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .step-pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          background: rgba(155, 34, 38, 0.08);
          color: var(--color-rakhi-red, #9B2226);
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .plan-badge-pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          background: rgba(198, 146, 52, 0.12);
          color: #7A5813;
          border: 1px solid rgba(198, 146, 52, 0.3);
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .step-heading {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: clamp(1.15rem, 2.2vw, 1.6rem);
          font-weight: 700;
          color: var(--text-primary, #1E1B18);
          margin: 0 0 2px 0;
        }

        .step-subheading {
          font-size: var(--text-xs, 0.8rem);
          color: var(--text-secondary, #59524C);
          margin: 0;
        }

        .stepper-track-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stepper-track {
          width: 100%;
          height: 5px;
          background: #EFE6D8;
          border-radius: 9999px;
          overflow: hidden;
        }

        .stepper-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--color-rakhi-red, #9B2226), var(--color-gold, #C69234));
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .stepper-pills-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 2px;
        }

        .stepper-pills-nav::-webkit-scrollbar {
          display: none;
        }

        .stepper-dot-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 9999px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary, #59524C);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          min-height: 36px;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .stepper-dot-btn.past {
          color: var(--color-rakhi-red, #9B2226);
          background: rgba(155, 34, 38, 0.05);
        }

        .stepper-dot-btn.active {
          background: #FFFDF9;
          border-color: var(--color-rakhi-red, #9B2226);
          color: var(--text-primary, #1E1B18);
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(45, 30, 15, 0.08);
        }

        .dot-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #EFE6D8;
          font-size: 10.5px;
          font-weight: 700;
        }

        .stepper-dot-btn.active .dot-num {
          background: var(--color-rakhi-red, #9B2226);
          color: #FFF;
        }

        .stepper-dot-btn.past .dot-num {
          background: rgba(155, 34, 38, 0.15);
          color: var(--color-rakhi-red, #9B2226);
        }

        @media (max-width: 480px) {
          .dot-label {
            font-size: 11px;
          }
          .stepper-dot-btn {
            padding: 3px 8px;
            min-height: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default CreatorStepper;
