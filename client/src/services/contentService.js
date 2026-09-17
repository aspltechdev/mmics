// client/src/services/contentService.js
import api from "./api";

const contentService = {
  /**
   * Fetch dynamic content for a specific page section.
   * @param {string} section - e.g., "about", "why-mmmics", "process"
   */
  getBySection: async (section) => {
    const response = await api.get(`/content/${section}`);
    return response.data;
  },
};

export default contentService;