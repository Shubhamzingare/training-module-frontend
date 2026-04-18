/**
 * Question Type Examples for Google Forms Replica
 *
 * This file demonstrates all 10 question types with complete configuration
 * Use these as templates when creating new questions
 */

export const QUESTION_TYPE_EXAMPLES = {
  mcq: {
    id: 'example-mcq',
    questionText: 'Which of the following is a programming language?',
    description: 'Select the correct option',
    type: 'mcq',
    marks: 1,
    isRequired: true,
    shuffleOptions: true,
    showOtherOption: false,
    options: [
      { id: '1', text: 'Python', isCorrect: true },
      { id: '2', text: 'Excel', isCorrect: false },
      { id: '3', text: 'Photoshop', isCorrect: false },
      { id: '4', text: 'Word', isCorrect: false },
    ],
    correctAnswer: '1',
  },

  checkbox: {
    id: 'example-checkbox',
    questionText: 'Select all programming languages',
    description: 'Multiple answers are correct',
    type: 'checkbox',
    marks: 2,
    isRequired: true,
    shuffleOptions: true,
    options: [
      { id: '1', text: 'Python', isCorrect: true },
      { id: '2', text: 'JavaScript', isCorrect: true },
      { id: '3', text: 'HTML', isCorrect: false },
      { id: '4', text: 'CSS', isCorrect: false },
    ],
    correctAnswers: ['1', '2'],
  },

  dropdown: {
    id: 'example-dropdown',
    questionText: 'Select your department',
    description: 'Choose from the list',
    type: 'dropdown',
    marks: 1,
    isRequired: true,
    options: [
      { id: '1', text: 'Engineering', isCorrect: false },
      { id: '2', text: 'Sales', isCorrect: false },
      { id: '3', text: 'Marketing', isCorrect: false },
      { id: '4', text: 'HR', isCorrect: false },
    ],
  },

  linearScale: {
    id: 'example-linearScale',
    questionText: 'How satisfied are you with our service?',
    description: 'Rate your experience on a scale',
    type: 'linearScale',
    marks: 1,
    isRequired: false,
    scaleMin: 1,
    scaleMax: 5,
    scaleMinLabel: 'Not Satisfied',
    scaleMaxLabel: 'Very Satisfied',
  },

  shortAnswer: {
    id: 'example-shortAnswer',
    questionText: 'What is your full name?',
    description: 'Enter your first and last name',
    type: 'shortAnswer',
    marks: 1,
    isRequired: true,
  },

  paragraph: {
    id: 'example-paragraph',
    questionText: 'Describe your experience with our platform',
    description: 'Write in detail about your experience',
    type: 'paragraph',
    marks: 5,
    isRequired: false,
  },

  date: {
    id: 'example-date',
    questionText: 'When did you join our company?',
    description: 'Select the date from the calendar',
    type: 'date',
    marks: 1,
    isRequired: true,
  },

  time: {
    id: 'example-time',
    questionText: 'What is your preferred meeting time?',
    description: 'Select a time from the time picker',
    type: 'time',
    marks: 1,
    isRequired: false,
  },

  fileUpload: {
    id: 'example-fileUpload',
    questionText: 'Upload your resume',
    description: 'Please upload your resume in PDF or DOC format',
    type: 'fileUpload',
    marks: 1,
    isRequired: true,
    allowedFileTypes: ['pdf', 'doc', 'docx'],
    maxFileSize: 5, // 5 MB
  },

  duration: {
    id: 'example-duration',
    questionText: 'How long did the task take?',
    description: 'Enter duration in hours and minutes',
    type: 'duration',
    marks: 1,
    isRequired: false,
  },
};

/**
 * Detailed Feature Summary by Question Type
 */
export const QUESTION_TYPE_FEATURES = {
  mcq: {
    label: 'Multiple Choice',
    icon: '◉',
    description: 'Single selection from multiple options',
    features: [
      'Radio button interface',
      'Shuffle options enabled/disabled',
      'Add "Other" option',
      'Set correct answer',
      'Single correct answer only',
    ],
    use_cases: [
      'Knowledge checks',
      'Quizzes and exams',
      'Single best answer questions',
      'Yes/No questions',
    ],
  },

  checkbox: {
    label: 'Checkboxes',
    icon: '☑',
    description: 'Multiple selections from options',
    features: [
      'Checkbox interface',
      'Multiple correct answers',
      'Shuffle options',
      'Add "Other" option',
      'Allow multiple selections',
    ],
    use_cases: [
      'Select all that apply',
      'Multi-select questionnaires',
      'Feature selection',
      'Skill assessments',
    ],
  },

  dropdown: {
    label: 'Dropdown',
    icon: '▼',
    description: 'Select from dropdown list',
    features: [
      'Dropdown/select interface',
      'Clean, space-saving design',
      'Single or multiple selection',
      'Alphabetically sorted options',
      'Add "Other" option',
    ],
    use_cases: [
      'Department selection',
      'Category selection',
      'Status selection',
      'Long list of options',
    ],
  },

  linearScale: {
    label: 'Linear Scale',
    icon: '1→10',
    description: 'Rate on a numerical scale',
    features: [
      'Customizable min/max values',
      'Optional min/max labels',
      ' 1-10 rating scale',
      'Clear visual representation',
      'Survey-friendly',
    ],
    use_cases: [
      'Satisfaction surveys',
      'Agreement scales',
      'Likert scales',
      'Rating questions',
      'NPS (Net Promoter Score)',
    ],
  },

  shortAnswer: {
    label: 'Short Answer',
    icon: 'A',
    description: 'Single line text input',
    features: [
      'Text input field',
      'Flexible answer format',
      'Mark as required/optional',
      'No character limit enforcement in form',
      'Simple text validation',
    ],
    use_cases: [
      'Name input',
      'Email addresses',
      'ID/Reference numbers',
      'Short text responses',
      'Free text answers with character constraints',
    ],
  },

  paragraph: {
    label: 'Paragraph',
    icon: '¶',
    description: 'Multi-line text input',
    features: [
      'Large text area',
      'Multi-line input',
      'Flexible paragraph responses',
      'No character limit in form',
      'Great for detailed feedback',
    ],
    use_cases: [
      'Open-ended feedback',
      'Experience descriptions',
      'Essay questions',
      'Detailed explanations',
      'Comment boxes',
    ],
  },

  date: {
    label: 'Date',
    icon: '📅',
    description: 'Date picker input',
    features: [
      'Calendar date picker',
      'YYYY-MM-DD format',
      'Easy date selection',
      'Mark as required/optional',
      'Date validation',
    ],
    use_cases: [
      'Date of birth',
      'Join date',
      'Event dates',
      'Appointment scheduling',
      'Historical dates',
    ],
  },

  time: {
    label: 'Time',
    icon: '⏰',
    description: 'Time picker input',
    features: [
      'Time picker interface',
      'HH:MM format',
      'AM/PM selection',
      'Easy time input',
      'Mark as required/optional',
    ],
    use_cases: [
      'Meeting times',
      'Preferred work hours',
      'Appointment times',
      'Event times',
      'Availability slots',
    ],
  },

  fileUpload: {
    label: 'File Upload',
    icon: '📎',
    description: 'Upload files with restrictions',
    features: [
      'File upload input',
      'Allowed file type restrictions',
      'Max file size limits',
      'Document verification',
      'Multiple file support',
    ],
    use_cases: [
      'Resume/CV upload',
      'Document submission',
      'Proof of qualification',
      'Assignment submission',
      'Media file upload',
    ],
  },

  duration: {
    label: 'Duration',
    icon: '⏱',
    description: 'Hours and minutes input',
    features: [
      'Hours and minutes input fields',
      'Time duration format',
      'Easy duration input',
      'Mark as required/optional',
      'Useful for time tracking',
    ],
    use_cases: [
      'Task duration tracking',
      'Time spent questions',
      'Project hours estimation',
      'Activity duration',
      'Time allocation',
    ],
  },
};

/**
 * Validation Rules for Different Question Types
 */
export const VALIDATION_RULES = {
  mcq: {
    requireOptions: true,
    minOptions: 2,
    maxOptions: null,
    requireCorrectAnswer: true,
    multipleCorrect: false,
  },

  checkbox: {
    requireOptions: true,
    minOptions: 2,
    maxOptions: null,
    requireCorrectAnswer: true,
    multipleCorrect: true,
  },

  dropdown: {
    requireOptions: true,
    minOptions: 2,
    maxOptions: null,
    requireCorrectAnswer: false,
    multipleCorrect: false,
  },

  linearScale: {
    requireOptions: false,
    scaleMin: 1,
    scaleMax: 10,
    allowCustomLabels: true,
  },

  shortAnswer: {
    requireOptions: false,
    maxLength: 1000,
    allowMultiline: false,
  },

  paragraph: {
    requireOptions: false,
    maxLength: 5000,
    allowMultiline: true,
  },

  date: {
    requireOptions: false,
    format: 'YYYY-MM-DD',
  },

  time: {
    requireOptions: false,
    format: '24-hour',
  },

  fileUpload: {
    requireOptions: false,
    requireFileTypes: true,
    maxFileSize: 100, // MB
  },

  duration: {
    requireOptions: false,
    format: 'HH:MM',
  },
};

/**
 * Template for creating new questions
 */
export const BLANK_QUESTION_TEMPLATE = (type = 'mcq') => ({
  id: `temp-${Date.now()}`,
  questionText: '',
  description: '',
  type,
  marks: 1,
  order: 0,
  isRequired: false,
  questionImage: null,
  shuffleOptions: false,
  showOtherOption: false,
  options:
    ['mcq', 'checkbox', 'dropdown'].includes(type)
      ? [
          { id: '1', text: '', isCorrect: false },
          { id: '2', text: '', isCorrect: false },
        ]
      : [],
  correctAnswer: null,
  correctAnswers: [],
  scaleMin: 1,
  scaleMax: 5,
  scaleMinLabel: '',
  scaleMaxLabel: '',
  allowedFileTypes: [],
  maxFileSize: 10,
});

/**
 * Test Data Builder for Quick Testing
 */
export const createTestWithAllQuestionTypes = (testId) => {
  const questions = Object.values(QUESTION_TYPE_EXAMPLES).map(
    (q, index) => ({
      ...q,
      testId,
      order: index,
    })
  );
  return questions;
};
