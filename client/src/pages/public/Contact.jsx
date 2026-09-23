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

import contectHero from "../../assets/contactus.png";

const Contact = () => {
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

  // ============================================================
  // HANDLE CHANGE
  // ============================================================

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

  // ============================================================
  // VALIDATE
  // ============================================================

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
      errors.phone =
        "Enter a valid phone number";
    }

    // ============================================================
    // ENQUIRY TYPE VALIDATION
    // ============================================================

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

    return (
      Object.keys(errors).length === 0
    );
  };

  // ============================================================
  // HANDLE SUBMIT
  // ============================================================

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
          name:
            formData.name.trim(),

          email:
            formData.email.trim(),

          phone:
            formData.phone.trim(),

          company:
            formData.company.trim() ||
            null,

          // Product or Membership
          type:
            formData.type,

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

      // ============================================================
      // RESET FORM
      // ============================================================

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

      if (
        err?.response?.data?.errors
      ) {
        setFieldErrors(
          err.response.data.errors
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="mmics-contact-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mmics-contact-hero">
        <div className="mmics-contact-hero-image">

          <img
            src={contectHero}
            alt="MMICS industrial facility"
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
              Have a question or a project in
              mind? Our team is here to help
              you find the right solution.
            </p>

            <a
              href="/gallery"
              className="mmics-contact-gallery-btn"
            >
              Explore Gallery

              <ArrowRight size={13} />
            </a>

          </div>

        </div>
      </section>


      {/* =====================================================
          CONTACT CARDS
      ===================================================== */}

      <section className="mmics-contact-info">

        <div className="mmics-contact-info-grid">

          {/* VISIT */}

          <div className="mmics-contact-info-card">

            <div className="mmics-contact-icon">
              <MapPin />
            </div>

            <h3>
              Visit Us
            </h3>

            <p>
              Manar Manufacturing
              <br />
              Industrial Cooperative
            </p>

          </div>


          {/* PHONE */}

          <div className="mmics-contact-info-card">

            <div className="mmics-contact-icon">
              <Phone />
            </div>

            <h3>
              Contact
            </h3>

            <p>
              +91 96402 77746
              <br />
              +91 95425 45709
            </p>

          </div>


          {/* EMAIL */}

          <div className="mmics-contact-info-card">

            <div className="mmics-contact-icon">
              <Mail />
            </div>

            <h3>
              Email
            </h3>

            <p>
              mmicslimited@gmail.com
            </p>

          </div>


          {/* ENQUIRIES */}

          <div className="mmics-contact-info-card">

            <div className="mmics-contact-icon">
              <MessageSquare />
            </div>

            <h3>
              Enquiries
            </h3>

            <p>
              For product enquiries
              <br />
              and membership requirements.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          MESSAGE + MAP
      ===================================================== */}

      <section className="mmics-contact-form-section">

        <div className="mmics-contact-form-container">

          {/* ==================================================
              LEFT — FORM
          ================================================== */}

          <div className="mmics-contact-form-wrapper">

            <div className="mmics-contact-form-heading">

              <span>
                CONTACT MMICS
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


            {/* ==================================================
                SUCCESS
            ================================================== */}

            {success && (
              <div className="mmics-contact-alert mmics-contact-success">

                <CheckCircle2 />

                <span>
                  {success}
                </span>

              </div>
            )}


            {/* ==================================================
                ERROR
            ================================================== */}

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

              {/* ==================================================
                  ROW 1 — NAME + EMAIL
              ================================================== */}

              <div className="mmics-contact-form-row">

                {/* NAME */}

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


                {/* EMAIL */}

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


              {/* ==================================================
                  ROW 2 — PHONE + COMPANY
              ================================================== */}

              <div className="mmics-contact-form-row">

                {/* PHONE */}

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


                {/* COMPANY */}

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


              {/* ==================================================
                  ENQUIRY TYPE
              ================================================== */}

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


              {/* ==================================================
                  SUBJECT
              ================================================== */}

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


              {/* ==================================================
                  MESSAGE
              ================================================== */}

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


              {/* ==================================================
                  SUBMIT
              ================================================== */}

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
              RIGHT — MAP
          ================================================== */}

          <div className="mmics-contact-map-wrapper">

            <iframe
              title="MMICS Location"
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