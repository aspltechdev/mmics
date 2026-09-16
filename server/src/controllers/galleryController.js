// const prisma = require("../config/database");

// // GET ACTIVE GALLERIES - PUBLIC
// const getGalleries = async (req, res) => {
//   try {
//     const galleries = await prisma.gallery.findMany({
//       where: {
//         isActive: true,
//       },
//       include: {
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
//       count: galleries.length,
//       galleries,
//     });
//   } catch (error) {
//     console.error("Get galleries error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch galleries",
//     });
//   }
// };

// // GET ALL GALLERIES - ADMIN
// const getAllGalleries = async (req, res) => {
//   try {
//     const galleries = await prisma.gallery.findMany({
//       include: {
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
//       count: galleries.length,
//       galleries,
//     });
//   } catch (error) {
//     console.error("Get all galleries error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch galleries",
//     });
//   }
// };

// // GET SINGLE GALLERY
// const getGallery = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const gallery = await prisma.gallery.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         images: {
//           orderBy: {
//             createdAt: "asc",
//           },
//         },
//       },
//     });

//     if (!gallery) {
//       return res.status(404).json({
//         success: false,
//         message: "Gallery not found",
//       });
//     }

//     res.json({
//       success: true,
//       gallery,
//     });
//   } catch (error) {
//     console.error("Get gallery error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch gallery",
//     });
//   }
// };

// // CREATE GALLERY
// const createGallery = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       isActive,
//       images,
//     } = req.body;

//     if (!title) {
//       return res.status(400).json({
//         success: false,
//         message: "Gallery title is required",
//       });
//     }

//     const gallery = await prisma.gallery.create({
//       data: {
//         title,
//         description: description || null,
//         isActive:
//           isActive !== undefined
//             ? Boolean(isActive)
//             : true,

//         images:
//           Array.isArray(images) && images.length > 0
//             ? {
//                 create: images.map((image) => ({
//                   imageUrl:
//                     image.imageUrl || image,
//                   caption:
//                     image.caption || null,
//                 })),
//               }
//             : undefined,
//       },

//       include: {
//         images: true,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "Gallery created successfully",
//       gallery,
//     });
//   } catch (error) {
//     console.error("Create gallery error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to create gallery",
//     });
//   }
// };

// // UPDATE GALLERY
// const updateGallery = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       title,
//       description,
//       isActive,
//     } = req.body;

//     const existingGallery =
//       await prisma.gallery.findUnique({
//         where: {
//           id,
//         },
//       });

//     if (!existingGallery) {
//       return res.status(404).json({
//         success: false,
//         message: "Gallery not found",
//       });
//     }

//     const gallery = await prisma.gallery.update({
//       where: {
//         id,
//       },

//       data: {
//         ...(title !== undefined && {
//           title,
//         }),

//         ...(description !== undefined && {
//           description,
//         }),

//         ...(isActive !== undefined && {
//           isActive: Boolean(isActive),
//         }),
//       },

//       include: {
//         images: true,
//       },
//     });

//     res.json({
//       success: true,
//       message: "Gallery updated successfully",
//       gallery,
//     });
//   } catch (error) {
//     console.error("Update gallery error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to update gallery",
//     });
//   }
// };

// // CHANGE GALLERY STATUS
// const changeGalleryStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isActive } = req.body;

//     if (typeof isActive !== "boolean") {
//       return res.status(400).json({
//         success: false,
//         message: "isActive must be true or false",
//       });
//     }

//     const gallery = await prisma.gallery.update({
//       where: {
//         id,
//       },

//       data: {
//         isActive,
//       },
//     });

//     res.json({
//       success: true,
//       message: `Gallery ${
//         isActive ? "activated" : "deactivated"
//       } successfully`,
//       gallery,
//     });
//   } catch (error) {
//     console.error(
//       "Change gallery status error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: "Unable to change gallery status",
//     });
//   }
// };

// // ADD IMAGE TO GALLERY
// const addGalleryImage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       imageUrl,
//       caption,
//     } = req.body;

//     if (!imageUrl) {
//       return res.status(400).json({
//         success: false,
//         message: "imageUrl is required",
//       });
//     }

//     const gallery = await prisma.gallery.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!gallery) {
//       return res.status(404).json({
//         success: false,
//         message: "Gallery not found",
//       });
//     }

//     const image = await prisma.galleryImage.create({
//       data: {
//         galleryId: id,
//         imageUrl,
//         caption: caption || null,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "Gallery image added successfully",
//       image,
//     });
//   } catch (error) {
//     console.error(
//       "Add gallery image error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: "Unable to add gallery image",
//     });
//   }
// };

// // UPDATE GALLERY IMAGE
// const updateGalleryImage = async (req, res) => {
//   try {
//     const { imageId } = req.params;
//     const {
//       imageUrl,
//       caption,
//     } = req.body;

//     const image =
//       await prisma.galleryImage.findUnique({
//         where: {
//           id: imageId,
//         },
//       });

//     if (!image) {
//       return res.status(404).json({
//         success: false,
//         message: "Gallery image not found",
//       });
//     }

//     const updatedImage =
//       await prisma.galleryImage.update({
//         where: {
//           id: imageId,
//         },

//         data: {
//           ...(imageUrl !== undefined && {
//             imageUrl,
//           }),

//           ...(caption !== undefined && {
//             caption,
//           }),
//         },
//       });

//     res.json({
//       success: true,
//       message: "Gallery image updated successfully",
//       image: updatedImage,
//     });
//   } catch (error) {
//     console.error(
//       "Update gallery image error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: "Unable to update gallery image",
//     });
//   }
// };

// // DELETE GALLERY IMAGE
// const deleteGalleryImage = async (req, res) => {
//   try {
//     const { imageId } = req.params;

//     const image =
//       await prisma.galleryImage.findUnique({
//         where: {
//           id: imageId,
//         },
//       });

//     if (!image) {
//       return res.status(404).json({
//         success: false,
//         message: "Gallery image not found",
//       });
//     }

//     await prisma.galleryImage.delete({
//       where: {
//         id: imageId,
//       },
//     });

//     res.json({
//       success: true,
//       message: "Gallery image deleted successfully",
//     });
//   } catch (error) {
//     console.error(
//       "Delete gallery image error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: "Unable to delete gallery image",
//     });
//   }
// };

// // DELETE GALLERY
// const deleteGallery = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const gallery = await prisma.gallery.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!gallery) {
//       return res.status(404).json({
//         success: false,
//         message: "Gallery not found",
//       });
//     }

//     await prisma.gallery.delete({
//       where: {
//         id,
//       },
//     });

//     res.json({
//       success: true,
//       message: "Gallery deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete gallery error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to delete gallery",
//     });
//   }
// };

// module.exports = {
//   getGalleries,
//   getAllGalleries,
//   getGallery,
//   createGallery,
//   updateGallery,
//   changeGalleryStatus,
//   addGalleryImage,
//   updateGalleryImage,
//   deleteGalleryImage,
//   deleteGallery,
// };


const prisma = require("../config/database");

// ============================================================
// GET ACTIVE GALLERIES - PUBLIC
// GET /api/galleries
// ============================================================
const getGalleries = async (req, res) => {
  try {
    const galleries = await prisma.gallery.findMany({
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
    console.error("Get galleries error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch galleries",
    });
  }
};

// ============================================================
// GET ALL GALLERIES - ADMIN
// GET /api/galleries/admin/all
// ============================================================
const getAllGalleries = async (req, res) => {
  try {
    const galleries = await prisma.gallery.findMany({
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
    console.error("Get all galleries error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch galleries",
    });
  }
};

// ============================================================
// GET SINGLE GALLERY
// GET /api/galleries/:id
// ============================================================
const getGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await prisma.gallery.findUnique({
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
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    return res.json({
      success: true,
      gallery,
    });
  } catch (error) {
    console.error("Get gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch gallery",
    });
  }
};

// ============================================================
// CREATE GALLERY
// POST /api/galleries
// ============================================================
const createGallery = async (req, res) => {
  try {
    const {
      title,
      description,
      isActive,
      images,
    } = req.body;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------
    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Gallery title is required",
      });
    }

    // --------------------------------------------------------
    // NORMALIZE ACTIVE STATUS
    // --------------------------------------------------------
    let activeStatus = true;

    if (typeof isActive === "boolean") {
      activeStatus = isActive;
    } else if (typeof isActive === "string") {
      activeStatus = isActive === "true";
    }

    // --------------------------------------------------------
    // CREATE GALLERY
    // --------------------------------------------------------
    const gallery = await prisma.gallery.create({
      data: {
        title: title.trim(),

        description:
          typeof description === "string" &&
          description.trim()
            ? description.trim()
            : null,

        isActive: activeStatus,

        // This supports optional existing image URLs.
        // New uploaded images should use addGalleryImage().
        images:
          Array.isArray(images) &&
          images.length > 0
            ? {
                create: images
                  .map((image) => {
                    if (
                      typeof image === "string"
                    ) {
                      return {
                        imageUrl: image,
                        caption: null,
                      };
                    }

                    if (
                      image &&
                      typeof image === "object" &&
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
                  })
                  .filter(Boolean),
              }
            : undefined,
      },

      include: {
        images: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Gallery created successfully",
      gallery,
    });
  } catch (error) {
    console.error("Create gallery error:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to create gallery",
    });
  }
};

// ============================================================
// UPDATE GALLERY
// PUT /api/galleries/:id
// ============================================================
const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      isActive,
    } = req.body;

    // --------------------------------------------------------
    // CHECK GALLERY
    // --------------------------------------------------------
    const existingGallery =
      await prisma.gallery.findUnique({
        where: {
          id,
        },
      });

    if (!existingGallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    // --------------------------------------------------------
    // BUILD UPDATE DATA
    // --------------------------------------------------------
    const updateData = {};

    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        !title.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Gallery title is required",
        });
      }

      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description =
        typeof description === "string" &&
        description.trim()
          ? description.trim()
          : null;
    }

    if (isActive !== undefined) {
      if (typeof isActive === "boolean") {
        updateData.isActive = isActive;
      } else if (
        typeof isActive === "string"
      ) {
        updateData.isActive =
          isActive === "true";
      }
    }

    // --------------------------------------------------------
    // UPDATE GALLERY
    // --------------------------------------------------------
    const gallery =
      await prisma.gallery.update({
        where: {
          id,
        },

        data: updateData,

        include: {
          images: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    return res.json({
      success: true,
      message: "Gallery updated successfully",
      gallery,
    });
  } catch (error) {
    console.error("Update gallery error:", error);

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to update gallery",
    });
  }
};

// ============================================================
// CHANGE GALLERY STATUS
// PATCH /api/galleries/:id/status
// ============================================================
const changeGalleryStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // --------------------------------------------------------
    // VALIDATE STATUS
    // --------------------------------------------------------
    let activeStatus;

    if (typeof isActive === "boolean") {
      activeStatus = isActive;
    } else if (
      typeof isActive === "string"
    ) {
      if (
        isActive !== "true" &&
        isActive !== "false"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "isActive must be true or false",
        });
      }

      activeStatus = isActive === "true";
    } else {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be true or false",
      });
    }

    // --------------------------------------------------------
    // CHECK GALLERY
    // --------------------------------------------------------
    const existingGallery =
      await prisma.gallery.findUnique({
        where: {
          id,
        },
      });

    if (!existingGallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    // --------------------------------------------------------
    // UPDATE STATUS
    // --------------------------------------------------------
    const gallery =
      await prisma.gallery.update({
        where: {
          id,
        },

        data: {
          isActive: activeStatus,
        },

        include: {
          images: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    return res.json({
      success: true,
      message: `Gallery ${
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

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to change gallery status",
    });
  }
};

// ============================================================
// ADD IMAGE TO GALLERY
// POST /api/galleries/:id/images
// multipart/form-data
// field: image
// field: caption
// ============================================================
const addGalleryImage = async (
  req,
  res
) => {
  try {
    console.log(
      "===================================="
    );
    console.log(
      "ADD GALLERY IMAGE"
    );
    console.log(
      "Gallery ID:",
      req.params.id
    );
    console.log(
      "Body:",
      req.body
    );
    console.log(
      "File:",
      req.file
    );
    console.log(
      "===================================="
    );

    const { id } = req.params;
    const { caption } = req.body;

    // --------------------------------------------------------
    // CHECK UPLOADED FILE
    // --------------------------------------------------------
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Gallery image is required",
      });
    }

    // --------------------------------------------------------
    // CHECK GALLERY
    // --------------------------------------------------------
    const gallery =
      await prisma.gallery.findUnique({
        where: {
          id,
        },
      });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    // --------------------------------------------------------
    // BUILD IMAGE URL
    // --------------------------------------------------------
    const imageUrl =
      `/uploads/gallery/${req.file.filename}`;

    console.log(
      "Generated image URL:",
      imageUrl
    );

    // --------------------------------------------------------
    // CREATE GALLERY IMAGE
    // --------------------------------------------------------
    const image =
      await prisma.galleryImage.create({
        data: {
          galleryId: id,

          imageUrl,

          caption:
            typeof caption === "string" &&
            caption.trim()
              ? caption.trim()
              : null,
        },
      });

    console.log(
      "Gallery image created successfully:",
      image.id
    );

    // --------------------------------------------------------
    // SUCCESS
    // --------------------------------------------------------
    return res.status(201).json({
      success: true,
      message:
        "Gallery image added successfully",
      image,
    });
  } catch (error) {
    console.error(
      "===================================="
    );
    console.error(
      "ADD GALLERY IMAGE ERROR"
    );
    console.error(
      "===================================="
    );
    console.error(
      "Error name:",
      error?.name
    );
    console.error(
      "Error message:",
      error?.message
    );
    console.error(
      "Error code:",
      error?.code
    );
    console.error(
      "Error meta:",
      error?.meta
    );
    console.error(
      "Error stack:",
      error?.stack
    );
    console.error(
      "===================================="
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to add gallery image",
    });
  }
};

// ============================================================
// UPDATE GALLERY IMAGE
// PUT /api/galleries/images/:imageId
// ============================================================
const updateGalleryImage = async (
  req,
  res
) => {
  try {
    const { imageId } = req.params;

    const {
      imageUrl,
      caption,
    } = req.body;

    // --------------------------------------------------------
    // FIND IMAGE
    // --------------------------------------------------------
    const image =
      await prisma.galleryImage.findUnique({
        where: {
          id: imageId,
        },
      });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    // --------------------------------------------------------
    // BUILD UPDATE DATA
    // --------------------------------------------------------
    const updateData = {};

    if (imageUrl !== undefined) {
      if (
        typeof imageUrl !== "string" ||
        !imageUrl.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "imageUrl cannot be empty",
        });
      }

      updateData.imageUrl =
        imageUrl.trim();
    }

    if (caption !== undefined) {
      updateData.caption =
        typeof caption === "string" &&
        caption.trim()
          ? caption.trim()
          : null;
    }

    // --------------------------------------------------------
    // UPDATE IMAGE
    // --------------------------------------------------------
    const updatedImage =
      await prisma.galleryImage.update({
        where: {
          id: imageId,
        },

        data: updateData,
      });

    return res.json({
      success: true,
      message:
        "Gallery image updated successfully",
      image: updatedImage,
    });
  } catch (error) {
    console.error(
      "Update gallery image error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to update gallery image",
    });
  }
};

// ============================================================
// DELETE GALLERY IMAGE
// DELETE /api/galleries/images/:imageId
// ============================================================
const deleteGalleryImage = async (
  req,
  res
) => {
  try {
    const { imageId } = req.params;

    // --------------------------------------------------------
    // FIND IMAGE
    // --------------------------------------------------------
    const image =
      await prisma.galleryImage.findUnique({
        where: {
          id: imageId,
        },
      });

    if (!image) {
      return res.status(404).json({
        success: false,
        message:
          "Gallery image not found",
      });
    }

    // --------------------------------------------------------
    // DELETE IMAGE
    // --------------------------------------------------------
    await prisma.galleryImage.delete({
      where: {
        id: imageId,
      },
    });

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

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to delete gallery image",
    });
  }
};

// ============================================================
// DELETE GALLERY
// DELETE /api/galleries/:id
// ============================================================
const deleteGallery = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------------
    // CHECK GALLERY
    // --------------------------------------------------------
    const gallery =
      await prisma.gallery.findUnique({
        where: {
          id,
        },
      });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    // --------------------------------------------------------
    // DELETE GALLERY
    //
    // Delete child images first so this works
    // even if the Prisma relation does not have
    // onDelete: Cascade.
    // --------------------------------------------------------
    await prisma.$transaction([
      prisma.galleryImage.deleteMany({
        where: {
          galleryId: id,
        },
      }),

      prisma.gallery.delete({
        where: {
          id,
        },
      }),
    ]);

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

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to delete gallery",
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================
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

