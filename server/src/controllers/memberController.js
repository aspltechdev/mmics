const bcrypt = require("bcryptjs");
const fs = require("fs/promises");
const path = require("path");

const prisma = require(
  "../config/database"
);

/* ============================================================
   VERCEL BLOB

   Same storage used by Products and Gallery.
============================================================ */

const getBlobSdk = () =>
  import("@vercel/blob");

/* ============================================================
   SAFE FILE NAME
============================================================ */

const createSafeFilename = (
  originalName = "member.jpg"
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
    "member.jpg"
  );
};

/* ============================================================
   STORAGE MODE

   LOCALHOST:
   uploads/members/

   VERCEL:
   Vercel Blob
============================================================ */

const shouldUseBlob = () => {
  return Boolean(
    process.env.VERCEL ||
    process.env
      .BLOB_READ_WRITE_TOKEN ||
    process.env
      .VERCEL_OIDC_TOKEN
  );
};

/* ============================================================
   UPLOAD MEMBER IMAGE

   Same concept as Products/Gallery.
============================================================ */

const uploadMemberImage =
  async (file) => {
    if (!file) {
      return null;
    }

    if (!file.buffer) {
      throw new Error(
        "Member image upload requires memory storage."
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
        `members/${Date.now()}-${safeFilename}`;

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
       LOCALHOST STORAGE
    ======================================================== */

    const uploadDirectory =
      path.join(
        process.cwd(),
        "uploads",
        "members"
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
      `/uploads/members/${filename}`
    );
  };

/* ============================================================
   DELETE STORED MEMBER IMAGE
============================================================ */

const deleteStoredMemberImage =
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

        await fs
          .unlink(filePath)
          .catch(() => {
            /*
             * Image may already
             * be deleted.
             */
          });
      }
    } catch (error) {
      console.error(
        "Delete stored member image error:",
        error
      );
    }
  };

/* ============================================================
   PUBLIC - GET ACTIVE MEMBERS

   GET /api/members/public
============================================================ */

const getPublicMembers =
  async (
    req,
    res
  ) => {
    try {
      const members =
        await prisma.member.findMany({
          where: {
            status:
              "ACTIVE",
          },

          select: {
            id: true,

            membershipNumber:
              true,

            name: true,

            phone: true,

            email: true,

            address: true,

            profileImage:
              true,

            designation:
              true,

            designationOrder:
              true,

            status: true,
          },

          orderBy: [
            {
              designationOrder:
                "asc",
            },

            {
              name:
                "asc",
            },
          ],
        });

      return res
        .status(200)
        .json({
          success: true,

          count:
            members.length,

          members,
        });
    } catch (error) {
      console.error(
        "Get public members error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to fetch members",
        });
    }
  };

/* ============================================================
   ADMIN - GET ALL MEMBERS
============================================================ */

const getMembers =
  async (
    req,
    res
  ) => {
    try {
      const members =
        await prisma.member.findMany({
          include: {
            user: {
              select: {
                id: true,

                email:
                  true,

                role:
                  true,

                isActive:
                  true,
              },
            },
          },

          orderBy: [
            {
              designationOrder:
                "asc",
            },

            {
              createdAt:
                "desc",
            },
          ],
        });

      return res
        .status(200)
        .json({
          success: true,

          count:
            members.length,

          members,
        });
    } catch (error) {
      console.error(
        "Get members error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to fetch members",
        });
    }
  };

/* ============================================================
   ADMIN - GET SINGLE MEMBER
============================================================ */

const getMember =
  async (
    req,
    res
  ) => {
    try {
      const {
        id,
      } = req.params;

      const member =
        await prisma.member.findUnique({
          where: {
            id,
          },

          include: {
            user: {
              select: {
                id: true,

                email:
                  true,

                role:
                  true,

                isActive:
                  true,
              },
            },
          },
        });

      if (!member) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Member not found",
          });
      }

      return res
        .status(200)
        .json({
          success: true,

          member,
        });
    } catch (error) {
      console.error(
        "Get member error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to fetch member",
        });
    }
  };

/* ============================================================
   MEMBER - GET MY PROFILE

   GET /api/members/me
============================================================ */

const getMyProfile =
  async (
    req,
    res
  ) => {
    try {
      if (
        !req.user ||
        !req.user.id
      ) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "Authentication required",
          });
      }

      const member =
        await prisma.member.findUnique({
          where: {
            userId:
              req.user.id,
          },

          include: {
            user: {
              select: {
                id: true,

                email:
                  true,

                role:
                  true,

                isActive:
                  true,
              },
            },
          },
        });

      if (!member) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Member profile not found for this account",
          });
      }

      return res
        .status(200)
        .json({
          success: true,

          member,
        });
    } catch (error) {
      console.error(
        "Get my member profile error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to load member profile",
        });
    }
  };

/* ============================================================
   ADMIN - CREATE MEMBER
============================================================ */

const createMember =
  async (
    req,
    res
  ) => {
    let uploadedImageUrl =
      null;

    try {
      const {
        name,
        email,
        phone,
        address,
        membershipNumber,
        password,
        designation,
        designationOrder,
      } = req.body;

      /* ======================================================
         VALIDATION
      ====================================================== */

      if (
        !name ||
        !email ||
        !phone ||
        !membershipNumber ||
        !password
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Name, email, phone, membership number and password are required",
          });
      }

      /* ======================================================
         EMAIL CHECK
      ====================================================== */

      const existingUser =
        await prisma.user.findUnique({
          where: {
            email:
              email.trim(),
          },
        });

      if (
        existingUser
      ) {
        return res
          .status(409)
          .json({
            success: false,

            message:
              "Email already exists",
          });
      }

      /* ======================================================
         MEMBERSHIP CHECK
      ====================================================== */

      const existingMembership =
        await prisma.member.findUnique({
          where: {
            membershipNumber:
              membershipNumber.trim(),
          },
        });

      if (
        existingMembership
      ) {
        return res
          .status(409)
          .json({
            success: false,

            message:
              "Membership number already exists",
          });
      }

      /* ======================================================
         DISPLAY ORDER
      ====================================================== */

      const parsedDesignationOrder =
        designationOrder !==
          undefined &&
        designationOrder !==
          null &&
        designationOrder !==
          ""
          ? Number(
              designationOrder
            )
          : 0;

      if (
        !Number.isInteger(
          parsedDesignationOrder
        ) ||
        parsedDesignationOrder <
          0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Designation order must be a valid positive number",
          });
      }

      /* ======================================================
         HASH PASSWORD
      ====================================================== */

      const hashedPassword =
        await bcrypt.hash(
          password,
          12
        );

      /* ======================================================
         UPLOAD PROFILE IMAGE
      ====================================================== */

      if (
        req.file
      ) {
        uploadedImageUrl =
          await uploadMemberImage(
            req.file
          );
      }

      /* ======================================================
         CREATE USER + MEMBER
      ====================================================== */

      const result =
        await prisma.$transaction(
          async (
            tx
          ) => {
            const user =
              await tx.user.create({
                data: {
                  name:
                    name.trim(),

                  email:
                    email.trim(),

                  password:
                    hashedPassword,

                  role:
                    "MEMBER",

                  isActive:
                    true,
                },
              });

            const member =
              await tx.member.create({
                data: {
                  userId:
                    user.id,

                  membershipNumber:
                    membershipNumber.trim(),

                  name:
                    name.trim(),

                  phone:
                    phone.trim(),

                  email:
                    email.trim(),

                  address:
                    address?.trim() ||
                    null,

                  profileImage:
                    uploadedImageUrl,

                  designation:
                    designation?.trim() ||
                    null,

                  designationOrder:
                    parsedDesignationOrder,

                  status:
                    "ACTIVE",
                },
              });

            return {
              user,
              member,
            };
          }
        );

      return res
        .status(201)
        .json({
          success: true,

          message:
            "Member created successfully",

          member: {
            id:
              result.member.id,

            membershipNumber:
              result.member
                .membershipNumber,

            name:
              result.member.name,

            email:
              result.member.email,

            phone:
              result.member.phone,

            address:
              result.member.address,

            profileImage:
              result.member
                .profileImage,

            designation:
              result.member
                .designation,

            designationOrder:
              result.member
                .designationOrder,

            status:
              result.member.status,

            userId:
              result.user.id,
          },
        });
    } catch (error) {
      console.error(
        "Create member error:",
        error
      );

      /*
       * If Blob/local image was created
       * but DB creation failed,
       * remove the image.
       */

      if (
        uploadedImageUrl
      ) {
        await deleteStoredMemberImage(
          uploadedImageUrl
        );
      }

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message ||
            "Unable to create member",
        });
    }
  };

/* ============================================================
   ADMIN - UPDATE MEMBER
============================================================ */

const updateMember =
  async (
    req,
    res
  ) => {
    let newProfileImageUrl;

    try {
      const {
        id,
      } = req.params;

      const {
        name,
        email,
        phone,
        address,
        membershipNumber,
        designation,
        designationOrder,
        password,
      } = req.body;

      /* ======================================================
         FIND MEMBER
      ====================================================== */

      const member =
        await prisma.member.findUnique({
          where: {
            id,
          },
        });

      if (!member) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Member not found",
          });
      }

      /* ======================================================
         EMAIL DUPLICATE
      ====================================================== */

      if (
        email &&
        email.trim() !==
          member.email
      ) {
        const existingUser =
          await prisma.user.findUnique({
            where: {
              email:
                email.trim(),
            },
          });

        if (
          existingUser &&
          existingUser.id !==
            member.userId
        ) {
          return res
            .status(409)
            .json({
              success: false,

              message:
                "Email already exists",
            });
        }
      }

      /* ======================================================
         MEMBERSHIP NUMBER DUPLICATE
      ====================================================== */

      if (
        membershipNumber &&
        membershipNumber.trim() !==
          member.membershipNumber
      ) {
        const existingMembership =
          await prisma.member.findUnique({
            where: {
              membershipNumber:
                membershipNumber.trim(),
            },
          });

        if (
          existingMembership &&
          existingMembership.id !==
            member.id
        ) {
          return res
            .status(409)
            .json({
              success: false,

              message:
                "Membership number already exists",
            });
        }
      }

      /* ======================================================
         DISPLAY ORDER
      ====================================================== */

      let parsedDesignationOrder;

      if (
        designationOrder !==
          undefined &&
        designationOrder !==
          null &&
        designationOrder !==
          ""
      ) {
        parsedDesignationOrder =
          Number(
            designationOrder
          );

        if (
          !Number.isInteger(
            parsedDesignationOrder
          ) ||
          parsedDesignationOrder <
            0
        ) {
          return res
            .status(400)
            .json({
              success: false,

              message:
                "Designation order must be a valid positive number",
            });
        }
      }

      /* ======================================================
         UPLOAD NEW PROFILE IMAGE
      ====================================================== */

      if (
        req.file
      ) {
        newProfileImageUrl =
          await uploadMemberImage(
            req.file
          );
      }

      /* ======================================================
         MEMBER UPDATE DATA
      ====================================================== */

      const memberData = {
        ...(name !==
          undefined && {
          name:
            name.trim(),
        }),

        ...(email !==
          undefined && {
          email:
            email.trim(),
        }),

        ...(phone !==
          undefined && {
          phone:
            phone.trim(),
        }),

        ...(address !==
          undefined && {
          address:
            address?.trim() ||
            null,
        }),

        ...(membershipNumber !==
          undefined && {
          membershipNumber:
            membershipNumber.trim(),
        }),

        ...(designation !==
          undefined && {
          designation:
            designation?.trim() ||
            null,
        }),

        ...(parsedDesignationOrder !==
          undefined && {
          designationOrder:
            parsedDesignationOrder,
        }),

        ...(newProfileImageUrl !==
          undefined && {
          profileImage:
            newProfileImageUrl,
        }),
      };

      /* ======================================================
         UPDATE MEMBER + USER
      ====================================================== */

      const result =
        await prisma.$transaction(
          async (
            tx
          ) => {
            const updatedMember =
              await tx.member.update({
                where: {
                  id,
                },

                data:
                  memberData,
              });

            const userData = {
              ...(name !==
                undefined && {
                name:
                  name.trim(),
              }),

              ...(email !==
                undefined && {
                email:
                  email.trim(),
              }),
            };

            if (
              password &&
              password.trim()
            ) {
              userData.password =
                await bcrypt.hash(
                  password.trim(),
                  12
                );
            }

            const updatedUser =
              await tx.user.update({
                where: {
                  id:
                    member.userId,
                },

                data:
                  userData,
              });

            return {
              member:
                updatedMember,

              user:
                updatedUser,
            };
          }
        );

      /* ======================================================
         DELETE OLD IMAGE

         Only after database update succeeds.
      ====================================================== */

      if (
        newProfileImageUrl &&
        member.profileImage
      ) {
        await deleteStoredMemberImage(
          member.profileImage
        );
      }

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Member updated successfully",

          member:
            result.member,
        });
    } catch (error) {
      console.error(
        "Update member error:",
        error
      );

      /*
       * New image uploaded but
       * DB update failed:
       * delete the new image.
       */

      if (
        newProfileImageUrl
      ) {
        await deleteStoredMemberImage(
          newProfileImageUrl
        );
      }

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message ||
            "Unable to update member",
        });
    }
  };

/* ============================================================
   ADMIN - CHANGE STATUS
============================================================ */

const changeMemberStatus =
  async (
    req,
    res
  ) => {
    try {
      const {
        id,
      } = req.params;

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
              "Status must be ACTIVE or INACTIVE",
          });
      }

      const member =
        await prisma.member.findUnique({
          where: {
            id,
          },
        });

      if (!member) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Member not found",
          });
      }

      const result =
        await prisma.$transaction(
          async (
            tx
          ) => {
            const updatedMember =
              await tx.member.update({
                where: {
                  id,
                },

                data: {
                  status,
                },
              });

            const updatedUser =
              await tx.user.update({
                where: {
                  id:
                    member.userId,
                },

                data: {
                  isActive:
                    status ===
                    "ACTIVE",
                },
              });

            return {
              member:
                updatedMember,

              user:
                updatedUser,
            };
          }
        );

      return res
        .status(200)
        .json({
          success: true,

          message:
            `Member ${status.toLowerCase()} successfully`,

          member:
            result.member,
        });
    } catch (error) {
      console.error(
        "Change member status error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to change member status",
        });
    }
  };

/* ============================================================
   ADMIN - DELETE MEMBER
============================================================ */

const deleteMember =
  async (
    req,
    res
  ) => {
    try {
      const {
        id,
      } = req.params;

      const member =
        await prisma.member.findUnique({
          where: {
            id,
          },
        });

      if (!member) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Member not found",
          });
      }

      /* ======================================================
         DELETE MEMBER

         User deletion behavior remains
         based on your Prisma relation.
      ====================================================== */

      await prisma.member.delete({
        where: {
          id,
        },
      });

      /* ======================================================
         DELETE PROFILE IMAGE
      ====================================================== */

      if (
        member.profileImage
      ) {
        await deleteStoredMemberImage(
          member.profileImage
        );
      }

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Member deleted successfully",
        });
    } catch (error) {
      console.error(
        "Delete member error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to delete member",
        });
    }
  };

/* ============================================================
   EXPORTS
============================================================ */

module.exports = {
  getPublicMembers,
  getMembers,
  getMember,
  getMyProfile,
  createMember,
  updateMember,
  changeMemberStatus,
  deleteMember,
};