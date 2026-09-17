// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ArrowRight,
//   Loader2,
//   Package,
//   RefreshCw,
// } from "lucide-react";

// import productService from "../../services/productService";
// import categoryService from "../../services/categoryService";

// import "./Products.css";


// // ============================================================
// // SERVER URL
// // ============================================================

// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   "http://localhost:5000/api";

// const SERVER_URL = API_URL.replace(
//   /\/api\/?$/,
//   ""
// );


// // ============================================================
// // IMAGE URL
// // ============================================================

// const getImageUrl = (imageUrl) => {
//   if (!imageUrl) return "";

//   if (
//     imageUrl.startsWith("http://") ||
//     imageUrl.startsWith("https://")
//   ) {
//     return imageUrl;
//   }

//   return `${SERVER_URL}/${imageUrl.replace(
//     /^\//,
//     ""
//   )}`;
// };


// // ============================================================
// // PRODUCT IMAGE
// // ============================================================

// const getProductImage = (product) => {
//   if (!product) return "";

//   if (
//     Array.isArray(product.images) &&
//     product.images.length > 0
//   ) {
//     const primaryImage =
//       product.images.find(
//         (image) =>
//           image.isPrimary === true
//       ) ||
//       product.images[0];

//     return getImageUrl(
//       primaryImage?.imageUrl
//     );
//   }

//   if (product.imageUrl) {
//     return getImageUrl(
//       product.imageUrl
//     );
//   }

//   if (product.image) {
//     return getImageUrl(
//       product.image
//     );
//   }

//   return "";
// };


// // ============================================================
// // PRODUCT DATA NORMALIZER
// // ============================================================

// const normalizeProducts = (response) => {
//   if (
//     Array.isArray(response)
//   ) {
//     return response;
//   }

//   if (
//     Array.isArray(response?.products)
//   ) {
//     return response.products;
//   }

//   if (
//     Array.isArray(response?.data)
//   ) {
//     return response.data;
//   }

//   return [];
// };


// // ============================================================
// // CATEGORY DATA NORMALIZER
// // ============================================================

// const normalizeCategories = (response) => {
//   if (
//     Array.isArray(response)
//   ) {
//     return response;
//   }

//   if (
//     Array.isArray(response?.categories)
//   ) {
//     return response.categories;
//   }

//   if (
//     Array.isArray(response?.data)
//   ) {
//     return response.data;
//   }

//   return [];
// };


// // ============================================================
// // COMPONENT
// // ============================================================

// const Products = () => {

//   const [products, setProducts] =
//     useState([]);

//   const [categories, setCategories] =
//     useState([]);

//   const [activeCategory, setActiveCategory] =
//     useState("all");

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [imageErrors, setImageErrors] =
//     useState({});


//   // ==========================================================
//   // FETCH DATA
//   // ==========================================================

//   useEffect(() => {

//     let mounted = true;

//     const loadData = async () => {

//       try {

//         setLoading(true);
//         setError("");

//         const [
//           productResponse,
//           categoryResponse,
//         ] = await Promise.all([
//           productService.getAll(),
//           categoryService.getAll(),
//         ]);

//         if (!mounted) return;

//         const productData =
//           normalizeProducts(
//             productResponse
//           );

//         const categoryData =
//           normalizeCategories(
//             categoryResponse
//           );

//         setProducts(
//           productData.filter(
//             (product) =>
//               product.status ===
//                 undefined ||
//               product.status ===
//                 "ACTIVE"
//           )
//         );

//         setCategories(
//           categoryData.filter(
//             (category) =>
//               category.status ===
//                 undefined ||
//               category.status ===
//                 "ACTIVE"
//           )
//         );

//       } catch (err) {

//         console.error(
//           "Products fetch error:",
//           err
//         );

//         if (mounted) {
//           setError(
//             "Unable to load products."
//           );
//         }

//       } finally {

//         if (mounted) {
//           setLoading(false);
//         }

//       }
//     };

//     loadData();

//     return () => {
//       mounted = false;
//     };

//   }, []);


//   // ==========================================================
//   // FILTER PRODUCTS
//   // ==========================================================

//   const filteredProducts =
//     useMemo(() => {

//       if (
//         activeCategory === "all"
//       ) {
//         return products;
//       }

//       return products.filter(
//         (product) => {

//           const categoryId =
//             product.categoryId;

//           const productCategory =
//             product.category;

//           return (
//             categoryId ===
//               activeCategory ||
//             productCategory?.id ===
//               activeCategory
//           );
//         }
//       );

//     }, [
//       products,
//       activeCategory,
//     ]);


//   // ==========================================================
//   // IMAGE ERROR
//   // ==========================================================

//   const handleImageError = (
//     productId
//   ) => {

//     setImageErrors(
//       (previous) => ({
//         ...previous,
//         [productId]: true,
//       })
//     );
//   };


//   // ==========================================================
//   // PRODUCT CATEGORY NAME
//   // ==========================================================

//   const getCategoryName = (
//     product
//   ) => {

//     if (
//       product?.category?.name
//     ) {
//       return product.category.name;
//     }

//     const category =
//       categories.find(
//         (item) =>
//           item.id ===
//           product.categoryId
//       );

//     return (
//       category?.name ||
//       "Product"
//     );
//   };


//   return (
//     <main className="mmics-products-page">

//       {/* ====================================================
//           HERO
//       ==================================================== */}

//       <section className="mmics-products-hero">

//         <img
//           src="/images/products-hero.jpg"
//           alt="MMICS Products"
//           className="mmics-products-hero-image"
//         />

//         <div className="mmics-products-hero-overlay" />


//         <div className="mmics-products-hero-content">

//           <span className="mmics-products-hero-kicker">
//             PRODUCTS & SOLUTIONS
//           </span>

//           <h1>
//             Complete Range of
//             <br />

//             <span>
//               Packaging & Industrial
//             </span>

//             <br />

//             <span>
//               Solutions
//             </span>
//           </h1>

//           <p>
//             Explore our range of packaging,
//             eco-friendly and material-handling
//             products designed to meet your
//             business requirements.
//           </p>


//           <div className="mmics-products-hero-actions">

//             <a
//               href="#product-range"
//               className="mmics-products-primary-btn"
//             >
//               Request a Quote
//             </a>

//             <a
//               href="#product-range"
//               className="mmics-products-outline-btn"
//             >
//               View All Products

//               <ArrowRight size={13} />
//             </a>

//           </div>

//         </div>

//       </section>


//       {/* ====================================================
//           PRODUCT RANGE
//       ==================================================== */}

//       <section
//         className="mmics-products-range"
//         id="product-range"
//       >

//         <div className="mmics-products-container">

//           {/* HEADER */}

//           <div className="mmics-products-heading">

//             <span>
//               OUR PRODUCT RANGE
//             </span>

//             <h2>
//               Solutions Designed for{" "}
//               <strong>
//                 Everyday Business Needs
//               </strong>
//             </h2>

//             <p>
//               From everyday packaging to
//               industrial handling requirements,
//               discover practical products built
//               around quality, functionality and value.
//             </p>

//           </div>


//           {/* ==================================================
//               FILTERS
//           ================================================== */}

//           <div className="mmics-products-filters">

//             <button
//               type="button"
//               className={
//                 activeCategory === "all"
//                   ? "active"
//                   : ""
//               }
//               onClick={() =>
//                 setActiveCategory(
//                   "all"
//                 )
//               }
//             >
//               All Products
//             </button>


//             {categories.map(
//               (category) => (
//                 <button
//                   key={category.id}
//                   type="button"
//                   className={
//                     activeCategory ===
//                     category.id
//                       ? "active"
//                       : ""
//                   }
//                   onClick={() =>
//                     setActiveCategory(
//                       category.id
//                     )
//                   }
//                 >
//                   {category.name}
//                 </button>
//               )
//             )}

//           </div>


//           {/* ==================================================
//               LOADING
//           ================================================== */}

//           {loading && (
//             <div className="mmics-products-state">

//               <Loader2 className="spin" />

//               <span>
//                 Loading products...
//               </span>

//             </div>
//           )}


//           {/* ==================================================
//               ERROR
//           ================================================== */}

//           {!loading &&
//             error && (
//               <div className="mmics-products-state">

//                 <Package />

//                 <span>
//                   {error}
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     window.location.reload()
//                   }
//                 >
//                   <RefreshCw size={13} />
//                   Retry
//                 </button>

//               </div>
//             )}


//           {/* ==================================================
//               EMPTY
//           ================================================== */}

//           {!loading &&
//             !error &&
//             filteredProducts.length ===
//               0 && (
//               <div className="mmics-products-state">

//                 <Package />

//                 <span>
//                   No products found.
//                 </span>

//               </div>
//             )}


//           {/* ==================================================
//               PRODUCT GRID
//           ================================================== */}

//           {!loading &&
//             !error &&
//             filteredProducts.length >
//               0 && (

//               <div className="mmics-products-grid">

//                 {filteredProducts.map(
//                   (product) => {

//                     const image =
//                       getProductImage(
//                         product
//                       );

//                     const category =
//                       getCategoryName(
//                         product
//                       );

//                     return (
//                       <article
//                         className="mmics-product-card"
//                         key={product.id}
//                       >

//                         {/* IMAGE */}

//                         <div className="mmics-product-image-box">

//                           {image &&
//                           !imageErrors[
//                             product.id
//                           ] ? (

//                             <img
//                               src={image}
//                               alt={
//                                 product.name
//                               }
//                               onError={() =>
//                                 handleImageError(
//                                   product.id
//                                 )
//                               }
//                             />

//                           ) : (

//                             <div className="mmics-product-image-placeholder">

//                               <Package
//                                 size={32}
//                               />

//                             </div>

//                           )}

//                         </div>


//                         {/* CONTENT */}

//                         <div className="mmics-product-content">

//                           <span className="mmics-product-category">
//                             {category}
//                           </span>

//                           <h3>
//                             {product.name}
//                           </h3>

//                           <p>
//                             {product.description ||
//                               "Practical product solutions designed for everyday business requirements."}
//                           </p>


//                           {/* TAGS */}

//                           <div className="mmics-product-tags">

//                             <span>
//                               ◉ Durable
//                             </span>

//                             <span>
//                               ◉ Reusable
//                             </span>

//                             <span>
//                               ◉ Easy Handling
//                             </span>

//                           </div>


//                           {/* BUTTON */}

//                           <a
//                             href={`/products/${product.slug || product.id}`}
//                             className="mmics-product-view-btn"
//                           >
//                             View Details

//                             <ArrowRight
//                               size={12}
//                             />
//                           </a>

//                         </div>

//                       </article>
//                     );
//                   }
//                 )}

//               </div>
//             )}

//         </div>

//       </section>


//       {/* ====================================================
//           CTA
//       ==================================================== */}

//       <section className="mmics-products-cta">

//         <img
//           src="/images/products-cta.jpg"
//           alt=""
//           className="mmics-products-cta-image"
//         />

//         <div className="mmics-products-cta-overlay" />

//         <div className="mmics-products-cta-content">

//           <span>
//             LET'S CONNECT
//           </span>

//           <h2>
//             Ready to Find the{" "}
//             <strong>
//               Right Solution?
//             </strong>
//           </h2>

//           <p>
//             Tell us your requirement and let
//             our team help you choose the right
//             product for your business.
//           </p>

//           <a
//             href="/contact"
//             className="mmics-products-cta-button"
//           >
//             Contact Us

//             <ArrowRight size={13} />
//           </a>

//         </div>

//       </section>

//     </main>
//   );
// };

// export default Products;



import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  Loader2,
  Package,
  RefreshCw,
} from "lucide-react";

import productService from "../../services/productService";
import categoryService from "../../services/categoryService";

import "./Products.css";


// ============================================================
// SERVER URL
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const SERVER_URL = API_URL.replace(
  /\/api\/?$/,
  ""
);


// ============================================================
// IMAGE URL
// ============================================================

const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${SERVER_URL}/${imageUrl.replace(
    /^\//,
    ""
  )}`;
};


// ============================================================
// GET PRODUCT IMAGE
// ============================================================

const getProductImage = (product) => {
  if (!product) {
    return "";
  }

  // Product images relation
  if (
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    const primaryImage =
      product.images.find(
        (image) =>
          image.isPrimary === true
      ) ||
      product.images[0];

    return getImageUrl(
      primaryImage?.imageUrl
    );
  }

  // Fallback imageUrl
  if (product.imageUrl) {
    return getImageUrl(
      product.imageUrl
    );
  }

  // Fallback image
  if (product.image) {
    return getImageUrl(
      product.image
    );
  }

  return "";
};


// ============================================================
// NORMALIZE PRODUCT RESPONSE
// ============================================================

const normalizeProducts = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (
    Array.isArray(
      response?.products
    )
  ) {
    return response.products;
  }

  if (
    Array.isArray(response?.data)
  ) {
    return response.data;
  }

  return [];
};


// ============================================================
// NORMALIZE CATEGORY RESPONSE
// ============================================================

const normalizeCategories = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (
    Array.isArray(
      response?.categories
    )
  ) {
    return response.categories;
  }

  if (
    Array.isArray(response?.data)
  ) {
    return response.data;
  }

  return [];
};


// ============================================================
// COMPONENT
// ============================================================

const Products = () => {

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [imageErrors, setImageErrors] =
    useState({});


  // ==========================================================
  // FETCH PRODUCTS + CATEGORIES
  // ==========================================================

  useEffect(() => {

    let mounted = true;

    const loadData = async () => {

      try {

        setLoading(true);
        setError("");

        const [
          productResponse,
          categoryResponse,
        ] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);

        if (!mounted) {
          return;
        }

        const productData =
          normalizeProducts(
            productResponse
          );

        const categoryData =
          normalizeCategories(
            categoryResponse
          );

        // Only active products
        const activeProducts =
          productData.filter(
            (product) =>
              product.status ===
                undefined ||
              product.status ===
                "ACTIVE"
          );

        // Only active categories
        const activeCategories =
          categoryData.filter(
            (category) =>
              category.status ===
                undefined ||
              category.status ===
                "ACTIVE"
          );

        setProducts(
          activeProducts
        );

        setCategories(
          activeCategories
        );

      } catch (err) {

        console.error(
          "Products fetch error:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load products."
          );
        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }
    };

    loadData();

    return () => {
      mounted = false;
    };

  }, []);


  // ==========================================================
  // FILTER PRODUCTS
  // ==========================================================

  const filteredProducts =
    useMemo(() => {

      if (
        activeCategory ===
        "all"
      ) {
        return products;
      }

      return products.filter(
        (product) => {

          if (
            product.categoryId ===
            activeCategory
          ) {
            return true;
          }

          if (
            product.category?.id ===
            activeCategory
          ) {
            return true;
          }

          return false;
        }
      );

    }, [
      products,
      activeCategory,
    ]);


  // ==========================================================
  // IMAGE ERROR
  // ==========================================================

  const handleImageError = (
    productId
  ) => {

    setImageErrors(
      (previous) => ({
        ...previous,
        [productId]: true,
      })
    );

  };


  return (
    <main className="mmics-products-page">


      {/* ====================================================
          PRODUCTS HERO
      ==================================================== */}

      <section className="mmics-products-hero">

        <img
          src="/images/products-hero.jpg"
          alt="MMICS packaging and industrial solutions"
          className="mmics-products-hero-image"
        />

        <div className="mmics-products-hero-overlay" />


        <div className="mmics-products-hero-content">

          <span className="mmics-products-hero-kicker">
            PRODUCTS &amp; SOLUTIONS
          </span>


          <h1>
            Complete Range of
            <br />

            <span>
              Packaging &amp; Industrial
            </span>

            <br />

            <span>
              Solutions
            </span>
          </h1>


          <p>
            Explore our range of packaging,
            eco-friendly and material-handling
            products designed to meet your
            business requirements.
          </p>


          <div className="mmics-products-hero-actions">

            <a
              href="/contact"
              className="mmics-products-primary-btn"
            >
              Request a Quote
            </a>


            <a
              href="#product-range"
              className="mmics-products-outline-btn"
            >
              View All Products

              <ArrowRight size={14} />
            </a>

          </div>

        </div>

      </section>


      {/* ====================================================
          PRODUCT RANGE
      ==================================================== */}

      <section
        className="mmics-products-range"
        id="product-range"
      >

        <div className="mmics-products-container">


          {/* ==================================================
              SECTION HEADING
          ================================================== */}

          <div className="mmics-products-heading">

            <span>
              OUR PRODUCT RANGE
            </span>


            <h2>
              Solutions Designed for{" "}
              <strong>
                Everyday Business Needs
              </strong>
            </h2>


            <p>
              From everyday packaging to
              industrial handling requirements,
              discover practical products built
              around quality, functionality and value.
            </p>

          </div>


          {/* ==================================================
              CATEGORY FILTERS
          ================================================== */}

          <div className="mmics-products-filters">

            <button
              type="button"
              className={
                activeCategory === "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveCategory(
                  "all"
                )
              }
            >
              All Products
            </button>


            {categories.map(
              (category) => (
                <button
                  type="button"
                  key={category.id}
                  className={
                    activeCategory ===
                    category.id
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory(
                      category.id
                    )
                  }
                >
                  {category.name}
                </button>
              )
            )}

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <div className="mmics-products-state">

              <Loader2 className="mmics-products-spin" />

              <span>
                Loading products...
              </span>

            </div>
          )}


          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading &&
            error && (
              <div className="mmics-products-state">

                <Package />

                <span>
                  {error}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                >
                  <RefreshCw size={14} />

                  Retry
                </button>

              </div>
            )}


          {/* ==================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            filteredProducts.length ===
              0 && (
              <div className="mmics-products-state">

                <Package />

                <span>
                  No products found.
                </span>

              </div>
            )}


          {/* ==================================================
              PRODUCT GRID
          ================================================== */}

          {!loading &&
            !error &&
            filteredProducts.length >
              0 && (

              <div className="mmics-products-grid">

                {filteredProducts.map(
                  (product) => {

                    const image =
                      getProductImage(
                        product
                      );

                    return (
                      <article
                        className="mmics-product-card"
                        key={product.id}
                      >


                        {/* ==================================
                            IMAGE
                        ================================== */}

                        <div className="mmics-product-image-box">

                          {image &&
                          !imageErrors[
                            product.id
                          ] ? (

                            <img
                              src={image}
                              alt={
                                product.name
                              }
                              onError={() =>
                                handleImageError(
                                  product.id
                                )
                              }
                            />

                          ) : (

                            <div className="mmics-product-image-placeholder">

                              <Package />

                            </div>

                          )}

                        </div>


                        {/* ==================================
                            CONTENT
                        ================================== */}

                        <div className="mmics-product-content">


                          {/* PRODUCT NAME */}

                          <h3>
                            {product.name}
                          </h3>


                          {/* DESCRIPTION */}

                          <p>
                            {product.description ||
                              "Practical product solutions designed for businesses seeking reliable and responsible packaging alternatives."}
                          </p>


                          {/* =================================
                              PRODUCT TAGS
                          ================================= */}

                          <div className="mmics-product-tags">

                            <span>
                              <span className="mmics-product-tag-icon">
                                ✓
                              </span>

                              Eco-Friendly
                            </span>


                            <span>
                              <span className="mmics-product-tag-icon">
                                ✓
                              </span>

                              Reusable
                            </span>


                            <span>
                              <span className="mmics-product-tag-icon">
                                ✓
                              </span>

                              Customizable
                            </span>

                          </div>


                          {/* =================================
                              VIEW DETAILS
                          ================================= */}

                          <a
                            href={`/products/${
                              product.slug ||
                              product.id
                            }`}
                            className="mmics-product-view-btn"
                          >

                            <span>
                              View Details
                            </span>

                            <ArrowRight />

                          </a>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            )}

        </div>

      </section>


      {/* ====================================================
          CTA
      ==================================================== */}

      <section className="mmics-products-cta">

        <img
          src="/images/products-cta.jpg"
          alt=""
          className="mmics-products-cta-image"
        />

        <div className="mmics-products-cta-overlay" />


        <div className="mmics-products-cta-content">

          <span>
            LET'S CONNECT
          </span>


          <h2>
            Ready to Find the{" "}
            <strong>
              Right Solution?
            </strong>
          </h2>


          <p>
            Tell us your requirement and let
            our team help you choose the right
            product for your business.
          </p>


          <a
            href="/contact"
            className="mmics-products-cta-button"
          >
            Contact Us

            <ArrowRight />

          </a>

        </div>

      </section>

    </main>
  );
};

export default Products;