import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <div className="mmics-about">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="about-hero">

        <div className="about-hero-overlay"></div>

        <div className="about-hero-content">

          <span className="about-eyebrow">
            <i></i>
            WHO WE ARE
          </span>

          <h1>
            Quality Packaging
            <br />
            <em>for Growing Businesses.</em>
          </h1>

          <p>
            MMMICS Limited is a cooperative organization focused on providing 
            quality packaging solutions for MSMEs, cooperatives, and businesses 
            across India.
          </p>

          <div className="about-breadcrumb">
            <Link to="/">HOME</Link>
            <span>/</span>
            <strong>ABOUT US</strong>
          </div>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION - OUR STORY
      ===================================================== */}
      <section className="about-introduction">

        <div className="about-container">

          <div className="about-intro-number">
            01
          </div>

          <div className="about-intro-content">

            <span className="about-section-label">
              OUR STORY
            </span>

            <h2>
              Empowering MSMEs
              <br />
              <em>with quality packaging.</em>
            </h2>

            <div className="about-gold-line"></div>

            <p>
              MMMICS Limited is a cooperative organization rooted in self-reliance 
              and sustainable growth. Registered under the MSME Act, 2002, we 
              specialize in crafting high-quality packaging solutions for MSMEs, 
              cooperatives, and businesses across India.
            </p>

            <p>
              Our purpose is to create meaningful opportunities through responsible 
              growth, industrial development and collective participation. We 
              combine cooperative values with modern industrial practices to 
              create products and relationships that stand the test of time.
            </p>

          </div>

          <div className="about-intro-side">

            <span>ESTABLISHED WITH</span>

            <strong>
              A SHARED
              <br />
              VISION
            </strong>

            <div className="about-side-line"></div>

            <p>
              Building stronger communities through cooperation and enterprise.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT IMAGE + CONTENT
      ===================================================== */}
      <section className="about-story">

        <div className="about-story-container">

          <div className="about-story-images">

            <div className="about-story-large">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop&q=80"
                alt="MMICS Packaging Solutions"
              />
            </div>

            <div className="about-story-small">
              <img
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop&q=80"
                alt="MMICS Manufacturing"
              />
              <span>
                QUALITY • SUSTAINABILITY • COOPERATION
              </span>
            </div>

            <div className="about-story-badge">
              <strong>M</strong>
              <span>MMICS</span>
            </div>

          </div>


          <div className="about-story-content">

            <span className="about-section-label">
              ABOUT MMMICS
            </span>

            <h2>
              Rooted in
              <br />
              <em>community & quality.</em>
            </h2>

            <div className="about-gold-line"></div>

            <p>
              MMMICS represents a cooperative model where collective strength 
              becomes the foundation for sustainable development. We believe 
              in delivering quality, sustainable, and affordable packaging 
              solutions that help our clients grow their businesses.
            </p>

            <p>
              By bringing together members and enterprises, the organisation 
              creates an environment where shared participation leads to 
              stronger economic and industrial opportunities.
            </p>

            <p>
              Our approach combines community values with modern thinking, 
              creating a platform for growth that remains connected to the 
              people it serves.
            </p>

            <Link to="/contact" className="about-outline-button">
              GET IN TOUCH
              <span>↗</span>
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          VISION & MISSION
      ===================================================== */}
      <section className="vision-mission">

        <div className="about-container">

          <div className="vision-heading">

            <span className="about-section-label">
              OUR DIRECTION
            </span>

            <h2>
              Purpose with
              <br />
              <em>direction.</em>
            </h2>

          </div>


          <div className="vision-mission-grid">

            <div className="vision-card">

              <span className="vision-number">
                01
              </span>

              <span className="vision-icon">
                ◇
              </span>

              <h3>
                Our Vision
              </h3>

              <p>
                To be the leading packaging solutions provider for MSMEs in India, 
                creating a stronger cooperative ecosystem where collective 
                participation, enterprise and responsible development contribute 
                to long-term community progress.
              </p>

            </div>


            <div className="vision-card">

              <span className="vision-number">
                02
              </span>

              <span className="vision-icon">
                ◇
              </span>

              <h3>
                Our Mission
              </h3>

              <p>
                To deliver quality, sustainable, and affordable packaging solutions 
                while supporting members and businesses through meaningful 
                opportunities, modern industrial thinking and a cooperative approach 
                focused on sustainable growth.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CORE VALUES
      ===================================================== */}
      <section className="about-values">

        <div className="about-container">

          <div className="values-heading">

            <span className="about-section-label">
              WHAT GUIDES US
            </span>

            <h2>
              Principles that
              <br />
              <em>move us forward.</em>
            </h2>

            <p>
              Our work is shaped by the principles of cooperation, responsibility 
              and a commitment to creating meaningful long-term value.
            </p>

          </div>


          <div className="values-list">

            <div className="value-item">

              <span>01</span>

              <div>
                <h3>Cooperative Spirit</h3>

                <p>
                  We operate as a cooperative, ensuring fair prices and quality 
                  for our members. We believe collective effort creates stronger 
                  and more sustainable outcomes.
                </p>
              </div>

            </div>


            <div className="value-item">

              <span>02</span>

              <div>
                <h3>Quality First</h3>

                <p>
                  Rigorous quality checks ensure every product meets our high 
                  standards. We remain connected to the people and communities 
                  that form our foundation.
                </p>
              </div>

            </div>


            <div className="value-item">

              <span>03</span>

              <div>
                <h3>Sustainability</h3>

                <p>
                  Eco-friendly packaging options to help you reduce your carbon 
                  footprint. We approach growth with accountability, integrity 
                  and long-term thinking.
                </p>

              </div>

            </div>


            <div className="value-item">

              <span>04</span>

              <div>
                <h3>MSME Focus</h3>

                <p>
                  Tailored solutions for MSMEs, cooperatives, and growing businesses. 
                  We embrace modern ideas and opportunities that can create 
                  meaningful development.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          COOPERATIVE STATEMENT
      ===================================================== */}
      <section className="about-statement">

        <div className="about-statement-inner">

          <span className="about-section-label">
            THE MMMICS APPROACH
          </span>

          <h2>
            Together,
            <br />
            <em>we build further.</em>
          </h2>

          <p>
            Cooperation is not simply our structure. It is the way we think, 
            grow and create opportunities for the future. We combine cooperative 
            values with modern industrial practices to create products and 
            relationships that stand the test of time.
          </p>

        </div>

      </section>


      {/* =====================================================
          CTA SECTION
      ===================================================== */}
      <section className="about-cta">

        <div className="about-container">

          <div>

            <span className="about-section-label">
              CONNECT WITH US
            </span>

            <h2>
              Let's build
              <br />
              <em>what comes next.</em>
            </h2>

          </div>

          <div className="about-cta-right">

            <p>
              Discover more about MMMICS, our work and the opportunities we 
              create through cooperation. Contact us today to discuss your 
              packaging needs.
            </p>

            <Link
              to="/contact"
              className="about-cta-button"
            >
              CONTACT US
              <span>↗</span>
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
};

export default About;