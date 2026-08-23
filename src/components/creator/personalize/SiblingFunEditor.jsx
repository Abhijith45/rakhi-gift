import React from 'react';
import { Plus, Trash2, Smile, Sparkles } from 'lucide-react';

export const SiblingFunEditor = ({
  funItems = [],
  onChange,
  recipientName = 'Sister'
}) => {
  const minItems = 3;
  const maxItems = 6;

  const handleAdd = () => {
    if (funItems.length >= maxItems) return;
    const updated = [
      ...funItems,
      {
        question: '',
        answer: ''
      }
    ];
    onChange(updated);
  };

  const handleRemove = (index) => {
    if (funItems.length <= minItems) return;
    const filtered = funItems.filter((_, i) => i !== index);
    onChange(filtered);
  };

  const handleChange = (index, field, value) => {
    const updated = funItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const defaultQuestionPlaceholders = [
    'Who starts the fights?',
    'Who apologizes first?',
    'Who steals the food / snacks?',
    'Our biggest secret from parents?',
    'Who takes longer getting ready?',
    'Who is the favorite child?'
  ];

  return (
    <div className="sibling-fun-editor-root">
      <div className="editor-sub-header">
        <div>
          <h4 className="editor-sub-title">Just Between Us (Sibling Fun)</h4>
          <p className="editor-sub-desc">
            Let's add a few inside jokes and fun truths only you and {recipientName} understand ({minItems} to {maxItems} items).
          </p>
        </div>
        <div className="count-pill">
          <Smile size={12} />
          <span>{funItems.length}/{maxItems} Q&As</span>
        </div>
      </div>

      <div className="fun-stack">
        {funItems.map((item, index) => (
          <div key={index} className="fun-item-card">
            <div className="fun-card-head">
              <span className="fun-badge">Question #{index + 1}</span>
              {funItems.length > minItems && (
                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => handleRemove(index)}
                  title="Remove joke item"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="fun-inputs-col">
              <div className="form-group">
                <label className="input-label">Question / Prompt *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={`e.g. ${defaultQuestionPlaceholders[index % defaultQuestionPlaceholders.length]}`}
                  value={item.question || ''}
                  onChange={(e) => handleChange(index, 'question', e.target.value)}
                  maxLength={60}
                />
                <span className="char-limit">{(item.question || '').length}/60</span>
              </div>

              <div className="form-group">
                <label className="input-label">Answer / Punchline *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Usually me. 😂"
                  value={item.answer || ''}
                  onChange={(e) => handleChange(index, 'answer', e.target.value)}
                  maxLength={120}
                />
                <span className="char-limit">{(item.answer || '').length}/120</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {funItems.length < maxItems && (
        <button
          type="button"
          className="btn-add-dashed"
          onClick={handleAdd}
        >
          <Plus size={16} />
          <span>Add Inside Joke #{funItems.length + 1}</span>
        </button>
      )}

      <style>{`
        .sibling-fun-editor-root {
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
          background: rgba(217, 107, 67, 0.12);
          color: #B4441E;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .fun-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .fun-item-card {
          background: #FFFDF9;
          border: 1.5px solid var(--border-light, #EFE6D8);
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 6px rgba(45, 30, 15, 0.03);
          transition: border-color 0.2s ease;
        }

        .fun-item-card:hover {
          border-color: #D4AF37;
        }

        .fun-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .fun-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: #B4441E;
          background: rgba(217, 107, 67, 0.1);
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

        .fun-inputs-col {
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

export default SiblingFunEditor;
