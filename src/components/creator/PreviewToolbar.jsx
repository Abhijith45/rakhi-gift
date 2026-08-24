import React, { useState } from 'react';
import { Edit3, Palette, Package, Check, X, Sparkles, ArrowRight } from 'lucide-react';
import { getPlanConfig, isThemeAllowedForPlan } from '../../config/planConfig.js';
import { themes } from '../../data/themes.js';
import { STEP_IDS } from '../../config/stepConfig.js';
import Button from '../common/Button.jsx';

export const PreviewToolbar = ({
  builderData,
  onUpdateTheme,
  onJumpToStep,
  onChangePackage
}) => {
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const plan = getPlanConfig(builderData.plan);
  const activeThemeId = builderData.theme || 'warm-memory';

  const sectionJumps = [
    { id: STEP_IDS.DETAILS, label: 'Brother & Sister Details' },
    { id: STEP_IDS.PACKAGE, label: 'Package Tier' },
    { id: STEP_IDS.MEMORIES, label: 'Mounted Memories' },
    { id: STEP_IDS.MESSAGE, label: 'Rakhi Message' },
    ...(plan.reasons ? [{ id: STEP_IDS.PERSONALIZE, label: 'Why She Is Special' }] : []),
    { id: STEP_IDS.THEME, label: 'Theme & Secret Promise' }
  ];

  return (
    <div className="preview-toolbar-root">
      <div className="container preview-toolbar-inner">
        <div className="preview-status-tag">
          <Sparkles size={14} color="var(--color-gold, #C69234)" />
          <span>Recipient Live Preview Mode</span>
        </div>

        {/* Compact Action Toolbar */}
        <div className="preview-toolbar-actions">
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => setEditDrawerOpen(true)}
            title="Edit Gift Content"
          >
            <Edit3 size={15} />
            <span>Edit Gift</span>
          </button>

          <button
            type="button"
            className="toolbar-btn"
            onClick={() => setThemeModalOpen(true)}
            title="Change Visual Theme"
          >
            <Palette size={15} />
            <span>Change Theme</span>
          </button>

          <button
            type="button"
            className="toolbar-btn"
            onClick={onChangePackage}
            title="Change Package Tier"
          >
            <Package size={15} />
            <span>Change Package</span>
          </button>
        </div>
      </div>

      {/* Direct Theme Switcher Modal */}
      {themeModalOpen && (
        <div className="toolbar-modal-backdrop" onClick={() => setThemeModalOpen(false)}>
          <div className="toolbar-modal-card paper-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h4 className="modal-title">Change Visual Theme</h4>
                <p className="modal-sub">
                  Allowed under <strong>{plan.name}</strong> ({plan.availableThemes.length} available)
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setThemeModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="themes-grid-preview">
              {themes.map((t) => {
                const isAllowed = isThemeAllowedForPlan(t.id, builderData.plan);
                const isSelected = activeThemeId === t.id;

                return (
                  <div
                    key={t.id}
                    className={`preview-theme-card ${isSelected ? 'selected' : ''} ${!isAllowed ? 'disabled' : ''}`}
                    onClick={() => {
                      if (isAllowed) {
                        onUpdateTheme(t.id);
                        setThemeModalOpen(false);
                      }
                    }}
                  >
                    <div className="theme-card-head">
                      <span
                        className="theme-card-name"
                        style={{ fontFamily: t.fontFamilyHeading || 'inherit' }}
                      >
                        {t.name}
                      </span>
                      {isSelected && <Check size={16} className="check-icon" />}
                    </div>
                    <span className="theme-card-badge-mini">{t.badge}</span>
                    <p className="theme-card-sub">{t.description}</p>

                    <div className="theme-swatch-row">
                      <span className="swatch-dot" title="Background" style={{ background: t.palette.bgPrimary }} />
                      <span className="swatch-dot" title="Surface" style={{ background: t.palette.bgSurface }} />
                      <span className="swatch-dot" title="Accent" style={{ background: t.palette.accent }} />
                      <span className="swatch-dot" title="Gold" style={{ background: t.palette.gold }} />
                    </div>

                    {!isAllowed && (
                      <span className="tier-lock-badge">Requires Premium Tier</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Jump Section Edit Drawer */}
      {editDrawerOpen && (
        <div className="toolbar-modal-backdrop" onClick={() => setEditDrawerOpen(false)}>
          <div className="toolbar-modal-card paper-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h4 className="modal-title">Quick Jump to Edit Section</h4>
                <p className="modal-sub">Select which section of your gift to modify:</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditDrawerOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="section-jumps-list">
              {sectionJumps.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  className="jump-item-btn"
                  onClick={() => {
                    setEditDrawerOpen(false);
                    onJumpToStep(sec.id);
                  }}
                >
                  <span>{sec.label}</span>
                  <ArrowRight size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .preview-toolbar-root {
          background: #1C1917;
          color: #FFF;
          padding: 10px 0;
          position: sticky;
          top: var(--header-height, 60px);
          z-index: 25;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
        }

        .preview-toolbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .preview-status-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #E7E5E4;
          font-weight: 500;
        }

        .preview-toolbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toolbar-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFF;
          font-size: 0.775rem;
          font-weight: 600;
          cursor: pointer;
          min-height: 36px;
          transition: all 0.2s ease;
        }

        .toolbar-btn:hover {
          background: rgba(255, 255, 255, 0.22);
          border-color: rgba(255, 255, 255, 0.4);
        }

        /* Modal Dialogs */
        .toolbar-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(28, 25, 23, 0.75);
          backdrop-filter: blur(8px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .toolbar-modal-card {
          max-width: 480px;
          width: 100%;
          padding: 1.25rem;
          background: #FFFDF9;
          color: #1E1B18;
          border-radius: 16px;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .modal-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 2px 0;
        }

        .modal-sub {
          font-size: 0.775rem;
          color: #59524C;
          margin: 0;
        }

        .modal-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #59524C;
          padding: 4px;
        }

        .themes-grid-preview {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .preview-theme-card {
          background: #FFF;
          border: 1.5px solid #EFE6D8;
          border-radius: 10px;
          padding: 10px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }

        .preview-theme-card:hover:not(.disabled) {
          border-color: #9B2226;
        }

        .preview-theme-card.selected {
          border-color: #9B2226;
          background: #FFFDFB;
          box-shadow: 0 0 0 1px #9B2226;
        }

        .preview-theme-card.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .theme-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 700;
          font-size: 0.825rem;
          margin-bottom: 2px;
        }

        .check-icon {
          color: #9B2226;
        }

        .theme-card-badge-mini {
          display: inline-block;
          font-size: 9px;
          font-weight: 700;
          color: #7A5813;
          background: rgba(198, 146, 52, 0.12);
          padding: 1px 6px;
          border-radius: 9999px;
          margin-bottom: 4px;
        }

        .theme-card-sub {
          font-size: 0.7rem;
          color: #59524C;
          margin: 0 0 6px 0;
          line-height: 1.2;
        }

        .theme-swatch-row {
          display: flex;
          gap: 4px;
        }

        .swatch-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .tier-lock-badge {
          display: block;
          font-size: 9px;
          color: #B58428;
          margin-top: 4px;
          font-weight: 600;
        }

        .section-jumps-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .jump-item-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: 8px;
          background: #F8F6F0;
          border: 1px solid #EFE6D8;
          color: #1E1B18;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          min-height: 44px;
          transition: background 0.2s ease;
        }

        .jump-item-btn:hover {
          background: #F0E6D8;
        }

        @media (max-width: 640px) {
          .preview-toolbar-inner {
            flex-direction: column;
            align-items: flex-start;
          }
          .preview-toolbar-actions {
            width: 100%;
            justify-content: space-between;
          }
          .toolbar-btn {
            flex: 1;
            justify-content: center;
            padding: 6px 8px;
            font-size: 0.725rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PreviewToolbar;
