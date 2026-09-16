
import api from "./api";

const enquiryService = {
  // ============================================
  // GET ALL ENQUIRIES - ADMIN
  // GET /api/enquiries
  // ============================================
  getAll: async (params = {}) => {
    const response = await api.get("/enquiries", {
      params,
    });

    return response.data;
  },

  // ============================================
  // GET SINGLE ENQUIRY
  // GET /api/enquiries/:id
  // ============================================
  getById: async (id) => {
    const response = await api.get(
      `/enquiries/${id}`
    );

    return response.data;
  },

  // ============================================
  // UPDATE ENQUIRY STATUS
  // PATCH /api/enquiries/:id/status
  // ============================================
  updateStatus: async (id, status) => {
    const response = await api.patch(
      `/enquiries/${id}/status`,
      {
        status,
      }
    );

    return response.data;
  },

  // ============================================
  // DELETE ENQUIRY
  // DELETE /api/enquiries/:id
  // ============================================
  remove: async (id) => {
    const response = await api.delete(
      `/enquiries/${id}`
    );

    return response.data;
  },
};

export default enquiryService;
