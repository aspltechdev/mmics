
// import api from "./api";

// const productService = {
//   // =========================================
//   // GET ALL PRODUCTS
//   // GET /api/products
//   // =========================================
//   getAll: async (params = {}) => {
//     const response = await api.get("/products", {
//       params,
//     });

//     return response.data;
//   },

//   // =========================================
//   // GET PRODUCT BY ID
//   // GET /api/products/:id
//   // =========================================
//   getById: async (id) => {
//     const response = await api.get(
//       `/products/${id}`
//     );

//     return response.data;
//   },

//   // =========================================
//   // GET PRODUCT BY SLUG
//   // GET /api/products/slug/:slug
//   // =========================================
//   getBySlug: async (slug) => {
//     const response = await api.get(
//       `/products/slug/${slug}`
//     );

//     return response.data;
//   },

//   // =========================================
//   // CREATE PRODUCT
//   // POST /api/products
//   // =========================================
//   create: async (data) => {
//     const response = await api.post(
//       "/products",
//       data
//     );

//     return response.data;
//   },

//   // =========================================
//   // UPDATE PRODUCT
//   // PUT /api/products/:id
//   // =========================================
//   update: async (id, data) => {
//     const response = await api.put(
//       `/products/${id}`,
//       data
//     );

//     return response.data;
//   },

//   // =========================================
//   // UPDATE PRODUCT STATUS
//   // PATCH /api/products/:id/status
//   // =========================================
//   updateStatus: async (id, status) => {
//     const response = await api.patch(
//       `/products/${id}/status`,
//       {
//         status,
//       }
//     );

//     return response.data;
//   },

//   // =========================================
//   // ADD PRODUCT IMAGE
//   // POST /api/products/:id/images
//   // =========================================
//   addImage: async (id, data) => {
//     const response = await api.post(
//       `/products/${id}/images`,
//       data
//     );

//     return response.data;
//   },

//   // =========================================
//   // DELETE PRODUCT IMAGE
//   // DELETE /api/products/images/:imageId
//   // =========================================
//   deleteImage: async (imageId) => {
//     const response = await api.delete(
//       `/products/images/${imageId}`
//     );

//     return response.data;
//   },

//   // =========================================
//   // DELETE PRODUCT
//   // DELETE /api/products/:id
//   // =========================================
//   remove: async (id) => {
//     const response = await api.delete(
//       `/products/${id}`
//     );

//     return response.data;
//   },
// };

// export default productService;




import api from "./api";

const productService = {
  // =========================================
  // GET ALL PRODUCTS
  // GET /api/products
  // =========================================
  getAll: async (params = {}) => {
    const response = await api.get("/products", {
      params,
    });

    return response.data;
  },

  // =========================================
  // GET PRODUCT BY ID
  // GET /api/products/:id
  // =========================================
  getById: async (id) => {
    const response = await api.get(
      `/products/${id}`
    );

    return response.data;
  },

  // =========================================
  // GET PRODUCT BY SLUG
  // GET /api/products/slug/:slug
  // =========================================
  getBySlug: async (slug) => {
    const response = await api.get(
      `/products/slug/${slug}`
    );

    return response.data;
  },

  // =========================================
  // CREATE PRODUCT
  // POST /api/products
  // =========================================
  create: async (data) => {
    const response = await api.post(
      "/products",
      data
    );

    return response.data;
  },

  // =========================================
  // UPDATE PRODUCT
  // PUT /api/products/:id
  // =========================================
  update: async (id, data) => {
    const response = await api.put(
      `/products/${id}`,
      data
    );

    return response.data;
  },

  // =========================================
  // UPDATE PRODUCT STATUS
  // PATCH /api/products/:id/status
  // =========================================
  updateStatus: async (id, status) => {
    const response = await api.patch(
      `/products/${id}/status`,
      {
        status,
      }
    );

    return response.data;
  },

  // =========================================
  // ADD PRODUCT IMAGE - FILE UPLOAD
  // POST /api/products/:id/images
  // =========================================
  addImage: async (
    id,
    file,
    isPrimary = false
  ) => {
    const formData = new FormData();

    formData.append("image", file);
    formData.append(
      "isPrimary",
      String(isPrimary)
    );

    const response = await api.post(
      `/products/${id}/images`,
      formData
    );

    return response.data;
  },

  // =========================================
  // DELETE PRODUCT IMAGE
  // DELETE /api/products/images/:imageId
  // =========================================
  deleteImage: async (imageId) => {
    const response = await api.delete(
      `/products/images/${imageId}`
    );

    return response.data;
  },

  // =========================================
  // DELETE PRODUCT
  // DELETE /api/products/:id
  // =========================================
  remove: async (id) => {
    const response = await api.delete(
      `/products/${id}`
    );

    return response.data;
  },
};

export default productService;

