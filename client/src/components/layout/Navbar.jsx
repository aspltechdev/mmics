// client/src/components/common/Navbar.jsx

import React, {
  useEffect,
  useRef,
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

  const navbarRef = useRef(null);

  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);

  const [
    navbarHeight,
    setNavbarHeight,
  ] = useState(0);


  /* =========================================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);


  /* =========================================================
     GET NAVBAR HEIGHT

     Because navbar is fixed, we create a spacer with exactly
     the same height so page content never hides behind header.
  ========================================================= */

  useEffect(() => {
    if (!navbarRef.current) {
      return;
    }

    const updateHeight = () => {
      if (!navbarRef.current) {
        return;
      }

      const height =
        navbarRef.current.offsetHeight;

      setNavbarHeight(height);
    };


    updateHeight();


    const resizeObserver =
      new ResizeObserver(() => {
        updateHeight();
      });


    resizeObserver.observe(
      navbarRef.current
    );


    window.addEventListener(
      "resize",
      updateHeight
    );


    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        updateHeight
      );
    };
  }, []);


  /* =========================================================
     PREVENT PAGE SCROLL WHEN MOBILE MENU IS OPEN
  ========================================================= */

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }


    return () => {
      document.body.style.overflow =
        "";
    };
  }, [isMenuOpen]);


  /* =========================================================
     ACTIVE LINK
  ========================================================= */

  const isActive = (path) => {
    if (path === "/") {
      return (
        location.pathname === "/"
      );
    }

    return location.pathname.startsWith(
      path
    );
  };


  /* =========================================================
     CLOSE MENU
  ========================================================= */

  const closeMenu = () => {
    setIsMenuOpen(false);
  };


  return (
    <>

      {/* =====================================================
          FIXED HEADER
      ===================================================== */}

      <header
        ref={navbarRef}
        className="navbar-wrapper"
      >

        {/* ===================================================
            TOP BAR
        =================================================== */}

        <div className="top-bar">

          <div className="top-bar-left">

            <a
              href="mailto:mmmicslimited@gmail.com"
              className="top-contact-link"
            >
              <Mail />

              <span>
                mmmicslimited@gmail.com
              </span>
            </a>


            <a
              href="tel:+919840277476"
              className="top-contact-link"
            >
              <Phone />

              <span>
                +91 98402 77476
              </span>
            </a>

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


        {/* ===================================================
            MAIN NAVBAR
        =================================================== */}

        <nav className="main-nav">

          {/* LOGO */}

          <Link
            to="/"
            className="nav-logo"
            onClick={closeMenu}
            aria-label="MMMICS Home"
          >
            <img
              src={logo}
              alt="MMMICS Logo"
            />
          </Link>


          {/* =================================================
              DESKTOP / TABLET LINKS
          ================================================= */}

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


          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

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


        {/* ===================================================
            MOBILE NAVIGATION
        =================================================== */}

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
              className={`mobile-nav-contact ${
                isActive("/contact")
                  ? "active"
                  : ""
              }`}
            >
              Contact Us
            </Link>

          </div>

        </div>

      </header>


      {/* =====================================================
          HEADER SPACER

          Prevents hero/page from moving behind fixed navbar.
      ===================================================== */}

      <div
        className="navbar-spacer"
        style={{
          height: `${navbarHeight}px`,
        }}
        aria-hidden="true"
      />

    </>
  );
};


export default Navbar;