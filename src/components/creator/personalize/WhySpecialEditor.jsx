import React from 'react';
import { Plus, Trash2, Heart, Sparkles } from 'lucide-react';

export const WhySpecialEditor = ({
  reasons = [],
  onChange,
  recipientName = 'Sister'
}) => {
  const minCount = 3;
  const maxCount = 5;

  const handleAdd = () => {
    if (reasons.length >= maxCount) return;
    const nextIdx = reasons.length + 1;
    const updated = [
      ...reasons,
      {
        number: `0${nextIdx}`,
        title: '',
        text: ''
      }
    ];
    onChange(updated);
  };

  const handleRemove = (index) => {
    if (reasons.length <= minCount) return;
    const filtered = reasons.filter((_, i) => i !== index);
    const reindexed = filtered.map((r, i) => ({
      ...r,
      number: `0${i + 1}`
    }));
    onChange(reindexed);
  };

  const handleChange = (index, field, value) => {
    const updated = reasons.map((r, i) =>
      i === index ? { ...r, [field]: value } : r
    );
    onChange(updated);
  };

  return (
    <div className="why-special-editor-root">
      <div className="editor-sub-header">
        <div>
          <h4 className="editor-sub-title">Why is {recipientName} special to you?</h4>
          <p className="editor-sub-desc">
            Share 3 to 5 little reasons why your sibling bond is unbreakable.
          </p>
        </div>
        <div className="count-pill">
          <Heart size={12} className="heart-icon" />
          <span>{reasons.length}/{maxCount} Reasons</span>
        </div>
      </div>

      <div className="reasons-stack">
        {reasons.map((reason, index) => (
          <div key={index} className="reason-item-card">
            <div className="reason-card-head">
              <span className="reason-number-badge">Reason #{index + 1}</span>
              {reasons.length > minCount && (
                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => handleRemove(index)}
                  title="Remove reason"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="reason-inputs-row">
              <div className="form-group">
                <label className="input-label">Reason Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Always Having My Back"
                  value={reason.title || ''}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  maxLength={40}
                />
                <span className="char-limit">{(reason.title || '').length}/40</span>
              </div>

              <div className="form-group">
                <label className="input-label">Story / Detail *</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="e.g. Even when I don't say anything, you somehow know when I need you."
                  value={reason.text || ''}
                  onChange={(e) => handleChange(index, 'text', e.target.value)}
                  maxLength={140}
                />
                <span className="char-limit">{(reason.text || '').length}/140</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reasons.length < maxCount && (
        <button
          type="button"
          className="btn-add-dashed"
          onClick={handleAdd}
        >
          <Plus size={16} />
          <span>Add Reason #{reasons.length + 1}</span>
        </button>
      )}

      <style>{`
        .why-special-editor-root {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .editor-sub-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .editor-sub-title {
          font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary, #1E1B18);
          margin: 0 0 2px 0;
        }

        .editor-sub-desc {
          font-size: 0.8rem;
          color: var(--text-secondary, #59524C);
          margin: 0;
        }

        .count-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(155, 34, 38, 0.08);
          color: var(--color-rakhi-red, #9B2226);
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .heart-icon {
          fill: currentColor;
        }

        .reasons-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .reason-item-card {
          background: #FFFDF9;
          border: 1.5px solid var(--border-light, #EFE6D8);
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 6px rgba(45, 30, 15, 0.03);
          transition: border-color 0.2s ease;
        }

        .reason-item-card:hover {
          border-color: #D4AF37;
        }

        .reason-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .reason-number-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-rakhi-red, #9B2226);
          background: rgba(155, 34, 38, 0.06);
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .btn-remove-item {
          background: transparent;
          border: none;
          color: #A8A29E;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .btn-remove-item:hover {
          color: #DC2626;
          background: #FEE2E2;
        }

        .reason-inputs-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .input-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary, #59524C);
          margin-bottom: 3px;
          display: block;
        }

        .char-limit {
          font-size: 10px;
          color: #A8A29E;
          text-align: right;
          display: block;
          margin-top: 2px;
        }

        .btn-add-dashed {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: 2px dashed #D4AF37;
          border-radius: 12px;
          background: rgba(212, 175, 55, 0.04);
          color: #7A5813;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-add-dashed:hover {
          background: rgba(212, 175, 55, 0.12);
          border-color: #B58428;
        }
      `}</style>
    </div>
  );
};

export default WhySpecialEditor;
