import React from "react";
import "./BenefitsVideoSection.css";

const BenefitsVideoSection = () => {
  return (
    <section className="mmics-benefits-video-section">
      <div className="mmics-benefits-video-container">

        <div className="mmics-benefits-video-heading">
          <span>WHY MMICS</span>

          <h2>
            Benefits of Becoming a{" "}
            <strong>Member of MMICS</strong>
          </h2>

          <p>
            Discover the benefits and opportunities available
            through MMICS membership and participation.
          </p>
        </div>

        <div className="mmics-benefits-video-grid">

          {/* YOUTUBE VIDEO */}
          <div className="mmics-benefits-video-card">
            <div className="mmics-benefits-video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/4JMj46GyKPU"
                title="Benefits of MMICS Membership"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          {/* LOCAL VIDEO */}
          <div className="mmics-benefits-video-card">
            <div className="mmics-benefits-video-wrapper">
              <video
                controls
                playsInline
                preload="metadata"
              >
                <source
                  src="/your-video.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default BenefitsVideoSection;