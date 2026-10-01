import React from "react";

import amulLogo from "../../assets/amul.png";
import aavinLogo from "../../assets/aavin.png";

import "./Partners.css";


const partners = [
  {
    id: 1,
    name: "Amul",
    logo: amulLogo,
  },
  {
    id: 2,
    name: "Aavin",
    logo: aavinLogo,
  },
];


/* ============================================================
   REPEAT PARTNERS FOR CONTINUOUS MARQUEE
============================================================ */

const marqueePartners = [
  ...partners,
  ...partners,
  ...partners,
  ...partners,
];


const Partners = () => {
  return (
    <main className="partners-page">

      <section className="partners-section">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="partners-header">

          <span className="partners-label">
            Brands We Work With
          </span>

          <h1 className="partners-title">
            Our Trusted Partners
          </h1>

          <p className="partners-description">
            Building meaningful partnerships
            with recognized brands across
            industries.
          </p>

        </div>


        {/* ===================================================
            PARTNER LOGO MARQUEE
        =================================================== */}

        <div className="partners-marquee-wrapper">

          <div className="partners-marquee">

            {marqueePartners.map(
              (partner, index) => (
                <div
                  className="partner-card"
                  key={`${partner.id}-${index}`}
                >

                  <div className="partner-logo-box">

                    <img
                      src={partner.logo}
                      alt={`${partner.name} partner logo`}
                      loading="lazy"
                    />

                  </div>

                </div>
              )
            )}

          </div>

        </div>

      </section>

    </main>
  );
};


export default Partners;