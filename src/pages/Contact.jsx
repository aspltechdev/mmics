import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    /*
      Frontend only for now.
      No backend/API is being used.
    */

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="contact-page">

      {/* =====================================================
          MAP
          ===================================================== */}

      <section className="contact-map-section">
        <iframe
          title="MMICS Limited Location"
          src="https://www.google.com/maps?q=Sri+Ganapathi+Nagar+Colony,+Sattamangalam,+Chengalpattu,+Tamil+Nadu+603209&output=embed"
          className="contact-map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        <div className="contact-map-overlay">
          <div className="contact-location-card">
            <div className="contact-location-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <circle
                  cx="12"
                  cy="9"
                  r="2.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            <div>
              <span>VISIT US</span>
              <strong>MMICS Limited</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT CONTENT
          ===================================================== */}

      <section className="contact-content-section">
        <div className="contact-container">

          {/* =================================================
              LEFT — FORM
              ================================================= */}

          <div className="contact-form-column">

            <span className="contact-eyebrow">
              GET IN TOUCH
            </span>

            <h1>
              Leave A
              <span> Message</span>
            </h1>

            <p className="contact-intro">
              Have a question or want to know more about our
              products and services? Send us a message and
              our team will get back to you.
            </p>

            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >

              <div className="contact-form-row">

                <div className="contact-field">
                  <label htmlFor="contact-name">
                    Your Name
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">
                    Your Email
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                  />
                </div>

              </div>

              <div className="contact-field">
                <label htmlFor="contact-phone">
                  Phone
                </label>

                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message">
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows="6"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="contact-submit"
              >
                <span>SEND MESSAGE</span>

                <span className="contact-submit-arrow">
                  ↗
                </span>
              </button>

              {submitted && (
                <div className="contact-success">
                  <span className="contact-success-icon">
                    ✓
                  </span>

                  <div>
                    <strong>Message received</strong>

                    <p>
                      Thank you for contacting us. We will
                      get back to you soon.
                    </p>
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* =================================================
              RIGHT — CONTACT INFORMATION
              ================================================= */}

          <div className="contact-info-column">

            {/* Address */}

            <div className="contact-info-block">

              <div className="contact-info-icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <circle
                    cx="12"
                    cy="9"
                    r="2.2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
              </div>

              <div>
                <h3>Address</h3>

                <p>
                  #211, Sri Ganapathi Nagar Colony,
                  <br />
                  Sattamangalam, Marimalai Nagar,
                  <br />
                  Chengalpattu, Tamil Nadu - 603209,
                  India.
                </p>
              </div>

            </div>

            {/* Email */}

            <div className="contact-info-block">

              <div className="contact-info-icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <path
                    d="m4 7 8 6 8-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
              </div>

              <div>
                <h3>Email Us</h3>

                <a
                  href="mailto:mmmicslimited@gmail.com"
                  className="contact-info-link"
                >
                  mmmicslimited@gmail.com
                </a>
              </div>

            </div>

            {/* Phone */}

            <div className="contact-info-block">

              <div className="contact-info-icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M7.2 3.8 9.5 3c.7-.2 1.4.1 1.7.8l1.2 2.8c.3.7.1 1.5-.5 1.9l-1.5 1.1c1 2.1 2.4 3.6 4.5 4.5l1.1-1.5c.4-.6 1.2-.8 1.9-.5l2.8 1.2c.7.3 1 1 .8 1.7l-.8 2.3c-.3.9-1.2 1.5-2.2 1.4C10.5 18 6 13.5 5.3 7.1c-.1-1 .5-1.9 1.4-2.2Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <h3>Contact</h3>

                <div className="contact-phone-list">
                  <a href="tel:+919840277476">
                    +91 98402 77476
                  </a>

                  <a href="tel:+919443554370">
                    +91 94435 54370
                  </a>

                  <a href="tel:+918970664471">
                    +91 89780 66471
                  </a>
                </div>
              </div>

            </div>

            {/* Social Media */}

            <div className="contact-social-block">

              <h3>Follow Us</h3>

              <div className="contact-socials">

                <a
                  href="#"
                  className="contact-social facebook"
                  aria-label="Facebook"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M14.5 8H17V4.5c-.4-.1-1.8-.2-3.4-.2-3.3 0-5.6 2-5.6 5.7v3.2H4.5V17h3.5v7h4.3v-7h3.4l.5-3.8h-3.9V10c0-1.1.3-2 2.2-2Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>

                <a
                  href="#"
                  className="contact-social x-social"
                  aria-label="X"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 4h4.1l3.2 4.3L16 4h2.8l-5.2 6 5.5 7.3H15l-3.5-4.7L7.3 17H4.5l5.5-6.4L5 4Zm3.8 1.7H7.7l7.6 9.7h1.1L8.8 5.7Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>

                <a
                  href="#"
                  className="contact-social youtube"
                  aria-label="YouTube"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M21 8.2a2.8 2.8 0 0 0-2-2C17.3 5.7 12 5.7 12 5.7s-5.3 0-7 .5a2.8 2.8 0 0 0-2 2C2.5 9.9 2.5 12 2.5 12s0 2.1.5 3.8a2.8 2.8 0 0 0 2 2c1.7.5 7 .5 7 .5s5.3 0 7-.5a2.8 2.8 0 0 0 2-2c.5-1.7.5-3.8.5-3.8s0-2.1-.5-3.8Z"
                      fill="currentColor"
                    />

                    <path
                      d="m10 9 5 3-5 3V9Z"
                      fill="#fff"
                    />
                  </svg>
                </a>

                <a
                  href="#"
                  className="contact-social instagram"
                  aria-label="Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect
                      x="3.5"
                      y="3.5"
                      width="17"
                      height="17"
                      rx="4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                    <circle
                      cx="17.5"
                      cy="6.8"
                      r="1.2"
                      fill="currentColor"
                    />
                  </svg>
                </a>

                <a
                  href="#"
                  className="contact-social linkedin"
                  aria-label="LinkedIn"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 8.2H3.2V21H6V8.2ZM4.6 3C3.7 3 3 3.7 3 4.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6S5.5 3 4.6 3ZM21 13.6c0-3.8-2-5.6-4.8-5.6-2.2 0-3.2 1.2-3.8 2v-1.8H9.6V21h2.8v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2 1.9 2 3.4V21H21v-7.4Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
          ===================================================== */}

      <section className="contact-cta">
        <div className="contact-cta-inner">

          <div>
            <span className="contact-eyebrow">
              LET'S CONNECT
            </span>

            <h2>
              Have something
              <span> in mind?</span>
            </h2>
          </div>

          <a
            href="mailto:mmmicslimited@gmail.com"
            className="contact-cta-button"
          >
            EMAIL US
            <span>↗</span>
          </a>

        </div>
      </section>

    </div>
  );
};

export default Contact;