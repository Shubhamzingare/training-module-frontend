import api from './api';

const PERFORMANCE_ENDPOINT = '/performance';

const performanceService = {
  /**
   * Get user scores
   */
  getUserScores: async (filters = {}) => {
    try {
      const response = await api.get(`${PERFORMANCE_ENDPOINT}/scores`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get module analytics
   */
  getModuleAnalytics: async (moduleId) => {
    try {
      const response = await api.get(`${PERFORMANCE_ENDPOINT}/modules/${moduleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get batch analytics
   */
  getBatchAnalytics: async (batchId) => {
    try {
      const response = await api.get(`${PERFORMANCE_ENDPOINT}/batches/${batchId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get user's test score
   */
  getTestScore: async (testId) => {
    try {
      const response = await api.get(`${PERFORMANCE_ENDPOINT}/tests/${testId}/score`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all user's scores (for my scores page)
   */
  getMyScores: async (filters = {}) => {
    try {
      const response = await api.get(`${PERFORMANCE_ENDPOINT}/my-scores`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Export scores as CSV
   */
  exportScoresAsCSV: async (filters = {}) => {
    try {
      const response = await api.get(`${PERFORMANCE_ENDPOINT}/export/csv`, {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get performance statistics
   */
  getStatistics: async (filters = {}) => {
    try {
      const response = await api.get(`${PERFORMANCE_ENDPOINT}/statistics`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default performanceService;
