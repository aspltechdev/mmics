// // const bcrypt = require("bcryptjs");
// // const prisma = require("../config/database");

// // // GET ALL MEMBERS
// // const getMembers = async (req, res) => {
// //   try {
// //     const members = await prisma.member.findMany({
// //       include: {
// //         user: {
// //           select: {
// //             id: true,
// //             email: true,
// //             role: true,
// //             isActive: true,
// //           },
// //         },
// //       },
// //       orderBy: {
// //         createdAt: "desc",
// //       },
// //     });

// //     res.json({
// //       success: true,
// //       count: members.length,
// //       members,
// //     });
// //   } catch (error) {
// //     console.error("Get members error:", error);

// //     res.status(500).json({
// //       success: false,
// //       message: "Unable to fetch members",
// //     });
// //   }
// // };

// // // GET SINGLE MEMBER
// // const getMember = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const member = await prisma.member.findUnique({
// //       where: {
// //         id,
// //       },
// //       include: {
// //         user: {
// //           select: {
// //             id: true,
// //             email: true,
// //             role: true,
// //             isActive: true,
// //           },
// //         },
// //       },
// //     });

// //     if (!member) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Member not found",
// //       });
// //     }

// //     res.json({
// //       success: true,
// //       member,
// //     });
// //   } catch (error) {
// //     console.error("Get member error:", error);

// //     res.status(500).json({
// //       success: false,
// //       message: "Unable to fetch member",
// //     });
// //   }
// // };

// // // CREATE MEMBER
// // const createMember = async (req, res) => {
// //   try {
// //     const {
// //       name,
// //       email,
// //       phone,
// //       address,
// //       membershipNumber,
// //       password,
// //       profileImage,
// //     } = req.body;

// //     if (
// //       !name ||
// //       !email ||
// //       !phone ||
// //       !membershipNumber ||
// //       !password
// //     ) {
// //       return res.status(400).json({
// //         success: false,
// //         message:
// //           "Name, email, phone, membership number and password are required",
// //       });
// //     }

// //     const existingUser = await prisma.user.findUnique({
// //       where: {
// //         email,
// //       },
// //     });

// //     if (existingUser) {
// //       return res.status(409).json({
// //         success: false,
// //         message: "Email already exists",
// //       });
// //     }

// //     const existingMembership =
// //       await prisma.member.findUnique({
// //         where: {
// //           membershipNumber,
// //         },
// //       });

// //     if (existingMembership) {
// //       return res.status(409).json({
// //         success: false,
// //         message: "Membership number already exists",
// //       });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 12);

// //     const result = await prisma.$transaction(async (tx) => {
// //       const user = await tx.user.create({
// //         data: {
// //           name,
// //           email,
// //           password: hashedPassword,
// //           role: "MEMBER",
// //           isActive: true,
// //         },
// //       });

// //       const member = await tx.member.create({
// //         data: {
// //           userId: user.id,
// //           membershipNumber,
// //           name,
// //           phone,
// //           email,
// //           address: address || null,
// //           profileImage: profileImage || null,
// //           status: "ACTIVE",
// //         },
// //       });

// //       return {
// //         user,
// //         member,
// //       };
// //     });

// //     res.status(201).json({
// //       success: true,
// //       message: "Member created successfully",
// //       member: {
// //         id: result.member.id,
// //         membershipNumber: result.member.membershipNumber,
// //         name: result.member.name,
// //         email: result.member.email,
// //         phone: result.member.phone,
// //         address: result.member.address,
// //         profileImage: result.member.profileImage,
// //         status: result.member.status,
// //         userId: result.user.id,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Create member error:", error);

// //     res.status(500).json({
// //       success: false,
// //       message: "Unable to create member",
// //     });
// //   }
// // };

// // // UPDATE MEMBER
// // const updateMember = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const {
// //       name,
// //       email,
// //       phone,
// //       address,
// //       membershipNumber,
// //       profileImage,
// //     } = req.body;

// //     const member = await prisma.member.findUnique({
// //       where: {
// //         id,
// //       },
// //     });

// //     if (!member) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Member not found",
// //       });
// //     }

// //     if (email && email !== member.email) {
// //       const existingUser = await prisma.user.findUnique({
// //         where: {
// //           email,
// //         },
// //       });

// //       if (
// //         existingUser &&
// //         existingUser.id !== member.userId
// //       ) {
// //         return res.status(409).json({
// //           success: false,
// //           message: "Email already exists",
// //         });
// //       }
// //     }

// //     if (
// //       membershipNumber &&
// //       membershipNumber !== member.membershipNumber
// //     ) {
// //       const existingMembership =
// //         await prisma.member.findUnique({
// //           where: {
// //             membershipNumber,
// //           },
// //         });

// //       if (
// //         existingMembership &&
// //         existingMembership.id !== member.id
// //       ) {
// //         return res.status(409).json({
// //           success: false,
// //           message: "Membership number already exists",
// //         });
// //       }
// //     }

// //     const result = await prisma.$transaction(async (tx) => {
// //       const updatedMember = await tx.member.update({
// //         where: {
// //           id,
// //         },
// //         data: {
// //           ...(name !== undefined && { name }),
// //           ...(email !== undefined && { email }),
// //           ...(phone !== undefined && { phone }),
// //           ...(address !== undefined && { address }),
// //           ...(membershipNumber !== undefined && {
// //             membershipNumber,
// //           }),
// //           ...(profileImage !== undefined && {
// //             profileImage,
// //           }),
// //         },
// //       });

// //       const updatedUser = await tx.user.update({
// //         where: {
// //           id: member.userId,
// //         },
// //         data: {
// //           ...(name !== undefined && { name }),
// //           ...(email !== undefined && { email }),
// //         },
// //       });

// //       return {
// //         member: updatedMember,
// //         user: updatedUser,
// //       };
// //     });

// //     res.json({
// //       success: true,
// //       message: "Member updated successfully",
// //       member: result.member,
// //     });
// //   } catch (error) {
// //     console.error("Update member error:", error);

// //     res.status(500).json({
// //       success: false,
// //       message: "Unable to update member",
// //     });
// //   }
// // };

// // // CHANGE MEMBER STATUS
// // const changeMemberStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status } = req.body;

// //     if (!["ACTIVE", "INACTIVE"].includes(status)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Status must be ACTIVE or INACTIVE",
// //       });
// //     }

// //     const member = await prisma.member.findUnique({
// //       where: {
// //         id,
// //       },
// //     });

// //     if (!member) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Member not found",
// //       });
// //     }

// //     const result = await prisma.$transaction(async (tx) => {
// //       const updatedMember = await tx.member.update({
// //         where: {
// //           id,
// //         },
// //         data: {
// //           status,
// //         },
// //       });

// //       const updatedUser = await tx.user.update({
// //         where: {
// //           id: member.userId,
// //         },
// //         data: {
// //           isActive: status === "ACTIVE",
// //         },
// //       });

// //       return {
// //         member: updatedMember,
// //         user: updatedUser,
// //       };
// //     });

// //     res.json({
// //       success: true,
// //       message: `Member ${status.toLowerCase()} successfully`,
// //       member: result.member,
// //     });
// //   } catch (error) {
// //     console.error("Change member status error:", error);

// //     res.status(500).json({
// //       success: false,
// //       message: "Unable to change member status",
// //     });
// //   }
// // };

// // // DELETE MEMBER
// // const deleteMember = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const member = await prisma.member.findUnique({
// //       where: {
// //         id,
// //       },
// //     });

// //     if (!member) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Member not found",
// //       });
// //     }

// //     await prisma.member.delete({
// //       where: {
// //         id,
// //       },
// //     });

// //     res.json({
// //       success: true,
// //       message: "Member deleted successfully",
// //     });
// //   } catch (error) {
// //     console.error("Delete member error:", error);

// //     res.status(500).json({
// //       success: false,
// //       message: "Unable to delete member",
// //     });
// //   }
// // };

// // module.exports = {
// //   getMembers,
// //   getMember,
// //   createMember,
// //   updateMember,
// //   changeMemberStatus,
// //   deleteMember,
// // };

// const bcrypt = require("bcryptjs");
// const prisma = require("../config/database");

// // ======================================================
// // GET ALL MEMBERS
// // ======================================================

// const getMembers = async (req, res) => {
//   try {
//     const members = await prisma.member.findMany({
//       include: {
//         user: {
//           select: {
//             id: true,
//             email: true,
//             role: true,
//             isActive: true,
//           },
//         },
//       },

//       orderBy: [
//         {
//           designationOrder: "asc",
//         },
//         {
//           createdAt: "desc",
//         },
//       ],
//     });

//     res.json({
//       success: true,
//       count: members.length,
//       members,
//     });
//   } catch (error) {
//     console.error("Get members error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch members",
//     });
//   }
// };

// // ======================================================
// // GET SINGLE MEMBER
// // ======================================================

// const getMember = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const member = await prisma.member.findUnique({
//       where: {
//         id,
//       },

//       include: {
//         user: {
//           select: {
//             id: true,
//             email: true,
//             role: true,
//             isActive: true,
//           },
//         },
//       },
//     });

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found",
//       });
//     }

//     res.json({
//       success: true,
//       member,
//     });
//   } catch (error) {
//     console.error("Get member error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch member",
//     });
//   }
// };

// // ======================================================
// // CREATE MEMBER
// // ======================================================

// const createMember = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       address,
//       membershipNumber,
//       password,
//       profileImage,
//       designation,
//       designationOrder,
//     } = req.body;

//     // ----------------------------------------------
//     // REQUIRED FIELDS
//     // ----------------------------------------------

//     if (
//       !name ||
//       !email ||
//       !phone ||
//       !membershipNumber ||
//       !password
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Name, email, phone, membership number and password are required",
//       });
//     }

//     // ----------------------------------------------
//     // CHECK EMAIL
//     // ----------------------------------------------

//     const existingUser = await prisma.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already exists",
//       });
//     }

//     // ----------------------------------------------
//     // CHECK MEMBERSHIP NUMBER
//     // ----------------------------------------------

//     const existingMembership =
//       await prisma.member.findUnique({
//         where: {
//           membershipNumber,
//         },
//       });

//     if (existingMembership) {
//       return res.status(409).json({
//         success: false,
//         message: "Membership number already exists",
//       });
//     }

//     // ----------------------------------------------
//     // PASSWORD HASH
//     // ----------------------------------------------

//     const hashedPassword = await bcrypt.hash(
//       password,
//       12
//     );

//     // ----------------------------------------------
//     // DESIGNATION ORDER
//     // ----------------------------------------------

//     const parsedDesignationOrder =
//       designationOrder !== undefined &&
//       designationOrder !== null &&
//       designationOrder !== ""
//         ? Number(designationOrder)
//         : 0;

//     if (
//       !Number.isInteger(
//         parsedDesignationOrder
//       ) ||
//       parsedDesignationOrder < 0
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Designation order must be a valid positive number",
//       });
//     }

//     // ----------------------------------------------
//     // CREATE USER + MEMBER
//     // ----------------------------------------------

//     const result = await prisma.$transaction(
//       async (tx) => {
//         const user = await tx.user.create({
//           data: {
//             name,
//             email,
//             password: hashedPassword,
//             role: "MEMBER",
//             isActive: true,
//           },
//         });

//         const member = await tx.member.create({
//           data: {
//             userId: user.id,
//             membershipNumber,
//             name,
//             phone,
//             email,
//             address: address || null,
//             profileImage: profileImage || null,
//             designation:
//               designation?.trim() || null,
//             designationOrder:
//               parsedDesignationOrder,
//             status: "ACTIVE",
//           },
//         });

//         return {
//           user,
//           member,
//         };
//       }
//     );

//     // ----------------------------------------------
//     // RESPONSE
//     // ----------------------------------------------

//     res.status(201).json({
//       success: true,
//       message: "Member created successfully",

//       member: {
//         id: result.member.id,
//         membershipNumber:
//           result.member.membershipNumber,

//         name: result.member.name,
//         email: result.member.email,
//         phone: result.member.phone,
//         address: result.member.address,

//         profileImage:
//           result.member.profileImage,

//         designation:
//           result.member.designation,

//         designationOrder:
//           result.member.designationOrder,

//         status: result.member.status,

//         userId: result.user.id,
//       },
//     });
//   } catch (error) {
//     console.error("Create member error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to create member",
//     });
//   }
// };

// // ======================================================
// // UPDATE MEMBER
// // ======================================================

// const updateMember = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       name,
//       email,
//       phone,
//       address,
//       membershipNumber,
//       profileImage,
//       designation,
//       designationOrder,
//       password,
//     } = req.body;

//     // ----------------------------------------------
//     // FIND MEMBER
//     // ----------------------------------------------

//     const member = await prisma.member.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found",
//       });
//     }

//     // ----------------------------------------------
//     // CHECK EMAIL
//     // ----------------------------------------------

//     if (
//       email &&
//       email !== member.email
//     ) {
//       const existingUser =
//         await prisma.user.findUnique({
//           where: {
//             email,
//           },
//         });

//       if (
//         existingUser &&
//         existingUser.id !== member.userId
//       ) {
//         return res.status(409).json({
//           success: false,
//           message: "Email already exists",
//         });
//       }
//     }

//     // ----------------------------------------------
//     // CHECK MEMBERSHIP NUMBER
//     // ----------------------------------------------

//     if (
//       membershipNumber &&
//       membershipNumber !==
//         member.membershipNumber
//     ) {
//       const existingMembership =
//         await prisma.member.findUnique({
//           where: {
//             membershipNumber,
//           },
//         });

//       if (
//         existingMembership &&
//         existingMembership.id !== member.id
//       ) {
//         return res.status(409).json({
//           success: false,
//           message:
//             "Membership number already exists",
//         });
//       }
//     }

//     // ----------------------------------------------
//     // VALIDATE DESIGNATION ORDER
//     // ----------------------------------------------

//     let parsedDesignationOrder;

//     if (
//       designationOrder !== undefined &&
//       designationOrder !== null &&
//       designationOrder !== ""
//     ) {
//       parsedDesignationOrder =
//         Number(designationOrder);

//       if (
//         !Number.isInteger(
//           parsedDesignationOrder
//         ) ||
//         parsedDesignationOrder < 0
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Designation order must be a valid positive number",
//         });
//       }
//     }

//     // ----------------------------------------------
//     // BUILD MEMBER DATA
//     // ----------------------------------------------

//     const memberData = {
//       ...(name !== undefined && {
//         name: name.trim(),
//       }),

//       ...(email !== undefined && {
//         email: email.trim(),
//       }),

//       ...(phone !== undefined && {
//         phone: phone.trim(),
//       }),

//       ...(address !== undefined && {
//         address: address || null,
//       }),

//       ...(membershipNumber !== undefined && {
//         membershipNumber:
//           membershipNumber.trim(),
//       }),

//       ...(profileImage !== undefined && {
//         profileImage:
//           profileImage || null,
//       }),

//       ...(designation !== undefined && {
//         designation:
//           designation?.trim() || null,
//       }),

//       ...(parsedDesignationOrder !==
//         undefined && {
//         designationOrder:
//           parsedDesignationOrder,
//       }),
//     };

//     // ----------------------------------------------
//     // UPDATE
//     // ----------------------------------------------

//     const result = await prisma.$transaction(
//       async (tx) => {
//         const updatedMember =
//           await tx.member.update({
//             where: {
//               id,
//             },

//             data: memberData,
//           });

//         const userData = {
//           ...(name !== undefined && {
//             name: name.trim(),
//           }),

//           ...(email !== undefined && {
//             email: email.trim(),
//           }),
//         };

//         // ------------------------------------------
//         // UPDATE PASSWORD IF PROVIDED
//         // ------------------------------------------

//         if (
//           password &&
//           password.trim()
//         ) {
//           userData.password =
//             await bcrypt.hash(
//               password,
//               12
//             );
//         }

//         const updatedUser =
//           await tx.user.update({
//             where: {
//               id: member.userId,
//             },

//             data: userData,
//           });

//         return {
//           member: updatedMember,
//           user: updatedUser,
//         };
//       }
//     );

//     // ----------------------------------------------
//     // RESPONSE
//     // ----------------------------------------------

//     res.json({
//       success: true,
//       message: "Member updated successfully",

//       member: result.member,
//     });
//   } catch (error) {
//     console.error(
//       "Update member error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: "Unable to update member",
//     });
//   }
// };

// // ======================================================
// // CHANGE MEMBER STATUS
// // ======================================================

// const changeMemberStatus = async (
//   req,
//   res
// ) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     // ----------------------------------------------
//     // VALIDATE STATUS
//     // ----------------------------------------------

//     if (
//       !["ACTIVE", "INACTIVE"].includes(
//         status
//       )
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Status must be ACTIVE or INACTIVE",
//       });
//     }

//     // ----------------------------------------------
//     // FIND MEMBER
//     // ----------------------------------------------

//     const member = await prisma.member.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found",
//       });
//     }

//     // ----------------------------------------------
//     // UPDATE MEMBER + USER
//     // ----------------------------------------------

//     const result = await prisma.$transaction(
//       async (tx) => {
//         const updatedMember =
//           await tx.member.update({
//             where: {
//               id,
//             },

//             data: {
//               status,
//             },
//           });

//         const updatedUser =
//           await tx.user.update({
//             where: {
//               id: member.userId,
//             },

//             data: {
//               isActive:
//                 status === "ACTIVE",
//             },
//           });

//         return {
//           member: updatedMember,
//           user: updatedUser,
//         };
//       }
//     );

//     res.json({
//       success: true,
//       message: `Member ${status.toLowerCase()} successfully`,
//       member: result.member,
//     });
//   } catch (error) {
//     console.error(
//       "Change member status error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message:
//         "Unable to change member status",
//     });
//   }
// };

// // ======================================================
// // DELETE MEMBER
// // ======================================================

// const deleteMember = async (
//   req,
//   res
// ) => {
//   try {
//     const { id } = req.params;

//     // ----------------------------------------------
//     // FIND MEMBER
//     // ----------------------------------------------

//     const member = await prisma.member.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found",
//       });
//     }

//     // ----------------------------------------------
//     // DELETE MEMBER
//     // ----------------------------------------------

//     await prisma.member.delete({
//       where: {
//         id,
//       },
//     });

//     res.json({
//       success: true,
//       message: "Member deleted successfully",
//     });
//   } catch (error) {
//     console.error(
//       "Delete member error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message: "Unable to delete member",
//     });
//   }
// };

// // ======================================================
// // EXPORTS
// // ======================================================

// module.exports = {
//   getMembers,
//   getMember,
//   createMember,
//   updateMember,
//   changeMemberStatus,
//   deleteMember,
// };














































































































// const bcrypt = require("bcryptjs");
// const fs = require("fs");
// const path = require("path");
// const prisma = require("../config/database");

// /* =========================================================
//    HELPERS
// ========================================================= */

// const getProfileImagePath = (file) => {
//   if (!file) return null;

//   return `/uploads/members/${file.filename}`;
// };

// const deleteProfileImage = (imagePath) => {
//   if (!imagePath) return;

//   try {
//     const cleanPath = imagePath.replace(/^\/+/, "");

//     const filePath = path.join(
//       __dirname,
//       "../../",
//       cleanPath
//     );

//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }
//   } catch (error) {
//     console.error("Unable to delete profile image:", error);
//   }
// };

// /* =========================================================
//    GET ALL MEMBERS
// ========================================================= */

// const getMembers = async (req, res) => {
//   try {
//     const members = await prisma.member.findMany({
//       include: {
//         user: {
//           select: {
//             id: true,
//             email: true,
//             role: true,
//             isActive: true,
//           },
//         },
//       },

//       orderBy: [
//         {
//           designationOrder: "asc",
//         },
//         {
//           createdAt: "desc",
//         },
//       ],
//     });

//     res.json({
//       success: true,
//       count: members.length,
//       members,
//     });
//   } catch (error) {
//     console.error("Get members error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch members",
//     });
//   }
// };

// /* =========================================================
//    GET SINGLE MEMBER
// ========================================================= */

// const getMember = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const member = await prisma.member.findUnique({
//       where: {
//         id,
//       },

//       include: {
//         user: {
//           select: {
//             id: true,
//             email: true,
//             role: true,
//             isActive: true,
//           },
//         },
//       },
//     });

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found",
//       });
//     }

//     res.json({
//       success: true,
//       member,
//     });
//   } catch (error) {
//     console.error("Get member error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch member",
//     });
//   }
// };

// /* =========================================================
//    CREATE MEMBER
// ========================================================= */

// const createMember = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       address,
//       membershipNumber,
//       password,
//       designation,
//       designationOrder,
//     } = req.body;

//     /* -----------------------------------------------------
//        REQUIRED FIELDS
//     ----------------------------------------------------- */

//     if (
//       !name ||
//       !email ||
//       !phone ||
//       !membershipNumber ||
//       !password
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Name, email, phone, membership number and password are required",
//       });
//     }

//     /* -----------------------------------------------------
//        CHECK EMAIL
//     ----------------------------------------------------- */

//     const existingUser = await prisma.user.findUnique({
//       where: {
//         email: email.trim(),
//       },
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already exists",
//       });
//     }

//     /* -----------------------------------------------------
//        CHECK MEMBERSHIP NUMBER
//     ----------------------------------------------------- */

//     const existingMembership =
//       await prisma.member.findUnique({
//         where: {
//           membershipNumber: membershipNumber.trim(),
//         },
//       });

//     if (existingMembership) {
//       return res.status(409).json({
//         success: false,
//         message: "Membership number already exists",
//       });
//     }

//     /* -----------------------------------------------------
//        DESIGNATION ORDER
//     ----------------------------------------------------- */

//     const parsedDesignationOrder =
//       designationOrder !== undefined &&
//       designationOrder !== null &&
//       designationOrder !== ""
//         ? Number(designationOrder)
//         : 0;

//     if (
//       !Number.isInteger(parsedDesignationOrder) ||
//       parsedDesignationOrder < 0
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Designation order must be a valid positive number",
//       });
//     }

//     /* -----------------------------------------------------
//        PASSWORD
//     ----------------------------------------------------- */

//     const hashedPassword = await bcrypt.hash(
//       password,
//       12
//     );

//     /* -----------------------------------------------------
//        PROFILE IMAGE
//     ----------------------------------------------------- */

//     const profileImage = getProfileImagePath(
//       req.file
//     );

//     /* -----------------------------------------------------
//        CREATE USER + MEMBER
//     ----------------------------------------------------- */

//     const result = await prisma.$transaction(
//       async (tx) => {
//         const user = await tx.user.create({
//           data: {
//             name: name.trim(),
//             email: email.trim(),
//             password: hashedPassword,
//             role: "MEMBER",
//             isActive: true,
//           },
//         });

//         const member = await tx.member.create({
//           data: {
//             userId: user.id,

//             membershipNumber:
//               membershipNumber.trim(),

//             name: name.trim(),

//             phone: phone.trim(),

//             email: email.trim(),

//             address:
//               address?.trim() || null,

//             profileImage,

//             designation:
//               designation?.trim() || null,

//             designationOrder:
//               parsedDesignationOrder,

//             status: "ACTIVE",
//           },
//         });

//         return {
//           user,
//           member,
//         };
//       }
//     );

//     /* -----------------------------------------------------
//        RESPONSE
//     ----------------------------------------------------- */

//     res.status(201).json({
//       success: true,
//       message: "Member created successfully",

//       member: {
//         id: result.member.id,

//         membershipNumber:
//           result.member.membershipNumber,

//         name: result.member.name,

//         email: result.member.email,

//         phone: result.member.phone,

//         address: result.member.address,

//         profileImage:
//           result.member.profileImage,

//         designation:
//           result.member.designation,

//         designationOrder:
//           result.member.designationOrder,

//         status:
//           result.member.status,

//         userId:
//           result.user.id,
//       },
//     });
//   } catch (error) {
//     console.error("Create member error:", error);

//     /*
//       If DB creation fails after the image was uploaded,
//       remove the uploaded image so we don't leave
//       orphan files.
//     */
//     if (req.file) {
//       deleteProfileImage(
//         getProfileImagePath(req.file)
//       );
//     }

//     res.status(500).json({
//       success: false,
//       message: "Unable to create member",
//     });
//   }
// };

// /* =========================================================
//    UPDATE MEMBER
// ========================================================= */

// const updateMember = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       name,
//       email,
//       phone,
//       address,
//       membershipNumber,
//       designation,
//       designationOrder,
//       password,
//     } = req.body;

//     /* -----------------------------------------------------
//        FIND MEMBER
//     ----------------------------------------------------- */

//     const member = await prisma.member.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found",
//       });
//     }

//     /* -----------------------------------------------------
//        CHECK EMAIL DUPLICATE
//     ----------------------------------------------------- */

//     if (
//       email &&
//       email.trim() !== member.email
//     ) {
//       const existingUser =
//         await prisma.user.findUnique({
//           where: {
//             email: email.trim(),
//           },
//         });

//       if (
//         existingUser &&
//         existingUser.id !== member.userId
//       ) {
//         return res.status(409).json({
//           success: false,
//           message: "Email already exists",
//         });
//       }
//     }

//     /* -----------------------------------------------------
//        CHECK MEMBERSHIP DUPLICATE
//     ----------------------------------------------------- */

//     if (
//       membershipNumber &&
//       membershipNumber.trim() !==
//         member.membershipNumber
//     ) {
//       const existingMembership =
//         await prisma.member.findUnique({
//           where: {
//             membershipNumber:
//               membershipNumber.trim(),
//           },
//         });

//       if (
//         existingMembership &&
//         existingMembership.id !== member.id
//       ) {
//         return res.status(409).json({
//           success: false,
//           message:
//             "Membership number already exists",
//         });
//       }
//     }

//     /* -----------------------------------------------------
//        DESIGNATION ORDER
//     ----------------------------------------------------- */

//     let parsedDesignationOrder;

//     if (
//       designationOrder !== undefined &&
//       designationOrder !== null &&
//       designationOrder !== ""
//     ) {
//       parsedDesignationOrder =
//         Number(designationOrder);

//       if (
//         !Number.isInteger(
//           parsedDesignationOrder
//         ) ||
//         parsedDesignationOrder < 0
//       ) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Designation order must be a valid positive number",
//         });
//       }
//     }

//     /* -----------------------------------------------------
//        NEW PROFILE IMAGE
//     ----------------------------------------------------- */

//     const newProfileImage =
//       req.file
//         ? getProfileImagePath(req.file)
//         : undefined;

//     /* -----------------------------------------------------
//        MEMBER DATA
//     ----------------------------------------------------- */

//     const memberData = {
//       ...(name !== undefined && {
//         name: name.trim(),
//       }),

//       ...(email !== undefined && {
//         email: email.trim(),
//       }),

//       ...(phone !== undefined && {
//         phone: phone.trim(),
//       }),

//       ...(address !== undefined && {
//         address: address?.trim() || null,
//       }),

//       ...(membershipNumber !== undefined && {
//         membershipNumber:
//           membershipNumber.trim(),
//       }),

//       ...(designation !== undefined && {
//         designation:
//           designation?.trim() || null,
//       }),

//       ...(parsedDesignationOrder !==
//         undefined && {
//         designationOrder:
//           parsedDesignationOrder,
//       }),

//       ...(newProfileImage !== undefined && {
//         profileImage: newProfileImage,
//       }),
//     };

//     /* -----------------------------------------------------
//        UPDATE USER + MEMBER
//     ----------------------------------------------------- */

//     const result = await prisma.$transaction(
//       async (tx) => {
//         const updatedMember =
//           await tx.member.update({
//             where: {
//               id,
//             },

//             data: memberData,
//           });

//         const userData = {
//           ...(name !== undefined && {
//             name: name.trim(),
//           }),

//           ...(email !== undefined && {
//             email: email.trim(),
//           }),
//         };

//         /* -------------------------------------------------
//            PASSWORD UPDATE
//         ------------------------------------------------- */

//         if (
//           password &&
//           password.trim()
//         ) {
//           userData.password =
//             await bcrypt.hash(
//               password.trim(),
//               12
//             );
//         }

//         const updatedUser =
//           await tx.user.update({
//             where: {
//               id: member.userId,
//             },

//             data: userData,
//           });

//         return {
//           member: updatedMember,
//           user: updatedUser,
//         };
//       }
//     );

//     /* -----------------------------------------------------
//        DELETE OLD IMAGE AFTER SUCCESSFUL DB UPDATE
//     ----------------------------------------------------- */

//     if (
//       newProfileImage &&
//       member.profileImage
//     ) {
//       deleteProfileImage(
//         member.profileImage
//       );
//     }

//     /* -----------------------------------------------------
//        RESPONSE
//     ----------------------------------------------------- */

//     res.json({
//       success: true,
//       message: "Member updated successfully",

//       member: result.member,
//     });
//   } catch (error) {
//     console.error("Update member error:", error);

//     /*
//       If a new image was uploaded but database update
//       failed, remove the newly uploaded image.
//     */
//     if (req.file) {
//       deleteProfileImage(
//         getProfileImagePath(req.file)
//       );
//     }

//     res.status(500).json({
//       success: false,
//       message: "Unable to update member",
//     });
//   }
// };

// /* =========================================================
//    CHANGE MEMBER STATUS
// ========================================================= */

// const changeMemberStatus = async (
//   req,
//   res
// ) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (
//       !["ACTIVE", "INACTIVE"].includes(
//         status
//       )
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Status must be ACTIVE or INACTIVE",
//       });
//     }

//     const member = await prisma.member.findUnique(
//       {
//         where: {
//           id,
//         },
//       }
//     );

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found",
//       });
//     }

//     const result = await prisma.$transaction(
//       async (tx) => {
//         const updatedMember =
//           await tx.member.update({
//             where: {
//               id,
//             },

//             data: {
//               status,
//             },
//           });

//         const updatedUser =
//           await tx.user.update({
//             where: {
//               id: member.userId,
//             },

//             data: {
//               isActive:
//                 status === "ACTIVE",
//             },
//           });

//         return {
//           member: updatedMember,
//           user: updatedUser,
//         };
//       }
//     );

//     res.json({
//       success: true,

//       message: `Member ${status.toLowerCase()} successfully`,

//       member: result.member,
//     });
//   } catch (error) {
//     console.error(
//       "Change member status error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message:
//         "Unable to change member status",
//     });
//   }
// };

// /* =========================================================
//    DELETE MEMBER
// ========================================================= */

// const deleteMember = async (
//   req,
//   res
// ) => {
//   try {
//     const { id } = req.params;

//     const member = await prisma.member.findUnique(
//       {
//         where: {
//           id,
//         },
//       }
//     );

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Member not found",
//       });
//     }

//     /* -----------------------------------------------------
//        DELETE MEMBER
//     ----------------------------------------------------- */

//     await prisma.member.delete({
//       where: {
//         id,
//       },
//     });

//     /* -----------------------------------------------------
//        DELETE PROFILE IMAGE
//     ----------------------------------------------------- */

//     if (member.profileImage) {
//       deleteProfileImage(
//         member.profileImage
//       );
//     }

//     res.json({
//       success: true,
//       message: "Member deleted successfully",
//     });
//   } catch (error) {
//     console.error(
//       "Delete member error:",
//       error
//     );

//     res.status(500).json({
//       success: false,
//       message:
//         "Unable to delete member",
//     });
//   }
// };

// /* =========================================================
//    EXPORTS
// ========================================================= */

// module.exports = {
//   getMembers,
//   getMember,
//   createMember,
//   updateMember,
//   changeMemberStatus,
//   deleteMember,
// };



























const express = require("express");
const multer = require("multer");

const {
  getMembers,
  getMember,
  getPublicMembers,
  getMyProfile,
  createMember,
  updateMember,
  changeMemberStatus,
  deleteMember,
} = require("../controllers/memberController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

/* =========================================================
   MULTER CONFIGURATION

   IMPORTANT:
   DO NOT use diskStorage on Vercel.

   Vercel's serverless filesystem is read-only for this use.
   memoryStorage keeps the uploaded file in memory and allows
   the controller to send it directly to Vercel Blob.
========================================================= */

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 4 * 1024 * 1024, // 4 MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed"
        )
      );
    }
  },
});

/* =========================================================
   ADMIN AUTH
========================================================= */

const adminOnly = [
  authMiddleware,
  roleMiddleware("ADMIN"),
];

/* =========================================================
   PUBLIC MEMBERS
   IMPORTANT:
   This must be BEFORE /:id
========================================================= */

router.get(
  "/public",
  getPublicMembers
);

/* =========================================================
   LOGGED-IN MEMBER PROFILE
========================================================= */

router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

/* =========================================================
   ADMIN - GET ALL MEMBERS
========================================================= */

router.get(
  "/",
  ...adminOnly,
  getMembers
);

/* =========================================================
   ADMIN - GET SINGLE MEMBER
========================================================= */

router.get(
  "/:id",
  ...adminOnly,
  getMember
);

/* =========================================================
   ADMIN - CREATE MEMBER

   multipart/form-data
   field name: profileImage
========================================================= */

router.post(
  "/",
  ...adminOnly,
  upload.single("profileImage"),
  createMember
);

/* =========================================================
   ADMIN - UPDATE MEMBER

   multipart/form-data
   field name: profileImage
========================================================= */

router.put(
  "/:id",
  ...adminOnly,
  upload.single("profileImage"),
  updateMember
);

/* =========================================================
   ADMIN - CHANGE MEMBER STATUS
========================================================= */

router.patch(
  "/:id/status",
  ...adminOnly,
  changeMemberStatus
);

/* =========================================================
   ADMIN - DELETE MEMBER
========================================================= */

router.delete(
  "/:id",
  ...adminOnly,
  deleteMember
);

/* =========================================================
   MULTER ERROR HANDLER
========================================================= */

router.use(
  (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message:
            "Profile image must be 4 MB or smaller",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  }
);

module.exports = router;