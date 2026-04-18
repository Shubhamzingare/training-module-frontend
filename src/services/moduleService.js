import api from './api';

const MODULE_ENDPOINT = '/modules';

const moduleService = {
  /**
   * Get all modules
   */
  getAllModules: async (filters = {}) => {
    try {
      const response = await api.get(MODULE_ENDPOINT, { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get module by ID
   */
  getModuleById: async (id) => {
    try {
      const response = await api.get(`${MODULE_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create a new module
   */
  createModule: async (moduleData) => {
    try {
      const response = await api.post(MODULE_ENDPOINT, moduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update a module
   */
  updateModule: async (id, moduleData) => {
    try {
      const response = await api.put(`${MODULE_ENDPOINT}/${id}`, moduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete a module
   */
  deleteModule: async (id) => {
    try {
      const response = await api.delete(`${MODULE_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Upload file and create module
   */
  uploadFile: async (file, moduleMetadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      Object.keys(moduleMetadata).forEach((key) => {
        formData.append(key, moduleMetadata[key]);
      });

      const response = await api.post(`${MODULE_ENDPOINT}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Activate/Deactivate a module
   */
  toggleModuleStatus: async (id, isActive) => {
    try {
      const response = await api.patch(`${MODULE_ENDPOINT}/${id}/status`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get module content (key points, FAQs)
   */
  getModuleContent: async (id) => {
    try {
      const response = await api.get(`${MODULE_ENDPOINT}/${id}/content`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default moduleService;
