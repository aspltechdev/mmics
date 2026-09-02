import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcDiscover,
  FaCcAmex,
  FaCcJcb,
} from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";

import logo from "../../assets/mmics-logo.png"; // update path to match your project
import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-container">
          {/* BRAND / ADDRESS */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="MMICS logo" />
              <span>
                Manarang Manufacturing Multistate
                <br />
                Industrial Cooperative Society Limited
              </span>
            </Link>

            <p className="footer-address">
              #211, Sri Ganapathi Nagar Colony, Sattamangalam,
              <br />
              Maraimalai Nagar, Chengalpattu, Tamil Nadu – 603 209, India.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/products">Product</Link>
              </li>
              <li>
                <Link to="/board-of-directors">Board of Directors</Link>
              </li>
              <li>
                <Link to="/gallery">Gallery</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* PRODUCTS */}
          <div className="footer-column">
            <h3>Our Products</h3>
            <ul>
              <li>Eco Friendly Bags</li>
              <li>Bopp Tapes</li>
              <li>Corrugated box</li>
              <li>IMPL Containers</li>
              <li>Jute Files</li>
              <li>Mano Carton</li>
              <li>Milk Pouch</li>
              <li>Paper Cups</li>
              <li>Paper Shopping Bags</li>
              <li>Plastic Crates</li>
              <li>PP Woven Sacks</li>
              <li>Wooden Pallets</li>
            </ul>
          </div>

          {/* CONTACT / NEED HELP */}
          <div className="footer-column footer-contact">
            <h3>Need Help?</h3>

            <div className="footer-phones">
              <a href="tel:+919840277476">+91 98402 77476</a>
              <a href="tel:+919443554370">+91 94435 54370</a>
              <a href="tel:+918870666471">+91 88706 66471</a>
            </div>

            <a href="mailto:mmmicslimited@gmail.com" className="footer-email">
              mmmicslimited@gmail.com
            </a>

            <div className="footer-socials">
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="X (Twitter)">
                <FaXTwitter />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="#" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>© {new Date().getFullYear()} MMMICS Limited. All rights reserved.</p>

          <div className="footer-payments" aria-label="Accepted payment methods">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
            <FaCcDiscover />
            <FaCcAmex />
            <FaCcJcb />
          </div>
        </div>
      </div>

      <button
        type="button"
        className="footer-back-top"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;