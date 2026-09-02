import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <div className="mmics-about">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="about-hero">

        <div className="about-hero-overlay"></div>

        <div className="about-hero-content">

          <span className="about-eyebrow">
            <i></i>
            WHO WE ARE
          </span>

          <h1>
            Built on
            <br />
            <em>cooperation.</em>
          </h1>

          <p>
            A collective vision bringing together people,
            businesses and communities through responsible
            industrial growth.
          </p>

          <div className="about-breadcrumb">
            <Link to="/">HOME</Link>
            <span>/</span>
            <strong>ABOUT US</strong>
          </div>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
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
              More than an
              <br />
              <em>organisation.</em>
            </h2>

            <div className="about-gold-line"></div>

            <p>
              Manarang Manufacturing Multistate Industrial
              Cooperative Society Limited is built around a
              cooperative approach that brings people,
              businesses and communities together.
            </p>

            <p>
              Our purpose is to create meaningful opportunities
              through responsible growth, industrial development
              and collective participation.
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
              Building stronger communities through
              cooperation and enterprise.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          IMAGE + ABOUT
      ===================================================== */}
      <section className="about-story">

        <div className="about-story-container">

          <div className="about-story-images">

            <div className="about-story-large">
              <img
                src="/images/about-1.jpg"
                alt="MMICS"
              />
            </div>

            <div className="about-story-small">
              <img
                src="/images/about-2.jpg"
                alt="MMICS activities"
              />

              <span>
                COMMUNITY • INDUSTRY • COOPERATION
              </span>
            </div>

            <div className="about-story-badge">
              <strong>M</strong>
              <span>MMICS</span>
            </div>

          </div>


          <div className="about-story-content">

            <span className="about-section-label">
              ABOUT MMICS
            </span>

            <h2>
              Rooted in
              <br />
              <em>community.</em>
            </h2>

            <div className="about-gold-line"></div>

            <p>
              MMICS represents a cooperative model where
              collective strength becomes the foundation for
              sustainable development.
            </p>

            <p>
              By bringing together members and enterprises,
              the organisation aims to create an environment
              where shared participation can lead to stronger
              economic and industrial opportunities.
            </p>

            <p>
              Our approach combines community values with
              modern thinking, creating a platform for growth
              that remains connected to the people it serves.
            </p>

            <Link to="/contact" className="about-outline-button">
              GET IN TOUCH
              <span>↗</span>
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          VISION / MISSION
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
                To create a stronger cooperative ecosystem
                where collective participation, enterprise
                and responsible development contribute to
                long-term community progress.
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
                To support members and businesses through
                meaningful opportunities, modern industrial
                thinking and a cooperative approach focused
                on sustainable growth.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          VALUES
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
              Our work is shaped by the principles of
              cooperation, responsibility and a commitment
              to creating meaningful long-term value.
            </p>

          </div>


          <div className="values-list">

            <div className="value-item">

              <span>01</span>

              <div>
                <h3>Cooperation</h3>

                <p>
                  We believe collective effort creates
                  stronger and more sustainable outcomes.
                </p>
              </div>

            </div>


            <div className="value-item">

              <span>02</span>

              <div>
                <h3>Community</h3>

                <p>
                  We remain connected to the people and
                  communities that form our foundation.
                </p>
              </div>

            </div>


            <div className="value-item">

              <span>03</span>

              <div>
                <h3>Responsibility</h3>

                <p>
                  We approach growth with accountability,
                  integrity and long-term thinking.
                </p>

              </div>

            </div>


            <div className="value-item">

              <span>04</span>

              <div>
                <h3>Progress</h3>

                <p>
                  We embrace modern ideas and opportunities
                  that can create meaningful development.
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
            THE MMICS APPROACH
          </span>

          <h2>
            Together,
            <br />
            <em>we build further.</em>
          </h2>

          <p>
            Cooperation is not simply our structure.
            It is the way we think, grow and create
            opportunities for the future.
          </p>

        </div>

      </section>


      {/* =====================================================
          CTA
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
              Discover more about MMICS, our work and
              the opportunities we create through
              cooperation.
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


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="about-footer">

        <div className="about-footer-container">

          <div className="about-footer-brand">

            <div className="about-footer-logo">
              <div className="about-footer-mark">
                M
              </div>

              <div>
                <strong>
                  MANARANG
                </strong>

                <span>
                  MANUFACTURING MULTISTATE
                </span>

                <small>
                  INDUSTRIAL COOPERATIVE SOCIETY LIMITED
                </small>
              </div>
            </div>

            <p>
              Rooted in community. Driven by ambition.
            </p>

          </div>


          <div className="about-footer-column">

            <h3>EXPLORE</h3>

            <Link to="/">Home</Link>

            <Link to="/about">About</Link>

            <Link to="/contact">Contact</Link>

          </div>


          <div className="about-footer-column">

            <h3>CONTACT</h3>

            <a href="mailto:info@mmmicslimited.com">
              info@mmmicslimited.com
            </a>

            <a href="tel:04842654871">
              0484 265 4871
            </a>

            <span>
              Kadavanthara,
              <br />
              Ernakulam, Kerala
            </span>

          </div>

        </div>


        <div className="about-footer-bottom">

          <span>
            © 2024 MMICS Limited. All rights reserved.
          </span>

          <span>
            MANUFACTURING • COOPERATION • PROGRESS
          </span>

        </div>

      </footer>

    </div>
  );
};

export default About;