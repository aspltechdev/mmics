// // // // client/src/pages/public/Contact.jsx

// // // import React from "react";

// // // const Contact = () => {
// // //   return (
// // //     <section>
// // //       <h1>Contact</h1>
// // //       <p>Contact page content will be added here.</p>
// // //     </section>
// // //   );
// // // };

// // // export default Contact;
















// // // import React, { useState } from "react";
// // // import {
// // //   MapPin,
// // //   Phone,
// // //   Mail,
// // //   MessageSquare,
// // //   ArrowRight,
// // //   CheckCircle2,
// // //   Loader2,
// // // } from "lucide-react";

// // // import "./Contact.css";

// // // const Contact = () => {
// // //   const [formData, setFormData] = useState({
// // //     name: "",
// // //     email: "",
// // //     phone: "",
// // //     company: "",
// // //     subject: "",
// // //     message: "",
// // //   });

// // //   const [loading, setLoading] = useState(false);
// // //   const [success, setSuccess] = useState("");
// // //   const [error, setError] = useState("");

// // //   // ============================================================
// // //   // HANDLE INPUT
// // //   // ============================================================

// // //   const handleChange = (event) => {
// // //     const { name, value } = event.target;

// // //     setFormData((previous) => ({
// // //       ...previous,
// // //       [name]: value,
// // //     }));

// // //     setSuccess("");
// // //     setError("");
// // //   };

// // //   // ============================================================
// // //   // SUBMIT W3FORMS
// // //   // ============================================================

// // //   const handleSubmit = async (event) => {
// // //     event.preventDefault();

// // //     setLoading(true);
// // //     setSuccess("");
// // //     setError("");

// // //     try {
// // //       const accessKey =
// // //         import.meta.env.VITE_W3FORMS_ACCESS_KEY;

// // //       if (!accessKey) {
// // //         throw new Error(
// // //           "W3Forms access key is not configured."
// // //         );
// // //       }

// // //       const payload = {
// // //         access_key: accessKey,

// // //         subject:
// // //           formData.subject ||
// // //           "New MMICS Website Enquiry",

// // //         from_name:
// // //           formData.name,

// // //         name:
// // //           formData.name,

// // //         email:
// // //           formData.email,

// // //         phone:
// // //           formData.phone,

// // //         company:
// // //           formData.company,

// // //         subject_line:
// // //           formData.subject,

// // //         message:
// // //           formData.message,

// // //         botcheck: "",

// // //         // Optional redirect disabled
// // //         redirect: "false",
// // //       };

// // //       const response = await fetch(
// // //         "https://api.w3forms.com/submit",
// // //         {
// // //           method: "POST",

// // //           headers: {
// // //             "Content-Type":
// // //               "application/json",
// // //             Accept:
// // //               "application/json",
// // //           },

// // //           body: JSON.stringify(payload),
// // //         }
// // //       );

// // //       const result =
// // //         await response.json();

// // //       if (!response.ok || !result.success) {
// // //         throw new Error(
// // //           result.message ||
// // //             "Unable to send your enquiry."
// // //         );
// // //       }

// // //       setSuccess(
// // //         "Thank you! Your enquiry has been sent successfully."
// // //       );

// // //       setFormData({
// // //         name: "",
// // //         email: "",
// // //         phone: "",
// // //         company: "",
// // //         subject: "",
// // //         message: "",
// // //       });
// // //     } catch (submitError) {
// // //       console.error(
// // //         "Contact form error:",
// // //         submitError
// // //       );

// // //       setError(
// // //         submitError.message ||
// // //           "Something went wrong. Please try again."
// // //       );
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <main className="mmics-contact-page">

// // //       {/* ======================================================
// // //           CONTACT HERO
// // //       ====================================================== */}

// // //       <section className="mmics-contact-hero">

// // //         <div className="mmics-contact-hero-image">
// // //           <img
// // //             src="/images/contact-hero.jpg"
// // //             alt="MMICS"
// // //           />

// // //           <div className="mmics-contact-hero-overlay" />

// // //           <div className="mmics-contact-hero-content">

// // //             <span className="mmics-contact-kicker">
// // //               GALLERY
// // //             </span>

// // //             <h1>
// // //               A Look Inside MMICS
// // //             </h1>

// // //             <p>
// // //               Explore our products, people,
// // //               facilities and moments that
// // //               shape our journey.
// // //             </p>

// // //             <a
// // //               href="/gallery"
// // //               className="mmics-contact-gallery-btn"
// // //             >
// // //               <span>
// // //                 Explore Gallery
// // //               </span>

// // //               <ArrowRight size={10} />
// // //             </a>

// // //           </div>
// // //         </div>

// // //       </section>


// // //       {/* ======================================================
// // //           CONTACT INFORMATION CARDS
// // //       ====================================================== */}

// // //       <section className="mmics-contact-info">

// // //         <div className="mmics-contact-info-grid">

// // //           {/* VISIT */}

// // //           <div className="mmics-contact-info-card">

// // //             <div className="mmics-contact-icon">
// // //               <MapPin size={14} />
// // //             </div>

// // //             <h3>
// // //               Visit Us
// // //             </h3>

// // //             <p>
// // //               Manar Manufacturing
// // //               <br />
// // //               Industrial Cooperative
// // //             </p>

// // //           </div>


// // //           {/* PHONE */}

// // //           <div className="mmics-contact-info-card">

// // //             <div className="mmics-contact-icon">
// // //               <Phone size={14} />
// // //             </div>

// // //             <h3>
// // //               Contact
// // //             </h3>

// // //             <p>
// // //               +91 96402 77746
// // //               <br />
// // //               +91 95425 45709
// // //             </p>

// // //           </div>


// // //           {/* EMAIL */}

// // //           <div className="mmics-contact-info-card">

// // //             <div className="mmics-contact-icon">
// // //               <Mail size={14} />
// // //             </div>

// // //             <h3>
// // //               Email
// // //             </h3>

// // //             <p>
// // //               mmicslimited@gmail.com
// // //             </p>

// // //           </div>


// // //           {/* ENQUIRY */}

// // //           <div className="mmics-contact-info-card">

// // //             <div className="mmics-contact-icon">
// // //               <MessageSquare size={14} />
// // //             </div>

// // //             <h3>
// // //               Enquiries
// // //             </h3>

// // //             <p>
// // //               For product enquiries
// // //               <br />
// // //               and business requirements.
// // //             </p>

// // //           </div>

// // //         </div>

// // //       </section>


// // //       {/* ======================================================
// // //           MESSAGE + MAP
// // //       ====================================================== */}

// // //       <section className="mmics-contact-form-section">

// // //         <div className="mmics-contact-form-container">

// // //           {/* ==================================================
// // //               FORM
// // //           ================================================== */}

// // //           <div className="mmics-contact-form-wrapper">

// // //             <div className="mmics-contact-form-heading">

// // //               <h2>
// // //                 Send Us A Message
// // //               </h2>

// // //               <p>
// // //                 Tell us about your requirement
// // //                 and our team will get in touch
// // //                 with you.
// // //               </p>

// // //             </div>


// // //             {/* SUCCESS */}

// // //             {success && (
// // //               <div className="mmics-contact-alert mmics-contact-success">
// // //                 <CheckCircle2 size={13} />

// // //                 <span>
// // //                   {success}
// // //                 </span>
// // //               </div>
// // //             )}


// // //             {/* ERROR */}

// // //             {error && (
// // //               <div className="mmics-contact-alert mmics-contact-error">
// // //                 <span>
// // //                   {error}
// // //                 </span>
// // //               </div>
// // //             )}


// // //             <form
// // //               className="mmics-contact-form"
// // //               onSubmit={handleSubmit}
// // //             >

// // //               {/* ROW 1 */}

// // //               <div className="mmics-contact-form-row">

// // //                 <div className="mmics-contact-field">
// // //                   <label htmlFor="name">
// // //                     Full Name
// // //                   </label>

// // //                   <input
// // //                     id="name"
// // //                     name="name"
// // //                     type="text"
// // //                     placeholder="Enter your name"
// // //                     value={formData.name}
// // //                     onChange={handleChange}
// // //                     required
// // //                   />
// // //                 </div>


// // //                 <div className="mmics-contact-field">
// // //                   <label htmlFor="email">
// // //                     Email Address
// // //                   </label>

// // //                   <input
// // //                     id="email"
// // //                     name="email"
// // //                     type="email"
// // //                     placeholder="Enter your email"
// // //                     value={formData.email}
// // //                     onChange={handleChange}
// // //                     required
// // //                   />
// // //                 </div>

// // //               </div>


// // //               {/* ROW 2 */}

// // //               <div className="mmics-contact-form-row">

// // //                 <div className="mmics-contact-field">
// // //                   <label htmlFor="phone">
// // //                     Phone Number
// // //                   </label>

// // //                   <input
// // //                     id="phone"
// // //                     name="phone"
// // //                     type="tel"
// // //                     placeholder="Enter your phone number"
// // //                     value={formData.phone}
// // //                     onChange={handleChange}
// // //                     required
// // //                   />
// // //                 </div>


// // //                 <div className="mmics-contact-field">
// // //                   <label htmlFor="company">
// // //                     Company Name
// // //                   </label>

// // //                   <input
// // //                     id="company"
// // //                     name="company"
// // //                     type="text"
// // //                     placeholder="Enter your company"
// // //                     value={formData.company}
// // //                     onChange={handleChange}
// // //                   />
// // //                 </div>

// // //               </div>


// // //               {/* SUBJECT */}

// // //               <div className="mmics-contact-field">
// // //                 <label htmlFor="subject">
// // //                   Subject / Requirement
// // //                 </label>

// // //                 <input
// // //                   id="subject"
// // //                   name="subject"
// // //                   type="text"
// // //                   placeholder="Tell us your requirement"
// // //                   value={formData.subject}
// // //                   onChange={handleChange}
// // //                   required
// // //                 />
// // //               </div>


// // //               {/* MESSAGE */}

// // //               <div className="mmics-contact-field">
// // //                 <label htmlFor="message">
// // //                   Message
// // //                 </label>

// // //                 <textarea
// // //                   id="message"
// // //                   name="message"
// // //                   placeholder="Tell us about your requirement..."
// // //                   value={formData.message}
// // //                   onChange={handleChange}
// // //                   rows={5}
// // //                   required
// // //                 />
// // //               </div>


// // //               {/* HONEYPOT */}

// // //               <input
// // //                 type="checkbox"
// // //                 name="botcheck"
// // //                 className="mmics-contact-botcheck"
// // //                 tabIndex="-1"
// // //                 autoComplete="off"
// // //               />


// // //               {/* SUBMIT */}

// // //               <button
// // //                 type="submit"
// // //                 className="mmics-contact-submit"
// // //                 disabled={loading}
// // //               >

// // //                 {loading ? (
// // //                   <>
// // //                     <Loader2
// // //                       size={11}
// // //                       className="mmics-contact-spinner"
// // //                     />

// // //                     Sending...
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     Send Enquiry

// // //                     <ArrowRight size={11} />
// // //                   </>
// // //                 )}

// // //               </button>

// // //             </form>

// // //           </div>


// // //           {/* ==================================================
// // //               MAP
// // //           ================================================== */}

// // //           <div className="mmics-contact-map-wrapper">

// // //             <iframe
// // //               title="MMICS Location"
// // //               src="https://www.google.com/maps?q=Manar+Manufacturing+Industrial+Cooperative&output=embed"
// // //               loading="lazy"
// // //               referrerPolicy="no-referrer-when-downgrade"
// // //             />

// // //           </div>

// // //         </div>

// // //       </section>

// // //     </main>
// // //   );
// // // };

// // // export default Contact;



// // import React, { useState } from "react";
// // import {
// //   MapPin,
// //   Phone,
// //   Mail,
// //   MessageSquare,
// //   ArrowRight,
// //   CheckCircle2,
// //   Loader2,
// // } from "lucide-react";

// // import "./Contact.css";

// // const Contact = () => {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     company: "",
// //     subject: "",
// //     message: "",
// //   });

// //   const [loading, setLoading] = useState(false);
// //   const [success, setSuccess] = useState("");
// //   const [error, setError] = useState("");

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;

// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));

// //     setSuccess("");
// //     setError("");
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     setLoading(true);
// //     setSuccess("");
// //     setError("");

// //     try {
// //       const accessKey =
// //         import.meta.env.VITE_W3FORMS_ACCESS_KEY;

// //       if (!accessKey) {
// //         throw new Error(
// //           "W3Forms access key is not configured."
// //         );
// //       }

// //       const response = await fetch(
// //         "https://api.w3forms.com/submit",
// //         {
// //           method: "POST",

// //           headers: {
// //             "Content-Type": "application/json",
// //             Accept: "application/json",
// //           },

// //           body: JSON.stringify({
// //             access_key: accessKey,

// //             subject:
// //               formData.subject ||
// //               "New MMICS Website Enquiry",

// //             from_name: formData.name,

// //             name: formData.name,

// //             email: formData.email,

// //             phone: formData.phone,

// //             company: formData.company,

// //             requirement: formData.subject,

// //             message: formData.message,

// //             botcheck: "",

// //             redirect: "false",
// //           }),
// //         }
// //       );

// //       const result = await response.json();

// //       if (!response.ok || !result.success) {
// //         throw new Error(
// //           result.message ||
// //             "Unable to send your enquiry."
// //         );
// //       }

// //       setSuccess(
// //         "Thank you! Your enquiry has been sent successfully."
// //       );

// //       setFormData({
// //         name: "",
// //         email: "",
// //         phone: "",
// //         company: "",
// //         subject: "",
// //         message: "",
// //       });
// //     } catch (err) {
// //       console.error(
// //         "Contact form error:",
// //         err
// //       );

// //       setError(
// //         err.message ||
// //           "Something went wrong. Please try again."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <main className="mmics-contact-page">

// //       {/* =====================================================
// //           HERO
// //       ===================================================== */}

// //       <section className="mmics-contact-hero">

// //         <div className="mmics-contact-hero-image">

// //           <img
// //             src="/images/contact-hero.jpg"
// //             alt="MMICS industrial facility"
// //           />

// //           <div className="mmics-contact-hero-overlay" />

// //           <div className="mmics-contact-hero-content">

// //             <span className="mmics-contact-kicker">
// //               GALLERY
// //             </span>

// //             <h1>
// //               A Look Inside MMICS
// //             </h1>

// //             <p>
// //               Explore our products, people,
// //               facilities and moments that
// //               shape our journey.
// //             </p>

// //             <a
// //               href="/gallery"
// //               className="mmics-contact-gallery-btn"
// //             >
// //               Explore Gallery

// //               <ArrowRight size={13} />
// //             </a>

// //           </div>

// //         </div>

// //       </section>


// //       {/* =====================================================
// //           CONTACT CARDS
// //       ===================================================== */}

// //       <section className="mmics-contact-info">

// //         <div className="mmics-contact-info-grid">

// //           <div className="mmics-contact-info-card">

// //             <div className="mmics-contact-icon">
// //               <MapPin />
// //             </div>

// //             <h3>
// //               Visit Us
// //             </h3>

// //             <p>
// //               Manar Manufacturing
// //               <br />
// //               Industrial Cooperative
// //             </p>

// //           </div>


// //           <div className="mmics-contact-info-card">

// //             <div className="mmics-contact-icon">
// //               <Phone />
// //             </div>

// //             <h3>
// //               Contact
// //             </h3>

// //             <p>
// //               +91 96402 77746
// //               <br />
// //               +91 95425 45709
// //             </p>

// //           </div>


// //           <div className="mmics-contact-info-card">

// //             <div className="mmics-contact-icon">
// //               <Mail />
// //             </div>

// //             <h3>
// //               Email
// //             </h3>

// //             <p>
// //               mmicslimited@gmail.com
// //             </p>

// //           </div>


// //           <div className="mmics-contact-info-card">

// //             <div className="mmics-contact-icon">
// //               <MessageSquare />
// //             </div>

// //             <h3>
// //               Enquiries
// //             </h3>

// //             <p>
// //               For product enquiries
// //               <br />
// //               and business requirements.
// //             </p>

// //           </div>

// //         </div>

// //       </section>


// //       {/* =====================================================
// //           MESSAGE + MAP
// //       ===================================================== */}

// //       <section className="mmics-contact-form-section">

// //         <div className="mmics-contact-form-container">

// //           {/* ==================================================
// //               LEFT FORM
// //           ================================================== */}

// //           <div className="mmics-contact-form-wrapper">

// //             <div className="mmics-contact-form-heading">

// //               <span>
// //                 CONTACT MMICS
// //               </span>

// //               <h2>
// //                 Send Us A Message
// //               </h2>

// //               <p>
// //                 Tell us about your requirement
// //                 and our team will get in touch
// //                 with you.
// //               </p>

// //             </div>


// //             {/* SUCCESS */}

// //             {success && (
// //               <div className="mmics-contact-alert mmics-contact-success">
// //                 <CheckCircle2 />

// //                 <span>
// //                   {success}
// //                 </span>
// //               </div>
// //             )}


// //             {/* ERROR */}

// //             {error && (
// //               <div className="mmics-contact-alert mmics-contact-error">
// //                 <span>
// //                   {error}
// //                 </span>
// //               </div>
// //             )}


// //             <form
// //               className="mmics-contact-form"
// //               onSubmit={handleSubmit}
// //             >

// //               {/* ROW */}

// //               <div className="mmics-contact-form-row">

// //                 <div className="mmics-contact-field">
// //                   <label>
// //                     Full Name
// //                   </label>

// //                   <input
// //                     type="text"
// //                     name="name"
// //                     placeholder="Enter your name"
// //                     value={formData.name}
// //                     onChange={handleChange}
// //                     required
// //                   />
// //                 </div>


// //                 <div className="mmics-contact-field">
// //                   <label>
// //                     Email Address
// //                   </label>

// //                   <input
// //                     type="email"
// //                     name="email"
// //                     placeholder="Enter your email"
// //                     value={formData.email}
// //                     onChange={handleChange}
// //                     required
// //                   />
// //                 </div>

// //               </div>


// //               {/* ROW */}

// //               <div className="mmics-contact-form-row">

// //                 <div className="mmics-contact-field">
// //                   <label>
// //                     Phone Number
// //                   </label>

// //                   <input
// //                     type="tel"
// //                     name="phone"
// //                     placeholder="Enter your phone number"
// //                     value={formData.phone}
// //                     onChange={handleChange}
// //                     required
// //                   />
// //                 </div>


// //                 <div className="mmics-contact-field">
// //                   <label>
// //                     Company Name
// //                   </label>

// //                   <input
// //                     type="text"
// //                     name="company"
// //                     placeholder="Enter your company"
// //                     value={formData.company}
// //                     onChange={handleChange}
// //                   />
// //                 </div>

// //               </div>


// //               {/* SUBJECT */}

// //               <div className="mmics-contact-field">

// //                 <label>
// //                   Subject / Requirement
// //                 </label>

// //                 <input
// //                   type="text"
// //                   name="subject"
// //                   placeholder="Tell us your requirement"
// //                   value={formData.subject}
// //                   onChange={handleChange}
// //                   required
// //                 />

// //               </div>


// //               {/* MESSAGE */}

// //               <div className="mmics-contact-field">

// //                 <label>
// //                   Message
// //                 </label>

// //                 <textarea
// //                   name="message"
// //                   placeholder="Tell us about your requirement..."
// //                   value={formData.message}
// //                   onChange={handleChange}
// //                   rows={5}
// //                   required
// //                 />

// //               </div>


// //               {/* HONEYPOT */}

// //               <input
// //                 type="checkbox"
// //                 name="botcheck"
// //                 className="mmics-contact-botcheck"
// //                 tabIndex="-1"
// //                 autoComplete="off"
// //               />


// //               {/* SUBMIT */}

// //               <button
// //                 type="submit"
// //                 className="mmics-contact-submit"
// //                 disabled={loading}
// //               >

// //                 {loading ? (
// //                   <>
// //                     <Loader2 className="mmics-contact-spinner" />
// //                     Sending...
// //                   </>
// //                 ) : (
// //                   <>
// //                     Send Enquiry
// //                     <ArrowRight />
// //                   </>
// //                 )}

// //               </button>

// //             </form>

// //           </div>


// //           {/* ==================================================
// //               MAP
// //           ================================================== */}

// //           <div className="mmics-contact-map-wrapper">

// //             <iframe
// //               title="MMICS Location"
// //               src="https://www.google.com/maps?q=Manar+Manufacturing+Industrial+Cooperative&output=embed"
// //               loading="lazy"
// //               referrerPolicy="no-referrer-when-downgrade"
// //             />

// //           </div>

// //         </div>

// //       </section>

// //     </main>
// //   );
// // };

// // export default Contact;



// import React, { useState } from "react";
// import {
//   MapPin,
//   Phone,
//   Mail,
//   MessageSquare,
//   ArrowRight,
//   CheckCircle2,
//   Loader2,
// } from "lucide-react";

// import "./Contact.css";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//     subject: "",
//     message: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     setSuccess("");
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     setSuccess("");
//     setError("");

//     try {
//       const accessKey =
//         import.meta.env.VITE_W3FORMS_ACCESS_KEY;

//       if (!accessKey) {
//         throw new Error(
//           "W3Forms access key is not configured."
//         );
//       }

//       const response = await fetch(
//         "https://api.w3forms.com/submit",
//         {
//           method: "POST",

//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//           },

//           body: JSON.stringify({
//             access_key: accessKey,

//             subject:
//               formData.subject ||
//               "New MMICS Website Enquiry",

//             from_name: formData.name,

//             name: formData.name,

//             email: formData.email,

//             phone: formData.phone,

//             company: formData.company,

//             requirement: formData.subject,

//             message: formData.message,

//             botcheck: "",

//             redirect: "false",
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message ||
//             "Unable to send your enquiry."
//         );
//       }

//       setSuccess(
//         "Thank you! Your enquiry has been sent successfully."
//       );

//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         company: "",
//         subject: "",
//         message: "",
//       });
//     } catch (err) {
//       console.error(
//         "Contact form error:",
//         err
//       );

//       setError(
//         err.message ||
//           "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="mmics-contact-page">

//       {/* =====================================================
//           HERO
//       ===================================================== */}

//       <section className="mmics-contact-hero">

//         <div className="mmics-contact-hero-image">

//           <img
//             src="/images/contact-hero.jpg"
//             alt="MMICS industrial facility"
//           />

//           <div className="mmics-contact-hero-overlay" />

//           <div className="mmics-contact-hero-content">

//             <span className="mmics-contact-kicker">
//               GALLERY
//             </span>

//             <h1>
//               A Look Inside MMICS
//             </h1>

//             <p>
//               Explore our products, people,
//               facilities and moments that
//               shape our journey.
//             </p>

//             <a
//               href="/gallery"
//               className="mmics-contact-gallery-btn"
//             >
//               Explore Gallery

//               <ArrowRight size={13} />
//             </a>

//           </div>

//         </div>

//       </section>


//       {/* =====================================================
//           CONTACT CARDS
//       ===================================================== */}

//       <section className="mmics-contact-info">

//         <div className="mmics-contact-info-grid">

//           <div className="mmics-contact-info-card">

//             <div className="mmics-contact-icon">
//               <MapPin />
//             </div>

//             <h3>
//               Visit Us
//             </h3>

//             <p>
//               Manar Manufacturing
//               <br />
//               Industrial Cooperative
//             </p>

//           </div>


//           <div className="mmics-contact-info-card">

//             <div className="mmics-contact-icon">
//               <Phone />
//             </div>

//             <h3>
//               Contact
//             </h3>

//             <p>
//               +91 96402 77746
//               <br />
//               +91 95425 45709
//             </p>

//           </div>


//           <div className="mmics-contact-info-card">

//             <div className="mmics-contact-icon">
//               <Mail />
//             </div>

//             <h3>
//               Email
//             </h3>

//             <p>
//               mmicslimited@gmail.com
//             </p>

//           </div>


//           <div className="mmics-contact-info-card">

//             <div className="mmics-contact-icon">
//               <MessageSquare />
//             </div>

//             <h3>
//               Enquiries
//             </h3>

//             <p>
//               For product enquiries
//               <br />
//               and business requirements.
//             </p>

//           </div>

//         </div>

//       </section>


//       {/* =====================================================
//           MESSAGE + MAP
//       ===================================================== */}

//       <section className="mmics-contact-form-section">

//         <div className="mmics-contact-form-container">

//           {/* ==================================================
//               LEFT FORM
//           ================================================== */}

//           <div className="mmics-contact-form-wrapper">

//             <div className="mmics-contact-form-heading">

//               <span>
//                 CONTACT MMICS
//               </span>

//               <h2>
//                 Send Us A Message
//               </h2>

//               <p>
//                 Tell us about your requirement
//                 and our team will get in touch
//                 with you.
//               </p>

//             </div>


//             {/* SUCCESS */}

//             {success && (
//               <div className="mmics-contact-alert mmics-contact-success">
//                 <CheckCircle2 />

//                 <span>
//                   {success}
//                 </span>
//               </div>
//             )}


//             {/* ERROR */}

//             {error && (
//               <div className="mmics-contact-alert mmics-contact-error">
//                 <span>
//                   {error}
//                 </span>
//               </div>
//             )}


//             <form
//               className="mmics-contact-form"
//               onSubmit={handleSubmit}
//             >

//               {/* ROW */}

//               <div className="mmics-contact-form-row">

//                 <div className="mmics-contact-field">
//                   <label>
//                     Full Name
//                   </label>

//                   <input
//                     type="text"
//                     name="name"
//                     placeholder="Enter your name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>


//                 <div className="mmics-contact-field">
//                   <label>
//                     Email Address
//                   </label>

//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Enter your email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//               </div>


//               {/* ROW */}

//               <div className="mmics-contact-form-row">

//                 <div className="mmics-contact-field">
//                   <label>
//                     Phone Number
//                   </label>

//                   <input
//                     type="tel"
//                     name="phone"
//                     placeholder="Enter your phone number"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>


//                 <div className="mmics-contact-field">
//                   <label>
//                     Company Name
//                   </label>

//                   <input
//                     type="text"
//                     name="company"
//                     placeholder="Enter your company"
//                     value={formData.company}
//                     onChange={handleChange}
//                   />
//                 </div>

//               </div>


//               {/* SUBJECT */}

//               <div className="mmics-contact-field">

//                 <label>
//                   Subject / Requirement
//                 </label>

//                 <input
//                   type="text"
//                   name="subject"
//                   placeholder="Tell us your requirement"
//                   value={formData.subject}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>


//               {/* MESSAGE */}

//               <div className="mmics-contact-field">

//                 <label>
//                   Message
//                 </label>

//                 <textarea
//                   name="message"
//                   placeholder="Tell us about your requirement..."
//                   value={formData.message}
//                   onChange={handleChange}
//                   rows={5}
//                   required
//                 />

//               </div>


//               {/* HONEYPOT */}

//               <input
//                 type="checkbox"
//                 name="botcheck"
//                 className="mmics-contact-botcheck"
//                 tabIndex="-1"
//                 autoComplete="off"
//               />


//               {/* SUBMIT */}

//               <button
//                 type="submit"
//                 className="mmics-contact-submit"
//                 disabled={loading}
//               >

//                 {loading ? (
//                   <>
//                     <Loader2 className="mmics-contact-spinner" />
//                     Sending...
//                   </>
//                 ) : (
//                   <>
//                     Send Enquiry
//                     <ArrowRight />
//                   </>
//                 )}

//               </button>

//             </form>

//           </div>


//           {/* ==================================================
//               MAP
//           ================================================== */}

//           <div className="mmics-contact-map-wrapper">

//             <iframe
//               title="MMICS Location"
//               src="https://www.google.com/maps?q=Manar+Manufacturing+Industrial+Cooperative&output=embed"
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//             />

//           </div>

//         </div>

//       </section>

//     </main>
//   );
// };

// export default Contact;




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

import api from "../../services/api"; // adjust path as needed
import "./Contact.css";

import contectHero from "../../assets/contactus.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
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

    // Clear field-specific error
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
      errors.phone = "Enter a valid phone number";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      errors.message =
        "Message must be at least 10 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
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
      /*
        POST /api/enquiries
        Body: { name, email, phone, company, subject, message }
      */

      const response = await api.post(
        "/enquiries",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          company: formData.company.trim() || null,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }
      );

      console.log(
        "Enquiry created:",
        response.data
      );

      setSuccess(
        "Thank you! Your enquiry has been sent successfully. Our team will contact you shortly."
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });

      setFieldErrors({});

      // Auto-hide success message
      setTimeout(() => setSuccess(""), 6000);
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

      // Field-level errors from backend (optional)
      if (err?.response?.data?.errors) {
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

          <div className="mmics-contact-info-card">
            <div className="mmics-contact-icon">
              <MapPin />
            </div>
            <h3>Visit Us</h3>
            <p>
              Manar Manufacturing
              <br />
              Industrial Cooperative
            </p>
          </div>

          <div className="mmics-contact-info-card">
            <div className="mmics-contact-icon">
              <Phone />
            </div>
            <h3>Contact</h3>
            <p>
              +91 96402 77746
              <br />
              +91 95425 45709
            </p>
          </div>

          <div className="mmics-contact-info-card">
            <div className="mmics-contact-icon">
              <Mail />
            </div>
            <h3>Email</h3>
            <p>mmicslimited@gmail.com</p>
          </div>

          <div className="mmics-contact-info-card">
            <div className="mmics-contact-icon">
              <MessageSquare />
            </div>
            <h3>Enquiries</h3>
            <p>
              For product enquiries
              <br />
              and business requirements.
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
              <span>CONTACT MMICS</span>
              <h2>Send Us A Message</h2>
              <p>
                Tell us about your requirement
                and our team will get in touch
                with you.
              </p>
            </div>


            {/* SUCCESS ALERT */}

            {success && (
              <div className="mmics-contact-alert mmics-contact-success">
                <CheckCircle2 />
                <span>{success}</span>
              </div>
            )}


            {/* ERROR ALERT */}

            {error && (
              <div className="mmics-contact-alert mmics-contact-error">
                <AlertCircle />
                <span>{error}</span>
              </div>
            )}


            <form
              className="mmics-contact-form"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* ROW 1 — NAME + EMAIL */}

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
                  />
                  {fieldErrors.email && (
                    <small className="mmics-contact-field-error">
                      {fieldErrors.email}
                    </small>
                  )}
                </div>

              </div>


              {/* ROW 2 — PHONE + COMPANY */}

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
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Enquiry</span>
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