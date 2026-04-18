/**
 * INTEGRATION EXAMPLE
 * Shows how to integrate Phase 2 components into existing QuestionBuilder and TestBuilderPage
 */

// ============================================================================
// EXAMPLE 1: Integrating AdvancedQuestionOptions into QuestionBuilder.js
// ============================================================================

import React, { useState } from 'react';
import QuestionOptions from './QuestionOptions';
import AdvancedQuestionOptions from './AdvancedQuestionOptions';  // NEW
import '../styles/GoogleFormBuilder.css';

const QuestionBuilder = ({
  question,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [expandedSection, setExpandedSection] = useState('basic');

  // ... existing code ...

  return (
    <div className="question-builder">
      {/* ... existing sections ... */}

      {/* Basic Options - existing component */}
      <QuestionOptions question={question} onUpdate={onUpdate} />

      {/* NEW: Advanced Options Section */}
      <div className="section">
        <div
          className="section-header"
          onClick={() =>
            setExpandedSection(
              expandedSection === 'advanced' ? '' : 'advanced'
            )
          }
        >
          <span className="section-title">Advanced Options</span>
          <span
            className={`expand-icon ${
              expandedSection === 'advanced' ? 'open' : ''
            }`}
          >
            ⌄
          </span>
        </div>

        {expandedSection === 'advanced' && (
          <div className="section-content">
            <AdvancedQuestionOptions
              question={question}
              onUpdate={onUpdate}
            />
          </div>
        )}
      </div>

      {/* ... rest of existing code ... */}
    </div>
  );
};

export default QuestionBuilder;

// ============================================================================
// EXAMPLE 2: Integrating All Phase 2 Components into TestBuilderPage.js
// ============================================================================

import React, { useState, useEffect } from 'react';
import GoogleFormBuilder from './GoogleFormBuilder';
import TestSettings from './TestSettings';  // NEW
import SectionBuilder from './SectionBuilder';  // NEW
import ConditionalLogic from './ConditionalLogic';  // NEW
import '../styles/GoogleFormBuilder.css';

const TestBuilderPage = ({ testId }) => {
  const [test, setTest] = useState({
    title: '',
    description: '',
    totalMarks: 100,
    passingMarks: 50,
    timeLimit: 0,
    shuffleQuestions: false,
    showProgressBar: true,
    responseVisibility: 'scoreOnly',
  });

  const [sections, setSections] = useState([]);  // NEW
  const [questions, setQuestions] = useState([]);
  const [conditions, setConditions] = useState([]);  // NEW
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load test data
  useEffect(() => {
    const loadTest = async () => {
      try {
        const response = await fetch(`/api/tests/${testId}`);
        const data = await response.json();

        setTest(data);
        setSections(data.sections || []);
        setQuestions(data.questions || []);
        setConditions(data.conditions || []);
      } catch (error) {
        console.error('Failed to load test:', error);
      }
    };

    if (testId) {
      loadTest();
    }
  }, [testId]);

  // Save all test data
  const handleSaveTest = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Validate test
      if (!test.title.trim()) {
        setSaveMessage('Please enter a test title');
        return;
      }

      if (questions.length === 0) {
        setSaveMessage('Please add at least one question');
        return;
      }

      if (test.passingMarks > test.totalMarks) {
        setSaveMessage('Passing marks cannot exceed total marks');
        return;
      }

      // Prepare test payload with all Phase 2 data
      const testPayload = {
        ...test,
        sections,     // From SectionBuilder
        questions,    // With answerKey, feedback, validation from AdvancedQuestionOptions
        conditions,   // From ConditionalLogic
      };

      // Assign section IDs to questions if needed
      const questionsWithSections = testPayload.questions.map((q) => ({
        ...q,
        sectionId: q.sectionId || sections[0]?.id,
      }));

      const response = await fetch('/api/tests', {
        method: testId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...testPayload,
          questions: questionsWithSections,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save test');
      }

      setSaveMessage('Test saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="test-builder-page">
      <div className="page-header">
        <h1>Test Builder</h1>
        <button
          className="btn btn-success"
          onClick={handleSaveTest}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Test'}
        </button>
      </div>

      {saveMessage && (
        <div className={`message ${saveMessage.includes('Error') ? 'error' : 'success'}`}>
          {saveMessage}
        </div>
      )}

      <div className="builder-container">
        {/* NEW: Test Settings Panel */}
        <div className="settings-panel">
          <h2>Test Configuration</h2>
          <TestSettings
            test={test}
            onUpdate={(updated) => setTest(updated)}
          />
        </div>

        {/* NEW: Section Builder */}
        <div className="sections-panel">
          <h2>Organize Questions</h2>
          <SectionBuilder
            sections={sections}
            onUpdate={(updated) => setSections(updated)}
          />
        </div>

        {/* Existing: Question Builder */}
        <div className="questions-panel">
          <h2>Questions</h2>
          <GoogleFormBuilder
            testId={testId}
            initialQuestions={questions}
            onSave={(updated) => setQuestions(updated)}
          />
        </div>

        {/* NEW: Conditional Logic */}
        <div className="logic-panel">
          <h2>Skip Logic</h2>
          <ConditionalLogic
            conditions={conditions}
            questions={questions}
            onUpdate={(updated) => setConditions(updated)}
          />
        </div>
      </div>
    </div>
  );
};

export default TestBuilderPage;

// ============================================================================
// EXAMPLE 3: Data Flow - How to Handle Complete Test Submission
// ============================================================================

const completeTestExample = {
  // From TestSettings
  title: "JavaScript Fundamentals Quiz",
  description: "Test your knowledge of JavaScript basics and ES6 features",
  totalMarks: 100,
  passingMarks: 60,
  timeLimit: 45,
  shuffleQuestions: true,
  shuffleAnswers: true,
  showQuestionNumbers: true,
  allowMultipleAttempts: false,
  maxAttempts: 1,
  responseVisibility: "fullFeedback",
  autoSubmitOnTimeEnd: true,
  requireEmailBeforeTest: true,
  showProgressBar: true,
  randomizeOrder: false,
  showCorrectAnswer: true,
  customFeedbackText: "Thank you for completing the quiz! Check your answers above.",

  // From SectionBuilder
  sections: [
    {
      id: "section-1713456789001",
      title: "Basic Concepts",
      description: "Fundamentals of JavaScript",
      order: 0,
    },
    {
      id: "section-1713456789002",
      title: "ES6+ Features",
      description: "Modern JavaScript syntax",
      order: 1,
    },
  ],

  // From GoogleFormBuilder + AdvancedQuestionOptions
  questions: [
    {
      id: "q-1",
      sectionId: "section-1713456789001",
      questionText: "What is a variable?",
      description: "Choose the best description",
      type: "mcq",
      marks: 5,
      isRequired: true,
      options: [
        { id: "opt-1", text: "A container for storing values", isCorrect: true },
        { id: "opt-2", text: "A function in JavaScript", isCorrect: false },
        { id: "opt-3", text: "A loop statement", isCorrect: false },
      ],

      // From AdvancedQuestionOptions
      answerKey: "A variable is a named container that holds a value. In JavaScript, variables are declared using var, let, or const keywords.",
      feedback: "Correct! Variables are fundamental to programming.",
      validation: {
        type: "text",
        minLength: 10,
      },
    },
    {
      id: "q-2",
      sectionId: "section-1713456789002",
      questionText: "What does ES6 stand for?",
      type: "shortAnswer",
      marks: 5,
      isRequired: true,

      // From AdvancedQuestionOptions
      answerKey: "ES6 (ECMAScript 6) is the 6th version of the JavaScript standard, also known as ES2015 or ECMAScript 2015.",
      feedback: "Great! You know your JavaScript history.",
      validation: {
        type: "text",
        minLength: 20,
      },
    },
  ],

  // From ConditionalLogic
  conditions: [
    {
      id: "condition-1",
      triggerQuestionId: "q-1",
      condition: "equals",
      value: "A container for storing values",
      targetQuestionId: "q-2",
      action: "show",
    },
  ],
};

// ============================================================================
// EXAMPLE 4: CSS Import in main components
// ============================================================================

// In your main CSS file or component:
// import '../styles/AdvancedOptions.css';

// Or in the components directly (already done in Phase 2 components):
// import '../../styles/AdvancedOptions.css';

// ============================================================================
// EXAMPLE 5: Handling Conditional Logic in Test Rendering
// ============================================================================

const evaluateConditions = (questionId, conditions, userAnswers) => {
  /**
   * Evaluates whether a question should be shown based on conditions
   * @param {string} questionId - The question to evaluate
   * @param {Array} conditions - All conditions from ConditionalLogic
   * @param {Object} userAnswers - User's answers so far
   * @returns {boolean} - Whether question should be visible
   */

  // Find all conditions that target this question
  const affectingConditions = conditions.filter(
    (c) => c.targetQuestionId === questionId
  );

  if (affectingConditions.length === 0) {
    // No conditions affect this question, always show
    return true;
  }

  let shouldShow = true;

  for (const condition of affectingConditions) {
    const triggerAnswer = userAnswers[condition.triggerQuestionId];
    let conditionMet = false;

    switch (condition.condition) {
      case 'equals':
        conditionMet = triggerAnswer === condition.value;
        break;
      case 'notEquals':
        conditionMet = triggerAnswer !== condition.value;
        break;
      case 'contains':
        conditionMet = String(triggerAnswer).includes(condition.value);
        break;
      case 'greaterThan':
        conditionMet = Number(triggerAnswer) > Number(condition.value);
        break;
      case 'lessThan':
        conditionMet = Number(triggerAnswer) < Number(condition.value);
        break;
      case 'greaterThanOrEqual':
        conditionMet = Number(triggerAnswer) >= Number(condition.value);
        break;
      case 'lessThanOrEqual':
        conditionMet = Number(triggerAnswer) <= Number(condition.value);
        break;
      default:
        conditionMet = false;
    }

    // Apply action based on condition result
    switch (condition.action) {
      case 'show':
        shouldShow = shouldShow && conditionMet;
        break;
      case 'hide':
        shouldShow = shouldShow && !conditionMet;
        break;
      case 'require':
        // For require, field will be marked required if condition is met
        break;
      default:
        break;
    }
  }

  return shouldShow;
};

// Usage in test rendering:
// const visibleQuestions = questions.filter((q) =>
//   evaluateConditions(q.id, conditions, userAnswers)
// );

export {
  QuestionBuilder,
  TestBuilderPage,
  evaluateConditions,
  completeTestExample,
};
