import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="mmics-footer">

      <div className="mmics-footer-main">

        <div className="mmics-footer-container">

          {/* BRAND */}
          <div className="mmics-footer-brand">

            <Link
              to="/"
              className="mmics-footer-logo"
            >
              <div className="mmics-footer-logo-mark">
                M
              </div>

              <div>
                <strong>MMICS</strong>

                <span>
                  Integrated Digital Portal
                </span>
              </div>
            </Link>

            <p>
              Connecting members, organizations,
              products and opportunities through
              a unified digital platform.
            </p>

          </div>

          {/* QUICK LINKS */}
          <div className="mmics-footer-column">

            <h3>Quick Links</h3>

            <Link to="/about">
              About
            </Link>

            <Link to="/organization">
              Organization
            </Link>

            <Link to="/members">
              Members
            </Link>

            <Link to="/products">
              Products
            </Link>

            <Link to="/gallery">
              Gallery
            </Link>

          </div>

          {/* INFORMATION */}
          <div className="mmics-footer-column">

            <h3>Information</h3>

            <Link to="/contact">
              Contact Us
            </Link>

            <Link to="/member-login">
              Member Login
            </Link>

          </div>

          {/* CONTACT */}
          <div className="mmics-footer-column mmics-footer-contact">

            <h3>Contact</h3>

            <div>
              <MapPin size={17} />
              <span>
                MMICS Office Address
              </span>
            </div>

            <div>
              <Phone size={17} />
              <span>
                +91 XXXXX XXXXX
              </span>
            </div>

            <div>
              <Mail size={17} />
              <span>
                info@mmics.org
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="mmics-footer-bottom">

        <div className="mmics-footer-container">

          <span>
            © {new Date().getFullYear()} MMICS.
            All rights reserved.
          </span>

          <span className="mmics-footer-credit">
            Integrated Digital Portal
            <ArrowUpRight size={14} />
          </span>

        </div>

      </div>

    </footer>
  );
};

export default Footer;