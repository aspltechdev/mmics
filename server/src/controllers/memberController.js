const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const prisma = require("../config/database");

// =========================================================
// PROFILE IMAGE PATH
// =========================================================

const getProfileImagePath = (file) => {
  if (!file) return null;

  return `/uploads/members/${file.filename}`;
};

// =========================================================
// DELETE PROFILE IMAGE
// =========================================================

const deleteProfileImage = (imagePath) => {
  if (!imagePath) return;

  try {
    const cleanPath = imagePath.replace(/^\/+/, "");

    const filePath = path.join(
      __dirname,
      "../../",
      cleanPath
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(
      "Unable to delete profile image:",
      error
    );
  }
};

// =========================================================
// PUBLIC - GET ACTIVE MEMBERS
//
// GET /api/members/public
//
// NO LOGIN REQUIRED
// =========================================================

const getPublicMembers = async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      where: {
        status: "ACTIVE",
      },

      select: {
        id: true,
        membershipNumber: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        profileImage: true,
        designation: true,
        designationOrder: true,
        status: true,
      },

      orderBy: [
        {
          designationOrder: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error(
      "Get public members error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch members",
    });
  }
};

// =========================================================
// ADMIN - GET ALL MEMBERS
// =========================================================

const getMembers = async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },

      orderBy: [
        {
          designationOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error(
      "Get members error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch members",
    });
  }
};

// =========================================================
// ADMIN - GET SINGLE MEMBER
// =========================================================

const getMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member =
      await prisma.member.findUnique({
        where: {
          id,
        },

        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isActive: true,
            },
          },
        },
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    console.error(
      "Get member error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch member",
    });
  }
};

// =========================================================
// MEMBER - GET OWN PROFILE
//
// GET /api/members/me
// =========================================================

const getMyProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const member =
      await prisma.member.findUnique({
        where: {
          userId: req.user.id,
        },

        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isActive: true,
            },
          },
        },
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message:
          "Member profile not found for this account",
      });
    }

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    console.error(
      "Get my member profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load member profile",
    });
  }
};

// =========================================================
// ADMIN - CREATE MEMBER
// =========================================================

const createMember = async (req, res) => {
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

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (
      !name ||
      !email ||
      !phone ||
      !membershipNumber ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone, membership number and password are required",
      });
    }

    // -----------------------------------------------------
    // CHECK EMAIL
    // -----------------------------------------------------

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: email.trim(),
        },
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // -----------------------------------------------------
    // CHECK MEMBERSHIP NUMBER
    // -----------------------------------------------------

    const existingMembership =
      await prisma.member.findUnique({
        where: {
          membershipNumber:
            membershipNumber.trim(),
        },
      });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message:
          "Membership number already exists",
      });
    }

    // -----------------------------------------------------
    // DESIGNATION ORDER
    // -----------------------------------------------------

    const parsedDesignationOrder =
      designationOrder !== undefined &&
      designationOrder !== null &&
      designationOrder !== ""
        ? Number(designationOrder)
        : 0;

    if (
      !Number.isInteger(
        parsedDesignationOrder
      ) ||
      parsedDesignationOrder < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Designation order must be a valid positive number",
      });
    }

    // -----------------------------------------------------
    // PASSWORD
    // -----------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 12);

    // -----------------------------------------------------
    // IMAGE
    // -----------------------------------------------------

    const profileImage =
      getProfileImagePath(req.file);

    // -----------------------------------------------------
    // CREATE USER + MEMBER
    // -----------------------------------------------------

    const result =
      await prisma.$transaction(
        async (tx) => {
          const user =
            await tx.user.create({
              data: {
                name: name.trim(),

                email: email.trim(),

                password:
                  hashedPassword,

                role: "MEMBER",

                isActive: true,
              },
            });

          const member =
            await tx.member.create({
              data: {
                userId: user.id,

                membershipNumber:
                  membershipNumber.trim(),

                name: name.trim(),

                phone: phone.trim(),

                email: email.trim(),

                address:
                  address?.trim() ||
                  null,

                profileImage,

                designation:
                  designation?.trim() ||
                  null,

                designationOrder:
                  parsedDesignationOrder,

                status: "ACTIVE",
              },
            });

          return {
            user,
            member,
          };
        }
      );

    return res.status(201).json({
      success: true,

      message:
        "Member created successfully",

      member: {
        id: result.member.id,

        membershipNumber:
          result.member
            .membershipNumber,

        name: result.member.name,

        email: result.member.email,

        phone: result.member.phone,

        address:
          result.member.address,

        profileImage:
          result.member.profileImage,

        designation:
          result.member.designation,

        designationOrder:
          result.member
            .designationOrder,

        status: result.member.status,

        userId: result.user.id,
      },
    });
  } catch (error) {
    console.error(
      "Create member error:",
      error
    );

    if (req.file) {
      deleteProfileImage(
        getProfileImagePath(
          req.file
        )
      );
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create member",
    });
  }
};

// =========================================================
// ADMIN - UPDATE MEMBER
// =========================================================

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

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

    // -----------------------------------------------------
    // FIND MEMBER
    // -----------------------------------------------------

    const member =
      await prisma.member.findUnique({
        where: {
          id,
        },
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // -----------------------------------------------------
    // EMAIL DUPLICATE CHECK
    // -----------------------------------------------------

    if (
      email &&
      email.trim() !== member.email
    ) {
      const existingUser =
        await prisma.user.findUnique({
          where: {
            email: email.trim(),
          },
        });

      if (
        existingUser &&
        existingUser.id !==
          member.userId
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Email already exists",
        });
      }
    }

    // -----------------------------------------------------
    // MEMBERSHIP NUMBER DUPLICATE CHECK
    // -----------------------------------------------------

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
        return res.status(409).json({
          success: false,
          message:
            "Membership number already exists",
        });
      }
    }

    // -----------------------------------------------------
    // DESIGNATION ORDER
    // -----------------------------------------------------

    let parsedDesignationOrder;

    if (
      designationOrder !== undefined &&
      designationOrder !== null &&
      designationOrder !== ""
    ) {
      parsedDesignationOrder =
        Number(designationOrder);

      if (
        !Number.isInteger(
          parsedDesignationOrder
        ) ||
        parsedDesignationOrder < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Designation order must be a valid positive number",
        });
      }
    }

    // -----------------------------------------------------
    // NEW IMAGE
    // -----------------------------------------------------

    const newProfileImage =
      req.file
        ? getProfileImagePath(
            req.file
          )
        : undefined;

    // -----------------------------------------------------
    // MEMBER DATA
    // -----------------------------------------------------

    const memberData = {
      ...(name !== undefined && {
        name: name.trim(),
      }),

      ...(email !== undefined && {
        email: email.trim(),
      }),

      ...(phone !== undefined && {
        phone: phone.trim(),
      }),

      ...(address !== undefined && {
        address:
          address?.trim() || null,
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

      ...(newProfileImage !==
        undefined && {
        profileImage:
          newProfileImage,
      }),
    };

    // -----------------------------------------------------
    // UPDATE USER + MEMBER
    // -----------------------------------------------------

    const result =
      await prisma.$transaction(
        async (tx) => {
          const updatedMember =
            await tx.member.update({
              where: {
                id,
              },

              data: memberData,
            });

          const userData = {
            ...(name !== undefined && {
              name: name.trim(),
            }),

            ...(email !== undefined && {
              email: email.trim(),
            }),
          };

          // -------------------------------------------------
          // PASSWORD UPDATE
          // -------------------------------------------------

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
                id: member.userId,
              },

              data: userData,
            });

          return {
            member: updatedMember,
            user: updatedUser,
          };
        }
      );

    // -----------------------------------------------------
    // REMOVE OLD IMAGE
    // -----------------------------------------------------

    if (
      newProfileImage &&
      member.profileImage
    ) {
      deleteProfileImage(
        member.profileImage
      );
    }

    return res.status(200).json({
      success: true,

      message:
        "Member updated successfully",

      member: result.member,
    });
  } catch (error) {
    console.error(
      "Update member error:",
      error
    );

    if (req.file) {
      deleteProfileImage(
        getProfileImagePath(
          req.file
        )
      );
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update member",
    });
  }
};

// =========================================================
// ADMIN - CHANGE MEMBER STATUS
// =========================================================

const changeMemberStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    if (
      ![
        "ACTIVE",
        "INACTIVE",
      ].includes(status)
    ) {
      return res.status(400).json({
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
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const result =
      await prisma.$transaction(
        async (tx) => {
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
                id: member.userId,
              },

              data: {
                isActive:
                  status ===
                  "ACTIVE",
              },
            });

          return {
            member: updatedMember,
            user: updatedUser,
          };
        }
      );

    return res.status(200).json({
      success: true,

      message: `Member ${status.toLowerCase()} successfully`,

      member: result.member,
    });
  } catch (error) {
    console.error(
      "Change member status error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to change member status",
    });
  }
};

// =========================================================
// ADMIN - DELETE MEMBER
// =========================================================

const deleteMember = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const member =
      await prisma.member.findUnique({
        where: {
          id,
        },
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    await prisma.member.delete({
      where: {
        id,
      },
    });

    if (member.profileImage) {
      deleteProfileImage(
        member.profileImage
      );
    }

    return res.status(200).json({
      success: true,

      message:
        "Member deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete member error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to delete member",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

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