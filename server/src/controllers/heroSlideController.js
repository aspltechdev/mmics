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
   SAFE FILE NAME
============================================================ */

const createSafeFilename = (
  originalName = "hero-slide.jpg"
) => {
  const cleaned =
    String(originalName)
      .trim()
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /[^a-z0-9._-]/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      );

  return (
    cleaned ||
    "hero-slide.jpg"
  );
};


/* ============================================================
   BOOLEAN
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
   SORT ORDER
============================================================ */

const parseSortOrder = (
  value,
  fallback = 0
) => {
  const number =
    Number(value);

  if (
    Number.isInteger(
      number
    ) &&
    number >= 0
  ) {
    return number;
  }

  return fallback;
};


/* ============================================================
   STORAGE TYPE
============================================================ */

const shouldUseBlob = () => {
  return Boolean(
    process.env.VERCEL ||
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_OIDC_TOKEN
  );
};


/* ============================================================
   UPLOAD HERO IMAGE
============================================================ */

const uploadHeroImage =
  async (file) => {
    if (!file) {
      throw new Error(
        "Hero slide image is required."
      );
    }


    const safeFilename =
      createSafeFilename(
        file.originalname
      );


    /* ========================================================
       VERCEL
    ======================================================== */

    if (
      shouldUseBlob()
    ) {
      const {
        put,
      } = await getBlobSdk();


      const pathname =
        `hero-slides/` +
        `${Date.now()}-` +
        `${safeFilename}`;


      const blob =
        await put(
          pathname,
          file.buffer,
          {
            access:
              "public",

            addRandomSuffix:
              true,

            contentType:
              file.mimetype,
          }
        );


      return blob.url;
    }


    /* ========================================================
       LOCAL
    ======================================================== */

    const uploadDirectory =
      path.join(
        process.cwd(),
        "uploads",
        "hero-slides"
      );


    await fs.mkdir(
      uploadDirectory,
      {
        recursive: true,
      }
    );


    const filename =
      `${Date.now()}-${safeFilename}`;


    await fs.writeFile(
      path.join(
        uploadDirectory,
        filename
      ),
      file.buffer
    );


    return (
      `/uploads/hero-slides/${filename}`
    );
  };


/* ============================================================
   DELETE STORED HERO IMAGE
============================================================ */

const deleteStoredImage =
  async (
    imageUrl
  ) => {
    if (!imageUrl) {
      return;
    }


    try {

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


        await fs.unlink(
          filePath
        ).catch(() => {});
      }

    } catch (error) {

      console.error(
        "Delete hero image error:",
        error
      );
    }
  };


/* ============================================================
   REMOVE LEGACY LOCALHOST URL FROM API RESPONSE

   Old production records like:
   http://localhost:5000/uploads/...

   cannot work on mmics.vercel.app.

   Returning null prevents the browser from making the blocked
   localhost request. Re-upload that old image once from admin.
============================================================ */

const normalizeImageUrl = (
  imageUrl
) => {
  if (!imageUrl) {
    return null;
  }


  if (
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(
      imageUrl
    )
  ) {
    return null;
  }


  return imageUrl;
};


/* ============================================================
   SERIALIZE SLIDE
============================================================ */

const serializeSlide = (
  slide
) => {
  if (!slide) {
    return slide;
  }


  return {
    ...slide,

    imageUrl:
      normalizeImageUrl(
        slide.imageUrl
      ),
  };
};


/* ============================================================
   GET PUBLIC HERO SLIDES
============================================================ */

const getAllHeroSlides =
  async (
    req,
    res
  ) => {
    try {

      const slides =
        await prisma.heroSlide.findMany({
          where: {
            isActive:
              true,
          },

          orderBy: {
            sortOrder:
              "asc",
          },
        });


      const heroSlides =
        slides.map(
          serializeSlide
        );


      return res
        .status(200)
        .json({
          success: true,

          count:
            heroSlides.length,

          heroSlides,

          slides:
            heroSlides,

          data:
            heroSlides,
        });

    } catch (error) {

      console.error(
        "Get hero slides error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to fetch hero slides.",
        });
    }
  };


/* ============================================================
   GET ALL HERO SLIDES - ADMIN
============================================================ */

const getAllAdminHeroSlides =
  async (
    req,
    res
  ) => {
    try {

      const slides =
        await prisma.heroSlide.findMany({
          orderBy: {
            sortOrder:
              "asc",
          },
        });


      const heroSlides =
        slides.map(
          serializeSlide
        );


      return res
        .status(200)
        .json({
          success: true,

          count:
            heroSlides.length,

          heroSlides,

          slides:
            heroSlides,

          data:
            heroSlides,
        });

    } catch (error) {

      console.error(
        "Get admin hero slides error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to fetch hero slides.",
        });
    }
  };


/* ============================================================
   GET HERO SLIDE BY ID
============================================================ */

const getHeroSlideById =
  async (
    req,
    res
  ) => {
    try {

      const {
        id,
      } = req.params;


      const slide =
        await prisma.heroSlide.findUnique({
          where: {
            id,
          },
        });


      if (!slide) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Hero slide not found.",
          });
      }


      const heroSlide =
        serializeSlide(
          slide
        );


      return res
        .status(200)
        .json({
          success: true,

          heroSlide,

          slide:
            heroSlide,

          data:
            heroSlide,
        });

    } catch (error) {

      console.error(
        "Get hero slide error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to fetch hero slide.",
        });
    }
  };


/* ============================================================
   CREATE HERO SLIDE
============================================================ */

const createHeroSlide =
  async (
    req,
    res
  ) => {
    let uploadedImageUrl =
      null;


    try {

      const {
        title,
        subtitle,
        description,
        buttonText,
        buttonUrl,
        sortOrder,
        isActive,
      } = req.body;


      if (
        !title ||
        !String(
          title
        ).trim()
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Hero slide title is required.",
          });
      }


      if (
        !req.file
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Hero slide image is required.",
          });
      }


      /* ====================================================
         UPLOAD IMAGE
      ==================================================== */

      uploadedImageUrl =
        await uploadHeroImage(
          req.file
        );


      /* ====================================================
         CREATE DATABASE RECORD
      ==================================================== */

      const slide =
        await prisma.heroSlide.create({
          data: {
            title:
              String(
                title
              ).trim(),

            subtitle:
              subtitle
                ? String(
                    subtitle
                  ).trim()
                : null,

            description:
              description
                ? String(
                    description
                  ).trim()
                : null,

            buttonText:
              buttonText
                ? String(
                    buttonText
                  ).trim()
                : null,

            buttonUrl:
              buttonUrl
                ? String(
                    buttonUrl
                  ).trim()
                : null,

            imageUrl:
              uploadedImageUrl,

            sortOrder:
              parseSortOrder(
                sortOrder,
                0
              ),

            isActive:
              parseBoolean(
                isActive,
                true
              ),
          },
        });


      const heroSlide =
        serializeSlide(
          slide
        );


      return res
        .status(201)
        .json({
          success: true,

          message:
            "Hero slide created successfully.",

          heroSlide,

          slide:
            heroSlide,

          data:
            heroSlide,
        });

    } catch (error) {

      console.error(
        "Create hero slide error:",
        error
      );


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
            "Unable to create hero slide.",
        });
    }
  };


/* ============================================================
   UPDATE HERO SLIDE
============================================================ */

const updateHeroSlide =
  async (
    req,
    res
  ) => {
    let newImageUrl =
      null;


    try {

      const {
        id,
      } = req.params;


      const existing =
        await prisma.heroSlide.findUnique({
          where: {
            id,
          },
        });


      if (!existing) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Hero slide not found.",
          });
      }


      const {
        title,
        subtitle,
        description,
        buttonText,
        buttonUrl,
        sortOrder,
        isActive,
      } = req.body;


      const updateData =
        {};


      if (
        title !==
        undefined
      ) {
        updateData.title =
          String(
            title
          ).trim();
      }


      if (
        subtitle !==
        undefined
      ) {
        updateData.subtitle =
          subtitle
            ? String(
                subtitle
              ).trim()
            : null;
      }


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


      if (
        buttonText !==
        undefined
      ) {
        updateData.buttonText =
          buttonText
            ? String(
                buttonText
              ).trim()
            : null;
      }


      if (
        buttonUrl !==
        undefined
      ) {
        updateData.buttonUrl =
          buttonUrl
            ? String(
                buttonUrl
              ).trim()
            : null;
      }


      if (
        sortOrder !==
        undefined
      ) {
        updateData.sortOrder =
          parseSortOrder(
            sortOrder,
            existing.sortOrder ||
              0
          );
      }


      if (
        isActive !==
        undefined
      ) {
        updateData.isActive =
          parseBoolean(
            isActive,
            existing.isActive
          );
      }


      /* ====================================================
         NEW IMAGE
      ==================================================== */

      if (
        req.file
      ) {
        newImageUrl =
          await uploadHeroImage(
            req.file
          );


        updateData.imageUrl =
          newImageUrl;
      }


      const slide =
        await prisma.heroSlide.update({
          where: {
            id,
          },

          data:
            updateData,
        });


      /*
       * Delete old image only AFTER
       * database update succeeds.
       */
      if (
        newImageUrl &&
        existing.imageUrl &&
        existing.imageUrl !==
          newImageUrl
      ) {
        await deleteStoredImage(
          existing.imageUrl
        );
      }


      const heroSlide =
        serializeSlide(
          slide
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Hero slide updated successfully.",

          heroSlide,

          slide:
            heroSlide,

          data:
            heroSlide,
        });

    } catch (error) {

      console.error(
        "Update hero slide error:",
        error
      );


      if (
        newImageUrl
      ) {
        await deleteStoredImage(
          newImageUrl
        );
      }


      return res
        .status(500)
        .json({
          success: false,

          message:
            error?.message ||
            "Unable to update hero slide.",
        });
    }
  };


/* ============================================================
   UPDATE HERO SLIDE STATUS
============================================================ */

const changeHeroSlideStatus =
  async (
    req,
    res
  ) => {
    try {

      const {
        id,
      } = req.params;


      const existing =
        await prisma.heroSlide.findUnique({
          where: {
            id,
          },
        });


      if (!existing) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Hero slide not found.",
          });
      }


      const isActive =
        parseBoolean(
          req.body
            ?.isActive,
          !existing.isActive
        );


      const slide =
        await prisma.heroSlide.update({
          where: {
            id,
          },

          data: {
            isActive,
          },
        });


      const heroSlide =
        serializeSlide(
          slide
        );


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Hero slide status updated successfully.",

          heroSlide,

          slide:
            heroSlide,

          data:
            heroSlide,
        });

    } catch (error) {

      console.error(
        "Hero slide status error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to update hero slide status.",
        });
    }
  };


/* ============================================================
   DELETE HERO SLIDE
============================================================ */

const deleteHeroSlide =
  async (
    req,
    res
  ) => {
    try {

      const {
        id,
      } = req.params;


      const existing =
        await prisma.heroSlide.findUnique({
          where: {
            id,
          },
        });


      if (!existing) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Hero slide not found.",
          });
      }


      await prisma.heroSlide.delete({
        where: {
          id,
        },
      });


      if (
        existing.imageUrl
      ) {
        await deleteStoredImage(
          existing.imageUrl
        );
      }


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Hero slide deleted successfully.",
        });

    } catch (error) {

      console.error(
        "Delete hero slide error:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            error?.message ||
            "Unable to delete hero slide.",
        });
    }
  };

/* ============================================================
   REORDER HERO SLIDES
============================================================ */

const reorderHeroSlides = async (
  req,
  res
) => {
  try {
    /*
      Supports payloads like:

      {
        slides: [
          {
            id: "slide-id",
            sortOrder: 0
          }
        ]
      }

      Also supports:
      { items: [...] }
      { orders: [...] }

      or directly:
      [...]
    */

    const reorderItems =
      Array.isArray(req.body)
        ? req.body
        : req.body?.slides ||
          req.body?.items ||
          req.body?.orders ||
          req.body?.order;


    if (
      !Array.isArray(
        reorderItems
      ) ||
      reorderItems.length === 0
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Hero slide order is required.",
        });
    }


    const updates =
      reorderItems.map(
        (
          item,
          index
        ) => {
          const id =
            typeof item ===
            "string"
              ? item
              : item?.id ||
                item?.slideId;


          if (!id) {
            throw new Error(
              "Every hero slide must have an ID."
            );
          }


          let sortOrder =
            index;


          if (
            typeof item ===
            "object" &&
            item !== null
          ) {
            if (
              item.sortOrder !==
                undefined &&
              !Number.isNaN(
                Number(
                  item.sortOrder
                )
              )
            ) {
              sortOrder =
                Number(
                  item.sortOrder
                );
            } else if (
              item.order !==
                undefined &&
              !Number.isNaN(
                Number(
                  item.order
                )
              )
            ) {
              sortOrder =
                Number(
                  item.order
                );
            }
          }


          return prisma.heroSlide.update({
            where: {
              id,
            },

            data: {
              sortOrder,
            },
          });
        }
      );


    await prisma.$transaction(
      updates
    );


    const slides =
      await prisma.heroSlide.findMany({
        orderBy: {
          sortOrder:
            "asc",
        },
      });


    return res
      .status(200)
      .json({
        success: true,

        message:
          "Hero slides reordered successfully.",

        slides,

        heroSlides:
          slides,

        data:
          slides,
      });

  } catch (error) {

    console.error(
      "Reorder hero slides error:",
      error
    );


    return res
      .status(500)
      .json({
        success: false,

        message:
          error?.message ||
          "Unable to reorder hero slides.",
      });
  }
};

/* ============================================================
   EXPORT
============================================================ */

module.exports = {

  /* ========================================================
     GET PUBLIC HERO SLIDES
  ======================================================== */

  getAllHeroSlides,

  getHeroSlides:
    getAllHeroSlides,

  getPublicHeroSlides:
    getAllHeroSlides,

  getAll:
    getAllHeroSlides,


  /* ========================================================
     GET ADMIN HERO SLIDES
  ======================================================== */

  getAllAdminHeroSlides,

  getAdminHeroSlides:
    getAllAdminHeroSlides,

  getAllAdmin:
    getAllAdminHeroSlides,

  getAdmin:
    getAllAdminHeroSlides,


  /* ========================================================
     GET SINGLE HERO SLIDE
  ======================================================== */

  getHeroSlideById,

  getHeroSlide:
    getHeroSlideById,

  getById:
    getHeroSlideById,


  /* ========================================================
     CREATE
  ======================================================== */

  createHeroSlide,

  create:
    createHeroSlide,


  /* ========================================================
     UPDATE
  ======================================================== */

  updateHeroSlide,

  update:
    updateHeroSlide,


  /* ========================================================
     STATUS
  ======================================================== */

  changeHeroSlideStatus,

  updateHeroSlideStatus:
    changeHeroSlideStatus,

  updateStatus:
    changeHeroSlideStatus,

  changeStatus:
    changeHeroSlideStatus,


  /* ========================================================
     REORDER
  ======================================================== */

  reorderHeroSlides,

  reorder:
    reorderHeroSlides,


  /* ========================================================
     DELETE
  ======================================================== */

  deleteHeroSlide,

  remove:
    deleteHeroSlide,

};