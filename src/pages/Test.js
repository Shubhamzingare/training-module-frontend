import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/TestTakingInterface.css';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Test = () => {
  const { testSessionId } = useParams();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('testId');
  const navigate = useNavigate();

  const [test,          setTest]          = useState(null);
  const [questions,     setQuestions]     = useState([]);
  const [answers,       setAnswers]       = useState({});
  const [timeLeft,      setTimeLeft]      = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [submitted,     setSubmitted]     = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [errors,        setErrors]        = useState([]);
  const [sessionStarted,setSessionStarted]= useState(false);

  // Fetch test
  useEffect(() => {
    if (!testId) { setLoading(false); return; }
    fetch(`${BASE}/api/public/tests/${testId}`)
      .then(r => r.json())
      .then(d => {
        setTest(d.data);
        setTimeLeft((d.data.timeLimit || 30) * 60);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [testId]);

  // Fetch questions
  useEffect(() => {
    if (!test || !testId) return;
    fetch(`${BASE}/api/public/tests/${testId}/questions`)
      .then(r => r.json())
      .then(d => {
        const list = test.shuffleQuestions ? shuffleArray([...d.data]) : d.data;
        setQuestions(list);
        const init = {};
        list.forEach(q => {
          init[q._id] = q.type === 'checkbox' ? [] : (q.type === 'mcq' ? null : '');
        });
        setAnswers(init);
      })
      .catch(console.error);
  }, [test, testId]);

  // Submit answers
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (submitting) return;

    // Validate required questions
    const unanswered = [];
    questions.forEach((q, idx) => {
      const a = answers[q._id];
      if (q.isRequired) {
        if (a === null || a === '' || (Array.isArray(a) && a.length === 0)) {
          unanswered.push(idx);
        }
      }
    });

    if (unanswered.length > 0) {
      setErrors(unanswered);
      document.getElementById(`question-${unanswered[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = {};
      questions.forEach(q => {
        formattedAnswers[q._id] = answers[q._id];
      });

      const r = await fetch(`${BASE}/api/public/sessions/${testSessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: formattedAnswers }),
      });
      const data = await r.json();

      if (r.ok && data.data) {
        const user = JSON.parse(sessionStorage.getItem('testUser') || '{}');
        navigate('/result', {
          state: {
            score: data.data.score,
            totalMarks: test.totalMarks,
            passingMarks: test.passingMarks,
            isPassed: data.data.isPassed,
            name: user.name || 'User',
            testTitle: test.title,
            totalQuestions: questions.length,
            answeredCorrect: data.data.correctCount,
          }
        });
      } else {
        // Fallback: just show submitted state
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }, [answers, questions, submitting, testSessionId, test, navigate]);

  // Timer
  useEffect(() => {
    if (timeLeft === null || submitted || submitting) return;
    if (timeLeft <= 0) {
      if (test?.autoSubmitOnTimeEnd) handleSubmit();
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, submitted, submitting, test, handleSubmit]);

  const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  const handleAnswerChange = (qId, value) => setAnswers(prev => ({ ...prev, [qId]: value }));

  const handleCheckbox = (qId, optIdx) => {
    const cur = answers[qId] || [];
    setAnswers(prev => ({
      ...prev,
      [qId]: cur.includes(optIdx) ? cur.filter(i => i !== optIdx) : [...cur, optIdx],
    }));
  };

  const isAnswered = (qId) => {
    const a = answers[qId];
    if (a === null || a === '') return false;
    if (Array.isArray(a)) return a.length > 0;
    return true;
  };

  const answeredCount = questions.filter(q => isAnswered(q._id)).length;

  if (loading) return <div className="test-loading">Loading test...</div>;
  if (!test)   return <div className="test-error">Test not found.</div>;

  // Google Form test — show form directly, no splash screen
  if (test?.googleFormUrl && !loading) {
    // Auto-fix common URL mistakes:
    // /edit → /viewform, /closedform → /viewform
    let cleanUrl = test.googleFormUrl
      .replace(/\/edit(\?.*)?$/, '/viewform$1')
      .replace(/\/closedform(\?.*)?$/, '/viewform$1');

    const embedUrl = cleanUrl.includes('?')
      ? cleanUrl + '&embedded=true'
      : cleanUrl + '?embedded=true';

    return (
      <div className="test-interface">
        <header className="test-header">
          <div className="header-title"><h1>{test.title}</h1></div>
          <div className="header-timer" style={{fontSize:13,color:'#718096'}}>
            Google Form
          </div>
        </header>
        <iframe
          src={embedUrl}
          style={{width:'100%', height:'calc(100vh - 64px)', border:'none', display:'block'}}
          title={test.title}
          allow="camera; microphone"
        >
          Loading form...
        </iframe>
      </div>
    );
  }

  if (submitted) return (
    <div className="test-container">
      <div className="submission-success">
        <div className="success-icon">✓</div>
        <h2>Test Submitted</h2>
        <p>Your answers have been recorded.</p>
        <button onClick={() => navigate('/')} style={{marginTop:24,padding:'10px 24px',background:'#2c3e50',color:'white',border:'none',borderRadius:6,cursor:'pointer',fontSize:14}}>
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="test-interface">
      <header className="test-header">
        <div className="header-title"><h1>{test.title}</h1></div>
        <div className="header-timer">
          <span className={`timer ${timeLeft !== null && timeLeft < 300 ? 'warning' : ''}`}>
            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
          </span>
        </div>
      </header>

      <div className="test-container">
        <div className="test-content">
          <div className="instructions-card">
            <h3>Instructions</h3>
            <p>{test.description || 'Answer all questions to the best of your knowledge.'}</p>
            <p className="test-info">
              Total Questions: <strong>{questions.length}</strong> &nbsp;|&nbsp;
              Total Marks: <strong>{test.totalMarks}</strong> &nbsp;|&nbsp;
              Passing Marks: <strong>{test.passingMarks}</strong>
            </p>
          </div>

          {errors.length > 0 && (
            <div className="error-alert">
              <strong>Please answer all required questions before submitting.</strong>
              <p>{errors.length} required question(s) not answered.</p>
            </div>
          )}

          <div className="questions-container">
            {questions.map((q, idx) => (
              <div
                key={q._id}
                id={`question-${idx}`}
                className={`question-card ${errors.includes(idx) ? 'error' : ''} ${isAnswered(q._id) ? 'answered' : ''}`}
              >
                <div className="question-header">
                  <span className="question-number">Q{idx + 1} {q.isRequired && <span style={{color:'#e53e3e'}}>*</span>}</span>
                  <span className="question-marks">{q.marks} marks</span>
                </div>
                <p className="question-text">{q.questionText}</p>

                <div className="answer-section">
                  {q.type === 'mcq' && (
                    <div className="options-group">
                      {(q.options || []).map((opt, optIdx) => (
                        <label key={optIdx} className="option-label">
                          <input type="radio" name={`q-${q._id}`} checked={answers[q._id] === optIdx} onChange={() => handleAnswerChange(q._id, optIdx)} />
                          <span className="option-text">{opt.text}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === 'checkbox' && (
                    <div className="options-group">
                      {(q.options || []).map((opt, optIdx) => (
                        <label key={optIdx} className="option-label">
                          <input type="checkbox" checked={(answers[q._id] || []).includes(optIdx)} onChange={() => handleCheckbox(q._id, optIdx)} />
                          <span className="option-text">{opt.text}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {(q.type === 'shortAnswer' || q.type === 'short_answer') && (
                    <input type="text" className="short-answer-input" placeholder="Your answer" value={answers[q._id] || ''} onChange={e => handleAnswerChange(q._id, e.target.value)} />
                  )}
                  {(q.type === 'paragraph' || q.type === 'descriptive') && (
                    <textarea className="descriptive-answer-input" placeholder="Your answer" rows={4} value={answers[q._id] || ''} onChange={e => handleAnswerChange(q._id, e.target.value)} />
                  )}
                  {q.type === 'dropdown' && (
                    <select value={answers[q._id] || ''} onChange={e => handleAnswerChange(q._id, e.target.value)} className="short-answer-input">
                      <option value="">Select an option</option>
                      {(q.options || []).map((opt, i) => <option key={i} value={i}>{opt.text}</option>)}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="submit-section">
            <p className="answered-count">Answered: <strong>{answeredCount} / {questions.length}</strong></p>
            <button className="btn btn-submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Test'}
            </button>
          </div>
        </div>

        <aside className="question-navigator">
          <div className="nav-header">
            <h4>Questions</h4>
            <span className="nav-count">{answeredCount}/{questions.length}</span>
          </div>
          <div className="nav-list">
            {questions.map((q, idx) => (
              <a key={idx} href={`#question-${idx}`}
                className={`nav-item ${isAnswered(q._id) ? 'answered' : 'unanswered'} ${errors.includes(idx) ? 'error' : ''}`}>
                <span className="nav-number">{idx + 1}</span>
              </a>
            ))}
          </div>
          <div className="progress-section">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${questions.length ? (answeredCount/questions.length)*100 : 0}%` }} />
            </div>
            <small className="progress-text">{questions.length ? Math.round((answeredCount/questions.length)*100) : 0}% complete</small>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Test;
