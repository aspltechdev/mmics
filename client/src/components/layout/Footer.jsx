// client/src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/mmics-logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col brand">
          <div className="footer-brand-header">
            <img src={logo} alt="MMMICS Logo" />
          </div>
          <p className="footer-desc">
            Delivering reliable packaging and industrial solutions for businesses and organizations.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Products</h4>
          <ul>
            <li><Link to="/products">Eco Friendly Bags</Link></li>
            <li><Link to="/products">Bopp Tapes</Link></li>
            <li><Link to="/products">Corrugated box</Link></li>
            <li><Link to="/products">IMPL Containers</Link></li>
            <li><Link to="/products">Jute Files</Link></li>
            <li><Link to="/products">Mano Carton</Link></li>
            <li><Link to="/products">Milk Pouch</Link></li>
            <li><Link to="/products">Paper Cups</Link></li>
            <li><Link to="/products">Paper Shopping Bags</Link></li>
            <li><Link to="/products">Plastic Crates</Link></li>
            <li><Link to="/products">PP Woven Sacks</Link></li>
            <li><Link to="/products">Wooden Pallets</Link></li>
          </ul>
        </div>

        <div className="footer-col footer-contact">
          <h4>Contact</h4>
          <p>#211, Sri Ganapathi Nagar Colony,<br />
            Salarapattinam, Maramalai Nagar, Chengapattu,<br />
            Tamil Nadu - 603 209, India.</p>
          <p>Phone: +91 98402 77476<br />
            +91 94435 54370<br />
            +91 88706 66471</p>
          <p>Email: mmmicslimited@gmail.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2026 MMMICS Limited. All Rights Reserved.</div>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;