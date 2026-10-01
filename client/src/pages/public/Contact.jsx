import React, { useState } from "react";

import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

import "./Contact.css";

/* ============================================================
   IMAGES
============================================================ */

import contactUsImage from "../../assets/map.png";
import indiaMap from "../../assets/india_outline.svg";
import companyLogo from "../../assets/logo.png";

/* ============================================================
   NETWORK LOCATIONS
============================================================ */

const networkLocations = [
  {
    id: "delhi",
    name: "Delhi",
    x: 40.0,
    y: 31.5,
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    x: 31.2,
    y: 49.5,
  },
  {
    id: "mumbai",
    name: "Mumbai",
    x: 31.8,
    y: 62.2,
  },
  {
    id: "pune",
    name: "Pune",
    x: 33.6,
    y: 64.0,
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    x: 42.5,
    y: 67.7,
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    x: 40.7,
    y: 81.8,
  },
  {
    id: "coimbatore",
    name: "Coimbatore",
    x: 40.4,
    y: 88.2,
  },
  {
    id: "kochi",
    name: "Kochi",
    x: 39.1,
    y: 90.8,
  },
  {
    id: "chennai",
    name: "Chennai",
    x: 44.8,
    y: 81.5,
  },
  {
    id: "puducherry",
    name: "Puducherry",
    x: 44.8,
    y: 85.3,
  },
  {
    id: "kolkata",
    name: "Kolkata",
    x: 60.8,
    y: 50.8,
  },
];

/* ============================================================
   NETWORK ROUTES
============================================================ */

const networkRoutes = [
  ["delhi", "ahmedabad"],
  ["delhi", "kolkata"],

  ["ahmedabad", "mumbai"],

  ["mumbai", "pune"],

  ["pune", "hyderabad"],

  ["hyderabad", "kolkata"],
  ["hyderabad", "bengaluru"],
  ["hyderabad", "chennai"],

  ["bengaluru", "chennai"],
  ["bengaluru", "coimbatore"],

  ["coimbatore", "kochi"],

  ["chennai", "puducherry"],
];

const networkLocationMap = Object.fromEntries(
  networkLocations.map((location) => [
    location.id,
    location,
  ])
);

const Contact = () => {
  /* ==========================================================
     FORM STATE
  ========================================================== */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  /* ==========================================================
     HANDLE CHANGE
  ========================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setSuccess("");
    setError("");
  };

  /* ==========================================================
     VALIDATE FORM
  ========================================================== */

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      errors.email = "Enter a valid email";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (
      !/^[0-9+\-\s()]{7,15}$/.test(
        formData.phone
      )
    ) {
      errors.phone = "Enter a valid phone number";
    }

    if (!formData.type) {
      errors.type =
        "Please select an enquiry type";
    }

    if (!formData.subject.trim()) {
      errors.subject =
        "Subject is required";
    }

    if (!formData.message.trim()) {
      errors.message =
        "Message is required";
    } else if (
      formData.message.trim().length < 10
    ) {
      errors.message =
        "Message must be at least 10 characters";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* ==========================================================
     HANDLE SUBMIT
  ========================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/enquiries",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),

          company:
            formData.company.trim() || null,

          type: formData.type,

          subject:
            formData.subject.trim(),

          message:
            formData.message.trim(),
        }
      );

      console.log(
        "Enquiry created:",
        response.data
      );

      setSuccess(
        "Thank you! Your enquiry has been sent successfully. Our team will contact you shortly."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        type: "",
        subject: "",
        message: "",
      });

      setFieldErrors({});

      setTimeout(() => {
        setSuccess("");
      }, 6000);
    } catch (err) {
      console.error(
        "Contact form error:",
        err
      );

      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong. Please try again.";

      setError(serverMessage);

      if (err?.response?.data?.errors) {
        setFieldErrors(
          err.response.data.errors
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mmics-contact-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mmics-contact-hero">

        <div className="mmics-contact-hero-image">

          <img
            src={contactUsImage}
            alt="MMMICS industrial facility"
          />

          <div className="mmics-contact-hero-overlay" />

          <div className="mmics-contact-hero-content">

            <span className="mmics-contact-kicker">
              GET IN TOUCH
            </span>

            <h1>
              Let's Build Something Together
            </h1>

            <p>
              Have a question or a project in mind?
              Our team is here to help you find the
              right solution.
            </p>

            <a
              href="/gallery"
              className="mmics-contact-gallery-btn"
            >
              Explore Gallery
              <ArrowRight size={14} />
            </a>

          </div>

        </div>

      </section>

      {/* =====================================================
          NETWORK
      ===================================================== */}

      <section className="mmics-network-section">

        <div className="mmics-network-container">

          {/* HEADING */}

          <div className="mmics-network-heading">

            <span>
              OUR NETWORK
            </span>

            <h2>
              Connecting Businesses{" "}
              <strong>
                Across India
              </strong>
            </h2>

            <p>
              Connecting manufacturers,
              businesses and cooperative
              opportunities across key
              industrial regions.
            </p>

          </div>

          {/* MAP + CONTACT */}

          <div className="mmics-network-layout">

            {/* =================================================
                MAP
            ================================================= */}

            <div className="mmics-network-map">

              {/* BACKGROUND IMAGE */}

              <img
                src={contactUsImage}
                alt=""
                aria-hidden="true"
                className="mmics-network-background-image"
              />

              {/* OVERLAY */}

              <div className="mmics-network-background-overlay" />

              {/* =================================================
                  COMPANY LOGO — TOP LEFT
              ================================================= */}

              <div className="mmics-network-brand-logo">

                <img
                  src={companyLogo}
                  alt="MMMICS Logo"
                />

              </div>

              {/* =================================================
                  DESCRIPTION — BOTTOM RIGHT
              ================================================= */}

              <div className="mmics-network-map-description">

                <span>
                  CONNECT WITH MMMICS
                </span>

                <h3>
                  Building Stronger Connections
                </h3>

                <p>
                  Connect with our team for product,
                  membership and business enquiries
                  across our growing industrial network.
                </p>

              </div>

              {/* =================================================
                  INDIA MAP
              ================================================= */}

              <div className="mmics-network-map-canvas">

                <img
                  src={indiaMap}
                  alt="MMMICS India business network"
                  className="mmics-india-map"
                />

                {/* ROUTES */}

                <svg
                  className="mmics-network-routes"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >

                  {networkRoutes.map(
                    ([fromId, toId], index) => {
                      const from =
                        networkLocationMap[fromId];

                      const to =
                        networkLocationMap[toId];

                      if (!from || !to) {
                        return null;
                      }

                      return (
                        <line
                          key={`${fromId}-${toId}-${index}`}
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                        />
                      );
                    }
                  )}

                </svg>

                {/* MARKERS */}

                {networkLocations.map(
                  (location) => (

                    <div
                      key={location.id}
                      className={`
                        mmics-network-marker
                        mmics-network-marker--${location.id}
                      `}
                      style={{
                        left: `${location.x}%`,
                        top: `${location.y}%`,
                      }}
                    >

                      <span className="mmics-network-marker-dot" />

                      <span className="mmics-network-marker-label">
                        {location.name}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* =================================================
                RIGHT CONTACT PANEL
            ================================================= */}

            <div className="mmics-network-contact-panel">

              <div className="mmics-network-contact-heading">

                <span>
                  CONNECT WITH MMMICS
                </span>

                <h3>
                  We're Here To Help
                </h3>

                <p>
                  Reach our team for product,
                  membership and business enquiries.
                </p>

              </div>

              {/* VISIT */}

              <div className="mmics-network-contact-card">

                <div className="mmics-network-contact-icon">
                  <MapPin />
                </div>

                <div className="mmics-network-contact-content">

                  <h4>
                    Visit Us
                  </h4>

                  <p>
                    Manar Manufacturing
                    <br />
                    Industrial Cooperative
                  </p>

                </div>

              </div>

              {/* CONTACT */}

              <div className="mmics-network-contact-card">

                <div className="mmics-network-contact-icon">
                  <Phone />
                </div>

                <div className="mmics-network-contact-content">

                  <h4>
                    Contact
                  </h4>

                  <p>
                    +91 94435 54370
                  </p>

                </div>

              </div>

              {/* EMAIL */}

              <div className="mmics-network-contact-card">

                <div className="mmics-network-contact-icon">
                  <Mail />
                </div>

                <div className="mmics-network-contact-content">

                  <h4>
                    Email
                  </h4>

                  <p>
                    mmicslimited@gmail.com
                  </p>

                </div>

              </div>

              {/* ENQUIRIES */}

              <div className="mmics-network-contact-card">

                <div className="mmics-network-contact-icon">
                  <MessageSquare />
                </div>

                <div className="mmics-network-contact-content">

                  <h4>
                    Enquiries
                  </h4>

                  <p>
                    For product enquiries and
                    membership requirements.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTACT FORM
      ===================================================== */}

      <section className="mmics-contact-form-section">

        <div className="mmics-contact-form-container">

          {/* FORM */}

          <div className="mmics-contact-form-wrapper">

            <div className="mmics-contact-form-heading">

              <span>
                CONTACT MMMICS
              </span>

              <h2>
                Send Us A Message
              </h2>

              <p>
                Tell us about your requirement
                and our team will get in touch
                with you.
              </p>

            </div>

            {/* SUCCESS */}

            {success && (

              <div className="mmics-contact-alert mmics-contact-success">

                <CheckCircle2 />

                <span>
                  {success}
                </span>

              </div>

            )}

            {/* ERROR */}

            {error && (

              <div className="mmics-contact-alert mmics-contact-error">

                <AlertCircle />

                <span>
                  {error}
                </span>

              </div>

            )}

            <form
              className="mmics-contact-form"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* NAME + EMAIL */}

              <div className="mmics-contact-form-row">

                <div className="mmics-contact-field">

                  <label htmlFor="name">
                    Full Name *
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="name"
                    aria-invalid={
                      Boolean(
                        fieldErrors.name
                      )
                    }
                  />

                  {fieldErrors.name && (

                    <small className="mmics-contact-field-error">
                      {fieldErrors.name}
                    </small>

                  )}

                </div>

                <div className="mmics-contact-field">

                  <label htmlFor="email">
                    Email Address *
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="email"
                    aria-invalid={
                      Boolean(
                        fieldErrors.email
                      )
                    }
                  />

                  {fieldErrors.email && (

                    <small className="mmics-contact-field-error">
                      {fieldErrors.email}
                    </small>

                  )}

                </div>

              </div>

              {/* PHONE + COMPANY */}

              <div className="mmics-contact-form-row">

                <div className="mmics-contact-field">

                  <label htmlFor="phone">
                    Phone Number *
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="tel"
                    aria-invalid={
                      Boolean(
                        fieldErrors.phone
                      )
                    }
                  />

                  {fieldErrors.phone && (

                    <small className="mmics-contact-field-error">
                      {fieldErrors.phone}
                    </small>

                  )}

                </div>

                <div className="mmics-contact-field">

                  <label htmlFor="company">
                    Company Name
                  </label>

                  <input
                    id="company"
                    type="text"
                    name="company"
                    placeholder="Enter your company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="organization"
                  />

                </div>

              </div>

              {/* ENQUIRY TYPE */}

              <div className="mmics-contact-field">

                <label htmlFor="type">
                  Enquiry Type *
                </label>

                <div className="mmics-contact-select-wrapper">

                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={
                      Boolean(
                        fieldErrors.type
                      )
                    }
                  >

                    <option
                      value=""
                      disabled
                    >
                      Select enquiry type
                    </option>

                    <option value="PRODUCT">
                      Product
                    </option>

                    <option value="MEMBERSHIP">
                      Membership
                    </option>

                  </select>

                </div>

                {fieldErrors.type && (

                  <small className="mmics-contact-field-error">
                    {fieldErrors.type}
                  </small>

                )}

              </div>

              {/* SUBJECT */}

              <div className="mmics-contact-field">

                <label htmlFor="subject">
                  Subject / Requirement *
                </label>

                <input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="Tell us your requirement"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={loading}
                  aria-invalid={
                    Boolean(
                      fieldErrors.subject
                    )
                  }
                />

                {fieldErrors.subject && (

                  <small className="mmics-contact-field-error">
                    {fieldErrors.subject}
                  </small>

                )}

              </div>

              {/* MESSAGE */}

              <div className="mmics-contact-field">

                <label htmlFor="message">
                  Message *
                </label>

                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your requirement..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  disabled={loading}
                  aria-invalid={
                    Boolean(
                      fieldErrors.message
                    )
                  }
                />

                {fieldErrors.message && (

                  <small className="mmics-contact-field-error">
                    {fieldErrors.message}
                  </small>

                )}

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="mmics-contact-submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <Loader2 className="mmics-contact-spinner" />

                    <span>
                      Sending...
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Send Enquiry
                    </span>

                    <ArrowRight />
                  </>
                )}

              </button>

            </form>

          </div>

          {/* ==================================================
              GOOGLE MAP
          ================================================== */}

          <div className="mmics-contact-map-wrapper">

            <iframe
              title="MMMICS Location"
              src="https://www.google.com/maps?q=Manarang+Manufacturing+Multistate+Industrial+Cooperative+Society+Limited,+No.211,+Ganapathi+Nagar+Colony,+Sattamangalam+Padappai+Rd,+Maraimalai+Nagar,+Siruvanjur,+Tamil+Nadu+603203&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

          </div>

        </div>

      </section>

    </main>
  );
};

export default Contact;