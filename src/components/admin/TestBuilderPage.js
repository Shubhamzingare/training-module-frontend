import React, { useState, useEffect } from 'react';
import GoogleFormBuilder from './GoogleFormBuilder';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/GoogleFormBuilder.css';

const TestBuilderPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTestData();
  }, [testId]);

  const loadTestData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `/api/admin/tests/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to load test');

      const data = await response.json();
      setTest(data.data);
      setQuestions(data.data.questions || []);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Error loading test:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestions = async (questionsToSave) => {
    try {
      const token = localStorage.getItem('adminToken');

      // Delete existing questions
      const existingQuestions = questions.filter((q) => q._id);
      for (const q of existingQuestions) {
        await fetch(
          `/api/admin/tests/${testId}/questions/${q._id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Add new questions
      for (const question of questionsToSave) {
        const payload = {
          questionText: question.questionText,
          description: question.description,
          type: question.type,
          options: question.options,
          correctAnswer: question.correctAnswer,
          correctAnswers: question.correctAnswers,
          marks: question.marks,
          order: question.order,
          isRequired: question.isRequired,
          questionImage: question.questionImage,
          shuffleOptions: question.shuffleOptions,
          showOtherOption: question.showOtherOption,
          scaleMin: question.scaleMin,
          scaleMax: question.scaleMax,
          scaleMinLabel: question.scaleMinLabel,
          scaleMaxLabel: question.scaleMaxLabel,
          allowedFileTypes: question.allowedFileTypes,
          maxFileSize: question.maxFileSize,
        };

        const response = await fetch(
          `/api/admin/tests/${testId}/questions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || 'Failed to save question'
          );
        }
      }

      // Reload test data to show saved questions
      await loadTestData();
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="test-builder-page">
        <div className="loading">Loading test data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-builder-page">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/admin/tests')}>
          Back to Tests
        </button>
      </div>
    );
  }

  return (
    <div className="test-builder-page">
      <div className="test-builder-header">
        <button
          className="back-button"
          onClick={() => navigate('/admin/tests')}
        >
          ← Back
        </button>
        <div>
          <h1>{test?.title}</h1>
          {test?.description && (
            <p className="test-description">{test.description}</p>
          )}
        </div>
      </div>

      <GoogleFormBuilder
        testId={testId}
        initialQuestions={questions}
        onSave={handleSaveQuestions}
      />
    </div>
  );
};

export default TestBuilderPage;
