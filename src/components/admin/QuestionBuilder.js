import React, { useState } from 'react';
import '../../styles/QuestionBuilder.css';

const TYPES = [
  { value: 'mcq',         label: 'Multiple Choice' },
  { value: 'checkbox',    label: 'Checkboxes' },
  { value: 'dropdown',    label: 'Dropdown' },
  { value: 'shortAnswer', label: 'Short Answer' },
  { value: 'paragraph',   label: 'Paragraph' },
  { value: 'linearScale', label: 'Linear Scale' },
  { value: 'date',        label: 'Date' },
  { value: 'time',        label: 'Time' },
  { value: 'fileUpload',  label: 'File Upload' },
  { value: 'duration',    label: 'Duration' },
];

const HAS_OPTIONS = ['mcq', 'checkbox', 'dropdown'];

export default function QuestionBuilder({ question, onUpdate, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown }) {
  const [focused, setFocused] = useState(false);

  /* helpers */
  const set = (patch) => onUpdate({ ...question, ...patch });

  const changeType = (type) => {
    const patch = { type };
    if (HAS_OPTIONS.includes(type) && !HAS_OPTIONS.includes(question.type)) {
      patch.options = [
        { id: `o${Date.now()}1`, text: '', isCorrect: false },
        { id: `o${Date.now()}2`, text: '', isCorrect: false },
      ];
    }
    set(patch);
  };

  const setOption = (id, field, value) =>
    set({ options: question.options.map(o => o.id === id ? { ...o, [field]: value } : o) });

  const addOption = () =>
    set({ options: [...(question.options || []), { id: `o${Date.now()}`, text: '', isCorrect: false }] });

  const removeOption = (id) =>
    set({ options: question.options.filter(o => o.id !== id) });

  const markCorrect = (id) =>
    set({ options: question.options.map(o => ({ ...o, isCorrect: o.id === id })) });

  const toggleCorrectCb = (id) =>
    set({ options: question.options.map(o => o.id === id ? { ...o, isCorrect: !o.isCorrect } : o) });

  const needsOptions = HAS_OPTIONS.includes(question.type);

  return (
    <div
      className={`qb-card ${focused ? 'qb-card--active' : ''}`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {/* ── row 1: question text + type selector ── */}
      <div className="qb-top-row">
        <input
          className="qb-question-input"
          placeholder="Question"
          value={question.questionText || ''}
          onChange={e => set({ questionText: e.target.value })}
        />
        <select
          className="qb-type-select"
          value={question.type}
          onChange={e => changeType(e.target.value)}
        >
          {TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* ── row 2: answer area ── */}
      <div className="qb-answer-area">

        {/* MCQ */}
        {question.type === 'mcq' && (
          <div className="qb-options">
            {(question.options || []).map((opt, i) => (
              <div key={opt.id} className="qb-option-row">
                <input
                  type="radio"
                  checked={opt.isCorrect}
                  onChange={() => markCorrect(opt.id)}
                  title="Mark correct"
                  className="qb-radio"
                />
                <input
                  className="qb-option-input"
                  placeholder={`Option ${i + 1}`}
                  value={opt.text}
                  onChange={e => setOption(opt.id, 'text', e.target.value)}
                />
                {question.options.length > 2 && (
                  <button className="qb-opt-del" onClick={() => removeOption(opt.id)}>✕</button>
                )}
              </div>
            ))}
            <button className="qb-add-opt" onClick={addOption}>+ Add option</button>
          </div>
        )}

        {/* Checkbox */}
        {question.type === 'checkbox' && (
          <div className="qb-options">
            {(question.options || []).map((opt, i) => (
              <div key={opt.id} className="qb-option-row">
                <input
                  type="checkbox"
                  checked={opt.isCorrect}
                  onChange={() => toggleCorrectCb(opt.id)}
                  title="Mark correct"
                  className="qb-checkbox"
                />
                <input
                  className="qb-option-input"
                  placeholder={`Option ${i + 1}`}
                  value={opt.text}
                  onChange={e => setOption(opt.id, 'text', e.target.value)}
                />
                {question.options.length > 2 && (
                  <button className="qb-opt-del" onClick={() => removeOption(opt.id)}>✕</button>
                )}
              </div>
            ))}
            <button className="qb-add-opt" onClick={addOption}>+ Add option</button>
          </div>
        )}

        {/* Dropdown */}
        {question.type === 'dropdown' && (
          <div className="qb-options">
            {(question.options || []).map((opt, i) => (
              <div key={opt.id} className="qb-option-row">
                <span className="qb-opt-num">{i + 1}.</span>
                <input
                  className="qb-option-input"
                  placeholder={`Option ${i + 1}`}
                  value={opt.text}
                  onChange={e => setOption(opt.id, 'text', e.target.value)}
                />
                {question.options.length > 2 && (
                  <button className="qb-opt-del" onClick={() => removeOption(opt.id)}>✕</button>
                )}
              </div>
            ))}
            <button className="qb-add-opt" onClick={addOption}>+ Add option</button>
          </div>
        )}

        {/* Short answer */}
        {question.type === 'shortAnswer' && (
          <div className="qb-preview-field">
            <div className="qb-preview-short">Short answer text</div>
          </div>
        )}

        {/* Paragraph */}
        {question.type === 'paragraph' && (
          <div className="qb-preview-field">
            <div className="qb-preview-para">Long answer text</div>
          </div>
        )}

        {/* Linear Scale */}
        {question.type === 'linearScale' && (
          <div className="qb-scale">
            <div className="qb-scale-row">
              <select value={question.scaleMin || 1} onChange={e => set({ scaleMin: parseInt(e.target.value) })}>
                {[0,1].map(v => <option key={v}>{v}</option>)}
              </select>
              <span>to</span>
              <select value={question.scaleMax || 5} onChange={e => set({ scaleMax: parseInt(e.target.value) })}>
                {[2,3,4,5,6,7,8,9,10].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="qb-scale-labels">
              <input placeholder="Min label (optional)" value={question.scaleMinLabel || ''} onChange={e => set({ scaleMinLabel: e.target.value })} />
              <input placeholder="Max label (optional)" value={question.scaleMaxLabel || ''} onChange={e => set({ scaleMaxLabel: e.target.value })} />
            </div>
          </div>
        )}

        {/* Date */}
        {question.type === 'date' && (
          <div className="qb-preview-field"><div className="qb-preview-date">MM / DD / YYYY  📅</div></div>
        )}

        {/* Time */}
        {question.type === 'time' && (
          <div className="qb-preview-field"><div className="qb-preview-date">HH : MM  ⏰</div></div>
        )}

        {/* File Upload */}
        {question.type === 'fileUpload' && (
          <div className="qb-preview-field">
            <div className="qb-preview-file">📎 File upload</div>
          </div>
        )}

        {/* Duration */}
        {question.type === 'duration' && (
          <div className="qb-preview-field"><div className="qb-preview-date">HH : MM : SS  ⏱</div></div>
        )}

      </div>

      {/* ── divider ── */}
      <div className="qb-divider" />

      {/* ── footer toolbar ── */}
      <div className="qb-footer">
        <div className="qb-footer-left">
          <div className="qb-marks-group">
            <span className="qb-marks-label">Points:</span>
            <input
              type="number"
              className="qb-marks-inp"
              min="1"
              value={question.marks || 1}
              onChange={e => set({ marks: Math.max(1, parseInt(e.target.value) || 1) })}
            />
          </div>
        </div>
        <div className="qb-footer-right">
          <button className="qb-footer-btn" onClick={onMoveUp} disabled={!canMoveUp} title="Move up">↑</button>
          <button className="qb-footer-btn" onClick={onMoveDown} disabled={!canMoveDown} title="Move down">↓</button>
          <div className="qb-divider-v" />
          <label className="qb-required-label">
            Required
            <div
              className={`qb-tog ${question.isRequired ? 'on' : ''}`}
              onClick={() => set({ isRequired: !question.isRequired })}
            >
              <div className="qb-tog-k" />
            </div>
          </label>
          <div className="qb-divider-v" />
          <button className="qb-footer-btn qb-del-btn" onClick={onDelete} title="Delete">🗑</button>
        </div>
      </div>
    </div>
  );
}
