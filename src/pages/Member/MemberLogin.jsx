import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/login.css';

/**
 * =========================================================
 * MEMBER LOGIN
 * =========================================================
 *
 * The proposal's "Member Login": secure login credentials,
 * member authentication, access to a personal dashboard.
 *
 * Separate from the staff login at /login because members
 * live in their own table and hit their own endpoint.
 */
const MemberLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { memberLogin, isAuthenticated, isMember } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && isMember) {
      navigate('/member/dashboard', { replace: true });
    }
  }, [isAuthenticated, isMember, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    setLoading(true);

    const result = await memberLogin(email.trim(), password);

    if (!result.success) {
      setError(result.message || 'Invalid email or password.');
    } else {
      navigate('/member/dashboard', { replace: true });
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#0f766e" />
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

          <h2>Member Portal</h2>
          <p className="login-subtitle">Sign in to view your membership details</p>

          {error && (
            <div className="login-error">
              <span className="error-icon">✕</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="member-email">Email Address</label>
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
                  id="member-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError('');
                  }}
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="member-password">Password</label>
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
                  id="member-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span className="spinner-small" />
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don’t have your login details? Please contact the MMMICS office.
              <br />
              <Link to="/login" className="login-alt-link">
                Staff login →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberLogin;
