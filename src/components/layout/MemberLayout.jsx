import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SmartImage from '../common/SmartImage';

/**
 * Shell for the member portal.
 *
 * Note: the previous version was written with Tailwind class
 * names, but this project has no Tailwind build step, so none
 * of them applied and the portal rendered unstyled. This uses
 * real classes defined in styles/member.css.
 */
const MemberLayout = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const navItems = [
    { to: '/member/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/member/profile', label: 'My Profile', icon: '👤' },
  ];

  return (
    <div className="member-shell">
      <header className="member-nav">
        <div className="member-nav-inner">
          <Link to="/member/dashboard" className="member-brand">
            <span className="member-brand-mark">M</span>
            <span className="member-brand-text">
              <strong>MMMICS</strong>
              <small>Member Portal</small>
            </span>
          </Link>

          <nav className={`member-nav-links ${menuOpen ? 'is-open' : ''}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMenuOpen(false)}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="member-nav-user">
            <SmartImage
              src={user?.profileImage}
              variant="avatar"
              alt={user?.name || 'Member'}
              width={72}
              height={72}
              className="member-nav-avatar"
            />

            <div className="member-nav-identity">
              <span className="name">{user?.name || 'Member'}</span>
              <span className="number">{user?.membershipNumber || ''}</span>
            </div>

            <button type="button" onClick={handleLogout} className="member-logout">
              Log out
            </button>

            <button
              type="button"
              className="member-menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <main className="member-main">
        <Outlet />
      </main>

      <footer className="member-footer">
        <p>© {new Date().getFullYear()} MMMICS Limited. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MemberLayout;
