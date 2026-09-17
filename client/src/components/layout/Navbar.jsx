// client/src/components/layout/Navbar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faFacebookF,
  faYoutube,
  faWhatsapp,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';

import logo from '../../assets/mmics-logo.png';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="navbar-wrapper">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span>
            <Mail size={16} />
            mmmicslimited@gmail.com
          </span>

          <span>
            <Phone size={16} />
            +91 98402 77476
          </span>
        </div>

        <div className="top-bar-right">
          <a href="#" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </a>

          <a href="#" aria-label="Facebook">
            <FontAwesomeIcon icon={faFacebookF} />
          </a>

          <a href="#" aria-label="YouTube">
            <FontAwesomeIcon icon={faYoutube} />
          </a>

          <a href="#" aria-label="WhatsApp">
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>

          <a href="#" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-nav">
        {/* Logo contains the organization name, so no separate text is added */}
        <Link to="/" className="nav-logo">
          <img
            src={logo}
            alt="MMMICS Logo"
          />
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={location.pathname === '/about' ? 'active' : ''}
          >
            About Us
          </Link>

          <Link
            to="/products"
            className={
              location.pathname.startsWith('/products') ? 'active' : ''
            }
          >
            Product
          </Link>

          <Link
            to="/members"
            className={
              location.pathname === '/members' ? 'active' : ''
            }
          >
            Membership
          </Link>

          <Link
            to="/gallery"
            className={location.pathname === '/gallery' ? 'active' : ''}
          >
            Gallery
          </Link>
        </div>

        <Link to="/contact" className="nav-cta">
          Contact Us
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;