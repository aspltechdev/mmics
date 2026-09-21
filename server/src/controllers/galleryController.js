const fs = require("fs/promises");
const path = require("path");

const prisma = require(
  "../config/database"
);


/* ============================================================
   VERCEL BLOB
============================================================ */

const getBlobSdk = () =>
  import("@vercel/blob");


/* ============================================================
   SAFE FILE NAME
============================================================ */

const createSafeFilename = (
  originalName = "gallery-image.jpg"
) => {
  const cleaned = String(
    originalName
  )
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
    "gallery-image.jpg"
  );
};


/* ============================================================
   SHOULD USE VERCEL BLOB
============================================================ */

const shouldUseBlob = () => {
  return Boolean(
    process.env.VERCEL ||
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_OIDC_TOKEN
  );
};


/* ============================================================
   UPLOAD GALLERY IMAGE

   LOCAL:
   uploads/gallery/

   VERCEL:
   Vercel Blob
============================================================ */

const uploadGalleryImage = async (
  file
) => {
  if (!file) {
    throw new Error(
      "Gallery image is required."
    );
  }

  if (!file.buffer) {
    throw new Error(
      "Gallery upload requires memory storage."
    );
  }

  const safeFilename =
    createSafeFilename(
      file.originalname
    );


  /* ========================================================
     VERCEL
  ======================================================== */

  if (shouldUseBlob()) {
    const {
      put,
    } = await getBlobSdk();

    const pathname =
      `gallery/` +
      `${Date.now()}-` +
      `${safeFilename}`;

    const blob = await put(
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
     LOCALHOST
  ======================================================== */

  const uploadDirectory =
    path.join(
      process.cwd(),
      "uploads",
      "gallery"
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
    `/uploads/gallery/${filename}`
  );
};


/* ============================================================
   DELETE STORED IMAGE
============================================================ */

const deleteStoredGalleryImage =
  async (
    imageUrl
  ) => {
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
         LOCAL FILE
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

        await fs.unlink(
          filePath
        ).catch(() => {});
      }

    } catch (error) {
      console.error(
        "Delete gallery image file error:",
        error
      );
    }
  };


/* ============================================================
   GET ACTIVE GALLERIES
============================================================ */

const getGalleries = async (
  req,
  res
) => {
  try {
    const galleries =
      await prisma.gallery.findMany({
        where: {
          isActive: true,
        },

        include: {
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

    return res.json({
      success: true,
      count: galleries.length,
      galleries,
    });

  } catch (error) {
    console.error(
      "Get galleries error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Unable to fetch galleries",
      });
  }
};


/* ============================================================
   GET ALL GALLERIES - ADMIN
============================================================ */

const getAllGalleries = async (
  req,
  res
) => {
  try {
    const galleries =
      await prisma.gallery.findMany({
        include: {
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

    return res.json({
      success: true,
      count: galleries.length,
      galleries,
    });

  } catch (error) {
    console.error(
      "Get all galleries error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Unable to fetch galleries",
      });
  }
};


/* ============================================================
   GET SINGLE GALLERY
============================================================ */

const getGallery = async (
  req,
  res
) => {
  try {
    const {
      id,
    } = req.params;

    const gallery =
      await prisma.gallery.findUnique({
        where: {
          id,
        },

        include: {
          images: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    if (!gallery) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Gallery not found",
        });
    }

    return res.json({
      success: true,
      gallery,
    });

  } catch (error) {
    console.error(
      "Get gallery error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Unable to fetch gallery",
      });
  }
};


/* ============================================================
   CREATE GALLERY
============================================================ */

const createGallery = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      isActive,
      images,
    } = req.body;


    /* ========================================================
       VALIDATION
    ======================================================== */

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Gallery title is required",
        });
    }


    /* ========================================================
       ACTIVE STATUS
    ======================================================== */

    let activeStatus = true;

    if (
      typeof isActive ===
      "boolean"
    ) {
      activeStatus =
        isActive;
    } else if (
      typeof isActive ===
      "string"
    ) {
      activeStatus =
        isActive === "true";
    }


    /* ========================================================
       CREATE
    ======================================================== */

    const gallery =
      await prisma.gallery.create({
        data: {
          title:
            title.trim(),

          description:
            typeof description ===
              "string" &&
            description.trim()
              ? description.trim()
              : null,

          isActive:
            activeStatus,

          images:
            Array.isArray(images) &&
            images.length > 0
              ? {
                  create:
                    images
                      .map(
                        (
                          image
                        ) => {

                          if (
                            typeof image ===
                            "string"
                          ) {
                            return {
                              imageUrl:
                                image,

                              caption:
                                null,
                            };
                          }

                          if (
                            image &&
                            typeof image ===
                              "object" &&
                            image.imageUrl
                          ) {
                            return {
                              imageUrl:
                                image.imageUrl,

                              caption:
                                image.caption ||
                                null,
                            };
                          }

                          return null;
                        }
                      )
                      .filter(
                        Boolean
                      ),
                }
              : undefined,
        },

        include: {
          images: {
            orderBy: {
              createdAt:
                "asc",
            },
          },
        },
      });

    return res
      .status(201)
      .json({
        success: true,

        message:
          "Gallery created successfully",

        gallery,
      });

  } catch (error) {
    console.error(
      "Create gallery error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error?.message ||
          "Unable to create gallery",
      });
  }
};


/* ============================================================
   UPDATE GALLERY
============================================================ */

const updateGallery = async (
  req,
  res
) => {
  try {
    const {
      id,
    } = req.params;

    const {
      title,
      description,
      isActive,
    } = req.body;


    const existingGallery =
      await prisma.gallery.findUnique({
        where: {
          id,
        },
      });

    if (!existingGallery) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Gallery not found",
        });
    }


    const updateData = {};


    if (
      title !== undefined
    ) {
      if (
        typeof title !==
          "string" ||
        !title.trim()
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Gallery title is required",
          });
      }

      updateData.title =
        title.trim();
    }


    if (
      description !==
      undefined
    ) {
      updateData.description =
        typeof description ===
          "string" &&
        description.trim()
          ? description.trim()
          : null;
    }


    if (
      isActive !== undefined
    ) {
      if (
        typeof isActive ===
        "boolean"
      ) {
        updateData.isActive =
          isActive;

      } else if (
        typeof isActive ===
        "string"
      ) {
        updateData.isActive =
          isActive === "true";
      }
    }


    const gallery =
      await prisma.gallery.update({
        where: {
          id,
        },

        data:
          updateData,

        include: {
          images: {
            orderBy: {
              createdAt:
                "asc",
            },
          },
        },
      });

    return res.json({
      success: true,

      message:
        "Gallery updated successfully",

      gallery,
    });

  } catch (error) {
    console.error(
      "Update gallery error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error?.message ||
          "Unable to update gallery",
      });
  }
};


/* ============================================================
   CHANGE GALLERY STATUS
============================================================ */

const changeGalleryStatus = async (
  req,
  res
) => {
  try {
    const {
      id,
    } = req.params;

    const {
      isActive,
    } = req.body;


    let activeStatus;


    if (
      typeof isActive ===
      "boolean"
    ) {
      activeStatus =
        isActive;

    } else if (
      typeof isActive ===
      "string"
    ) {

      if (
        isActive !== "true" &&
        isActive !== "false"
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "isActive must be true or false",
          });
      }

      activeStatus =
        isActive === "true";

    } else {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "isActive must be true or false",
        });
    }


    const existingGallery =
      await prisma.gallery.findUnique({
        where: {
          id,
        },
      });

    if (!existingGallery) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Gallery not found",
        });
    }


    const gallery =
      await prisma.gallery.update({
        where: {
          id,
        },

        data: {
          isActive:
            activeStatus,
        },

        include: {
          images: {
            orderBy: {
              createdAt:
                "asc",
            },
          },
        },
      });


    return res.json({
      success: true,

      message:
        `Gallery ${
          activeStatus
            ? "activated"
            : "deactivated"
        } successfully`,

      gallery,
    });

  } catch (error) {
    console.error(
      "Change gallery status error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error?.message ||
          "Unable to change gallery status",
      });
  }
};


/* ============================================================
   ADD IMAGE TO GALLERY
============================================================ */

const addGalleryImage = async (
  req,
  res
) => {
  let uploadedImageUrl =
    null;

  try {
    const {
      id,
    } = req.params;

    const {
      caption,
    } = req.body;


    /* ========================================================
       CHECK FILE
    ======================================================== */

    if (!req.file) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Gallery image is required",
        });
    }


    /* ========================================================
       CHECK GALLERY
    ======================================================== */

    const gallery =
      await prisma.gallery.findUnique({
        where: {
          id,
        },
      });

    if (!gallery) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Gallery not found",
        });
    }


    /* ========================================================
       UPLOAD IMAGE
    ======================================================== */

    uploadedImageUrl =
      await uploadGalleryImage(
        req.file
      );


    /* ========================================================
       CREATE DATABASE RECORD
    ======================================================== */

    const image =
      await prisma.galleryImage.create({
        data: {
          galleryId:
            id,

          imageUrl:
            uploadedImageUrl,

          caption:
            typeof caption ===
              "string" &&
            caption.trim()
              ? caption.trim()
              : null,
        },
      });


    return res
      .status(201)
      .json({
        success: true,

        message:
          "Gallery image added successfully",

        image,
      });

  } catch (error) {
    console.error(
      "Add gallery image error:",
      error
    );


    /*
     * Database creation failed after the
     * file was already uploaded.
     */
    if (
      uploadedImageUrl
    ) {
      await deleteStoredGalleryImage(
        uploadedImageUrl
      );
    }


    return res
      .status(500)
      .json({
        success: false,

        message:
          error?.message ||
          "Unable to add gallery image",
      });
  }
};


/* ============================================================
   UPDATE GALLERY IMAGE
============================================================ */

const updateGalleryImage = async (
  req,
  res
) => {
  try {
    const {
      imageId,
    } = req.params;

    const {
      imageUrl,
      caption,
    } = req.body;


    const existingImage =
      await prisma.galleryImage.findUnique({
        where: {
          id:
            imageId,
        },
      });


    if (!existingImage) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Gallery image not found",
        });
    }


    const updateData = {};


    if (
      imageUrl !== undefined
    ) {
      if (
        typeof imageUrl !==
          "string" ||
        !imageUrl.trim()
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "imageUrl cannot be empty",
          });
      }

      updateData.imageUrl =
        imageUrl.trim();
    }


    if (
      caption !== undefined
    ) {
      updateData.caption =
        typeof caption ===
          "string" &&
        caption.trim()
          ? caption.trim()
          : null;
    }


    const updatedImage =
      await prisma.galleryImage.update({
        where: {
          id:
            imageId,
        },

        data:
          updateData,
      });


    /*
     * If the URL itself was replaced,
     * remove the previous stored image.
     */
    if (
      updateData.imageUrl &&
      existingImage.imageUrl &&
      updateData.imageUrl !==
        existingImage.imageUrl
    ) {
      await deleteStoredGalleryImage(
        existingImage.imageUrl
      );
    }


    return res.json({
      success: true,

      message:
        "Gallery image updated successfully",

      image:
        updatedImage,
    });

  } catch (error) {
    console.error(
      "Update gallery image error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error?.message ||
          "Unable to update gallery image",
      });
  }
};


/* ============================================================
   DELETE GALLERY IMAGE
============================================================ */

const deleteGalleryImage = async (
  req,
  res
) => {
  try {
    const {
      imageId,
    } = req.params;


    const image =
      await prisma.galleryImage.findUnique({
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
            "Gallery image not found",
        });
    }


    await prisma.galleryImage.delete({
      where: {
        id:
          imageId,
      },
    });


    /*
     * Delete physical file / Blob
     * only after database deletion succeeds.
     */
    if (
      image.imageUrl
    ) {
      await deleteStoredGalleryImage(
        image.imageUrl
      );
    }


    return res.json({
      success: true,

      message:
        "Gallery image deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete gallery image error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error?.message ||
          "Unable to delete gallery image",
      });
  }
};


/* ============================================================
   DELETE GALLERY
============================================================ */

const deleteGallery = async (
  req,
  res
) => {
  try {
    const {
      id,
    } = req.params;


    const gallery =
      await prisma.gallery.findUnique({
        where: {
          id,
        },

        include: {
          images: true,
        },
      });


    if (!gallery) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Gallery not found",
        });
    }


    const imageUrls =
      gallery.images
        ?.map(
          (
            image
          ) =>
            image.imageUrl
        )
        .filter(
          Boolean
        ) || [];


    /*
     * Remove DB data first.
     */
    await prisma.$transaction([
      prisma.galleryImage.deleteMany({
        where: {
          galleryId:
            id,
        },
      }),

      prisma.gallery.delete({
        where: {
          id,
        },
      }),
    ]);


    /*
     * Then remove stored images.
     * Storage cleanup failure will not
     * restore deleted DB records.
     */
    await Promise.all(
      imageUrls.map(
        (
          imageUrl
        ) =>
          deleteStoredGalleryImage(
            imageUrl
          )
      )
    );


    return res.json({
      success: true,

      message:
        "Gallery deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete gallery error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error?.message ||
          "Unable to delete gallery",
      });
  }
};


/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  getGalleries,

  getAllGalleries,

  getGallery,

  createGallery,

  updateGallery,

  changeGalleryStatus,

  addGalleryImage,

  updateGalleryImage,

  deleteGalleryImage,

  deleteGallery,
};