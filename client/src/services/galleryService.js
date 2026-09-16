
import api from "./api";

const galleryService = {
  // ============================================
  // GET ALL ACTIVE GALLERIES - PUBLIC
  // GET /api/galleries
  // ============================================
  getAll: async () => {
    const response = await api.get("/galleries");
    return response.data;
  },

  // ============================================
  // GET ALL GALLERIES - ADMIN
  // GET /api/galleries/admin/all
  // ============================================
  getAllAdmin: async () => {
    const response = await api.get("/galleries/admin/all");
    return response.data;
  },

  // ============================================
  // GET SINGLE GALLERY
  // GET /api/galleries/:id
  // ============================================
  getById: async (id) => {
    const response = await api.get(`/galleries/${id}`);
    return response.data;
  },

  // ============================================
  // CREATE GALLERY
  // POST /api/galleries
  // ============================================
  create: async (data) => {
    const payload = {
      title: data.title?.trim() || "",
      description: data.description?.trim() || null,
      isActive:
        data.isActive !== undefined
          ? Boolean(data.isActive)
          : true,
    };

    // Only send images if the backend receives
    // image URLs directly during gallery creation.
    if (Array.isArray(data.images) && data.images.length > 0) {
      payload.images = data.images;
    }

    const response = await api.post(
      "/galleries",
      payload
    );

    return response.data;
  },

  // ============================================
  // UPDATE GALLERY
  // PUT /api/galleries/:id
  // ============================================
  update: async (id, data) => {
    const payload = {
      title:
        data.title !== undefined
          ? data.title.trim()
          : undefined,

      description:
        data.description !== undefined
          ? data.description.trim()
          : undefined,

      isActive:
        data.isActive !== undefined
          ? Boolean(data.isActive)
          : undefined,
    };

    const response = await api.put(
      `/galleries/${id}`,
      payload
    );

    return response.data;
  },

  // ============================================
  // CHANGE GALLERY STATUS
  // PATCH /api/galleries/:id/status
  // ============================================
  updateStatus: async (id, isActive) => {
    const response = await api.patch(
      `/galleries/${id}/status`,
      {
        isActive: Boolean(isActive),
      }
    );

    return response.data;
  },

  // ============================================
  // ADD IMAGE TO GALLERY
  // POST /api/galleries/:id/images
  // multipart/form-data
  // ============================================
  addImage: async (id, file, caption = "") => {
    if (!(file instanceof File)) {
      throw new Error("Gallery image file is required.");
    }

    const formData = new FormData();

    formData.append(
      "image",
      file,
      file.name
    );

    formData.append(
      "caption",
      caption?.trim() || ""
    );

    const response = await api.post(
      `/galleries/${id}/images`,
      formData
    );

    return response.data;
  },

  // ============================================
  // UPDATE GALLERY IMAGE
  // PUT /api/galleries/images/:imageId
  // ============================================
  updateImage: async (
    imageId,
    data = {}
  ) => {
    const payload = {
      ...(data.imageUrl !== undefined && {
        imageUrl: data.imageUrl,
      }),

      ...(data.caption !== undefined && {
        caption: data.caption.trim(),
      }),
    };

    const response = await api.put(
      `/galleries/images/${imageId}`,
      payload
    );

    return response.data;
  },

  // ============================================
  // DELETE GALLERY IMAGE
  // DELETE /api/galleries/images/:imageId
  // ============================================
  deleteImage: async (imageId) => {
    const response = await api.delete(
      `/galleries/images/${imageId}`
    );

    return response.data;
  },

  // ============================================
  // DELETE GALLERY
  // DELETE /api/galleries/:id
  // ============================================
  remove: async (id) => {
    const response = await api.delete(
      `/galleries/${id}`
    );

    return response.data;
  },
};

export default galleryService;

