import api from "./api";


/* ============================================================
   NORMALIZE RESPONSE
============================================================ */

const getResponseData = (response) => {
  return response?.data ?? response;
};


/* ============================================================
   PRODUCT SERVICE
============================================================ */

const productService = {

  /* ==========================================================
     GET ALL PRODUCTS
  ========================================================== */

  getAll: async () => {
    try {

      const response =
        await api.get(
          "/products"
        );

      return getResponseData(
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


  /* ==========================================================
     GET PRODUCT BY ID
  ========================================================== */

  getById: async (id) => {
    try {

      const response =
        await api.get(
          `/products/${id}`
        );

      return getResponseData(
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


  /* ==========================================================
     CREATE PRODUCT
  ========================================================== */

  create: async (data) => {
    try {

      const response =
        await api.post(
          "/products",
          data
        );

      return getResponseData(
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


  /* ==========================================================
     UPDATE PRODUCT
  ========================================================== */

  update: async (
    id,
    data
  ) => {
    try {

      const response =
        await api.put(
          `/products/${id}`,
          data
        );

      return getResponseData(
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


  /* ==========================================================
     UPDATE PRODUCT STATUS
  ========================================================== */

  updateStatus: async (
    id,
    status
  ) => {
    try {

      const response =
        await api.patch(
          `/products/${id}/status`,
          {
            status,
          }
        );

      return getResponseData(
        response
      );

    } catch (error) {

      console.error(
        "Update product status error:",
        error
      );

      console.error(
        "Update status response:",
        error?.response?.data
      );

      throw error;

    }
  },


  /* ==========================================================
     DELETE PRODUCT
  ========================================================== */

  remove: async (id) => {
    try {

      const response =
        await api.delete(
          `/products/${id}`
        );

      return getResponseData(
        response
      );

    } catch (error) {

      console.error(
        "Delete product error:",
        error
      );

      throw error;

    }
  },


  /* ==========================================================
     ADD PRODUCT IMAGE
  ========================================================== */

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


      /*
       * IMPORTANT:
       *
       * Your backend multer field
       * should also be:
       *
       * upload.single("image")
       */

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


      return getResponseData(
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


  /* ==========================================================
     DELETE PRODUCT IMAGE
  ========================================================== */

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


      return getResponseData(
        response
      );

    } catch (error) {

      console.error(
        "Delete product image error:",
        error
      );

      throw error;

    }

  },

};



export default productService;