import React from 'react';
import { User, Smile, Heart, Sparkles, Mail } from 'lucide-react';
import CreatorNavigation from '../CreatorNavigation.jsx';

/**
 * Step 1: Creator & Recipient Names and Contact Details
 */
export const DetailsStep = ({
  builderData,
  updateBuilderData,
  onNext,
  loading
}) => {
  return (
    <div className="creator-step-card paper-card animate-fade-in">
      <div className="step-badge-pill">
        <Sparkles size={13} />
        <span>Step 1 • Sibling Details</span>
      </div>

      <h3 className="card-title">Who is this heartfelt gift for?</h3>
      <p className="card-subtitle">
        Personalize who is giving and receiving this digital keepsake. These names are woven into the 3D memory wall, the sealed letter, and custom keepsake links.
      </p>

      <div className="form-grid">
        {/* Brother's Name */}
        <div className="form-group">
          <label className="form-label">
            <span>Brother's Name (Your Name) <span className="required-star">*</span></span>
          </label>
          <div className="input-wrapper">
            <User size={18} className="input-leading-icon" />
            <input
              type="text"
              className="form-input has-leading-icon"
              placeholder="e.g. Aarav"
              value={builderData.senderName}
              onChange={(e) => updateBuilderData({ senderName: e.target.value })}
              maxLength={32}
            />
          </div>
          <span className="input-helper-text">Appears on the gift letter sign-off & hero greeting</span>
        </div>

        {/* Brother's Nickname */}
        <div className="form-group">
          <label className="form-label">
            <span>Brother's Nickname</span>
            <span className="optional-pill">Optional</span>
          </label>
          <div className="input-wrapper">
            <Smile size={18} className="input-leading-icon" />
            <input
              type="text"
              className="form-input has-leading-icon"
              placeholder="e.g. Bhai, Bhaiya, Sonu"
              value={builderData.senderNickname}
              onChange={(e) => updateBuilderData({ senderNickname: e.target.value })}
              maxLength={24}
            />
          </div>
          <span className="input-helper-text">Used for playful moments & banter</span>
        </div>

        {/* Sister's Name */}
        <div className="form-group">
          <label className="form-label">
            <span>Sister's Name (Recipient) <span className="required-star">*</span></span>
          </label>
          <div className="input-wrapper">
            <Heart size={18} className="input-leading-icon icon-pink" />
            <input
              type="text"
              className="form-input has-leading-icon"
              placeholder="e.g. Ananya"
              value={builderData.recipientName}
              onChange={(e) => updateBuilderData({ recipientName: e.target.value })}
              maxLength={32}
            />
          </div>
          <span className="input-helper-text">Primary name displayed on the 3D wall & wax seal</span>
        </div>

        {/* Sister's Nickname */}
        <div className="form-group">
          <label className="form-label">
            <span>Sister's Nickname</span>
            <span className="optional-pill">Optional</span>
          </label>
          <div className="input-wrapper">
            <Sparkles size={18} className="input-leading-icon icon-gold" />
            <input
              type="text"
              className="form-input has-leading-icon"
              placeholder="e.g. Chhoti, Golu, Didi"
              value={builderData.recipientNickname}
              onChange={(e) => updateBuilderData({ recipientNickname: e.target.value })}
              maxLength={24}
            />
          </div>
          <span className="input-helper-text">Affectionate name for the letter salutation</span>
        </div>

        {/* Email for Receipt & Backup */}
        <div className="form-group full-width">
          <label className="form-label">
            <span>Your Email for Receipt & Link Backup</span>
            <span className="optional-pill">Recommended</span>
          </label>
          <div className="input-wrapper">
            <Mail size={18} className="input-leading-icon" />
            <input
              type="email"
              className="form-input has-leading-icon"
              placeholder="e.g. aarav@gmail.com"
              value={builderData.creatorEmail}
              onChange={(e) => updateBuilderData({ creatorEmail: e.target.value })}
            />
          </div>
          <span className="input-helper-text">We'll email you a permanent backup of your unique gift link and order receipt.</span>
        </div>
      </div>

      <CreatorNavigation
        isFirstStep={true}
        onNext={onNext}
        nextText="Continue to Package"
        loading={loading}
      />
    </div>
  );
};

export default DetailsStep;
