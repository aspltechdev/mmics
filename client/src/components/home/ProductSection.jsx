import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
} from "lucide-react";

import productService from "../../services/productService";

import "./ProductSection.css";


const ProductSection = () => {
  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    activeTab,
    setActiveTab,
  ] = useState("All");


  const serverBaseUrl =
    import.meta.env.VITE_API_URL?.replace(
      "/api",
      ""
    ) ||
    "http://localhost:5000";


  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data =
          await productService.getAll({
            status: "ACTIVE",
          });

        setProducts(
          data.products || []
        );
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );
      } finally {
        setLoading(false);
      }
    };


    fetchProducts();
  }, []);


  /* =========================================================
     DISPLAYED PRODUCTS
  ========================================================= */

  const displayedProducts =
    activeTab === "All"
      ? products
      : products;


  /* =========================================================
     PRODUCT IMAGE
  ========================================================= */

  const getPrimaryImage = (
    product
  ) => {
    if (
      !product.images ||
      product.images.length === 0
    ) {
      return "https://via.placeholder.com/300x200?text=No+Image";
    }


    const primary =
      product.images.find(
        (image) =>
          image.isPrimary
      );


    return `${serverBaseUrl}${
      (
        primary ||
        product.images[0]
      ).imageUrl
    }`;
  };


  return (
    <section className="products-section">

      <div className="products-container">

        {/* ===================================================
            HEADING
        =================================================== */}

        <span className="products-label">
          OUR SOLUTIONS
        </span>


        <h2 className="products-title">

          Packaging{" "}

          <span className="highlight">
            Solutions for Every Requirement
          </span>

        </h2>


        <p className="products-subtitle">
          Explore our range of packaging,
          material-handling and eco-friendly
          solutions designed for different
          business and industrial applications.
        </p>


        {/* ===================================================
            TABS
        =================================================== */}

        <div className="products-tabs">

          <button
            type="button"
            className={`tab-btn ${
              activeTab === "All"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("All")
            }
          >
            All
          </button>


          <button
            type="button"
            className={`tab-btn ${
              activeTab ===
              "Best Seller"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "Best Seller"
              )
            }
          >
            Best Seller
          </button>

        </div>


        {/* ===================================================
            PRODUCTS
        =================================================== */}

        {loading ? (

          <div className="products-loading">
            Loading products...
          </div>

        ) : (

          <div className="products-grid">

            {displayedProducts
              .slice(0, 3)
              .map((product) => (

                <article
                  className="product-card"
                  key={product.id}
                >

                  <div className="product-card-image">

                    <img
                      src={getPrimaryImage(
                        product
                      )}
                      alt={product.name}
                    />

                  </div>


                  <div className="product-card-content">

                    <h3>
                      {product.name}
                    </h3>


                    <p>
                      {product.description
                        ? `${
                            product.description.substring(
                              0,
                              90
                            )
                          }...`
                        : "No description available."}
                    </p>


                    <Link
                      to={`/products/${product.slug}`}
                      className="product-link"
                    >

                      <span>
                        Explore{" "}
                        {product.name}
                      </span>

                      <ArrowRight
                        size={16}
                      />

                    </Link>

                  </div>

                </article>

              ))}


            {displayedProducts.length ===
              0 && (

              <div className="products-empty">

                No products available at
                the moment.

              </div>

            )}

          </div>

        )}


        {/* ===================================================
            CTA
        =================================================== */}

        <div className="products-cta">

          <Link
            to="/products"
            className="products-view-all"
          >

            <span>
              See All Products
            </span>

            <ArrowRight
              size={18}
            />

          </Link>

        </div>

      </div>

    </section>
  );
};


export default ProductSection;