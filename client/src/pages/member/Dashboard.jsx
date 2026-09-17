import React, { useEffect, useState } from "react";
import {
  User,
  CreditCard,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  BriefcaseBusiness,
  ArrowRight,
  Pencil,
  CalendarDays,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./MemberDashboard.css";

const MemberDashboard = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMemberProfile();
  }, []);

  const fetchMemberProfile = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Expected backend:
       * GET /api/members/me
       *
       * If your current backend uses another member-profile
       * endpoint, change only this URL.
       */
      const response = await api.get("/members/me");

      const data =
        response?.data?.member ||
        response?.data?.data ||
        response?.data;

      setMember(data);
    } catch (err) {
      console.error("MEMBER DASHBOARD ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load your member profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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

    const serverUrl = apiUrl.replace(/\/api\/?$/, "");

    return `${serverUrl}/${imageUrl.replace(/^\//, "")}`;
  };

  if (loading) {
    return (
      <div className="mmics-member-dashboard-state">
        <Loader2 className="mmics-member-dashboard-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mmics-member-dashboard-state">
        <div className="mmics-member-dashboard-error-icon">
          <User size={22} />
        </div>

        <h3>Unable to load dashboard</h3>

        <p>{error}</p>

        <button
          type="button"
          onClick={fetchMemberProfile}
          className="mmics-member-dashboard-retry"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="mmics-member-dashboard-state">
        <User size={30} />
        <p>Member profile not found.</p>
      </div>
    );
  }

  const profileFields = [
    member.name,
    member.phone,
    member.email,
    member.address,
    member.designation,
    member.profileImage,
  ];

  const completedFields = profileFields.filter(Boolean).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  const isActive =
    String(member.status || "").toUpperCase() === "ACTIVE";

  return (
    <div className="mmics-member-dashboard">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <section className="mmics-member-dashboard-header">
        <div>
          <span className="mmics-member-dashboard-eyebrow">
            MEMBER PORTAL
          </span>

          <h1>
            Welcome back,{" "}
            <strong>{member.name?.split(" ")[0] || "Member"}</strong>
          </h1>

          <p>
            Manage your membership profile and keep your
            information up to date.
          </p>
        </div>

        <Link
          to="/member/profile"
          className="mmics-member-dashboard-edit-button"
        >
          <Pencil size={14} />
          Edit Profile
        </Link>
      </section>

      {/* =====================================================
          PROFILE HERO
          ===================================================== */}

      <section className="mmics-member-dashboard-profile-card">
        <div className="mmics-member-dashboard-profile-left">
          <div className="mmics-member-dashboard-avatar">
            {member.profileImage ? (
              <img
                src={getImageUrl(member.profileImage)}
                alt={member.name || "Member"}
              />
            ) : (
              <span>{getInitials(member.name)}</span>
            )}
          </div>

          <div className="mmics-member-dashboard-profile-info">
            <span>MMICS MEMBER</span>

            <h2>{member.name}</h2>

            {member.designation && (
              <p>{member.designation}</p>
            )}

            <div className="mmics-member-dashboard-member-id">
              <CreditCard size={13} />

              <span>
                Membership No:
              </span>

              <strong>
                {member.membershipNumber || "—"}
              </strong>
            </div>
          </div>
        </div>

        <div
          className={`mmics-member-dashboard-status ${
            isActive ? "active" : "inactive"
          }`}
        >
          <span className="mmics-member-dashboard-status-dot" />

          {member.status || "UNKNOWN"}
        </div>
      </section>

      {/* =====================================================
          STATS
          ===================================================== */}

      <section className="mmics-member-dashboard-stats">
        <div className="mmics-member-dashboard-stat-card">
          <div className="mmics-member-dashboard-stat-icon blue">
            <CreditCard size={18} />
          </div>

          <div>
            <span>Membership Number</span>
            <strong>
              {member.membershipNumber || "—"}
            </strong>
          </div>
        </div>

        <div className="mmics-member-dashboard-stat-card">
          <div className="mmics-member-dashboard-stat-icon orange">
            <ShieldCheck size={18} />
          </div>

          <div>
            <span>Membership Status</span>
            <strong>
              {member.status || "—"}
            </strong>
          </div>
        </div>

        <div className="mmics-member-dashboard-stat-card">
          <div className="mmics-member-dashboard-stat-icon green">
            <CalendarDays size={18} />
          </div>

          <div>
            <span>Member Since</span>
            <strong>
              {formatDate(member.createdAt)}
            </strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN GRID
          ===================================================== */}

      <section className="mmics-member-dashboard-grid">
        {/* =================================================
            PERSONAL INFORMATION
            ================================================= */}

        <div className="mmics-member-dashboard-panel">
          <div className="mmics-member-dashboard-panel-header">
            <div>
              <span>PROFILE</span>
              <h3>Personal Information</h3>
            </div>

            <Link to="/member/profile">
              <Pencil size={15} />
            </Link>
          </div>

          <div className="mmics-member-dashboard-details">
            <div className="mmics-member-dashboard-detail">
              <div className="detail-icon">
                <User size={15} />
              </div>

              <div>
                <span>Full Name</span>
                <strong>{member.name || "—"}</strong>
              </div>
            </div>

            <div className="mmics-member-dashboard-detail">
              <div className="detail-icon">
                <Phone size={15} />
              </div>

              <div>
                <span>Phone Number</span>
                <strong>{member.phone || "—"}</strong>
              </div>
            </div>

            <div className="mmics-member-dashboard-detail">
              <div className="detail-icon">
                <Mail size={15} />
              </div>

              <div>
                <span>Email Address</span>
                <strong>{member.email || "—"}</strong>
              </div>
            </div>

            <div className="mmics-member-dashboard-detail">
              <div className="detail-icon">
                <BriefcaseBusiness size={15} />
              </div>

              <div>
                <span>Designation</span>
                <strong>
                  {member.designation || "Not added"}
                </strong>
              </div>
            </div>

            <div className="mmics-member-dashboard-detail full">
              <div className="detail-icon">
                <MapPin size={15} />
              </div>

              <div>
                <span>Address</span>
                <strong>
                  {member.address || "Address not added"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            PROFILE COMPLETION
            ================================================= */}

        <div className="mmics-member-dashboard-panel mmics-member-dashboard-completion">
          <div className="mmics-member-dashboard-panel-header">
            <div>
              <span>PROFILE STATUS</span>
              <h3>Profile Completion</h3>
            </div>

            <div className="mmics-member-dashboard-completion-percent">
              {profileCompletion}%
            </div>
          </div>

          <div className="mmics-member-dashboard-progress">
            <span
              style={{
                width: `${profileCompletion}%`,
              }}
            />
          </div>

          <div className="mmics-member-dashboard-completion-content">
            {profileCompletion >= 100 ? (
              <>
                <div className="completion-check">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <strong>Your profile is complete</strong>

                  <p>
                    All available member information has
                    been added to your profile.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="completion-check">
                  <Pencil size={17} />
                </div>

                <div>
                  <strong>
                    Complete your profile
                  </strong>

                  <p>
                    Add the missing information to keep
                    your membership details updated.
                  </p>

                  <Link to="/member/profile">
                    Update Profile
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK ACTIONS
          ===================================================== */}

      <section className="mmics-member-dashboard-quick-section">
        <div className="mmics-member-dashboard-section-heading">
          <div>
            <span>QUICK ACCESS</span>
            <h3>Manage Your Membership</h3>
          </div>
        </div>

        <div className="mmics-member-dashboard-actions">
          <Link
            to="/member/profile"
            className="mmics-member-dashboard-action"
          >
            <div className="action-icon blue">
              <User size={18} />
            </div>

            <div>
              <strong>My Profile</strong>
              <span>View and update your details</span>
            </div>

            <ArrowRight size={15} />
          </Link>

          <Link
            to="/"
            className="mmics-member-dashboard-action"
          >
            <div className="action-icon orange">
              <BriefcaseBusiness size={18} />
            </div>

            <div>
              <strong>MMICS Website</strong>
              <span>Explore the public website</span>
            </div>

            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MemberDashboard;