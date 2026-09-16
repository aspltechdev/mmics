
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Search,
//   Plus,
//   Edit3,
//   Trash2,
//   Eye,
//   X,
//   Check,
//   ChevronDown,
//   Package,
//   Image as ImageIcon,
//   Upload,
//   MoreVertical,
//   Power,
//   PowerOff,
//   AlertTriangle,
//   ExternalLink,
//   Copy,
//   RefreshCw,
// } from "lucide-react";

// import productService from "../../services/productService";
// import categoryService from "../../services/categoryService";
// import "./Products.css";

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [categoryFilter, setCategoryFilter] = useState("ALL");

//   const [showModal, setShowModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showImageModal, setShowImageModal] = useState(false);

//   const [editingProduct, setEditingProduct] = useState(null);
//   const [viewingProduct, setViewingProduct] = useState(null);
//   const [deletingProduct, setDeletingProduct] = useState(null);

//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [form, setForm] = useState({
//     categoryId: "",
//     name: "",
//     slug: "",
//     description: "",
//     status: "ACTIVE",
//   });

//   const [imageUrl, setImageUrl] = useState("");
//   const [imagePrimary, setImagePrimary] = useState(false);

//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const searchInputRef = useRef(null);

//   // --------------------------------------------------
//   // FETCH PRODUCTS
//   // --------------------------------------------------

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await productService.getAll();

//       setProducts(response?.products || []);
//     } catch (err) {
//       console.error("Fetch products error:", err);

//       setError(
//         err?.response?.data?.message ||
//           "Unable to fetch products."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // FETCH CATEGORIES
//   // --------------------------------------------------

//   const fetchCategories = async () => {
//     try {
//       const response = await categoryService.getAll();

//       setCategories(response?.categories || []);
//     } catch (err) {
//       console.error("Fetch categories error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//   }, []);

//   // --------------------------------------------------
//   // AUTO SLUG
//   // --------------------------------------------------

//   const generateSlug = (value) => {
//     return value
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9\s-]/g, "")
//       .replace(/\s+/g, "-")
//       .replace(/-+/g, "-");
//   };

//   const handleNameChange = (value) => {
//     setForm((prev) => ({
//       ...prev,
//       name: value,
//       ...(editingProduct
//         ? {}
//         : {
//             slug: generateSlug(value),
//           }),
//     }));
//   };

//   // --------------------------------------------------
//   // FILTER PRODUCTS
//   // --------------------------------------------------

//   const filteredProducts = useMemo(() => {
//     return products.filter((product) => {
//       const search = searchTerm.toLowerCase().trim();

//       const matchesSearch =
//         !search ||
//         product.name?.toLowerCase().includes(search) ||
//         product.slug?.toLowerCase().includes(search) ||
//         product.category?.name?.toLowerCase().includes(search);

//       const matchesStatus =
//         statusFilter === "ALL" ||
//         product.status === statusFilter;

//       const matchesCategory =
//         categoryFilter === "ALL" ||
//         product.categoryId === categoryFilter;

//       return (
//         matchesSearch &&
//         matchesStatus &&
//         matchesCategory
//       );
//     });
//   }, [
//     products,
//     searchTerm,
//     statusFilter,
//     categoryFilter,
//   ]);

//   // --------------------------------------------------
//   // STATS
//   // --------------------------------------------------

//   const totalProducts = products.length;

//   const activeProducts = products.filter(
//     (product) => product.status === "ACTIVE"
//   ).length;

//   const inactiveProducts = products.filter(
//     (product) => product.status === "INACTIVE"
//   ).length;

//   const totalImages = products.reduce(
//     (total, product) =>
//       total + (product.images?.length || 0),
//     0
//   );

//   // --------------------------------------------------
//   // RESET FORM
//   // --------------------------------------------------

//   const resetForm = () => {
//     setForm({
//       categoryId: "",
//       name: "",
//       slug: "",
//       description: "",
//       status: "ACTIVE",
//     });

//     setEditingProduct(null);
//     setError("");
//   };

//   // --------------------------------------------------
//   // OPEN CREATE
//   // --------------------------------------------------

//   const handleAddProduct = () => {
//     resetForm();
//     setShowModal(true);
//   };

//   // --------------------------------------------------
//   // OPEN EDIT
//   // --------------------------------------------------

//   const handleEditProduct = (product) => {
//     setEditingProduct(product);

//     setForm({
//       categoryId: product.categoryId || "",
//       name: product.name || "",
//       slug: product.slug || "",
//       description: product.description || "",
//       status: product.status || "ACTIVE",
//     });

//     setError("");
//     setShowModal(true);
//   };

//   // --------------------------------------------------
//   // HANDLE FORM CHANGE
//   // --------------------------------------------------

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // --------------------------------------------------
//   // SUBMIT
//   // --------------------------------------------------

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!form.categoryId) {
//       setError("Please select a category.");
//       return;
//     }

//     if (!form.name.trim()) {
//       setError("Product name is required.");
//       return;
//     }

//     if (!form.slug.trim()) {
//       setError("Product slug is required.");
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");

//       const payload = {
//         categoryId: form.categoryId,
//         name: form.name.trim(),
//         slug: form.slug.trim(),
//         description:
//           form.description.trim() || null,
//         status: form.status,
//       };

//       if (editingProduct) {
//         await productService.update(
//           editingProduct.id,
//           payload
//         );

//         setSuccessMessage(
//           "Product updated successfully."
//         );
//       } else {
//         await productService.create(payload);

//         setSuccessMessage(
//           "Product created successfully."
//         );
//       }

//       setShowModal(false);
//       resetForm();

//       await fetchProducts();

//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 3000);
//     } catch (err) {
//       console.error("Save product error:", err);

//       setError(
//         err?.response?.data?.message ||
//           "Unable to save product."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --------------------------------------------------
//   // VIEW
//   // --------------------------------------------------

//   const handleViewProduct = async (product) => {
//     try {
//       const response = await productService.getById(
//         product.id
//       );

//       setViewingProduct(
//         response?.product || product
//       );

//       setShowViewModal(true);
//     } catch (err) {
//       console.error("View product error:", err);

//       setViewingProduct(product);
//       setShowViewModal(true);
//     }
//   };

//   // --------------------------------------------------
//   // STATUS
//   // --------------------------------------------------

//   const handleStatusChange = async (
//     product,
//     newStatus
//   ) => {
//     try {
//       await productService.updateStatus(
//         product.id,
//         newStatus
//       );

//       setProducts((prev) =>
//         prev.map((item) =>
//           item.id === product.id
//             ? {
//                 ...item,
//                 status: newStatus,
//               }
//             : item
//         )
//       );

//       setSuccessMessage(
//         `Product ${
//           newStatus === "ACTIVE"
//             ? "activated"
//             : "deactivated"
//         } successfully.`
//       );

//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 2500);
//     } catch (err) {
//       console.error(
//         "Change product status error:",
//         err
//       );

//       setError(
//         err?.response?.data?.message ||
//           "Unable to change product status."
//       );
//     }
//   };

//   // --------------------------------------------------
//   // DELETE
//   // --------------------------------------------------

//   const handleDeleteClick = (product) => {
//     setDeletingProduct(product);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!deletingProduct) return;

//     try {
//       setSaving(true);

//       await productService.remove(
//         deletingProduct.id
//       );

//       setProducts((prev) =>
//         prev.filter(
//           (item) =>
//             item.id !== deletingProduct.id
//         )
//       );

//       setShowDeleteModal(false);
//       setDeletingProduct(null);

//       setSuccessMessage(
//         "Product deleted successfully."
//       );

//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 3000);
//     } catch (err) {
//       console.error("Delete product error:", err);

//       setError(
//         err?.response?.data?.message ||
//           "Unable to delete product."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --------------------------------------------------
//   // IMAGE MODAL
//   // --------------------------------------------------

//   const handleManageImages = (product) => {
//     setSelectedProduct(product);
//     setImageUrl("");
//     setImagePrimary(false);
//     setShowImageModal(true);
//   };

//   const handleAddImage = async (event) => {
//     event.preventDefault();

//     if (!selectedProduct) return;

//     if (!imageUrl.trim()) {
//       setError("Image URL is required.");
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");

//       await productService.addImage(
//         selectedProduct.id,
//         {
//           imageUrl: imageUrl.trim(),
//           isPrimary: imagePrimary,
//         }
//       );

//       setImageUrl("");
//       setImagePrimary(false);

//       const response =
//         await productService.getById(
//           selectedProduct.id
//         );

//       const updatedProduct =
//         response?.product || selectedProduct;

//       setSelectedProduct(updatedProduct);

//       setProducts((prev) =>
//         prev.map((product) =>
//           product.id === selectedProduct.id
//             ? updatedProduct
//             : product
//         )
//       );

//       setSuccessMessage(
//         "Product image added successfully."
//       );

//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 2500);
//     } catch (err) {
//       console.error("Add image error:", err);

//       setError(
//         err?.response?.data?.message ||
//           "Unable to add product image."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --------------------------------------------------
//   // DELETE IMAGE
//   // --------------------------------------------------

//   const handleDeleteImage = async (imageId) => {
//     if (!window.confirm("Delete this image?")) {
//       return;
//     }

//     try {
//       setSaving(true);

//       await productService.deleteImage(
//         imageId
//       );

//       const response =
//         await productService.getById(
//           selectedProduct.id
//         );

//       const updatedProduct =
//         response?.product || selectedProduct;

//       setSelectedProduct(updatedProduct);

//       setProducts((prev) =>
//         prev.map((product) =>
//           product.id === selectedProduct.id
//             ? updatedProduct
//             : product
//         )
//       );

//       setSuccessMessage(
//         "Product image deleted successfully."
//       );

//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 2500);
//     } catch (err) {
//       console.error(
//         "Delete product image error:",
//         err
//       );

//       setError(
//         err?.response?.data?.message ||
//           "Unable to delete product image."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --------------------------------------------------
//   // COPY SLUG
//   // --------------------------------------------------

//   const copySlug = async (slug) => {
//     try {
//       await navigator.clipboard.writeText(slug);

//       setSuccessMessage(
//         "Slug copied to clipboard."
//       );

//       setTimeout(() => {
//         setSuccessMessage("");
//       }, 1800);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // --------------------------------------------------
//   // IMAGE HELPER
//   // --------------------------------------------------

//   const getProductImage = (product) => {
//     const primaryImage =
//       product.images?.find(
//         (image) => image.isPrimary
//       );

//     return (
//       primaryImage?.imageUrl ||
//       product.images?.[0]?.imageUrl ||
//       null
//     );
//   };

//   const getImageUrl = (url) => {
//     if (!url) return "";

//     if (
//       url.startsWith("http://") ||
//       url.startsWith("https://")
//     ) {
//       return url;
//     }

//     const baseUrl =
//       import.meta.env.VITE_API_URL ||
//       "http://localhost:5000/api";

//     return `${baseUrl.replace(
//       "/api",
//       ""
//     )}${url.startsWith("/") ? "" : "/"}${url}`;
//   };

//   // --------------------------------------------------
//   // KEYBOARD SHORTCUT
//   // --------------------------------------------------

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (
//         (event.ctrlKey || event.metaKey) &&
//         event.key.toLowerCase() === "k"
//       ) {
//         event.preventDefault();
//         searchInputRef.current?.focus();
//       }

//       if (
//         event.key === "Escape" &&
//         showModal
//       ) {
//         setShowModal(false);
//       }
//     };

//     window.addEventListener(
//       "keydown",
//       handleKeyDown
//     );

//     return () =>
//       window.removeEventListener(
//         "keydown",
//         handleKeyDown
//       );
//   }, [showModal]);

//   // --------------------------------------------------
//   // RENDER
//   // --------------------------------------------------

//   return (
//     <div className="mmics-products-page">

//       {/* HEADER */}

//       <div className="mmics-products-header">
//         <div>
//           <div className="mmics-products-eyebrow">
//             PRODUCT MANAGEMENT
//           </div>

//           <h1>Products</h1>

//           <p>
//             Manage your product catalogue,
//             categories and product imagery.
//           </p>
//         </div>

//         <div className="mmics-products-header-actions">
//           <button
//             className="mmics-products-refresh-btn"
//             onClick={fetchProducts}
//             title="Refresh"
//           >
//             <RefreshCw size={17} />
//           </button>

//           <button
//             className="mmics-products-add-btn"
//             onClick={handleAddProduct}
//           >
//             <Plus size={18} />
//             Add Product
//           </button>
//         </div>
//       </div>

//       {/* SUCCESS */}

//       {successMessage && (
//         <div className="mmics-products-alert success">
//           <Check size={17} />
//           <span>{successMessage}</span>
//           <button
//             onClick={() =>
//               setSuccessMessage("")
//             }
//           >
//             <X size={15} />
//           </button>
//         </div>
//       )}

//       {/* ERROR */}

//       {error && !showModal && !showImageModal && (
//         <div className="mmics-products-alert error">
//           <AlertTriangle size={17} />
//           <span>{error}</span>

//           <button
//             onClick={() => setError("")}
//           >
//             <X size={15} />
//           </button>
//         </div>
//       )}

//       {/* STATS */}

//       <div className="mmics-products-stats">

//         <div className="mmics-product-stat-card">
//           <div className="mmics-product-stat-icon">
//             <Package size={20} />
//           </div>

//           <div>
//             <span>Total Products</span>
//             <strong>{totalProducts}</strong>
//           </div>
//         </div>

//         <div className="mmics-product-stat-card">
//           <div className="mmics-product-stat-icon active">
//             <Check size={20} />
//           </div>

//           <div>
//             <span>Active</span>
//             <strong>{activeProducts}</strong>
//           </div>
//         </div>

//         <div className="mmics-product-stat-card">
//           <div className="mmics-product-stat-icon inactive">
//             <PowerOff size={20} />
//           </div>

//           <div>
//             <span>Inactive</span>
//             <strong>{inactiveProducts}</strong>
//           </div>
//         </div>

//         <div className="mmics-product-stat-card">
//           <div className="mmics-product-stat-icon images">
//             <ImageIcon size={20} />
//           </div>

//           <div>
//             <span>Product Images</span>
//             <strong>{totalImages}</strong>
//           </div>
//         </div>

//       </div>

//       {/* TOOLBAR */}

//       <div className="mmics-products-toolbar">

//         <div className="mmics-products-search">
//           <Search size={18} />

//           <input
//             ref={searchInputRef}
//             type="text"
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={(event) =>
//               setSearchTerm(
//                 event.target.value
//               )
//             }
//           />

//           <kbd>Ctrl K</kbd>
//         </div>

//         <div className="mmics-products-filters">

//           <div className="mmics-products-filter">
//             <Package size={16} />

//             <select
//               value={categoryFilter}
//               onChange={(event) =>
//                 setCategoryFilter(
//                   event.target.value
//                 )
//               }
//             >
//               <option value="ALL">
//                 All Categories
//               </option>

//               {categories.map((category) => (
//                 <option
//                   key={category.id}
//                   value={category.id}
//                 >
//                   {category.name}
//                 </option>
//               ))}
//             </select>

//             <ChevronDown size={15} />
//           </div>

//           <div className="mmics-products-filter">
//             <Power size={16} />

//             <select
//               value={statusFilter}
//               onChange={(event) =>
//                 setStatusFilter(
//                   event.target.value
//                 )
//               }
//             >
//               <option value="ALL">
//                 All Status
//               </option>

//               <option value="ACTIVE">
//                 Active
//               </option>

//               <option value="INACTIVE">
//                 Inactive
//               </option>
//             </select>

//             <ChevronDown size={15} />
//           </div>

//         </div>
//       </div>

//       {/* TABLE */}

//       <div className="mmics-products-table-card">

//         <div className="mmics-products-table-top">
//           <div>
//             <h2>Product Catalogue</h2>

//             <span>
//               {filteredProducts.length}{" "}
//               {filteredProducts.length === 1
//                 ? "product"
//                 : "products"}{" "}
//               shown
//             </span>
//           </div>
//         </div>

//         {loading ? (
//           <div className="mmics-products-loading">
//             <div className="mmics-products-spinner" />
//             <p>Loading products...</p>
//           </div>
//         ) : filteredProducts.length === 0 ? (
//           <div className="mmics-products-empty">
//             <div className="mmics-products-empty-icon">
//               <Package size={30} />
//             </div>

//             <h3>No products found</h3>

//             <p>
//               {searchTerm ||
//               categoryFilter !== "ALL" ||
//               statusFilter !== "ALL"
//                 ? "Try changing your filters or search."
//                 : "Start by adding your first product."}
//             </p>

//             {!searchTerm &&
//               categoryFilter === "ALL" &&
//               statusFilter === "ALL" && (
//                 <button
//                   onClick={handleAddProduct}
//                   className="mmics-products-empty-btn"
//                 >
//                   <Plus size={16} />
//                   Add Product
//                 </button>
//               )}
//           </div>
//         ) : (
//           <div className="mmics-products-table-wrapper">
//             <table className="mmics-products-table">

//               <thead>
//                 <tr>
//                   <th>PRODUCT</th>
//                   <th>CATEGORY</th>
//                   <th>SLUG</th>
//                   <th>IMAGES</th>
//                   <th>STATUS</th>
//                   <th>UPDATED</th>
//                   <th></th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredProducts.map(
//                   (product) => {
//                     const productImage =
//                       getProductImage(product);

//                     return (
//                       <tr key={product.id}>

//                         {/* PRODUCT */}

//                         <td>
//                           <div className="mmics-product-info">

//                             <div className="mmics-product-thumb">
//                               {productImage ? (
//                                 <img
//                                   src={getImageUrl(
//                                     productImage
//                                   )}
//                                   alt={
//                                     product.name
//                                   }
//                                 />
//                               ) : (
//                                 <Package
//                                   size={21}
//                                 />
//                               )}
//                             </div>

//                             <div>
//                               <strong>
//                                 {product.name}
//                               </strong>

//                               <span>
//                                 {product.description
//                                   ? product.description
//                                       .replace(
//                                         /\s+/g,
//                                         " "
//                                       )
//                                       .slice(
//                                         0,
//                                         65
//                                       ) +
//                                     (product
//                                       .description
//                                       .length >
//                                     65
//                                       ? "..."
//                                       : "")
//                                   : "No description"}
//                               </span>
//                             </div>

//                           </div>
//                         </td>

//                         {/* CATEGORY */}

//                         <td>
//                           <span className="mmics-product-category">
//                             {product.category
//                               ?.name ||
//                               "Uncategorized"}
//                           </span>
//                         </td>

//                         {/* SLUG */}

//                         <td>
//                           <div className="mmics-product-slug">
//                             <span>
//                               /{product.slug}
//                             </span>

//                             <button
//                               onClick={() =>
//                                 copySlug(
//                                   product.slug
//                                 )
//                               }
//                               title="Copy slug"
//                             >
//                               <Copy
//                                 size={14}
//                               />
//                             </button>
//                           </div>
//                         </td>

//                         {/* IMAGES */}

//                         <td>
//                           <button
//                             className="mmics-product-image-count"
//                             onClick={() =>
//                               handleManageImages(
//                                 product
//                               )
//                             }
//                           >
//                             <ImageIcon
//                               size={15}
//                             />

//                             <span>
//                               {product.images
//                                 ?.length || 0}
//                             </span>
//                           </button>
//                         </td>

//                         {/* STATUS */}

//                         <td>
//                           <span
//                             className={`mmics-product-status ${
//                               product.status ===
//                               "ACTIVE"
//                                 ? "active"
//                                 : "inactive"
//                             }`}
//                           >
//                             <span className="status-dot" />

//                             {product.status ===
//                             "ACTIVE"
//                               ? "Active"
//                               : "Inactive"}
//                           </span>
//                         </td>

//                         {/* UPDATED */}

//                         <td>
//                           <span className="mmics-product-date">
//                             {product.updatedAt
//                               ? new Date(
//                                   product.updatedAt
//                                 ).toLocaleDateString(
//                                   "en-IN",
//                                   {
//                                     day: "2-digit",
//                                     month: "short",
//                                     year: "numeric",
//                                   }
//                                 )
//                               : "—"}
//                           </span>
//                         </td>

//                         {/* ACTIONS */}

//                         <td>
//                           <div className="mmics-product-actions">

//                             <button
//                               title="View"
//                               onClick={() =>
//                                 handleViewProduct(
//                                   product
//                                 )
//                               }
//                             >
//                               <Eye size={16} />
//                             </button>

//                             <button
//                               title="Edit"
//                               onClick={() =>
//                                 handleEditProduct(
//                                   product
//                                 )
//                               }
//                             >
//                               <Edit3 size={16} />
//                             </button>

//                             <button
//                               title="Images"
//                               onClick={() =>
//                                 handleManageImages(
//                                   product
//                                 )
//                               }
//                             >
//                               <ImageIcon
//                                 size={16}
//                               />
//                             </button>

//                             <button
//                               title={
//                                 product.status ===
//                                 "ACTIVE"
//                                   ? "Deactivate"
//                                   : "Activate"
//                               }
//                               onClick={() =>
//                                 handleStatusChange(
//                                   product,
//                                   product.status ===
//                                     "ACTIVE"
//                                     ? "INACTIVE"
//                                     : "ACTIVE"
//                                 )
//                               }
//                             >
//                               {product.status ===
//                               "ACTIVE" ? (
//                                 <PowerOff
//                                   size={16}
//                                 />
//                               ) : (
//                                 <Power
//                                   size={16}
//                                 />
//                               )}
//                             </button>

//                             <button
//                               className="danger"
//                               title="Delete"
//                               onClick={() =>
//                                 handleDeleteClick(
//                                   product
//                                 )
//                               }
//                             >
//                               <Trash2
//                                 size={16}
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

//       {/* =========================================
//           ADD / EDIT MODAL
//       ========================================== */}

//       {showModal && (
//         <div
//           className="mmics-products-modal-overlay"
//           onMouseDown={(event) => {
//             if (
//               event.target === event.currentTarget
//             ) {
//               setShowModal(false);
//             }
//           }}
//         >
//           <div className="mmics-products-modal">

//             <div className="mmics-products-modal-header">
//               <div>
//                 <span>
//                   {editingProduct
//                     ? "PRODUCT MANAGEMENT"
//                     : "NEW PRODUCT"}
//                 </span>

//                 <h2>
//                   {editingProduct
//                     ? "Edit Product"
//                     : "Add Product"}
//                 </h2>
//               </div>

//               <button
//                 onClick={() =>
//                   setShowModal(false)
//                 }
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form
//               onSubmit={handleSubmit}
//               className="mmics-products-form"
//             >

//               {error && (
//                 <div className="mmics-products-form-error">
//                   <AlertTriangle size={16} />
//                   {error}
//                 </div>
//               )}

//               {/* CATEGORY */}

//               <div className="mmics-products-form-group">

//                 <label>
//                   Category
//                   <span>*</span>
//                 </label>

//                 <div className="mmics-products-select-wrap">
//                   <Package size={16} />

//                   <select
//                     name="categoryId"
//                     value={form.categoryId}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">
//                       Select category
//                     </option>

//                     {categories.map(
//                       (category) => (
//                         <option
//                           key={category.id}
//                           value={category.id}
//                         >
//                           {category.name}
//                         </option>
//                       )
//                     )}
//                   </select>

//                   <ChevronDown size={15} />
//                 </div>

//               </div>

//               {/* NAME */}

//               <div className="mmics-products-form-group">

//                 <label>
//                   Product Name
//                   <span>*</span>
//                 </label>

//                 <input
//                   type="text"
//                   name="name"
//                   value={form.name}
//                   onChange={(event) =>
//                     handleNameChange(
//                       event.target.value
//                     )
//                   }
//                   placeholder="Enter product name"
//                   required
//                 />

//               </div>

//               {/* SLUG */}

//               <div className="mmics-products-form-group">

//                 <label>
//                   Slug
//                   <span>*</span>
//                 </label>

//                 <div className="mmics-products-slug-input">

//                   <span>/</span>

//                   <input
//                     type="text"
//                     name="slug"
//                     value={form.slug}
//                     onChange={handleChange}
//                     placeholder="product-slug"
//                     required
//                   />

//                 </div>

//                 <small>
//                   Used for the public product URL.
//                 </small>

//               </div>

//               {/* DESCRIPTION */}

//               <div className="mmics-products-form-group">

//                 <label>
//                   Description
//                 </label>

//                 <textarea
//                   name="description"
//                   value={form.description}
//                   onChange={handleChange}
//                   placeholder="Enter product description..."
//                   rows={5}
//                 />

//               </div>

//               {/* STATUS */}

//               <div className="mmics-products-form-group">

//                 <label>
//                   Status
//                 </label>

//                 <div className="mmics-products-status-options">

//                   <button
//                     type="button"
//                     className={
//                       form.status ===
//                       "ACTIVE"
//                         ? "selected"
//                         : ""
//                     }
//                     onClick={() =>
//                       setForm((prev) => ({
//                         ...prev,
//                         status: "ACTIVE",
//                       }))
//                     }
//                   >
//                     <Check size={15} />
//                     Active
//                   </button>

//                   <button
//                     type="button"
//                     className={
//                       form.status ===
//                       "INACTIVE"
//                         ? "selected"
//                         : ""
//                     }
//                     onClick={() =>
//                       setForm((prev) => ({
//                         ...prev,
//                         status: "INACTIVE",
//                       }))
//                     }
//                   >
//                     <PowerOff
//                       size={15}
//                     />
//                     Inactive
//                   </button>

//                 </div>

//               </div>

//               {/* FOOTER */}

//               <div className="mmics-products-modal-footer">

//                 <button
//                   type="button"
//                   className="secondary"
//                   onClick={() =>
//                     setShowModal(false)
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
//                       <span className="button-spinner" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Check size={17} />
//                       {editingProduct
//                         ? "Update Product"
//                         : "Create Product"}
//                     </>
//                   )}
//                 </button>

//               </div>

//             </form>
//           </div>
//         </div>
//       )}

//       {/* =========================================
//           VIEW MODAL
//       ========================================== */}

//       {showViewModal &&
//         viewingProduct && (
//           <div
//             className="mmics-products-modal-overlay"
//             onMouseDown={(event) => {
//               if (
//                 event.target ===
//                 event.currentTarget
//               ) {
//                 setShowViewModal(false);
//               }
//             }}
//           >
//             <div className="mmics-products-view-modal">

//               <div className="mmics-products-modal-header">
//                 <div>
//                   <span>
//                     PRODUCT DETAILS
//                   </span>

//                   <h2>
//                     {viewingProduct.name}
//                   </h2>
//                 </div>

//                 <button
//                   onClick={() =>
//                     setShowViewModal(false)
//                   }
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="mmics-products-view-content">

//                 <div className="mmics-products-view-gallery">

//                   {viewingProduct.images
//                     ?.length ? (
//                     viewingProduct.images.map(
//                       (image) => (
//                         <div
//                           key={image.id}
//                           className={`mmics-products-view-image ${
//                             image.isPrimary
//                               ? "primary"
//                               : ""
//                           }`}
//                         >
//                           <img
//                             src={getImageUrl(
//                               image.imageUrl
//                             )}
//                             alt={
//                               viewingProduct.name
//                             }
//                           />

//                           {image.isPrimary && (
//                             <span>
//                               Primary
//                             </span>
//                           )}
//                         </div>
//                       )
//                     )
//                   ) : (
//                     <div className="mmics-products-no-image">
//                       <ImageIcon
//                         size={32}
//                       />
//                       <span>
//                         No product images
//                       </span>
//                     </div>
//                   )}

//                 </div>

//                 <div className="mmics-products-view-details">

//                   <div className="mmics-products-detail-item">
//                     <span>
//                       Category
//                     </span>

//                     <strong>
//                       {viewingProduct
//                         .category?.name ||
//                         "—"}
//                     </strong>
//                   </div>

//                   <div className="mmics-products-detail-item">
//                     <span>
//                       Slug
//                     </span>

//                     <strong>
//                       /{viewingProduct.slug}
//                     </strong>
//                   </div>

//                   <div className="mmics-products-detail-item">
//                     <span>
//                       Status
//                     </span>

//                     <span
//                       className={`mmics-product-status ${
//                         viewingProduct.status ===
//                         "ACTIVE"
//                           ? "active"
//                           : "inactive"
//                       }`}
//                     >
//                       <span className="status-dot" />

//                       {viewingProduct.status ===
//                       "ACTIVE"
//                         ? "Active"
//                         : "Inactive"}
//                     </span>
//                   </div>

//                   <div className="mmics-products-detail-item">
//                     <span>
//                       Created
//                     </span>

//                     <strong>
//                       {viewingProduct.createdAt
//                         ? new Date(
//                             viewingProduct.createdAt
//                           ).toLocaleDateString(
//                             "en-IN",
//                             {
//                               day: "2-digit",
//                               month:
//                                 "long",
//                               year: "numeric",
//                             }
//                           )
//                         : "—"}
//                     </strong>
//                   </div>

//                   <div className="mmics-products-detail-description">

//                     <span>
//                       Description
//                     </span>

//                     <p>
//                       {viewingProduct.description ||
//                         "No description provided."}
//                     </p>

//                   </div>

//                 </div>

//               </div>

//               <div className="mmics-products-modal-footer">

//                 <button
//                   className="secondary"
//                   onClick={() =>
//                     setShowViewModal(false)
//                   }
//                 >
//                   Close
//                 </button>

//                 <button
//                   className="primary"
//                   onClick={() => {
//                     setShowViewModal(
//                       false
//                     );
//                     handleEditProduct(
//                       viewingProduct
//                     );
//                   }}
//                 >
//                   <Edit3 size={16} />
//                   Edit Product
//                 </button>

//               </div>

//             </div>
//           </div>
//         )}

//       {/* =========================================
//           IMAGE MANAGEMENT MODAL
//       ========================================== */}

//       {showImageModal &&
//         selectedProduct && (
//           <div
//             className="mmics-products-modal-overlay"
//             onMouseDown={(event) => {
//               if (
//                 event.target ===
//                 event.currentTarget
//               ) {
//                 setShowImageModal(false);
//               }
//             }}
//           >
//             <div className="mmics-products-image-modal">

//               <div className="mmics-products-modal-header">
//                 <div>
//                   <span>
//                     MEDIA MANAGEMENT
//                   </span>

//                   <h2>
//                     Product Images
//                   </h2>

//                   <p>
//                     {selectedProduct.name}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() =>
//                     setShowImageModal(false)
//                   }
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="mmics-products-image-content">

//                 {/* EXISTING IMAGES */}

//                 <div className="mmics-products-existing-images">

//                   <div className="mmics-products-section-title">
//                     <strong>
//                       Current Images
//                     </strong>

//                     <span>
//                       {selectedProduct
//                         .images
//                         ?.length || 0}{" "}
//                       images
//                     </span>
//                   </div>

//                   {selectedProduct.images
//                     ?.length ? (
//                     <div className="mmics-products-image-grid">
//                       {selectedProduct.images.map(
//                         (image) => (
//                           <div
//                             className="mmics-products-image-card"
//                             key={image.id}
//                           >
//                             <img
//                               src={getImageUrl(
//                                 image.imageUrl
//                               )}
//                               alt={
//                                 selectedProduct.name
//                               }
//                             />

//                             {image.isPrimary && (
//                               <span className="primary-badge">
//                                 Primary
//                               </span>
//                             )}

//                             <button
//                               className="image-delete-btn"
//                               onClick={() =>
//                                 handleDeleteImage(
//                                   image.id
//                                 )
//                               }
//                               disabled={
//                                 saving
//                               }
//                             >
//                               <Trash2
//                                 size={15}
//                               />
//                             </button>
//                           </div>
//                         )
//                       )}
//                     </div>
//                   ) : (
//                     <div className="mmics-products-no-images">
//                       <ImageIcon
//                         size={26}
//                       />

//                       <span>
//                         No images added yet.
//                       </span>
//                     </div>
//                   )}

//                 </div>

//                 {/* ADD IMAGE */}

//                 <form
//                   className="mmics-products-add-image"
//                   onSubmit={handleAddImage}
//                 >

//                   <div className="mmics-products-section-title">
//                     <strong>
//                       Add Image
//                     </strong>
//                   </div>

//                   <div className="mmics-products-form-group">

//                     <label>
//                       Image URL
//                       <span>*</span>
//                     </label>

//                     <div className="mmics-products-image-url-input">
//                       <ImageIcon
//                         size={16}
//                       />

//                       <input
//                         type="url"
//                         value={imageUrl}
//                         onChange={(event) =>
//                           setImageUrl(
//                             event.target
//                               .value
//                           )
//                         }
//                         placeholder="https://example.com/product-image.jpg"
//                       />
//                     </div>

//                   </div>

//                   <label className="mmics-products-primary-checkbox">

//                     <input
//                       type="checkbox"
//                       checked={
//                         imagePrimary
//                       }
//                       onChange={(event) =>
//                         setImagePrimary(
//                           event.target
//                             .checked
//                         )
//                       }
//                     />

//                     <span className="custom-checkbox">
//                       {imagePrimary && (
//                         <Check size={12} />
//                       )}
//                     </span>

//                     Set as primary image

//                   </label>

//                   {imageUrl && (
//                     <div className="mmics-products-image-preview">
//                       <img
//                         src={imageUrl}
//                         alt="Preview"
//                         onError={(event) => {
//                           event.currentTarget.style.display =
//                             "none";
//                         }}
//                       />
//                     </div>
//                   )}

//                   <button
//                     type="submit"
//                     className="mmics-products-add-image-btn"
//                     disabled={
//                       saving ||
//                       !imageUrl.trim()
//                     }
//                   >
//                     <Upload size={16} />

//                     {saving
//                       ? "Adding..."
//                       : "Add Image"}
//                   </button>

//                 </form>

//               </div>

//             </div>
//           </div>
//         )}

//       {/* =========================================
//           DELETE MODAL
//       ========================================== */}

//       {showDeleteModal &&
//         deletingProduct && (
//           <div
//             className="mmics-products-modal-overlay"
//             onMouseDown={(event) => {
//               if (
//                 event.target ===
//                 event.currentTarget
//               ) {
//                 setShowDeleteModal(false);
//               }
//             }}
//           >
//             <div className="mmics-products-delete-modal">

//               <div className="mmics-products-delete-icon">
//                 <Trash2 size={24} />
//               </div>

//               <h2>
//                 Delete Product?
//               </h2>

//               <p>
//                 You are about to permanently
//                 delete{" "}
//                 <strong>
//                   {deletingProduct.name}
//                 </strong>
//                 .
//               </p>

//               <div className="mmics-products-delete-warning">
//                 <AlertTriangle
//                   size={16}
//                 />

//                 <span>
//                   This action cannot be
//                   undone. Associated product
//                   images will also be removed
//                   according to your database
//                   relation rules.
//                 </span>
//               </div>

//               <div className="mmics-products-delete-actions">

//                 <button
//                   className="secondary"
//                   onClick={() =>
//                     setShowDeleteModal(false)
//                   }
//                   disabled={saving}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   className="danger"
//                   onClick={confirmDelete}
//                   disabled={saving}
//                 >
//                   {saving ? (
//                     <>
//                       <span className="button-spinner" />
//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 size={16} />
//                       Delete Product
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

// export default Products;



import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  X,
  Check,
  ChevronDown,
  Package,
  Image as ImageIcon,
  Upload,
  Power,
  PowerOff,
  AlertTriangle,
  Copy,
  RefreshCw,
} from "lucide-react";

import productService from "../../services/productService";
import categoryService from "../../services/categoryService";

import "./Products.css";

const Products = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [showModal, setShowModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showImageModal, setShowImageModal] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [viewingProduct, setViewingProduct] =
    useState(null);

  const [deletingProduct, setDeletingProduct] =
    useState(null);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    status: "ACTIVE",
  });

  // =====================================================
  // PRODUCT IMAGE UPLOAD STATE
  // =====================================================

  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [imagePrimary, setImagePrimary] =
    useState(false);

  const productImageInputRef =
    useRef(null);

  const searchInputRef =
    useRef(null);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await productService.getAll();

      setProducts(
        response?.products || []
      );
    } catch (err) {
      console.error(
        "Fetch products error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to fetch products."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  const fetchCategories = async () => {
    try {
      const response =
        await categoryService.getAll();

      setCategories(
        response?.categories || []
      );
    } catch (err) {
      console.error(
        "Fetch categories error:",
        err
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // =====================================================
  // CLEANUP IMAGE PREVIEW
  // =====================================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(
          imagePreview
        );
      }
    };
  }, [imagePreview]);

  // =====================================================
  // GENERATE SLUG
  // =====================================================

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // =====================================================
  // NAME CHANGE
  // =====================================================

  const handleNameChange = (value) => {
    setForm((previous) => ({
      ...previous,

      name: value,

      ...(editingProduct
        ? {}
        : {
            slug: generateSlug(
              value
            ),
          }),
    }));
  };

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => {
        const search =
          searchTerm
            .toLowerCase()
            .trim();

        const matchesSearch =
          !search ||
          product.name
            ?.toLowerCase()
            .includes(search) ||
          product.slug
            ?.toLowerCase()
            .includes(search) ||
          product.category?.name
            ?.toLowerCase()
            .includes(search);

        const matchesStatus =
          statusFilter === "ALL" ||
          product.status ===
            statusFilter;

        const matchesCategory =
          categoryFilter === "ALL" ||
          product.categoryId ===
            categoryFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory
        );
      }
    );
  }, [
    products,
    searchTerm,
    statusFilter,
    categoryFilter,
  ]);

  // =====================================================
  // STATS
  // =====================================================

  const totalProducts =
    products.length;

  const activeProducts =
    products.filter(
      (product) =>
        product.status ===
        "ACTIVE"
    ).length;

  const inactiveProducts =
    products.filter(
      (product) =>
        product.status ===
        "INACTIVE"
    ).length;

  const totalImages =
    products.reduce(
      (total, product) =>
        total +
        (product.images
          ?.length || 0),
      0
    );

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm({
      categoryId: "",
      name: "",
      slug: "",
      description: "",
      status: "ACTIVE",
    });

    setEditingProduct(null);
    setError("");
  };

  // =====================================================
  // RESET IMAGE UPLOAD
  // =====================================================

  const resetImageUpload = () => {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImageFile(null);
    setImagePreview("");
    setImagePrimary(false);

    if (
      productImageInputRef.current
    ) {
      productImageInputRef.current.value =
        "";
    }
  };

  // =====================================================
  // ADD PRODUCT
  // =====================================================

  const handleAddProduct = () => {
    resetForm();
    setShowModal(true);
  };

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const handleEditProduct = (
    product
  ) => {
    setEditingProduct(product);

    setForm({
      categoryId:
        product.categoryId || "",

      name:
        product.name || "",

      slug:
        product.slug || "",

      description:
        product.description || "",

      status:
        product.status ||
        "ACTIVE",
    });

    setError("");
    setShowModal(true);
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT PRODUCT
  // =====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!form.categoryId) {
      setError(
        "Please select a category."
      );
      return;
    }

    if (!form.name.trim()) {
      setError(
        "Product name is required."
      );
      return;
    }

    if (!form.slug.trim()) {
      setError(
        "Product slug is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        categoryId:
          form.categoryId,

        name:
          form.name.trim(),

        slug:
          form.slug.trim(),

        description:
          form.description.trim() ||
          null,

        status:
          form.status,
      };

      if (editingProduct) {
        await productService.update(
          editingProduct.id,
          payload
        );

        setSuccessMessage(
          "Product updated successfully."
        );
      } else {
        const response =
          await productService.create(
            payload
          );

        setSuccessMessage(
          "Product created successfully."
        );

        /*
         * If a photo was selected while
         * creating the product, upload it
         * immediately after creation.
         */

        if (
          imageFile &&
          response?.product?.id
        ) {
          await productService.addImage(
            response.product.id,
            imageFile,
            imagePrimary
          );

          resetImageUpload();
        }
      }

      setShowModal(false);
      resetForm();

      await fetchProducts();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Save product error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // VIEW PRODUCT
  // =====================================================

  const handleViewProduct = async (
    product
  ) => {
    try {
      const response =
        await productService.getById(
          product.id
        );

      setViewingProduct(
        response?.product ||
          product
      );

      setShowViewModal(true);
    } catch (err) {
      console.error(
        "View product error:",
        err
      );

      setViewingProduct(product);
      setShowViewModal(true);
    }
  };

  // =====================================================
  // STATUS CHANGE
  // =====================================================

  const handleStatusChange = async (
    product,
    newStatus
  ) => {
    try {
      await productService.updateStatus(
        product.id,
        newStatus
      );

      setProducts((previous) =>
        previous.map((item) =>
          item.id === product.id
            ? {
                ...item,
                status:
                  newStatus,
              }
            : item
        )
      );

      setSuccessMessage(
        `Product ${
          newStatus === "ACTIVE"
            ? "activated"
            : "deactivated"
        } successfully.`
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (err) {
      console.error(
        "Change product status error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to change product status."
      );
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDeleteClick = (
    product
  ) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete =
    async () => {
      if (!deletingProduct)
        return;

      try {
        setSaving(true);

        await productService.remove(
          deletingProduct.id
        );

        setProducts((previous) =>
          previous.filter(
            (item) =>
              item.id !==
              deletingProduct.id
          )
        );

        setShowDeleteModal(false);
        setDeletingProduct(null);

        setSuccessMessage(
          "Product deleted successfully."
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (err) {
        console.error(
          "Delete product error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Unable to delete product."
        );
      } finally {
        setSaving(false);
      }
    };

  // =====================================================
  // MANAGE PRODUCT IMAGES
  // =====================================================

  const handleManageImages = (
    product
  ) => {
    setSelectedProduct(product);

    resetImageUpload();

    setError("");

    setShowImageModal(true);
  };

  // =====================================================
  // IMAGE FILE SELECT
  // =====================================================

  const handleProductImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      event.target.value = "";

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Product image must be smaller than 5MB."
      );

      event.target.value = "";

      return;
    }

    setError("");

    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    const previewUrl =
      URL.createObjectURL(
        file
      );

    setImageFile(file);
    setImagePreview(
      previewUrl
    );
  };

  // =====================================================
  // ADD PRODUCT IMAGE
  // =====================================================

  const handleAddImage = async (
    event
  ) => {
    event.preventDefault();

    if (!selectedProduct) {
      return;
    }

    if (!imageFile) {
      setError(
        "Please select a product image."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      await productService.addImage(
        selectedProduct.id,
        imageFile,
        imagePrimary
      );

      const response =
        await productService.getById(
          selectedProduct.id
        );

      const updatedProduct =
        response?.product ||
        selectedProduct;

      setSelectedProduct(
        updatedProduct
      );

      setProducts((previous) =>
        previous.map(
          (product) =>
            product.id ===
            selectedProduct.id
              ? updatedProduct
              : product
        )
      );

      resetImageUpload();

      setSuccessMessage(
        "Product image uploaded successfully."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (err) {
      console.error(
        "Upload product image error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to upload product image."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE PRODUCT IMAGE
  // =====================================================

  const handleDeleteImage =
    async (imageId) => {
      if (
        !window.confirm(
          "Delete this product image?"
        )
      ) {
        return;
      }

      try {
        setSaving(true);
        setError("");

        await productService.deleteImage(
          imageId
        );

        const response =
          await productService.getById(
            selectedProduct.id
          );

        const updatedProduct =
          response?.product ||
          selectedProduct;

        setSelectedProduct(
          updatedProduct
        );

        setProducts((previous) =>
          previous.map(
            (product) =>
              product.id ===
              selectedProduct.id
                ? updatedProduct
                : product
          )
        );

        setSuccessMessage(
          "Product image deleted successfully."
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 2500);
      } catch (err) {
        console.error(
          "Delete product image error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Unable to delete product image."
        );
      } finally {
        setSaving(false);
      }
    };

  // =====================================================
  // COPY SLUG
  // =====================================================

  const copySlug = async (
    slug
  ) => {
    try {
      await navigator.clipboard.writeText(
        slug
      );

      setSuccessMessage(
        "Slug copied to clipboard."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 1800);
    } catch (err) {
      console.error(
        "Copy slug error:",
        err
      );
    }
  };

  // =====================================================
  // GET PRODUCT IMAGE
  // =====================================================

  const getProductImage = (
    product
  ) => {
    const primaryImage =
      product.images?.find(
        (image) =>
          image.isPrimary
      );

    return (
      primaryImage?.imageUrl ||
      product.images?.[0]
        ?.imageUrl ||
      null
    );
  };

  // =====================================================
  // BUILD IMAGE URL
  // =====================================================

  const getImageUrl = (url) => {
    if (!url) return "";

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    const apiUrl =
      import.meta.env
        .VITE_API_URL ||
      "http://localhost:5000/api";

    const serverUrl =
      apiUrl.replace(
        /\/api\/?$/,
        ""
      );

    return `${serverUrl}${
      url.startsWith("/")
        ? ""
        : "/"
    }${url}`;
  };

  // =====================================================
  // KEYBOARD SHORTCUT
  // =====================================================

  useEffect(() => {
    const handleKeyDown = (
      event
    ) => {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "k"
      ) {
        event.preventDefault();

        searchInputRef.current?.focus();
      }

      if (
        event.key === "Escape"
      ) {
        setShowModal(false);
        setShowViewModal(false);
        setShowImageModal(false);
        setShowDeleteModal(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="mmics-products-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mmics-products-header">

        <div>

          <div className="mmics-products-eyebrow">
            PRODUCT MANAGEMENT
          </div>

          <h1>
            Products
          </h1>

          <p>
            Manage your product catalogue,
            categories and product imagery.
          </p>

        </div>

        <div className="mmics-products-header-actions">

          <button
            type="button"
            className="mmics-products-refresh-btn"
            onClick={fetchProducts}
            title="Refresh products"
          >
            <RefreshCw
              size={17}
            />
          </button>

          <button
            type="button"
            className="mmics-products-add-btn"
            onClick={
              handleAddProduct
            }
          >
            <Plus
              size={18}
            />

            Add Product
          </button>

        </div>

      </div>

      {/* =================================================
          SUCCESS ALERT
      ================================================= */}

      {successMessage && (
        <div className="mmics-products-alert success">

          <Check
            size={17}
          />

          <span>
            {successMessage}
          </span>

          <button
            type="button"
            onClick={() =>
              setSuccessMessage("")
            }
          >
            <X size={15} />
          </button>

        </div>
      )}

      {/* =================================================
          ERROR ALERT
      ================================================= */}

      {error &&
        !showModal &&
        !showImageModal && (
          <div className="mmics-products-alert error">

            <AlertTriangle
              size={17}
            />

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <X size={15} />
            </button>

          </div>
        )}

      {/* =================================================
          STATS
      ================================================= */}

      <div className="mmics-products-stats">

        <div className="mmics-product-stat-card">

          <div className="mmics-product-stat-icon">
            <Package
              size={20}
            />
          </div>

          <div>
            <span>
              Total Products
            </span>

            <strong>
              {totalProducts}
            </strong>
          </div>

        </div>

        <div className="mmics-product-stat-card">

          <div className="mmics-product-stat-icon active">
            <Check
              size={20}
            />
          </div>

          <div>
            <span>
              Active
            </span>

            <strong>
              {activeProducts}
            </strong>
          </div>

        </div>

        <div className="mmics-product-stat-card">

          <div className="mmics-product-stat-icon inactive">
            <PowerOff
              size={20}
            />
          </div>

          <div>
            <span>
              Inactive
            </span>

            <strong>
              {inactiveProducts}
            </strong>
          </div>

        </div>

        <div className="mmics-product-stat-card">

          <div className="mmics-product-stat-icon images">
            <ImageIcon
              size={20}
            />
          </div>

          <div>
            <span>
              Product Images
            </span>

            <strong>
              {totalImages}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="mmics-products-toolbar">

        <div className="mmics-products-search">

          <Search
            size={18}
          />

          <input
            ref={
              searchInputRef
            }
            type="text"
            placeholder="Search products..."
            value={
              searchTerm
            }
            onChange={(
              event
            ) =>
              setSearchTerm(
                event.target
                  .value
              )
            }
          />

          <kbd>
            Ctrl K
          </kbd>

        </div>

        <div className="mmics-products-filters">

          <div className="mmics-products-filter">

            <Package
              size={16}
            />

            <select
              value={
                categoryFilter
              }
              onChange={(
                event
              ) =>
                setCategoryFilter(
                  event.target
                    .value
                )
              }
            >
              <option value="ALL">
                All Categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.id
                    }
                  >
                    {
                      category.name
                    }
                  </option>
                )
              )}
            </select>

            <ChevronDown
              size={15}
            />

          </div>

          <div className="mmics-products-filter">

            <Power
              size={16}
            />

            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) =>
                setStatusFilter(
                  event.target
                    .value
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

            <ChevronDown
              size={15}
            />

          </div>

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="mmics-products-table-card">

        <div className="mmics-products-table-top">

          <div>

            <h2>
              Product Catalogue
            </h2>

            <span>
              {
                filteredProducts.length
              }{" "}
              {filteredProducts.length ===
              1
                ? "product"
                : "products"}{" "}
              shown
            </span>

          </div>

        </div>

        {loading ? (
          <div className="mmics-products-loading">

            <div className="mmics-products-spinner" />

            <p>
              Loading products...
            </p>

          </div>
        ) : filteredProducts.length ===
          0 ? (
          <div className="mmics-products-empty">

            <div className="mmics-products-empty-icon">
              <Package
                size={30}
              />
            </div>

            <h3>
              No products found
            </h3>

            <p>
              {searchTerm ||
              categoryFilter !==
                "ALL" ||
              statusFilter !==
                "ALL"
                ? "Try changing your filters or search."
                : "Start by adding your first product."}
            </p>

            {!searchTerm &&
              categoryFilter ===
                "ALL" &&
              statusFilter ===
                "ALL" && (
                <button
                  type="button"
                  onClick={
                    handleAddProduct
                  }
                  className="mmics-products-empty-btn"
                >
                  <Plus
                    size={16}
                  />

                  Add Product
                </button>
              )}

          </div>
        ) : (
          <div className="mmics-products-table-wrapper">

            <table className="mmics-products-table">

              <thead>

                <tr>
                  <th>
                    PRODUCT
                  </th>

                  <th>
                    CATEGORY
                  </th>

                  <th>
                    SLUG
                  </th>

                  <th>
                    IMAGES
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    UPDATED
                  </th>

                  <th />
                </tr>

              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => {
                    const productImage =
                      getProductImage(
                        product
                      );

                    return (
                      <tr
                        key={
                          product.id
                        }
                      >

                        {/* PRODUCT */}

                        <td>

                          <div className="mmics-product-info">

                            <div className="mmics-product-thumb">

                              {productImage ? (
                                <img
                                  src={getImageUrl(
                                    productImage
                                  )}
                                  alt={
                                    product.name
                                  }
                                />
                              ) : (
                                <Package
                                  size={21}
                                />
                              )}

                            </div>

                            <div>

                              <strong>
                                {
                                  product.name
                                }
                              </strong>

                              <span>
                                {product.description
                                  ? product.description
                                      .replace(
                                        /\s+/g,
                                        " "
                                      )
                                      .slice(
                                        0,
                                        65
                                      ) +
                                    (product
                                      .description
                                      .length >
                                    65
                                      ? "..."
                                      : "")
                                  : "No description"}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td>

                          <span className="mmics-product-category">

                            {product
                              .category
                              ?.name ||
                              "Uncategorized"}

                          </span>

                        </td>

                        {/* SLUG */}

                        <td>

                          <div className="mmics-product-slug">

                            <span>
                              /
                              {
                                product.slug
                              }
                            </span>

                            <button
                              type="button"
                              title="Copy slug"
                              onClick={() =>
                                copySlug(
                                  product.slug
                                )
                              }
                            >
                              <Copy
                                size={14}
                              />
                            </button>

                          </div>

                        </td>

                        {/* IMAGES */}

                        <td>

                          <button
                            type="button"
                            className="mmics-product-image-count"
                            onClick={() =>
                              handleManageImages(
                                product
                              )
                            }
                          >
                            <ImageIcon
                              size={15}
                            />

                            <span>
                              {product
                                .images
                                ?.length ||
                                0}
                            </span>

                          </button>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`mmics-product-status ${
                              product.status ===
                              "ACTIVE"
                                ? "active"
                                : "inactive"
                            }`}
                          >

                            <span className="status-dot" />

                            {product.status ===
                            "ACTIVE"
                              ? "Active"
                              : "Inactive"}

                          </span>

                        </td>

                        {/* UPDATED */}

                        <td>

                          <span className="mmics-product-date">

                            {product.updatedAt
                              ? new Date(
                                  product.updatedAt
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month:
                                      "short",
                                    year:
                                      "numeric",
                                  }
                                )
                              : "—"}

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="mmics-product-actions">

                            <button
                              type="button"
                              title="View"
                              onClick={() =>
                                handleViewProduct(
                                  product
                                )
                              }
                            >
                              <Eye
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              title="Edit"
                              onClick={() =>
                                handleEditProduct(
                                  product
                                )
                              }
                            >
                              <Edit3
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              title="Images"
                              onClick={() =>
                                handleManageImages(
                                  product
                                )
                              }
                            >
                              <ImageIcon
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              title={
                                product.status ===
                                "ACTIVE"
                                  ? "Deactivate"
                                  : "Activate"
                              }
                              onClick={() =>
                                handleStatusChange(
                                  product,
                                  product.status ===
                                    "ACTIVE"
                                    ? "INACTIVE"
                                    : "ACTIVE"
                                )
                              }
                            >
                              {product.status ===
                              "ACTIVE" ? (
                                <PowerOff
                                  size={16}
                                />
                              ) : (
                                <Power
                                  size={16}
                                />
                              )}
                            </button>

                            <button
                              type="button"
                              className="danger"
                              title="Delete"
                              onClick={() =>
                                handleDeleteClick(
                                  product
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
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =================================================
          ADD / EDIT PRODUCT MODAL
      ================================================= */}

      {showModal && (
        <div
          className="mmics-products-modal-overlay"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowModal(
                false
              );
            }
          }}
        >

          <div className="mmics-products-modal">

            <div className="mmics-products-modal-header">

              <div>

                <span>
                  {editingProduct
                    ? "PRODUCT MANAGEMENT"
                    : "NEW PRODUCT"}
                </span>

                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
              >
                <X
                  size={20}
                />
              </button>

            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="mmics-products-form"
            >

              {error && (
                <div className="mmics-products-form-error">

                  <AlertTriangle
                    size={16}
                  />

                  {error}

                </div>
              )}

              {/* CATEGORY */}

              <div className="mmics-products-form-group">

                <label>
                  Category
                  <span>
                    *
                  </span>
                </label>

                <div className="mmics-products-select-wrap">

                  <Package
                    size={16}
                  />

                  <select
                    name="categoryId"
                    value={
                      form.categoryId
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      )
                    )}

                  </select>

                  <ChevronDown
                    size={15}
                  />

                </div>

              </div>

              {/* PRODUCT NAME */}

              <div className="mmics-products-form-group">

                <label>
                  Product Name
                  <span>
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={(
                    event
                  ) =>
                    handleNameChange(
                      event.target
                        .value
                    )
                  }
                  placeholder="Enter product name"
                  required
                />

              </div>

              {/* SLUG */}

              <div className="mmics-products-form-group">

                <label>
                  Slug
                  <span>
                    *
                  </span>
                </label>

                <div className="mmics-products-slug-input">

                  <span>
                    /
                  </span>

                  <input
                    type="text"
                    name="slug"
                    value={
                      form.slug
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="product-slug"
                    required
                  />

                </div>

                <small>
                  Used for the public
                  product URL.
                </small>

              </div>

              {/* DESCRIPTION */}

              <div className="mmics-products-form-group">

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
                  placeholder="Enter product description..."
                  rows={5}
                />

              </div>

              {/* PHOTO */}

              {!editingProduct && (
                <>
                  <div className="mmics-products-form-group">

                    <label>
                      Product Photo
                    </label>

                    <input
                      ref={
                        productImageInputRef
                      }
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={
                        handleProductImageChange
                      }
                      style={{
                        display:
                          "none",
                      }}
                    />

                    <button
                      type="button"
                      className="mmics-products-photo-upload"
                      onClick={() =>
                        productImageInputRef.current?.click()
                      }
                    >

                      <Upload
                        size={17}
                      />

                      <div>

                        <strong>
                          {imageFile
                            ? "Change Product Photo"
                            : "Upload Product Photo"}
                        </strong>

                        <span>
                          JPG, PNG or WEBP
                          · Max 5MB
                        </span>

                      </div>

                    </button>

                  </div>

                  {imagePreview && (
                    <div className="mmics-products-upload-preview">

                      <img
                        src={
                          imagePreview
                        }
                        alt="Product preview"
                      />

                      <button
                        type="button"
                        onClick={
                          resetImageUpload
                        }
                      >
                        <X
                          size={15}
                        />
                      </button>

                    </div>
                  )}

                  <label className="mmics-products-primary-checkbox">

                    <input
                      type="checkbox"
                      checked={
                        imagePrimary
                      }
                      onChange={(
                        event
                      ) =>
                        setImagePrimary(
                          event.target
                            .checked
                        )
                      }
                    />

                    <span className="custom-checkbox">

                      {imagePrimary && (
                        <Check
                          size={12}
                        />
                      )}

                    </span>

                    Set as primary image

                  </label>
                </>
              )}

              {/* STATUS */}

              <div className="mmics-products-form-group">

                <label>
                  Status
                </label>

                <div className="mmics-products-status-options">

                  <button
                    type="button"
                    className={
                      form.status ===
                      "ACTIVE"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setForm(
                        (
                          previous
                        ) => ({
                          ...previous,
                          status:
                            "ACTIVE",
                        })
                      )
                    }
                  >
                    <Check
                      size={15}
                    />

                    Active
                  </button>

                  <button
                    type="button"
                    className={
                      form.status ===
                      "INACTIVE"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setForm(
                        (
                          previous
                        ) => ({
                          ...previous,
                          status:
                            "INACTIVE",
                        })
                      )
                    }
                  >
                    <PowerOff
                      size={15}
                    />

                    Inactive
                  </button>

                </div>

              </div>

              {/* MODAL FOOTER */}

              <div className="mmics-products-modal-footer">

                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary"
                  disabled={
                    saving
                  }
                >

                  {saving ? (
                    <>
                      <span className="button-spinner" />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Check
                        size={17}
                      />

                      {editingProduct
                        ? "Update Product"
                        : "Create Product"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          VIEW PRODUCT MODAL
      ================================================= */}

      {showViewModal &&
        viewingProduct && (
          <div
            className="mmics-products-modal-overlay"
            onMouseDown={(
              event
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setShowViewModal(
                  false
                );
              }
            }}
          >

            <div className="mmics-products-view-modal">

              <div className="mmics-products-modal-header">

                <div>

                  <span>
                    PRODUCT DETAILS
                  </span>

                  <h2>
                    {
                      viewingProduct.name
                    }
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowViewModal(
                      false
                    )
                  }
                >
                  <X
                    size={20}
                  />
                </button>

              </div>

              <div className="mmics-products-view-content">

                {/* GALLERY */}

                <div className="mmics-products-view-gallery">

                  {viewingProduct.images
                    ?.length ? (
                    viewingProduct.images.map(
                      (
                        image
                      ) => (
                        <div
                          key={
                            image.id
                          }
                          className={`mmics-products-view-image ${
                            image.isPrimary
                              ? "primary"
                              : ""
                          }`}
                        >

                          <img
                            src={getImageUrl(
                              image.imageUrl
                            )}
                            alt={
                              viewingProduct.name
                            }
                          />

                          {image.isPrimary && (
                            <span>
                              Primary
                            </span>
                          )}

                        </div>
                      )
                    )
                  ) : (
                    <div className="mmics-products-no-image">

                      <ImageIcon
                        size={32}
                      />

                      <span>
                        No product
                        images
                      </span>

                    </div>
                  )}

                </div>

                {/* DETAILS */}

                <div className="mmics-products-view-details">

                  <div className="mmics-products-detail-item">

                    <span>
                      Category
                    </span>

                    <strong>
                      {
                        viewingProduct
                          .category
                          ?.name ||
                        "—"
                      }
                    </strong>

                  </div>

                  <div className="mmics-products-detail-item">

                    <span>
                      Slug
                    </span>

                    <strong>
                      /
                      {
                        viewingProduct.slug
                      }
                    </strong>

                  </div>

                  <div className="mmics-products-detail-item">

                    <span>
                      Status
                    </span>

                    <span
                      className={`mmics-product-status ${
                        viewingProduct.status ===
                        "ACTIVE"
                          ? "active"
                          : "inactive"
                      }`}
                    >

                      <span className="status-dot" />

                      {viewingProduct.status ===
                      "ACTIVE"
                        ? "Active"
                        : "Inactive"}

                    </span>

                  </div>

                  <div className="mmics-products-detail-item">

                    <span>
                      Created
                    </span>

                    <strong>
                      {viewingProduct.createdAt
                        ? new Date(
                            viewingProduct.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month:
                                "long",
                              year:
                                "numeric",
                            }
                          )
                        : "—"}
                    </strong>

                  </div>

                  <div className="mmics-products-detail-description">

                    <span>
                      Description
                    </span>

                    <p>
                      {
                        viewingProduct.description ||
                        "No description provided."
                      }
                    </p>

                  </div>

                </div>

              </div>

              <div className="mmics-products-modal-footer">

                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    setShowViewModal(
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
                    setShowViewModal(
                      false
                    );

                    handleEditProduct(
                      viewingProduct
                    );
                  }}
                >
                  <Edit3
                    size={16}
                  />

                  Edit Product
                </button>

              </div>

            </div>

          </div>
        )}

      {/* =================================================
          PRODUCT IMAGE MANAGEMENT
      ================================================= */}

      {showImageModal &&
        selectedProduct && (
          <div
            className="mmics-products-modal-overlay"
            onMouseDown={(
              event
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setShowImageModal(
                  false
                );
              }
            }}
          >

            <div className="mmics-products-image-modal">

              <div className="mmics-products-modal-header">

                <div>

                  <span>
                    MEDIA MANAGEMENT
                  </span>

                  <h2>
                    Product Images
                  </h2>

                  <p>
                    {
                      selectedProduct.name
                    }
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowImageModal(
                      false
                    );

                    resetImageUpload();
                  }}
                >
                  <X
                    size={20}
                  />
                </button>

              </div>

              {/* IMAGE ERROR */}

              {error && (
                <div
                  className="mmics-products-form-error"
                  style={{
                    margin:
                      "15px 20px 0",
                  }}
                >

                  <AlertTriangle
                    size={16}
                  />

                  {error}

                  <button
                    type="button"
                    onClick={() =>
                      setError("")
                    }
                    style={{
                      marginLeft:
                        "auto",
                      border: 0,
                      background:
                        "transparent",
                      cursor:
                        "pointer",
                    }}
                  >
                    <X
                      size={14}
                    />
                  </button>

                </div>
              )}

              <div className="mmics-products-image-content">

                {/* EXISTING IMAGES */}

                <div className="mmics-products-existing-images">

                  <div className="mmics-products-section-title">

                    <strong>
                      Current Images
                    </strong>

                    <span>
                      {
                        selectedProduct
                          .images
                          ?.length ||
                        0
                      }{" "}
                      images
                    </span>

                  </div>

                  {selectedProduct
                    .images
                    ?.length ? (
                    <div className="mmics-products-image-grid">

                      {selectedProduct.images.map(
                        (
                          image
                        ) => (
                          <div
                            className="mmics-products-image-card"
                            key={
                              image.id
                            }
                          >

                            <img
                              src={getImageUrl(
                                image.imageUrl
                              )}
                              alt={
                                selectedProduct.name
                              }
                            />

                            {image.isPrimary && (
                              <span className="primary-badge">
                                Primary
                              </span>
                            )}

                            <button
                              type="button"
                              className="image-delete-btn"
                              onClick={() =>
                                handleDeleteImage(
                                  image.id
                                )
                              }
                              disabled={
                                saving
                              }
                            >
                              <Trash2
                                size={15}
                              />
                            </button>

                          </div>
                        )
                      )}

                    </div>
                  ) : (
                    <div className="mmics-products-no-images">

                      <ImageIcon
                        size={26}
                      />

                      <span>
                        No images added
                        yet.
                      </span>

                    </div>
                  )}

                </div>

                {/* UPLOAD */}

                <form
                  className="mmics-products-add-image"
                  onSubmit={
                    handleAddImage
                  }
                >

                  <div className="mmics-products-section-title">

                    <strong>
                      Upload Image
                    </strong>

                  </div>

                  <input
                    ref={
                      productImageInputRef
                    }
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={
                      handleProductImageChange
                    }
                    style={{
                      display:
                        "none",
                    }}
                  />

                  {/* DROP / PICK AREA */}

                  <button
                    type="button"
                    className="mmics-products-photo-upload"
                    onClick={() =>
                      productImageInputRef.current?.click()
                    }
                  >

                    <Upload
                      size={20}
                    />

                    <div>

                      <strong>
                        {imageFile
                          ? "Change Photo"
                          : "Choose Product Photo"}
                      </strong>

                      <span>
                        JPG, PNG or WEBP
                        · Max 5MB
                      </span>

                    </div>

                  </button>

                  {/* PREVIEW */}

                  {imagePreview && (
                    <div className="mmics-products-upload-preview">

                      <img
                        src={
                          imagePreview
                        }
                        alt="Product preview"
                      />

                      <button
                        type="button"
                        onClick={
                          resetImageUpload
                        }
                      >
                        <X
                          size={15}
                        />
                      </button>

                    </div>
                  )}

                  {/* PRIMARY */}

                  <label className="mmics-products-primary-checkbox">

                    <input
                      type="checkbox"
                      checked={
                        imagePrimary
                      }
                      onChange={(
                        event
                      ) =>
                        setImagePrimary(
                          event.target
                            .checked
                        )
                      }
                    />

                    <span className="custom-checkbox">

                      {imagePrimary && (
                        <Check
                          size={12}
                        />
                      )}

                    </span>

                    Set as primary image

                  </label>

                  {/* UPLOAD BUTTON */}

                  <button
                    type="submit"
                    className="mmics-products-add-image-btn"
                    disabled={
                      saving ||
                      !imageFile
                    }
                  >

                    <Upload
                      size={16}
                    />

                    {saving
                      ? "Uploading..."
                      : "Upload Product Photo"}

                  </button>

                </form>

              </div>

            </div>

          </div>
        )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {showDeleteModal &&
        deletingProduct && (
          <div
            className="mmics-products-modal-overlay"
            onMouseDown={(
              event
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setShowDeleteModal(
                  false
                );
              }
            }}
          >

            <div className="mmics-products-delete-modal">

              <div className="mmics-products-delete-icon">

                <Trash2
                  size={24}
                />

              </div>

              <h2>
                Delete Product?
              </h2>

              <p>
                You are about to
                permanently delete{" "}
                <strong>
                  {
                    deletingProduct.name
                  }
                </strong>
                .
              </p>

              <div className="mmics-products-delete-warning">

                <AlertTriangle
                  size={16}
                />

                <span>
                  This action cannot be
                  undone. Associated
                  product images will
                  also be removed
                  according to your
                  database relation
                  rules.
                </span>

              </div>

              <div className="mmics-products-delete-actions">

                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    setShowDeleteModal(
                      false
                    )
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="danger"
                  onClick={
                    confirmDelete
                  }
                  disabled={
                    saving
                  }
                >

                  {saving ? (
                    <>
                      <span className="button-spinner" />

                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2
                        size={16}
                      />

                      Delete Product
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

export default Products;

