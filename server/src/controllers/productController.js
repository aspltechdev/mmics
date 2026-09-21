const fs = require("fs/promises");
const path = require("path");

const prisma =
  require("../config/database");


/* ============================================================
   VERCEL BLOB
============================================================ */

const getBlobSdk = () =>
  import("@vercel/blob");


/* ============================================================
   PRODUCT INCLUDE
============================================================ */

const PRODUCT_INCLUDE = {
  category: true,
  images: true,
};


/* ============================================================
   SAFE FILE NAME
============================================================ */

const createSafeFilename = (
  originalName = "image.jpg"
) => {
  const cleaned =
    String(originalName)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(
        /[^a-z0-9._-]/g,
        "-"
      )
      .replace(/-+/g, "-");

  return (
    cleaned ||
    "image.jpg"
  );
};


/* ============================================================
   BOOLEAN HELPER
============================================================ */

const parseBoolean = (
  value,
  fallback = false
) => {
  if (
    value === true ||
    value === "true" ||
    value === "1" ||
    value === 1
  ) {
    return true;
  }

  if (
    value === false ||
    value === "false" ||
    value === "0" ||
    value === 0
  ) {
    return false;
  }

  return fallback;
};


/* ============================================================
   STORAGE MODE

   LOCAL:
   saves inside /uploads/products

   VERCEL:
   saves to Vercel Blob
============================================================ */

const shouldUseBlob = () => {
  return Boolean(
    process.env.VERCEL ||
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_OIDC_TOKEN
  );
};


/* ============================================================
   UPLOAD PRODUCT IMAGE
============================================================ */

const uploadProductImage =
  async (file) => {
    if (!file) {
      throw new Error(
        "Product image is required."
      );
    }


    const safeFilename =
      createSafeFilename(
        file.originalname
      );


    /* ========================================================
       VERCEL BLOB
    ======================================================== */

    if (shouldUseBlob()) {
      const {
        put,
      } = await getBlobSdk();


      const pathname =
        `products/${Date.now()}-${safeFilename}`;


      const blob =
        await put(
          pathname,
          file.buffer,
          {
            access: "public",

            addRandomSuffix: true,

            contentType:
              file.mimetype,
          }
        );


      return blob.url;
    }


    /* ========================================================
       LOCAL STORAGE
    ======================================================== */

    const uploadDirectory =
      path.join(
        process.cwd(),
        "uploads",
        "products"
      );


    await fs.mkdir(
      uploadDirectory,
      {
        recursive: true,
      }
    );


    const filename =
      `${Date.now()}-${safeFilename}`;


    const filePath =
      path.join(
        uploadDirectory,
        filename
      );


    await fs.writeFile(
      filePath,
      file.buffer
    );


    return (
      `/uploads/products/${filename}`
    );
  };


/* ============================================================
   DELETE STORED IMAGE
============================================================ */

const deleteStoredImage =
  async (imageUrl) => {
    if (!imageUrl) {
      return;
    }


    try {

      /* ======================================================
         VERCEL BLOB
      ====================================================== */

      if (
        imageUrl.includes(
          "vercel-storage.com"
        )
      ) {
        const {
          del,
        } = await getBlobSdk();


        await del(
          imageUrl
        );

        return;
      }


      /* ======================================================
         LOCAL IMAGE
      ====================================================== */

      if (
        imageUrl.startsWith(
          "/uploads/"
        )
      ) {
        const relativePath =
          imageUrl.replace(
            /^\/+/,
            ""
          );


        const filePath =
          path.join(
            process.cwd(),
            relativePath
          );


        try {
          await fs.unlink(
            filePath
          );
        } catch {
          /*
           * File may already be removed.
           * Do not stop DB operation.
           */
        }
      }

    } catch (error) {

      console.error(
        "Delete stored product image error:",
        error
      );

    }
  };


/* ============================================================
   GET PRODUCT ID
============================================================ */

const getProductId = (
  req
) => {
  return (
    req.params.productId ||
    req.params.id ||
    ""
  );
};


/* ============================================================
   GET IMAGE ID
============================================================ */

const getImageId = (
  req
) => {
  return (
    req.params.imageId ||
    req.params.id ||
    ""
  );
};


/* ============================================================
   GET ALL PRODUCTS

   GET /api/products
============================================================ */

const getProducts =
  async (
    req,
    res
  ) => {
    try {

      const products =
        await prisma.product.findMany({
          include:
            PRODUCT_INCLUDE,

          orderBy: {
            createdAt:
              "desc",
          },
        });


      return res
        .status(200)
        .json({
          success: true,

          count:
            products.length,

          products,

          data:
            products,
        });

    } catch (error) {

      console.error(
        "Get products error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to fetch products.",
        });
    }
  };


/* ============================================================
   GET ACTIVE PRODUCTS
============================================================ */

const getActiveProducts =
  async (
    req,
    res
  ) => {
    try {

      const products =
        await prisma.product.findMany({
          where: {
            status:
              "ACTIVE",
          },

          include:
            PRODUCT_INCLUDE,

          orderBy: {
            createdAt:
              "desc",
          },
        });


      return res
        .status(200)
        .json({
          success: true,

          count:
            products.length,

          products,

          data:
            products,
        });

    } catch (error) {

      console.error(
        "Get active products error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to fetch products.",
        });
    }
  };


/* ============================================================
   GET PRODUCT BY ID

   GET /api/products/:id
============================================================ */

const getProduct =
  async (
    req,
    res
  ) => {
    try {

      const id =
        getProductId(
          req
        );


      if (!id) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Product ID is required.",
          });
      }


      const product =
        await prisma.product.findUnique({
          where: {
            id,
          },

          include:
            PRODUCT_INCLUDE,
        });


      if (!product) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Product not found.",
          });
      }


      return res
        .status(200)
        .json({
          success: true,

          product,

          data:
            product,
        });

    } catch (error) {

      console.error(
        "Get product error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to fetch product.",
        });
    }
  };


/* ============================================================
   GET PRODUCT BY SLUG

   GET /api/products/slug/:slug
============================================================ */

const getProductBySlug =
  async (
    req,
    res
  ) => {
    try {

      const slug =
        String(
          req.params.slug ||
          ""
        )
          .trim()
          .toLowerCase();


      if (!slug) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Product slug is required.",
          });
      }


      /*
       * findFirst works even if slug is
       * not marked @unique in Prisma.
       */
      const product =
        await prisma.product.findFirst({
          where: {
            slug,
          },

          include:
            PRODUCT_INCLUDE,
        });


      if (!product) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Product not found.",
          });
      }


      return res
        .status(200)
        .json({
          success: true,

          product,

          data:
            product,
        });

    } catch (error) {

      console.error(
        "Get product by slug error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to fetch product.",
        });
    }
  };


/* ============================================================
   CREATE PRODUCT

   POST /api/products
============================================================ */

const createProduct =
  async (
    req,
    res
  ) => {
    try {

      const {
        categoryId,
        name,
        slug,
        description,
        status,
      } = req.body;


      /* ======================================================
         VALIDATION
      ====================================================== */

      if (!categoryId) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Category is required.",
          });
      }


      if (
        !name ||
        !String(name).trim()
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Product name is required.",
          });
      }


      if (
        !slug ||
        !String(slug).trim()
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Product slug is required.",
          });
      }


      const normalizedSlug =
        String(slug)
          .trim()
          .toLowerCase();


      /* ======================================================
         CATEGORY CHECK
      ====================================================== */

      const category =
        await prisma.productCategory.findUnique({
          where: {
            id:
              categoryId,
          },
        });


      if (!category) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Selected category was not found.",
          });
      }


      /* ======================================================
         SLUG CHECK
      ====================================================== */

      const existingProduct =
        await prisma.product.findFirst({
          where: {
            slug:
              normalizedSlug,
          },
        });


      if (
        existingProduct
      ) {
        return res
          .status(409)
          .json({
            success: false,

            message:
              "A product with this slug already exists.",
          });
      }


      /* ======================================================
         CREATE PRODUCT
      ====================================================== */

      const product =
        await prisma.product.create({
          data: {
            categoryId,

            name:
              String(name)
                .trim(),

            slug:
              normalizedSlug,

            description:
              description
                ? String(
                    description
                  ).trim()
                : null,

            status:
              status ||
              "ACTIVE",
          },

          include:
            PRODUCT_INCLUDE,
        });


      return res
        .status(201)
        .json({
          success: true,

          message:
            "Product created successfully.",

          product,

          data:
            product,
        });

    } catch (error) {

      console.error(
        "Create product error:",
        error
      );


      if (
        error?.code ===
        "P2002"
      ) {
        return res
          .status(409)
          .json({
            success: false,

            message:
              "A product with this slug already exists.",
          });
      }


      return res
        .status(500)
        .json({
          success: false,

          message:
            error?.message ||
            "Unable to create product.",
        });
    }
  };


/* ============================================================
   UPDATE PRODUCT

   PUT /api/products/:id
============================================================ */

const updateProduct =
  async (
    req,
    res
  ) => {
    try {

      const id =
        getProductId(
          req
        );


      if (!id) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Product ID is required.",
          });
      }


      const existingProduct =
        await prisma.product.findUnique({
          where: {
            id,
          },
        });


      if (
        !existingProduct
      ) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Product not found.",
          });
      }


      const {
        categoryId,
        name,
        slug,
        description,
        status,
      } = req.body;


      const updateData =
        {};


      /* ======================================================
         CATEGORY
      ====================================================== */

      if (
        categoryId !==
        undefined
      ) {
        const category =
          await prisma.productCategory.findUnique({
            where: {
              id:
                categoryId,
            },
          });


        if (!category) {
          return res
            .status(404)
            .json({
              success: false,

              message:
                "Selected category was not found.",
            });
        }


        updateData.categoryId =
          categoryId;
      }


      /* ======================================================
         NAME
      ====================================================== */

      if (
        name !==
        undefined
      ) {
        const cleanName =
          String(name)
            .trim();


        if (!cleanName) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Product name cannot be empty.",
            });
        }


        updateData.name =
          cleanName;
      }


      /* ======================================================
         SLUG
      ====================================================== */

      if (
        slug !==
        undefined
      ) {
        const cleanSlug =
          String(slug)
            .trim()
            .toLowerCase();


        if (!cleanSlug) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Product slug cannot be empty.",
            });
        }


        const existingSlug =
          await prisma.product.findFirst({
            where: {
              slug:
                cleanSlug,

              NOT: {
                id,
              },
            },
          });


        if (
          existingSlug
        ) {
          return res
            .status(409)
            .json({
              success: false,

              message:
                "A product with this slug already exists.",
            });
        }


        updateData.slug =
          cleanSlug;
      }


      /* ======================================================
         DESCRIPTION
      ====================================================== */

      if (
        description !==
        undefined
      ) {
        updateData.description =
          description
            ? String(
                description
              ).trim()
            : null;
      }


      /* ======================================================
         STATUS
      ====================================================== */

      if (
        status !==
        undefined
      ) {
        updateData.status =
          status;
      }


      /* ======================================================
         UPDATE
      ====================================================== */

      const product =
        await prisma.product.update({
          where: {
            id,
          },

          data:
            updateData,

          include:
            PRODUCT_INCLUDE,
        });


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Product updated successfully.",

          product,

          data:
            product,
        });

    } catch (error) {

      console.error(
        "Update product error:",
        error
      );


      if (
        error?.code ===
        "P2002"
      ) {
        return res
          .status(409)
          .json({
            success: false,

            message:
              "A product with this slug already exists.",
          });
      }


      return res
        .status(500)
        .json({
          success: false,

          message:
            error?.message ||
            "Unable to update product.",
        });
    }
  };


/* ============================================================
   UPDATE PRODUCT STATUS

   PATCH /api/products/:id/status
============================================================ */

const updateProductStatus =
  async (
    req,
    res
  ) => {
    try {

      const id =
        getProductId(
          req
        );


      const {
        status,
      } = req.body;


      if (
        ![
          "ACTIVE",
          "INACTIVE",
        ].includes(
          status
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Status must be ACTIVE or INACTIVE.",
          });
      }


      const existingProduct =
        await prisma.product.findUnique({
          where: {
            id,
          },
        });


      if (
        !existingProduct
      ) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Product not found.",
          });
      }


      const product =
        await prisma.product.update({
          where: {
            id,
          },

          data: {
            status,
          },

          include:
            PRODUCT_INCLUDE,
        });


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Product status updated successfully.",

          product,

          data:
            product,
        });

    } catch (error) {

      console.error(
        "Product status error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            error?.message ||
            "Unable to update product status.",
        });
    }
  };


/* ============================================================
   ADD PRODUCT IMAGE

   POST /api/products/:id/images
============================================================ */

const addProductImage =
  async (
    req,
    res
  ) => {
    let uploadedImageUrl =
      null;


    try {

      const productId =
        getProductId(
          req
        );


      if (!productId) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Product ID is required.",
          });
      }


      if (!req.file) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please select a product image.",
          });
      }


      const product =
        await prisma.product.findUnique({
          where: {
            id:
              productId,
          },

          include: {
            images: true,
          },
        });


      if (!product) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Product not found.",
          });
      }


      /* ======================================================
         PRIMARY IMAGE
      ====================================================== */

      const requestedPrimary =
        parseBoolean(
          req.body
            ?.isPrimary,
          false
        );


      /*
       * First uploaded image automatically
       * becomes primary.
       */
      const isPrimary =
        requestedPrimary ||
        product.images.length ===
          0;


      /* ======================================================
         STORE IMAGE
      ====================================================== */

      uploadedImageUrl =
        await uploadProductImage(
          req.file
        );


      /* ======================================================
         REMOVE OLD PRIMARY FLAG
      ====================================================== */

      if (isPrimary) {
        await prisma.productImage.updateMany({
          where: {
            productId,
          },

          data: {
            isPrimary:
              false,
          },
        });
      }


      /* ======================================================
         CREATE IMAGE RECORD
      ====================================================== */

      const image =
        await prisma.productImage.create({
          data: {
            productId,

            imageUrl:
              uploadedImageUrl,

            isPrimary,
          },
        });


      /* ======================================================
         RETURN UPDATED PRODUCT
      ====================================================== */

      const updatedProduct =
        await prisma.product.findUnique({
          where: {
            id:
              productId,
          },

          include:
            PRODUCT_INCLUDE,
        });


      return res
        .status(201)
        .json({
          success: true,

          message:
            "Product image uploaded successfully.",

          image,

          product:
            updatedProduct,

          data:
            image,
        });

    } catch (error) {

      console.error(
        "Add product image error:",
        error
      );


      /*
       * Blob/local image may have uploaded
       * before Prisma failed.
       */
      if (
        uploadedImageUrl
      ) {
        await deleteStoredImage(
          uploadedImageUrl
        );
      }


      return res
        .status(500)
        .json({
          success: false,

          message:
            error?.message ||
            "Unable to upload product image.",
        });
    }
  };


/* ============================================================
   DELETE PRODUCT IMAGE
============================================================ */

const deleteProductImage =
  async (
    req,
    res
  ) => {
    try {

      const imageId =
        getImageId(
          req
        );


      if (!imageId) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Image ID is required.",
          });
      }


      const image =
        await prisma.productImage.findUnique({
          where: {
            id:
              imageId,
          },
        });


      if (!image) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Product image not found.",
          });
      }


      const {
        productId,
        imageUrl,
        isPrimary,
      } = image;


      /* ======================================================
         DELETE DB IMAGE
      ====================================================== */

      await prisma.productImage.delete({
        where: {
          id:
            imageId,
        },
      });


      /* ======================================================
         ASSIGN NEW PRIMARY
      ====================================================== */

      if (isPrimary) {

        const nextImage =
          await prisma.productImage.findFirst({
            where: {
              productId,
            },

            orderBy: {
              createdAt:
                "asc",
            },
          });


        if (nextImage) {
          await prisma.productImage.update({
            where: {
              id:
                nextImage.id,
            },

            data: {
              isPrimary:
                true,
            },
          });
        }
      }


      /* ======================================================
         DELETE PHYSICAL/BLOB FILE
      ====================================================== */

      await deleteStoredImage(
        imageUrl
      );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Product image deleted successfully.",
        });

    } catch (error) {

      console.error(
        "Delete product image error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            error?.message ||
            "Unable to delete product image.",
        });
    }
  };


/* ============================================================
   DELETE PRODUCT

   DELETE /api/products/:id
============================================================ */

const deleteProduct =
  async (
    req,
    res
  ) => {
    try {

      const id =
        getProductId(
          req
        );


      if (!id) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Product ID is required.",
          });
      }


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
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Product not found.",
          });
      }


      const imageUrls =
        product.images.map(
          (
            image
          ) =>
            image.imageUrl
        );


      /* ======================================================
         DELETE DB RECORDS
      ====================================================== */

      await prisma.$transaction([

        prisma.productImage.deleteMany({
          where: {
            productId:
              id,
          },
        }),

        prisma.product.delete({
          where: {
            id,
          },
        }),

      ]);


      /* ======================================================
         DELETE STORED FILES
      ====================================================== */

      for (
        const imageUrl
        of imageUrls
      ) {
        await deleteStoredImage(
          imageUrl
        );
      }


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Product deleted successfully.",
        });

    } catch (error) {

      console.error(
        "Delete product error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            error?.message ||
            "Unable to delete product.",
        });
    }
  };


/* ============================================================
   EXPORTS

   These names cover the names already used by
   productRoutes.js and the frontend.
============================================================ */

module.exports = {

  /* GET ALL */

  getProducts,

  getAllProducts:
    getProducts,

  getAll:
    getProducts,

  getAdminProducts:
    getProducts,


  /* ACTIVE */

  getActiveProducts,

  getPublicProducts:
    getActiveProducts,


  /* GET BY ID */

  getProduct,

  getProductById:
    getProduct,

  getById:
    getProduct,


  /* GET BY SLUG */

  getProductBySlug,


  /* CREATE */

  createProduct,

  create:
    createProduct,


  /* UPDATE */

  updateProduct,

  update:
    updateProduct,


  /* STATUS */

  updateProductStatus,

  changeProductStatus:
    updateProductStatus,

  updateStatus:
    updateProductStatus,

  changeStatus:
    updateProductStatus,


  /* ADD IMAGE */

  addProductImage,

  addImage:
    addProductImage,


  /* DELETE IMAGE */

  deleteProductImage,

  deleteImage:
    deleteProductImage,


  /* DELETE PRODUCT */

  deleteProduct,

  remove:
    deleteProduct,

};
