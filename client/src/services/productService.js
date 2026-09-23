import api from "./api";


/* ============================================================
   RESPONSE HELPER
============================================================ */

const getData = (response) => {
  return (
    response?.data ??
    response
  );
};


/* ============================================================
   PRODUCT SERVICE
============================================================ */

const productService = {

  /* ========================================================
     GET ALL
  ======================================================== */

  getAll: async () => {
    try {

      const response =
        await api.get(
          "/products"
        );

      return getData(
        response
      );

    } catch (error) {

      console.error(
        "Get products error:",
        error
      );

      throw error;
    }
  },


  /* ========================================================
     GET BY ID
  ======================================================== */

  getById: async (id) => {
    try {

      if (!id) {
        throw new Error(
          "Product ID is required."
        );
      }

      const response =
        await api.get(
          `/products/${id}`
        );

      return getData(
        response
      );

    } catch (error) {

      console.error(
        "Get product error:",
        error
      );

      throw error;
    }
  },


  /* ========================================================
     GET BY SLUG

     Used by:
     /products/:slug

     Example:
     /products/uv-printed-cartons
  ======================================================== */

  getBySlug: async (slug) => {
    try {

      if (!slug) {
        throw new Error(
          "Product slug is required."
        );
      }

      const response =
        await api.get(
          `/products/slug/${encodeURIComponent(
            slug
          )}`
        );

      return getData(
        response
      );

    } catch (error) {

      console.error(
        "Get product by slug error:",
        error
      );

      console.error(
        "Get product by slug response:",
        error?.response?.data
      );

      throw error;
    }
  },


  /* ========================================================
     CREATE
  ======================================================== */

  create: async (data) => {
    try {

      const response =
        await api.post(
          "/products",
          data
        );

      return getData(
        response
      );

    } catch (error) {

      console.error(
        "Create product error:",
        error
      );

      console.error(
        "Create product response:",
        error?.response?.data
      );

      throw error;
    }
  },


  /* ========================================================
     UPDATE
  ======================================================== */

  update: async (
    id,
    data
  ) => {
    try {

      if (!id) {
        throw new Error(
          "Product ID is required."
        );
      }

      const response =
        await api.put(
          `/products/${id}`,
          data
        );

      return getData(
        response
      );

    } catch (error) {

      console.error(
        "Update product error:",
        error
      );

      console.error(
        "Update product response:",
        error?.response?.data
      );

      throw error;
    }
  },


  /* ========================================================
     STATUS
  ======================================================== */

  updateStatus: async (
    id,
    status
  ) => {
    try {

      if (!id) {
        throw new Error(
          "Product ID is required."
        );
      }

      const response =
        await api.patch(
          `/products/${id}/status`,
          {
            status,
          }
        );

      return getData(
        response
      );

    } catch (error) {

      console.error(
        "Product status error:",
        error
      );

      console.error(
        "Product status response:",
        error?.response?.data
      );

      throw error;
    }
  },


  /* ========================================================
     DELETE PRODUCT
  ======================================================== */

  remove: async (id) => {
    try {

      if (!id) {
        throw new Error(
          "Product ID is required."
        );
      }

      const response =
        await api.delete(
          `/products/${id}`
        );

      return getData(
        response
      );

    } catch (error) {

      console.error(
        "Delete product error:",
        error
      );

      console.error(
        "Delete product response:",
        error?.response?.data
      );

      throw error;
    }
  },


  /* ========================================================
     ADD IMAGE

     Do not manually set multipart Content-Type.
     Axios/browser will add multipart boundary.
  ======================================================== */

  addImage: async (
    productId,
    imageFile,
    isPrimary = false
  ) => {

    if (!productId) {
      throw new Error(
        "Product ID is required."
      );
    }

    if (!imageFile) {
      throw new Error(
        "Product image is required."
      );
    }

    try {

      const formData =
        new FormData();

      formData.append(
        "image",
        imageFile
      );

      formData.append(
        "isPrimary",
        String(
          Boolean(
            isPrimary
          )
        )
      );

      const response =
        await api.post(
          `/products/${productId}/images`,
          formData
        );

      return getData(
        response
      );

    } catch (error) {

      console.error(
        "Product image upload error:",
        error
      );

      console.error(
        "Product image response:",
        error?.response?.data
      );

      throw error;
    }
  },


  /* ========================================================
     DELETE IMAGE
  ======================================================== */

  deleteImage: async (
    imageId
  ) => {

    if (!imageId) {
      throw new Error(
        "Image ID is required."
      );
    }

    try {

      const response =
        await api.delete(
          `/products/images/${imageId}`
        );

      return getData(
        response
      );

    } catch (error) {

      console.error(
        "Delete product image error:",
        error
      );

      console.error(
        "Delete product image response:",
        error?.response?.data
      );

      throw error;
    }
  },

};


/* ============================================================
   EXPORT
============================================================ */

export default productService;