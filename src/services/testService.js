import api from './api';

const TEST_ENDPOINT = '/tests';

const testService = {
  /**
   * Get all tests
   */
  getAllTests: async (filters = {}) => {
    try {
      const response = await api.get(TEST_ENDPOINT, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get test by ID
   */
  getTestById: async (id) => {
    try {
      const response = await api.get(`${TEST_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create a new test
   */
  createTest: async (testData) => {
    try {
      const response = await api.post(TEST_ENDPOINT, testData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update a test
   */
  updateTest: async (id, testData) => {
    try {
      const response = await api.put(`${TEST_ENDPOINT}/${id}`, testData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a test
   */
  deleteTest: async (id) => {
    try {
      const response = await api.delete(`${TEST_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Publish/Unpublish test
   */
  toggleTestPublish: async (id, isPublished) => {
    try {
      const response = await api.patch(`${TEST_ENDPOINT}/${id}/publish`, {
        isPublished,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Add question to test
   */
  addQuestion: async (testId, questionData) => {
    try {
      const response = await api.post(`${TEST_ENDPOINT}/${testId}/questions`, questionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update question in test
   */
  updateQuestion: async (testId, questionId, questionData) => {
    try {
      const response = await api.put(
        `${TEST_ENDPOINT}/${testId}/questions/${questionId}`,
        questionData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete question from test
   */
  deleteQuestion: async (testId, questionId) => {
    try {
      const response = await api.delete(
        `${TEST_ENDPOINT}/${testId}/questions/${questionId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Reorder questions
   */
  reorderQuestions: async (testId, questionOrder) => {
    try {
      const response = await api.patch(`${TEST_ENDPOINT}/${testId}/questions/reorder`, {
        order: questionOrder,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Submit test (user takes test)
   */
  submitTest: async (testId, answers) => {
    try {
      const response = await api.post(`${TEST_ENDPOINT}/${testId}/submit`, {
        answers,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get test attempt (user test results)
   */
  getTestAttempt: async (testId, attemptId) => {
    try {
      const response = await api.get(`${TEST_ENDPOINT}/${testId}/attempts/${attemptId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all attempts for a test
   */
  getTestAttempts: async (testId) => {
    try {
      const response = await api.get(`${TEST_ENDPOINT}/${testId}/attempts`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default testService;
