const prisma = require("../config/database");

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.productCategory.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch categories",
    });
  }
};

// GET SINGLE CATEGORY
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.productCategory.findUnique({
      where: {
        id,
      },
      include: {
        products: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch category",
    });
  }
};

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      isActive,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const existingName =
      await prisma.productCategory.findUnique({
        where: {
          name,
        },
      });

    if (existingName) {
      return res.status(409).json({
        success: false,
        message: "Category name already exists",
      });
    }

    const existingSlug =
      await prisma.productCategory.findUnique({
        where: {
          slug,
        },
      });

    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: "Category slug already exists",
      });
    }

    const category =
      await prisma.productCategory.create({
        data: {
          name,
          slug,
          description: description || null,
          isActive:
            isActive !== undefined
              ? Boolean(isActive)
              : true,
        },
      });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create category",
    });
  }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      slug,
      description,
      isActive,
    } = req.body;

    const category =
      await prisma.productCategory.findUnique({
        where: {
          id,
        },
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name && name !== category.name) {
      const existingName =
        await prisma.productCategory.findUnique({
          where: {
            name,
          },
        });

      if (
        existingName &&
        existingName.id !== category.id
      ) {
        return res.status(409).json({
          success: false,
          message: "Category name already exists",
        });
      }
    }

    if (slug && slug !== category.slug) {
      const existingSlug =
        await prisma.productCategory.findUnique({
          where: {
            slug,
          },
        });

      if (
        existingSlug &&
        existingSlug.id !== category.id
      ) {
        return res.status(409).json({
          success: false,
          message: "Category slug already exists",
        });
      }
    }

    const updatedCategory =
      await prisma.productCategory.update({
        where: {
          id,
        },
        data: {
          ...(name !== undefined && { name }),
          ...(slug !== undefined && { slug }),
          ...(description !== undefined && {
            description,
          }),
          ...(isActive !== undefined && {
            isActive: Boolean(isActive),
          }),
        },
      });

    res.json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update category",
    });
  }
};

// CHANGE CATEGORY STATUS
const changeCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    const category =
      await prisma.productCategory.findUnique({
        where: {
          id,
        },
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const updatedCategory =
      await prisma.productCategory.update({
        where: {
          id,
        },
        data: {
          isActive,
        },
      });

    res.json({
      success: true,
      message: `Category ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      category: updatedCategory,
    });
  } catch (error) {
    console.error(
      "Change category status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to change category status",
    });
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category =
      await prisma.productCategory.findUnique({
        where: {
          id,
        },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category._count.products > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete a category containing products",
      });
    }

    await prisma.productCategory.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete category",
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  changeCategoryStatus,
  deleteCategory,
};