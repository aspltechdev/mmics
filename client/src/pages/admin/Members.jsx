// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Search,
//   Plus,
//   RefreshCw,
//   Users,
//   UserCheck,
//   UserX,
//   ShieldCheck,
//   BriefcaseBusiness,
//   ImagePlus,
//   X,
//   Eye,
//   Pencil,
//   Trash2,
//   MoreHorizontal,
//   Phone,
//   Mail,
//   MapPin,
//   CalendarDays,
//   Hash,
//   LockKeyhole,
//   AlertCircle,
//   CheckCircle2,
//   ArrowUpDown,
//   Upload,
//   Camera,
// } from "lucide-react";

// import membersService from "../../services/memberService";
// import "./Members.css";

// /* =========================================================
//    CONFIG
// ========================================================= */

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:5000/api";

// const SERVER_URL = API_BASE_URL.replace(
//   /\/api\/?$/,
//   ""
// );

// /* =========================================================
//    HELPERS
// ========================================================= */

// const getImageUrl = (imagePath) => {
//   if (!imagePath) return "";

//   if (
//     imagePath.startsWith("http://") ||
//     imagePath.startsWith("https://") ||
//     imagePath.startsWith("blob:")
//   ) {
//     return imagePath;
//   }

//   return `${SERVER_URL}${
//     imagePath.startsWith("/") ? "" : "/"
//   }${imagePath}`;
// };

// const getInitials = (name = "") => {
//   return name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((word) =>
//       word.charAt(0).toUpperCase()
//     )
//     .join("");
// };

// const formatDate = (date) => {
//   if (!date) return "-";

//   return new Date(date).toLocaleDateString(
//     "en-IN",
//     {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     }
//   );
// };

// /* =========================================================
//    DESIGNATIONS
// ========================================================= */

// const designationOptions = [
//   "Chairman",
//   "President",
//   "Vice President",
//   "Secretary",
//   "Joint Secretary",
//   "Treasurer",
//   "Executive Member",
//   "Member",
// ];

// /* =========================================================
//    EMPTY FORM
// ========================================================= */

// const emptyForm = {
//   name: "",
//   membershipNumber: "",
//   email: "",
//   phone: "",
//   address: "",
//   designation: "",
//   designationOrder: 0,
//   password: "",
//   profileImage: "",
// };

// /* =========================================================
//    COMPONENT
// ========================================================= */

// const Members = () => {
//   /* =======================================================
//      STATE
//   ======================================================= */

//   const [members, setMembers] = useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [saving, setSaving] =
//     useState(false);

//   const [deleting, setDeleting] =
//     useState(false);

//   const [search, setSearch] =
//     useState("");

//   const [statusFilter, setStatusFilter] =
//     useState("ALL");

//   const [
//     designationFilter,
//     setDesignationFilter,
//   ] = useState("ALL");

//   const [formData, setFormData] =
//     useState(emptyForm);

//   const [
//     profileImageFile,
//     setProfileImageFile,
//   ] = useState(null);

//   const [
//     imagePreview,
//     setImagePreview,
//   ] = useState("");

//   const [
//     editingMember,
//     setEditingMember,
//   ] = useState(null);

//   const [
//     viewingMember,
//     setViewingMember,
//   ] = useState(null);

//   const [
//     deletingMember,
//     setDeletingMember,
//   ] = useState(null);

//   const [
//     isModalOpen,
//     setIsModalOpen,
//   ] = useState(false);

//   const [
//     isViewModalOpen,
//     setIsViewModalOpen,
//   ] = useState(false);

//   const [
//     isDeleteModalOpen,
//     setIsDeleteModalOpen,
//   ] = useState(false);

//   const [
//     openMenuId,
//     setOpenMenuId,
//   ] = useState(null);

//   const [alert, setAlert] = useState({
//     type: "",
//     message: "",
//   });

//   const [error, setError] =
//     useState("");

//   /* =======================================================
//      FILE INPUT REF
//   ======================================================= */

//   const fileInputRef =
//     useRef(null);

//   /* =======================================================
//      FETCH MEMBERS
//   ======================================================= */

//   const fetchMembers = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response =
//         await membersService.getMembers();

//       const data =
//         response?.data || response;

//       setMembers(
//         data?.members || []
//       );
//     } catch (err) {
//       console.error(
//         "Fetch members error:",
//         err
//       );

//       setError(
//         err?.response?.data?.message ||
//           "Unable to fetch members"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */

//   useEffect(() => {
//     fetchMembers();
//   }, []);

//   /* =======================================================
//      ALERT AUTO CLOSE
//   ======================================================= */

//   useEffect(() => {
//     if (!alert.message) return;

//     const timer = setTimeout(() => {
//       setAlert({
//         type: "",
//         message: "",
//       });
//     }, 3500);

//     return () =>
//       clearTimeout(timer);
//   }, [alert]);

//   /* =======================================================
//      CLOSE MENU OUTSIDE
//   ======================================================= */

//   useEffect(() => {
//     const handleClick = () => {
//       setOpenMenuId(null);
//     };

//     document.addEventListener(
//       "click",
//       handleClick
//     );

//     return () => {
//       document.removeEventListener(
//         "click",
//         handleClick
//       );
//     };
//   }, []);

//   /* =======================================================
//      FILTERED MEMBERS
//   ======================================================= */

//   const filteredMembers = useMemo(() => {
//     const query =
//       search.trim().toLowerCase();

//     return members.filter(
//       (member) => {
//         const matchesSearch =
//           !query ||
//           member.name
//             ?.toLowerCase()
//             .includes(query) ||
//           member.email
//             ?.toLowerCase()
//             .includes(query) ||
//           member.phone
//             ?.toLowerCase()
//             .includes(query) ||
//           member.membershipNumber
//             ?.toLowerCase()
//             .includes(query) ||
//           member.designation
//             ?.toLowerCase()
//             .includes(query);

//         const matchesStatus =
//           statusFilter === "ALL" ||
//           member.status ===
//             statusFilter;

//         const matchesDesignation =
//           designationFilter === "ALL" ||
//           member.designation ===
//             designationFilter;

//         return (
//           matchesSearch &&
//           matchesStatus &&
//           matchesDesignation
//         );
//       }
//     );
//   }, [
//     members,
//     search,
//     statusFilter,
//     designationFilter,
//   ]);

//   /* =======================================================
//      STATS
//   ======================================================= */

//   const totalMembers =
//     members.length;

//   const activeMembers =
//     members.filter(
//       (member) =>
//         member.status === "ACTIVE"
//     ).length;

//   const inactiveMembers =
//     members.filter(
//       (member) =>
//         member.status === "INACTIVE"
//     ).length;

//   const leadershipMembers =
//     members.filter(
//       (member) =>
//         member.designation &&
//         member.designation !==
//           "Member"
//     ).length;

//   /* =======================================================
//      RESET FORM
//   ======================================================= */

//   const resetForm = () => {
//     if (
//       imagePreview &&
//       imagePreview.startsWith("blob:")
//     ) {
//       URL.revokeObjectURL(
//         imagePreview
//       );
//     }

//     setFormData(emptyForm);

//     setProfileImageFile(null);

//     setImagePreview("");

//     if (fileInputRef.current) {
//       fileInputRef.current.value =
//         "";
//     }
//   };

//   /* =======================================================
//      ADD MEMBER
//   ======================================================= */

//   const handleAddMember = () => {
//     setEditingMember(null);

//     resetForm();

//     setError("");

//     setIsModalOpen(true);
//   };

//   /* =======================================================
//      EDIT MEMBER
//   ======================================================= */

//   const handleEditMember = (
//     member
//   ) => {
//     setEditingMember(member);

//     setFormData({
//       name: member.name || "",
//       membershipNumber:
//         member.membershipNumber ||
//         "",
//       email: member.email || "",
//       phone: member.phone || "",
//       address:
//         member.address || "",
//       designation:
//         member.designation || "",
//       designationOrder:
//         member.designationOrder ??
//         0,
//       password: "",
//       profileImage:
//         member.profileImage || "",
//     });

//     setProfileImageFile(null);

//     setImagePreview(
//       member.profileImage
//         ? getImageUrl(
//             member.profileImage
//           )
//         : ""
//     );

//     if (fileInputRef.current) {
//       fileInputRef.current.value =
//         "";
//     }

//     setError("");

//     setOpenMenuId(null);

//     setIsModalOpen(true);
//   };

//   /* =======================================================
//      VIEW MEMBER
//   ======================================================= */

//   const handleViewMember = (
//     member
//   ) => {
//     setViewingMember(member);

//     setOpenMenuId(null);

//     setIsViewModalOpen(true);
//   };

//   /* =======================================================
//      CLOSE FORM MODAL
//   ======================================================= */

//   const closeModal = () => {
//     if (saving) return;

//     setIsModalOpen(false);

//     setEditingMember(null);

//     resetForm();

//     setError("");
//   };

//   /* =======================================================
//      FORM CHANGE
//   ======================================================= */

//   const handleChange = (
//     event
//   ) => {
//     const {
//       name,
//       value,
//     } = event.target;

//     setFormData(
//       (previous) => ({
//         ...previous,
//         [name]: value,
//       })
//     );
//   };

//   /* =======================================================
//      OPEN FILE EXPLORER
//   ======================================================= */

//   const handleUploadClick = () => {
//     if (
//       fileInputRef.current
//     ) {
//       fileInputRef.current.click();
//     }
//   };

//   /* =======================================================
//      IMAGE CHANGE
//   ======================================================= */

//   const handleProfileImageChange =
//     (event) => {
//       const file =
//         event.target.files?.[0];

//       if (!file) return;

//       const allowedTypes = [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "image/webp",
//       ];

//       /* ---------------------------------------------------
//          FILE TYPE
//       --------------------------------------------------- */

//       if (
//         !allowedTypes.includes(
//           file.type
//         )
//       ) {
//         setError(
//           "Please upload JPG, JPEG, PNG or WebP image"
//         );

//         event.target.value = "";

//         return;
//       }

//       /* ---------------------------------------------------
//          FILE SIZE
//       --------------------------------------------------- */

//       if (
//         file.size >
//         5 * 1024 * 1024
//       ) {
//         setError(
//           "Profile photo must be less than 5MB"
//         );

//         event.target.value = "";

//         return;
//       }

//       setError("");

//       /* ---------------------------------------------------
//          REMOVE OLD BLOB
//       --------------------------------------------------- */

//       if (
//         imagePreview &&
//         imagePreview.startsWith("blob:")
//       ) {
//         URL.revokeObjectURL(
//           imagePreview
//         );
//       }

//       /* ---------------------------------------------------
//          CREATE PREVIEW
//       --------------------------------------------------- */

//       const previewUrl =
//         URL.createObjectURL(file);

//       setProfileImageFile(file);

//       setImagePreview(
//         previewUrl
//       );

//       setFormData(
//         (previous) => ({
//           ...previous,
//           profileImage:
//             previewUrl,
//         })
//       );
//     };

//   /* =======================================================
//      REMOVE IMAGE
//   ======================================================= */

//   const handleRemoveProfileImage =
//     () => {
//       if (
//         imagePreview &&
//         imagePreview.startsWith("blob:")
//       ) {
//         URL.revokeObjectURL(
//           imagePreview
//         );
//       }

//       setProfileImageFile(null);

//       setImagePreview("");

//       setFormData(
//         (previous) => ({
//           ...previous,
//           profileImage: "",
//         })
//       );

//       if (fileInputRef.current) {
//         fileInputRef.current.value =
//           "";
//       }
//     };

//   /* =======================================================
//      SUBMIT
//   ======================================================= */

//   const handleSubmit = async (
//     event
//   ) => {
//     event.preventDefault();

//     try {
//       setSaving(true);

//       setError("");

//       /* ---------------------------------------------------
//          VALIDATION
//       --------------------------------------------------- */

//       if (!formData.name.trim()) {
//         setError(
//           "Name is required"
//         );

//         return;
//       }

//       if (
//         !formData.membershipNumber.trim()
//       ) {
//         setError(
//           "Membership number is required"
//         );

//         return;
//       }

//       if (!formData.email.trim()) {
//         setError(
//           "Email is required"
//         );

//         return;
//       }

//       if (!formData.phone.trim()) {
//         setError(
//           "Phone number is required"
//         );

//         return;
//       }

//       if (
//         !editingMember &&
//         !formData.password.trim()
//       ) {
//         setError(
//           "Password is required for new member"
//         );

//         return;
//       }

//       /* ---------------------------------------------------
//          FORM DATA
//       --------------------------------------------------- */

//       const data =
//         new FormData();

//       data.append(
//         "name",
//         formData.name.trim()
//       );

//       data.append(
//         "membershipNumber",
//         formData.membershipNumber.trim()
//       );

//       data.append(
//         "email",
//         formData.email.trim()
//       );

//       data.append(
//         "phone",
//         formData.phone.trim()
//       );

//       data.append(
//         "address",
//         formData.address.trim()
//       );

//       data.append(
//         "designation",
//         formData.designation.trim()
//       );

//       data.append(
//         "designationOrder",
//         String(
//           formData.designationOrder ||
//             0
//         )
//       );

//       /* ---------------------------------------------------
//          PASSWORD
//       --------------------------------------------------- */

//       if (
//         formData.password.trim()
//       ) {
//         data.append(
//           "password",
//           formData.password.trim()
//         );
//       }

//       /* ---------------------------------------------------
//          ACTUAL FILE
//       --------------------------------------------------- */

//       if (profileImageFile) {
//         data.append(
//           "profileImage",
//           profileImageFile
//         );
//       }

//       /* ---------------------------------------------------
//          CREATE
//       --------------------------------------------------- */

//       if (!editingMember) {
//         await membersService.createMember(
//           data
//         );

//         setAlert({
//           type: "success",
//           message:
//             "Member created successfully",
//         });
//       }

//       /* ---------------------------------------------------
//          UPDATE
//       --------------------------------------------------- */

//       else {
//         await membersService.updateMember(
//           editingMember.id,
//           data
//         );

//         setAlert({
//           type: "success",
//           message:
//             "Member updated successfully",
//         });
//       }

//       /* ---------------------------------------------------
//          REFRESH
//       --------------------------------------------------- */

//       await fetchMembers();

//       setIsModalOpen(false);

//       setEditingMember(null);

//       resetForm();
//     } catch (err) {
//       console.error(
//         "Save member error:",
//         err
//       );

//       setError(
//         err?.response?.data?.message ||
//           "Unable to save member"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* =======================================================
//      STATUS CHANGE
//   ======================================================= */

//   const handleStatusChange =
//     async (member) => {
//       try {
//         setOpenMenuId(null);

//         const newStatus =
//           member.status ===
//           "ACTIVE"
//             ? "INACTIVE"
//             : "ACTIVE";

//         await membersService.changeStatus(
//           member.id,
//           {
//             status: newStatus,
//           }
//         );

//         setAlert({
//           type: "success",
//           message: `Member ${
//             newStatus === "ACTIVE"
//               ? "activated"
//               : "deactivated"
//           } successfully`,
//         });

//         await fetchMembers();
//       } catch (err) {
//         console.error(
//           "Status update error:",
//           err
//         );

//         setAlert({
//           type: "error",
//           message:
//             err?.response?.data
//               ?.message ||
//             "Unable to change member status",
//         });
//       }
//     };

//   /* =======================================================
//      DELETE CLICK
//   ======================================================= */

//   const handleDeleteClick =
//     (member) => {
//       setDeletingMember(member);

//       setOpenMenuId(null);

//       setIsDeleteModalOpen(true);
//     };

//   /* =======================================================
//      DELETE CONFIRM
//   ======================================================= */

//   const handleDeleteConfirm =
//     async () => {
//       if (!deletingMember) return;

//       try {
//         setDeleting(true);

//         await membersService.deleteMember(
//           deletingMember.id
//         );

//         setAlert({
//           type: "success",
//           message:
//             "Member deleted successfully",
//         });

//         setIsDeleteModalOpen(
//           false
//         );

//         setDeletingMember(null);

//         await fetchMembers();
//       } catch (err) {
//         console.error(
//           "Delete member error:",
//           err
//         );

//         setAlert({
//           type: "error",
//           message:
//             err?.response?.data
//               ?.message ||
//             "Unable to delete member",
//         });
//       } finally {
//         setDeleting(false);
//       }
//     };

//   /* =======================================================
//      CLEAR FILTERS
//   ======================================================= */

//   const clearFilters = () => {
//     setSearch("");

//     setStatusFilter("ALL");

//     setDesignationFilter("ALL");
//   };

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <div className="mmics-members-page">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="mmics-members-header">

//         <div>
//           <div className="mmics-members-eyebrow">
//             Community Management
//           </div>

//           <h1>
//             Members
//           </h1>

//           <p>
//             Manage MMICS members,
//             leadership roles and
//             community records.
//           </p>
//         </div>

//         <div className="mmics-members-header-actions">

//           <button
//             type="button"
//             className="mmics-members-refresh"
//             onClick={fetchMembers}
//             disabled={loading}
//           >
//             <RefreshCw
//               size={15}
//               className={
//                 loading
//                   ? "mmics-members-spin"
//                   : ""
//               }
//             />

//             Refresh
//           </button>

//           <button
//             type="button"
//             className="mmics-members-add-button"
//             onClick={
//               handleAddMember
//             }
//           >
//             <Plus size={16} />

//             Add Member
//           </button>

//         </div>

//       </div>

//       {/* =================================================
//           ALERT
//       ================================================= */}

//       {alert.message && (
//         <div
//           className={`mmics-members-alert ${alert.type}`}
//         >
//           {alert.type ===
//           "success" ? (
//             <CheckCircle2
//               size={16}
//             />
//           ) : (
//             <AlertCircle
//               size={16}
//             />
//           )}

//           <span>
//             {alert.message}
//           </span>

//           <button
//             type="button"
//             onClick={() =>
//               setAlert({
//                 type: "",
//                 message: "",
//               })
//             }
//           >
//             <X size={15} />
//           </button>

//         </div>
//       )}

//       {/* =================================================
//           STATS
//       ================================================= */}

//       <div className="mmics-members-stats">

//         <div className="mmics-members-stat-card">

//           <div className="mmics-members-stat-icon">
//             <Users size={19} />
//           </div>

//           <div>
//             <span>
//               Total Members
//             </span>

//             <strong>
//               {totalMembers}
//             </strong>
//           </div>

//         </div>

//         <div className="mmics-members-stat-card">

//           <div className="mmics-members-stat-icon active">
//             <UserCheck
//               size={19}
//             />
//           </div>

//           <div>
//             <span>
//               Active
//             </span>

//             <strong>
//               {activeMembers}
//             </strong>
//           </div>

//         </div>

//         <div className="mmics-members-stat-card">

//           <div className="mmics-members-stat-icon leadership">
//             <ShieldCheck
//               size={19}
//             />
//           </div>

//           <div>
//             <span>
//               Leadership
//             </span>

//             <strong>
//               {leadershipMembers}
//             </strong>
//           </div>

//         </div>

//         <div className="mmics-members-stat-card">

//           <div className="mmics-members-stat-icon inactive">
//             <UserX size={19} />
//           </div>

//           <div>
//             <span>
//               Inactive
//             </span>

//             <strong>
//               {inactiveMembers}
//             </strong>
//           </div>

//         </div>

//       </div>

//       {/* =================================================
//           FILTER TOOLBAR
//       ================================================= */}

//       <div className="mmics-members-toolbar">

//         <div className="mmics-members-search">

//           <Search size={16} />

//           <input
//             type="text"
//             value={search}
//             onChange={(event) =>
//               setSearch(
//                 event.target.value
//               )
//             }
//             placeholder="Search name, membership no., phone, email or designation..."
//           />

//           {search && (
//             <button
//               type="button"
//               onClick={() =>
//                 setSearch("")
//               }
//             >
//               <X size={13} />
//             </button>
//           )}

//         </div>

//         <select
//           className="mmics-members-filter"
//           value={
//             designationFilter
//           }
//           onChange={(event) =>
//             setDesignationFilter(
//               event.target.value
//             )
//           }
//         >
//           <option value="ALL">
//             All Designations
//           </option>

//           {designationOptions.map(
//             (designation) => (
//               <option
//                 key={designation}
//                 value={designation}
//               >
//                 {designation}
//               </option>
//             )
//           )}

//         </select>

//         <select
//           className="mmics-members-status-filter"
//           value={
//             statusFilter
//           }
//           onChange={(event) =>
//             setStatusFilter(
//               event.target.value
//             )
//           }
//         >
//           <option value="ALL">
//             All Status
//           </option>

//           <option value="ACTIVE">
//             Active
//           </option>

//           <option value="INACTIVE">
//             Inactive
//           </option>
//         </select>

//       </div>

//       {/* =================================================
//           TABLE
//       ================================================= */}

//       <div className="mmics-members-table-card">

//         <div className="mmics-members-table-header">

//           <div>

//             <h2>
//               Community Directory
//             </h2>

//             <span>
//               Showing{" "}
//               {
//                 filteredMembers.length
//               }{" "}
//               of{" "}
//               {members.length}{" "}
//               members
//             </span>

//           </div>

//           {(search ||
//             statusFilter !==
//               "ALL" ||
//             designationFilter !==
//               "ALL") && (
//             <button
//               type="button"
//               className="mmics-members-clear-filters"
//               onClick={
//                 clearFilters
//               }
//             >
//               Clear filters
//             </button>
//           )}

//         </div>

//         {/* =================================================
//             LOADING
//         ================================================= */}

//         {loading ? (
//           <div className="mmics-members-loading">

//             <RefreshCw
//               size={21}
//               className="mmics-members-spin"
//             />

//             Loading members...

//           </div>
//         ) : filteredMembers.length ===
//           0 ? (

//           /* =================================================
//              EMPTY
//           ================================================= */

//           <div className="mmics-members-empty">

//             <div className="mmics-members-empty-icon">
//               <Users size={26} />
//             </div>

//             <h3>
//               No members found
//             </h3>

//             <p>
//               {search ||
//               statusFilter !==
//                 "ALL" ||
//               designationFilter !==
//                 "ALL"
//                 ? "Try changing your search or filters."
//                 : "Start building your MMICS community directory by adding the first member."}
//             </p>

//             {!search &&
//               statusFilter ===
//                 "ALL" &&
//               designationFilter ===
//                 "ALL" && (
//                 <button
//                   type="button"
//                   onClick={
//                     handleAddMember
//                   }
//                 >
//                   <Plus size={14} />
//                   Add Member
//                 </button>
//               )}

//           </div>

//         ) : (

//           /* =================================================
//              DATA TABLE
//           ================================================= */

//           <div className="mmics-members-table-wrapper">

//             <table className="mmics-members-table">

//               <thead>

//                 <tr>
//                   <th>
//                     MEMBER
//                   </th>

//                   <th>
//                     DESIGNATION
//                   </th>

//                   <th>
//                     MEMBERSHIP
//                   </th>

//                   <th>
//                     CONTACT
//                   </th>

//                   <th>
//                     STATUS
//                   </th>

//                   <th>
//                     JOINED
//                   </th>

//                   <th>
//                     ACTIONS
//                   </th>
//                 </tr>

//               </thead>

//               <tbody>

//                 {filteredMembers.map(
//                   (member) => (
//                     <tr
//                       key={
//                         member.id
//                       }
//                     >

//                       {/* MEMBER */}
//                       <td>

//                         <div className="mmics-member-identity">

//                           <div
//                             className={`mmics-member-avatar ${
//                               member.profileImage
//                                 ? "mmics-member-photo"
//                                 : "mmics-member-avatar-fallback"
//                             }`}
//                           >

//                             {member.profileImage ? (
//                               <img
//                                 src={getImageUrl(
//                                   member.profileImage
//                                 )}
//                                 alt={
//                                   member.name
//                                 }
//                                 onError={(
//                                   event
//                                 ) => {
//                                   event.currentTarget.style.display =
//                                     "none";
//                                 }}
//                               />
//                             ) : (
//                               getInitials(
//                                 member.name
//                               )
//                             )}

//                           </div>

//                           <div>

//                             <strong>
//                               {
//                                 member.name
//                               }
//                             </strong>

//                             <span>
//                               {
//                                 member.email ||
//                                 "-"
//                               }
//                             </span>

//                           </div>

//                         </div>

//                       </td>

//                       {/* DESIGNATION */}
//                       <td>

//                         <div className="mmics-member-designation">

//                           <BriefcaseBusiness
//                             size={14}
//                           />

//                           <div>

//                             <strong>
//                               {
//                                 member.designation ||
//                                 "Member"
//                               }
//                             </strong>

//                             <span>
//                               Order{" "}
//                               {
//                                 member.designationOrder ??
//                                 0
//                               }
//                             </span>

//                           </div>

//                         </div>

//                       </td>

//                       {/* MEMBERSHIP */}
//                       <td>

//                         <span className="mmics-membership-number">

//                           <Hash
//                             size={12}
//                           />

//                           {
//                             member.membershipNumber ||
//                             "-"
//                           }

//                         </span>

//                       </td>

//                       {/* CONTACT */}
//                       <td>

//                         <div className="mmics-member-contact">

//                           <span>
//                             <Phone
//                               size={12}
//                             />

//                             {
//                               member.phone ||
//                               "-"
//                             }
//                           </span>

//                           <span>
//                             <Mail
//                               size={12}
//                             />

//                             {
//                               member.email ||
//                               "-"
//                             }
//                           </span>

//                         </div>

//                       </td>

//                       {/* STATUS */}
//                       <td>

//                         <span
//                           className={`mmics-member-status ${
//                             member.status ===
//                             "ACTIVE"
//                               ? "active"
//                               : "inactive"
//                           }`}
//                         >
//                           <span />

//                           {member.status ===
//                           "ACTIVE"
//                             ? "Active"
//                             : "Inactive"}
//                         </span>

//                       </td>

//                       {/* JOINED */}
//                       <td>

//                         <span className="mmics-member-date">

//                           <CalendarDays
//                             size={12}
//                           />

//                           {formatDate(
//                             member.createdAt
//                           )}

//                         </span>

//                       </td>

//                       {/* ACTIONS */}
//                       <td>

//                         <div
//                           className="mmics-member-actions"
//                           onClick={(
//                             event
//                           ) =>
//                             event.stopPropagation()
//                           }
//                         >

//                           <button
//                             type="button"
//                             title="View"
//                             onClick={() =>
//                               handleViewMember(
//                                 member
//                               )
//                             }
//                           >
//                             <Eye
//                               size={15}
//                             />
//                           </button>

//                           <button
//                             type="button"
//                             title="Edit"
//                             onClick={() =>
//                               handleEditMember(
//                                 member
//                               )
//                             }
//                           >
//                             <Pencil
//                               size={15}
//                             />
//                           </button>

//                           <div className="mmics-member-more">

//                             <button
//                               type="button"
//                               title="More"
//                               onClick={(
//                                 event
//                               ) => {
//                                 event.stopPropagation();

//                                 setOpenMenuId(
//                                   openMenuId ===
//                                     member.id
//                                     ? null
//                                     : member.id
//                                 );
//                               }}
//                             >
//                               <MoreHorizontal
//                                 size={16}
//                               />
//                             </button>

//                             {openMenuId ===
//                               member.id && (
//                               <div className="mmics-member-dropdown">

//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleStatusChange(
//                                       member
//                                     )
//                                   }
//                                 >
//                                   {member.status ===
//                                   "ACTIVE" ? (
//                                     <>
//                                       <UserX
//                                         size={
//                                           14
//                                         }
//                                       />
//                                       Deactivate
//                                     </>
//                                   ) : (
//                                     <>
//                                       <UserCheck
//                                         size={
//                                           14
//                                         }
//                                       />
//                                       Activate
//                                     </>
//                                   )}
//                                 </button>

//                                 <button
//                                   type="button"
//                                   className="delete"
//                                   onClick={() =>
//                                     handleDeleteClick(
//                                       member
//                                     )
//                                   }
//                                 >
//                                   <Trash2
//                                     size={
//                                       14
//                                     }
//                                   />

//                                   Delete
//                                 </button>

//                               </div>
//                             )}

//                           </div>

//                         </div>

//                       </td>

//                     </tr>
//                   )
//                 )}

//               </tbody>

//             </table>

//           </div>
//         )}

//       </div>

//       {/* =================================================
//           ADD / EDIT MODAL
//       ================================================= */}

//       {isModalOpen && (
//         <div
//           className="mmics-members-modal-backdrop"
//           onMouseDown={(event) => {
//             if (
//               event.target ===
//               event.currentTarget
//             ) {
//               closeModal();
//             }
//           }}
//         >

//           <div className="mmics-members-modal">

//             {/* HEADER */}

//             <div className="mmics-members-modal-header">

//               <div>

//                 <span>
//                   {editingMember
//                     ? "UPDATE MEMBER"
//                     : "NEW MEMBER"}
//                 </span>

//                 <h2>
//                   {editingMember
//                     ? "Edit Member"
//                     : "Add Member"}
//                 </h2>

//                 <p>
//                   Add member details,
//                   community role and
//                   profile photo.
//                 </p>

//               </div>

//               <button
//                 type="button"
//                 onClick={closeModal}
//               >
//                 <X size={17} />
//               </button>

//             </div>

//             {/* ERROR */}

//             {error && (
//               <div className="mmics-members-form-error">

//                 <AlertCircle
//                   size={15}
//                 />

//                 {error}

//               </div>
//             )}

//             {/* FORM */}

//             <form
//               className="mmics-members-form"
//               onSubmit={
//                 handleSubmit
//               }
//             >

//               {/* =========================================
//                   MEMBER INFORMATION
//               ========================================= */}

//               <div className="mmics-members-form-section">

//                 <div className="mmics-members-form-section-heading">
//                   <Users size={15} />
//                   Member Information
//                 </div>

//                 <div className="mmics-members-form-grid">

//                   <div className="mmics-members-field">

//                     <label>
//                       Full Name
//                       <span>*</span>
//                     </label>

//                     <input
//                       type="text"
//                       name="name"
//                       value={
//                         formData.name
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="Enter full name"
//                     />

//                   </div>

//                   <div className="mmics-members-field">

//                     <label>
//                       Membership Number
//                       <span>*</span>
//                     </label>

//                     <input
//                       type="text"
//                       name="membershipNumber"
//                       value={
//                         formData.membershipNumber
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="MMICS-001"
//                     />

//                   </div>

//                 </div>

//               </div>

//               {/* =========================================
//                   PROFILE PHOTO
//               ========================================= */}

//               <div className="mmics-members-form-section">

//                 <div className="mmics-members-form-section-heading">
//                   <ImagePlus size={15} />
//                   Profile Photo
//                 </div>

//                 <div className="mmics-members-photo-field">

//                   {/* PREVIEW */}

//                   <div className="mmics-members-photo-preview">

//                     {imagePreview ? (
//                       <img
//                         src={
//                           imagePreview
//                         }
//                         alt="Profile preview"
//                       />
//                     ) : (
//                       <div className="mmics-members-photo-placeholder">

//                         <Camera
//                           size={22}
//                         />

//                         <span>
//                           No Photo
//                         </span>

//                       </div>
//                     )}

//                   </div>

//                   {/* UPLOAD */}

//                   <div className="mmics-members-photo-input">

//                     <label>
//                       Member Photo
//                     </label>

//                     {/* ---------------------------------
//                         REAL FILE INPUT
//                     --------------------------------- */}

//                     <input
//                       ref={
//                         fileInputRef
//                       }
//                       id="member-profile-image"
//                       type="file"
//                       accept="image/jpeg,image/jpg,image/png,image/webp"
//                       onChange={
//                         handleProfileImageChange
//                       }
//                       style={{
//                         display:
//                           "none",
//                       }}
//                     />

//                     <div className="mmics-members-photo-actions">

//                       {/* ---------------------------------
//                           UPLOAD BUTTON
//                       --------------------------------- */}

//                       <button
//                         type="button"
//                         className="mmics-members-upload-button"
//                         onClick={
//                           handleUploadClick
//                         }
//                       >
//                         <Upload
//                           size={15}
//                         />

//                         {profileImageFile
//                           ? "Change Photo"
//                           : "Upload Photo"}
//                       </button>

//                       {/* ---------------------------------
//                           REMOVE BUTTON
//                       --------------------------------- */}

//                       {imagePreview && (
//                         <button
//                           type="button"
//                           className="mmics-members-remove-photo"
//                           onClick={
//                             handleRemoveProfileImage
//                           }
//                         >
//                           <X
//                             size={14}
//                           />

//                           Remove
//                         </button>
//                       )}

//                     </div>

//                     <small>
//                       JPG, PNG or WebP ·
//                       Maximum 5MB
//                     </small>

//                   </div>

//                 </div>

//               </div>

//               {/* =========================================
//                   COMMUNITY ROLE
//               ========================================= */}

//               <div className="mmics-members-form-section">

//                 <div className="mmics-members-form-section-heading">

//                   <ShieldCheck
//                     size={15}
//                   />

//                   Community Role

//                 </div>

//                 <div className="mmics-members-form-grid">

//                   <div className="mmics-members-field">

//                     <label>
//                       Designation
//                     </label>

//                     <div className="mmics-members-designation-input">

//                       <BriefcaseBusiness
//                         size={14}
//                       />

//                       <input
//                         list="mmics-designations"
//                         type="text"
//                         name="designation"
//                         value={
//                           formData.designation
//                         }
//                         onChange={
//                           handleChange
//                         }
//                         placeholder="Chairman / President / Member"
//                       />

//                       <datalist id="mmics-designations">

//                         {designationOptions.map(
//                           (
//                             designation
//                           ) => (
//                             <option
//                               key={
//                                 designation
//                               }
//                               value={
//                                 designation
//                               }
//                             />
//                           )
//                         )}

//                       </datalist>

//                     </div>

//                   </div>

//                   <div className="mmics-members-field">

//                     <label>
//                       Display Order
//                     </label>

//                     <div className="mmics-members-designation-input">

//                       <ArrowUpDown
//                         size={14}
//                       />

//                       <input
//                         type="number"
//                         min="0"
//                         name="designationOrder"
//                         value={
//                           formData.designationOrder
//                         }
//                         onChange={
//                           handleChange
//                         }
//                         placeholder="0"
//                       />

//                     </div>

//                     <small>
//                       Lower number appears
//                       first in the community
//                       hierarchy.
//                     </small>

//                   </div>

//                 </div>

//               </div>

//               {/* =========================================
//                   CONTACT INFORMATION
//               ========================================= */}

//               <div className="mmics-members-form-section">

//                 <div className="mmics-members-form-section-heading">

//                   <Phone size={15} />

//                   Contact Information

//                 </div>

//                 <div className="mmics-members-form-grid">

//                   <div className="mmics-members-field">

//                     <label>
//                       Email
//                       <span>*</span>
//                     </label>

//                     <input
//                       type="email"
//                       name="email"
//                       value={
//                         formData.email
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="member@example.com"
//                     />

//                   </div>

//                   <div className="mmics-members-field">

//                     <label>
//                       Phone
//                       <span>*</span>
//                     </label>

//                     <input
//                       type="tel"
//                       name="phone"
//                       value={
//                         formData.phone
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="+91 98765 43210"
//                     />

//                   </div>

//                   <div className="mmics-members-field full">

//                     <label>
//                       Address
//                     </label>

//                     <textarea
//                       name="address"
//                       value={
//                         formData.address
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="Enter member address"
//                       rows={3}
//                     />

//                   </div>

//                 </div>

//               </div>

//               {/* =========================================
//                   ACCOUNT ACCESS
//               ========================================= */}

//               <div className="mmics-members-form-section">

//                 <div className="mmics-members-form-section-heading">

//                   <LockKeyhole
//                     size={15}
//                   />

//                   Account Access

//                 </div>

//                 <div className="mmics-members-form-grid">

//                   <div className="mmics-members-field full">

//                     <label>
//                       Password
//                       {!editingMember && (
//                         <span>*</span>
//                       )}
//                     </label>

//                     <input
//                       type="password"
//                       name="password"
//                       value={
//                         formData.password
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder={
//                         editingMember
//                           ? "Leave blank to keep current password"
//                           : "Enter login password"
//                       }
//                     />

//                     {editingMember && (
//                       <small>
//                         Only enter a password
//                         if you want to change
//                         the member's login
//                         password.
//                       </small>
//                     )}

//                   </div>

//                 </div>

//               </div>

//               {/* =========================================
//                   FORM FOOTER
//               ========================================= */}

//               <div className="mmics-members-form-footer">

//                 <button
//                   type="button"
//                   className="secondary"
//                   onClick={
//                     closeModal
//                   }
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="primary"
//                   disabled={saving}
//                 >
//                   {saving ? (
//                     <>
//                       <RefreshCw
//                         size={14}
//                         className="mmics-members-spin"
//                       />

//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle2
//                         size={14}
//                       />

//                       {editingMember
//                         ? "Update Member"
//                         : "Create Member"}
//                     </>
//                   )}
//                 </button>

//               </div>

//             </form>

//           </div>

//         </div>
//       )}

//       {/* =================================================
//           VIEW MODAL
//       ================================================= */}

//       {isViewModalOpen &&
//         viewingMember && (
//           <div
//             className="mmics-members-modal-backdrop"
//             onMouseDown={(
//               event
//             ) => {
//               if (
//                 event.target ===
//                 event.currentTarget
//               ) {
//                 setIsViewModalOpen(
//                   false
//                 );
//               }
//             }}
//           >

//             <div className="mmics-members-view-modal">

//               <div className="mmics-members-view-header">

//                 <span className="mmics-members-view-label">
//                   MEMBER PROFILE
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setIsViewModalOpen(
//                       false
//                     )
//                   }
//                 >
//                   <X size={17} />
//                 </button>

//               </div>

//               {/* PROFILE */}

//               <div className="mmics-members-profile">

//                 <div className="mmics-members-profile-avatar">

//                   {viewingMember.profileImage ? (
//                     <img
//                       className="mmics-members-profile-photo"
//                       src={getImageUrl(
//                         viewingMember.profileImage
//                       )}
//                       alt={
//                         viewingMember.name
//                       }
//                     />
//                   ) : (
//                     <div className="mmics-members-profile-fallback">
//                       {getInitials(
//                         viewingMember.name
//                       )}
//                     </div>
//                   )}

//                 </div>

//                 <h2>
//                   {
//                     viewingMember.name
//                   }
//                 </h2>

//                 <p>
//                   {
//                     viewingMember.membershipNumber
//                   }
//                 </p>

//                 <div className="mmics-members-profile-designation">

//                   <BriefcaseBusiness
//                     size={13}
//                   />

//                   <strong>
//                     {
//                       viewingMember.designation ||
//                       "Member"
//                     }
//                   </strong>

//                   <span>
//                     · Order{" "}
//                     {
//                       viewingMember.designationOrder ??
//                       0
//                     }
//                   </span>

//                 </div>

//                 <span
//                   className={`mmics-member-status ${
//                     viewingMember.status ===
//                     "ACTIVE"
//                       ? "active"
//                       : "inactive"
//                   }`}
//                 >
//                   <span />

//                   {viewingMember.status ===
//                   "ACTIVE"
//                     ? "Active Member"
//                     : "Inactive Member"}
//                 </span>

//               </div>

//               {/* DETAILS */}

//               <div className="mmics-members-detail-grid">

//                 <div>

//                   <span>
//                     <Mail size={12} />
//                     Email
//                   </span>

//                   <strong>
//                     {
//                       viewingMember.email ||
//                       "-"
//                     }
//                   </strong>

//                 </div>

//                 <div>

//                   <span>
//                     <Phone
//                       size={12}
//                     />
//                     Phone
//                   </span>

//                   <strong>
//                     {
//                       viewingMember.phone ||
//                       "-"
//                     }
//                   </strong>

//                 </div>

//                 <div>

//                   <span>
//                     <Hash size={12} />
//                     Membership Number
//                   </span>

//                   <strong>
//                     {
//                       viewingMember.membershipNumber
//                     }
//                   </strong>

//                 </div>

//                 <div>

//                   <span>
//                     <CalendarDays
//                       size={12}
//                     />
//                     Joined
//                   </span>

//                   <strong>
//                     {formatDate(
//                       viewingMember.createdAt
//                     )}
//                   </strong>

//                 </div>

//                 <div className="full">

//                   <span>
//                     <MapPin size={12} />
//                     Address
//                   </span>

//                   <strong>
//                     {
//                       viewingMember.address ||
//                       "No address added"
//                     }
//                   </strong>

//                 </div>

//               </div>

//               {/* FOOTER */}

//               <div className="mmics-members-view-footer">

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setIsViewModalOpen(
//                       false
//                     )
//                   }
//                 >
//                   Close
//                 </button>

//                 <button
//                   type="button"
//                   className="primary"
//                   onClick={() => {
//                     setIsViewModalOpen(
//                       false
//                     );

//                     handleEditMember(
//                       viewingMember
//                     );
//                   }}
//                 >
//                   <Pencil size={14} />

//                   Edit Member
//                 </button>

//               </div>

//             </div>

//           </div>
//         )}

//       {/* =================================================
//           DELETE MODAL
//       ================================================= */}

//       {isDeleteModalOpen &&
//         deletingMember && (
//           <div
//             className="mmics-members-modal-backdrop"
//             onMouseDown={(
//               event
//             ) => {
//               if (
//                 event.target ===
//                   event.currentTarget &&
//                 !deleting
//               ) {
//                 setIsDeleteModalOpen(
//                   false
//                 );
//               }
//             }}
//           >

//             <div className="mmics-members-delete-modal">

//               <div className="mmics-members-delete-icon">

//                 <Trash2 size={22} />

//               </div>

//               <h2>
//                 Delete Member?
//               </h2>

//               <p>
//                 Are you sure you want
//                 to delete{" "}
//                 <strong>
//                   {
//                     deletingMember.name
//                   }
//                 </strong>
//                 ? This action cannot
//                 be undone.
//               </p>

//               <div className="mmics-members-delete-actions">

//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (!deleting) {
//                       setIsDeleteModalOpen(
//                         false
//                       );
//                     }
//                   }}
//                   disabled={deleting}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="button"
//                   className="danger"
//                   onClick={
//                     handleDeleteConfirm
//                   }
//                   disabled={deleting}
//                 >
//                   {deleting ? (
//                     <>
//                       <RefreshCw
//                         size={14}
//                         className="mmics-members-spin"
//                       />

//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2
//                         size={14}
//                       />

//                       Delete Member
//                     </>
//                   )}
//                 </button>

//               </div>

//             </div>

//           </div>
//         )}

//     </div>
//   );
// };

// export default Members;


import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  Plus,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  BriefcaseBusiness,
  ImagePlus,
  X,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Hash,
  LockKeyhole,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  Upload,
  Camera,
} from "lucide-react";

import memberService from "../../services/memberService";
import "./Members.css";

/* =========================================================
   API / SERVER URL
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const SERVER_URL = API_BASE_URL.replace(
  /\/api\/?$/,
  ""
);

/* =========================================================
   HELPERS
========================================================= */

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  return `${SERVER_URL}${
    imagePath.startsWith("/")
      ? ""
      : "/"
  }${imagePath}`;
};

const getInitials = (name = "") => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) =>
      word
        .charAt(0)
        .toUpperCase()
    )
    .join("");
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "-";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

/* =========================================================
   COMMUNITY DESIGNATIONS
========================================================= */

const designationOptions = [
  "Chairman",
  "President",
  "Vice President",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Executive Member",
  "Member",
];

/* =========================================================
   EMPTY FORM
========================================================= */

const emptyForm = {
  name: "",
  membershipNumber: "",
  email: "",
  phone: "",
  address: "",
  designation: "",
  designationOrder: 0,
  password: "",
};

/* =========================================================
   COMPONENT
========================================================= */

const Members = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [members, setMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL");

  const [
    designationFilter,
    setDesignationFilter,
  ] = useState("ALL");

  const [formData, setFormData] =
    useState(emptyForm);

  const [
    profileImageFile,
    setProfileImageFile,
  ] = useState(null);

  const [
    imagePreview,
    setImagePreview,
  ] = useState("");

  const [
    editingMember,
    setEditingMember,
  ] = useState(null);

  const [
    viewingMember,
    setViewingMember,
  ] = useState(null);

  const [
    deletingMember,
    setDeletingMember,
  ] = useState(null);

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    isViewModalOpen,
    setIsViewModalOpen,
  ] = useState(false);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  const [
    openMenuId,
    setOpenMenuId,
  ] = useState(null);

  const [alert, setAlert] =
    useState({
      type: "",
      message: "",
    });

  const [error, setError] =
    useState("");

  /* =======================================================
     FILE INPUT
  ======================================================= */

  const fileInputRef =
    useRef(null);

  /* =======================================================
     FETCH MEMBERS
  ======================================================= */

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * IMPORTANT:
       * Your service uses getAll()
       */
      const data =
        await memberService.getAll();

      setMembers(
        Array.isArray(data?.members)
          ? data.members
          : []
      );
    } catch (err) {
      console.error(
        "Fetch members error:",
        err
      );

      setError(
        err?.response?.data
          ?.message ||
          err?.message ||
          "Unable to fetch members"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL FETCH
  ======================================================= */

  useEffect(() => {
    fetchMembers();
  }, []);

  /* =======================================================
     ALERT AUTO CLOSE
  ======================================================= */

  useEffect(() => {
    if (!alert.message) {
      return;
    }

    const timer =
      setTimeout(() => {
        setAlert({
          type: "",
          message: "",
        });
      }, 3500);

    return () =>
      clearTimeout(timer);
  }, [alert]);

  /* =======================================================
     CLOSE DROPDOWN ON OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    const handleDocumentClick =
      () => {
        setOpenMenuId(null);
      };

    document.addEventListener(
      "click",
      handleDocumentClick
    );

    return () => {
      document.removeEventListener(
        "click",
        handleDocumentClick
      );
    };
  }, []);

  /* =======================================================
     FILTER MEMBERS
  ======================================================= */

  const filteredMembers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return members.filter(
        (member) => {
          const matchesSearch =
            !query ||
            member.name
              ?.toLowerCase()
              .includes(query) ||
            member.email
              ?.toLowerCase()
              .includes(query) ||
            member.phone
              ?.toLowerCase()
              .includes(query) ||
            member.membershipNumber
              ?.toLowerCase()
              .includes(query) ||
            member.designation
              ?.toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            member.status ===
              statusFilter;

          const matchesDesignation =
            designationFilter ===
              "ALL" ||
            member.designation ===
              designationFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesDesignation
          );
        }
      );
    }, [
      members,
      search,
      statusFilter,
      designationFilter,
    ]);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const totalMembers =
    members.length;

  const activeMembers =
    members.filter(
      (member) =>
        member.status ===
        "ACTIVE"
    ).length;

  const inactiveMembers =
    members.filter(
      (member) =>
        member.status ===
        "INACTIVE"
    ).length;

  const leadershipMembers =
    members.filter(
      (member) =>
        member.designation &&
        member.designation !==
          "Member"
    ).length;

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    if (
      imagePreview &&
      imagePreview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setFormData({
      ...emptyForm,
    });

    setProfileImageFile(null);

    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  /* =======================================================
     ADD MEMBER
  ======================================================= */

  const handleAddMember = () => {
    setEditingMember(null);

    resetForm();

    setError("");

    setIsModalOpen(true);
  };

  /* =======================================================
     EDIT MEMBER
  ======================================================= */

  const handleEditMember = (
    member
  ) => {
    setEditingMember(member);

    setFormData({
      name: member.name || "",
      membershipNumber:
        member.membershipNumber ||
        "",
      email: member.email || "",
      phone: member.phone || "",
      address:
        member.address || "",
      designation:
        member.designation || "",
      designationOrder:
        member.designationOrder ??
        0,
      password: "",
    });

    setProfileImageFile(null);

    setImagePreview(
      member.profileImage
        ? getImageUrl(
            member.profileImage
          )
        : ""
    );

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }

    setError("");

    setOpenMenuId(null);

    setIsModalOpen(true);
  };

  /* =======================================================
     VIEW MEMBER
  ======================================================= */

  const handleViewMember = (
    member
  ) => {
    setViewingMember(member);

    setOpenMenuId(null);

    setIsViewModalOpen(true);
  };

  /* =======================================================
     CLOSE FORM
  ======================================================= */

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);

    setEditingMember(null);

    resetForm();

    setError("");
  };

  /* =======================================================
     FORM INPUT CHANGE
  ======================================================= */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /* =======================================================
     OPEN LOCAL FILE EXPLORER
  ======================================================= */

  const handleUploadClick = () => {
    if (!fileInputRef.current) {
      console.warn(
        "Profile image input not found"
      );

      return;
    }

    fileInputRef.current.click();
  };

  /* =======================================================
     PROFILE IMAGE CHANGE
  ======================================================= */

  const handleProfileImageChange =
    (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      /* FILE TYPE */

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        setError(
          "Please upload JPG, JPEG, PNG or WebP image"
        );

        event.target.value = "";

        return;
      }

      /* FILE SIZE */

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        setError(
          "Profile photo must be less than 5MB"
        );

        event.target.value = "";

        return;
      }

      setError("");

      /* CLEAN OLD BLOB */

      if (
        imagePreview &&
        imagePreview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          imagePreview
        );
      }

      /* CREATE NEW PREVIEW */

      const previewUrl =
        URL.createObjectURL(file);

      setProfileImageFile(file);

      setImagePreview(
        previewUrl
      );
    };

  /* =======================================================
     REMOVE PROFILE IMAGE
  ======================================================= */

  const handleRemoveProfileImage =
    () => {
      if (
        imagePreview &&
        imagePreview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          imagePreview
        );
      }

      setProfileImageFile(null);

      setImagePreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }
    };

  /* =======================================================
     SUBMIT MEMBER
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);

      setError("");

      /* VALIDATION */

      if (!formData.name.trim()) {
        setError(
          "Name is required"
        );

        return;
      }

      if (
        !formData.membershipNumber.trim()
      ) {
        setError(
          "Membership number is required"
        );

        return;
      }

      if (!formData.email.trim()) {
        setError(
          "Email is required"
        );

        return;
      }

      if (!formData.phone.trim()) {
        setError(
          "Phone number is required"
        );

        return;
      }

      if (
        !editingMember &&
        !formData.password.trim()
      ) {
        setError(
          "Password is required for new member"
        );

        return;
      }

      /* =================================================
         FORM DATA
      ================================================= */

      const data =
        new FormData();

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "membershipNumber",
        formData.membershipNumber.trim()
      );

      data.append(
        "email",
        formData.email.trim()
      );

      data.append(
        "phone",
        formData.phone.trim()
      );

      data.append(
        "address",
        formData.address.trim()
      );

      data.append(
        "designation",
        formData.designation.trim()
      );

      data.append(
        "designationOrder",
        String(
          formData.designationOrder ||
            0
        )
      );

      /* PASSWORD */

      if (
        formData.password.trim()
      ) {
        data.append(
          "password",
          formData.password.trim()
        );
      }

      /* ACTUAL IMAGE FILE */

      if (profileImageFile) {
        data.append(
          "profileImage",
          profileImageFile
        );
      }

      /* =================================================
         CREATE
      ================================================= */

      if (!editingMember) {
        await memberService.create(
          data
        );

        setAlert({
          type: "success",
          message:
            "Member created successfully",
        });
      }

      /* =================================================
         UPDATE
      ================================================= */

      else {
        await memberService.update(
          editingMember.id,
          data
        );

        setAlert({
          type: "success",
          message:
            "Member updated successfully",
        });
      }

      /* REFRESH */

      await fetchMembers();

      /* CLOSE */

      setIsModalOpen(false);

      setEditingMember(null);

      resetForm();
    } catch (err) {
      console.error(
        "Save member error:",
        err
      );

      setError(
        err?.response?.data
          ?.message ||
          err?.message ||
          "Unable to save member"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     STATUS TOGGLE
  ======================================================= */

  const handleStatusChange =
    async (member) => {
      try {
        setOpenMenuId(null);

        const newStatus =
          member.status ===
          "ACTIVE"
            ? "INACTIVE"
            : "ACTIVE";

        /*
         * IMPORTANT:
         * Your service expects:
         * updateStatus(id, status)
         */

        await memberService.updateStatus(
          member.id,
          newStatus
        );

        setAlert({
          type: "success",
          message: `Member ${
            newStatus === "ACTIVE"
              ? "activated"
              : "deactivated"
          } successfully`,
        });

        await fetchMembers();
      } catch (err) {
        console.error(
          "Status update error:",
          err
        );

        setAlert({
          type: "error",
          message:
            err?.response?.data
              ?.message ||
            err?.message ||
            "Unable to change member status",
        });
      }
    };

  /* =======================================================
     DELETE CLICK
  ======================================================= */

  const handleDeleteClick = (
    member
  ) => {
    setDeletingMember(member);

    setOpenMenuId(null);

    setIsDeleteModalOpen(true);
  };

  /* =======================================================
     DELETE CONFIRM
  ======================================================= */

  const handleDeleteConfirm =
    async () => {
      if (!deletingMember) {
        return;
      }

      try {
        setDeleting(true);

        /*
         * IMPORTANT:
         * Your service uses remove()
         */

        await memberService.remove(
          deletingMember.id
        );

        setAlert({
          type: "success",
          message:
            "Member deleted successfully",
        });

        setIsDeleteModalOpen(
          false
        );

        setDeletingMember(null);

        await fetchMembers();
      } catch (err) {
        console.error(
          "Delete member error:",
          err
        );

        setAlert({
          type: "error",
          message:
            err?.response?.data
              ?.message ||
            err?.message ||
            "Unable to delete member",
        });
      } finally {
        setDeleting(false);
      }
    };

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");

    setStatusFilter("ALL");

    setDesignationFilter("ALL");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="mmics-members-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mmics-members-header">

        <div>

          <div className="mmics-members-eyebrow">
            Community Management
          </div>

          <h1>
            Members
          </h1>

          <p>
            Manage MMICS members,
            leadership roles and
            community records.
          </p>

        </div>

        <div className="mmics-members-header-actions">

          <button
            type="button"
            className="mmics-members-refresh"
            onClick={fetchMembers}
            disabled={loading}
          >
            <RefreshCw
              size={15}
              className={
                loading
                  ? "mmics-members-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            className="mmics-members-add-button"
            onClick={
              handleAddMember
            }
          >
            <Plus size={16} />

            Add Member
          </button>

        </div>

      </div>

      {/* =================================================
          ALERT
      ================================================= */}

      {alert.message && (
        <div
          className={`mmics-members-alert ${alert.type}`}
        >
          {alert.type ===
          "success" ? (
            <CheckCircle2
              size={16}
            />
          ) : (
            <AlertCircle
              size={16}
            />
          )}

          <span>
            {alert.message}
          </span>

          <button
            type="button"
            onClick={() =>
              setAlert({
                type: "",
                message: "",
              })
            }
          >
            <X size={15} />
          </button>

        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <div className="mmics-members-stats">

        <div className="mmics-members-stat-card">

          <div className="mmics-members-stat-icon">
            <Users size={19} />
          </div>

          <div>
            <span>
              Total Members
            </span>

            <strong>
              {totalMembers}
            </strong>
          </div>

        </div>

        <div className="mmics-members-stat-card">

          <div className="mmics-members-stat-icon active">
            <UserCheck
              size={19}
            />
          </div>

          <div>
            <span>
              Active
            </span>

            <strong>
              {activeMembers}
            </strong>
          </div>

        </div>

        <div className="mmics-members-stat-card">

          <div className="mmics-members-stat-icon leadership">
            <ShieldCheck
              size={19}
            />
          </div>

          <div>
            <span>
              Leadership
            </span>

            <strong>
              {leadershipMembers}
            </strong>
          </div>

        </div>

        <div className="mmics-members-stat-card">

          <div className="mmics-members-stat-icon inactive">
            <UserX size={19} />
          </div>

          <div>
            <span>
              Inactive
            </span>

            <strong>
              {inactiveMembers}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="mmics-members-toolbar">

        <div className="mmics-members-search">

          <Search size={16} />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search name, membership no., phone, email or designation..."
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
            >
              <X size={13} />
            </button>
          )}

        </div>

        <select
          className="mmics-members-filter"
          value={
            designationFilter
          }
          onChange={(event) =>
            setDesignationFilter(
              event.target.value
            )
          }
        >
          <option value="ALL">
            All Designations
          </option>

          {designationOptions.map(
            (designation) => (
              <option
                key={designation}
                value={designation}
              >
                {designation}
              </option>
            )
          )}

        </select>

        <select
          className="mmics-members-status-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >
          <option value="ALL">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>

        </select>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="mmics-members-table-card">

        <div className="mmics-members-table-header">

          <div>

            <h2>
              Community Directory
            </h2>

            <span>
              Showing{" "}
              {
                filteredMembers.length
              }{" "}
              of{" "}
              {members.length}{" "}
              members
            </span>

          </div>

          {(search ||
            statusFilter !==
              "ALL" ||
            designationFilter !==
              "ALL") && (
            <button
              type="button"
              className="mmics-members-clear-filters"
              onClick={
                clearFilters
              }
            >
              Clear filters
            </button>
          )}

        </div>

        {/* LOADING */}

        {loading ? (
          <div className="mmics-members-loading">

            <RefreshCw
              size={21}
              className="mmics-members-spin"
            />

            Loading members...

          </div>
        ) : filteredMembers.length ===
          0 ? (

          /* EMPTY */

          <div className="mmics-members-empty">

            <div className="mmics-members-empty-icon">
              <Users size={26} />
            </div>

            <h3>
              No members found
            </h3>

            <p>
              {search ||
              statusFilter !==
                "ALL" ||
              designationFilter !==
                "ALL"
                ? "Try changing your search or filters."
                : "Start building your MMICS community directory by adding the first member."}
            </p>

            {!search &&
              statusFilter ===
                "ALL" &&
              designationFilter ===
                "ALL" && (
                <button
                  type="button"
                  onClick={
                    handleAddMember
                  }
                >
                  <Plus size={14} />
                  Add Member
                </button>
              )}

          </div>

        ) : (

          /* TABLE */

          <div className="mmics-members-table-wrapper">

            <table className="mmics-members-table">

              <thead>

                <tr>

                  <th>
                    MEMBER
                  </th>

                  <th>
                    DESIGNATION
                  </th>

                  <th>
                    MEMBERSHIP
                  </th>

                  <th>
                    CONTACT
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    JOINED
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredMembers.map(
                  (member) => (
                    <tr
                      key={
                        member.id
                      }
                    >

                      {/* MEMBER */}

                      <td>

                        <div className="mmics-member-identity">

                          <div
                            className={`mmics-member-avatar ${
                              member.profileImage
                                ? "mmics-member-photo"
                                : "mmics-member-avatar-fallback"
                            }`}
                          >

                            {member.profileImage ? (
                              <img
                                src={getImageUrl(
                                  member.profileImage
                                )}
                                alt={
                                  member.name
                                }
                              />
                            ) : (
                              getInitials(
                                member.name
                              )
                            )}

                          </div>

                          <div>

                            <strong>
                              {
                                member.name
                              }
                            </strong>

                            <span>
                              {
                                member.email ||
                                "-"
                              }
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* DESIGNATION */}

                      <td>

                        <div className="mmics-member-designation">

                          <BriefcaseBusiness
                            size={14}
                          />

                          <div>

                            <strong>
                              {
                                member.designation ||
                                "Member"
                              }
                            </strong>

                            <span>
                              Order{" "}
                              {
                                member.designationOrder ??
                                0
                              }
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* MEMBERSHIP */}

                      <td>

                        <span className="mmics-membership-number">

                          <Hash
                            size={12}
                          />

                          {
                            member.membershipNumber ||
                            "-"
                          }

                        </span>

                      </td>

                      {/* CONTACT */}

                      <td>

                        <div className="mmics-member-contact">

                          <span>
                            <Phone
                              size={12}
                            />

                            {
                              member.phone ||
                              "-"
                            }
                          </span>

                          <span>
                            <Mail
                              size={12}
                            />

                            {
                              member.email ||
                              "-"
                            }
                          </span>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`mmics-member-status ${
                            member.status ===
                            "ACTIVE"
                              ? "active"
                              : "inactive"
                          }`}
                        >

                          <span />

                          {member.status ===
                          "ACTIVE"
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>

                      {/* DATE */}

                      <td>

                        <span className="mmics-member-date">

                          <CalendarDays
                            size={12}
                          />

                          {formatDate(
                            member.createdAt
                          )}

                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div
                          className="mmics-member-actions"
                          onClick={(
                            event
                          ) =>
                            event.stopPropagation()
                          }
                        >

                          <button
                            type="button"
                            title="View"
                            onClick={() =>
                              handleViewMember(
                                member
                              )
                            }
                          >
                            <Eye
                              size={15}
                            />
                          </button>

                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              handleEditMember(
                                member
                              )
                            }
                          >
                            <Pencil
                              size={15}
                            />
                          </button>

                          <div className="mmics-member-more">

                            <button
                              type="button"
                              title="More"
                              onClick={(
                                event
                              ) => {
                                event.stopPropagation();

                                setOpenMenuId(
                                  openMenuId ===
                                    member.id
                                    ? null
                                    : member.id
                                );
                              }}
                            >
                              <MoreHorizontal
                                size={16}
                              />
                            </button>

                            {openMenuId ===
                              member.id && (
                              <div className="mmics-member-dropdown">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(
                                      member
                                    )
                                  }
                                >

                                  {member.status ===
                                  "ACTIVE" ? (
                                    <>
                                      <UserX
                                        size={
                                          14
                                        }
                                      />

                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck
                                        size={
                                          14
                                        }
                                      />

                                      Activate
                                    </>
                                  )}

                                </button>

                                <button
                                  type="button"
                                  className="delete"
                                  onClick={() =>
                                    handleDeleteClick(
                                      member
                                    )
                                  }
                                >
                                  <Trash2
                                    size={
                                      14
                                    }
                                  />

                                  Delete
                                </button>

                              </div>
                            )}

                          </div>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {isModalOpen && (
        <div
          className="mmics-members-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="mmics-members-modal">

            {/* HEADER */}

            <div className="mmics-members-modal-header">

              <div>

                <span>
                  {editingMember
                    ? "UPDATE MEMBER"
                    : "NEW MEMBER"}
                </span>

                <h2>
                  {editingMember
                    ? "Edit Member"
                    : "Add Member"}
                </h2>

                <p>
                  Add member details,
                  community role and
                  profile photo.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
              >
                <X size={17} />
              </button>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mmics-members-form-error">

                <AlertCircle
                  size={15}
                />

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* FORM */}

            <form
              className="mmics-members-form"
              onSubmit={
                handleSubmit
              }
            >

              {/* =================================================
                  MEMBER INFORMATION
              ================================================= */}

              <div className="mmics-members-form-section">

                <div className="mmics-members-form-section-heading">

                  <Users size={15} />

                  Member Information

                </div>

                <div className="mmics-members-form-grid">

                  <div className="mmics-members-field">

                    <label>
                      Full Name
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={
                        formData.name
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter full name"
                    />

                  </div>

                  <div className="mmics-members-field">

                    <label>
                      Membership Number
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="membershipNumber"
                      value={
                        formData.membershipNumber
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="MMICS-001"
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  PROFILE PHOTO
              ================================================= */}

              <div className="mmics-members-form-section">

                <div className="mmics-members-form-section-heading">

                  <ImagePlus size={15} />

                  Profile Photo

                </div>

                <div className="mmics-members-photo-field">

                  {/* PREVIEW */}

                  <div className="mmics-members-photo-preview">

                    {imagePreview ? (
                      <img
                        src={
                          imagePreview
                        }
                        alt="Profile preview"
                      />
                    ) : (
                      <div className="mmics-members-photo-placeholder">

                        <Camera
                          size={22}
                        />

                        <span>
                          No Photo
                        </span>

                      </div>
                    )}

                  </div>

                  {/* INPUT AREA */}

                  <div className="mmics-members-photo-input">

                    <label>
                      Member Photo
                    </label>

                    {/* =================================================
                        HIDDEN REAL FILE INPUT

                        IMPORTANT:
                        This must NOT be disabled.
                    ================================================= */}

                    <input
                      ref={
                        fileInputRef
                      }
                      id="member-profile-image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={
                        handleProfileImageChange
                      }
                      style={{
                        display:
                          "none",
                      }}
                    />

                    <div className="mmics-members-photo-actions">

                      {/* =================================================
                          UPLOAD BUTTON

                          DIRECTLY OPENS LOCAL FILE EXPLORER
                      ================================================= */}

                      <button
                        type="button"
                        className="mmics-members-upload-button"
                        onClick={
                          handleUploadClick
                        }
                      >
                        <Upload
                          size={15}
                        />

                        {profileImageFile
                          ? "Change Photo"
                          : "Upload Photo"}
                      </button>

                      {/* REMOVE */}

                      {imagePreview && (
                        <button
                          type="button"
                          className="mmics-members-remove-photo"
                          onClick={
                            handleRemoveProfileImage
                          }
                        >
                          <X
                            size={14}
                          />

                          Remove
                        </button>
                      )}

                    </div>

                    <small>
                      JPG, JPEG, PNG or
                      WebP · Maximum 5MB
                    </small>

                  </div>

                </div>

              </div>

              {/* =================================================
                  COMMUNITY ROLE
              ================================================= */}

              <div className="mmics-members-form-section">

                <div className="mmics-members-form-section-heading">

                  <ShieldCheck
                    size={15}
                  />

                  Community Role

                </div>

                <div className="mmics-members-form-grid">

                  {/* DESIGNATION */}

                  <div className="mmics-members-field">

                    <label>
                      Designation
                    </label>

                    <div className="mmics-members-designation-input">

                      <BriefcaseBusiness
                        size={14}
                      />

                      <input
                        list="mmics-designations"
                        type="text"
                        name="designation"
                        value={
                          formData.designation
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Chairman / President / Member"
                      />

                    </div>

                    <datalist id="mmics-designations">

                      {designationOptions.map(
                        (
                          designation
                        ) => (
                          <option
                            key={
                              designation
                            }
                            value={
                              designation
                            }
                          />
                        )
                      )}

                    </datalist>

                  </div>

                  {/* ORDER */}

                  <div className="mmics-members-field">

                    <label>
                      Display Order
                    </label>

                    <div className="mmics-members-designation-input">

                      <ArrowUpDown
                        size={14}
                      />

                      <input
                        type="number"
                        min="0"
                        name="designationOrder"
                        value={
                          formData.designationOrder
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="0"
                      />

                    </div>

                    <small>
                      Lower number appears
                      first in the community
                      hierarchy.
                    </small>

                  </div>

                </div>

              </div>

              {/* =================================================
                  CONTACT
              ================================================= */}

              <div className="mmics-members-form-section">

                <div className="mmics-members-form-section-heading">

                  <Phone size={15} />

                  Contact Information

                </div>

                <div className="mmics-members-form-grid">

                  <div className="mmics-members-field">

                    <label>
                      Email
                      <span>*</span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={
                        formData.email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="member@example.com"
                    />

                  </div>

                  <div className="mmics-members-field">

                    <label>
                      Phone
                      <span>*</span>
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="+91 98765 43210"
                    />

                  </div>

                  <div className="mmics-members-field full">

                    <label>
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={
                        formData.address
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter member address"
                      rows={3}
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  ACCOUNT
              ================================================= */}

              <div className="mmics-members-form-section">

                <div className="mmics-members-form-section-heading">

                  <LockKeyhole
                    size={15}
                  />

                  Account Access

                </div>

                <div className="mmics-members-form-grid">

                  <div className="mmics-members-field full">

                    <label>
                      Password
                      {!editingMember && (
                        <span>*</span>
                      )}
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={
                        formData.password
                      }
                      onChange={
                        handleChange
                      }
                      placeholder={
                        editingMember
                          ? "Leave blank to keep current password"
                          : "Enter login password"
                      }
                    />

                    {editingMember && (
                      <small>
                        Leave blank to keep
                        the existing
                        password.
                      </small>
                    )}

                  </div>

                </div>

              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

              <div className="mmics-members-form-footer">

                <button
                  type="button"
                  className="secondary"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={14}
                        className="mmics-members-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        size={14}
                      />

                      {editingMember
                        ? "Update Member"
                        : "Create Member"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          VIEW MEMBER MODAL
      ================================================= */}

      {isViewModalOpen &&
        viewingMember && (
          <div
            className="mmics-members-modal-backdrop"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setIsViewModalOpen(
                  false
                );
              }
            }}
          >

            <div className="mmics-members-view-modal">

              <div className="mmics-members-view-header">

                <span className="mmics-members-view-label">
                  MEMBER PROFILE
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setIsViewModalOpen(
                      false
                    )
                  }
                >
                  <X size={17} />
                </button>

              </div>

              {/* PROFILE */}

              <div className="mmics-members-profile">

                <div className="mmics-members-profile-avatar">

                  {viewingMember.profileImage ? (
                    <img
                      className="mmics-members-profile-photo"
                      src={getImageUrl(
                        viewingMember.profileImage
                      )}
                      alt={
                        viewingMember.name
                      }
                    />
                  ) : (
                    <div className="mmics-members-profile-fallback">
                      {getInitials(
                        viewingMember.name
                      )}
                    </div>
                  )}

                </div>

                <h2>
                  {
                    viewingMember.name
                  }
                </h2>

                <p>
                  {
                    viewingMember.membershipNumber
                  }
                </p>

                <div className="mmics-members-profile-designation">

                  <BriefcaseBusiness
                    size={13}
                  />

                  <strong>
                    {
                      viewingMember.designation ||
                      "Member"
                    }
                  </strong>

                  <span>
                    · Order{" "}
                    {
                      viewingMember.designationOrder ??
                      0
                    }
                  </span>

                </div>

                <span
                  className={`mmics-member-status ${
                    viewingMember.status ===
                    "ACTIVE"
                      ? "active"
                      : "inactive"
                  }`}
                >
                  <span />

                  {viewingMember.status ===
                  "ACTIVE"
                    ? "Active Member"
                    : "Inactive Member"}
                </span>

              </div>

              {/* DETAILS */}

              <div className="mmics-members-detail-grid">

                <div>

                  <span>
                    <Mail size={12} />
                    Email
                  </span>

                  <strong>
                    {
                      viewingMember.email ||
                      "-"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    <Phone size={12} />
                    Phone
                  </span>

                  <strong>
                    {
                      viewingMember.phone ||
                      "-"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    <Hash size={12} />
                    Membership Number
                  </span>

                  <strong>
                    {
                      viewingMember.membershipNumber ||
                      "-"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    <CalendarDays
                      size={12}
                    />
                    Joined
                  </span>

                  <strong>
                    {formatDate(
                      viewingMember.createdAt
                    )}
                  </strong>

                </div>

                <div className="full">

                  <span>
                    <MapPin size={12} />
                    Address
                  </span>

                  <strong>
                    {
                      viewingMember.address ||
                      "No address added"
                    }
                  </strong>

                </div>

              </div>

              {/* FOOTER */}

              <div className="mmics-members-view-footer">

                <button
                  type="button"
                  onClick={() =>
                    setIsViewModalOpen(
                      false
                    )
                  }
                >
                  Close
                </button>

                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    setIsViewModalOpen(
                      false
                    );

                    handleEditMember(
                      viewingMember
                    );
                  }}
                >
                  <Pencil size={14} />

                  Edit Member
                </button>

              </div>

            </div>

          </div>
        )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {isDeleteModalOpen &&
        deletingMember && (
          <div
            className="mmics-members-modal-backdrop"
            onMouseDown={(event) => {
              if (
                event.target ===
                  event.currentTarget &&
                !deleting
              ) {
                setIsDeleteModalOpen(
                  false
                );
              }
            }}
          >

            <div className="mmics-members-delete-modal">

              <div className="mmics-members-delete-icon">

                <Trash2 size={22} />

              </div>

              <h2>
                Delete Member?
              </h2>

              <p>
                Are you sure you want
                to delete{" "}
                <strong>
                  {
                    deletingMember.name
                  }
                </strong>
                ? This action cannot
                be undone.
              </p>

              <div className="mmics-members-delete-actions">

                <button
                  type="button"
                  onClick={() => {
                    if (!deleting) {
                      setIsDeleteModalOpen(
                        false
                      );

                      setDeletingMember(
                        null
                      );
                    }
                  }}
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={
                    handleDeleteConfirm
                  }
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <RefreshCw
                        size={14}
                        className="mmics-members-spin"
                      />

                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2
                        size={14}
                      />

                      Delete Member
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default Members;