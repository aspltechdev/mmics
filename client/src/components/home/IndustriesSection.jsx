import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./IndustriesSection.css";


const IndustriesSection = () => {
  const industries = [
    {
      id: 1,
      name: "Food & Beverage",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 2,
      name: "Agriculture",
      img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 3,
      name: "Retail & E-Commerce",
      img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
    },
  ];


  const [activeIndex, setActiveIndex] =
    useState(0);

  const [isPaused, setIsPaused] =
    useState(false);


  const getRelativePosition = (
    index
  ) => {
    const total =
      industries.length;

    const previous =
      (
        activeIndex -
        1 +
        total
      ) %
      total;

    const next =
      (
        activeIndex +
        1
      ) %
      total;

    if (index === activeIndex) {
      return "center";
    }

    if (index === previous) {
      return "left";
    }

    if (index === next) {
      return "right";
    }

    return "hidden";
  };


  const handleNext = () => {
    setActiveIndex(
      (current) =>
        (
          current +
          1
        ) %
        industries.length
    );
  };


  const handlePrevious = () => {
    setActiveIndex(
      (current) =>
        (
          current -
          1 +
          industries.length
        ) %
        industries.length
    );
  };


  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval =
      setInterval(() => {
        setActiveIndex(
          (current) =>
            (
              current +
              1
            ) %
            industries.length
        );
      }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [
    isPaused,
    industries.length,
  ]);


  const slides =
    useMemo(
      () =>
        industries.map(
          (industry, index) => ({
            ...industry,
            position:
              getRelativePosition(
                index
              ),
          })
        ),
      [
        activeIndex,
      ]
    );


  return (
    <section className="industries-section">

      {/* LEFT CONTENT */}

      <div className="industries-content">

        <span className="industries-label">
          INDUSTRIES WE SERVE
        </span>

        <h2 className="industries-title">
          Solutions Across{" "}
          <span className="highlight">
            Diverse Industries
          </span>
        </h2>

        <p className="industries-desc">
          Every industry has different
          requirements. Our product range
          helps businesses address their
          packaging, handling and
          operational needs.
        </p>

        <Link
          to="/products"
          className="industries-products-button"
        >
          <span>
            See All Products
          </span>

          <ArrowRight />
        </Link>

      </div>


      {/* CAROUSEL */}

      <div
        className="industries-carousel-stage"
        onMouseEnter={() =>
          setIsPaused(true)
        }
        onMouseLeave={() =>
          setIsPaused(false)
        }
      >

        <button
          type="button"
          className="industries-arrow industries-arrow-left"
          onClick={handlePrevious}
          aria-label="Previous industry"
        >
          <ChevronLeft />
        </button>


        <div className="industries-cards">

          {slides.map(
            (industry) => (
              <article
                key={industry.id}
                className={`industry-card industry-card-${industry.position}`}
                onClick={() => {
                  if (
                    industry.position ===
                    "left"
                  ) {
                    handlePrevious();
                  }

                  if (
                    industry.position ===
                    "right"
                  ) {
                    handleNext();
                  }
                }}
              >

                <img
                  src={industry.img}
                  alt={industry.name}
                />

                <div className="industry-overlay">

                  <h3>
                    {industry.name}
                  </h3>

                </div>

              </article>
            )
          )}

        </div>


        <button
          type="button"
          className="industries-arrow industries-arrow-right"
          onClick={handleNext}
          aria-label="Next industry"
        >
          <ChevronRight />
        </button>


        <div className="industries-dots">

          {industries.map(
            (industry, index) => (
              <button
                key={industry.id}
                type="button"
                className={`industries-dot ${
                  activeIndex === index
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveIndex(index)
                }
                aria-label={`Show ${industry.name}`}
              />
            )
          )}

        </div>

      </div>

    </section>
  );
};


export default IndustriesSection;