import React, { useState } from 'react';
import { Heart, Calendar, Smile, CheckCircle } from 'lucide-react';
import WhySpecialEditor from './WhySpecialEditor.jsx';
import TimelineEditor from './TimelineEditor.jsx';
import SiblingFunEditor from './SiblingFunEditor.jsx';

export const PersonalizeTabContainer = ({
  reasons = [],
  memories = [],
  funItems = [],
  availablePhotos = [],
  recipientName = 'Sister',
  planKey = 'PREMIUM',
  onUpdateReasons,
  onUpdateMemories,
  onUpdateFunItems
}) => {
  const [activeTab, setActiveTab] = useState('reasons'); // 'reasons' | 'timeline' | 'fun'
  const isDeluxe = planKey === 'DELUXE';
  const maxTimelineItems = isDeluxe ? 8 : 5;

  const isReasonsComplete = reasons.length >= 3 && reasons.every((r) => r.title?.trim() && r.text?.trim());
  const isTimelineComplete = memories.length >= 3 && memories.every((m) => m.date?.trim() && m.title?.trim() && m.description?.trim());
  const isFunComplete = funItems.length >= 3 && funItems.every((f) => f.question?.trim() && f.answer?.trim());

  return (
    <div className="personalize-tab-container-root">
      {/* Sub-section Navigation Tabs */}
      <div className="personalize-tabs-nav" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'reasons'}
          className={`tab-nav-btn ${activeTab === 'reasons' ? 'active' : ''}`}
          onClick={() => setActiveTab('reasons')}
        >
          <div className="tab-btn-title-row">
            <Heart size={14} className="tab-icon" />
            <span>Why She's Special</span>
            {isReasonsComplete && <CheckCircle size={12} className="complete-icon" />}
          </div>
          <span className="tab-badge">{reasons.length}/5 Added</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'timeline'}
          className={`tab-nav-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <div className="tab-btn-title-row">
            <Calendar size={14} className="tab-icon" />
            <span>Our Timeline</span>
            {isTimelineComplete && <CheckCircle size={12} className="complete-icon" />}
          </div>
          <span className="tab-badge">{memories.length}/{maxTimelineItems} Added</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'fun'}
          className={`tab-nav-btn ${activeTab === 'fun' ? 'active' : ''}`}
          onClick={() => setActiveTab('fun')}
        >
          <div className="tab-btn-title-row">
            <Smile size={14} className="tab-icon" />
            <span>Just Between Us</span>
            {isFunComplete && <CheckCircle size={12} className="complete-icon" />}
          </div>
          <span className="tab-badge">{funItems.length}/6 Added</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="tab-content-panel animate-fade-in">
        {activeTab === 'reasons' && (
          <WhySpecialEditor
            reasons={reasons}
            onChange={onUpdateReasons}
            recipientName={recipientName}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineEditor
            memories={memories}
            availablePhotos={availablePhotos}
            onChange={onUpdateMemories}
            maxItems={maxTimelineItems}
            minItems={3}
          />
        )}

        {activeTab === 'fun' && (
          <SiblingFunEditor
            funItems={funItems}
            onChange={onUpdateFunItems}
            recipientName={recipientName}
          />
        )}
      </div>

      <style>{`
        .personalize-tab-container-root {
          width: 100%;
        }

        .personalize-tabs-nav {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          background: #F8F6F0;
          padding: 6px;
          border-radius: 14px;
          border: 1px solid var(--border-light, #EFE6D8);
          margin-bottom: 1.5rem;
        }

        .tab-nav-btn {
          background: transparent;
          border: 1.5px solid transparent;
          border-radius: 10px;
          padding: 10px 8px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          min-height: 48px;
        }

        .tab-nav-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.6);
        }

        .tab-nav-btn.active {
          background: #FFFDF9;
          border-color: #D4AF37;
          box-shadow: 0 4px 12px rgba(45, 30, 15, 0.06);
        }

        .tab-btn-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary, #1E1B18);
        }

        .tab-nav-btn.active .tab-btn-title-row {
          color: var(--color-rakhi-red, #9B2226);
        }

        .tab-icon {
          color: var(--color-gold, #C69234);
        }

        .complete-icon {
          color: #15803D;
        }

        .tab-badge {
          font-size: 0.725rem;
          color: var(--text-secondary, #59524C);
          font-weight: 500;
        }

        .tab-content-panel {
          background: transparent;
        }

        @media (max-width: 640px) {
          .personalize-tabs-nav {
            grid-template-columns: 1fr;
            gap: 6px;
          }
          .tab-nav-btn {
            flex-direction: row;
            justify-content: space-between;
            padding: 8px 12px;
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
};

export default PersonalizeTabContainer;
