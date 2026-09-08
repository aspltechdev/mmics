import React, { useState } from "react";
import "./Gallery.css";

const galleryItems = [
  {
    id: 1,
    title: "Manufacturing Facility",
    category: "FACILITIES",
    image: "/images/gallery/facility-1.jpg",
  },
  {
    id: 2,
    title: "Product Collection",
    category: "PRODUCTS",
    image: "/images/gallery/products-1.jpg",
  },
  {
    id: 3,
    title: "Packaging Products",
    category: "PRODUCTS",
    image: "/images/gallery/products-2.jpg",
  },
  {
    id: 4,
    title: "Manufacturing Unit",
    category: "MANUFACTURING",
    image: "/images/gallery/manufacturing-1.jpg",
  },
  {
    id: 5,
    title: "Our Facility",
    category: "FACILITIES",
    image: "/images/gallery/facility-2.jpg",
  },
  {
    id: 6,
    title: "Corporate Meeting",
    category: "MEETINGS",
    image: "/images/gallery/meeting-1.jpg",
  },
  {
    id: 7,
    title: "Team Event",
    category: "EVENTS",
    image: "/images/gallery/event-1.jpg",
  },
  {
    id: 8,
    title: "Community Programme",
    category: "COMMUNITY",
    image: "/images/gallery/community-1.jpg",
  },
  {
    id: 9,
    title: "Industrial Products",
    category: "PRODUCTS",
    image: "/images/gallery/products-3.jpg",
  },
  {
    id: 10,
    title: "Production Process",
    category: "MANUFACTURING",
    image: "/images/gallery/manufacturing-2.jpg",
  },
  {
    id: 11,
    title: "Team Gathering",
    category: "EVENTS",
    image: "/images/gallery/event-2.jpg",
  },
  {
    id: 12,
    title: "Business Meeting",
    category: "MEETINGS",
    image: "/images/gallery/meeting-2.jpg",
  },
];

const categories = [
  "ALL",
  "PRODUCTS",
  "MANUFACTURING",
  "FACILITIES",
  "EVENTS",
  "MEETINGS",
  "COMMUNITY",
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredItems =
    activeCategory === "ALL"
      ? galleryItems
      : galleryItems.filter(
          (item) => item.category === activeCategory
        );

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const showPrevious = (e) => {
    e.stopPropagation();

    if (!selectedImage) return;

    const currentIndex = filteredItems.findIndex(
      (item) => item.id === selectedImage.id
    );

    const previousIndex =
      currentIndex === 0
        ? filteredItems.length - 1
        : currentIndex - 1;

    setSelectedImage(filteredItems[previousIndex]);
  };

  const showNext = (e) => {
    e.stopPropagation();

    if (!selectedImage) return;

    const currentIndex = filteredItems.findIndex(
      (item) => item.id === selectedImage.id
    );

    const nextIndex =
      currentIndex === filteredItems.length - 1
        ? 0
        : currentIndex + 1;

    setSelectedImage(filteredItems[nextIndex]);
  };

  return (
    <div className="gallery-page">

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="gallery-hero">
        <div className="gallery-hero-pattern"></div>

        <div className="gallery-hero-content">
          <span className="gallery-eyebrow">
            OUR GALLERY
          </span>

          <h1>Moments &amp; Memories</h1>

          <p>
            Explore our products, facilities, events and the
            people behind Manarang Manufacturing Multistate
            Industrial Cooperative Society Limited.
          </p>
        </div>
      </section>

      {/* =====================================================
          GALLERY SECTION
          ===================================================== */}

      <section className="gallery-section">
        <div className="gallery-container">

          {/* Heading */}

          <div className="gallery-heading">
            <div>
              <span className="gallery-section-eyebrow">
                EXPLORE OUR WORLD
              </span>

              <h2>
                Our <span>Gallery</span>
              </h2>
            </div>

            <p>
              A glimpse into our products, manufacturing
              capabilities, facilities, events and
              community initiatives.
            </p>
          </div>

          {/* =================================================
              FILTERS
              ================================================= */}

          <div className="gallery-filters">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? "gallery-filter active"
                    : "gallery-filter"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* =================================================
              GALLERY GRID
              ================================================= */}

          {filteredItems.length > 0 ? (
            <div className="gallery-grid">
              {filteredItems.map((item, index) => (
                <article
                  className={`gallery-card gallery-card-${(index % 5) + 1}`}
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="gallery-image-wrapper">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="gallery-image"
                      loading="lazy"
                    />

                    <div className="gallery-card-overlay">
                      <div className="gallery-view-icon">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 5C7 5 3.7 8.2 2 12c1.7 3.8 5 7 10 7s8.3-3.2 10-7c-1.7-3.8-5-7-10-7Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          />

                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          />
                        </svg>
                      </div>

                      <div className="gallery-overlay-text">
                        <span>{item.category}</span>
                        <h3>{item.title}</h3>
                      </div>
                    </div>

                  </div>

                  <div className="gallery-card-info">
                    <span>{item.category}</span>
                    <h3>{item.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="gallery-empty">
              <div className="gallery-empty-icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <circle
                    cx="8.5"
                    cy="9"
                    r="1.5"
                    fill="currentColor"
                  />

                  <path
                    d="m4.5 17 5-5 3.2 3.2 2.2-2.2 4.6 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </div>

              <h3>No images available</h3>

              <p>
                There are no gallery images in this category yet.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          GALLERY STATEMENT
          ===================================================== */}

      <section className="gallery-statement">
        <div className="gallery-statement-decoration"></div>

        <div className="gallery-statement-content">
          <span className="gallery-section-eyebrow">
            BEHIND THE SCENES
          </span>

          <h2>
            Building a better future,
            <br />
            <span>together.</span>
          </h2>

          <p>
            From our manufacturing facilities to our
            community initiatives, every moment reflects
            our commitment to cooperation, quality and
            sustainable growth.
          </p>
        </div>
      </section>

      {/* =====================================================
          LIGHTBOX
          ===================================================== */}

      {selectedImage && (
        <div
          className="gallery-lightbox"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close image"
          >
            ×
          </button>

          <button
            type="button"
            className="gallery-lightbox-prev"
            onClick={showPrevious}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div
            className="gallery-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="gallery-lightbox-image"
            />

            <div className="gallery-lightbox-caption">
              <span>{selectedImage.category}</span>
              <h3>{selectedImage.title}</h3>
            </div>
          </div>

          <button
            type="button"
            className="gallery-lightbox-next"
            onClick={showNext}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}

    </div>
  );
};

export default Gallery;