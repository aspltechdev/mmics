import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Products.css";

/* =========================================================
   PRODUCTS DATA
========================================================= */

const products = [
  {
    id: 1,
    name: "Paper Cups",
    category: "PAPER PRODUCTS",
    description:
      "Quality paper cups designed for businesses, institutions and everyday commercial use.",
    image: "/images/paper-cups.jpg",
  },
  {
    id: 2,
    name: "Jute Files",
    category: "ECO FRIENDLY PRODUCTS",
    description:
      "Durable and sustainable jute files suitable for offices, institutions and promotional use.",
    image: "/images/jute-files.jpg",
  },
  {
    id: 3,
    name: "Plastic Crates",
    category: "INDUSTRIAL PRODUCTS",
    description:
      "Strong reusable plastic crates designed for safe storage, handling and transportation.",
    image: "/images/plastic-crates.jpg",
  },
  {
    id: 4,
    name: "Corrugated Boxes",
    category: "PACKAGING PRODUCTS",
    description:
      "Reliable corrugated packaging solutions for storage, transportation and business requirements.",
    image: "/images/corrugated-box.jpg",
  },
  {
    id: 5,
    name: "Paper Shopping Bags",
    category: "PAPER PRODUCTS",
    description:
      "Practical paper shopping bags offering a sustainable alternative for retail and businesses.",
    image: "/images/paper-bags.jpg",
  },
  {
    id: 6,
    name: "Eco Friendly Bags",
    category: "ECO FRIENDLY PRODUCTS",
    description:
      "Reusable and environmentally conscious bags created for modern business needs.",
    image: "/images/eco-bag.jpg",
  },
  {
    id: 7,
    name: "Wooden Pallets",
    category: "INDUSTRIAL PRODUCTS",
    description:
      "Strong wooden pallets suitable for material handling, storage and industrial transportation.",
    image: "/images/wooden-pallets.jpg",
  },
  {
    id: 8,
    name: "Jute Products",
    category: "ECO FRIENDLY PRODUCTS",
    description:
      "Natural jute-based products combining traditional materials with practical business applications.",
    image: "/images/jute-products.jpg",
  },
];


/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  "ALL PRODUCTS",
  "PAPER PRODUCTS",
  "ECO FRIENDLY PRODUCTS",
  "INDUSTRIAL PRODUCTS",
  "PACKAGING PRODUCTS",
];


/* =========================================================
   PRODUCTS PAGE
========================================================= */

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("ALL PRODUCTS");

  const filteredProducts =
    activeCategory === "ALL PRODUCTS"
      ? products
      : products.filter(
          (product) => product.category === activeCategory
        );

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
            Practical packaging and industrial solutions designed
            around quality, value and long-term partnerships.
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
              MMICS brings together practical manufacturing and
              packaging solutions for businesses, institutions and
              communities. Our product range focuses on reliability,
              usability and value.
            </p>

          </div>

          <div className="products-intro-side">
            <span>
              QUALITY
            </span>

            <span>
              VALUE
            </span>

            <span>
              RELIABILITY
            </span>
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

            {categories.map((category) => (

              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                {category}
              </button>

            ))}

          </div>


          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          <div className="products-page-grid">

            {filteredProducts.map((product, index) => (

              <Link
                to="/contact"
                className="products-page-card"
                key={product.id}
              >

                <div className="products-page-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <div className="products-page-image-overlay">

                    <span>
                      VIEW PRODUCT
                    </span>

                    <strong>
                      ↗
                    </strong>

                  </div>

                  <div className="product-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                </div>


                <div className="products-page-card-content">

                  <span className="products-card-category">
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.description}
                  </p>

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

            ))}

          </div>

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
              specialized business needs, we focus on delivering
              solutions that balance quality, functionality and
              value.
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
            <span>
              GET IN TOUCH
            </span>

            <strong>
              ↗
            </strong>
          </Link>

        </div>

      </section>

    </main>
  );
};

export default Products;