import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

/* =========================================================
   HERO SLIDES
========================================================= */

const heroSlides = [
  {
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/hero-1.jpg",
    eyebrow: "MANARANG MANUFACTURING",
    title: "Packaging solutions",
    accent: "built for progress.",
    description:
      "Reliable, sustainable and thoughtfully engineered solutions for growing businesses.",
    alt: "MMICS cooperative activities",
  },
  {
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/hero-2.jpg",
    eyebrow: "INDUSTRIAL COOPERATIVE",
    title: "Quality that moves",
    accent: "business forward.",
    description:
      "Practical packaging solutions designed around quality, value and long-term partnerships.",
    alt: "MMICS products",
  },
  {
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/hero-3.jpg",
    eyebrow: "A BETTER WAY TO BUILD",
    title: "Rooted in community.",
    accent: "Driven by ambition.",
    description:
      "A cooperative approach combining responsible growth with modern industrial thinking.",
    alt: "MMICS community",
  },
];

/* =========================================================
   PRODUCTS
========================================================= */

const products = [
  {
    name: "Paper Cups",
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/paper-cups.jpg",
  },
  {
    name: "Jute Files",
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/jute-files.jpg",
  },
  {
    name: "Plastic Crates",
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/plastic-crates.jpg",
  },
  {
    name: "Corrugated Box",
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/corrugated-box.jpg",
  },
];

/* =========================================================
   COLLECTIONS
========================================================= */

const collections = [
  {
    name: "Paper Shopping Bags",
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/paper-bags.jpg",
  },
  {
    name: "Eco Friendly Bags",
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/eco-bag.jpg",
  },
  {
    name: "Wooden Pallets",
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/wooden-pallets.jpg",
  },
  {
    name: "Jute Files",
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/jute-files.jpg",
  },
  {
    name: "Paper Cups",
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/paper-cups.jpg",
  },
];

/* =========================================================
   TESTIMONIALS
========================================================= */

const testimonials = [
  {
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/testimonial-1.jpg",
    category: "RELIABLE PARTNERSHIP",
    text:
      "Manarang's packaging is consistent, affordable, and timely. A cooperative that truly understands industrial needs and delivers reliable solutions.",
    name: "RAMESH IYER",
    role: "Procurement Head",
  },
  {
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/testimonial-2.jpg",
    category: "ETHICAL AND EFFICIENT",
    text:
      "The cooperative model delivers more than products. It builds trust, supports growth, and strengthens our supply chain every day.",
    name: "MEERA KRISHNAN",
    role: "Founder, GrowNest",
  },
  {
    image:
      "https://res.cloudinary.com/dummy/image/upload/v1/mmics/testimonial-3.jpg",
    category: "LOCAL IMPACT",
    text:
      "We chose Manarang for their values and stayed for their service. Ethical, scalable, and rooted in community progress.",
    name: "ARVIND KUMAR",
    role: "Director",
  },
];

/* =========================================================
   WHY CHOOSE US
========================================================= */

const whyChooseUs = [
  {
    number: "01",
    title: "Government Recognized",
    text:
      "Registered under the MSME Act, 2002 by the Ministry of Cooperation, Government of India.",
  },
  {
    number: "02",
    title: "Legally Trusted",
    text:
      "We ensure accountability, transparency, and fair cooperative governance.",
  },
  {
    number: "03",
    title: "Tradition Meets Innovation",
    text:
      "Strong cooperative values blended with modern industrial practices.",
  },
  {
    number: "04",
    title: "Regional Roots, National Vision",
    text:
      "Serving Tamil Nadu and Puducherry with plans for nationwide growth.",
  },
  {
    number: "05",
    title: "Experienced Leadership",
    text:
      "Board members bring industrial expertise and NDB-certified cooperative training.",
  },
  {
    number: "06",
    title: "Ethical and Transparent",
    text:
      "Our members uphold clean records and follow honest, responsible business practices.",
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
   HOME
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
          HERO
      ===================================================== */}

      <section className="hero-section">

        <div className="hero-slider">

          {heroSlides.map((slide, index) => (
            <img
              key={index}
              src={slide.image}
              alt={slide.alt}
              className={`hero-slide ${
                index === currentSlide ? "visible" : ""
              }`}
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

            <p>
              {currentHero.description}
            </p>

            <div className="hero-actions">
              <Link to="/products" className="hero-primary">
                Explore Products
                <span>↗</span>
              </Link>

              <Link to="/about" className="hero-secondary">
                Discover MMICS
              </Link>
            </div>

          </div>

          <div className="hero-bottom">

            <div className="hero-counter">
              <strong>
                {String(currentSlide + 1).padStart(2, "0")}
              </strong>

              <span>/</span>

              <span>
                {String(heroSlides.length).padStart(2, "0")}
              </span>
            </div>

            <div className="hero-dots">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={
                    index === currentSlide
                      ? "hero-dot active"
                      : "hero-dot"
                  }
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
          INTRO STATEMENT
      ===================================================== */}

      <section className="intro-section">

        <div className="content-width intro-grid">

          <div className="intro-number">
            01
          </div>

          <div className="intro-content">

            <span className="section-label">
              WHO WE ARE
            </span>

            <h2>
              Building better businesses
              <span>through better solutions.</span>
            </h2>

            <p>
              Manarang Manufacturing is a forward-thinking industrial
              cooperative rooted in self-reliance, responsible growth
              and sustainable progress.
            </p>

          </div>

          <Link to="/about" className="minimal-link">
            More about us
            <span>↗</span>
          </Link>

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section className="about-section">

        <div className="about-container">

          <div className="about-images">

            <div className="about-image-small">
              <img
                src="/images/about-1.jpg"
                alt="MMICS product"
              />

              <span className="image-caption">
                QUALITY
              </span>
            </div>

            <div className="about-image-large">
              <img
                src="/images/about-2.jpg"
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

            <span className="section-label">
              ABOUT US
            </span>

            <h2>
              Empowering industries
              <em>through cooperative innovation.</em>
            </h2>

            <div className="gold-line" />

            <p>
              Manarang Manufacturing is a forward-thinking industrial
              cooperative rooted in self-reliance and sustainable growth.
              Registered under the MSME Act, 2002, we specialize in
              crafting high-quality packaging solutions for MSMEs,
              cooperatives, and businesses.
            </p>

            <p>
              Our commitment to affordability, innovation, and
              community-driven progress ensures every product reflects
              our values and supports industrial excellence.
            </p>

            <Link to="/about" className="outline-button">
              <span>Know More</span>
              <strong>↗</strong>
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="products-section">

        <div className="content-width">

          <div className="section-topline">

            <div>
              <span className="section-label">
                OUR PRODUCTS
              </span>

              <h2>
                Solutions designed
                <em>for growing businesses.</em>
              </h2>
            </div>

            <Link to="/products" className="minimal-link">
              View all products
              <span>↗</span>
            </Link>

          </div>


          <div className="products-grid">

            {products.map((product, index) => (
              <Link
                to="/products"
                className="product-card"
                key={index}
              >

                <div className="product-number">
                  0{index + 1}
                </div>

                <div className="product-card-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <div className="product-hover">
                    <span>Explore</span>
                    <strong>↗</strong>
                  </div>

                </div>

                <div className="product-info">

                  <div>
                    <span className="product-category">
                      PACKAGING SOLUTION
                    </span>

                    <h3>
                      {product.name}
                    </h3>
                  </div>

                  <span className="product-arrow">
                    ↗
                  </span>

                </div>

              </Link>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          DARK STATEMENT
      ===================================================== */}

      <section className="statement-section">

        <div className="statement-inner">

          <span className="section-label">
            OUR APPROACH
          </span>

          <h2>
            Practical solutions.
            <br />
            <em>Purposeful growth.</em>
          </h2>

          <p>
            We combine cooperative values with modern industrial
            practices to create products and relationships that
            stand the test of time.
          </p>

        </div>

      </section>


      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <section className="testimonials-section">

        <div className="content-width">

          <div className="section-topline light">

            <div>
              <span className="section-label">
                TRUSTED BY MANY
              </span>

              <h2>
                What our partners
                <em>say about us.</em>
              </h2>
            </div>

            <div className="quote-mark">
              “
            </div>

          </div>


          <div className="testimonials-grid">

            {testimonials.map((testimonial, index) => (
              <div
                className="testimonial-card"
                key={index}
              >

                <div className="testimonial-image">

                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                  />

                </div>

                <div className="testimonial-content">

                  <div className="testimonial-top">

                    <span>
                      0{index + 1}
                    </span>

                    <div>
                      ★★★★★
                    </div>

                  </div>

                  <span className="testimonial-category">
                    {testimonial.category}
                  </span>

                  <p>
                    “{testimonial.text}”
                  </p>

                  <div className="testimonial-person">

                    <strong>
                      {testimonial.name}
                    </strong>

                    <span>
                      {testimonial.role}
                    </span>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          VIDEOS
      ===================================================== */}

      <section className="video-section">

        <div className="content-width">

          <div className="video-heading">

            <span className="section-label">
              INSIDE MMICS
            </span>

            <h2>
              See our work
              <em>in motion.</em>
            </h2>

          </div>

          <div className="video-container">

            <div className="video-card">

              <iframe
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                title="MMICS Promotional Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

            </div>

            <div className="video-card">

              <iframe
                src="https://www.youtube.com/embed/YOUR_SECOND_VIDEO_ID"
                title="MMICS Cooperative Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          COLLECTIONS
      ===================================================== */}

      <section className="collections-section">

        <div className="content-width">

          <div className="section-topline light">

            <div>
              <span className="section-label">
                OUR COLLECTIONS
              </span>

              <h2>
                Packaging for
                <em>every possibility.</em>
              </h2>
            </div>

            <Link to="/products" className="minimal-link light-link">
              Explore collection
              <span>↗</span>
            </Link>

          </div>


          <div className="collections-grid">

            {collections.map((collection, index) => (
              <Link
                to="/products"
                className={`collection-card collection-${index + 1}`}
                key={index}
              >

                <div className="collection-image">

                  <img
                    src={collection.image}
                    alt={collection.name}
                  />

                  <div className="collection-overlay" />

                  <div className="collection-info">

                    <span>
                      0{index + 1}
                    </span>

                    <h3>
                      {collection.name}
                    </h3>

                    <strong>
                      Explore ↗
                    </strong>

                  </div>

                </div>

              </Link>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}

      <section className="why-section">

        <div className="content-width why-container">

          <div className="why-image">

            <img
              src="/images/why-choose-us.jpg"
              alt="MMICS product"
            />

            <div className="why-image-label">
              <span>MANARANG</span>
              <strong>01</strong>
            </div>

          </div>


          <div className="why-content">

            <span className="section-label">
              WHY MMICS
            </span>

            <h2>
              Built on trust.
              <em>Driven by values.</em>
            </h2>

            <p className="why-intro">
              We believe strong businesses are built through
              transparency, responsibility and meaningful partnerships.
            </p>

            <div className="why-list">

              {whyChooseUs.map((item, index) => (
                <div
                  className="why-item"
                  key={index}
                >

                  <span className="why-number">
                    {item.number}
                  </span>

                  <div>

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.text}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </div>


        {/* Certifications */}

        <div className="certifications">

          <div>
            <strong>IEC</strong>
            <span>Certified</span>
          </div>

          <div>
            <strong>MSME</strong>
            <span>Registered</span>
          </div>

          <div>
            <strong>GOV</strong>
            <span>Recognized</span>
          </div>

          <div>
            <strong>ISO</strong>
            <span>Standards</span>
          </div>

          <div>
            <strong>CO-OP</strong>
            <span>Cooperative</span>
          </div>

        </div>

      </section>


      {/* =====================================================
          IMAGE STRIP
      ===================================================== */}

      <section className="image-strip">

        <div>
          <img
            src="/images/gallery-1.jpg"
            alt="MMICS product"
          />
        </div>

        <div>
          <img
            src="/images/gallery-2.jpg"
            alt="MMICS product"
          />
        </div>

        <div>
          <img
            src="/images/gallery-3.jpg"
            alt="MMICS product"
          />
        </div>

        <div>
          <img
            src="/images/gallery-4.jpg"
            alt="MMICS product"
          />
        </div>

      </section>


      {/* =====================================================
          MEMBERSHIP BENEFITS
      ===================================================== */}

      <section className="benefits-section">

        <div className="content-width">

          <div className="section-topline">

            <div>

              <span className="section-label">
                MEMBER ADVANTAGE
              </span>

              <h2>
                More value.
                <em>More opportunity.</em>
              </h2>

            </div>

            <p className="benefits-intro">
              A cooperative ecosystem designed around quality,
              affordability and sustainable growth.
            </p>

          </div>


          <div className="benefits-grid">

            {membershipBenefits.map((benefit, index) => (
              <div
                className="benefit-card"
                key={index}
              >

                <span className="benefit-number">
                  {benefit.number}
                </span>

                <div className="benefit-icon">
                  {index === 0 ? "◇" : index === 1 ? "◎" : "♧"}
                </div>

                <h3>
                  {benefit.title}
                </h3>

                <p>
                  {benefit.text}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURED VIDEO
      ===================================================== */}

      <section className="featured-video-section">

        <div className="content-width">

          <div className="featured-video-heading">

            <span className="section-label">
              OUR STORY
            </span>

            <h2>
              Discover what
              <em>drives us.</em>
            </h2>

          </div>

          <div className="featured-video">

            <iframe
              src="https://www.youtube.com/embed/YOUR_FEATURED_VIDEO_ID"
              title="Manarang Cooperative Promotion Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section className="home-contact">

        <div className="content-width contact-container">

          <div className="contact-title">

            <span className="section-label">
              CONTACT US
            </span>

            <h2>
              Let's build
              <em>something better.</em>
            </h2>

            <p>
              Have a requirement, partnership opportunity or
              product enquiry? We'd love to hear from you.
            </p>

            <div className="contact-details">

              <div>
                <span>CALL US</span>
                <a href="tel:+919840277476">
                  +91 98402 77476
                </a>
              </div>

              <div>
                <span>EMAIL</span>
                <a href="mailto:mmmicslimited@gmail.com">
                  mmmicslimited@gmail.com
                </a>
              </div>

            </div>

          </div>


          <form className="home-contact-form">

            <div className="form-field">
              <label>Your Name</label>

              <input
                type="text"
                placeholder="Enter your name"
              />
            </div>

            <div className="form-field">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-field">
              <label>Phone Number</label>

              <input
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-field">
              <label>Your Message</label>

              <textarea
                placeholder="Tell us about your requirement..."
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="contact-submit"
            >
              Send Message
              <span>↗</span>
            </button>

          </form>

        </div>

      </section>




    </div>
  );
};

export default Home;