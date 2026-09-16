// const prisma = require("../config/database");

// // GET ACTIVE HERO SLIDES
// const getHeroSlides = async (req, res) => {
//   try {
//     const slides = await prisma.heroSlide.findMany({
//       where: {
//         isActive: true,
//       },
//       orderBy: {
//         sortOrder: "asc",
//       },
//     });

//     res.json({
//       success: true,
//       count: slides.length,
//       slides,
//     });
//   } catch (error) {
//     console.error("Get hero slides error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch hero slides",
//     });
//   }
// };

// // GET ALL HERO SLIDES - ADMIN
// const getAllHeroSlides = async (req, res) => {
//   try {
//     const slides = await prisma.heroSlide.findMany({
//       orderBy: [
//         {
//           sortOrder: "asc",
//         },
//         {
//           createdAt: "desc",
//         },
//       ],
//     });

//     res.json({
//       success: true,
//       count: slides.length,
//       slides,
//     });
//   } catch (error) {
//     console.error("Get all hero slides error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch hero slides",
//     });
//   }
// };

// // GET SINGLE HERO SLIDE
// const getHeroSlide = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const slide = await prisma.heroSlide.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!slide) {
//       return res.status(404).json({
//         success: false,
//         message: "Hero slide not found",
//       });
//     }

//     res.json({
//       success: true,
//       slide,
//     });
//   } catch (error) {
//     console.error("Get hero slide error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch hero slide",
//     });
//   }
// };

// // CREATE HERO SLIDE
// const createHeroSlide = async (req, res) => {
//   try {
//     const {
//       title,
//       subtitle,
//       description,
//       imageUrl,
//       buttonText,
//       buttonUrl,
//       sortOrder,
//       isActive,
//     } = req.body;

//     if (!imageUrl) {
//       return res.status(400).json({
//         success: false,
//         message: "Hero image is required",
//       });
//     }

//     const slide = await prisma.heroSlide.create({
//       data: {
//         title: title || null,
//         subtitle: subtitle || null,
//         description: description || null,
//         imageUrl,
//         buttonText: buttonText || null,
//         buttonUrl: buttonUrl || null,
//         sortOrder:
//           sortOrder !== undefined
//             ? Number(sortOrder)
//             : 0,
//         isActive:
//           isActive !== undefined
//             ? Boolean(isActive)
//             : true,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "Hero slide created successfully",
//       slide,
//     });
//   } catch (error) {
//     console.error("Create hero slide error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to create hero slide",
//     });
//   }
// };

// // UPDATE HERO SLIDE
// const updateHeroSlide = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       title,
//       subtitle,
//       description,
//       imageUrl,
//       buttonText,
//       buttonUrl,
//       sortOrder,
//       isActive,
//     } = req.body;

//     const existingSlide =
//       await prisma.heroSlide.findUnique({
//         where: {
//           id,
//         },
//       });

//     if (!existingSlide) {
//       return res.status(404).json({
//         success: false,
//         message: "Hero slide not found",
//       });
//     }

//     const slide = await prisma.heroSlide.update({
//       where: {
//         id,
//       },

//       data: {
//         ...(title !== undefined && { title }),
//         ...(subtitle !== undefined && { subtitle }),
//         ...(description !== undefined && {
//           description,
//         }),
//         ...(imageUrl !== undefined && { imageUrl }),
//         ...(buttonText !== undefined && {
//           buttonText,
//         }),
//         ...(buttonUrl !== undefined && {
//           buttonUrl,
//         }),
//         ...(sortOrder !== undefined && {
//           sortOrder: Number(sortOrder),
//         }),
//         ...(isActive !== undefined && {
//           isActive: Boolean(isActive),
//         }),
//       },
//     });

//     res.json({
//       success: true,
//       message: "Hero slide updated successfully",
//       slide,
//     });
//   } catch (error) {
//     console.error("Update hero slide error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to update hero slide",
//     });
//   }
// };

// // CHANGE HERO SLIDE STATUS
// const changeHeroSlideStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { isActive } = req.body;

//     if (typeof isActive !== "boolean") {
//       return res.status(400).json({
//         success: false,
//         message: "isActive must be true or false",
//       });
//     }

//     const slide = await prisma.heroSlide.update({
//       where: {
//         id,
//       },

//       data: {
//         isActive,
//       },
//     });

//     res.json({
//       success: true,
//       message: `Hero slide ${
//         isActive ? "activated" : "deactivated"
//       } successfully`,
//       slide,
//     });
//   } catch (error) {
//     console.error(
//       "Change hero slide status error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: "Unable to change hero slide status",
//     });
//   }
// };

// // REORDER HERO SLIDES
// const reorderHeroSlides = async (req, res) => {
//   try {
//     const { slides } = req.body;

//     if (!Array.isArray(slides)) {
//       return res.status(400).json({
//         success: false,
//         message: "slides must be an array",
//       });
//     }

//     await prisma.$transaction(
//       slides.map((slide) =>
//         prisma.heroSlide.update({
//           where: {
//             id: slide.id,
//           },
//           data: {
//             sortOrder: Number(slide.sortOrder),
//           },
//         })
//       )
//     );

//     const updatedSlides =
//       await prisma.heroSlide.findMany({
//         orderBy: {
//           sortOrder: "asc",
//         },
//       });

//     res.json({
//       success: true,
//       message: "Hero slides reordered successfully",
//       slides: updatedSlides,
//     });
//   } catch (error) {
//     console.error(
//       "Reorder hero slides error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: "Unable to reorder hero slides",
//     });
//   }
// };

// // DELETE HERO SLIDE
// const deleteHeroSlide = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const slide = await prisma.heroSlide.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!slide) {
//       return res.status(404).json({
//         success: false,
//         message: "Hero slide not found",
//       });
//     }

//     await prisma.heroSlide.delete({
//       where: {
//         id,
//       },
//     });

//     res.json({
//       success: true,
//       message: "Hero slide deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete hero slide error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to delete hero slide",
//     });
//   }
// };

// module.exports = {
//   getHeroSlides,
//   getAllHeroSlides,
//   getHeroSlide,
//   createHeroSlide,
//   updateHeroSlide,
//   changeHeroSlideStatus,
//   reorderHeroSlides,
//   deleteHeroSlide,
// };




const prisma = require("../config/database");

/* =========================================================
   GET ACTIVE HERO SLIDES
   PUBLIC
   ========================================================= */

const getHeroSlides = async (req, res) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        sortOrder: "asc",
      },
    });

    res.json({
      success: true,
      count: slides.length,
      slides,
    });
  } catch (error) {
    console.error(
      "Get hero slides error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch hero slides",
    });
  }
};

/* =========================================================
   GET ALL HERO SLIDES
   ADMIN
   ========================================================= */

const getAllHeroSlides = async (req, res) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    res.json({
      success: true,
      count: slides.length,
      slides,
    });
  } catch (error) {
    console.error(
      "Get all hero slides error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch hero slides",
    });
  }
};

/* =========================================================
   GET SINGLE HERO SLIDE
   ========================================================= */

const getHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const slide =
      await prisma.heroSlide.findUnique({
        where: {
          id,
        },
      });

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    res.json({
      success: true,
      slide,
    });
  } catch (error) {
    console.error(
      "Get hero slide error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch hero slide",
    });
  }
};

/* =========================================================
   CREATE HERO SLIDE
   ========================================================= */

const createHeroSlide = async (req, res) => {
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

    /* ---------------------------------------------
       IMAGE
       --------------------------------------------- */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Hero image is required",
      });
    }

    const imageUrl = `/uploads/hero-slides/${req.file.filename}`;

    /* ---------------------------------------------
       VALIDATE TITLE
       --------------------------------------------- */

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Hero slide title is required",
      });
    }

    /* ---------------------------------------------
       PARSE VALUES
       --------------------------------------------- */

    const parsedSortOrder =
      sortOrder !== undefined &&
      sortOrder !== ""
        ? Number(sortOrder)
        : 0;

    let parsedIsActive = true;

    if (isActive !== undefined) {
      parsedIsActive =
        isActive === true ||
        isActive === "true";
    }

    /* ---------------------------------------------
       CREATE
       --------------------------------------------- */

    const slide =
      await prisma.heroSlide.create({
        data: {
          title: title.trim(),

          subtitle:
            subtitle?.trim() || null,

          description:
            description?.trim() || null,

          imageUrl,

          buttonText:
            buttonText?.trim() || null,

          buttonUrl:
            buttonUrl?.trim() || null,

          sortOrder:
            Number.isNaN(parsedSortOrder)
              ? 0
              : parsedSortOrder,

          isActive: parsedIsActive,
        },
      });

    res.status(201).json({
      success: true,
      message:
        "Hero slide created successfully",
      slide,
    });
  } catch (error) {
    console.error(
      "Create hero slide error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to create hero slide",
    });
  }
};

/* =========================================================
   UPDATE HERO SLIDE
   ========================================================= */

const updateHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      subtitle,
      description,
      buttonText,
      buttonUrl,
      sortOrder,
      isActive,
    } = req.body;

    /* ---------------------------------------------
       FIND EXISTING
       --------------------------------------------- */

    const existingSlide =
      await prisma.heroSlide.findUnique({
        where: {
          id,
        },
      });

    if (!existingSlide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    /* ---------------------------------------------
       BUILD UPDATE DATA
       --------------------------------------------- */

    const updateData = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Hero slide title is required",
        });
      }

      updateData.title = title.trim();
    }

    if (subtitle !== undefined) {
      updateData.subtitle =
        subtitle.trim() || null;
    }

    if (description !== undefined) {
      updateData.description =
        description.trim() || null;
    }

    if (buttonText !== undefined) {
      updateData.buttonText =
        buttonText.trim() || null;
    }

    if (buttonUrl !== undefined) {
      updateData.buttonUrl =
        buttonUrl.trim() || null;
    }

    if (sortOrder !== undefined) {
      const parsedSortOrder =
        Number(sortOrder);

      updateData.sortOrder =
        Number.isNaN(parsedSortOrder)
          ? 0
          : parsedSortOrder;
    }

    if (isActive !== undefined) {
      updateData.isActive =
        isActive === true ||
        isActive === "true";
    }

    /* ---------------------------------------------
       REPLACEMENT IMAGE
       --------------------------------------------- */

    if (req.file) {
      updateData.imageUrl =
        `/uploads/hero-slides/${req.file.filename}`;
    }

    /* ---------------------------------------------
       UPDATE
       --------------------------------------------- */

    const slide =
      await prisma.heroSlide.update({
        where: {
          id,
        },

        data: updateData,
      });

    res.json({
      success: true,
      message:
        "Hero slide updated successfully",
      slide,
    });
  } catch (error) {
    console.error(
      "Update hero slide error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to update hero slide",
    });
  }
};

/* =========================================================
   CHANGE HERO SLIDE STATUS
   ========================================================= */

const changeHeroSlideStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { isActive } = req.body;

    let parsedIsActive;

    if (typeof isActive === "boolean") {
      parsedIsActive = isActive;
    } else if (isActive === "true") {
      parsedIsActive = true;
    } else if (isActive === "false") {
      parsedIsActive = false;
    } else {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be true or false",
      });
    }

    const existingSlide =
      await prisma.heroSlide.findUnique({
        where: {
          id,
        },
      });

    if (!existingSlide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    const slide =
      await prisma.heroSlide.update({
        where: {
          id,
        },

        data: {
          isActive: parsedIsActive,
        },
      });

    res.json({
      success: true,
      message: `Hero slide ${
        parsedIsActive
          ? "activated"
          : "deactivated"
      } successfully`,
      slide,
    });
  } catch (error) {
    console.error(
      "Change hero slide status error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to change hero slide status",
    });
  }
};

/* =========================================================
   REORDER HERO SLIDES
   ========================================================= */

const reorderHeroSlides = async (
  req,
  res
) => {
  try {
    const { slides } = req.body;

    if (!Array.isArray(slides)) {
      return res.status(400).json({
        success: false,
        message: "slides must be an array",
      });
    }

    await prisma.$transaction(
      slides.map((slide) =>
        prisma.heroSlide.update({
          where: {
            id: slide.id,
          },

          data: {
            sortOrder: Number(
              slide.sortOrder
            ),
          },
        })
      )
    );

    const updatedSlides =
      await prisma.heroSlide.findMany({
        orderBy: {
          sortOrder: "asc",
        },
      });

    res.json({
      success: true,
      message:
        "Hero slides reordered successfully",
      slides: updatedSlides,
    });
  } catch (error) {
    console.error(
      "Reorder hero slides error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to reorder hero slides",
    });
  }
};

/* =========================================================
   DELETE HERO SLIDE
   ========================================================= */

const deleteHeroSlide = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const slide =
      await prisma.heroSlide.findUnique({
        where: {
          id,
        },
      });

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    await prisma.heroSlide.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message:
        "Hero slide deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete hero slide error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete hero slide",
    });
  }
};

/* =========================================================
   EXPORT
   ========================================================= */

module.exports = {
  getHeroSlides,
  getAllHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  changeHeroSlideStatus,
  reorderHeroSlides,
  deleteHeroSlide,
};
