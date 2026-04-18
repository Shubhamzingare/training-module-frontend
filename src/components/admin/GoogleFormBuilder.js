import React, { useState, useEffect } from 'react';
import QuestionBuilder from './QuestionBuilder';

const GoogleFormBuilder = ({ testId, initialQuestions = [], onSave }) => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const handleAddQuestion = () => {
    const newQuestion = {
      id: `temp-${Date.now()}`,
      questionText: '',
      description: '',
      type: 'mcq',
      options: [{ id: '1', text: '', isCorrect: false }],
      marks: 1,
      isRequired: false,
      questionImage: null,
      shuffleOptions: false,
      showOtherOption: false,
      scaleMin: 1,
      scaleMax: 5,
      order: questions.length,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleUpdateQuestion = (questionId, updatedQuestion) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? updatedQuestion : q))
    );
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleMoveQuestion = (questionId, direction) => {
    const index = questions.findIndex((q) => q.id === questionId);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < questions.length - 1)
    ) {
      const newQuestions = [...questions];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newQuestions[index], newQuestions[targetIndex]] = [
        newQuestions[targetIndex],
        newQuestions[index],
      ];
      // Update order values
      newQuestions.forEach((q, i) => (q.order = i));
      setQuestions(newQuestions);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      // Validate questions
      const validQuestions = questions.filter(
        (q) => q.questionText && q.questionText.trim()
      );
      if (validQuestions.length === 0) {
        setSaveMessage('Please add at least one question');
        return;
      }

      // Update order before saving
      const questionsToSave = validQuestions.map((q, i) => ({
        ...q,
        order: i,
      }));

      await onSave(questionsToSave);
      setSaveMessage('Questions saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage(`Error saving questions: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="gfb-wrap">
      {questions.length === 0 && (
        <div className="gfb-empty">Click "+ Add Question" to add your first question</div>
      )}

      {questions.map((question, index) => (
        <QuestionBuilder
          key={question.id}
          question={question}
          onUpdate={(updated) => handleUpdateQuestion(question.id, updated)}
          onDelete={() => handleDeleteQuestion(question.id)}
          onMoveUp={() => handleMoveQuestion(question.id, 'up')}
          onMoveDown={() => handleMoveQuestion(question.id, 'down')}
          canMoveUp={index > 0}
          canMoveDown={index < questions.length - 1}
        />
      ))}

      <div className="gfb-actions">
        <button className="gfb-add-btn" onClick={handleAddQuestion}>
          + Add Question
        </button>
        <button className="gfb-save-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save Questions'}
        </button>
        {saveMessage && (
          <span className={`gfb-msg ${saveMessage.includes('Error') ? 'err' : 'ok'}`}>
            {saveMessage}
          </span>
        )}
      </div>
    </div>
  );
};

export default GoogleFormBuilder;
