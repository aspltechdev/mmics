import { Link, NavLink } from "react-router-dom";
import { Menu, X, UserRound } from "lucide-react";
import { useState } from "react";

import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="mmics-navbar">
      <div className="mmics-navbar-container">

        {/* LOGO */}
        <Link
          to="/"
          className="mmics-navbar-logo"
          onClick={closeMenu}
        >
          <div className="mmics-logo-mark">
            M
          </div>

          <div className="mmics-logo-content">
            <span className="mmics-logo-name">
              MMICS
            </span>

            <span className="mmics-logo-tagline">
              Integrated Digital Portal
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="mmics-desktop-nav">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/about">
            About
          </NavLink>

          <NavLink to="/organization">
            Organization
          </NavLink>

          <NavLink to="/members">
            Members
          </NavLink>

          <NavLink to="/products">
            Products
          </NavLink>

          <NavLink to="/gallery">
            Gallery
          </NavLink>

          <NavLink to="/contact">
            Contact
          </NavLink>
        </nav>

        {/* MEMBER LOGIN */}
        <Link
          to="/member-login"
          className="mmics-member-login"
        >
          <UserRound size={16} />
          <span>Member Login</span>
        </Link>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          className="mmics-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={23} />
          ) : (
            <Menu size={23} />
          )}
        </button>
      </div>

      {/* MOBILE NAV */}
      <div
        className={`mmics-mobile-nav ${
          menuOpen ? "mmics-mobile-nav-open" : ""
        }`}
      >
        <NavLink
          to="/"
          end
          onClick={closeMenu}
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          onClick={closeMenu}
        >
          About
        </NavLink>

        <NavLink
          to="/organization"
          onClick={closeMenu}
        >
          Organization
        </NavLink>

        <NavLink
          to="/members"
          onClick={closeMenu}
        >
          Members
        </NavLink>

        <NavLink
          to="/products"
          onClick={closeMenu}
        >
          Products
        </NavLink>

        <NavLink
          to="/gallery"
          onClick={closeMenu}
        >
          Gallery
        </NavLink>

        <NavLink
          to="/contact"
          onClick={closeMenu}
        >
          Contact
        </NavLink>

        <Link
          to="/member-login"
          className="mmics-mobile-login"
          onClick={closeMenu}
        >
          <UserRound size={16} />
          Member Login
        </Link>
      </div>
    </header>
  );
};

export default Navbar;