import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("admin@mmmicslimited.com");
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

  if (isAuthenticated && user) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-card" style={{ textAlign: "center" }}>
            <div className="spinner" style={{ margin: "0 auto" }}></div>
            <p style={{ marginTop: "16px", color: "#718096" }}>
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
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#2563EB" />
                <text
                  x="20"
                  y="28"
                  textAnchor="middle"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                  fontFamily="Arial"
                >
                  M
                </text>
              </svg>
            </div>
          </div>

          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to your MMMICS account</p>

          {/* Error Message */}
          {error && (
            <div className="login-error">
              <span className="error-icon">✕</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2.5 5.83333L10 10.8333L17.5 5.83333M2.5 5.83333V14.1667C2.5 14.6087 2.67559 15.0326 2.98816 15.3452C3.30072 15.6577 3.72464 15.8333 4.16667 15.8333H15.8333C16.2754 15.8333 16.6993 15.6577 17.0118 15.3452C17.3244 15.0326 17.5 14.6087 17.5 14.1667V5.83333M2.5 5.83333L4.16667 4.16667H15.8333L17.5 5.83333"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5.83333 8.33333V5.83333C5.83333 3.53217 7.69883 1.66667 10 1.66667C12.3012 1.66667 14.1667 3.53217 14.1667 5.83333V8.33333M10 12.5V14.1667M4.16667 18.3333H15.8333C16.2754 18.3333 16.6993 18.1577 17.0118 17.8452C17.3244 17.5326 17.5 17.1087 17.5 16.6667V10C17.5 9.55797 17.3244 9.13405 17.0118 8.82149C16.6993 8.50893 16.2754 8.33333 15.8333 8.33333H4.16667C3.72464 8.33333 3.30072 8.50893 2.98816 8.82149C2.67559 9.13405 2.5 9.55797 2.5 10V16.6667C2.5 17.1087 2.67559 17.5326 2.98816 17.8452C3.30072 18.1577 3.72464 18.3333 4.16667 18.3333Z"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M2.5 10C2.5 10 5 4.16667 10 4.16667C15 4.16667 17.5 10 17.5 10C17.5 10 15 15.8333 10 15.8333C5 15.8333 2.5 10 2.5 10Z"
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="10"
                        cy="10"
                        r="2.5"
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4.16667 4.16667L15.8333 15.8333M15.8333 4.16667L4.16667 15.8333M17.5 10C17.5 10 15 15.8333 10 15.8333C5 15.8333 2.5 10 2.5 10C2.5 10 5 4.16667 10 4.16667C15 4.16667 17.5 10 17.5 10Z"
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span className="spinner-small"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Secure portal for administrators</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;