import api from "./api";

const categoryService = {
  /* =====================================================
     GET ALL CATEGORIES
  ===================================================== */

  getAll: async () => {
    const response = await api.get(
      "/categories"
    );

    return response.data;
  },

  /* =====================================================
     GET SINGLE CATEGORY
  ===================================================== */

  getById: async (id) => {
    const response = await api.get(
      `/categories/${id}`
    );

    return response.data;
  },

  /* =====================================================
     CREATE CATEGORY
  ===================================================== */

  create: async (data) => {
    const response = await api.post(
      "/categories",
      data
    );

    return response.data;
  },

  /* =====================================================
     UPDATE CATEGORY
  ===================================================== */

  update: async (id, data) => {
    const response = await api.put(
      `/categories/${id}`,
      data
    );

    return response.data;
  },

  /* =====================================================
     UPDATE CATEGORY STATUS
  ===================================================== */

  updateStatus: async (
    id,
    status
  ) => {
    const response = await api.patch(
      `/categories/${id}/status`,
      {
        status,
      }
    );

    return response.data;
  },

  /* =====================================================
     DELETE CATEGORY
  ===================================================== */

  remove: async (id) => {
    const response = await api.delete(
      `/categories/${id}`
    );

    return response.data;
  },
};

export default categoryService;