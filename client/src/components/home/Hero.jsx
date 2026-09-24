// client/src/components/home/Hero.jsx

import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle,
} from "lucide-react";

import heroSlideService from "../../services/heroSlideService";

import "./Hero.css";


const Hero = () => {
  const [slides, setSlides] =
    useState([]);

  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* ============================================================
     SERVER BASE URL

     VITE_API_URL example:

     Local:
     http://localhost:5000/api

     Production:
     https://your-server.vercel.app/api
     ============================================================ */

  const serverBaseUrl = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
  ).replace(/\/api\/?$/, "");


  /* ============================================================
     IMAGE URL
     Supports:
     - Vercel Blob full URL
     - Any HTTPS URL
     - Local /uploads path
     ============================================================ */

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

    if (imageUrl.startsWith("/")) {
      return `${serverBaseUrl}${imageUrl}`;
    }

    return `${serverBaseUrl}/${imageUrl}`;
  };


  /* ============================================================
     FETCH HERO SLIDES FROM BACKEND
     ============================================================ */

  useEffect(() => {
    let mounted = true;

    const fetchSlides = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await heroSlideService.getAll();

        console.log(
          "Public hero response:",
          response
        );


        /*
          Supports backend responses like:

          [ ... ]

          OR

          {
            slides: [...]
          }

          OR

          {
            data: [...]
          }
        */

        let fetchedSlides = [];

        if (Array.isArray(response)) {
          fetchedSlides = response;
        } else if (
          Array.isArray(response?.slides)
        ) {
          fetchedSlides =
            response.slides;
        } else if (
          Array.isArray(response?.data)
        ) {
          fetchedSlides =
            response.data;
        }


        /* ======================================================
           ACTIVE SLIDES ONLY
           ====================================================== */

        const activeSlides =
          fetchedSlides
            .filter(
              (slide) =>
                slide &&
                slide.isActive !== false
            )
            .sort(
              (a, b) =>
                Number(
                  a.sortOrder ?? 0
                ) -
                Number(
                  b.sortOrder ?? 0
                )
            );


        if (!mounted) {
          return;
        }

        setSlides(activeSlides);

        setCurrentSlide(0);
      } catch (err) {
        console.error(
          "Failed to load hero slides:",
          err
        );

        if (!mounted) {
          return;
        }

        /*
          IMPORTANT:
          Do NOT show default slides.

          Admin/DB is now the only source.
        */

        setSlides([]);

        setError(
          err?.response?.data?.message ||
            "Failed to load hero slides."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };


    fetchSlides();


    return () => {
      mounted = false;
    };
  }, []);


  /* ============================================================
     AUTO SLIDER
     ============================================================ */

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const interval =
      setInterval(() => {
        setCurrentSlide(
          (previous) =>
            (previous + 1) %
            slides.length
        );
      }, 5000);


    return () => {
      clearInterval(interval);
    };
  }, [slides.length]);


  /* ============================================================
     PROTECT CURRENT INDEX
     ============================================================ */

  useEffect(() => {
    if (
      currentSlide >= slides.length &&
      slides.length > 0
    ) {
      setCurrentSlide(0);
    }
  }, [
    currentSlide,
    slides.length,
  ]);


  /* ============================================================
     LOADING
     ============================================================ */

  if (loading) {
    return (
      <section
        className="hero-section"
        style={{
          minHeight: "560px",
        }}
      />
    );
  }


  /* ============================================================
     NO HERO CONTENT

     No hardcoded fallback.
     ============================================================ */

  if (
    error ||
    slides.length === 0
  ) {
    if (error) {
      console.error(
        "Hero unavailable:",
        error
      );
    }

    return null;
  }


  /* ============================================================
     CURRENT SLIDE
     ============================================================ */

  const slide =
    slides[currentSlide];

  if (!slide) {
    return null;
  }


  const imageSrc =
    getImageUrl(
      slide.imageUrl ||
        slide.image
    );


  /* ============================================================
     BUTTON
     ============================================================ */

  const hasButton =
    Boolean(
      slide.buttonText?.trim()
    ) &&
    Boolean(
      slide.buttonUrl?.trim()
    );


  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <section className="hero-section">

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div
        className="hero-content"
        key={`content-${slide.id}`}
      >

        {/* SUBTITLE */}

        {slide.subtitle && (
          <div className="hero-badge">

            <CheckCircle size={14} />

            <span>
              {slide.subtitle}
            </span>

          </div>
        )}


        {/* TITLE */}

        {slide.title && (
          <h1 className="hero-title">
            {slide.title}
          </h1>
        )}


        {/* DESCRIPTION */}

        {slide.description && (
          <p className="hero-subtitle">
            {slide.description}
          </p>
        )}


        {/* BUTTON */}

        {hasButton && (
          <div className="hero-buttons">

            <Link
              to={slide.buttonUrl}
              className="btn-primary"
            >
              {slide.buttonText}

              <ArrowRight size={17} />
            </Link>

          </div>
        )}

      </div>


      {/* ======================================================
          HERO IMAGE
      ====================================================== */}

      {imageSrc && (
        <div
          className="hero-image"
          key={`image-${slide.id}`}
        >

          <img
            src={imageSrc}
            alt={
              slide.title ||
              "MMICS hero"
            }
            loading="eager"
            onError={(event) => {
              console.error(
                "Hero image failed:",
                imageSrc
              );

              event.currentTarget.style.display =
                "none";
            }}
          />

        </div>
      )}


      {/* ======================================================
          SLIDER DOTS

          Only display if more than one slide
      ====================================================== */}

      {slides.length > 1 && (
        <div className="hero-dots">

          {slides.map(
            (item, index) => (
              <button
                key={
                  item.id ||
                  `hero-dot-${index}`
                }
                type="button"
                className={`dot ${
                  index === currentSlide
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setCurrentSlide(index)
                }
                aria-label={`Go to slide ${
                  index + 1
                }`}
              />
            )
          )}

        </div>
      )}

    </section>
  );
};


export default Hero;