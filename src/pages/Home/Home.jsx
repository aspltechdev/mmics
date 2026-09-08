import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

/* =========================================================
   HERO SLIDES - BEST HERO IMAGES
   ========================================================= */

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&h=700&fit=crop&q=80",
    eyebrow: "WELCOME TO MMMICS",
    title: "Quality Packaging",
    accent: "Solutions for MSMEs.",
    description: "Empowering businesses with sustainable and reliable packaging solutions since 2012.",
    alt: "MMICS packaging solutions",
  },
  {
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1400&h=700&fit=crop&q=80",
    eyebrow: "INDUSTRIAL COOPERATIVE",
    title: "Built for",
    accent: "Growing Businesses.",
    description: "Practical, affordable and thoughtfully engineered solutions for cooperatives and MSMEs.",
    alt: "MMICS products showcase",
  },
  {
    image: "https://images.unsplash.com/photo-1565714375095-d5c53c1fe97d?w=1400&h=700&fit=crop&q=80",
    eyebrow: "SUSTAINABLE PACKAGING",
    title: "Rooted in",
    accent: "Community Progress.",
    description: "A cooperative approach combining responsible growth with modern industrial thinking.",
    alt: "MMICS community impact",
  },
];

/* =========================================================
   PRODUCTS - 8 FEATURED PRODUCTS WITH SPECIFIC IMAGES
   ========================================================= */

const products = [
  {
    name: "Paper Cups",
    image: "https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?w=400&h=300&fit=crop&q=80",
    category: "PAPER PRODUCTS",
    description: "Quality paper cups designed for businesses, institutions and everyday commercial use."
  },
  {
    name: "Jute Files",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=300&fit=crop&q=80",
    category: "ECO FRIENDLY PRODUCTS",
    description: "Durable and sustainable jute files suitable for offices, institutions and promotional use."
  },
  {
    name: "Plastic Crates",
    image: "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=400&h=300&fit=crop&q=80",
    category: "INDUSTRIAL PRODUCTS",
    description: "Strong reusable plastic crates designed for safe storage, handling and transportation."
  },
  {
    name: "Corrugated Boxes",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop&q=80",
    category: "PACKAGING PRODUCTS",
    description: "Reliable corrugated packaging solutions for storage, transportation and business requirements."
  },
  {
    name: "Paper Shopping Bags",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=300&fit=crop&q=80",
    category: "PAPER PRODUCTS",
    description: "Practical paper shopping bags offering a sustainable alternative for retail and businesses."
  },
  {
    name: "Eco Friendly Bags",
    image: "https://images.unsplash.com/photo-1598532163256-ae1e0df25cb8?w=400&h=300&fit=crop&q=80",
    category: "ECO FRIENDLY PRODUCTS",
    description: "Reusable and environmentally conscious bags created for modern business needs."
  },
  {
    name: "Wooden Pallets",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop&q=80",
    category: "INDUSTRIAL PRODUCTS",
    description: "Strong wooden pallets suitable for material handling, storage and industrial transportation."
  },
  {
    name: "Jute Products",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=300&fit=crop&q=80",
    category: "ECO FRIENDLY PRODUCTS",
    description: "Natural jute-based products combining traditional materials with practical business applications."
  },
];

/* =========================================================
   COLLECTIONS - PRODUCT CATEGORIES
   ========================================================= */

const collections = [
  {
    name: "Paper Cups",
    image: "https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?w=400&h=300&fit=crop&q=80",
    count: "2 Products"
  },
  {
    name: "Jute Files",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=300&fit=crop&q=80",
    count: "2 Products"
  },
  {
    name: "Plastic Crates",
    image: "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=400&h=300&fit=crop&q=80",
    count: "2 Products"
  },
  {
    name: "Corrugated Boxes",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop&q=80",
    count: "1 Product"
  },
  {
    name: "Paper Shopping Bags",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=300&fit=crop&q=80",
    count: "1 Product"
  },
  {
    name: "Eco Friendly Bags",
    image: "https://images.unsplash.com/photo-1598532163256-ae1e0df25cb8?w=400&h=300&fit=crop&q=80",
    count: "2 Products"
  },
];

/* =========================================================
   TESTIMONIALS
   ========================================================= */

const testimonials = [
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
    category: "RELIABLE PARTNERSHIP",
    text: "MMMICS packaging is consistent, affordable, and timely. A cooperative that truly understands industrial needs and delivers reliable solutions.",
    name: "RAMESH IYER",
    role: "Procurement Head, Kerala Co-op",
  },
  {
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
    category: "ETHICAL AND EFFICIENT",
    text: "The cooperative model delivers more than products. It builds trust, supports growth, and strengthens our supply chain every day.",
    name: "MEERA KRISHNAN",
    role: "Founder, GrowNest",
  },
  {
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80",
    category: "LOCAL IMPACT",
    text: "We chose MMMICS for their values and stayed for their service. Ethical, scalable, and rooted in community progress.",
    name: "ARVIND KUMAR",
    role: "Director, Tamil Nadu Co-op",
  },
];

/* =========================================================
   WHY CHOOSE US
   ========================================================= */

const whyChooseUs = [
  {
    number: "01",
    title: "Cooperative Model",
    text: "We operate as a cooperative, ensuring fair prices and quality for our members.",
  },
  {
    number: "02",
    title: "Sustainable Solutions",
    text: "Eco-friendly packaging options to help you reduce your carbon footprint.",
  },
  {
    number: "03",
    title: "Quality Assurance",
    text: "Rigorous quality checks ensure every product meets our high standards.",
  },
  {
    number: "04",
    title: "MSME Focus",
    text: "Tailored solutions for MSMEs, cooperatives, and growing businesses.",
  },
  {
    number: "05",
    title: "Experienced Leadership",
    text: "Board members bring industrial expertise and cooperative training.",
  },
  {
    number: "06",
    title: "Ethical and Transparent",
    text: "Our members uphold clean records and follow honest business practices.",
  },
];

/* =========================================================
   MEMBERSHIP BENEFITS
   ========================================================= */

const membershipBenefits = [
  {
    number: "01",
    title: "Quality Assurance",
    text: "Strict standards ensure consistently reliable products.",
  },
  {
    number: "02",
    title: "Affordable Pricing",
    text: "Fair rates without middlemen or unnecessary markup.",
  },
  {
    number: "03",
    title: "Eco-Friendly Options",
    text: "Sustainable packaging for conscious business practices.",
  },
];

/* =========================================================
   HOME COMPONENT
   ========================================================= */

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((previous) =>
        previous === heroSlides.length - 1 ? 0 : previous + 1
      );
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <div className="mmics-home">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="hero-section">

        <div className="hero-slider">

          {heroSlides.map((slide, index) => (
            <img
              key={index}
              src={slide.image}
              alt={slide.alt}
              className={`hero-slide ${index === currentSlide ? "visible" : ""}`}
            />
          ))}

          <div className="hero-overlay" />

          <div className="hero-content">

            <div className="hero-eyebrow">
              <span />
              {currentHero.eyebrow}
            </div>

            <h1>
              {currentHero.title}
              <em>{currentHero.accent}</em>
            </h1>

            <p>{currentHero.description}</p>

            <div className="hero-actions">
              <Link to="/products" className="hero-primary">
                Explore Products
                <span>→</span>
              </Link>
              <Link to="/contact" className="hero-secondary">
                Request a Quote
              </Link>
            </div>

          </div>

          <div className="hero-bottom">

            <div className="hero-counter">
              <strong>{String(currentSlide + 1).padStart(2, "0")}</strong>
              <span>/</span>
              <span>{String(heroSlides.length).padStart(2, "0")}</span>
            </div>

            <div className="hero-dots">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={index === currentSlide ? "hero-dot active" : "hero-dot"}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="hero-scroll">
              Scroll to explore
              <span>↓</span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRO SECTION
      ===================================================== */}

      <section className="intro-section">

        <div className="content-width intro-grid">

          <div className="intro-number">01</div>

          <div className="intro-content">

            <span className="section-label">WHO WE ARE</span>

            <h2>
              Building better businesses
              <span>through better solutions.</span>
            </h2>

            <p>
              MMMICS Limited is a forward-thinking industrial cooperative rooted in
              self-reliance, responsible growth and sustainable progress.
            </p>

          </div>

          <Link to="/about" className="minimal-link">
            More about us
            <span>→</span>
          </Link>

        </div>

      </section>


      {/* =====================================================
          ABOUT SECTION
      ===================================================== */}

      <section className="about-section">

        <div className="about-container">

          <div className="about-images">

            <div className="about-image-small">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop&q=80"
                alt="MMICS product"
              />
              <span className="image-caption">QUALITY</span>
            </div>

            <div className="about-image-large">
              <img
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&h=400&fit=crop&q=80"
                alt="MMICS eco friendly product"
              />
              <div className="image-stamp">
                <span>EST.</span>
                <strong>MM</strong>
                <small>COOPERATIVE</small>
              </div>
            </div>

          </div>

          <div className="about-content">

            <span className="section-label">ABOUT US</span>

            <h2>
              Empowering industries
              <em>through cooperative innovation.</em>
            </h2>

            <div className="gold-line" />

            <p>
              MMMICS Limited is a forward-thinking industrial cooperative rooted in
              self-reliance and sustainable growth. Registered under the MSME Act, 2002,
              we specialize in crafting high-quality packaging solutions for MSMEs,
              cooperatives, and businesses.
            </p>

            <p>
              Our commitment to affordability, innovation, and community-driven progress
              ensures every product reflects our values and supports industrial excellence.
            </p>

            <Link to="/about" className="outline-button">
              <span>Know More</span>
              <strong>→</strong>
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCTS SECTION
      ===================================================== */}

      <section className="products-section">

        <div className="content-width">

          <div className="section-topline">

            <div>
              <span className="section-label">OUR PRODUCTS</span>
              <h2>
                Solutions designed
                <em>for growing businesses.</em>
              </h2>
            </div>

            <Link to="/products" className="minimal-link">
              View all products
              <span>→</span>
            </Link>

          </div>

          <div className="products-grid">

            {products.slice(0, 8).map((product, index) => (
              <Link
                to={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="product-card"
                key={index}
              >

                <div className="product-number">0{index + 1}</div>

                <div className="product-card-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-hover">
                    <span>Explore</span>
                    <strong>→</strong>
                  </div>
                </div>

                <div className="product-info">

                  <div>
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                  </div>

                  <span className="product-arrow">→</span>

                </div>

              </Link>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          STATEMENT SECTION
      ===================================================== */}

      <section className="statement-section">

        <div className="statement-inner">

          <span className="section-label">OUR APPROACH</span>

          <h2>
            Practical solutions.
            <br />
            <em>Purposeful growth.</em>
          </h2>

          <p>
            We combine cooperative values with modern industrial practices to create
            products and relationships that stand the test of time.
          </p>

        </div>

      </section>


      {/* =====================================================
          TESTIMONIALS SECTION
      ===================================================== */}

      <section className="testimonials-section">

        <div className="content-width">

          <div className="section-topline light">

            <div>
              <span className="section-label">TRUSTED BY MANY</span>
              <h2>
                What our partners
                <em>say about us.</em>
              </h2>
            </div>

            <div className="quote-mark">"</div>

          </div>

          <div className="testimonials-grid">

            {testimonials.map((testimonial, index) => (
              <div className="testimonial-card" key={index}>

                <div className="testimonial-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>

                <div className="testimonial-content">

                  <div className="testimonial-top">
                    <span>0{index + 1}</span>
                    <div>⭐⭐⭐⭐⭐</div>
                  </div>

                  <span className="testimonial-category">{testimonial.category}</span>

                  <p>"{testimonial.text}"</p>

                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;