import React from "react";
import "./BoardOfDirectors.css";

const directors = [
  {
    id: 1,
    name: "A. Mani",
    designation: "CEO",
    image: "/images/directors/amani.jpg",
    socials: {
      facebook: "#",
      x: "#",
      instagram: "#",
    },
  },
  {
    id: 2,
    name: "P. Raghu",
    designation: "Founder",
    image: "/images/directors/praghu.jpg",
    socials: {
      facebook: "#",
      x: "#",
      instagram: "#",
    },
  },
  {
    id: 3,
    name: "ER. A. Lakshminarayanan",
    designation: "Chairperson",
    image: "/images/directors/lakshminarayanan.jpg",
    socials: {
      facebook: "#",
      x: "#",
      instagram: "#",
    },
  },
  {
    id: 4,
    name: "N. Kandane Narayana Swamy",
    designation: "Vice Chairperson",
    image: "/images/directors/kandane-narayanan.jpg",
    socials: {
      facebook: "#",
      x: "#",
      instagram: "#",
    },
  },
];

const FacebookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="director-social-svg"
  >
    <path
      d="M14.5 8H17V4.5c-.4-.1-1.8-.2-3.4-.2-3.3 0-5.6 2-5.6 5.7v3.2H4.5V17h3.5v7h4.3v-7h3.4l.5-3.8h-3.9V10c0-1.1.3-2 2.2-2Z"
      fill="currentColor"
    />
  </svg>
);

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="director-social-svg"
  >
    <path
      d="M5 4h4.1l3.2 4.3L16 4h2.8l-5.2 6 5.5 7.3H15l-3.5-4.7L7.3 17H4.5l5.5-6.4L5 4Zm3.8 1.7H7.7l7.6 9.7h1.1L8.8 5.7Z"
      fill="currentColor"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="director-social-svg"
  >
    <rect
      x="3.5"
      y="3.5"
      width="17"
      height="17"
      rx="4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="17.5" cy="6.8" r="1.2" fill="currentColor" />
  </svg>
);

const BoardOfDirectors = () => {
  return (
    <div className="board-page">
      {/* Page Hero */}
      <section className="board-hero">
        <div className="board-hero-overlay"></div>

        <div className="board-hero-content">
          <span className="board-eyebrow">OUR LEADERSHIP</span>

          <h1>Board of Directors</h1>

          <p>
            Meet the people guiding Manarang Manufacturing Multistate
            Industrial Cooperative Society Limited.
          </p>
        </div>
      </section>

      {/* Directors Section */}
      <section className="directors-section">
        <div className="directors-container">
          <div className="directors-heading">
            <span className="section-eyebrow">LEADERSHIP</span>

            <h2>
              Meet Our
              <span> Directors</span>
            </h2>

            <p>
              Our leadership team brings experience, vision and commitment
              towards building a stronger cooperative organization.
            </p>
          </div>

          <div className="directors-grid">
            {directors.map((director) => (
              <article className="director-card" key={director.id}>
                <div className="director-image-wrapper">
                  <img
                    src={director.image}
                    alt={director.name}
                    className="director-image"
                  />

                  <div className="director-image-overlay"></div>

                  <div className="director-socials">
                    <a
                      href={director.socials.facebook}
                      className="director-social"
                      aria-label={`${director.name} Facebook`}
                    >
                      <FacebookIcon />
                    </a>

                    <a
                      href={director.socials.x}
                      className="director-social"
                      aria-label={`${director.name} X`}
                    >
                      <XIcon />
                    </a>

                    <a
                      href={director.socials.instagram}
                      className="director-social"
                      aria-label={`${director.name} Instagram`}
                    >
                      <InstagramIcon />
                    </a>
                  </div>
                </div>

                <div className="director-info">
                  <h3>{director.name}</h3>
                  <p>{director.designation}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Statement */}
      <section className="leadership-statement">
        <div className="leadership-statement-inner">
          <span className="section-eyebrow">OUR COMMITMENT</span>

          <h2>
            Leadership with
            <span> Purpose</span>
          </h2>

          <p>
            With a focus on cooperation, quality and sustainable growth,
            our leadership works towards creating meaningful opportunities
            for businesses, members and communities.
          </p>
        </div>
      </section>
    </div>
  );
};

export default BoardOfDirectors;