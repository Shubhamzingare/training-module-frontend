import api from './api';

const BATCH_ENDPOINT = '/batches';

const batchService = {
  /**
   * Get all batches
   */
  getAllBatches: async (filters = {}) => {
    try {
      const response = await api.get(BATCH_ENDPOINT, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get batch by ID
   */
  getBatchById: async (id) => {
    try {
      const response = await api.get(`${BATCH_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create a new batch
   */
  createBatch: async (batchData) => {
    try {
      const response = await api.post(BATCH_ENDPOINT, batchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update a batch
   */
  updateBatch: async (id, batchData) => {
    try {
      const response = await api.put(`${BATCH_ENDPOINT}/${id}`, batchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a batch
   */
  deleteBatch: async (id) => {
    try {
      const response = await api.delete(`${BATCH_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Assign modules to batch
   */
  assignModules: async (batchId, moduleIds) => {
    try {
      const response = await api.post(`${BATCH_ENDPOINT}/${batchId}/modules`, {
        moduleIds,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Add user to batch
   */
  addUser: async (batchId, userId) => {
    try {
      const response = await api.post(`${BATCH_ENDPOINT}/${batchId}/members`, {
        userId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Add multiple users to batch
   */
  addMultipleUsers: async (batchId, userIds) => {
    try {
      const response = await api.post(`${BATCH_ENDPOINT}/${batchId}/members/bulk`, {
        userIds,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Remove user from batch
   */
  removeUser: async (batchId, userId) => {
    try {
      const response = await api.delete(`${BATCH_ENDPOINT}/${batchId}/members/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get batch members
   */
  getBatchMembers: async (batchId) => {
    try {
      const response = await api.get(`${BATCH_ENDPOINT}/${batchId}/members`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get batch modules
   */
  getBatchModules: async (batchId) => {
    try {
      const response = await api.get(`${BATCH_ENDPOINT}/${batchId}/modules`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default batchService;
