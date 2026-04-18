/**
 * Test API Service
 * Provides helper functions for all test-related API calls
 */

const API_BASE_URL = 'http://localhost:5000/api';

class TestApi {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.adminBaseURL = `${API_BASE_URL}/admin`;
  }

  // Helper function to get auth token
  getAuthToken() {
    return localStorage.getItem('adminToken');
  }

  // Helper function to create headers with auth
  getHeaders(includeContentType = true) {
    const headers = {
      'Authorization': `Bearer ${this.getAuthToken()}`,
    };
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  // ============================================
  // TEST CRUD OPERATIONS
  // ============================================

  /**
   * Create a new test
   * @param {Object} testData - Test details
   * @returns {Promise<Object>} Created test
   */
  async createTest(testData) {
    const response = await fetch(`${this.adminBaseURL}/tests`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(testData),
    });
    if (!response.ok) throw new Error('Failed to create test');
    return response.json();
  }

  /**
   * Get all tests
   * @param {Object} filters - Optional filters (status, limit, skip, sort)
   * @returns {Promise<Object>} List of tests
   */
  async getTests(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.adminBaseURL}/tests?${params}`, {
      headers: this.getHeaders(false),
    });
    if (!response.ok) throw new Error('Failed to fetch tests');
    return response.json();
  }

  /**
   * Get a specific test with all its questions
   * @param {string} testId - Test ID
   * @returns {Promise<Object>} Test with questions
   */
  async getTest(testId) {
    const response = await fetch(`${this.adminBaseURL}/tests/${testId}`, {
      headers: this.getHeaders(false),
    });
    if (!response.ok) throw new Error('Failed to fetch test');
    return response.json();
  }

  /**
   * Update a test
   * @param {string} testId - Test ID
   * @param {Object} testData - Updated test data
   * @returns {Promise<Object>} Updated test
   */
  async updateTest(testId, testData) {
    const response = await fetch(`${this.adminBaseURL}/tests/${testId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(testData),
    });
    if (!response.ok) throw new Error('Failed to update test');
    return response.json();
  }

  /**
   * Delete a test
   * @param {string} testId - Test ID
   * @returns {Promise<Object>} Response
   */
  async deleteTest(testId) {
    const response = await fetch(`${this.adminBaseURL}/tests/${testId}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    if (!response.ok) throw new Error('Failed to delete test');
    return response.json();
  }

  /**
   * Toggle test status (draft/active)
   * @param {string} testId - Test ID
   * @returns {Promise<Object>} Updated test
   */
  async toggleTestStatus(testId) {
    const response = await fetch(`${this.adminBaseURL}/tests/${testId}/toggle-status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to toggle test status');
    return response.json();
  }

  // ============================================
  // QUESTION OPERATIONS
  // ============================================

  /**
   * Add a question to a test
   * @param {string} testId - Test ID
   * @param {Object} questionData - Question details
   * @returns {Promise<Object>} Created question
   */
  async addQuestion(testId, questionData) {
    const response = await fetch(`${this.adminBaseURL}/tests/${testId}/questions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(questionData),
    });
    if (!response.ok) throw new Error('Failed to add question');
    return response.json();
  }

  /**
   * Get all questions for a test
   * @param {string} testId - Test ID
   * @returns {Promise<Object>} List of questions
   */
  async getQuestions(testId) {
    const response = await fetch(`${this.adminBaseURL}/questions?testId=${testId}`, {
      headers: this.getHeaders(false),
    });
    if (!response.ok) throw new Error('Failed to fetch questions');
    return response.json();
  }

  /**
   * Update a question
   * @param {string} testId - Test ID
   * @param {string} questionId - Question ID
   * @param {Object} questionData - Updated question data
   * @returns {Promise<Object>} Updated question
   */
  async updateQuestion(testId, questionId, questionData) {
    const response = await fetch(
      `${this.adminBaseURL}/tests/${testId}/questions/${questionId}`,
      {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(questionData),
      }
    );
    if (!response.ok) throw new Error('Failed to update question');
    return response.json();
  }

  /**
   * Delete a question
   * @param {string} testId - Test ID
   * @param {string} questionId - Question ID
   * @returns {Promise<Object>} Response
   */
  async deleteQuestion(testId, questionId) {
    const response = await fetch(
      `${this.adminBaseURL}/tests/${testId}/questions/${questionId}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(false),
      }
    );
    if (!response.ok) throw new Error('Failed to delete question');
    return response.json();
  }

  // ============================================
  // SECTION OPERATIONS (Phase 2)
  // ============================================

  /**
   * Create a section within a test
   * @param {string} testId - Test ID
   * @param {Object} sectionData - Section details
   * @returns {Promise<Object>} Created section
   */
  async createSection(testId, sectionData) {
    const response = await fetch(`${this.adminBaseURL}/tests/${testId}/sections`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(sectionData),
    });
    if (!response.ok) throw new Error('Failed to create section');
    return response.json();
  }

  /**
   * Get all sections for a test
   * @param {string} testId - Test ID
   * @returns {Promise<Object>} List of sections
   */
  async getSections(testId) {
    const response = await fetch(`${this.adminBaseURL}/tests/${testId}/sections`, {
      headers: this.getHeaders(false),
    });
    if (!response.ok) throw new Error('Failed to fetch sections');
    return response.json();
  }

  /**
   * Update a section
   * @param {string} sectionId - Section ID
   * @param {Object} sectionData - Updated section data
   * @returns {Promise<Object>} Updated section
   */
  async updateSection(sectionId, sectionData) {
    const response = await fetch(`${this.adminBaseURL}/sections/${sectionId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(sectionData),
    });
    if (!response.ok) throw new Error('Failed to update section');
    return response.json();
  }

  /**
   * Delete a section
   * @param {string} sectionId - Section ID
   * @returns {Promise<Object>} Response
   */
  async deleteSection(sectionId) {
    const response = await fetch(`${this.adminBaseURL}/sections/${sectionId}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });
    if (!response.ok) throw new Error('Failed to delete section');
    return response.json();
  }

  // ============================================
  // PUBLIC TEST ENDPOINTS
  // ============================================

  /**
   * Get public test (without auth)
   * @param {string} testId - Test ID
   * @returns {Promise<Object>} Public test details
   */
  async getPublicTest(testId) {
    const response = await fetch(`${this.baseURL}/public/tests/${testId}`);
    if (!response.ok) throw new Error('Failed to fetch test');
    return response.json();
  }

  /**
   * Get public test questions (without auth)
   * @param {string} testId - Test ID
   * @returns {Promise<Object>} Test questions
   */
  async getPublicTestQuestions(testId) {
    const response = await fetch(`${this.baseURL}/public/tests/${testId}/questions`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return response.json();
  }

  /**
   * Get public departments list
   * @returns {Promise<Object>} List of departments
   */
  async getPublicDepartments() {
    const response = await fetch(`${this.baseURL}/public/departments`);
    if (!response.ok) throw new Error('Failed to fetch departments');
    return response.json();
  }

  /**
   * Get public shifts list
   * @returns {Promise<Object>} List of shifts
   */
  async getPublicShifts() {
    const response = await fetch(`${this.baseURL}/public/shifts`);
    if (!response.ok) throw new Error('Failed to fetch shifts');
    return response.json();
  }

  // ============================================
  // VALIDATION HELPERS
  // ============================================

  /**
   * Validate a question based on its type
   * @param {Object} question - Question object
   * @returns {Array} Array of validation errors (empty if valid)
   */
  validateQuestion(question) {
    const errors = [];

    if (!question.questionText || !question.questionText.trim()) {
      errors.push('Question text is required');
    }

    if (!question.type) {
      errors.push('Question type is required');
    }

    // Type-specific validation
    const typesThatNeedOptions = ['mcq', 'checkbox', 'dropdown'];
    if (typesThatNeedOptions.includes(question.type)) {
      if (!question.options || question.options.length < 2) {
        errors.push(`${question.type} questions need at least 2 options`);
      }
    }

    if (question.type === 'linearScale') {
      if (!question.scaleMin || !question.scaleMax) {
        errors.push('Linear scale needs min and max values');
      }
      if (question.scaleMin >= question.scaleMax) {
        errors.push('Min value must be less than max value');
      }
    }

    return errors;
  }

  /**
   * Validate test data
   * @param {Object} test - Test object
   * @returns {Array} Array of validation errors (empty if valid)
   */
  validateTest(test) {
    const errors = [];

    if (!test.title || !test.title.trim()) {
      errors.push('Test title is required');
    }

    if (!test.totalMarks || test.totalMarks < 1) {
      errors.push('Total marks must be greater than 0');
    }

    if (test.passingMarks < 0 || test.passingMarks > test.totalMarks) {
      errors.push('Passing marks must be between 0 and total marks');
    }

    if (!test.timeLimit || test.timeLimit < 1) {
      errors.push('Time limit must be at least 1 minute');
    }

    return errors;
  }
}

// Export singleton instance
export default new TestApi();
