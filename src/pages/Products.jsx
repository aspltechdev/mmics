import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productAPI, categoryAPI } from "../services/api";
import "./Products.css";


/* =========================================================
   PRODUCTS PAGE
   ========================================================= */

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [activeCategory, setActiveCategory] = useState("ALL PRODUCTS");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH PRODUCTS + CATEGORIES
     ========================================================= */

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, categoriesResponse] =
        await Promise.all([
          productAPI.getAll({
            limit: 100,
            active: "true",
          }),

          categoryAPI.getAll({
            active: "true",
          }),
        ]);

      /*
       * productAPI.getAll() returns:
       *
       * {
       *   success: true,
       *   data: [...],
       *   pagination: {...}
       * }
       */

      setProducts(productsResponse?.data || []);

      /*
       * categoryAPI.getAll() already returns:
       *
       * res.data.data
       *
       * so categoriesResponse is the array itself.
       */

      setCategories(categoriesResponse || []);
    } catch (err) {
      console.error(
        "Error fetching products and categories:",
        err
      );

      setError(
        "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FILTER PRODUCTS BY CATEGORY
     ========================================================= */

  const filteredProducts =
    activeCategory === "ALL PRODUCTS"
      ? products
      : products.filter(
          (product) =>
            product.category?.name?.toUpperCase() ===
            activeCategory
        );

  /* =========================================================
     GET PRIMARY PRODUCT IMAGE
     ========================================================= */

  const getProductImage = (product) => {
    if (!product?.images || product.images.length === 0) {
      return null;
    }

    const primaryImage = product.images.find(
      (image) => image.isPrimary
    );

    return (
      primaryImage?.url ||
      product.images[0]?.url ||
      null
    );
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <main className="products-page">

      {/* =====================================================
          PAGE HERO
      ===================================================== */}

      <section className="products-hero">

        <div className="products-hero-overlay" />

        <div className="products-hero-content">

          <div className="products-eyebrow">
            <span />
            OUR PRODUCTS
          </div>

          <h1>
            Solutions built
            <em>for business.</em>
          </h1>

          <p>
            Practical packaging and industrial solutions
            designed around quality, value and long-term
            partnerships.
          </p>

          <div className="products-breadcrumb">
            <Link to="/">HOME</Link>
            <span>/</span>
            <strong>PRODUCTS</strong>
          </div>

        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="products-intro">

        <div className="products-content-width">

          <div className="products-intro-number">
            01
          </div>

          <div className="products-intro-main">

            <span className="products-section-label">
              WHAT WE OFFER
            </span>

            <h2>
              Packaging made
              <em>with purpose.</em>
            </h2>

            <p>
              MMICS brings together practical manufacturing
              and packaging solutions for businesses,
              institutions and communities. Our product range
              focuses on reliability, usability and value.
            </p>

          </div>

          <div className="products-intro-side">
            <span>QUALITY</span>
            <span>VALUE</span>
            <span>RELIABILITY</span>
          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCT COLLECTION
      ===================================================== */}

      <section className="product-collection">

        <div className="products-content-width">

          <div className="product-heading-row">

            <div>

              <span className="products-section-label">
                PRODUCT COLLECTION
              </span>

              <h2>
                Explore our
                <em>products.</em>
              </h2>

            </div>

            <p>
              Browse our collection of packaging, paper,
              eco-friendly and industrial products.
            </p>

          </div>


          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="product-filters">

            {/* ALL PRODUCTS */}

            <button
              type="button"
              className={
                activeCategory === "ALL PRODUCTS"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveCategory("ALL PRODUCTS")
              }
            >
              ALL PRODUCTS
            </button>


            {/* DATABASE CATEGORIES */}

            {categories.map((category) => {

              const categoryName =
                category.name?.toUpperCase();

              return (
                <button
                  key={category.id}
                  type="button"
                  className={
                    activeCategory === categoryName
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory(categoryName)
                  }
                >
                  {categoryName}
                </button>
              );

            })}

          </div>


          {/* =================================================
              LOADING STATE
          ================================================= */}

          {loading && (
            <div
              className="flex-center"
              style={{
                minHeight: "300px",
              }}
            >
              <div className="spinner" />
            </div>
          )}


          {/* =================================================
              ERROR STATE
          ================================================= */}

          {!loading && error && (
            <div
              className="products-error"
              style={{
                textAlign: "center",
                padding: "60px 20px",
              }}
            >
              <p>{error}</p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={fetchProductsAndCategories}
                style={{ marginTop: "16px" }}
              >
                Try Again
              </button>
            </div>
          )}


          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          {!loading &&
            !error &&
            filteredProducts.length > 0 && (
              <div className="products-page-grid">

                {filteredProducts.map(
                  (product, index) => {

                    const productImage =
                      getProductImage(product);

                    return (
                      <Link
                        to="/contact"
                        className="products-page-card"
                        key={product.id}
                      >

                        {/* PRODUCT IMAGE */}

                        <div className="products-page-image">

                          {productImage ? (
                            <img
                              src={productImage}
                              alt={product.name}
                            />
                          ) : (
                            <div
                              className="product-image-placeholder"
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f5f5f5",
                              }}
                            >
                              <span>
                                NO IMAGE
                              </span>
                            </div>
                          )}


                          {/* IMAGE OVERLAY */}

                          <div className="products-page-image-overlay">

                            <span>
                              VIEW PRODUCT
                            </span>

                            <strong>
                              ↗
                            </strong>

                          </div>


                          {/* PRODUCT INDEX */}

                          <div className="product-index">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </div>

                        </div>


                        {/* PRODUCT CONTENT */}

                        <div className="products-page-card-content">

                          {/* CATEGORY */}

                          <span className="products-card-category">
                            {product.category?.name ||
                              "GENERAL"}
                          </span>


                          {/* PRODUCT NAME */}

                          <h3>
                            {product.name}
                          </h3>


                          {/* DESCRIPTION */}

                          <p>
                            {product.shortDescription ||
                              product.fullDescription ||
                              "Quality products designed for your business needs."}
                          </p>


                          {/* ENQUIRE */}

                          <div className="products-card-link">

                            <span>
                              ENQUIRE NOW
                            </span>

                            <strong>
                              →
                            </strong>

                          </div>

                        </div>

                      </Link>
                    );
                  }
                )}

              </div>
            )}


          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!loading &&
            !error &&
            filteredProducts.length === 0 && (
              <div
                className="products-empty"
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                }}
              >

                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                  }}
                >
                  📦
                </div>

                <h3>
                  No products found
                </h3>

                <p>
                  There are currently no active products
                  in this category.
                </p>

                {activeCategory !==
                  "ALL PRODUCTS" && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setActiveCategory(
                        "ALL PRODUCTS"
                      )
                    }
                    style={{
                      marginTop: "16px",
                    }}
                  >
                    View All Products
                  </button>
                )}

              </div>
            )}

        </div>

      </section>


      {/* =====================================================
          QUALITY STATEMENT
      ===================================================== */}

      <section className="products-statement">

        <div className="products-content-width">

          <div className="statement-number">
            02
          </div>

          <div className="statement-content">

            <span className="products-section-label">
              OUR APPROACH
            </span>

            <h2>
              Built around
              <em>your needs.</em>
            </h2>

            <p>
              From everyday packaging requirements to
              specialized business needs, we focus on
              delivering solutions that balance quality,
              functionality and value.
            </p>

          </div>

          <div className="statement-lines">

            <div>
              <strong>01</strong>
              <span>QUALITY MATERIALS</span>
            </div>

            <div>
              <strong>02</strong>
              <span>PRACTICAL SOLUTIONS</span>
            </div>

            <div>
              <strong>03</strong>
              <span>LONG-TERM VALUE</span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="products-cta">

        <div className="products-cta-overlay" />

        <div className="products-cta-content">

          <span className="products-section-label">
            HAVE A REQUIREMENT?
          </span>

          <h2>
            Let's build the right
            <em>solution together.</em>
          </h2>

          <p>
            Tell us what you need and our team can help you
            find the right product for your business.
          </p>

          <Link
            to="/contact"
            className="products-cta-button"
          >
            <span>GET IN TOUCH</span>
            <strong>↗</strong>
          </Link>

        </div>

      </section>

    </main>
  );
};

export default Products;