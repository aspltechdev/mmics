// client/src/services/heroSlideService.js

import api from "./api";


const heroSlideService = {

  /* ============================================================
     PUBLIC
     GET ACTIVE HERO SLIDES
     ============================================================ */

  getAll: async () => {
    try {
      const response =
        await api.get(
          "/hero-slides"
        );

      return response.data;
    } catch (error) {
      console.error(
        "PUBLIC HERO API ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );

      throw error;
    }
  },


  /* ============================================================
     ADMIN
     GET ALL HERO SLIDES
     ============================================================ */

  getAllAdmin: async () => {
    try {
      const response =
        await api.get(
          "/hero-slides/admin/all"
        );

      return response.data;
    } catch (error) {
      console.error(
        "ADMIN HERO API ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );

      throw error;
    }
  },


  /* ============================================================
     GET ONE
     ============================================================ */

  getById: async (id) => {
    try {
      const response =
        await api.get(
          `/hero-slides/${id}`
        );

      return response.data;
    } catch (error) {
      console.error(
        "GET HERO API ERROR:",
        error
      );

      throw error;
    }
  },


  /* ============================================================
     CREATE
     ============================================================ */

  create: async (data) => {
    try {
      const formData =
        new FormData();


      formData.append(
        "title",
        data.title?.trim() || ""
      );


      formData.append(
        "subtitle",
        data.subtitle?.trim() ||
          ""
      );


      formData.append(
        "description",
        data.description?.trim() ||
          ""
      );


      formData.append(
        "buttonText",
        data.buttonText?.trim() ||
          ""
      );


      formData.append(
        "buttonUrl",
        data.buttonUrl?.trim() ||
          ""
      );


      formData.append(
        "sortOrder",
        String(
          data.sortOrder ?? 0
        )
      );


      formData.append(
        "isActive",
        data.isActive
          ? "true"
          : "false"
      );


      /* ========================================================
         IMAGE
         ======================================================== */

      if (
        !(data.image instanceof File)
      ) {
        console.error(
          "Hero image is NOT a File:",
          data.image
        );

        throw new Error(
          "Please select a valid hero image."
        );
      }


      console.log(
        "========== HERO UPLOAD =========="
      );

      console.log(
        "Image name:",
        data.image.name
      );

      console.log(
        "Image type:",
        data.image.type
      );

      console.log(
        "Image size:",
        data.image.size
      );

      console.log(
        "================================="
      );


      formData.append(
        "image",
        data.image,
        data.image.name
      );


      /*
        IMPORTANT:

        Do NOT manually set:

        Content-Type: multipart/form-data

        Axios/browser will automatically
        add the correct multipart boundary.
      */

      const response =
        await api.post(
          "/hero-slides",
          formData
        );


      return response.data;

    } catch (error) {

      console.error(
        "HERO CREATE API ERROR:",
        error
      );


      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );


      throw error;
    }
  },


  /* ============================================================
     UPDATE
     ============================================================ */

  update: async (
    id,
    data
  ) => {
    try {

      const formData =
        new FormData();


      formData.append(
        "title",
        data.title?.trim() || ""
      );


      formData.append(
        "subtitle",
        data.subtitle?.trim() ||
          ""
      );


      formData.append(
        "description",
        data.description?.trim() ||
          ""
      );


      formData.append(
        "buttonText",
        data.buttonText?.trim() ||
          ""
      );


      formData.append(
        "buttonUrl",
        data.buttonUrl?.trim() ||
          ""
      );


      formData.append(
        "sortOrder",
        String(
          data.sortOrder ?? 0
        )
      );


      formData.append(
        "isActive",
        data.isActive
          ? "true"
          : "false"
      );


      /* ========================================================
         OPTIONAL REPLACEMENT IMAGE
         ======================================================== */

      if (
        data.image instanceof File
      ) {
        formData.append(
          "image",
          data.image,
          data.image.name
        );
      }


      const response =
        await api.put(
          `/hero-slides/${id}`,
          formData
        );


      return response.data;

    } catch (error) {

      console.error(
        "HERO UPDATE API ERROR:",
        error
      );


      console.error(
        "SERVER RESPONSE:",
        error?.response?.data
      );


      throw error;
    }
  },


  /* ============================================================
     ACTIVE / INACTIVE
     ============================================================ */

  updateStatus: async (
    id,
    isActive
  ) => {

    try {

      const response =
        await api.patch(
          `/hero-slides/${id}/status`,
          {
            isActive:
              Boolean(isActive),
          }
        );


      return response.data;

    } catch (error) {

      console.error(
        "HERO STATUS API ERROR:",
        error
      );


      throw error;
    }
  },


  /* ============================================================
     REORDER
     ============================================================ */

  reorder: async (slides) => {

    try {

      const response =
        await api.patch(
          "/hero-slides/reorder",
          {
            slides,
          }
        );


      return response.data;

    } catch (error) {

      console.error(
        "HERO REORDER API ERROR:",
        error
      );


      throw error;
    }
  },


  /* ============================================================
     DELETE
     ============================================================ */

  remove: async (id) => {

    try {

      const response =
        await api.delete(
          `/hero-slides/${id}`
        );


      return response.data;

    } catch (error) {

      console.error(
        "HERO DELETE API ERROR:",
        error
      );


      throw error;
    }
  },

};


export default heroSlideService;