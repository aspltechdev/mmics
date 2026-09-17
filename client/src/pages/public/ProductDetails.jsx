import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Package,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import productService from "../../services/productService";

import "./ProductDetails.css";


// ============================================================
// SERVER URL
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const SERVER_URL =
  API_URL.replace(
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
// GET PRODUCT RESPONSE
// ============================================================

const getProductFromResponse = (
  response
) => {
  if (!response) {
    return null;
  }

  if (response.product) {
    return response.product;
  }

  if (response.data?.product) {
    return response.data.product;
  }

  if (response.data) {
    return response.data;
  }

  return response;
};


// ============================================================
// COMPONENT
// ============================================================

const ProductDetails = () => {

  const { slug } = useParams();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeImage, setActiveImage] =
    useState(0);

  const [imageErrors, setImageErrors] =
    useState({});


  // ==========================================================
  // FETCH PRODUCT
  // ==========================================================

  useEffect(() => {

    let mounted = true;

    const fetchProduct = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await productService.getBySlug(
            slug
          );

        if (!mounted) {
          return;
        }

        const productData =
          getProductFromResponse(
            response
          );

        if (!productData) {
          throw new Error(
            "Product not found."
          );
        }

        setProduct(
          productData
        );

        setActiveImage(0);

      } catch (err) {

        console.error(
          "Product details error:",
          err
        );

        if (mounted) {
          setError(
            "Unable to load product details."
          );
        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    };

    if (slug) {
      fetchProduct();
    }

    return () => {
      mounted = false;
    };

  }, [slug]);


  // ==========================================================
  // PRODUCT IMAGES
  // ==========================================================

  const productImages =
    useMemo(() => {

      if (
        !product
      ) {
        return [];
      }

      if (
        Array.isArray(
          product.images
        ) &&
        product.images.length > 0
      ) {

        return product.images
          .map(
            (image) => ({
              id: image.id,
              url: getImageUrl(
                image.imageUrl
              ),
            })
          )
          .filter(
            (image) =>
              Boolean(image.url)
          );

      }

      if (
        product.imageUrl
      ) {
        return [
          {
            id: "main",
            url: getImageUrl(
              product.imageUrl
            ),
          },
        ];
      }

      if (
        product.image
      ) {
        return [
          {
            id: "main",
            url: getImageUrl(
              product.image
            ),
          },
        ];
      }

      return [];

    }, [product]);


  // ==========================================================
  // CURRENT IMAGE
  // ==========================================================

  const currentImage =
    productImages[
      activeImage
    ]?.url || "";


  // ==========================================================
  // NEXT IMAGE
  // ==========================================================

  const nextImage = () => {

    if (
      productImages.length <= 1
    ) {
      return;
    }

    setActiveImage(
      (previous) =>
        previous ===
        productImages.length - 1
          ? 0
          : previous + 1
    );
  };


  // ==========================================================
  // PREVIOUS IMAGE
  // ==========================================================

  const previousImage = () => {

    if (
      productImages.length <= 1
    ) {
      return;
    }

    setActiveImage(
      (previous) =>
        previous === 0
          ? productImages.length - 1
          : previous - 1
    );
  };


  // ==========================================================
  // IMAGE ERROR
  // ==========================================================

  const handleImageError = (
    index
  ) => {

    setImageErrors(
      (previous) => ({
        ...previous,
        [index]: true,
      })
    );

  };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <main className="mmics-product-details-page">

        <div className="mmics-product-details-state">

          <Loader2 className="mmics-product-details-spinner" />

          <span>
            Loading product...
          </span>

        </div>

      </main>
    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    error ||
    !product
  ) {

    return (
      <main className="mmics-product-details-page">

        <div className="mmics-product-details-state">

          <Package />

          <h2>
            Product Not Found
          </h2>

          <p>
            {error ||
              "The requested product could not be found."}
          </p>

          <Link
            to="/products"
            className="mmics-product-details-back"
          >
            Back to Products

            <ArrowRight />
          </Link>

        </div>

      </main>
    );

  }


  // ==========================================================
  // PRODUCT CATEGORY
  // ==========================================================

  const categoryName =
    product.category?.name ||
    "Packaging & Industrial Solutions";


  return (
    <main className="mmics-product-details-page">


      {/* ====================================================
          PRODUCT DETAIL HERO
      ==================================================== */}

      <section className="mmics-product-details">

        <div className="mmics-product-details-container">


          {/* ==================================================
              LEFT - IMAGE GALLERY
          ================================================== */}

          <div className="mmics-product-gallery">


            {/* MAIN IMAGE */}

            <div className="mmics-product-main-image">

              {currentImage &&
              !imageErrors[
                activeImage
              ] ? (

                <img
                  src={currentImage}
                  alt={
                    product.name
                  }
                  onError={() =>
                    handleImageError(
                      activeImage
                    )
                  }
                />

              ) : (

                <div className="mmics-product-main-placeholder">

                  <Package />

                  <span>
                    Product Image
                  </span>

                </div>

              )}


              {/* NAVIGATION */}

              {productImages.length >
                1 && (
                <>
                  <button
                    type="button"
                    className="mmics-product-image-prev"
                    onClick={
                      previousImage
                    }
                    aria-label="Previous image"
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    type="button"
                    className="mmics-product-image-next"
                    onClick={
                      nextImage
                    }
                    aria-label="Next image"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}

            </div>


            {/* THUMBNAILS */}

            {productImages.length >
              1 && (

              <div className="mmics-product-thumbnails">

                {productImages.map(
                  (
                    image,
                    index
                  ) => (

                    <button
                      type="button"
                      key={
                        image.id ||
                        index
                      }
                      className={
                        activeImage ===
                        index
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setActiveImage(
                          index
                        )
                      }
                    >

                      {image.url &&
                      !imageErrors[
                        index
                      ] ? (

                        <img
                          src={
                            image.url
                          }
                          alt={`${product.name} ${index + 1}`}
                          onError={() =>
                            handleImageError(
                              index
                            )
                          }
                        />

                      ) : (

                        <Package />

                      )}

                    </button>

                  )
                )}

              </div>

            )}

          </div>


          {/* ==================================================
              RIGHT - PRODUCT INFORMATION
          ================================================== */}

          <div className="mmics-product-detail-content">


            {/* CATEGORY */}

            <span className="mmics-product-detail-category">
              {categoryName}
            </span>


            {/* PRODUCT TITLE */}

            <h1>
              {product.name}
            </h1>


            {/* DESCRIPTION */}

            <div className="mmics-product-detail-description">

              <p>
                {product.description ||
                  "Practical and reliable product solutions designed to meet everyday business and industrial requirements."}
              </p>

            </div>


            {/* KEY FEATURES */}

            <div className="mmics-product-features">

              <h2>
                Key Features
              </h2>


              <div className="mmics-product-feature-grid">

                <div className="mmics-product-feature">
                  <span>
                    <Check />
                  </span>

                  High Strength
                </div>


                <div className="mmics-product-feature">
                  <span>
                    <Check />
                  </span>

                  Durable
                </div>


                <div className="mmics-product-feature">
                  <span>
                    <Check />
                  </span>

                  Bulk Friendly
                </div>


                <div className="mmics-product-feature">
                  <span>
                    <Check />
                  </span>

                  Easy Handling
                </div>


                <div className="mmics-product-feature">
                  <span>
                    <Check />
                  </span>

                  Reusable
                </div>


                <div className="mmics-product-feature">
                  <span>
                    <Check />
                  </span>

                  Lightweight
                </div>

              </div>

            </div>


            {/* CTA */}

            <Link
              to="/contact"
              className="mmics-product-detail-quote"
            >
              Request a Quote

              <ArrowRight />

            </Link>

          </div>

        </div>

      </section>


      {/* ====================================================
          PRODUCT INFORMATION
      ==================================================== */}

      <section className="mmics-product-information">

        <div className="mmics-product-information-container">

          <div className="mmics-product-information-heading">

            <span>
              PRODUCT INFORMATION
            </span>

            <h2>
              Designed Around Your
              <strong>
                Business Requirements
              </strong>
            </h2>

          </div>


          <div className="mmics-product-information-grid">


            <div className="mmics-product-information-card">

              <div className="mmics-product-information-number">
                01
              </div>

              <h3>
                Practical Solutions
              </h3>

              <p>
                Products designed to support
                practical day-to-day packaging
                and industrial requirements.
              </p>

            </div>


            <div className="mmics-product-information-card">

              <div className="mmics-product-information-number">
                02
              </div>

              <h3>
                Reliable Performance
              </h3>

              <p>
                Built around dependable
                functionality, handling and
                business requirements.
              </p>

            </div>


            <div className="mmics-product-information-card">

              <div className="mmics-product-information-number">
                03
              </div>

              <h3>
                Business Ready
              </h3>

              <p>
                Suitable for businesses
                looking for practical and
                scalable product solutions.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          FINAL CTA
      ==================================================== */}

      <section className="mmics-product-detail-cta">

        <img
          src="/images/products-cta.jpg"
          alt=""
          className="mmics-product-detail-cta-image"
        />

        <div className="mmics-product-detail-cta-overlay" />


        <div className="mmics-product-detail-cta-content">

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
            Tell us your requirement and
            our team will help you find
            the right product for your business.
          </p>

          <Link
            to="/contact"
            className="mmics-product-detail-cta-button"
          >
            Contact Us

            <ArrowRight />

          </Link>

        </div>

      </section>

    </main>
  );
};

export default ProductDetails;