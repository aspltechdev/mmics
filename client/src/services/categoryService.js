import api from "./api";

/* =========================================================
   NORMALIZE CATEGORY
   Backend stores status as boolean `isActive`.
   Admin UI uses "ACTIVE" / "INACTIVE".
========================================================= */

const normalizeCategory = (category) => {
  if (!category) {
    return category;
  }

  return {
    ...category,

    status:
      category.isActive === true
        ? "ACTIVE"
        : "INACTIVE",
  };
};


/* =========================================================
   CATEGORY SERVICE
========================================================= */

const categoryService = {

  /* =====================================================
     GET ALL CATEGORIES
  ===================================================== */

  getAll: async () => {
    try {
      const response =
        await api.get(
          "/categories"
        );

      const data =
        response.data;

      return {
        ...data,

        categories:
          Array.isArray(
            data?.categories
          )
            ? data.categories.map(
                normalizeCategory
              )
            : [],
      };
    } catch (error) {
      console.error(
        "Category getAll error:",
        error
      );

      throw error;
    }
  },


  /* =====================================================
     GET CATEGORY BY ID
  ===================================================== */

  getById: async (id) => {
    try {
      const response =
        await api.get(
          `/categories/${id}`
        );

      const data =
        response.data;

      return {
        ...data,

        category:
          normalizeCategory(
            data?.category
          ),
      };
    } catch (error) {
      console.error(
        "Category getById error:",
        error
      );

      throw error;
    }
  },


  /* =====================================================
     CREATE CATEGORY
  ===================================================== */

  create: async (data) => {
    try {
      const response =
        await api.post(
          "/categories",
          data
        );

      const responseData =
        response.data;

      return {
        ...responseData,

        category:
          normalizeCategory(
            responseData?.category
          ),
      };
    } catch (error) {
      console.error(
        "Category create error:",
        error
      );

      throw error;
    }
  },


  /* =====================================================
     UPDATE CATEGORY
  ===================================================== */

  update: async (
    id,
    data
  ) => {
    try {
      const response =
        await api.put(
          `/categories/${id}`,
          data
        );

      const responseData =
        response.data;

      return {
        ...responseData,

        category:
          normalizeCategory(
            responseData?.category
          ),
      };
    } catch (error) {
      console.error(
        "Category update error:",
        error
      );

      throw error;
    }
  },


  /* =====================================================
     UPDATE CATEGORY STATUS
  ===================================================== */

  updateStatus: async (
    id,
    status
  ) => {
    try {

      /*
        Frontend sends:

        "ACTIVE"
        or
        "INACTIVE"

        Backend expects:

        {
          isActive: true
        }

        or

        {
          isActive: false
        }
      */

      const isActive =
        status === "ACTIVE";

      console.log(
        "Updating category status:",
        {
          id,
          status,
          isActive,
        }
      );

      const response =
        await api.patch(
          `/categories/${id}/status`,
          {
            isActive,
          }
        );

      const data =
        response.data;

      return {
        ...data,

        category:
          normalizeCategory(
            data?.category
          ),
      };

    } catch (error) {

      console.error(
        "Category status error:",
        error
      );

      console.error(
        "Category status response:",
        error?.response?.data
      );

      throw error;
    }
  },


  /* =====================================================
     DELETE CATEGORY
  ===================================================== */

  remove: async (id) => {
    try {
      const response =
        await api.delete(
          `/categories/${id}`
        );

      return response.data;

    } catch (error) {

      console.error(
        "Category delete error:",
        error
      );

      throw error;
    }
  },

};


export default categoryService;