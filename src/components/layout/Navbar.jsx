import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="website-navbar">

      <div className="navbar-container">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="navbar-logo"
        >

          <div className="navbar-logo-symbol">
            <span>M</span>
          </div>

          <div className="navbar-logo-name">

            <strong>
              MANARANG
            </strong>

            <span>
              MANUFACTURING MULTISTATE
            </span>

            <small>
              INDUSTRIAL COOPERATIVE SOCIETY LIMITED
            </small>

          </div>

        </Link>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="navbar-menu">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            HOME
          </NavLink>


          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            ABOUT
          </NavLink>


          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            PRODUCTS
          </NavLink>


          <NavLink
            to="/board-of-directors"
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            BOARD OF DIRECTORS
          </NavLink>


          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            GALLERY
          </NavLink>


          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            CONTACT
          </NavLink>

        </nav>


        {/* =================================================
            GET IN TOUCH
        ================================================= */}

        <Link
          to="/contact"
          className="navbar-contact"
        >

          <span className="navbar-contact-text">
            GET IN TOUCH
          </span>

          <span className="navbar-contact-arrow">
            ↗
          </span>

        </Link>

      </div>

    </header>
  );
};

export default Navbar;