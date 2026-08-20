import React, { useState } from 'react';
import { Sparkles, Mail, Heart, Gift, Award, Check, Lock, Unlock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockGift } from '../../data/mockGift';

export const ExperiencePreview = () => {
  const [activeTab, setActiveTab] = useState('message');
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9B2226', '#D4AF37', '#D96B43', '#FFF8F0']
      });
    } catch (e) {
      // Graceful fallback if canvas confetti is unavailable
    }
  };

  return (
    <section id="experience-preview" className="section experience-preview-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={13} />
            <span>Recipient Journey</span>
          </div>
          <h2 className="section-title">
            The full <span className="title-serif-accent">recipient experience.</span>
          </h2>
          <p className="section-subtitle">
            When your sibling opens their private gift link, they embark on an emotional journey curated just for them.
          </p>
        </div>

        {/* Interactive Tab Navigation */}
        <div className="preview-nav-tabs">
          <button
            type="button"
            className={`preview-tab-btn ${activeTab === 'message' ? 'active' : ''}`}
            onClick={() => setActiveTab('message')}
          >
            <Mail size={16} />
            <span>01. Heartfelt Letter</span>
          </button>

          <button
            type="button"
            className={`preview-tab-btn ${activeTab === 'reasons' ? 'active' : ''}`}
            onClick={() => setActiveTab('reasons')}
          >
            <Heart size={16} />
            <span>02. Why You're Special</span>
          </button>

          <button
            type="button"
            className={`preview-tab-btn ${activeTab === 'surprise' ? 'active' : ''}`}
            onClick={() => setActiveTab('surprise')}
          >
            <Gift size={16} />
            <span>03. Surprise Reveal</span>
          </button>
        </div>

        {/* Tab Content Display Stage */}
        <div className="preview-stage-card paper-card">
          {/* TAB 1: Heartfelt Letter */}
          {activeTab === 'message' && (
            <div className="preview-letter-view animate-fade-in">
              <div className="letter-header">
                <div className="wax-seal">
                  <div className="wax-inner">❤️</div>
                </div>
                <div className="letter-salutation">{mockGift.message.salutation}</div>
              </div>

              <p className="letter-body">
                {mockGift.message.body}
              </p>

              <div className="letter-footer">
                <div className="letter-signoff">{mockGift.message.signoff}</div>
                <div className="letter-sender">{mockGift.message.sender}</div>
              </div>
            </div>
          )}

          {/* TAB 2: Why You're Special */}
          {activeTab === 'reasons' && (
            <div className="preview-reasons-view animate-fade-in">
              <div className="reasons-header-bar">
                <h3 className="reasons-heading">4 Reasons You're My Favorite Sibling</h3>
                <span className="reasons-pill">Personalized for Aarav</span>
              </div>

              <div className="reasons-grid">
                {mockGift.reasons.map((reason) => (
                  <div key={reason.id} className="reason-item-card">
                    <div className="reason-num-circle">{reason.number}</div>
                    <div>
                      <h4 className="reason-title">{reason.title}</h4>
                      <p className="reason-text">{reason.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Surprise Reveal */}
          {activeTab === 'surprise' && (
            <div className="preview-surprise-view animate-fade-in">
              {!envelopeOpened ? (
                <div className="envelope-closed-container" onClick={handleOpenEnvelope}>
                  <div className="sealed-envelope-graphic">
                    <div className="envelope-flap" />
                    <div className="envelope-wax-badge">
                      <Lock size={16} color="#FFFDF9" />
                    </div>
                    <div className="envelope-glow" />
                  </div>
                  <h3 className="envelope-prompt-title">A Sealed Surprise Awaits</h3>
                  <p className="envelope-prompt-sub">Click the wax seal to unlock Ananya's secret Rakhi promise</p>
                  <button type="button" className="btn btn-gold btn-sm">
                    <Unlock size={14} />
                    <span>Break Seal & Open</span>
                  </button>
                </div>
              ) : (
                <div className="envelope-opened-container animate-fade-in-up">
                  <div className="voucher-card">
                    <div className="voucher-ribbon">
                      <Award size={16} />
                      <span>{mockGift.surprise.badge}</span>
                    </div>
                    <h3 className="voucher-title">{mockGift.surprise.title}</h3>
                    <p className="voucher-msg">{mockGift.surprise.message}</p>
                    <div className="voucher-code-box">
                      <span className="voucher-code-text">{mockGift.surprise.giftVoucher}</span>
                    </div>
                    <p className="voucher-note">{mockGift.surprise.giftNote}</p>
                  </div>
                  <button
                    type="button"
                    className="replay-seal-btn"
                    onClick={() => setEnvelopeOpened(false)}
                  >
                    Reseal Envelope
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .experience-preview-section {
          background-color: var(--bg-primary);
        }

        .preview-nav-tabs {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          margin-bottom: var(--space-8);
          flex-wrap: wrap;
        }

        .preview-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-6);
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--text-secondary);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          box-shadow: var(--shadow-xs);
          transition: all var(--transition-fast);
        }

        .preview-tab-btn:hover {
          color: var(--text-primary);
          border-color: var(--border-strong);
        }

        .preview-tab-btn.active {
          background: var(--color-rakhi-red);
          color: #FFFFFF;
          border-color: var(--color-rakhi-red);
          box-shadow: 0 4px 14px var(--color-rakhi-glow);
        }

        .preview-stage-card {
          max-width: 820px;
          margin: 0 auto;
          padding: clamp(2rem, 5vw, 3.5rem);
          min-height: 420px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-shadow: var(--shadow-lg);
        }

        /* Letter View */
        .preview-letter-view {
          position: relative;
        }

        .letter-header {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .wax-seal {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #C23838, #8F181B 70%, #5E0D0F 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(143, 24, 27, 0.4);
          border: 1px solid #701316;
          flex-shrink: 0;
        }

        .wax-inner {
          font-size: 16px;
        }

        .letter-salutation {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        .letter-body {
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--text-primary);
          margin-bottom: var(--space-8);
          font-family: var(--font-sans);
        }

        .letter-footer {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          border-top: 1px dashed var(--border-default);
          padding-top: var(--space-4);
        }

        .letter-signoff {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          font-style: italic;
        }

        .letter-sender {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          color: var(--color-rakhi-red);
          font-weight: 700;
        }

        /* Reasons View */
        .reasons-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-6);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--border-light);
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .reasons-heading {
          font-size: 1.35rem;
          color: var(--text-primary);
        }

        .reasons-pill {
          font-size: var(--text-xs);
          color: var(--color-gold);
          background: var(--color-gold-light);
          padding: 3px 12px;
          border-radius: var(--radius-full);
          font-weight: 600;
          border: 1px solid var(--color-gold-border);
        }

        .reasons-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-4);
        }

        .reason-item-card {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
        }

        .reason-num-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-rakhi-light);
          color: var(--color-rakhi-red);
          font-size: var(--text-xs);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .reason-title {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .reason-text {
          font-size: var(--text-xs);
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Surprise View */
        .preview-surprise-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .envelope-closed-container {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-4);
          transition: transform 0.2s;
        }

        .envelope-closed-container:hover {
          transform: scale(1.02);
        }

        .sealed-envelope-graphic {
          width: 140px;
          height: 96px;
          background: linear-gradient(135deg, #E6DCCD 0%, #DFD2C2 100%);
          border: 2px solid #C8B9A6;
          border-radius: var(--radius-md);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-4);
          box-shadow: var(--shadow-md);
        }

        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 0;
          border-left: 70px solid transparent;
          border-right: 70px solid transparent;
          border-top: 50px solid #D6C7B3;
        }

        .envelope-wax-badge {
          position: relative;
          z-index: 2;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #C23838, #8F181B 70%, #5E0D0F 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(143, 24, 27, 0.4);
          border: 1px solid #701316;
        }

        .envelope-prompt-title {
          font-size: 1.4rem;
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .envelope-prompt-sub {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-4);
        }

        .voucher-card {
          background: linear-gradient(135deg, #FAF4E8 0%, #FFFDF9 100%);
          border: 2px solid var(--color-gold-border);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          max-width: 520px;
          position: relative;
          box-shadow: var(--shadow-lg);
          margin-bottom: var(--space-4);
        }

        .voucher-ribbon {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--color-gold);
          color: #FFFFFF;
          padding: 4px 14px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-4);
        }

        .voucher-title {
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .voucher-msg {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--space-5);
        }

        .voucher-code-box {
          background: #FFFFFF;
          border: 1px dashed var(--color-gold);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-3);
        }

        .voucher-code-text {
          font-family: monospace;
          font-weight: 700;
          font-size: var(--text-sm);
          color: var(--color-rakhi-red);
          letter-spacing: 0.05em;
        }

        .voucher-note {
          font-size: var(--text-xs);
          color: var(--text-muted);
          font-style: italic;
        }

        .replay-seal-btn {
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-decoration: underline;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .reasons-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default ExperiencePreview;
