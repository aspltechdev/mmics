import React, { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  CreditCard,
  Camera,
  LockKeyhole,
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import memberService from "../../services/memberService";
import "./Profile.css";

const Profile = () => {
  const fileInputRef = useRef(null);

  const [member, setMember] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  /* =====================================================
     GET SERVER IMAGE URL
  ===================================================== */

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    const apiUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    const serverUrl = apiUrl.replace(
      /\/api\/?$/,
      ""
    );

    return `${serverUrl}/${imageUrl.replace(
      /^\//,
      ""
    )}`;
  };

  /* =====================================================
     INITIALS
  ===================================================== */

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) =>
        word.charAt(0).toUpperCase()
      )
      .join("");
  };

  /* =====================================================
     FETCH PROFILE
  ===================================================== */

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await memberService.getMe();

      const data =
        response?.member ||
        response?.data?.member ||
        response?.data ||
        null;

      if (!data) {
        throw new Error(
          "Member profile not found."
        );
      }

      setMember(data);

      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        designation:
          data.designation || "",
        password: "",
        confirmPassword: "",
      });

      if (data.profileImage) {
        setPreviewImage(
          getImageUrl(
            data.profileImage
          )
        );
      }
    } catch (err) {
      console.error(
        "PROFILE LOAD ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =====================================================
     PROFILE IMAGE
  ===================================================== */

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WebP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile photo must be less than 5MB."
      );

      event.target.value = "";
      return;
    }

    setProfileImage(file);

    const localPreview =
      URL.createObjectURL(file);

    setPreviewImage(localPreview);

    setError("");
    setSuccess("");
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required.");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return false;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return false;
    }

    if (
      formData.password &&
      formData.password.length < 6
    ) {
      setError(
        "New password must contain at least 6 characters."
      );

      return false;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Password and confirm password do not match."
      );

      return false;
    }

    return true;
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = new FormData();

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "email",
        formData.email.trim()
      );

      data.append(
        "phone",
        formData.phone.trim()
      );

      data.append(
        "address",
        formData.address.trim()
      );

      data.append(
        "designation",
        formData.designation.trim()
      );

      /*
       * Only send password if user entered one.
       */

      if (
        formData.password.trim()
      ) {
        data.append(
          "password",
          formData.password.trim()
        );
      }

      /*
       * IMPORTANT:
       * Your backend currently uses:
       *
       * PUT /api/members/:id
       *
       * and expects:
       *
       * profileImage
       */

      if (profileImage) {
        data.append(
          "profileImage",
          profileImage,
          profileImage.name
        );
      }

      const response =
        await memberService.update(
          member.id,
          data
        );

      const updatedMember =
        response?.member ||
        response?.data?.member ||
        response?.data ||
        null;

      if (updatedMember) {
        setMember(
          updatedMember
        );

        setFormData((previous) => ({
          ...previous,
          password: "",
          confirmPassword: "",
          name:
            updatedMember.name ||
            previous.name,
          email:
            updatedMember.email ||
            previous.email,
          phone:
            updatedMember.phone ||
            previous.phone,
          address:
            updatedMember.address ||
            "",
          designation:
            updatedMember.designation ||
            "",
        }));

        if (
          updatedMember.profileImage
        ) {
          setPreviewImage(
            getImageUrl(
              updatedMember.profileImage
            )
          );
        }
      }

      setProfileImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }

      setSuccess(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "PROFILE UPDATE ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="mmics-member-profile-state">
        <Loader2 className="mmics-member-profile-spinner" />

        <p>
          Loading your profile...
        </p>
      </div>
    );
  }

  /* =====================================================
     ERROR WITHOUT MEMBER
  ===================================================== */

  if (!member) {
    return (
      <div className="mmics-member-profile-state">
        <div className="mmics-member-profile-state-icon">
          <AlertCircle size={22} />
        </div>

        <h3>
          Unable to load profile
        </h3>

        <p>{error}</p>

        <button
          type="button"
          onClick={fetchProfile}
          className="mmics-member-profile-retry"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* =====================================================
     MAIN
  ===================================================== */

  return (
    <div className="mmics-member-profile-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="mmics-member-profile-header">

        <div>
          <Link
            to="/member"
            className="mmics-member-profile-back"
          >
            <ArrowLeft size={13} />

            Back to Dashboard
          </Link>

          <span className="mmics-member-profile-eyebrow">
            MEMBER PORTAL
          </span>

          <h1>
            My <strong>Profile</strong>
          </h1>

          <p>
            View and update your MMICS
            membership information.
          </p>
        </div>

      </div>

      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (
        <div className="mmics-member-profile-alert error">
          <AlertCircle size={15} />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mmics-member-profile-alert success">
          <CheckCircle2 size={15} />

          <span>{success}</span>
        </div>
      )}

      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <form
        className="mmics-member-profile-layout"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            LEFT PROFILE CARD
        ================================================= */}

        <aside className="mmics-member-profile-sidebar">

          <div className="mmics-member-profile-photo-wrapper">

            <div className="mmics-member-profile-photo">

              {previewImage ? (
                <img
                  src={previewImage}
                  alt={
                    member.name ||
                    "Member"
                  }
                />
              ) : (
                <span>
                  {getInitials(
                    member.name
                  )}
                </span>
              )}

            </div>

            <button
              type="button"
              className="mmics-member-profile-camera"
              onClick={
                handleImageClick
              }
              aria-label="Change profile photo"
            >
              <Camera size={14} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={
                handleImageChange
              }
              hidden
            />

          </div>

          <h2>
            {member.name}
          </h2>

          {member.designation && (
            <p className="mmics-member-profile-designation">
              {member.designation}
            </p>
          )}

          <div
            className={`mmics-member-profile-status ${
              String(
                member.status
              ).toUpperCase() ===
              "ACTIVE"
                ? "active"
                : "inactive"
            }`}
          >
            <span />

            {member.status ||
              "UNKNOWN"}
          </div>

          <div className="mmics-member-profile-membership">

            <span>
              MEMBERSHIP NUMBER
            </span>

            <strong>
              {member.membershipNumber ||
                "—"}
            </strong>

          </div>

          <div className="mmics-member-profile-photo-note">
            <Camera size={12} />

            <span>
              JPG, PNG or WebP
              <br />
              Maximum 5MB
            </span>
          </div>

        </aside>

        {/* =================================================
            RIGHT FORM
        ================================================= */}

        <main className="mmics-member-profile-content">

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="mmics-member-profile-section">

            <div className="mmics-member-profile-section-heading">

              <div>
                <span>
                  PERSONAL DETAILS
                </span>

                <h3>
                  Basic Information
                </h3>
              </div>

            </div>

            <div className="mmics-member-profile-form-grid">

              {/* NAME */}

              <div className="mmics-member-profile-field">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="mmics-member-profile-input">

                  <User size={15} />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="mmics-member-profile-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <div className="mmics-member-profile-input">

                  <Mail size={15} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your email"
                  />

                </div>

              </div>

              {/* PHONE */}

              <div className="mmics-member-profile-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <div className="mmics-member-profile-input">

                  <Phone size={15} />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your phone number"
                  />

                </div>

              </div>

              {/* DESIGNATION */}

              <div className="mmics-member-profile-field">

                <label htmlFor="designation">
                  Designation
                </label>

                <div className="mmics-member-profile-input">

                  <BriefcaseBusiness
                    size={15}
                  />

                  <input
                    id="designation"
                    name="designation"
                    type="text"
                    value={
                      formData.designation
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your designation"
                  />

                </div>

              </div>

              {/* MEMBERSHIP NUMBER */}

              <div className="mmics-member-profile-field">

                <label>
                  Membership Number
                </label>

                <div className="mmics-member-profile-input readonly">

                  <CreditCard
                    size={15}
                  />

                  <input
                    type="text"
                    value={
                      member.membershipNumber ||
                      ""
                    }
                    readOnly
                  />

                  <span className="mmics-member-profile-readonly">
                    READ ONLY
                  </span>

                </div>

              </div>

              {/* STATUS */}

              <div className="mmics-member-profile-field">

                <label>
                  Membership Status
                </label>

                <div className="mmics-member-profile-input readonly">

                  <CheckCircle2
                    size={15}
                  />

                  <input
                    type="text"
                    value={
                      member.status ||
                      ""
                    }
                    readOnly
                  />

                </div>

              </div>

              {/* ADDRESS */}

              <div className="mmics-member-profile-field full">

                <label htmlFor="address">
                  Address
                </label>

                <div className="mmics-member-profile-input textarea">

                  <MapPin size={15} />

                  <textarea
                    id="address"
                    name="address"
                    rows="4"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your address"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <section className="mmics-member-profile-section">

            <div className="mmics-member-profile-section-heading">

              <div>
                <span>
                  SECURITY
                </span>

                <h3>
                  Change Password
                </h3>
              </div>

            </div>

            <p className="mmics-member-profile-security-note">
              Leave these fields empty if
              you do not want to change
              your password.
            </p>

            <div className="mmics-member-profile-form-grid">

              {/* PASSWORD */}

              <div className="mmics-member-profile-field">

                <label htmlFor="password">
                  New Password
                </label>

                <div className="mmics-member-profile-input">

                  <LockKeyhole
                    size={15}
                  />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter new password"
                  />

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="mmics-member-profile-field">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="mmics-member-profile-input">

                  <LockKeyhole
                    size={15}
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={
                      formData.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Confirm new password"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              SAVE
          ================================================= */}

          <div className="mmics-member-profile-actions">

            <Link
              to="/member/dashboard"
              className="mmics-member-profile-cancel"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="mmics-member-profile-save"
              disabled={saving}
            >

              {saving ? (
                <>
                  <Loader2
                    size={15}
                    className="mmics-member-profile-button-spinner"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} />

                  Save Changes
                </>
              )}

            </button>

          </div>

        </main>

      </form>
    </div>
  );
};

export default Profile;