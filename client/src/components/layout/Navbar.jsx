import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  Mail,
  Phone,
  Menu,
  X,
} from "lucide-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faInstagram,
  faFacebookF,
  faYoutube,
  faWhatsapp,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

import logo from "../../assets/mmics-logo.png";

import "./Navbar.css";


const Navbar = () => {
  const location = useLocation();

  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);


  /* =========================================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);


  /* =========================================================
     ACTIVE LINK
  ========================================================= */

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(
      path
    );
  };


  /* =========================================================
     CLOSE MOBILE MENU
  ========================================================= */

  const closeMenu = () => {
    setIsMenuOpen(false);
  };


  return (
    <header className="navbar-wrapper">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="top-bar">

        <div className="top-bar-left">

          <span>
            <Mail />

            <span>
              mmmicslimited@gmail.com
            </span>
          </span>


          <span>
            <Phone />

            <span>
              +91 98402 77476
            </span>
          </span>

        </div>


        <div className="top-bar-right">

          <a
            href="#"
            aria-label="Instagram"
          >
            <FontAwesomeIcon
              icon={faInstagram}
            />
          </a>


          <a
            href="#"
            aria-label="Facebook"
          >
            <FontAwesomeIcon
              icon={faFacebookF}
            />
          </a>


          <a
            href="#"
            aria-label="YouTube"
          >
            <FontAwesomeIcon
              icon={faYoutube}
            />
          </a>


          <a
            href="#"
            aria-label="WhatsApp"
          >
            <FontAwesomeIcon
              icon={faWhatsapp}
            />
          </a>


          <a
            href="#"
            aria-label="LinkedIn"
          >
            <FontAwesomeIcon
              icon={faLinkedinIn}
            />
          </a>

        </div>

      </div>


      {/* =====================================================
          MAIN NAVBAR
      ===================================================== */}

      <nav className="main-nav">

        {/* LOGO */}

        <Link
          to="/"
          className="nav-logo"
          onClick={closeMenu}
          aria-label="MMICS Home"
        >
          <img
            src={logo}
            alt="MMICS Logo"
          />
        </Link>


        {/* ===================================================
            DESKTOP + TABLET NAVIGATION
        =================================================== */}

        <div className="nav-links">

          <Link
            to="/"
            className={
              isActive("/")
                ? "active"
                : ""
            }
          >
            Home
          </Link>


          <Link
            to="/about"
            className={
              isActive("/about")
                ? "active"
                : ""
            }
          >
            About Us
          </Link>


          <Link
            to="/products"
            className={
              isActive("/products")
                ? "active"
                : ""
            }
          >
            Product
          </Link>


          <Link
            to="/members"
            className={
              isActive("/members")
                ? "active"
                : ""
            }
          >
            Membership
          </Link>


          <Link
            to="/gallery"
            className={
              isActive("/gallery")
                ? "active"
                : ""
            }
          >
            Gallery
          </Link>

        </div>


        {/* CONTACT BUTTON */}

        <Link
          to="/contact"
          className={`nav-cta ${
            isActive("/contact")
              ? "active"
              : ""
          }`}
        >
          Contact Us
        </Link>


        {/* ===================================================
            MOBILE ONLY HAMBURGER
        =================================================== */}

        <button
          type="button"
          className={`mobile-menu-toggle ${
            isMenuOpen
              ? "open"
              : ""
          }`}
          onClick={() =>
            setIsMenuOpen(
              (previous) =>
                !previous
            )
          }
          aria-label={
            isMenuOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={
            isMenuOpen
          }
        >

          {isMenuOpen ? (
            <X />
          ) : (
            <Menu />
          )}

        </button>

      </nav>


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <div
        className={`mobile-nav ${
          isMenuOpen
            ? "mobile-nav-open"
            : ""
        }`}
      >

        <div className="mobile-nav-links">

          <Link
            to="/"
            onClick={closeMenu}
            className={
              isActive("/")
                ? "active"
                : ""
            }
          >
            Home
          </Link>


          <Link
            to="/about"
            onClick={closeMenu}
            className={
              isActive("/about")
                ? "active"
                : ""
            }
          >
            About Us
          </Link>


          <Link
            to="/products"
            onClick={closeMenu}
            className={
              isActive("/products")
                ? "active"
                : ""
            }
          >
            Product
          </Link>


          <Link
            to="/members"
            onClick={closeMenu}
            className={
              isActive("/members")
                ? "active"
                : ""
            }
          >
            Membership
          </Link>


          <Link
            to="/gallery"
            onClick={closeMenu}
            className={
              isActive("/gallery")
                ? "active"
                : ""
            }
          >
            Gallery
          </Link>


          <Link
            to="/contact"
            onClick={closeMenu}
            className="mobile-nav-contact"
          >
            Contact Us
          </Link>

        </div>

      </div>

    </header>
  );
};


export default Navbar;