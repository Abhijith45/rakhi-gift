import React from 'react';
import { ArrowLeft, ArrowRight, Save, Sparkles } from 'lucide-react';
import Button from '../common/Button.jsx';

export const CreatorNavigation = ({
  onBack,
  onNext,
  isFirstStep = false,
  isLastStep = false,
  loading = false,
  nextText = 'Continue',
  backText = 'Back'
}) => {
  return (
    <div className="creator-navigation-root">
      <div className="container navigation-inner">
        {!isFirstStep ? (
          <Button
            variant="secondary"
            size="md"
            onClick={onBack}
            disabled={loading}
            icon={<ArrowLeft size={16} />}
          >
            {backText}
          </Button>
        ) : (
          <div />
        )}

        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={loading}
          icon={isLastStep ? <Sparkles size={16} /> : <ArrowRight size={16} />}
          iconPosition="right"
        >
          {loading ? 'Saving...' : nextText}
        </Button>
      </div>

      <style>{`
        .creator-navigation-root {
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-light, #EFE6D8);
        }

        .navigation-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        @media (max-width: 640px) {
          .creator-navigation-root {
            position: sticky;
            bottom: 0;
            left: 0;
            right: 0;
            background: #FFFDF9;
            box-shadow: 0 -4px 16px rgba(45, 30, 15, 0.08);
            padding: 12px 1rem;
            padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
            z-index: 15;
            margin-top: 1.5rem;
            border-top: 1px solid var(--border-light, #EFE6D8);
          }
        }
      `}</style>
    </div>
  );
};

export default CreatorNavigation;
