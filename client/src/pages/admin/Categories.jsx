import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Plus,
  RefreshCw,
  FolderTree,
  FolderOpen,
  CheckCircle2,
  XCircle,
    CalendarDays,
  Pencil,
  Eye,
  Trash2,
  MoreHorizontal,
  X,
  AlertCircle,
  Tag,
  Hash,
  FileText,
  ArrowUpDown,
  Layers3,
} from "lucide-react";

import categoryService from "../../services/categoryService";
import "./Categories.css";

/* =========================================================
   EMPTY FORM
========================================================= */

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  displayOrder: 0,
};

/* =========================================================
   HELPERS
========================================================= */

const createSlug = (value = "") => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "-";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const getInitials = (name = "") => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) =>
      word
        .charAt(0)
        .toUpperCase()
    )
    .join("");
};

/* =========================================================
   COMPONENT
========================================================= */

const Categories = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL");

  const [formData, setFormData] =
    useState(emptyForm);

  const [
    editingCategory,
    setEditingCategory,
  ] = useState(null);

  const [
    viewingCategory,
    setViewingCategory,
  ] = useState(null);

  const [
    deletingCategory,
    setDeletingCategory,
  ] = useState(null);

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    isViewModalOpen,
    setIsViewModalOpen,
  ] = useState(false);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  const [
    openMenuId,
    setOpenMenuId,
  ] = useState(null);

  const [alert, setAlert] =
    useState({
      type: "",
      message: "",
    });

  const [error, setError] =
    useState("");

  /* =======================================================
     FETCH CATEGORIES
  ======================================================= */

  const fetchCategories =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await categoryService.getAll();

        setCategories(
          Array.isArray(
            data?.categories
          )
            ? data.categories
            : []
        );
      } catch (err) {
        console.error(
          "Fetch categories error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            err?.message ||
            "Unable to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    fetchCategories();
  }, []);

  /* =======================================================
     ALERT AUTO CLOSE
  ======================================================= */

  useEffect(() => {
    if (!alert.message) {
      return;
    }

    const timer =
      setTimeout(() => {
        setAlert({
          type: "",
          message: "",
        });
      }, 3500);

    return () =>
      clearTimeout(timer);
  }, [alert]);

  /* =======================================================
     CLOSE DROPDOWN
  ======================================================= */

  useEffect(() => {
    const handleClick = () => {
      setOpenMenuId(null);
    };

    document.addEventListener(
      "click",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClick
      );
    };
  }, []);

  /* =======================================================
     FILTERED CATEGORIES
  ======================================================= */

  const filteredCategories =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return categories.filter(
        (category) => {
          const matchesSearch =
            !query ||
            category.name
              ?.toLowerCase()
              .includes(query) ||
            category.slug
              ?.toLowerCase()
              .includes(query) ||
            category.description
              ?.toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            category.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      categories,
      search,
      statusFilter,
    ]);

  /* =======================================================
     STATS
  ======================================================= */

  const totalCategories =
    categories.length;

  const activeCategories =
    categories.filter(
      (category) =>
        category.status ===
        "ACTIVE"
    ).length;

  const inactiveCategories =
    categories.filter(
      (category) =>
        category.status ===
        "INACTIVE"
    ).length;

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setFormData({
      ...emptyForm,
    });
  };

  /* =======================================================
     ADD CATEGORY
  ======================================================= */

  const handleAddCategory = () => {
    setEditingCategory(null);

    resetForm();

    setError("");

    setIsModalOpen(true);
  };

  /* =======================================================
     EDIT CATEGORY
  ======================================================= */

  const handleEditCategory = (
    category
  ) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description:
        category.description ||
        "",
      displayOrder:
        category.displayOrder ??
        0,
    });

    setError("");

    setOpenMenuId(null);

    setIsModalOpen(true);
  };

  /* =======================================================
     VIEW CATEGORY
  ======================================================= */

  const handleViewCategory = (
    category
  ) => {
    setViewingCategory(category);

    setOpenMenuId(null);

    setIsViewModalOpen(true);
  };

  /* =======================================================
     CLOSE FORM
  ======================================================= */

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);

    setEditingCategory(null);

    resetForm();

    setError("");
  };

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /* =======================================================
     NAME CHANGE + AUTO SLUG
  ======================================================= */

  const handleNameChange = (
    event
  ) => {
    const value =
      event.target.value;

    setFormData(
      (previous) => ({
        ...previous,
        name: value,

        /*
         * Auto-generate slug only
         * while creating a category.
         */
        ...(editingCategory
          ? {}
          : {
              slug: createSlug(
                value
              ),
            }),
      })
    );
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);

      setError("");

      /* VALIDATION */

      if (!formData.name.trim()) {
        setError(
          "Category name is required"
        );

        return;
      }

      const slug =
        formData.slug.trim() ||
        createSlug(
          formData.name
        );

      const displayOrder =
        Number(
          formData.displayOrder
        );

      if (
        !Number.isInteger(
          displayOrder
        ) ||
        displayOrder < 0
      ) {
        setError(
          "Display order must be a valid positive number"
        );

        return;
      }

      const payload = {
        name: formData.name.trim(),
        slug,
        description:
          formData.description.trim(),
        displayOrder,
      };

      /* =================================================
         CREATE
      ================================================= */

      if (!editingCategory) {
        await categoryService.create(
          payload
        );

        setAlert({
          type: "success",
          message:
            "Category created successfully",
        });
      }

      /* =================================================
         UPDATE
      ================================================= */

      else {
        await categoryService.update(
          editingCategory.id,
          payload
        );

        setAlert({
          type: "success",
          message:
            "Category updated successfully",
        });
      }

      /* REFRESH */

      await fetchCategories();

      /* CLOSE */

      setIsModalOpen(false);

      setEditingCategory(null);

      resetForm();
    } catch (err) {
      console.error(
        "Save category error:",
        err
      );

      setError(
        err?.response?.data
          ?.message ||
          err?.message ||
          "Unable to save category"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     STATUS CHANGE
  ======================================================= */

  const handleStatusChange =
    async (category) => {
      try {
        setOpenMenuId(null);

        const newStatus =
          category.status ===
          "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE";

        await categoryService.updateStatus(
          category.id,
          newStatus
        );

        setAlert({
          type: "success",
          message: `Category ${
            newStatus === "ACTIVE"
              ? "activated"
              : "deactivated"
          } successfully`,
        });

        await fetchCategories();
      } catch (err) {
        console.error(
          "Category status error:",
          err
        );

        setAlert({
          type: "error",
          message:
            err?.response?.data
              ?.message ||
            err?.message ||
            "Unable to change category status",
        });
      }
    };

  /* =======================================================
     DELETE CLICK
  ======================================================= */

  const handleDeleteClick = (
    category
  ) => {
    setDeletingCategory(
      category
    );

    setOpenMenuId(null);

    setIsDeleteModalOpen(true);
  };

  /* =======================================================
     DELETE CONFIRM
  ======================================================= */

  const handleDeleteConfirm =
    async () => {
      if (!deletingCategory) {
        return;
      }

      try {
        setDeleting(true);

        await categoryService.remove(
          deletingCategory.id
        );

        setAlert({
          type: "success",
          message:
            "Category deleted successfully",
        });

        setIsDeleteModalOpen(
          false
        );

        setDeletingCategory(null);

        await fetchCategories();
      } catch (err) {
        console.error(
          "Delete category error:",
          err
        );

        setAlert({
          type: "error",
          message:
            err?.response?.data
              ?.message ||
            err?.message ||
            "Unable to delete category",
        });
      } finally {
        setDeleting(false);
      }
    };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");

    setStatusFilter("ALL");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="mmics-categories-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mmics-categories-header">

        <div>

          <div className="mmics-categories-eyebrow">
            Product Management
          </div>

          <h1>
            Categories
          </h1>

          <p>
            Organize products into
            clear categories for the
            MMICS public catalogue.
          </p>

        </div>

        <div className="mmics-categories-header-actions">

          <button
            type="button"
            className="mmics-categories-refresh"
            onClick={
              fetchCategories
            }
            disabled={loading}
          >
            <RefreshCw
              size={15}
              className={
                loading
                  ? "mmics-categories-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            className="mmics-categories-add-button"
            onClick={
              handleAddCategory
            }
          >
            <Plus size={16} />

            Add Category
          </button>

        </div>

      </div>

      {/* =================================================
          ALERT
      ================================================= */}

      {alert.message && (
        <div
          className={`mmics-categories-alert ${alert.type}`}
        >

          {alert.type ===
          "success" ? (
            <CheckCircle2
              size={16}
            />
          ) : (
            <AlertCircle
              size={16}
            />
          )}

          <span>
            {alert.message}
          </span>

          <button
            type="button"
            onClick={() =>
              setAlert({
                type: "",
                message: "",
              })
            }
          >
            <X size={15} />
          </button>

        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <div className="mmics-categories-stats">

        <div className="mmics-categories-stat-card">

          <div className="mmics-categories-stat-icon">
            <FolderTree size={19} />
          </div>

          <div>

            <span>
              Total Categories
            </span>

            <strong>
              {totalCategories}
            </strong>

          </div>

        </div>

        <div className="mmics-categories-stat-card">

          <div className="mmics-categories-stat-icon active">
            <CheckCircle2
              size={19}
            />
          </div>

          <div>

            <span>
              Active
            </span>

            <strong>
              {activeCategories}
            </strong>

          </div>

        </div>

        <div className="mmics-categories-stat-card">

          <div className="mmics-categories-stat-icon inactive">
            <XCircle size={19} />
          </div>

          <div>

            <span>
              Inactive
            </span>

            <strong>
              {inactiveCategories}
            </strong>

          </div>

        </div>

        <div className="mmics-categories-stat-card">

          <div className="mmics-categories-stat-icon products">
            <Layers3 size={19} />
          </div>

          <div>

            <span>
              Catalogue Structure
            </span>

            <strong>
              {totalCategories}
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="mmics-categories-toolbar">

        <div className="mmics-categories-search">

          <Search size={16} />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search category name, slug or description..."
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
            >
              <X size={13} />
            </button>
          )}

        </div>

        <select
          className="mmics-categories-status-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >
          <option value="ALL">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>
        </select>

      </div>

      {/* =================================================
          TABLE CARD
      ================================================= */}

      <div className="mmics-categories-table-card">

        <div className="mmics-categories-table-header">

          <div>

            <h2>
              Category Directory
            </h2>

            <span>
              Showing{" "}
              {
                filteredCategories.length
              }{" "}
              of{" "}
              {categories.length}{" "}
              categories
            </span>

          </div>

          {(search ||
            statusFilter !==
              "ALL") && (
            <button
              type="button"
              className="mmics-categories-clear-filters"
              onClick={
                clearFilters
              }
            >
              Clear filters
            </button>
          )}

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="mmics-categories-loading">

            <RefreshCw
              size={21}
              className="mmics-categories-spin"
            />

            Loading categories...

          </div>
        ) : filteredCategories.length ===
          0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="mmics-categories-empty">

            <div className="mmics-categories-empty-icon">
              <FolderOpen
                size={27}
              />
            </div>

            <h3>
              No categories found
            </h3>

            <p>
              {search ||
              statusFilter !==
                "ALL"
                ? "Try changing your search or filters."
                : "Create your first product category to start organizing the MMICS catalogue."}
            </p>

            {!search &&
              statusFilter ===
                "ALL" && (
                <button
                  type="button"
                  onClick={
                    handleAddCategory
                  }
                >
                  <Plus size={14} />

                  Add Category
                </button>
              )}

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="mmics-categories-table-wrapper">

            <table className="mmics-categories-table">

              <thead>

                <tr>

                  <th>
                    CATEGORY
                  </th>

                  <th>
                    SLUG
                  </th>

                  <th>
                    DESCRIPTION
                  </th>

                  <th>
                    ORDER
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    CREATED
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCategories.map(
                  (category) => (
                    <tr
                      key={
                        category.id
                      }
                    >

                      {/* CATEGORY */}

                      <td>

                        <div className="mmics-category-identity">

                          <div className="mmics-category-icon">

                            <FolderTree
                              size={17}
                            />

                          </div>

                          <div>

                            <strong>
                              {
                                category.name
                              }
                            </strong>

                            <span>
                              Category
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* SLUG */}

                      <td>

                        <span className="mmics-category-slug">

                          <Tag size={12} />

                          {category.slug ||
                            "-"}

                        </span>

                      </td>

                      {/* DESCRIPTION */}

                      <td>

                        <div className="mmics-category-description">

                          {
                            category.description ||
                            "No description"
                          }

                        </div>

                      </td>

                      {/* ORDER */}

                      <td>

                        <span className="mmics-category-order">

                          <ArrowUpDown
                            size={12}
                          />

                          {
                            category.displayOrder ??
                            0
                          }

                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`mmics-category-status ${
                            category.status ===
                            "ACTIVE"
                              ? "active"
                              : "inactive"
                          }`}
                        >

                          <span />

                          {category.status ===
                          "ACTIVE"
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>

                      {/* CREATED */}

                      <td>

                        <span className="mmics-category-date">

                          <CalendarDays
                            size={12}
                          />

                          {formatDate(
                            category.createdAt
                          )}

                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div
                          className="mmics-category-actions"
                          onClick={(
                            event
                          ) =>
                            event.stopPropagation()
                          }
                        >

                          <button
                            type="button"
                            title="View"
                            onClick={() =>
                              handleViewCategory(
                                category
                              )
                            }
                          >
                            <Eye
                              size={15}
                            />
                          </button>

                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              handleEditCategory(
                                category
                              )
                            }
                          >
                            <Pencil
                              size={15}
                            />
                          </button>

                          <div className="mmics-category-more">

                            <button
                              type="button"
                              title="More"
                              onClick={(
                                event
                              ) => {
                                event.stopPropagation();

                                setOpenMenuId(
                                  openMenuId ===
                                    category.id
                                    ? null
                                    : category.id
                                );
                              }}
                            >
                              <MoreHorizontal
                                size={16}
                              />
                            </button>

                            {openMenuId ===
                              category.id && (
                              <div className="mmics-category-dropdown">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(
                                      category
                                    )
                                  }
                                >

                                  {category.status ===
                                  "ACTIVE" ? (
                                    <>
                                      <XCircle
                                        size={
                                          14
                                        }
                                      />

                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2
                                        size={
                                          14
                                        }
                                      />

                                      Activate
                                    </>
                                  )}

                                </button>

                                <button
                                  type="button"
                                  className="delete"
                                  onClick={() =>
                                    handleDeleteClick(
                                      category
                                    )
                                  }
                                >
                                  <Trash2
                                    size={
                                      14
                                    }
                                  />

                                  Delete
                                </button>

                              </div>
                            )}

                          </div>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {isModalOpen && (
        <div
          className="mmics-categories-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="mmics-categories-modal">

            {/* HEADER */}

            <div className="mmics-categories-modal-header">

              <div>

                <span>
                  {editingCategory
                    ? "UPDATE CATEGORY"
                    : "NEW CATEGORY"}
                </span>

                <h2>
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p>
                  Define a clear
                  category for the MMICS
                  product catalogue.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
              >
                <X size={17} />
              </button>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mmics-categories-form-error">

                <AlertCircle
                  size={15}
                />

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* FORM */}

            <form
              className="mmics-categories-form"
              onSubmit={
                handleSubmit
              }
            >

              {/* =================================================
                  BASIC INFORMATION
              ================================================= */}

              <div className="mmics-categories-form-section">

                <div className="mmics-categories-form-section-heading">

                  <FolderTree
                    size={15}
                  />

                  Category Information

                </div>

                <div className="mmics-categories-form-grid">

                  {/* NAME */}

                  <div className="mmics-categories-field">

                    <label>
                      Category Name
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={
                        formData.name
                      }
                      onChange={
                        handleNameChange
                      }
                      placeholder="e.g. Corporate Gifts"
                    />

                  </div>

                  {/* SLUG */}

                  <div className="mmics-categories-field">

                    <label>
                      Slug
                    </label>

                    <div className="mmics-categories-input-with-icon">

                      <Tag
                        size={14}
                      />

                      <input
                        type="text"
                        name="slug"
                        value={
                          formData.slug
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="corporate-gifts"
                      />

                    </div>

                    <small>
                      Used for public
                      category URLs.
                    </small>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mmics-categories-field full">

                    <label>
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={
                        formData.description
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Briefly describe this category..."
                      rows={4}
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  DISPLAY SETTINGS
              ================================================= */}

              <div className="mmics-categories-form-section">

                <div className="mmics-categories-form-section-heading">

                  <ArrowUpDown
                    size={15}
                  />

                  Display Settings

                </div>

                <div className="mmics-categories-form-grid">

                  <div className="mmics-categories-field">

                    <label>
                      Display Order
                    </label>

                    <div className="mmics-categories-input-with-icon">

                      <Hash size={14} />

                      <input
                        type="number"
                        min="0"
                        name="displayOrder"
                        value={
                          formData.displayOrder
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="0"
                      />

                    </div>

                    <small>
                      Lower numbers appear
                      first.
                    </small>

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="mmics-categories-form-footer">

                <button
                  type="button"
                  className="secondary"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={14}
                        className="mmics-categories-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        size={14}
                      />

                      {editingCategory
                        ? "Update Category"
                        : "Create Category"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {isViewModalOpen &&
        viewingCategory && (
          <div
            className="mmics-categories-modal-backdrop"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setIsViewModalOpen(
                  false
                );
              }
            }}
          >

            <div className="mmics-categories-view-modal">

              <div className="mmics-categories-view-header">

                <span>
                  CATEGORY DETAILS
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setIsViewModalOpen(
                      false
                    )
                  }
                >
                  <X size={17} />
                </button>

              </div>

              {/* CATEGORY HERO */}

              <div className="mmics-categories-view-profile">

                <div className="mmics-categories-view-icon">

                  <FolderTree
                    size={27}
                  />

                </div>

                <h2>
                  {
                    viewingCategory.name
                  }
                </h2>

                <p>
                  /
                  {viewingCategory.slug ||
                    createSlug(
                      viewingCategory.name
                    )}
                </p>

                <span
                  className={`mmics-category-status ${
                    viewingCategory.status ===
                    "ACTIVE"
                      ? "active"
                      : "inactive"
                  }`}
                >
                  <span />

                  {viewingCategory.status ===
                  "ACTIVE"
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

              {/* DETAILS */}

              <div className="mmics-categories-detail-grid">

                <div>

                  <span>
                    <Tag size={12} />
                    Slug
                  </span>

                  <strong>
                    {
                      viewingCategory.slug ||
                      "-"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    <ArrowUpDown
                      size={12}
                    />
                    Display Order
                  </span>

                  <strong>
                    {
                      viewingCategory.displayOrder ??
                      0
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    <CalendarDays
                      size={12}
                    />
                    Created
                  </span>

                  <strong>
                    {formatDate(
                      viewingCategory.createdAt
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    <Hash size={12} />
                    ID
                  </span>

                  <strong>
                    {
                      viewingCategory.id
                    }
                  </strong>

                </div>

                <div className="full">

                  <span>
                    <FileText
                      size={12}
                    />
                    Description
                  </span>

                  <strong>
                    {
                      viewingCategory.description ||
                      "No description added."
                    }
                  </strong>

                </div>

              </div>

              {/* FOOTER */}

              <div className="mmics-categories-view-footer">

                <button
                  type="button"
                  onClick={() =>
                    setIsViewModalOpen(
                      false
                    )
                  }
                >
                  Close
                </button>

                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    setIsViewModalOpen(
                      false
                    );

                    handleEditCategory(
                      viewingCategory
                    );
                  }}
                >
                  <Pencil size={14} />

                  Edit Category
                </button>

              </div>

            </div>

          </div>
        )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {isDeleteModalOpen &&
        deletingCategory && (
          <div
            className="mmics-categories-modal-backdrop"
            onMouseDown={(event) => {
              if (
                event.target ===
                  event.currentTarget &&
                !deleting
              ) {
                setIsDeleteModalOpen(
                  false
                );

                setDeletingCategory(
                  null
                );
              }
            }}
          >

            <div className="mmics-categories-delete-modal">

              <div className="mmics-categories-delete-icon">

                <Trash2 size={22} />

              </div>

              <h2>
                Delete Category?
              </h2>

              <p>
                Are you sure you want
                to delete{" "}
                <strong>
                  {
                    deletingCategory.name
                  }
                </strong>
                ? This action cannot
                be undone.
              </p>

              <div className="mmics-categories-delete-actions">

                <button
                  type="button"
                  onClick={() => {
                    if (!deleting) {
                      setIsDeleteModalOpen(
                        false
                      );

                      setDeletingCategory(
                        null
                      );
                    }
                  }}
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={
                    handleDeleteConfirm
                  }
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <RefreshCw
                        size={14}
                        className="mmics-categories-spin"
                      />

                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2
                        size={14}
                      />

                      Delete Category
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default Categories;