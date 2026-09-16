// const prisma = require("../config/database");

// // GET ALL PRODUCTS
// const getProducts = async (req, res) => {
//   try {
//     const { category, status } = req.query;

//     const products = await prisma.product.findMany({
//       where: {
//         ...(category && {
//           category: {
//             slug: category,
//           },
//         }),

//         ...(status && {
//           status,
//         }),
//       },

//       include: {
//         category: true,
//         images: {
//           orderBy: {
//             createdAt: "asc",
//           },
//         },
//       },

//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     res.json({
//       success: true,
//       count: products.length,
//       products,
//     });
//   } catch (error) {
//     console.error("Get products error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch products",
//     });
//   }
// };

// // GET SINGLE PRODUCT BY ID
// const getProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await prisma.product.findUnique({
//       where: {
//         id,
//       },

//       include: {
//         category: true,
//         images: {
//           orderBy: {
//             createdAt: "asc",
//           },
//         },
//       },
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.json({
//       success: true,
//       product,
//     });
//   } catch (error) {
//     console.error("Get product error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch product",
//     });
//   }
// };

// // GET PRODUCT BY SLUG
// const getProductBySlug = async (req, res) => {
//   try {
//     const { slug } = req.params;

//     const product = await prisma.product.findUnique({
//       where: {
//         slug,
//       },

//       include: {
//         category: true,
//         images: {
//           orderBy: {
//             createdAt: "asc",
//           },
//         },
//       },
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.json({
//       success: true,
//       product,
//     });
//   } catch (error) {
//     console.error("Get product by slug error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch product",
//     });
//   }
// };

// // CREATE PRODUCT
// const createProduct = async (req, res) => {
//   try {
//     const {
//       categoryId,
//       name,
//       slug,
//       description,
//       status,
//       images,
//     } = req.body;

//     if (!categoryId || !name || !slug) {
//       return res.status(400).json({
//         success: false,
//         message: "Category, name and slug are required",
//       });
//     }

//     const category =
//       await prisma.productCategory.findUnique({
//         where: {
//           id: categoryId,
//         },
//       });

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     if (!category.isActive) {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot add product to an inactive category",
//       });
//     }

//     const existingProduct =
//       await prisma.product.findUnique({
//         where: {
//           slug,
//         },
//       });

//     if (existingProduct) {
//       return res.status(409).json({
//         success: false,
//         message: "Product slug already exists",
//       });
//     }

//     const product = await prisma.product.create({
//       data: {
//         categoryId,
//         name,
//         slug,
//         description: description || null,
//         status: status || "ACTIVE",

//         images:
//           Array.isArray(images) && images.length > 0
//             ? {
//                 create: images.map((image, index) => ({
//                   imageUrl: image.imageUrl || image,
//                   isPrimary:
//                     image.isPrimary !== undefined
//                       ? image.isPrimary
//                       : index === 0,
//                 })),
//               }
//             : undefined,
//       },

//       include: {
//         category: true,
//         images: true,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("Create product error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to create product",
//     });
//   }
// };

// // UPDATE PRODUCT
// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       categoryId,
//       name,
//       slug,
//       description,
//       status,
//     } = req.body;

//     const existingProduct =
//       await prisma.product.findUnique({
//         where: {
//           id,
//         },
//       });

//     if (!existingProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     if (categoryId) {
//       const category =
//         await prisma.productCategory.findUnique({
//           where: {
//             id: categoryId,
//           },
//         });

//       if (!category) {
//         return res.status(404).json({
//           success: false,
//           message: "Category not found",
//         });
//       }
//     }

//     if (slug && slug !== existingProduct.slug) {
//       const duplicate =
//         await prisma.product.findUnique({
//           where: {
//             slug,
//           },
//         });

//       if (duplicate && duplicate.id !== id) {
//         return res.status(409).json({
//           success: false,
//           message: "Product slug already exists",
//         });
//       }
//     }

//     const product = await prisma.product.update({
//       where: {
//         id,
//       },

//       data: {
//         ...(categoryId !== undefined && {
//           categoryId,
//         }),

//         ...(name !== undefined && {
//           name,
//         }),

//         ...(slug !== undefined && {
//           slug,
//         }),

//         ...(description !== undefined && {
//           description,
//         }),

//         ...(status !== undefined && {
//           status,
//         }),
//       },

//       include: {
//         category: true,
//         images: true,
//       },
//     });

//     res.json({
//       success: true,
//       message: "Product updated successfully",
//       product,
//     });
//   } catch (error) {
//     console.error("Update product error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to update product",
//     });
//   }
// };

// // CHANGE PRODUCT STATUS
// const changeProductStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!["ACTIVE", "INACTIVE"].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Status must be ACTIVE or INACTIVE",
//       });
//     }

//     const product = await prisma.product.update({
//       where: {
//         id,
//       },

//       data: {
//         status,
//       },
//     });

//     res.json({
//       success: true,
//       message: `Product ${
//         status === "ACTIVE"
//           ? "activated"
//           : "deactivated"
//       } successfully`,
//       product,
//     });
//   } catch (error) {
//     console.error(
//       "Change product status error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: "Unable to change product status",
//     });
//   }
// };

// // ADD PRODUCT IMAGE
// const addProductImage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { imageUrl, isPrimary } = req.body;

//     if (!imageUrl) {
//       return res.status(400).json({
//         success: false,
//         message: "imageUrl is required",
//       });
//     }

//     const product = await prisma.product.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     if (isPrimary === true) {
//       await prisma.productImage.updateMany({
//         where: {
//           productId: id,
//         },
//         data: {
//           isPrimary: false,
//         },
//       });
//     }

//     const image = await prisma.productImage.create({
//       data: {
//         productId: id,
//         imageUrl,
//         isPrimary: isPrimary === true,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "Product image added successfully",
//       image,
//     });
//   } catch (error) {
//     console.error(
//       "Add product image error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: "Unable to add product image",
//     });
//   }
// };

// // DELETE PRODUCT IMAGE
// const deleteProductImage = async (req, res) => {
//   try {
//     const { imageId } = req.params;

//     const image = await prisma.productImage.findUnique({
//       where: {
//         id: imageId,
//       },
//     });

//     if (!image) {
//       return res.status(404).json({
//         success: false,
//         message: "Product image not found",
//       });
//     }

//     await prisma.productImage.delete({
//       where: {
//         id: imageId,
//       },
//     });

//     res.json({
//       success: true,
//       message: "Product image deleted successfully",
//     });
//   } catch (error) {
//     console.error(
//       "Delete product image error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: "Unable to delete product image",
//     });
//   }
// };

// // DELETE PRODUCT
// const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await prisma.product.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     await prisma.product.delete({
//       where: {
//         id,
//       },
//     });

//     res.json({
//       success: true,
//       message: "Product deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete product error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to delete product",
//     });
//   }
// };

// module.exports = {
//   getProducts,
//   getProduct,
//   getProductBySlug,
//   createProduct,
//   updateProduct,
//   changeProductStatus,
//   addProductImage,
//   deleteProductImage,
//   deleteProduct,
// };


















const prisma = require("../config/database");

// =========================================================
// GET ALL PRODUCTS
// =========================================================

const getProducts = async (req, res) => {
  try {
    const { category, status } = req.query;

    const products = await prisma.product.findMany({
      where: {
        ...(category && {
          category: {
            slug: category,
          },
        }),

        ...(status && {
          status,
        }),
      },

      include: {
        category: true,

        images: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
};

// =========================================================
// GET SINGLE PRODUCT BY ID
// =========================================================

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          category: true,

          images: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
};

// =========================================================
// GET PRODUCT BY SLUG
// =========================================================

const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product =
      await prisma.product.findUnique({
        where: {
          slug,
        },

        include: {
          category: true,

          images: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Get product by slug error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch product",
    });
  }
};

// =========================================================
// CREATE PRODUCT
// =========================================================

const createProduct = async (req, res) => {
  try {
    const {
      categoryId,
      name,
      slug,
      description,
      status,
      images,
    } = req.body;

    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

    if (!categoryId || !name || !slug) {
      return res.status(400).json({
        success: false,
        message:
          "Category, name and slug are required",
      });
    }

    // -----------------------------------------
    // CHECK CATEGORY
    // -----------------------------------------

    const category =
      await prisma.productCategory.findUnique({
        where: {
          id: categoryId,
        },
      });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!category.isActive) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot add product to an inactive category",
      });
    }

    // -----------------------------------------
    // CHECK DUPLICATE SLUG
    // -----------------------------------------

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          slug,
        },
      });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message:
          "Product slug already exists",
      });
    }

    // -----------------------------------------
    // NORMALIZE STATUS
    // -----------------------------------------

    const productStatus =
      status === "INACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    // -----------------------------------------
    // CREATE PRODUCT
    // -----------------------------------------

    const product =
      await prisma.product.create({
        data: {
          categoryId,

          name: name.trim(),

          slug: slug.trim(),

          description:
            description &&
            description.trim()
              ? description.trim()
              : null,

          status: productStatus,

          /*
           * Backward compatibility:
           * If images are supplied as image URLs
           * in JSON, they will still be supported.
           */
          images:
            Array.isArray(images) &&
            images.length > 0
              ? {
                  create: images.map(
                    (image, index) => ({
                      imageUrl:
                        typeof image ===
                        "string"
                          ? image
                          : image.imageUrl,

                      isPrimary:
                        typeof image ===
                        "object" &&
                        image.isPrimary !==
                          undefined
                          ? image.isPrimary
                          : index === 0,
                    })
                  ),
                }
              : undefined,
        },

        include: {
          category: true,

          images: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to create product",
    });
  }
};

// =========================================================
// UPDATE PRODUCT
// =========================================================

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      categoryId,
      name,
      slug,
      description,
      status,
    } = req.body;

    // -----------------------------------------
    // FIND PRODUCT
    // -----------------------------------------

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -----------------------------------------
    // CHECK CATEGORY
    // -----------------------------------------

    if (categoryId) {
      const category =
        await prisma.productCategory.findUnique({
          where: {
            id: categoryId,
          },
        });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      if (!category.isActive) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot move product to an inactive category",
        });
      }
    }

    // -----------------------------------------
    // CHECK DUPLICATE SLUG
    // -----------------------------------------

    if (
      slug &&
      slug !== existingProduct.slug
    ) {
      const duplicate =
        await prisma.product.findUnique({
          where: {
            slug,
          },
        });

      if (
        duplicate &&
        duplicate.id !== id
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Product slug already exists",
        });
      }
    }

    // -----------------------------------------
    // PREPARE UPDATE
    // -----------------------------------------

    const updateData = {};

    if (categoryId !== undefined) {
      updateData.categoryId =
        categoryId;
    }

    if (name !== undefined) {
      updateData.name =
        name.trim();
    }

    if (slug !== undefined) {
      updateData.slug =
        slug.trim();
    }

    if (description !== undefined) {
      updateData.description =
        description &&
        description.trim()
          ? description.trim()
          : null;
    }

    if (status !== undefined) {
      if (
        !["ACTIVE", "INACTIVE"].includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Status must be ACTIVE or INACTIVE",
        });
      }

      updateData.status = status;
    }

    // -----------------------------------------
    // UPDATE
    // -----------------------------------------

    const product =
      await prisma.product.update({
        where: {
          id,
        },

        data: updateData,

        include: {
          category: true,

          images: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    res.json({
      success: true,
      message:
        "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update product",
    });
  }
};

// =========================================================
// CHANGE PRODUCT STATUS
// =========================================================

const changeProductStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // -----------------------------------------
    // VALIDATE STATUS
    // -----------------------------------------

    if (
      !["ACTIVE", "INACTIVE"].includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be ACTIVE or INACTIVE",
      });
    }

    // -----------------------------------------
    // CHECK PRODUCT
    // -----------------------------------------

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -----------------------------------------
    // UPDATE STATUS
    // -----------------------------------------

    const product =
      await prisma.product.update({
        where: {
          id,
        },

        data: {
          status,
        },

        include: {
          category: true,

          images: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    res.json({
      success: true,
      message: `Product ${
        status === "ACTIVE"
          ? "activated"
          : "deactivated"
      } successfully`,
      product,
    });
  } catch (error) {
    console.error(
      "Change product status error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to change product status",
    });
  }
};

// =========================================================
// ADD PRODUCT IMAGE
// LOCAL FILE UPLOAD
// =========================================================

const addProductImage = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // -----------------------------------------
    // PRODUCT
    // -----------------------------------------

    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -----------------------------------------
    // CHECK UPLOADED FILE
    // -----------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Product image file is required",
      });
    }

    // -----------------------------------------
    // PRIMARY VALUE
    // -----------------------------------------

    const isPrimary =
      req.body.isPrimary === true ||
      req.body.isPrimary === "true";

    // -----------------------------------------
    // GENERATED IMAGE URL
    // -----------------------------------------

    const imageUrl =
      `/uploads/products/${req.file.filename}`;

    // -----------------------------------------
    // IF PRIMARY
    // REMOVE PRIMARY FROM OTHER IMAGES
    // -----------------------------------------

    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: {
          productId: id,
        },

        data: {
          isPrimary: false,
        },
      });
    }

    // -----------------------------------------
    // IF THIS IS THE FIRST IMAGE
    // MAKE IT PRIMARY AUTOMATICALLY
    // -----------------------------------------

    const imageCount =
      await prisma.productImage.count({
        where: {
          productId: id,
        },
      });

    const finalIsPrimary =
      imageCount === 0
        ? true
        : isPrimary;

    // -----------------------------------------
    // CREATE IMAGE RECORD
    // -----------------------------------------

    const image =
      await prisma.productImage.create({
        data: {
          productId: id,

          imageUrl,

          isPrimary: finalIsPrimary,
        },
      });

    res.status(201).json({
      success: true,
      message:
        "Product image uploaded successfully",

      image,
    });
  } catch (error) {
    console.error(
      "Add product image error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to upload product image",
    });
  }
};

// =========================================================
// DELETE PRODUCT IMAGE
// =========================================================

const deleteProductImage = async (
  req,
  res
) => {
  try {
    const { imageId } = req.params;

    // -----------------------------------------
    // FIND IMAGE
    // -----------------------------------------

    const image =
      await prisma.productImage.findUnique({
        where: {
          id: imageId,
        },
      });

    if (!image) {
      return res.status(404).json({
        success: false,
        message:
          "Product image not found",
      });
    }

    // -----------------------------------------
    // DELETE IMAGE
    // -----------------------------------------

    await prisma.productImage.delete({
      where: {
        id: imageId,
      },
    });

    // -----------------------------------------
    // ENSURE PRODUCT STILL HAS PRIMARY IMAGE
    // -----------------------------------------

    if (image.isPrimary) {
      const nextImage =
        await prisma.productImage.findFirst({
          where: {
            productId:
              image.productId,
          },

          orderBy: {
            createdAt: "asc",
          },
        });

      if (nextImage) {
        await prisma.productImage.update({
          where: {
            id: nextImage.id,
          },

          data: {
            isPrimary: true,
          },
        });
      }
    }

    res.json({
      success: true,
      message:
        "Product image deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete product image error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete product image",
    });
  }
};

// =========================================================
// DELETE PRODUCT
// =========================================================

const deleteProduct = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // -----------------------------------------
    // FIND PRODUCT
    // -----------------------------------------

    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          images: true,
        },
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -----------------------------------------
    // DELETE PRODUCT
    // -----------------------------------------
    //
    // ProductImage relation should use
    // onDelete: Cascade in Prisma.
    //

    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete product",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  changeProductStatus,
  addProductImage,
  deleteProductImage,
  deleteProduct,
};

