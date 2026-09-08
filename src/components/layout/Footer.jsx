import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/products">Products</Link>
          <Link to="/board-of-directors">Board of Directors</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Products */}
        <div className="footer-products">
          <h3>Our Products</h3>
          <Link to="/products">Corrugated Boxes</Link>
          <Link to="/products">Eco Friendly Bags</Link>
          <Link to="/products">Paper Cups</Link>
          <Link to="/products">Jute Files</Link>
          <Link to="/products">Plastic Crates</Link>
          <Link to="/products">PP Woven Sacks</Link>
          <Link to="/products">Wooden Pallets</Link>
          <Link to="/products">Paper Shopping Bags</Link>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h3>Get in Touch</h3>
          <p className="footer-address">
            Kadavanthara,<br />
            Ernakulam, Kerala
          </p>
          <a href="tel:04842654871" className="footer-phone">0484 265 4871</a>
          <a href="mailto:info@mmmicslimited.com" className="footer-email">
            info@mmmicslimited.com
          </a>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <span>© 2024 MMMICS Limited. All rights reserved.</span>
        <span>Packaging • Cooperation • Progress</span>
      </div>
    </footer>
  );
};

export default Footer;