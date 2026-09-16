
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Images,
  CalendarDays,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileImage,
  Save,
  ImagePlus,
} from "lucide-react";

import api from "../../services/api";
import "./Gallery.css";

/* =========================================================
   CONSTANTS
   ========================================================= */

const INITIAL_FORM = {
  title: "",
  description: "",
  isActive: true,
};

const INITIAL_IMAGE_FORM = {
  caption: "",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/* =========================================================
   IMAGE URL
   ========================================================= */

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `http://localhost:5000${imageUrl}`;
  }

  return `http://localhost:5000/${imageUrl}`;
};

/* =========================================================
   DATE
   ========================================================= */

const formatDate = (date) => {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return "—";
  }
};

/* =========================================================
   SERVICE
   ========================================================= */

const galleryService = {
  getAll: async () => {
    const response = await api.get(
      "/galleries/admin/all"
    );

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(
      `/galleries/${id}`
    );

    return response.data;
  },

  create: async (data) => {
    const response = await api.post(
      "/galleries",
      {
        title: data.title,
        description: data.description || null,
        isActive: Boolean(data.isActive),
      }
    );

    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(
      `/galleries/${id}`,
      {
        title: data.title,
        description:
          data.description || null,
        isActive: Boolean(data.isActive),
      }
    );

    return response.data;
  },

  updateStatus: async (id, isActive) => {
    const response = await api.patch(
      `/galleries/${id}/status`,
      {
        isActive: Boolean(isActive),
      }
    );

    return response.data;
  },

  addImage: async (
    galleryId,
    file,
    caption = ""
  ) => {
    const formData = new FormData();

    formData.append("image", file);
    formData.append(
      "caption",
      caption || ""
    );

    const response = await api.post(
      `/galleries/${galleryId}/images`,
      formData
    );

    return response.data;
  },

  updateImage: async (
    imageId,
    data
  ) => {
    const response = await api.put(
      `/galleries/images/${imageId}`,
      data
    );

    return response.data;
  },

  deleteImage: async (imageId) => {
    const response = await api.delete(
      `/galleries/images/${imageId}`
    );

    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(
      `/galleries/${id}`
    );

    return response.data;
  },
};

/* =========================================================
   COMPONENT
   ========================================================= */

const Gallery = () => {
  const fileInputRef = useRef(null);

  /* =======================================================
     DATA
     ======================================================= */

  const [galleries, setGalleries] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  /* =======================================================
     FILTER
     ======================================================= */

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  /* =======================================================
     MODALS
     ======================================================= */

  const [showModal, setShowModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showImageModal, setShowImageModal] =
    useState(false);

  const [showImageViewModal, setShowImageViewModal] =
    useState(false);

  /* =======================================================
     ACTIVE ITEMS
     ======================================================= */

  const [editingGallery, setEditingGallery] =
    useState(null);

  const [viewingGallery, setViewingGallery] =
    useState(null);

  const [deletingGallery, setDeletingGallery] =
    useState(null);

  const [selectedGallery, setSelectedGallery] =
    useState(null);

  const [viewingImage, setViewingImage] =
    useState(null);

  /* =======================================================
     FORMS
     ======================================================= */

  const [form, setForm] =
    useState(INITIAL_FORM);

  const [imageForm, setImageForm] =
    useState(INITIAL_IMAGE_FORM);

  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  /* =======================================================
     ALERTS
     ======================================================= */

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =======================================================
     IMAGE PREVIEW INDEX
     ======================================================= */

  const [previewIndex, setPreviewIndex] =
    useState(0);

  /* =======================================================
     FETCH
     ======================================================= */

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await galleryService.getAll();

      const data =
        response?.galleries ||
        response?.data ||
        response ||
        [];

      setGalleries(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load galleries:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load galleries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  /* =======================================================
     FILTERED
     ======================================================= */

  const filteredGalleries =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return galleries.filter(
        (gallery) => {
          const matchesSearch =
            !query ||
            gallery.title
              ?.toLowerCase()
              .includes(query) ||
            gallery.description
              ?.toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter === "all" ||
            (statusFilter ===
              "active" &&
              gallery.isActive) ||
            (statusFilter ===
              "inactive" &&
              !gallery.isActive);

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      galleries,
      search,
      statusFilter,
    ]);

  /* =======================================================
     STATS
     ======================================================= */

  const totalCount =
    galleries.length;

  const activeCount =
    galleries.filter(
      (gallery) =>
        gallery.isActive
    ).length;

  const inactiveCount =
    galleries.filter(
      (gallery) =>
        !gallery.isActive
    ).length;

  const totalImages =
    galleries.reduce(
      (total, gallery) =>
        total +
        (Array.isArray(
          gallery.images
        )
          ? gallery.images.length
          : 0),
      0
    );

  /* =======================================================
     RESET GALLERY FORM
     ======================================================= */

  const resetGalleryForm = () => {
    setForm({
      ...INITIAL_FORM,
    });

    setEditingGallery(null);

    setError("");
  };

  /* =======================================================
     OPEN CREATE
     ======================================================= */

  const openCreateModal = () => {
    resetGalleryForm();

    setShowModal(true);
  };

  /* =======================================================
     OPEN EDIT
     ======================================================= */

  const openEditModal = (
    gallery
  ) => {
    if (!gallery) return;

    setEditingGallery(
      gallery
    );

    setForm({
      title:
        gallery.title || "",
      description:
        gallery.description ||
        "",
      isActive:
        gallery.isActive !==
        false,
    });

    setError("");

    setShowModal(true);
  };

  /* =======================================================
     CLOSE GALLERY MODAL
     ======================================================= */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);

    resetGalleryForm();
  };

  /* =======================================================
     CHANGE GALLERY FORM
     ======================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /* =======================================================
     SUBMIT GALLERY
     ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError(
        "Gallery title is required."
      );
      return;
    }

    try {
      setSaving(true);

      if (editingGallery) {
        await galleryService.update(
          editingGallery.id,
          {
            title:
              form.title.trim(),
            description:
              form.description.trim(),
            isActive:
              Boolean(
                form.isActive
              ),
          }
        );

        setSuccess(
          "Gallery updated successfully."
        );
      } else {
        const response =
          await galleryService.create(
            {
              title:
                form.title.trim(),
              description:
                form.description.trim(),
              isActive:
                Boolean(
                  form.isActive
                ),
            }
          );

        setSuccess(
          "Gallery created successfully."
        );

        /*
         * If a gallery was created,
         * immediately open image manager.
         */

        if (
          response?.gallery
        ) {
          setShowModal(false);

          await fetchGalleries();

          openImageModal(
            response.gallery
          );

          resetGalleryForm();

          return;
        }
      }

      setShowModal(false);

      resetGalleryForm();

      await fetchGalleries();
    } catch (err) {
      console.error(
        "Gallery save error:",
        err
      );

      setError(
        err?.response?.data
          ?.message ||
          "Failed to save gallery."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     STATUS
     ======================================================= */

  const handleStatusToggle =
    async (gallery) => {
      if (!gallery) return;

      try {
        setError("");

        await galleryService.updateStatus(
          gallery.id,
          !gallery.isActive
        );

        setGalleries(
          (previous) =>
            previous.map(
              (item) =>
                item.id ===
                gallery.id
                  ? {
                      ...item,
                      isActive:
                        !item.isActive,
                    }
                  : item
            )
        );

        setSuccess(
          `Gallery ${
            gallery.isActive
              ? "deactivated"
              : "activated"
          } successfully.`
        );
      } catch (err) {
        console.error(
          "Gallery status error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Failed to update gallery status."
        );
      }
    };

  /* =======================================================
     VIEW GALLERY
     ======================================================= */

  const openViewModal = (
    gallery
  ) => {
    setViewingGallery(
      gallery
    );

    setPreviewIndex(0);

    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);

    setViewingGallery(null);

    setPreviewIndex(0);
  };

  /* =======================================================
     DELETE GALLERY
     ======================================================= */

  const openDeleteModal = (
    gallery
  ) => {
    setDeletingGallery(
      gallery
    );

    setShowDeleteModal(true);
  };

  const closeDeleteModal =
    () => {
      setShowDeleteModal(false);

      setDeletingGallery(null);
    };

  const confirmDelete =
    async () => {
      if (!deletingGallery)
        return;

      try {
        setError("");

        await galleryService.remove(
          deletingGallery.id
        );

        setSuccess(
          "Gallery deleted successfully."
        );

        closeDeleteModal();

        await fetchGalleries();
      } catch (err) {
        console.error(
          "Delete gallery error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Failed to delete gallery."
        );
      }
    };

  /* =======================================================
     OPEN IMAGE MODAL
     ======================================================= */

  const openImageModal = (
    gallery
  ) => {
    setSelectedGallery(
      gallery
    );

    setImageForm({
      ...INITIAL_IMAGE_FORM,
    });

    setImageFile(null);

    if (
      imagePreview?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }

    setError("");

    setShowImageModal(true);
  };

  const closeImageModal = () => {
    if (uploading) return;

    setShowImageModal(false);

    setSelectedGallery(null);

    setImageFile(null);

    if (
      imagePreview?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  /* =======================================================
     IMAGE PICKER
     ======================================================= */

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      setError(
        "Please upload a JPG, JPEG, PNG, or WEBP image."
      );

      event.target.value = "";

      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setError(
        "Image size must be less than 5MB."
      );

      event.target.value = "";

      return;
    }

    if (
      imagePreview?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImageFile(file);

    const preview =
      URL.createObjectURL(
        file
      );

    setImagePreview(preview);
  };

  /* =======================================================
     UPLOAD IMAGE
     ======================================================= */

  const handleImageUpload =
    async (event) => {
      event.preventDefault();

      if (uploading) return;

      setError("");
      setSuccess("");

      if (!selectedGallery) {
        setError(
          "Gallery not selected."
        );
        return;
      }

      if (
        !(imageFile instanceof File)
      ) {
        setError(
          "Please select an image."
        );
        return;
      }

      try {
        setUploading(true);

        await galleryService.addImage(
          selectedGallery.id,
          imageFile,
          imageForm.caption
        );

        setSuccess(
          "Gallery image uploaded successfully."
        );

        setImageFile(null);

        if (
          imagePreview?.startsWith(
            "blob:"
          )
        ) {
          URL.revokeObjectURL(
            imagePreview
          );
        }

        setImagePreview("");

        setImageForm({
          ...INITIAL_IMAGE_FORM,
        });

        if (
          fileInputRef.current
        ) {
          fileInputRef.current.value =
            "";
        }

        await fetchGalleries();

        /*
         * Refresh selected gallery
         */

        const response =
          await galleryService.getById(
            selectedGallery.id
          );

        if (
          response?.gallery
        ) {
          setSelectedGallery(
            response.gallery
          );
        }
      } catch (err) {
        console.error(
          "Gallery image upload error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Failed to upload gallery image."
        );
      } finally {
        setUploading(false);
      }
    };

  /* =======================================================
     DELETE IMAGE
     ======================================================= */

  const handleDeleteImage =
    async (image) => {
      if (!image) return;

      const confirmed =
        window.confirm(
          "Delete this gallery image?"
        );

      if (!confirmed) return;

      try {
        setError("");

        await galleryService.deleteImage(
          image.id
        );

        setSuccess(
          "Gallery image deleted successfully."
        );

        await fetchGalleries();

        if (
          selectedGallery
        ) {
          const response =
            await galleryService.getById(
              selectedGallery.id
            );

          if (
            response?.gallery
          ) {
            setSelectedGallery(
              response.gallery
            );
          }
        }

        if (
          viewingGallery
        ) {
          const response =
            await galleryService.getById(
              viewingGallery.id
            );

          if (
            response?.gallery
          ) {
            setViewingGallery(
              response.gallery
            );
          }
        }
      } catch (err) {
        console.error(
          "Delete gallery image error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Failed to delete gallery image."
        );
      }
    };

  /* =======================================================
     UPDATE IMAGE CAPTION
     ======================================================= */

  const handleUpdateCaption =
    async (
      image
    ) => {
      if (!image) return;

      const caption =
        window.prompt(
          "Enter image caption:",
          image.caption || ""
        );

      if (
        caption === null
      ) {
        return;
      }

      try {
        setError("");

        await galleryService.updateImage(
          image.id,
          {
            imageUrl:
              image.imageUrl,
            caption:
              caption.trim() ||
              null,
          }
        );

        setSuccess(
          "Image caption updated successfully."
        );

        await fetchGalleries();

        if (
          selectedGallery
        ) {
          const response =
            await galleryService.getById(
              selectedGallery.id
            );

          if (
            response?.gallery
          ) {
            setSelectedGallery(
              response.gallery
            );
          }
        }

        if (
          viewingGallery
        ) {
          const response =
            await galleryService.getById(
              viewingGallery.id
            );

          if (
            response?.gallery
          ) {
            setViewingGallery(
              response.gallery
            );
          }
        }
      } catch (err) {
        console.error(
          "Update gallery image error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Failed to update image caption."
        );
      }
    };

  /* =======================================================
     IMAGE VIEW
     ======================================================= */

  const openImageView = (
    image
  ) => {
    setViewingImage(image);

    setShowImageViewModal(
      true
    );
  };

  const closeImageView =
    () => {
      setShowImageViewModal(
        false
      );

      setViewingImage(null);
    };

  /* =======================================================
     PREVIEW NAVIGATION
     ======================================================= */

  const viewingImages =
    viewingGallery &&
    Array.isArray(
      viewingGallery.images
    )
      ? viewingGallery.images
      : [];

  const nextImage = () => {
    if (
      viewingImages.length <=
      1
    ) {
      return;
    }

    setPreviewIndex(
      (previous) =>
        (previous + 1) %
        viewingImages.length
    );
  };

  const previousImage = () => {
    if (
      viewingImages.length <=
      1
    ) {
      return;
    }

    setPreviewIndex(
      (previous) =>
        (previous -
          1 +
          viewingImages.length) %
        viewingImages.length
    );
  };

  /* =======================================================
     ESCAPE
     ======================================================= */

  useEffect(() => {
    const handleEscape =
      (event) => {
        if (
          event.key !==
          "Escape"
        ) {
          return;
        }

        if (
          showImageViewModal
        ) {
          closeImageView();
        } else if (
          showDeleteModal
        ) {
          closeDeleteModal();
        } else if (
          showViewModal
        ) {
          closeViewModal();
        } else if (
          showImageModal &&
          !uploading
        ) {
          closeImageModal();
        } else if (
          showModal &&
          !saving
        ) {
          closeModal();
        }
      };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    showModal,
    showViewModal,
    showDeleteModal,
    showImageModal,
    showImageViewModal,
    saving,
    uploading,
  ]);

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="mmics-gallery-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="mmics-gallery-header">

        <div className="mmics-gallery-header-left">

          <div className="mmics-gallery-breadcrumb">
            <span>Admin</span>
            <span>/</span>
            <strong>Gallery</strong>
          </div>

          <div className="mmics-gallery-heading-row">

            <div className="mmics-gallery-heading-icon">
              <Images size={24} />
            </div>

            <div>
              <h1>Gallery</h1>

              <p>
                Manage event galleries,
                photos and visual content.
              </p>
            </div>

          </div>

        </div>

        <div className="mmics-gallery-header-actions">

          <button
            type="button"
            className="mmics-gallery-primary-btn"
            onClick={
              openCreateModal
            }
          >
            <Plus size={18} />
            Create Gallery
          </button>

        </div>

      </div>

      {/* ===================================================
          ALERTS
      =================================================== */}

      {error && (
        <div className="mmics-gallery-alert mmics-gallery-alert-error">

          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <X size={16} />
          </button>

        </div>
      )}

      {success && (
        <div className="mmics-gallery-alert mmics-gallery-alert-success">

          <CheckCircle2 size={18} />

          <span>{success}</span>

          <button
            type="button"
            onClick={() =>
              setSuccess("")
            }
          >
            <X size={16} />
          </button>

        </div>
      )}

      {/* ===================================================
          STATS
      =================================================== */}

      <div className="mmics-gallery-stats">

        <div className="mmics-gallery-stat-card">

          <div className="mmics-gallery-stat-icon">
            <Images size={20} />
          </div>

          <div>
            <span>Total Galleries</span>
            <strong>
              {totalCount}
            </strong>
          </div>

        </div>

        <div className="mmics-gallery-stat-card">

          <div className="mmics-gallery-stat-icon active">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Active</span>
            <strong>
              {activeCount}
            </strong>
          </div>

        </div>

        <div className="mmics-gallery-stat-card">

          <div className="mmics-gallery-stat-icon inactive">
            <EyeOff size={20} />
          </div>

          <div>
            <span>Inactive</span>
            <strong>
              {inactiveCount}
            </strong>
          </div>

        </div>

        <div className="mmics-gallery-stat-card">

          <div className="mmics-gallery-stat-icon images">
            <ImageIcon size={20} />
          </div>

          <div>
            <span>Total Images</span>
            <strong>
              {totalImages}
            </strong>
          </div>

        </div>

      </div>

      {/* ===================================================
          TOOLBAR
      =================================================== */}

      <div className="mmics-gallery-toolbar">

        <div className="mmics-gallery-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search galleries..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
            >
              <X size={15} />
            </button>
          )}

        </div>

        <div className="mmics-gallery-filters">

          <button
            type="button"
            className={
              statusFilter ===
              "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter(
                "all"
              )
            }
          >
            All
            <span>
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            className={
              statusFilter ===
              "active"
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter(
                "active"
              )
            }
          >
            Active
            <span>
              {activeCount}
            </span>
          </button>

          <button
            type="button"
            className={
              statusFilter ===
              "inactive"
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter(
                "inactive"
              )
            }
          >
            Inactive
            <span>
              {inactiveCount}
            </span>
          </button>

        </div>

        <button
          type="button"
          className="mmics-gallery-refresh-btn"
          onClick={
            fetchGalleries
          }
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "mmics-gallery-spin"
                : ""
            }
          />
        </button>

      </div>

      {/* ===================================================
          GALLERY GRID
      =================================================== */}

      <div className="mmics-gallery-content">

        {loading ? (
          <div className="mmics-gallery-loading">

            <div className="mmics-gallery-spinner" />

            <p>
              Loading galleries...
            </p>

          </div>
        ) : filteredGalleries.length ===
          0 ? (
          <div className="mmics-gallery-empty">

            <div className="mmics-gallery-empty-icon">
              <Images size={32} />
            </div>

            <h3>
              {galleries.length ===
              0
                ? "No galleries yet"
                : "No matching galleries"}
            </h3>

            <p>
              {galleries.length ===
              0
                ? "Create your first gallery to start adding photos."
                : "Try changing your search or status filter."}
            </p>

            {galleries.length ===
              0 && (
              <button
                type="button"
                className="mmics-gallery-primary-btn"
                onClick={
                  openCreateModal
                }
              >
                <Plus size={17} />
                Create Gallery
              </button>
            )}

          </div>
        ) : (
          <div className="mmics-gallery-grid">

            {filteredGalleries.map(
              (gallery) => {
                const images =
                  Array.isArray(
                    gallery.images
                  )
                    ? gallery.images
                    : [];

                const firstImage =
                  images[0];

                return (
                  <article
                    key={
                      gallery.id
                    }
                    className="mmics-gallery-card"
                  >

                    {/* IMAGE COLLAGE */}

                    <div className="mmics-gallery-card-media">

                      {images.length >
                      0 ? (
                        <>
                          <div className="mmics-gallery-main-image">

                            <img
                              src={getImageUrl(
                                firstImage.imageUrl
                              )}
                              alt={
                                gallery.title
                              }
                            />

                          </div>

                          {images.length >
                            1 && (
                            <div className="mmics-gallery-mini-images">

                              {images
                                .slice(
                                  1,
                                  4
                                )
                                .map(
                                  (
                                    image
                                  ) => (
                                    <div
                                      key={
                                        image.id
                                      }
                                    >
                                      <img
                                        src={getImageUrl(
                                          image.imageUrl
                                        )}
                                        alt={
                                          image.caption ||
                                          gallery.title
                                        }
                                      />
                                    </div>
                                  )
                                )}

                              {images.length >
                                4 && (
                                <div className="mmics-gallery-more-images">
                                  +{images.length - 4}
                                </div>
                              )}

                            </div>
                          )}
                        </>
                      ) : (
                        <div className="mmics-gallery-no-image">
                          <ImageIcon
                            size={36}
                          />
                          <span>
                            No images
                          </span>
                        </div>
                      )}

                      <div className="mmics-gallery-card-status">

                        <span
                          className={
                            gallery.isActive
                              ? "active"
                              : "inactive"
                          }
                        >
                          {gallery.isActive ? (
                            <>
                              <CheckCircle2
                                size={12}
                              />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff
                                size={12}
                              />
                              Inactive
                            </>
                          )}
                        </span>

                      </div>

                    </div>

                    {/* BODY */}

                    <div className="mmics-gallery-card-body">

                      <div className="mmics-gallery-card-top">

                        <div>
                          <h3>
                            {gallery.title ||
                              "Untitled Gallery"}
                          </h3>

                          {gallery.description && (
                            <p>
                              {
                                gallery.description
                              }
                            </p>
                          )}
                        </div>

                      </div>

                      <div className="mmics-gallery-card-meta">

                        <span>
                          <ImageIcon
                            size={14}
                          />

                          {images.length}{" "}
                          {images.length ===
                          1
                            ? "photo"
                            : "photos"}
                        </span>

                        <span>
                          <CalendarDays
                            size={14}
                          />

                          {formatDate(
                            gallery.updatedAt ||
                              gallery.createdAt
                          )}
                        </span>

                      </div>

                      <div className="mmics-gallery-card-actions">

                        <button
                          type="button"
                          onClick={() =>
                            openViewModal(
                              gallery
                            )
                          }
                        >
                          <Eye
                            size={15}
                          />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openImageModal(
                              gallery
                            )
                          }
                        >
                          <ImagePlus
                            size={15}
                          />
                          Images
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              gallery
                            )
                          }
                        >
                          <Pencil
                            size={15}
                          />
                        </button>

                        <button
                          type="button"
                          className="icon-action"
                          title={
                            gallery.isActive
                              ? "Deactivate"
                              : "Activate"
                          }
                          onClick={() =>
                            handleStatusToggle(
                              gallery
                            )
                          }
                        >
                          {gallery.isActive ? (
                            <EyeOff
                              size={15}
                            />
                          ) : (
                            <CheckCircle2
                              size={15}
                            />
                          )}
                        </button>

                        <button
                          type="button"
                          className="icon-action danger"
                          title="Delete"
                          onClick={() =>
                            openDeleteModal(
                              gallery
                            )
                          }
                        >
                          <Trash2
                            size={15}
                          />
                        </button>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* ===================================================
          CREATE / EDIT GALLERY MODAL
      =================================================== */}

      {showModal && (
        <div
          className="mmics-gallery-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="mmics-gallery-modal">

            <div className="mmics-gallery-modal-header">

              <div>

                <span className="mmics-gallery-modal-kicker">
                  {editingGallery
                    ? "UPDATE GALLERY"
                    : "NEW GALLERY"}
                </span>

                <h2>
                  {editingGallery
                    ? "Edit Gallery"
                    : "Create Gallery"}
                </h2>

                <p>
                  Set the gallery title,
                  description and visibility.
                </p>

              </div>

              <button
                type="button"
                className="mmics-gallery-modal-close"
                onClick={
                  closeModal
                }
                disabled={saving}
              >
                <X size={19} />
              </button>

            </div>

            <form
              className="mmics-gallery-form"
              onSubmit={
                handleSubmit
              }
            >

              {error && (
                <div className="mmics-gallery-form-alert">
                  <AlertCircle
                    size={17}
                  />
                  <span>
                    {error}
                  </span>
                </div>
              )}

              <div className="mmics-gallery-form-section">

                <div className="mmics-gallery-section-title">

                  <Images size={17} />

                  <div>
                    <strong>
                      Gallery Details
                    </strong>

                    <span>
                      Basic information about
                      this collection.
                    </span>
                  </div>

                </div>

                <div className="mmics-gallery-form-grid">

                  <div className="mmics-gallery-field full">

                    <label>
                      Gallery Title
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={
                        form.title
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. World Gift Expo 2026"
                      maxLength={
                        200
                      }
                      disabled={
                        saving
                      }
                    />

                    <small>
                      {
                        form.title
                          .length
                      }
                      /200
                    </small>

                  </div>

                  <div className="mmics-gallery-field full">

                    <label>
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={
                        form.description
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Describe this gallery..."
                      rows={5}
                      maxLength={
                        1000
                      }
                      disabled={
                        saving
                      }
                    />

                    <small>
                      {
                        form
                          .description
                          .length
                      }
                      /1000
                    </small>

                  </div>

                  <div className="mmics-gallery-field">

                    <label>
                      Status
                    </label>

                    <select
                      value={
                        form.isActive
                          ? "true"
                          : "false"
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            previous
                          ) => ({
                            ...previous,
                            isActive:
                              event
                                .target
                                .value ===
                              "true",
                          })
                        )
                      }
                      disabled={
                        saving
                      }
                    >
                      <option value="true">
                        Active
                      </option>

                      <option value="false">
                        Inactive
                      </option>
                    </select>

                  </div>

                </div>

              </div>

              <div className="mmics-gallery-modal-footer">

                <button
                  type="button"
                  className="mmics-gallery-cancel-btn"
                  onClick={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="mmics-gallery-save-btn"
                  disabled={
                    saving
                  }
                >

                  {saving ? (
                    <>
                      <span className="mmics-gallery-button-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save
                        size={16}
                      />

                      {editingGallery
                        ? "Update Gallery"
                        : "Create Gallery"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ===================================================
          IMAGE MANAGER MODAL
      =================================================== */}

      {showImageModal &&
        selectedGallery && (
          <div
            className="mmics-gallery-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeImageModal();
              }
            }}
          >

            <div className="mmics-gallery-image-manager">

              <div className="mmics-gallery-modal-header">

                <div>

                  <span className="mmics-gallery-modal-kicker">
                    IMAGE MANAGER
                  </span>

                  <h2>
                    {selectedGallery.title}
                  </h2>

                  <p>
                    Add and manage photos in
                    this gallery.
                  </p>

                </div>

                <button
                  type="button"
                  className="mmics-gallery-modal-close"
                  onClick={
                    closeImageModal
                  }
                  disabled={
                    uploading
                  }
                >
                  <X size={19} />
                </button>

              </div>

              <div className="mmics-gallery-image-manager-body">

                {/* UPLOAD */}

                <form
                  className="mmics-gallery-image-upload"
                  onSubmit={
                    handleImageUpload
                  }
                >

                  <div className="mmics-gallery-section-title">

                    <FileImage
                      size={17}
                    />

                    <div>
                      <strong>
                        Add New Image
                      </strong>

                      <span>
                        JPG, PNG or WEBP ·
                        Maximum 5MB
                      </span>
                    </div>

                  </div>

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    hidden
                    onChange={
                      handleImageChange
                    }
                  />

                  {imagePreview ? (
                    <div className="mmics-gallery-image-upload-preview">

                      <img
                        src={
                          imagePreview
                        }
                        alt="Preview"
                      />

                      <div className="mmics-gallery-image-preview-overlay">

                        <div>
                          <strong>
                            {
                              imageFile?.name
                            }
                          </strong>

                          {imageFile && (
                            <span>
                              {(
                                imageFile.size /
                                1024 /
                                1024
                              ).toFixed(
                                2
                              )}{" "}
                              MB
                            </span>
                          )}
                        </div>

                        <div className="mmics-gallery-image-preview-actions">

                          <button
                            type="button"
                            onClick={() =>
                              fileInputRef.current?.click()
                            }
                            disabled={
                              uploading
                            }
                          >
                            <Upload
                              size={15}
                            />
                            Replace
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(
                                null
                              );

                              if (
                                imagePreview?.startsWith(
                                  "blob:"
                                )
                              ) {
                                URL.revokeObjectURL(
                                  imagePreview
                                );
                              }

                              setImagePreview(
                                ""
                              );

                              if (
                                fileInputRef.current
                              ) {
                                fileInputRef.current.value =
                                  "";
                              }
                            }}
                            disabled={
                              uploading
                            }
                          >
                            <X
                              size={15}
                            />
                            Remove
                          </button>

                        </div>

                      </div>

                    </div>
                  ) : (
                    <button
                      type="button"
                      className="mmics-gallery-upload-area"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      disabled={
                        uploading
                      }
                    >

                      <div className="mmics-gallery-upload-icon">
                        <Upload
                          size={23}
                        />
                      </div>

                      <strong>
                        Upload Image
                      </strong>

                      <span>
                        Click to browse or
                        select an image
                      </span>

                    </button>
                  )}

                  <div className="mmics-gallery-image-caption-field">

                    <label>
                      Caption
                    </label>

                    <input
                      type="text"
                      value={
                        imageForm.caption
                      }
                      onChange={(
                        event
                      ) =>
                        setImageForm(
                          (
                            previous
                          ) => ({
                            ...previous,
                            caption:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="Optional image caption..."
                      maxLength={
                        300
                      }
                      disabled={
                        uploading
                      }
                    />

                  </div>

                  {error && (
                    <div className="mmics-gallery-form-alert">

                      <AlertCircle
                        size={16}
                      />

                      <span>
                        {error}
                      </span>

                    </div>
                  )}

                  <button
                    type="submit"
                    className="mmics-gallery-upload-submit"
                    disabled={
                      uploading ||
                      !imageFile
                    }
                  >
                    {uploading ? (
                      <>
                        <span className="mmics-gallery-button-spinner" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload
                          size={16}
                        />
                        Upload Image
                      </>
                    )}
                  </button>

                </form>

                {/* EXISTING IMAGES */}

                <div className="mmics-gallery-existing-images">

                  <div className="mmics-gallery-existing-header">

                    <div>

                      <strong>
                        Gallery Images
                      </strong>

                      <span>
                        {selectedGallery
                          .images
                          ?.length ||
                          0}{" "}
                        photos
                      </span>

                    </div>

                  </div>

                  {selectedGallery
                    .images
                    ?.length > 0 ? (
                    <div className="mmics-gallery-image-grid">

                      {selectedGallery.images.map(
                        (
                          image,
                          index
                        ) => (
                          <div
                            key={
                              image.id
                            }
                            className="mmics-gallery-image-card"
                          >

                            <div className="mmics-gallery-image-card-media">

                              <img
                                src={getImageUrl(
                                  image.imageUrl
                                )}
                                alt={
                                  image.caption ||
                                  `Gallery image ${
                                    index +
                                    1
                                  }`
                                }
                              />

                              <div className="mmics-gallery-image-card-overlay">

                                <button
                                  type="button"
                                  onClick={() =>
                                    openImageView(
                                      image
                                    )
                                  }
                                  title="View"
                                >
                                  <Eye
                                    size={16}
                                  />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateCaption(
                                      image
                                    )
                                  }
                                  title="Edit caption"
                                >
                                  <Pencil
                                    size={16}
                                  />
                                </button>

                                <button
                                  type="button"
                                  className="danger"
                                  onClick={() =>
                                    handleDeleteImage(
                                      image
                                    )
                                  }
                                  title="Delete"
                                >
                                  <Trash2
                                    size={16}
                                  />
                                </button>

                              </div>

                            </div>

                            <div className="mmics-gallery-image-card-caption">

                              <span>
                                {image.caption ||
                                  "No caption"}
                              </span>

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  ) : (
                    <div className="mmics-gallery-no-images">

                      <ImageIcon
                        size={28}
                      />

                      <strong>
                        No images yet
                      </strong>

                      <span>
                        Upload the first image
                        using the form above.
                      </span>

                    </div>
                  )}

                </div>

              </div>

              <div className="mmics-gallery-modal-footer">

                <button
                  type="button"
                  className="mmics-gallery-cancel-btn"
                  onClick={
                    closeImageModal
                  }
                  disabled={
                    uploading
                  }
                >
                  Done
                </button>

              </div>

            </div>

          </div>
        )}

      {/* ===================================================
          VIEW GALLERY MODAL
      =================================================== */}

      {showViewModal &&
        viewingGallery && (
          <div
            className="mmics-gallery-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeViewModal();
              }
            }}
          >

            <div className="mmics-gallery-view-modal">

              <div className="mmics-gallery-modal-header">

                <div>

                  <span className="mmics-gallery-modal-kicker">
                    GALLERY
                  </span>

                  <h2>
                    {
                      viewingGallery.title
                    }
                  </h2>

                  <p>
                    {
                      viewingGallery.description ||
                      "Gallery details and images."
                    }
                  </p>

                </div>

                <button
                  type="button"
                  className="mmics-gallery-modal-close"
                  onClick={
                    closeViewModal
                  }
                >
                  <X size={19} />
                </button>

              </div>

              <div className="mmics-gallery-view-body">

                {viewingImages.length >
                0 ? (
                  <div className="mmics-gallery-view-feature">

                    <img
                      src={getImageUrl(
                        viewingImages[
                          previewIndex
                        ]
                          .imageUrl
                      )}
                      alt={
                        viewingImages[
                          previewIndex
                        ]
                          .caption ||
                        viewingGallery.title
                      }
                    />

                    {viewingImages.length >
                      1 && (
                      <>
                        <button
                          type="button"
                          className="mmics-gallery-view-nav prev"
                          onClick={
                            previousImage
                          }
                        >
                          <ChevronLeft
                            size={22}
                          />
                        </button>

                        <button
                          type="button"
                          className="mmics-gallery-view-nav next"
                          onClick={
                            nextImage
                          }
                        >
                          <ChevronRight
                            size={22}
                          />
                        </button>
                      </>
                    )}

                    <div className="mmics-gallery-view-counter">
                      {previewIndex +
                        1}{" "}
                      /{" "}
                      {
                        viewingImages.length
                      }
                    </div>

                  </div>
                ) : (
                  <div className="mmics-gallery-view-no-image">

                    <ImageIcon
                      size={42}
                    />

                    <span>
                      No images in this
                      gallery.
                    </span>

                  </div>
                )}

                {viewingImages.length >
                  0 && (
                  <div className="mmics-gallery-view-thumbnails">

                    {viewingImages.map(
                      (
                        image,
                        index
                      ) => (
                        <button
                          type="button"
                          key={
                            image.id
                          }
                          className={
                            index ===
                            previewIndex
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            setPreviewIndex(
                              index
                            )
                          }
                        >
                          <img
                            src={getImageUrl(
                              image.imageUrl
                            )}
                            alt={
                              image.caption ||
                              `Thumbnail ${
                                index +
                                1
                              }`
                            }
                          />
                        </button>
                      )
                    )}

                  </div>
                )}

                {viewingImages[
                  previewIndex
                ]?.caption && (
                  <div className="mmics-gallery-view-caption">

                    <span>
                      Caption
                    </span>

                    <strong>
                      {
                        viewingImages[
                          previewIndex
                        ].caption
                      }
                    </strong>

                  </div>
                )}

              </div>

              <div className="mmics-gallery-modal-footer">

                <button
                  type="button"
                  className="mmics-gallery-cancel-btn"
                  onClick={
                    closeViewModal
                  }
                >
                  Close
                </button>

                <button
                  type="button"
                  className="mmics-gallery-save-btn"
                  onClick={() => {
                    closeViewModal();

                    openImageModal(
                      viewingGallery
                    );
                  }}
                >
                  <ImagePlus
                    size={16}
                  />
                  Manage Images
                </button>

              </div>

            </div>

          </div>
        )}

      {/* ===================================================
          FULL IMAGE VIEW
      =================================================== */}

      {showImageViewModal &&
        viewingImage && (
          <div
            className="mmics-gallery-image-view-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeImageView();
              }
            }}
          >

            <button
              type="button"
              className="mmics-gallery-image-view-close"
              onClick={
                closeImageView
              }
            >
              <X size={22} />
            </button>

            <div className="mmics-gallery-image-view-content">

              <img
                src={getImageUrl(
                  viewingImage.imageUrl
                )}
                alt={
                  viewingImage.caption ||
                  "Gallery image"
                }
              />

              {viewingImage.caption && (
                <div className="mmics-gallery-image-view-caption">
                  {
                    viewingImage.caption
                  }
                </div>
              )}

            </div>

          </div>
        )}

      {/* ===================================================
          DELETE MODAL
      =================================================== */}

      {showDeleteModal &&
        deletingGallery && (
          <div
            className="mmics-gallery-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeDeleteModal();
              }
            }}
          >

            <div className="mmics-gallery-delete-modal">

              <div className="mmics-gallery-delete-icon">
                <Trash2 size={25} />
              </div>

              <h2>
                Delete Gallery?
              </h2>

              <p>
                Are you sure you want to
                delete{" "}
                <strong>
                  {
                    deletingGallery.title
                  }
                </strong>
                ? All images associated
                with this gallery will also
                be removed.
              </p>

              <div className="mmics-gallery-delete-actions">

                <button
                  type="button"
                  className="mmics-gallery-cancel-btn"
                  onClick={
                    closeDeleteModal
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="mmics-gallery-delete-confirm-btn"
                  onClick={
                    confirmDelete
                  }
                >
                  <Trash2
                    size={16}
                  />
                  Delete Gallery
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default Gallery;

