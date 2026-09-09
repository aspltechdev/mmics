import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const Login = () => {
  // Put the EXISTING user's email here
  const [email, setEmail] = useState("admin@mmics.com");

  // Leave blank unless you know the existing password
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(user.role)) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      // Invalid/unsupported role
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email.trim(), password);

      if (!result.success) {
        setError(result.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Only show redirecting when authentication is actually valid
  if (isAuthenticated && user) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div
            className="login-card"
            style={{ textAlign: "center" }}
          >
            <div
              className="spinner"
              style={{ margin: "0 auto" }}
            ></div>

            <p
              style={{
                marginTop: "16px",
                color: "#718096",
              }}
            >
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">

          {/* Logo */}
          <div className="login-logo">
            <div className="logo-icon">M</div>
          </div>

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Sign in to your MMICS account
          </p>

          {/* Error */}
          {error && (
            <div className="login-error">
              <span className="error-icon">✕</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  📧
                </span>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <span className="spinner-small"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

          </form>

          <div className="login-footer">
            <p>
              Secure portal for administrators
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;