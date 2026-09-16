import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./MemberLogin.css";

const MemberLogin = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login(
        form.email.trim(),
        form.password
      );

      const loggedInUser = response?.user;

      if (loggedInUser?.role === "ADMIN") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/member", {
          replace: true,
        });
      }
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err?.response?.data?.message ||
        "Invalid email or password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mmics-login-page">

      {/* =================================================
          LEFT VISUAL PANEL
      ================================================= */}

      <section className="mmics-login-visual">

        <div className="mmics-login-visual-overlay" />

        <div className="mmics-login-visual-content">

          <Link
            to="/"
            className="mmics-login-brand"
          >
            <div className="mmics-login-brand-mark">
              M
            </div>

            <div>
              <strong>MMICS</strong>

              <span>
                Integrated Digital Portal
              </span>
            </div>
          </Link>

          <div className="mmics-login-message">

            <span className="mmics-login-eyebrow">
              MEMBER PORTAL
            </span>

            <h1>
              Your connection
              <br />
              to MMICS.
            </h1>

            <p>
              Access your member profile,
              stay connected with the
              organization and explore
              opportunities through the
              MMICS digital portal.
            </p>

          </div>

          <div className="mmics-login-trust">

            <ShieldCheck size={18} />

            <span>
              Secure member access
            </span>

          </div>

        </div>

      </section>

      {/* =================================================
          LOGIN PANEL
      ================================================= */}

      <section className="mmics-login-form-panel">

        <div className="mmics-login-form-wrapper">

          <Link
            to="/"
            className="mmics-login-mobile-brand"
          >
            <div className="mmics-login-brand-mark">
              M
            </div>

            <strong>MMICS</strong>
          </Link>

          <div className="mmics-login-heading">

            <span>
              WELCOME BACK
            </span>

            <h2>
              Member Login
            </h2>

            <p>
              Sign in to access your
              MMICS account.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mmics-login-error">
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}

          <form
            className="mmics-login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="mmics-login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="mmics-login-input-wrapper">

                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="mmics-login-field">

              <label htmlFor="password">
                Password
              </label>

              <div className="mmics-login-input-wrapper">

                <LockKeyhole size={18} />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="mmics-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="mmics-login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mmics-login-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          <div className="mmics-login-footer">

            <Link to="/">
              Back to website
            </Link>

            <span>
              MMICS Integrated Digital Portal
            </span>

          </div>

        </div>

      </section>

    </div>
  );
};

export default MemberLogin;