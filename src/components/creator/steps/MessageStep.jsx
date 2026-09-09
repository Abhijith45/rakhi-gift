import React from 'react';
import { Feather } from 'lucide-react';
import CreatorNavigation from '../CreatorNavigation.jsx';

/**
 * Step 4: Heartfelt Rakhi Letter & Inspiration Prompts
 */
export const MessageStep = ({
  builderData,
  updateBuilderData,
  activePlanConfig,
  onBack,
  onNext,
  loading
}) => {
  const prompts = [
    "Thank you for always having my back no matter what.",
    "From fighting over the TV remote to celebrating every big milestone together...",
    "No matter how far apart we are, our bond remains unbreakable.",
    "Wishing you all the joy, health, and laughter in the world this Raksha Bandhan."
  ];

  return (
    <div className="creator-step-card paper-card animate-fade-in">
      <div className="step-badge-pill">
        <Feather size={13} />
        <span>Step 4 • Sacred Rakhi Letter</span>
      </div>

      <h3 className="card-title">Write Your Heartfelt Rakhi Letter</h3>
      <p className="card-subtitle">
        An intimate editorial letter that opens with an interactive wax seal on your sister's gift page.
      </p>

      {/* Inspiration Prompt Chips */}
      <div className="letter-prompts-section">
        <span className="prompts-label">✨ Click an idea to add inspiration:</span>
        <div className="prompt-chips-wrapper">
          {prompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              type="button"
              className="prompt-chip"
              onClick={() => {
                const current = (builderData.message || '').trim();
                const updated = current ? `${current}\n\n${prompt}` : prompt;
                if (updated.length <= 1200) {
                  updateBuilderData({ message: updated });
                }
              }}
            >
              "{prompt.slice(0, 42)}..."
            </button>
          ))}
        </div>
      </div>

      <div className="form-group letter-textarea-group">
        <label className="form-label">
          <span>Message for {builderData.recipientNickname || builderData.recipientName || 'Sister'}</span>
          <span className={`char-counter-pill ${(builderData.message || '').length > 1100 ? 'warning' : ''}`}>
            {(builderData.message || '').length} / 1200 chars
          </span>
        </label>
        <div className="textarea-wrapper">
          <textarea
            className="form-textarea letter-textarea"
            rows={7}
            value={builderData.message || ''}
            onChange={(e) => updateBuilderData({ message: e.target.value })}
            maxLength={1200}
            placeholder="Write what you want her to know — your favorite memories together, heartfelt gratitude, or a warm Rakhi blessing..."
          />
        </div>
      </div>

      <CreatorNavigation
        onBack={onBack}
        onNext={onNext}
        nextText={activePlanConfig?.reasons ? "Continue to Personalize" : "Continue to Theme"}
        loading={loading}
      />
    </div>
  );
};

export default MessageStep;
