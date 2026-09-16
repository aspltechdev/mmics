import api from "./api";

const heroSlideService = {
  getAll: async () => {
    const response = await api.get("/hero-slides");
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get("/hero-slides/admin/all");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/hero-slides/${id}`);
    return response.data;
  },

  create: async (data) => {
    try {
      const formData = new FormData();

      formData.append(
        "title",
        data.title?.trim() || ""
      );

      formData.append(
        "subtitle",
        data.subtitle?.trim() || ""
      );

      formData.append(
        "description",
        data.description?.trim() || ""
      );

      formData.append(
        "buttonText",
        data.buttonText?.trim() || ""
      );

      formData.append(
        "buttonUrl",
        data.buttonUrl?.trim() || ""
      );

      formData.append(
        "sortOrder",
        String(data.sortOrder ?? 0)
      );

      formData.append(
        "isActive",
        data.isActive ? "true" : "false"
      );

      // IMPORTANT
      if (!(data.image instanceof File)) {
        console.error(
          "Hero image is NOT a File:",
          data.image
        );

        throw new Error(
          "Please select a valid hero image."
        );
      }

      console.log("========== HERO UPLOAD ==========");
      console.log("Image name:", data.image.name);
      console.log("Image type:", data.image.type);
      console.log("Image size:", data.image.size);
      console.log("=================================");

      formData.append(
        "image",
        data.image,
        data.image.name
      );

      // DO NOT manually set Content-Type.
      const response = await api.post(
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

  update: async (id, data) => {
    try {
      const formData = new FormData();

      formData.append(
        "title",
        data.title?.trim() || ""
      );

      formData.append(
        "subtitle",
        data.subtitle?.trim() || ""
      );

      formData.append(
        "description",
        data.description?.trim() || ""
      );

      formData.append(
        "buttonText",
        data.buttonText?.trim() || ""
      );

      formData.append(
        "buttonUrl",
        data.buttonUrl?.trim() || ""
      );

      formData.append(
        "sortOrder",
        String(data.sortOrder ?? 0)
      );

      formData.append(
        "isActive",
        data.isActive ? "true" : "false"
      );

      if (data.image instanceof File) {
        formData.append(
          "image",
          data.image,
          data.image.name
        );
      }

      const response = await api.put(
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

  updateStatus: async (id, isActive) => {
    const response = await api.patch(
      `/hero-slides/${id}/status`,
      {
        isActive: Boolean(isActive),
      }
    );

    return response.data;
  },

  reorder: async (slides) => {
    const response = await api.patch(
      "/hero-slides/reorder",
      {
        slides,
      }
    );

    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(
      `/hero-slides/${id}`
    );

    return response.data;
  },
};

export default heroSlideService;