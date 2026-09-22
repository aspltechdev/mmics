// client/src/components/home/GallerySection.jsx

import React, {
  useState,
  useEffect,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
} from "lucide-react";

import galleryService from "../../services/galleryService";

import "./GallerySection.css";


const GallerySection = () => {
  const [
    images,
    setImages,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);


  /* =========================================================
     SERVER BASE URL
  ========================================================= */

  const serverBaseUrl =
    import.meta.env.VITE_API_URL?.replace(
      /\/api\/?$/,
      ""
    ) ||
    "http://localhost:5000";


  /* =========================================================
     GET IMAGE URL
  ========================================================= */

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "";
    }


    /*
      IMPORTANT:

      Vercel Blob / Cloudinary / any external
      absolute URL should be used directly.

      Example:

      https://xxxxx.public.blob.vercel-storage.com/gallery/image.jpg

      DO NOT prepend the backend URL.
    */

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }


    /*
      If the database contains an old relative
      backend path such as:

      /uploads/gallery/image.jpg

      then use the backend server.
    */

    return `${serverBaseUrl}/${imageUrl.replace(
      /^\/+/,
      ""
    )}`;
  };


  /* =========================================================
     FETCH GALLERY
  ========================================================= */

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data =
          await galleryService.getAll();


        const allImages =
          data.galleries?.flatMap(
            (gallery) =>
              gallery.images.map(
                (img) => ({
                  ...img,
                  galleryTitle:
                    gallery.title,
                })
              )
          ) || [];


        setImages(allImages);

      } catch (error) {

        console.error(
          "Failed to load gallery:",
          error
        );

      } finally {

        setLoading(false);

      }
    };


    fetchGallery();

  }, []);


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div
        className="gallery-section"
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        Loading gallery...
      </div>
    );
  }


  /* =========================================================
     EMPTY GALLERY
  ========================================================= */

  if (images.length === 0) {
    return null;
  }


  /* =========================================================
     DISPLAY FIRST 5 IMAGES
  ========================================================= */

  const displayedImages =
    images.slice(0, 5);


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="gallery-section">

      <span className="gallery-label">
        INSIDE MMMICS
      </span>


      <h2 className="gallery-title">
        See{" "}
        <span className="highlight">
          Our Work in Action
        </span>
      </h2>


      <div className="gallery-grid">

        {displayedImages.map(
          (img, idx) => (

            <div
              className={`gallery-item ${
                idx === 0
                  ? "large"
                  : ""
              }`}
              key={img.id}
            >

              <img
                src={getImageUrl(
                  img.imageUrl
                )}
                alt={
                  img.caption ||
                  img.galleryTitle ||
                  "Gallery"
                }
                loading="lazy"
                onError={(event) => {
                  console.error(
                    "Failed to load gallery image:",
                    img.imageUrl
                  );

                  event.currentTarget.style.display =
                    "none";
                }}
              />

            </div>

          )
        )}

      </div>


      <div className="gallery-cta">

        <Link
          to="/gallery"
          className="btn-primary"
        >

          View Full Gallery

          <ArrowRight
            size={18}
          />

        </Link>

      </div>

    </section>
  );
};


export default GallerySection;


