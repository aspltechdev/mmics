
// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";

// import {
//   Plus,
//   Search,
//   Edit3,
//   Trash2,
//   Eye,
//   EyeOff,
//   Image as ImageIcon,
//   X,
//   Save,
//   Upload,
//   GripVertical,
//   CheckCircle2,
//   AlertCircle,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// import heroSlideService from "../../services/heroSlideService";
// import "./HeroSlides.css";

// /* =========================================================
//    INITIAL FORM
//    ========================================================= */

// const INITIAL_FORM = {
//   title: "",
//   subtitle: "",
//   description: "",
//   buttonText: "",
//   buttonUrl: "",
//   sortOrder: 0,
//   isActive: true,
// };

// const HeroSlides = () => {
//   /* =======================================================
//      STATE
//      ======================================================= */

//   const [slides, setSlides] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");

//   const [showModal, setShowModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] =
//     useState(false);

//   const [editingSlide, setEditingSlide] =
//     useState(null);

//   const [viewingSlide, setViewingSlide] =
//     useState(null);

//   const [deletingSlide, setDeletingSlide] =
//     useState(null);

//   const [form, setForm] = useState(INITIAL_FORM);

//   const [imageFile, setImageFile] =
//     useState(null);

//   const [imagePreview, setImagePreview] =
//     useState("");

//   const [existingImage, setExistingImage] =
//     useState("");

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const fileInputRef = useRef(null);

//   /* =======================================================
//      API URL
//      ======================================================= */

//   const apiBaseUrl =
//     import.meta.env.VITE_API_URL ||
//     "http://localhost:5000/api";

//   const serverBaseUrl =
//     apiBaseUrl.replace(/\/api\/?$/, "");

//   /* =======================================================
//      IMAGE URL
//      ======================================================= */

//   const getImageUrl = (image) => {
//     if (!image) return "";

//     if (
//       image.startsWith("http://") ||
//       image.startsWith("https://") ||
//       image.startsWith("data:")
//     ) {
//       return image;
//     }

//     return `${serverBaseUrl}${
//       image.startsWith("/") ? "" : "/"
//     }${image}`;
//   };

//   /* =======================================================
//      FETCH ADMIN HERO SLIDES
//      ======================================================= */

//   const fetchSlides = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       /*
//         IMPORTANT:
//         Admin page must use /admin/all,
//         not the public active-only endpoint.
//       */

//       const response =
//         await heroSlideService.getAllAdmin();

//       const data = Array.isArray(response)
//         ? response
//         : response?.slides ||
//           response?.data ||
//           [];

//       setSlides(data);
//     } catch (err) {
//       console.error(
//         "Failed to load hero slides:",
//         err
//       );

//       setError(
//         err?.response?.data?.message ||
//           "Unable to load hero slides. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSlides();
//   }, []);

//   /* =======================================================
//      FILTERED SLIDES
//      ======================================================= */

//   const filteredSlides = useMemo(() => {
//     const query = search
//       .trim()
//       .toLowerCase();

//     return [...slides]
//       .filter((slide) => {
//         if (statusFilter === "ALL") {
//           return true;
//         }

//         if (statusFilter === "ACTIVE") {
//           return slide.isActive === true;
//         }

//         if (statusFilter === "INACTIVE") {
//           return slide.isActive === false;
//         }

//         return true;
//       })
//       .filter((slide) => {
//         if (!query) return true;

//         return (
//           slide.title
//             ?.toLowerCase()
//             .includes(query) ||
//           slide.subtitle
//             ?.toLowerCase()
//             .includes(query) ||
//           slide.description
//             ?.toLowerCase()
//             .includes(query) ||
//           slide.buttonText
//             ?.toLowerCase()
//             .includes(query)
//         );
//       })
//       .sort(
//         (a, b) =>
//           Number(a.sortOrder || 0) -
//           Number(b.sortOrder || 0)
//       );
//   }, [
//     slides,
//     search,
//     statusFilter,
//   ]);

//   /* =======================================================
//      STATS
//      ======================================================= */

//   const activeCount = slides.filter(
//     (slide) => slide.isActive === true
//   ).length;

//   const inactiveCount = slides.filter(
//     (slide) => slide.isActive === false
//   ).length;

//   /* =======================================================
//      FORM RESET
//      ======================================================= */

//   const resetImageState = () => {
//     if (imagePreview) {
//       URL.revokeObjectURL(
//         imagePreview
//       );
//     }

//     setImageFile(null);
//     setImagePreview("");
//     setExistingImage("");

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const resetForm = () => {
//     resetImageState();

//     setForm(INITIAL_FORM);
//     setEditingSlide(null);
//   };

//   /* =======================================================
//      CREATE MODAL
//      ======================================================= */

//   const openCreateModal = () => {
//     resetForm();

//     setForm({
//       ...INITIAL_FORM,
//       sortOrder: slides.length,
//       isActive: true,
//     });

//     setError("");
//     setSuccess("");

//     setShowModal(true);
//   };

//   /* =======================================================
//      EDIT MODAL
//      ======================================================= */

//   const openEditModal = (slide) => {
//     resetImageState();

//     setEditingSlide(slide);

//     setForm({
//       title: slide.title || "",
//       subtitle: slide.subtitle || "",
//       description: slide.description || "",
//       buttonText: slide.buttonText || "",
//       buttonUrl: slide.buttonUrl || "",
//       sortOrder: slide.sortOrder ?? 0,
//       isActive:
//         slide.isActive !== false,
//     });

//     setExistingImage(
//       slide.imageUrl || ""
//     );

//     setError("");
//     setSuccess("");

//     setShowModal(true);
//   };

//   /* =======================================================
//      CLOSE MODAL
//      ======================================================= */

//   const closeModal = () => {
//     if (saving) return;

//     setShowModal(false);

//     resetForm();

//     setError("");
//     setSuccess("");
//   };

//   /* =======================================================
//      FORM CHANGE
//      ======================================================= */

//   const handleChange = (event) => {
//     const {
//       name,
//       value,
//       type,
//       checked,
//     } = event.target;

//     setForm((prev) => ({
//       ...prev,

//       [name]:
//         type === "checkbox"
//           ? checked
//           : name === "sortOrder"
//           ? Number(value)
//           : value,
//     }));
//   };

//   /* =======================================================
//      IMAGE UPLOAD
//      ======================================================= */

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageChange = (event) => {
//     const file =
//       event.target.files?.[0];

//     if (!file) return;

//     const allowedTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/webp",
//     ];

//     if (!allowedTypes.includes(file.type)) {
//       setError(
//         "Only JPG, JPEG, PNG and WEBP images are allowed."
//       );

//       event.target.value = "";
//       return;
//     }

//     if (
//       file.size >
//       5 * 1024 * 1024
//     ) {
//       setError(
//         "Image size must be less than 5MB."
//       );

//       event.target.value = "";
//       return;
//     }

//     setError("");

//     if (imagePreview) {
//       URL.revokeObjectURL(
//         imagePreview
//       );
//     }

//     setImageFile(file);

//     setImagePreview(
//       URL.createObjectURL(file)
//     );
//   };

//   const removeSelectedImage = () => {
//     if (imagePreview) {
//       URL.revokeObjectURL(
//         imagePreview
//       );
//     }

//     setImagePreview("");
//     setImageFile(null);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   /* =======================================================
//      SUBMIT
//      ======================================================= */

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setError("");
//     setSuccess("");

//     /* ---------------------------------------------
//        TITLE
//        --------------------------------------------- */

//     if (!form.title.trim()) {
//       setError(
//         "Hero slide title is required."
//       );
//       return;
//     }

//     /* ---------------------------------------------
//        IMAGE REQUIRED FOR NEW SLIDE
//        --------------------------------------------- */

//     if (
//       !editingSlide &&
//       !imageFile
//     ) {
//       setError(
//         "Please upload a hero image."
//       );
//       return;
//     }

//     try {
//       setSaving(true);

//       const payload = {
//         title: form.title.trim(),

//         subtitle:
//           form.subtitle.trim(),

//         description:
//           form.description.trim(),

//         buttonText:
//           form.buttonText.trim(),

//         buttonUrl:
//           form.buttonUrl.trim(),

//         sortOrder: Number(
//           form.sortOrder || 0
//         ),

//         isActive:
//           form.isActive === true,

//         /*
//           Image is sent as multipart
//           together with the slide.
//         */

//         image: imageFile,
//       };

//       if (editingSlide) {
//         await heroSlideService.update(
//           editingSlide.id,
//           payload
//         );

//         setSuccess(
//           "Hero slide updated successfully."
//         );
//       } else {
//         await heroSlideService.create(
//           payload
//         );

//         setSuccess(
//           "Hero slide created successfully."
//         );
//       }

//       await fetchSlides();

//       setTimeout(() => {
//         closeModal();
//       }, 700);
//     } catch (err) {
//       console.error(
//         "Hero slide save error:",
//         err
//       );

//       setError(
//         err?.response?.data?.message ||
//           "Unable to save hero slide. Please try again."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* =======================================================
//      STATUS
//      ======================================================= */

//   const handleStatusChange = async (
//     slide
//   ) => {
//     const nextStatus =
//       !slide.isActive;

//     try {
//       setError("");

//       await heroSlideService.updateStatus(
//         slide.id,
//         nextStatus
//       );

//       setSlides((prev) =>
//         prev.map((item) =>
//           item.id === slide.id
//             ? {
//                 ...item,
//                 isActive:
//                   nextStatus,
//               }
//             : item
//         )
//       );

//       setSuccess(
//         `Hero slide ${
//           nextStatus
//             ? "activated"
//             : "deactivated"
//         } successfully.`
//       );

//       setTimeout(() => {
//         setSuccess("");
//       }, 2500);
//     } catch (err) {
//       console.error(
//         "Status update error:",
//         err
//       );

//       setError(
//         err?.response?.data?.message ||
//           "Unable to update slide status."
//       );
//     }
//   };

//   /* =======================================================
//      VIEW
//      ======================================================= */

//   const openViewModal = (
//     slide
//   ) => {
//     setViewingSlide(slide);
//     setShowViewModal(true);
//   };

//   const closeViewModal = () => {
//     setShowViewModal(false);
//     setViewingSlide(null);
//   };

//   /* =======================================================
//      DELETE
//      ======================================================= */

//   const openDeleteModal = (
//     slide
//   ) => {
//     setDeletingSlide(slide);
//     setShowDeleteModal(true);
//   };

//   const closeDeleteModal = () => {
//     if (saving) return;

//     setShowDeleteModal(false);
//     setDeletingSlide(null);
//   };

//   const handleDelete = async () => {
//     if (!deletingSlide) return;

//     try {
//       setSaving(true);
//       setError("");

//       await heroSlideService.remove(
//         deletingSlide.id
//       );

//       setSlides((prev) =>
//         prev.filter(
//           (slide) =>
//             slide.id !==
//             deletingSlide.id
//         )
//       );

//       setShowDeleteModal(false);
//       setDeletingSlide(null);

//       setSuccess(
//         "Hero slide deleted successfully."
//       );

//       setTimeout(() => {
//         setSuccess("");
//       }, 2500);
//     } catch (err) {
//       console.error(
//         "Delete hero slide error:",
//         err
//       );

//       setError(
//         err?.response?.data?.message ||
//           "Unable to delete hero slide."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* =======================================================
//      ACTIVE SLIDES FOR PREVIEW
//      ======================================================= */

//   const activeSlides =
//     filteredSlides.filter(
//       (slide) =>
//         slide.isActive === true
//     );

//   const currentPreviewIndex =
//     viewingSlide
//       ? activeSlides.findIndex(
//           (slide) =>
//             slide.id ===
//             viewingSlide.id
//         )
//       : -1;

//   const showPreviousSlide = () => {
//     if (
//       activeSlides.length <= 1
//     ) {
//       return;
//     }

//     const previousIndex =
//       currentPreviewIndex <= 0
//         ? activeSlides.length - 1
//         : currentPreviewIndex - 1;

//     setViewingSlide(
//       activeSlides[previousIndex]
//     );
//   };

//   const showNextSlide = () => {
//     if (
//       activeSlides.length <= 1
//     ) {
//       return;
//     }

//     const nextIndex =
//       currentPreviewIndex >=
//       activeSlides.length - 1
//         ? 0
//         : currentPreviewIndex + 1;

//     setViewingSlide(
//       activeSlides[nextIndex]
//     );
//   };

//   /* =======================================================
//      ESCAPE KEY
//      ======================================================= */

//   useEffect(() => {
//     const handleKeyDown = (
//       event
//     ) => {
//       if (
//         event.key === "Escape"
//       ) {
//         if (showModal && !saving) {
//           closeModal();
//         }

//         if (showViewModal) {
//           closeViewModal();
//         }

//         if (
//           showDeleteModal &&
//           !saving
//         ) {
//           closeDeleteModal();
//         }
//       }
//     };

//     window.addEventListener(
//       "keydown",
//       handleKeyDown
//     );

//     return () => {
//       window.removeEventListener(
//         "keydown",
//         handleKeyDown
//       );
//     };
//   }, [
//     showModal,
//     showViewModal,
//     showDeleteModal,
//     saving,
//   ]);

//   /* =======================================================
//      RENDER
//      ======================================================= */

//   return (
//     <div className="mmics-hero-page">

//       {/* ===================================================
//           HEADER
//       =================================================== */}

//       <div className="mmics-hero-header">

//         <div>
//           <div className="mmics-hero-breadcrumb">
//             Admin
//             <span>/</span>
//             Hero Slides
//           </div>

//           <h1>
//             Hero Slides
//           </h1>

//           <p>
//             Manage the main promotional
//             banners displayed across the
//             MMICS website.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="mmics-hero-primary-button"
//           onClick={
//             openCreateModal
//           }
//         >
//           <Plus size={18} />

//           Add Hero Slide
//         </button>

//       </div>

//       {/* ===================================================
//           ALERTS
//       =================================================== */}

//       {error && (
//         <div className="mmics-hero-alert mmics-hero-alert-error">

//           <AlertCircle size={18} />

//           <span>
//             {error}
//           </span>

//           <button
//             type="button"
//             onClick={() =>
//               setError("")
//             }
//           >
//             <X size={16} />
//           </button>

//         </div>
//       )}

//       {success && (
//         <div className="mmics-hero-alert mmics-hero-alert-success">

//           <CheckCircle2 size={18} />

//           <span>
//             {success}
//           </span>

//         </div>
//       )}

//       {/* ===================================================
//           STATS
//       =================================================== */}

//       <div className="mmics-hero-stats">

//         <div className="mmics-hero-stat-card">

//           <div className="mmics-hero-stat-icon">
//             <ImageIcon size={20} />
//           </div>

//           <div>
//             <span>
//               Total Slides
//             </span>

//             <strong>
//               {slides.length}
//             </strong>
//           </div>

//         </div>

//         <div className="mmics-hero-stat-card">

//           <div className="mmics-hero-stat-icon active">
//             <Eye size={20} />
//           </div>

//           <div>
//             <span>
//               Active
//             </span>

//             <strong>
//               {activeCount}
//             </strong>
//           </div>

//         </div>

//         <div className="mmics-hero-stat-card">

//           <div className="mmics-hero-stat-icon inactive">
//             <EyeOff size={20} />
//           </div>

//           <div>
//             <span>
//               Inactive
//             </span>

//             <strong>
//               {inactiveCount}
//             </strong>
//           </div>

//         </div>

//         <div className="mmics-hero-stat-card">

//           <div className="mmics-hero-stat-icon">
//             <GripVertical size={20} />
//           </div>

//           <div>
//             <span>
//               Displayed
//             </span>

//             <strong>
//               {activeCount}
//             </strong>
//           </div>

//         </div>

//       </div>

//       {/* ===================================================
//           TOOLBAR
//       =================================================== */}

//       <div className="mmics-hero-toolbar">

//         <div className="mmics-hero-search">

//           <Search size={18} />

//           <input
//             type="text"
//             placeholder="Search hero slides..."
//             value={search}
//             onChange={(event) =>
//               setSearch(
//                 event.target.value
//               )
//             }
//           />

//           {search && (
//             <button
//               type="button"
//               onClick={() =>
//                 setSearch("")
//               }
//             >
//               <X size={15} />
//             </button>
//           )}

//         </div>

//         <div className="mmics-hero-filters">

//           <button
//             type="button"
//             className={
//               statusFilter ===
//               "ALL"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setStatusFilter(
//                 "ALL"
//               )
//             }
//           >
//             All
//           </button>

//           <button
//             type="button"
//             className={
//               statusFilter ===
//               "ACTIVE"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setStatusFilter(
//                 "ACTIVE"
//               )
//             }
//           >
//             Active
//           </button>

//           <button
//             type="button"
//             className={
//               statusFilter ===
//               "INACTIVE"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setStatusFilter(
//                 "INACTIVE"
//               )
//             }
//           >
//             Inactive
//           </button>

//         </div>

//       </div>

//       {/* ===================================================
//           TABLE CONTENT
//       =================================================== */}

//       <div className="mmics-hero-content">

//         {loading ? (
//           <div className="mmics-hero-loading">

//             <div className="mmics-hero-spinner" />

//             <p>
//               Loading hero slides...
//             </p>

//           </div>
//         ) : filteredSlides.length ===
//           0 ? (
//           <div className="mmics-hero-empty">

//             <div className="mmics-hero-empty-icon">
//               <ImageIcon size={30} />
//             </div>

//             <h3>
//               No hero slides found
//             </h3>

//             <p>
//               {search ||
//               statusFilter !==
//                 "ALL"
//                 ? "Try changing your search or filter."
//                 : "Create your first hero slide to get started."}
//             </p>

//             {!search &&
//               statusFilter ===
//                 "ALL" && (
//                 <button
//                   type="button"
//                   onClick={
//                     openCreateModal
//                   }
//                 >
//                   <Plus size={17} />

//                   Add Hero Slide
//                 </button>
//               )}

//           </div>
//         ) : (
//           <div className="mmics-hero-table-wrapper">

//             <table className="mmics-hero-table">

//               <thead>

//                 <tr>

//                   <th>
//                     Order
//                   </th>

//                   <th>
//                     Preview
//                   </th>

//                   <th>
//                     Slide Details
//                   </th>

//                   <th>
//                     CTA
//                   </th>

//                   <th>
//                     Status
//                   </th>

//                   <th>
//                     Actions
//                   </th>

//                 </tr>

//               </thead>

//               <tbody>

//                 {filteredSlides.map(
//                   (
//                     slide,
//                     index
//                   ) => {
//                     const image =
//                       slide.imageUrl;

//                     return (
//                       <tr
//                         key={
//                           slide.id
//                         }
//                       >

//                         {/* ORDER */}

//                         <td>

//                           <div className="mmics-hero-order">

//                             <GripVertical
//                               size={15}
//                             />

//                             <span>
//                               {String(
//                                 slide.sortOrder ??
//                                   index
//                               ).padStart(
//                                 2,
//                                 "0"
//                               )}
//                             </span>

//                           </div>

//                         </td>

//                         {/* IMAGE */}

//                         <td>

//                           <div className="mmics-hero-thumbnail">

//                             {image ? (
//                               <img
//                                 src={getImageUrl(
//                                   image
//                                 )}
//                                 alt={
//                                   slide.title ||
//                                   "Hero slide"
//                                 }
//                               />
//                             ) : (
//                               <ImageIcon
//                                 size={
//                                   22
//                                 }
//                               />
//                             )}

//                           </div>

//                         </td>

//                         {/* DETAILS */}

//                         <td>

//                           <div className="mmics-hero-slide-details">

//                             <strong>
//                               {slide.title ||
//                                 "Untitled Slide"}
//                             </strong>

//                             {slide.subtitle && (
//                               <span>
//                                 {
//                                   slide.subtitle
//                                 }
//                               </span>
//                             )}

//                             {slide.description && (
//                               <small>
//                                 {
//                                   slide.description
//                                 }
//                               </small>
//                             )}

//                           </div>

//                         </td>

//                         {/* CTA */}

//                         <td>

//                           {slide.buttonText ? (
//                             <div className="mmics-hero-cta">

//                               <strong>
//                                 {
//                                   slide.buttonText
//                                 }
//                               </strong>

//                               {slide.buttonUrl && (
//                                 <span>
//                                   {
//                                     slide.buttonUrl
//                                   }
//                                 </span>
//                               )}

//                             </div>
//                           ) : (
//                             <span className="mmics-hero-muted">
//                               No CTA
//                             </span>
//                           )}

//                         </td>

//                         {/* STATUS */}

//                         <td>

//                           <button
//                             type="button"
//                             className={`mmics-hero-status ${
//                               slide.isActive
//                                 ? "active"
//                                 : "inactive"
//                             }`}
//                             onClick={() =>
//                               handleStatusChange(
//                                 slide
//                               )
//                             }
//                           >

//                             {slide.isActive ? (
//                               <Eye
//                                 size={
//                                   14
//                                 }
//                               />
//                             ) : (
//                               <EyeOff
//                                 size={
//                                   14
//                                 }
//                               />
//                             )}

//                             {slide.isActive
//                               ? "ACTIVE"
//                               : "INACTIVE"}

//                           </button>

//                         </td>

//                         {/* ACTIONS */}

//                         <td>

//                           <div className="mmics-hero-actions">

//                             <button
//                               type="button"
//                               title="View"
//                               onClick={() =>
//                                 openViewModal(
//                                   slide
//                                 )
//                               }
//                             >
//                               <Eye
//                                 size={
//                                   17
//                                 }
//                               />
//                             </button>

//                             <button
//                               type="button"
//                               title="Edit"
//                               onClick={() =>
//                                 openEditModal(
//                                   slide
//                                 )
//                               }
//                             >
//                               <Edit3
//                                 size={
//                                   17
//                                 }
//                               />
//                             </button>

//                             <button
//                               type="button"
//                               title="Delete"
//                               className="danger"
//                               onClick={() =>
//                                 openDeleteModal(
//                                   slide
//                                 )
//                               }
//                             >
//                               <Trash2
//                                 size={
//                                   17
//                                 }
//                               />
//                             </button>

//                           </div>

//                         </td>

//                       </tr>
//                     );
//                   }
//                 )}

//               </tbody>

//             </table>

//           </div>
//         )}

//       </div>

//       {/* ===================================================
//           ADD / EDIT MODAL
//       =================================================== */}

//       {showModal && (
//         <div
//           className="mmics-hero-modal-overlay"
//           onMouseDown={(
//             event
//           ) => {
//             if (
//               event.target ===
//                 event.currentTarget &&
//               !saving
//             ) {
//               closeModal();
//             }
//           }}
//         >

//           <div className="mmics-hero-modal">

//             {/* MODAL HEADER */}

//             <div className="mmics-hero-modal-header">

//               <div>

//                 <span>
//                   {editingSlide
//                     ? "UPDATE CONTENT"
//                     : "NEW CONTENT"}
//                 </span>

//                 <h2>
//                   {editingSlide
//                     ? "Edit Hero Slide"
//                     : "Add Hero Slide"}
//                 </h2>

//               </div>

//               <button
//                 type="button"
//                 onClick={
//                   closeModal
//                 }
//                 disabled={
//                   saving
//                 }
//               >
//                 <X size={20} />
//               </button>

//             </div>

//             {/* FORM */}

//             <form
//               className="mmics-hero-form"
//               onSubmit={
//                 handleSubmit
//               }
//             >

//               {/* =========================================
//                   IMAGE
//               ========================================= */}

//               <div className="mmics-hero-form-section">

//                 <div className="mmics-hero-section-heading">

//                   <div>

//                     <span>
//                       01
//                     </span>

//                     <div>

//                       <h3>
//                         Hero Image
//                       </h3>

//                       <p>
//                         Recommended
//                         landscape image
//                         for desktop and
//                         mobile banners.
//                       </p>

//                     </div>

//                   </div>

//                 </div>

//                 <div className="mmics-hero-upload-area">

//                   {(
//                     imagePreview ||
//                     existingImage
//                   ) ? (
//                     <div className="mmics-hero-upload-preview">

//                       <img
//                         src={
//                           imagePreview ||
//                           getImageUrl(
//                             existingImage
//                           )
//                         }
//                         alt="Hero preview"
//                       />

//                       <div className="mmics-hero-upload-overlay">

//                         <button
//                           type="button"
//                           onClick={
//                             handleUploadClick
//                           }
//                         >
//                           <Upload
//                             size={
//                               16
//                             }
//                           />

//                           Change Image
//                         </button>

//                         {imagePreview && (
//                           <button
//                             type="button"
//                             className="remove"
//                             onClick={
//                               removeSelectedImage
//                             }
//                           >
//                             <X
//                               size={
//                                 16
//                               }
//                             />

//                             Remove
//                           </button>
//                         )}

//                       </div>

//                     </div>
//                   ) : (
//                     <button
//                       type="button"
//                       className="mmics-hero-upload-empty"
//                       onClick={
//                         handleUploadClick
//                       }
//                     >

//                       <div className="mmics-hero-upload-icon">
//                         <Upload
//                           size={
//                             22
//                           }
//                         />
//                       </div>

//                       <strong>
//                         Upload Hero Image
//                       </strong>

//                       <span>
//                         JPG, PNG or WEBP
//                         · Max 5MB
//                       </span>

//                     </button>
//                   )}

//                   <input
//                     ref={
//                       fileInputRef
//                     }
//                     type="file"
//                     accept="image/jpeg,image/jpg,image/png,image/webp"
//                     onChange={
//                       handleImageChange
//                     }
//                     hidden
//                   />

//                 </div>

//               </div>

//               {/* =========================================
//                   CONTENT
//               ========================================= */}

//               <div className="mmics-hero-form-section">

//                 <div className="mmics-hero-section-heading">

//                   <div>

//                     <span>
//                       02
//                     </span>

//                     <div>

//                       <h3>
//                         Slide Content
//                       </h3>

//                       <p>
//                         Add the text
//                         displayed over
//                         the hero banner.
//                       </p>

//                     </div>

//                   </div>

//                 </div>

//                 <div className="mmics-hero-form-grid">

//                   <div className="mmics-hero-field full">

//                     <label>
//                       Title{" "}
//                       <span>
//                         *
//                       </span>
//                     </label>

//                     <input
//                       type="text"
//                       name="title"
//                       value={
//                         form.title
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="Enter hero title"
//                       maxLength={
//                         150
//                       }
//                     />

//                   </div>

//                   <div className="mmics-hero-field full">

//                     <label>
//                       Subtitle
//                     </label>

//                     <input
//                       type="text"
//                       name="subtitle"
//                       value={
//                         form.subtitle
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="Enter supporting subtitle"
//                       maxLength={
//                         200
//                       }
//                     />

//                   </div>

//                   <div className="mmics-hero-field full">

//                     <label>
//                       Description
//                     </label>

//                     <textarea
//                       name="description"
//                       value={
//                         form.description
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="Enter hero description"
//                       rows={4}
//                       maxLength={
//                         500
//                       }
//                     />

//                   </div>

//                 </div>

//               </div>

//               {/* =========================================
//                   CTA
//               ========================================= */}

//               <div className="mmics-hero-form-section">

//                 <div className="mmics-hero-section-heading">

//                   <div>

//                     <span>
//                       03
//                     </span>

//                     <div>

//                       <h3>
//                         Call To Action
//                       </h3>

//                       <p>
//                         Optional button
//                         shown on the
//                         hero slide.
//                       </p>

//                     </div>

//                   </div>

//                 </div>

//                 <div className="mmics-hero-form-grid">

//                   <div className="mmics-hero-field">

//                     <label>
//                       Button Text
//                     </label>

//                     <input
//                       type="text"
//                       name="buttonText"
//                       value={
//                         form.buttonText
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="Explore Products"
//                       maxLength={
//                         60
//                       }
//                     />

//                   </div>

//                   <div className="mmics-hero-field">

//                     <label>
//                       Button URL
//                     </label>

//                     <input
//                       type="text"
//                       name="buttonUrl"
//                       value={
//                         form.buttonUrl
//                       }
//                       onChange={
//                         handleChange
//                       }
//                       placeholder="/products"
//                       maxLength={
//                         250
//                       }
//                     />

//                   </div>

//                 </div>

//               </div>

//               {/* =========================================
//                   DISPLAY SETTINGS
//               ========================================= */}

//               <div className="mmics-hero-form-section">

//                 <div className="mmics-hero-section-heading">

//                   <div>

//                     <span>
//                       04
//                     </span>

//                     <div>

//                       <h3>
//                         Display Settings
//                       </h3>

//                       <p>
//                         Control ordering
//                         and visibility.
//                       </p>

//                     </div>

//                   </div>

//                 </div>

//                 <div className="mmics-hero-form-grid">

//                   <div className="mmics-hero-field">

//                     <label>
//                       Sort Order
//                     </label>

//                     <input
//                       type="number"
//                       name="sortOrder"
//                       min="0"
//                       value={
//                         form.sortOrder
//                       }
//                       onChange={
//                         handleChange
//                       }
//                     />

//                   </div>

//                   <div className="mmics-hero-field">

//                     <label>
//                       Status
//                     </label>

//                     <select
//                       name="isActive"
//                       value={
//                         form.isActive
//                           ? "true"
//                           : "false"
//                       }
//                       onChange={(
//                         event
//                       ) =>
//                         setForm(
//                           (
//                             prev
//                           ) => ({
//                             ...prev,
//                             isActive:
//                               event
//                                 .target
//                                 .value ===
//                               "true",
//                           })
//                         )
//                       }
//                     >

//                       <option value="true">
//                         Active
//                       </option>

//                       <option value="false">
//                         Inactive
//                       </option>

//                     </select>

//                   </div>

//                 </div>

//               </div>

//               {/* FORM ERROR */}

//               {error && (
//                 <div className="mmics-hero-form-error">

//                   <AlertCircle
//                     size={
//                       17
//                     }
//                   />

//                   {error}

//                 </div>
//               )}

//               {success && (
//                 <div className="mmics-hero-form-success">

//                   <CheckCircle2
//                     size={
//                       17
//                     }
//                   />

//                   {success}

//                 </div>
//               )}

//               {/* FOOTER */}

//               <div className="mmics-hero-modal-footer">

//                 <button
//                   type="button"
//                   className="mmics-hero-cancel-button"
//                   onClick={
//                     closeModal
//                   }
//                   disabled={
//                     saving
//                   }
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="mmics-hero-save-button"
//                   disabled={
//                     saving
//                   }
//                 >

//                   {saving ? (
//                     <>
//                       <span className="mmics-hero-button-spinner" />

//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save
//                         size={
//                           17
//                         }
//                       />

//                       {editingSlide
//                         ? "Update Slide"
//                         : "Create Slide"}
//                     </>
//                   )}

//                 </button>

//               </div>

//             </form>

//           </div>

//         </div>
//       )}

//       {/* ===================================================
//           VIEW MODAL
//       =================================================== */}

//       {showViewModal &&
//         viewingSlide && (
//           <div className="mmics-hero-preview-overlay">

//             <div className="mmics-hero-preview-modal">

//               <button
//                 type="button"
//                 className="mmics-hero-preview-close"
//                 onClick={
//                   closeViewModal
//                 }
//               >
//                 <X size={20} />
//               </button>

//               <div className="mmics-hero-preview-image">

//                 {viewingSlide.imageUrl ? (
//                   <img
//                     src={getImageUrl(
//                       viewingSlide.imageUrl
//                     )}
//                     alt={
//                       viewingSlide.title ||
//                       "Hero slide"
//                     }
//                   />
//                 ) : (
//                   <div className="mmics-hero-preview-no-image">

//                     <ImageIcon
//                       size={
//                         40
//                       }
//                     />

//                   </div>
//                 )}

//                 <div className="mmics-hero-preview-gradient" />

//                 <div className="mmics-hero-preview-content">

//                   {viewingSlide.subtitle && (
//                     <span>
//                       {
//                         viewingSlide.subtitle
//                       }
//                     </span>
//                   )}

//                   <h2>
//                     {viewingSlide.title ||
//                       "Untitled Slide"}
//                   </h2>

//                   {viewingSlide.description && (
//                     <p>
//                       {
//                         viewingSlide.description
//                       }
//                     </p>
//                   )}

//                   {viewingSlide.buttonText && (
//                     <button
//                       type="button"
//                     >
//                       {
//                         viewingSlide.buttonText
//                       }
//                     </button>
//                   )}

//                 </div>

//               </div>

//               {activeSlides.length >
//                 1 && (
//                 <>
//                   <button
//                     type="button"
//                     className="mmics-hero-preview-nav previous"
//                     onClick={
//                       showPreviousSlide
//                     }
//                   >
//                     <ChevronLeft
//                       size={
//                         21
//                       }
//                     />
//                   </button>

//                   <button
//                     type="button"
//                     className="mmics-hero-preview-nav next"
//                     onClick={
//                       showNextSlide
//                     }
//                   >
//                     <ChevronRight
//                       size={
//                         21
//                       }
//                     />
//                   </button>
//                 </>
//               )}

//               <div className="mmics-hero-preview-meta">

//                 <div>

//                   <span>
//                     Sort Order
//                   </span>

//                   <strong>
//                     {String(
//                       viewingSlide.sortOrder ??
//                         0
//                     ).padStart(
//                       2,
//                       "0"
//                     )}
//                   </strong>

//                 </div>

//                 <div>

//                   <span>
//                     Status
//                   </span>

//                   <strong
//                     className={
//                       viewingSlide.isActive
//                         ? "active"
//                         : "inactive"
//                     }
//                   >
//                     {viewingSlide.isActive
//                       ? "ACTIVE"
//                       : "INACTIVE"}
//                   </strong>

//                 </div>

//                 {viewingSlide.buttonUrl && (
//                   <div>

//                     <span>
//                       CTA URL
//                     </span>

//                     <strong>
//                       {
//                         viewingSlide.buttonUrl
//                       }
//                     </strong>

//                   </div>
//                 )}

//               </div>

//             </div>

//           </div>
//         )}

//       {/* ===================================================
//           DELETE MODAL
//       =================================================== */}

//       {showDeleteModal &&
//         deletingSlide && (
//           <div className="mmics-hero-delete-overlay">

//             <div className="mmics-hero-delete-modal">

//               <div className="mmics-hero-delete-icon">

//                 <Trash2
//                   size={
//                     24
//                   }
//                 />

//               </div>

//               <h2>
//                 Delete Hero Slide?
//               </h2>

//               <p>
//                 Are you sure you want to
//                 delete{" "}
//                 <strong>
//                   {deletingSlide.title ||
//                     "this hero slide"}
//                 </strong>
//                 ? This action cannot be
//                 undone.
//               </p>

//               <div className="mmics-hero-delete-actions">

//                 <button
//                   type="button"
//                   onClick={
//                     closeDeleteModal
//                   }
//                   disabled={
//                     saving
//                   }
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="button"
//                   className="danger"
//                   onClick={
//                     handleDelete
//                   }
//                   disabled={
//                     saving
//                   }
//                 >
//                   {saving
//                     ? "Deleting..."
//                     : "Delete Slide"}
//                 </button>

//               </div>

//             </div>

//           </div>
//         )}

//     </div>
//   );
// };

// export default HeroSlides;



import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Layers3,
  ExternalLink,
  GripVertical,
  CalendarDays,
  Link2,
  FileImage,
  RefreshCw,
} from "lucide-react";

import heroSlideService from "../../services/heroSlideService";
import "./HeroSlides.css";

const INITIAL_FORM = {
  title: "",
  subtitle: "",
  description: "",
  buttonText: "",
  buttonUrl: "",
  sortOrder: 0,
  isActive: true,
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `http://localhost:5000${imageUrl}`;
  }

  return `http://localhost:5000/${imageUrl}`;
};

const formatDate = (date) => {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const HeroSlides = () => {
  const fileInputRef = useRef(null);

  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [editingSlide, setEditingSlide] = useState(null);
  const [viewingSlide, setViewingSlide] = useState(null);
  const [deletingSlide, setDeletingSlide] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM);

  // IMPORTANT:
  // This MUST always contain the real browser File object.
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [previewIndex, setPreviewIndex] = useState(0);

  // ============================================================
  // FETCH
  // ============================================================

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await heroSlideService.getAllAdmin();

      const data = response?.slides || response?.data || response || [];

      setSlides(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load hero slides:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load hero slides."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // ============================================================
  // FILTERED SLIDES
  // ============================================================

  const filteredSlides = useMemo(() => {
    const query = search.trim().toLowerCase();

    return slides.filter((slide) => {
      const matchesSearch =
        !query ||
        slide.title?.toLowerCase().includes(query) ||
        slide.subtitle?.toLowerCase().includes(query) ||
        slide.description?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && slide.isActive) ||
        (statusFilter === "inactive" && !slide.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [slides, search, statusFilter]);

  // ============================================================
  // STATS
  // ============================================================

  const totalCount = slides.length;

  const activeCount = slides.filter(
    (slide) => slide.isActive
  ).length;

  const inactiveCount = slides.filter(
    (slide) => !slide.isActive
  ).length;

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setForm({
      ...INITIAL_FORM,
    });

    setEditingSlide(null);

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError("");
  };

  // ============================================================
  // OPEN CREATE
  // ============================================================

  const openCreateModal = () => {
    resetForm();

    setForm({
      ...INITIAL_FORM,
      sortOrder: slides.length,
    });

    setShowModal(true);
  };

  // ============================================================
  // OPEN EDIT
  // ============================================================

  const openEditModal = (slide) => {
    if (!slide) return;

    resetForm();

    setEditingSlide(slide);

    setForm({
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      description: slide.description || "",
      buttonText: slide.buttonText || "",
      buttonUrl: slide.buttonUrl || "",
      sortOrder: slide.sortOrder ?? 0,
      isActive: slide.isActive !== false,
    });

    setImageFile(null);
    setImagePreview(
      slide.imageUrl
        ? getImageUrl(slide.imageUrl)
        : ""
    );

    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "sortOrder"
          ? value
          : value,
    }));
  };

  // ============================================================
  // IMAGE PICKER
  // ============================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    // Validate type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(
        "Please upload a JPG, JPEG, PNG, or WEBP image."
      );

      event.target.value = "";
      return;
    }

    // Validate size
    if (file.size > MAX_IMAGE_SIZE) {
      setError(
        "Image size must be less than 5MB."
      );

      event.target.value = "";
      return;
    }

    // Revoke previous blob preview
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    // IMPORTANT:
    // Store the REAL File object.
    setImageFile(file);

    // Preview from the real File object.
    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);

    console.log("Hero image selected:", file);
    console.log("File name:", file.name);
    console.log("File type:", file.type);
    console.log("File size:", file.size);
    console.log(
      "Is File:",
      file instanceof File
    );
  };

  // ============================================================
  // REMOVE SELECTED IMAGE
  // ============================================================

  const removeSelectedImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);

    if (editingSlide?.imageUrl) {
      setImagePreview(
        getImageUrl(editingSlide.imageUrl)
      );
    } else {
      setImagePreview("");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================================
  // OPEN FILE PICKER
  // ============================================================

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!form.title.trim()) {
      setError("Hero slide title is required.");
      return;
    }

    // CREATE requires a new image
    if (!editingSlide && !(imageFile instanceof File)) {
      setError("Please select a hero image.");
      return;
    }

    // EDIT only validates if a new image exists
    if (
      editingSlide &&
      imageFile &&
      !(imageFile instanceof File)
    ) {
      setError(
        "Invalid image selected. Please choose the image again."
      );
      return;
    }

    // ----------------------------------------------------------
    // DEBUG
    // ----------------------------------------------------------

    console.log(
      "========================================"
    );

    console.log(
      "HERO SLIDE SUBMIT"
    );

    console.log(
      "Editing:",
      Boolean(editingSlide)
    );

    console.log(
      "Image File:",
      imageFile
    );

    console.log(
      "Is File:",
      imageFile instanceof File
    );

    if (imageFile instanceof File) {
      console.log(
        "Image Name:",
        imageFile.name
      );

      console.log(
        "Image Type:",
        imageFile.type
      );

      console.log(
        "Image Size:",
        imageFile.size
      );
    }

    console.log(
      "========================================"
    );

    // ----------------------------------------------------------
    // PAYLOAD
    // ----------------------------------------------------------

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      buttonText: form.buttonText.trim(),
      buttonUrl: form.buttonUrl.trim(),
      sortOrder:
        Number(form.sortOrder) || 0,
      isActive: Boolean(form.isActive),

      // VERY IMPORTANT:
      // Send the actual File object.
      image: imageFile,
    };

    try {
      setSaving(true);

      if (editingSlide) {
        await heroSlideService.update(
          editingSlide.id,
          payload
        );

        setSuccess(
          "Hero slide updated successfully."
        );
      } else {
        await heroSlideService.create(
          payload
        );

        setSuccess(
          "Hero slide created successfully."
        );
      }

      setShowModal(false);
      resetForm();

      await fetchSlides();
    } catch (err) {
      console.error(
        "Hero slide save error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save hero slide."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // STATUS
  // ============================================================

  const handleStatusToggle = async (slide) => {
    if (!slide) return;

    try {
      setError("");

      await heroSlideService.updateStatus(
        slide.id,
        !slide.isActive
      );

      setSlides((previous) =>
        previous.map((item) =>
          item.id === slide.id
            ? {
                ...item,
                isActive: !item.isActive,
              }
            : item
        )
      );

      setSuccess(
        `Hero slide ${
          slide.isActive
            ? "deactivated"
            : "activated"
        } successfully.`
      );
    } catch (err) {
      console.error(
        "Hero slide status error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to update slide status."
      );
    }
  };

  // ============================================================
  // VIEW
  // ============================================================

  const openViewModal = (slide) => {
    setViewingSlide(slide);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingSlide(null);
  };

  // ============================================================
  // DELETE
  // ============================================================

  const openDeleteModal = (slide) => {
    setDeletingSlide(slide);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingSlide(null);
  };

  const confirmDelete = async () => {
    if (!deletingSlide) return;

    try {
      setError("");

      await heroSlideService.remove(
        deletingSlide.id
      );

      setSuccess(
        "Hero slide deleted successfully."
      );

      closeDeleteModal();

      await fetchSlides();
    } catch (err) {
      console.error(
        "Hero slide delete error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to delete hero slide."
      );
    }
  };

  // ============================================================
  // PREVIEW
  // ============================================================

  const activeSlides = useMemo(
    () =>
      slides
        .filter((slide) => slide.isActive)
        .sort(
          (a, b) =>
            (a.sortOrder ?? 0) -
            (b.sortOrder ?? 0)
        ),
    [slides]
  );

  const openPreviewModal = () => {
    if (!activeSlides.length) {
      setError(
        "No active hero slides available for preview."
      );
      return;
    }

    setPreviewIndex(0);
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
  };

  const nextPreview = () => {
    if (!activeSlides.length) return;

    setPreviewIndex(
      (previous) =>
        (previous + 1) %
        activeSlides.length
    );
  };

  const previousPreview = () => {
    if (!activeSlides.length) return;

    setPreviewIndex(
      (previous) =>
        (previous -
          1 +
          activeSlides.length) %
        activeSlides.length
    );
  };

  // ============================================================
  // ESCAPE KEY
  // ============================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;

      if (showPreviewModal) {
        closePreviewModal();
      } else if (showDeleteModal) {
        closeDeleteModal();
      } else if (showViewModal) {
        closeViewModal();
      } else if (showModal && !saving) {
        closeModal();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    showModal,
    showViewModal,
    showDeleteModal,
    showPreviewModal,
    saving,
  ]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="mmics-hero-page">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="mmics-hero-header">

        <div className="mmics-hero-header-left">

          <div className="mmics-hero-breadcrumb">
            <span>Admin</span>
            <span>/</span>
            <strong>Hero Slides</strong>
          </div>

          <div className="mmics-hero-heading-row">

            <div className="mmics-hero-heading-icon">
              <Layers3 size={24} />
            </div>

            <div>
              <h1>Hero Slides</h1>

              <p>
                Manage homepage hero banners,
                content and call-to-actions.
              </p>
            </div>

          </div>

        </div>

        <div className="mmics-hero-header-actions">

          <button
            type="button"
            className="mmics-hero-secondary-btn"
            onClick={openPreviewModal}
            disabled={!activeSlides.length}
          >
            <Eye size={17} />
            Preview
          </button>

          <button
            type="button"
            className="mmics-hero-primary-btn"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Add Hero Slide
          </button>

        </div>

      </div>

      {/* ======================================================
          ALERTS
      ======================================================= */}

      {error && (
        <div className="mmics-hero-alert mmics-hero-alert-error">
          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="mmics-hero-alert mmics-hero-alert-success">
          <CheckCircle2 size={18} />

          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ======================================================
          STATS
      ======================================================= */}

      <div className="mmics-hero-stats">

        <div className="mmics-hero-stat-card">

          <div className="mmics-hero-stat-icon">
            <Layers3 size={20} />
          </div>

          <div>
            <span>Total Slides</span>
            <strong>{totalCount}</strong>
          </div>

        </div>

        <div className="mmics-hero-stat-card">

          <div className="mmics-hero-stat-icon active">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Active</span>
            <strong>{activeCount}</strong>
          </div>

        </div>

        <div className="mmics-hero-stat-card">

          <div className="mmics-hero-stat-icon inactive">
            <EyeOff size={20} />
          </div>

          <div>
            <span>Inactive</span>
            <strong>{inactiveCount}</strong>
          </div>

        </div>

      </div>

      {/* ======================================================
          TOOLBAR
      ======================================================= */}

      <div className="mmics-hero-toolbar">

        <div className="mmics-hero-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search hero slides..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
            >
              <X size={15} />
            </button>
          )}

        </div>

        <div className="mmics-hero-filters">

          <button
            type="button"
            className={
              statusFilter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter("all")
            }
          >
            All
            <span>{totalCount}</span>
          </button>

          <button
            type="button"
            className={
              statusFilter === "active"
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter("active")
            }
          >
            Active
            <span>{activeCount}</span>
          </button>

          <button
            type="button"
            className={
              statusFilter === "inactive"
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter("inactive")
            }
          >
            Inactive
            <span>{inactiveCount}</span>
          </button>

        </div>

        <button
          type="button"
          className="mmics-hero-refresh-btn"
          onClick={fetchSlides}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "mmics-spin"
                : ""
            }
          />
        </button>

      </div>

      {/* ======================================================
          TABLE
      ======================================================= */}

      <div className="mmics-hero-table-card">

        {loading ? (
          <div className="mmics-hero-loading">

            <div className="mmics-hero-spinner" />

            <p>
              Loading hero slides...
            </p>

          </div>
        ) : filteredSlides.length === 0 ? (
          <div className="mmics-hero-empty">

            <div className="mmics-hero-empty-icon">
              <ImageIcon size={30} />
            </div>

            <h3>
              {slides.length === 0
                ? "No hero slides yet"
                : "No matching hero slides"}
            </h3>

            <p>
              {slides.length === 0
                ? "Create your first homepage hero slide to get started."
                : "Try changing your search or filter."}
            </p>

            {slides.length === 0 && (
              <button
                type="button"
                className="mmics-hero-primary-btn"
                onClick={openCreateModal}
              >
                <Plus size={17} />
                Add Hero Slide
              </button>
            )}

          </div>
        ) : (
          <div className="mmics-hero-table-wrapper">

            <table className="mmics-hero-table">

              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>IMAGE</th>
                  <th>HERO CONTENT</th>
                  <th>CTA</th>
                  <th>STATUS</th>
                  <th>UPDATED</th>
                  <th className="actions-header">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>

                {filteredSlides.map(
                  (slide) => (
                    <tr key={slide.id}>

                      {/* ORDER */}
                      <td>
                        <div className="mmics-hero-order">

                          <GripVertical
                            size={15}
                          />

                          <strong>
                            {slide.sortOrder ??
                              0}
                          </strong>

                        </div>
                      </td>

                      {/* IMAGE */}
                      <td>

                        <div className="mmics-hero-thumbnail">

                          {slide.imageUrl ? (
                            <img
                              src={getImageUrl(
                                slide.imageUrl
                              )}
                              alt={
                                slide.title ||
                                "Hero slide"
                              }
                            />
                          ) : (
                            <div className="mmics-hero-thumbnail-empty">
                              <ImageIcon
                                size={22}
                              />
                            </div>
                          )}

                        </div>

                      </td>

                      {/* CONTENT */}
                      <td>

                        <div className="mmics-hero-content-cell">

                          <strong>
                            {slide.title ||
                              "Untitled"}
                          </strong>

                          {slide.subtitle && (
                            <span>
                              {
                                slide.subtitle
                              }
                            </span>
                          )}

                          {slide.description && (
                            <p>
                              {
                                slide.description
                              }
                            </p>
                          )}

                        </div>

                      </td>

                      {/* CTA */}
                      <td>

                        {slide.buttonText ? (
                          <div className="mmics-hero-cta-cell">

                            <strong>
                              {
                                slide.buttonText
                              }
                            </strong>

                            {slide.buttonUrl && (
                              <span>
                                <Link2
                                  size={12}
                                />
                                {
                                  slide.buttonUrl
                                }
                              </span>
                            )}

                          </div>
                        ) : (
                          <span className="mmics-hero-muted">
                            No CTA
                          </span>
                        )}

                      </td>

                      {/* STATUS */}
                      <td>

                        <button
                          type="button"
                          className={`mmics-hero-status ${
                            slide.isActive
                              ? "active"
                              : "inactive"
                          }`}
                          onClick={() =>
                            handleStatusToggle(
                              slide
                            )
                          }
                        >
                          {slide.isActive ? (
                            <>
                              <CheckCircle2
                                size={14}
                              />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff
                                size={14}
                              />
                              Inactive
                            </>
                          )}
                        </button>

                      </td>

                      {/* UPDATED */}
                      <td>

                        <div className="mmics-hero-date">

                          <CalendarDays
                            size={14}
                          />

                          <span>
                            {formatDate(
                              slide.updatedAt ||
                                slide.createdAt
                            )}
                          </span>

                        </div>

                      </td>

                      {/* ACTIONS */}
                      <td>

                        <div className="mmics-hero-actions">

                          <button
                            type="button"
                            title="View"
                            onClick={() =>
                              openViewModal(
                                slide
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              openEditModal(
                                slide
                              )
                            }
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            title={
                              slide.isActive
                                ? "Deactivate"
                                : "Activate"
                            }
                            onClick={() =>
                              handleStatusToggle(
                                slide
                              )
                            }
                          >
                            {slide.isActive ? (
                              <EyeOff
                                size={16}
                              />
                            ) : (
                              <CheckCircle2
                                size={16}
                              />
                            )}
                          </button>

                          <button
                            type="button"
                            title="Delete"
                            className="danger"
                            onClick={() =>
                              openDeleteModal(
                                slide
                              )
                            }
                          >
                            <Trash2
                              size={16}
                            />
                          </button>

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

      {/* ======================================================
          ADD / EDIT MODAL
      ======================================================= */}

      {showModal && (
        <div
          className="mmics-hero-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="mmics-hero-modal">

            <div className="mmics-hero-modal-header">

              <div>
                <span className="mmics-hero-modal-kicker">
                  {editingSlide
                    ? "UPDATE HERO"
                    : "NEW HERO"}
                </span>

                <h2>
                  {editingSlide
                    ? "Edit Hero Slide"
                    : "Add Hero Slide"}
                </h2>

                <p>
                  Configure your homepage
                  banner content and image.
                </p>
              </div>

              <button
                type="button"
                className="mmics-hero-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={19} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mmics-hero-form"
            >

              {/* FORM ERROR */}

              {error && (
                <div className="mmics-hero-form-alert">
                  <AlertCircle
                    size={17}
                  />
                  <span>{error}</span>
                </div>
              )}

              {/* IMAGE */}

              <div className="mmics-hero-form-section">

                <div className="mmics-hero-section-title">
                  <FileImage size={17} />

                  <div>
                    <strong>
                      Hero Image
                    </strong>

                    <span>
                      JPG, PNG or WEBP ·
                      Maximum 5MB
                    </span>
                  </div>

                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  hidden
                  onChange={
                    handleImageChange
                  }
                />

                {imagePreview ? (
                  <div className="mmics-hero-upload-preview">

                    <img
                      src={imagePreview}
                      alt="Hero preview"
                    />

                    <div className="mmics-hero-upload-preview-overlay">

                      <div>
                        <strong>
                          {imageFile
                            ? imageFile.name
                            : "Current hero image"}
                        </strong>

                        {imageFile && (
                          <span>
                            {(
                              imageFile.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </span>
                        )}
                      </div>

                      <div className="mmics-hero-upload-preview-actions">

                        <button
                          type="button"
                          onClick={
                            openFilePicker
                          }
                          disabled={saving}
                        >
                          <Upload
                            size={15}
                          />
                          Replace
                        </button>

                        {imageFile && (
                          <button
                            type="button"
                            onClick={
                              removeSelectedImage
                            }
                            disabled={saving}
                          >
                            <X
                              size={15}
                            />
                            Remove
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                ) : (
                  <button
                    type="button"
                    className="mmics-hero-upload-area"
                    onClick={
                      openFilePicker
                    }
                    disabled={saving}
                  >

                    <div className="mmics-hero-upload-icon">
                      <Upload size={23} />
                    </div>

                    <strong>
                      Upload Hero Image
                    </strong>

                    <span>
                      Click to browse or
                      select an image
                    </span>

                    <small>
                      Recommended:
                      1920 × 700px
                    </small>

                  </button>
                )}

              </div>

              {/* CONTENT */}

              <div className="mmics-hero-form-section">

                <div className="mmics-hero-section-title">

                  <Layers3 size={17} />

                  <div>
                    <strong>
                      Hero Content
                    </strong>

                    <span>
                      Main messaging shown
                      on the homepage
                    </span>
                  </div>

                </div>

                <div className="mmics-hero-form-grid">

                  <div className="mmics-hero-field full">

                    <label>
                      Title
                      <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={
                        handleChange
                      }
                      placeholder="Enter hero title"
                      maxLength={200}
                      disabled={saving}
                    />

                    <small>
                      {form.title.length}/200
                    </small>

                  </div>

                  <div className="mmics-hero-field full">

                    <label>
                      Subtitle
                    </label>

                    <input
                      type="text"
                      name="subtitle"
                      value={form.subtitle}
                      onChange={
                        handleChange
                      }
                      placeholder="Enter supporting subtitle"
                      maxLength={300}
                      disabled={saving}
                    />

                  </div>

                  <div className="mmics-hero-field full">

                    <label>
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={
                        form.description
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter hero description"
                      rows={4}
                      maxLength={1000}
                      disabled={saving}
                    />

                    <small>
                      {
                        form.description
                          .length
                      }
                      /1000
                    </small>

                  </div>

                </div>

              </div>

              {/* CTA */}

              <div className="mmics-hero-form-section">

                <div className="mmics-hero-section-title">

                  <ExternalLink
                    size={17}
                  />

                  <div>
                    <strong>
                      Call To Action
                    </strong>

                    <span>
                      Optional button displayed
                      on the hero
                    </span>
                  </div>

                </div>

                <div className="mmics-hero-form-grid">

                  <div className="mmics-hero-field">

                    <label>
                      Button Text
                    </label>

                    <input
                      type="text"
                      name="buttonText"
                      value={
                        form.buttonText
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Explore Products"
                      maxLength={100}
                      disabled={saving}
                    />

                  </div>

                  <div className="mmics-hero-field">

                    <label>
                      Button URL
                    </label>

                    <input
                      type="text"
                      name="buttonUrl"
                      value={
                        form.buttonUrl
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. /products"
                      maxLength={500}
                      disabled={saving}
                    />

                  </div>

                </div>

              </div>

              {/* SETTINGS */}

              <div className="mmics-hero-form-section">

                <div className="mmics-hero-section-title">

                  <GripVertical
                    size={17}
                  />

                  <div>
                    <strong>
                      Display Settings
                    </strong>

                    <span>
                      Control order and
                      visibility
                    </span>
                  </div>

                </div>

                <div className="mmics-hero-form-grid">

                  <div className="mmics-hero-field">

                    <label>
                      Sort Order
                    </label>

                    <input
                      type="number"
                      name="sortOrder"
                      value={
                        form.sortOrder
                      }
                      onChange={
                        handleChange
                      }
                      min="0"
                      disabled={saving}
                    />

                  </div>

                  <div className="mmics-hero-field">

                    <label>
                      Status
                    </label>

                    <select
                      name="isActive"
                      value={
                        form.isActive
                          ? "true"
                          : "false"
                      }
                      onChange={(event) =>
                        setForm(
                          (previous) => ({
                            ...previous,
                            isActive:
                              event.target
                                .value ===
                              "true",
                          })
                        )
                      }
                      disabled={saving}
                    >
                      <option value="true">
                        Active
                      </option>

                      <option value="false">
                        Inactive
                      </option>
                    </select>

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="mmics-hero-modal-footer">

                <button
                  type="button"
                  className="mmics-hero-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="mmics-hero-save-btn"
                  disabled={saving}
                >

                  {saving ? (
                    <>
                      <span className="mmics-hero-button-spinner" />
                      {editingSlide
                        ? "Updating..."
                        : "Creating..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        size={17}
                      />

                      {editingSlide
                        ? "Update Hero Slide"
                        : "Create Hero Slide"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ======================================================
          VIEW MODAL
      ======================================================= */}

      {showViewModal &&
        viewingSlide && (
          <div
            className="mmics-hero-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeViewModal();
              }
            }}
          >

            <div className="mmics-hero-view-modal">

              <div className="mmics-hero-modal-header">

                <div>
                  <span className="mmics-hero-modal-kicker">
                    HERO SLIDE
                  </span>

                  <h2>
                    {viewingSlide.title ||
                      "Hero Slide"}
                  </h2>

                  <p>
                    Preview and slide
                    information.
                  </p>
                </div>

                <button
                  type="button"
                  className="mmics-hero-modal-close"
                  onClick={
                    closeViewModal
                  }
                >
                  <X size={19} />
                </button>

              </div>

              <div className="mmics-hero-view-content">

                <div className="mmics-hero-view-image">

                  {viewingSlide.imageUrl ? (
                    <img
                      src={getImageUrl(
                        viewingSlide.imageUrl
                      )}
                      alt={
                        viewingSlide.title
                      }
                    />
                  ) : (
                    <div>
                      <ImageIcon
                        size={40}
                      />
                      <span>
                        No image
                      </span>
                    </div>
                  )}

                </div>

                <div className="mmics-hero-view-details">

                  <div className="mmics-hero-view-detail">

                    <span>
                      Title
                    </span>

                    <strong>
                      {viewingSlide.title ||
                        "—"}
                    </strong>

                  </div>

                  <div className="mmics-hero-view-detail">

                    <span>
                      Subtitle
                    </span>

                    <strong>
                      {viewingSlide.subtitle ||
                        "—"}
                    </strong>

                  </div>

                  <div className="mmics-hero-view-detail full">

                    <span>
                      Description
                    </span>

                    <p>
                      {viewingSlide.description ||
                        "No description."}
                    </p>

                  </div>

                  <div className="mmics-hero-view-detail">

                    <span>
                      CTA
                    </span>

                    <strong>
                      {viewingSlide.buttonText ||
                        "No CTA"}
                    </strong>

                  </div>

                  <div className="mmics-hero-view-detail">

                    <span>
                      URL
                    </span>

                    <strong>
                      {viewingSlide.buttonUrl ||
                        "—"}
                    </strong>

                  </div>

                  <div className="mmics-hero-view-detail">

                    <span>
                      Sort Order
                    </span>

                    <strong>
                      {viewingSlide.sortOrder ??
                        0}
                    </strong>

                  </div>

                  <div className="mmics-hero-view-detail">

                    <span>
                      Status
                    </span>

                    <strong
                      className={
                        viewingSlide.isActive
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {viewingSlide.isActive
                        ? "Active"
                        : "Inactive"}
                    </strong>

                  </div>

                  <div className="mmics-hero-view-detail">

                    <span>
                      Created
                    </span>

                    <strong>
                      {formatDate(
                        viewingSlide.createdAt
                      )}
                    </strong>

                  </div>

                </div>

              </div>

              <div className="mmics-hero-modal-footer">

                <button
                  type="button"
                  className="mmics-hero-cancel-btn"
                  onClick={
                    closeViewModal
                  }
                >
                  Close
                </button>

                <button
                  type="button"
                  className="mmics-hero-save-btn"
                  onClick={() => {
                    closeViewModal();
                    openEditModal(
                      viewingSlide
                    );
                  }}
                >
                  <Pencil size={16} />
                  Edit Slide
                </button>

              </div>

            </div>

          </div>
        )}

      {/* ======================================================
          PREVIEW MODAL
      ======================================================= */}

      {showPreviewModal &&
        activeSlides.length > 0 && (
          <div className="mmics-hero-preview-overlay">

            <div className="mmics-hero-preview-modal">

              <button
                type="button"
                className="mmics-hero-preview-close"
                onClick={
                  closePreviewModal
                }
              >
                <X size={21} />
              </button>

              <div className="mmics-hero-preview-image">

                <img
                  src={getImageUrl(
                    activeSlides[
                      previewIndex
                    ].imageUrl
                  )}
                  alt={
                    activeSlides[
                      previewIndex
                    ].title
                  }
                />

                <div className="mmics-hero-preview-gradient" />

                <div className="mmics-hero-preview-copy">

                  {activeSlides[
                    previewIndex
                  ].subtitle && (
                    <span>
                      {
                        activeSlides[
                          previewIndex
                        ].subtitle
                      }
                    </span>
                  )}

                  <h2>
                    {
                      activeSlides[
                        previewIndex
                      ].title
                    }
                  </h2>

                  {activeSlides[
                    previewIndex
                  ].description && (
                    <p>
                      {
                        activeSlides[
                          previewIndex
                        ].description
                      }
                    </p>
                  )}

                  {activeSlides[
                    previewIndex
                  ].buttonText && (
                    <button
                      type="button"
                      onClick={() => {
                        const url =
                          activeSlides[
                            previewIndex
                          ].buttonUrl;

                        if (url) {
                          window.open(
                            url,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }
                      }}
                    >
                      {
                        activeSlides[
                          previewIndex
                        ].buttonText
                      }

                      <ExternalLink
                        size={15}
                      />
                    </button>
                  )}

                </div>

                {activeSlides.length >
                  1 && (
                  <>
                    <button
                      type="button"
                      className="mmics-hero-preview-nav prev"
                      onClick={
                        previousPreview
                      }
                    >
                      <ChevronLeft
                        size={22}
                      />
                    </button>

                    <button
                      type="button"
                      className="mmics-hero-preview-nav next"
                      onClick={
                        nextPreview
                      }
                    >
                      <ChevronRight
                        size={22}
                      />
                    </button>
                  </>
                )}

                <div className="mmics-hero-preview-meta">

                  <span>
                    Slide{" "}
                    {previewIndex + 1}{" "}
                    of{" "}
                    {activeSlides.length}
                  </span>

                  <div className="mmics-hero-preview-dots">

                    {activeSlides.map(
                      (slide, index) => (
                        <button
                          key={slide.id}
                          type="button"
                          className={
                            index ===
                            previewIndex
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            setPreviewIndex(
                              index
                            )
                          }
                          aria-label={`Go to slide ${
                            index + 1
                          }`}
                        />
                      )
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      {/* ======================================================
          DELETE MODAL
      ======================================================= */}

      {showDeleteModal &&
        deletingSlide && (
          <div
            className="mmics-hero-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeDeleteModal();
              }
            }}
          >

            <div className="mmics-hero-delete-modal">

              <div className="mmics-hero-delete-icon">
                <Trash2 size={24} />
              </div>

              <h2>
                Delete Hero Slide?
              </h2>

              <p>
                Are you sure you want to
                delete{" "}
                <strong>
                  {deletingSlide.title ||
                    "this hero slide"}
                </strong>
                ? This action cannot be
                undone.
              </p>

              <div className="mmics-hero-delete-actions">

                <button
                  type="button"
                  className="mmics-hero-cancel-btn"
                  onClick={
                    closeDeleteModal
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="mmics-hero-delete-confirm-btn"
                  onClick={
                    confirmDelete
                  }
                >
                  <Trash2 size={16} />
                  Delete Slide
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default HeroSlides;
