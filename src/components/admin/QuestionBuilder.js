import React, { useState, useRef, useEffect } from 'react';
import '../../styles/QuestionBuilder.css';

const TYPES = [
  { value: 'mcq',         label: 'Multiple Choice' },
  { value: 'checkbox',    label: 'Checkboxes'       },
  { value: 'dropdown',    label: 'Dropdown'         },
  { value: 'shortAnswer', label: 'Short Answer'     },
  { value: 'paragraph',   label: 'Paragraph'        },
  { value: 'linearScale', label: 'Linear Scale'     },
  { value: 'date',        label: 'Date'             },
  { value: 'time',        label: 'Time'             },
  { value: 'fileUpload',  label: 'File Upload'      },
];

const HAS_OPTIONS = ['mcq', 'checkbox', 'dropdown'];
const HAS_VALIDATION = ['shortAnswer', 'paragraph'];

const VALIDATION_TYPES = ['Length', 'Regular expression', 'Contains text', 'Doesn\'t contain'];
const LENGTH_CONDITIONS = ['Minimum character count', 'Maximum character count', 'Character count is'];

export default function QuestionBuilder({
  question, index, onUpdate, onDelete, onDuplicate, onMoveUp, onMoveDown, canMoveUp, canMoveDown,
}) {
  const [focused,       setFocused]      = useState(false);
  const [menuOpen,      setMenuOpen]     = useState(false);
  const [showDesc,      setShowDesc]     = useState(!!question.description);
  const [showValidate,  setShowValidate] = useState(!!question.validation?.type);
  const cardRef = useRef(null);
  const menuRef = useRef(null);

  const set = (patch) => onUpdate({ ...question, ...patch });

  // Close menu on outside click
  useEffect(() => {
    function handle(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const changeType = (type) => {
    const patch = { type };
    if (HAS_OPTIONS.includes(type) && !HAS_OPTIONS.includes(question.type)) {
      patch.options = [
        { id: `o${Date.now()}1`, text: '', isCorrect: false },
        { id: `o${Date.now()}2`, text: '', isCorrect: false },
      ];
    } else if (!HAS_OPTIONS.includes(type)) {
      patch.options = [];
    }
    set(patch);
  };

  const setOption = (id, field, value) =>
    set({ options: question.options.map(o => o.id === id ? { ...o, [field]: value } : o) });

  const addOption = () =>
    set({ options: [...(question.options || []), { id: `o${Date.now()}`, text: '', isCorrect: false }] });

  const removeOption = (id) => {
    if ((question.options || []).length <= 2) return;
    set({ options: question.options.filter(o => o.id !== id) });
  };

  const markCorrect    = (id) => set({ options: question.options.map(o => ({ ...o, isCorrect: o.id === id })) });
  const toggleCorrectCb= (id) => set({ options: question.options.map(o => o.id === id ? { ...o, isCorrect: !o.isCorrect } : o) });

  const setValidation = (patch) => set({ validation: { ...(question.validation || {}), ...patch } });
  const clearValidation = () => set({ validation: null });

  const handleFocus = () => setFocused(true);
  const handleBlur  = (e) => {
    if (cardRef.current && !cardRef.current.contains(e.relatedTarget)) setFocused(false);
  };

  const toggleDescription = () => {
    const next = !showDesc;
    setShowDesc(next);
    if (!next) set({ description: '' });
    setMenuOpen(false);
  };

  const toggleValidation = () => {
    const next = !showValidate;
    setShowValidate(next);
    if (!next) clearValidation();
    setMenuOpen(false);
  };

  return (
    <div
      ref={cardRef}
      className={`gf-q-card${focused ? ' gf-q-card--active' : ''}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={-1}
    >
      {focused && <div className="gf-q-accent" />}

      {/* ── Row 1: Question + type ── */}
      <div className="gf-q-top-row">
        <input
          className="gf-q-input"
          placeholder="Question"
          value={question.questionText || ''}
          onChange={e => set({ questionText: e.target.value })}
        />
        {/* Image placeholder icon */}
        <button className="gf-q-img-btn" type="button" title="Add image (coming soon)" disabled>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </button>
        <select
          className="gf-q-type-select"
          value={question.type}
          onChange={e => changeType(e.target.value)}
        >
          {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* ── Description (shown when toggled) ── */}
      {showDesc && (
        <input
          className="gf-q-desc-input"
          placeholder="Description"
          value={question.description || ''}
          onChange={e => set({ description: e.target.value })}
        />
      )}

      {/* ── Answer area ── */}
      <div className="gf-q-body">

        {/* MCQ */}
        {question.type === 'mcq' && (
          <div className="gf-q-options">
            {(question.options || []).map((opt, i) => (
              <div key={opt.id} className="gf-q-opt-row">
                <button
                  className={`gf-q-radio-btn${opt.isCorrect ? ' gf-q-radio-btn--correct' : ''}`}
                  onClick={() => markCorrect(opt.id)} type="button" title="Mark correct"
                ><span className="gf-q-radio-inner" /></button>
                <input
                  className={`gf-q-opt-input${opt.isCorrect ? ' gf-q-opt--correct' : ''}`}
                  placeholder={`Option ${i + 1}`}
                  value={opt.text}
                  onChange={e => setOption(opt.id, 'text', e.target.value)}
                />
                {(question.options || []).length > 2 && (
                  <button className="gf-q-opt-del" onClick={() => removeOption(opt.id)} type="button">✕</button>
                )}
              </div>
            ))}
            <div className="gf-q-add-opt-row">
              <button className="gf-q-radio-btn gf-q-radio-btn--ghost" type="button" disabled><span className="gf-q-radio-inner" /></button>
              <button className="gf-q-add-opt-link" onClick={addOption} type="button">Add option</button>
            </div>
          </div>
        )}

        {/* Checkbox */}
        {question.type === 'checkbox' && (
          <div className="gf-q-options">
            {(question.options || []).map((opt, i) => (
              <div key={opt.id} className="gf-q-opt-row">
                <button
                  className={`gf-q-checkbox-btn${opt.isCorrect ? ' gf-q-checkbox-btn--correct' : ''}`}
                  onClick={() => toggleCorrectCb(opt.id)} type="button" title="Mark correct"
                >{opt.isCorrect && <span className="gf-q-check-mark">✓</span>}</button>
                <input
                  className={`gf-q-opt-input${opt.isCorrect ? ' gf-q-opt--correct' : ''}`}
                  placeholder={`Option ${i + 1}`}
                  value={opt.text}
                  onChange={e => setOption(opt.id, 'text', e.target.value)}
                />
                {(question.options || []).length > 2 && (
                  <button className="gf-q-opt-del" onClick={() => removeOption(opt.id)} type="button">✕</button>
                )}
              </div>
            ))}
            <div className="gf-q-add-opt-row">
              <button className="gf-q-checkbox-btn gf-q-checkbox-btn--ghost" type="button" disabled />
              <button className="gf-q-add-opt-link" onClick={addOption} type="button">Add option</button>
            </div>
          </div>
        )}

        {/* Dropdown */}
        {question.type === 'dropdown' && (
          <div className="gf-q-options">
            {(question.options || []).map((opt, i) => (
              <div key={opt.id} className="gf-q-opt-row">
                <span className="gf-q-opt-num">{i + 1}</span>
                <input
                  className="gf-q-opt-input"
                  placeholder={`Option ${i + 1}`}
                  value={opt.text}
                  onChange={e => setOption(opt.id, 'text', e.target.value)}
                />
                {(question.options || []).length > 2 && (
                  <button className="gf-q-opt-del" onClick={() => removeOption(opt.id)} type="button">✕</button>
                )}
              </div>
            ))}
            <div className="gf-q-add-opt-row">
              <span className="gf-q-opt-num">{(question.options || []).length + 1}</span>
              <button className="gf-q-add-opt-link" onClick={addOption} type="button">Add option</button>
            </div>
          </div>
        )}

        {/* Short Answer */}
        {question.type === 'shortAnswer' && (
          <div className="gf-q-preview-field">
            <div className="gf-q-preview-short">Short answer text</div>
          </div>
        )}

        {/* Paragraph */}
        {question.type === 'paragraph' && (
          <div className="gf-q-preview-field">
            <div className="gf-q-preview-para">Long answer text</div>
          </div>
        )}

        {/* Linear Scale */}
        {question.type === 'linearScale' && (
          <div className="gf-q-scale">
            <div className="gf-q-scale-row">
              <select value={question.scaleMin ?? 1} onChange={e => set({ scaleMin: parseInt(e.target.value) })} className="gf-q-scale-select">
                {[0,1].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <span className="gf-q-scale-to">to</span>
              <select value={question.scaleMax ?? 5} onChange={e => set({ scaleMax: parseInt(e.target.value) })} className="gf-q-scale-select">
                {[2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="gf-q-scale-preview">
              {Array.from({length:(question.scaleMax??5)-(question.scaleMin??1)+1},(_,i)=>(question.scaleMin??1)+i).map(n=>(
                <div key={n} className="gf-q-scale-num"><span>{n}</span><div className="gf-q-scale-dot"/></div>
              ))}
            </div>
            <div className="gf-q-scale-labels">
              <input className="gf-q-scale-label-inp" placeholder="Label (optional)" value={question.scaleMinLabel||''} onChange={e=>set({scaleMinLabel:e.target.value})}/>
              <input className="gf-q-scale-label-inp" placeholder="Label (optional)" value={question.scaleMaxLabel||''} onChange={e=>set({scaleMaxLabel:e.target.value})} style={{textAlign:'right'}}/>
            </div>
          </div>
        )}

        {/* Date */}
        {question.type === 'date' && (
          <div className="gf-q-preview-field">
            <div className="gf-q-preview-date">
              <span>Month</span><span className="gf-q-preview-sep">/</span>
              <span>Day</span><span className="gf-q-preview-sep">/</span>
              <span>Year</span><span className="gf-q-preview-icon">📅</span>
            </div>
          </div>
        )}

        {/* Time */}
        {question.type === 'time' && (
          <div className="gf-q-preview-field">
            <div className="gf-q-preview-date">
              <span>Hour</span><span className="gf-q-preview-sep">:</span>
              <span>Minute</span><span className="gf-q-preview-icon">🕐</span>
            </div>
          </div>
        )}

        {/* File Upload */}
        {question.type === 'fileUpload' && (
          <div className="gf-q-preview-field">
            <div className="gf-q-preview-upload"><span className="gf-q-upload-icon">📎</span><span>Add File</span></div>
          </div>
        )}

      </div>

      {/* ── Response Validation (shortAnswer / paragraph) ── */}
      {showValidate && HAS_VALIDATION.includes(question.type) && (
        <div className="gf-q-validation">
          <select
            className="gf-q-val-select"
            value={question.validation?.validationType || 'Length'}
            onChange={e => setValidation({ validationType: e.target.value, condition: '', value: '', errorText: '' })}
          >
            {VALIDATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {(question.validation?.validationType === 'Length' || !question.validation?.validationType) && (
            <select
              className="gf-q-val-select"
              value={question.validation?.condition || LENGTH_CONDITIONS[0]}
              onChange={e => setValidation({ condition: e.target.value })}
            >
              {LENGTH_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <input
            className="gf-q-val-input"
            placeholder="Number"
            type="number"
            min="0"
            value={question.validation?.value || ''}
            onChange={e => setValidation({ value: e.target.value })}
          />
          <input
            className="gf-q-val-input gf-q-val-error"
            placeholder="Custom error text"
            value={question.validation?.errorText || ''}
            onChange={e => setValidation({ errorText: e.target.value })}
          />
          <button className="gf-q-val-del" type="button" onClick={toggleValidation} title="Remove validation">✕</button>
        </div>
      )}

      {/* ── Divider ── */}
      <div className="gf-q-divider" />

      {/* ── Footer toolbar ── */}
      <div className="gf-q-footer">
        <div className="gf-q-footer-left">
          <div className="gf-q-marks-group">
            <span className="gf-q-marks-lbl">Points</span>
            <input
              type="number" className="gf-q-marks-inp" min="1"
              value={question.marks || 1}
              onChange={e => set({ marks: Math.max(1, parseInt(e.target.value) || 1) })}
            />
          </div>
        </div>

        <div className="gf-q-footer-right">
          <button className="gf-q-ft-btn" onClick={onMoveUp}   disabled={!canMoveUp}   title="Move up"   type="button">↑</button>
          <button className="gf-q-ft-btn" onClick={onMoveDown} disabled={!canMoveDown} title="Move down" type="button">↓</button>
          <div className="gf-q-ft-divider" />
          {onDuplicate && (
            <button className="gf-q-ft-btn" onClick={onDuplicate} title="Duplicate" type="button">⎘</button>
          )}
          <button className="gf-q-ft-btn gf-q-ft-del" onClick={onDelete} title="Delete" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </button>
          <div className="gf-q-ft-divider" />
          <label className="gf-q-required-label">
            Required
            <div className={`gf-q-tog${question.isRequired?' gf-q-tog--on':''}`} onClick={()=>set({isRequired:!question.isRequired})}>
              <div className="gf-q-tog-knob"/>
            </div>
          </label>

          {/* ⋮ Three-dot menu */}
          <div className="gf-q-menu-wrap" ref={menuRef}>
            <button
              className="gf-q-ft-btn gf-q-menu-btn"
              type="button"
              onClick={() => setMenuOpen(o => !o)}
              title="More options"
            >⋮</button>
            {menuOpen && (
              <div className="gf-q-menu-dropdown">
                <button className="gf-q-menu-item" type="button" onClick={toggleDescription}>
                  {showDesc ? '✓ ' : ''}Description
                </button>
                {HAS_VALIDATION.includes(question.type) && (
                  <button className="gf-q-menu-item" type="button" onClick={toggleValidation}>
                    {showValidate ? '✓ ' : ''}Response validation
                  </button>
                )}
                <button className="gf-q-menu-item gf-q-menu-item--muted" type="button" disabled>
                  Shuffle option order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
