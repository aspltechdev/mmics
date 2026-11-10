import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  UserRound,
  ArrowRight,
  Loader2,
  UsersRound,
  RefreshCw,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import memberService from "../../services/memberService";

import "./Members.css";

import memberHero from "../../assets/memberhero.png";
import memberCta from "../../assets/membercta.png";
import memberBenefits from "../../assets/member.png";


// ============================================================
// SERVER URL
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mmmicslimited.in/api";

const SERVER_URL =
  API_URL.replace(
    /\/api\/?$/,
    ""
  );


// ============================================================
// IMAGE URL
// ============================================================

const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${SERVER_URL}/${imageUrl.replace(
    /^\//,
    ""
  )}`;
};


// ============================================================
// NORMALIZE RESPONSE
// ============================================================

const normalizeMembers = (
  response
) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (
    Array.isArray(
      response?.members
    )
  ) {
    return response.members;
  }

  if (
    Array.isArray(
      response?.data
    )
  ) {
    return response.data;
  }

  if (
    Array.isArray(
      response?.data?.members
    )
  ) {
    return response.data.members;
  }

  return [];
};


// ============================================================
// COMPONENT
// ============================================================

const Members = () => {
  const [members, setMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [
    designation,
    setDesignation,
  ] = useState("all");

  const [
    imageErrors,
    setImageErrors,
  ] = useState({});

  const [
    selectedMember,
    setSelectedMember,
  ] = useState(null);


  // ==========================================================
  // FETCH MEMBERS
  // ==========================================================

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await memberService.getPublic();

      const data =
        normalizeMembers(
          response
        );

      const activeMembers =
        data.filter(
          (member) =>
            member.status ===
              undefined ||
            member.status ===
              "ACTIVE"
        );

      setMembers(
        activeMembers
      );

    } catch (err) {

      console.error(
        "Members fetch error:",
        err
      );

      setError(
        "Unable to load members."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchMembers();
  }, []);


  // ==========================================================
  // DESIGNATIONS
  // ==========================================================

  const designations =
    useMemo(() => {
      const values =
        members
          .map(
            (member) =>
              member.designation
          )
          .filter(Boolean);

      return [
        ...new Set(values),
      ];
    }, [members]);


  // ==========================================================
  // FILTER MEMBERS
  // ==========================================================

  const filteredMembers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return members.filter(
        (member) => {
          const matchesSearch =
            !query ||
            member.name
              ?.toLowerCase()
              .includes(query) ||
            member.email
              ?.toLowerCase()
              .includes(query) ||
            member.phone
              ?.toLowerCase()
              .includes(query) ||
            member.membershipNumber
              ?.toLowerCase()
              .includes(query) ||
            member.designation
              ?.toLowerCase()
              .includes(query);

          const matchesDesignation =
            designation === "all" ||
            member.designation ===
              designation;

          return (
            matchesSearch &&
            matchesDesignation
          );
        }
      );
    }, [
      members,
      search,
      designation,
    ]);


  // ==========================================================
  // IMAGE ERROR
  // ==========================================================

  const handleImageError = (
    memberId
  ) => {
    setImageErrors(
      (previous) => ({
        ...previous,
        [memberId]: true,
      })
    );
  };


  // ==========================================================
  // CLEAR SEARCH
  // ==========================================================

  const clearSearch = () => {
    setSearch("");

    setDesignation(
      "all"
    );
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="mmics-members-page">

      {/* ====================================================
          HERO
      ==================================================== */}

      <section className="mmics-members-hero">

        <img
          src={memberHero}
          alt="MMICS packaging and industrial solutions"
          className="mmics-member-hero-image"
        />

        <div className="mmics-member-hero-overlay" />

        <div className="mmics-members-hero-content">

          <span className="mmics-members-hero-kicker">
            MMMICS COMMUNITY
          </span>

          <h1>
            Our{" "}
            <strong>
              Members
            </strong>
          </h1>

          <p>
            Meet the businesses and
            professionals who are part of
            the MMMICS community, building
            stronger connections and
            opportunities together.
          </p>

        </div>

      </section>


      {/* ====================================================
          MEMBER BENEFITS
      ==================================================== */}

      <section className="mmics-member-benefits">

        <div className="mmics-member-benefits-container">

          {/* ==================================================
              HEADING
          ================================================== */}

          <div className="mmics-member-benefits-heading">

            <span>
              WHY MANARANG
            </span>

            <h2>
              Benefits of Becoming a{" "}
              <strong>
                Member of Manarang
              </strong>
            </h2>

            <p>
              A cooperative platform connecting
              manufacturers, MSMEs and entrepreneurs
              for stronger business opportunities
              and shared growth.
            </p>

          </div>


          {/* ==================================================
              CONTENT + IMAGE
          ================================================== */}

          <div className="mmics-member-benefits-grid">

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="mmics-member-benefits-content">

              <span className="mmics-member-benefits-label">
                MEMBERSHIP BENEFITS
              </span>

              <h3>
                Grow Together Through{" "}
                <strong>
                  Cooperation and Opportunity
                </strong>
              </h3>

              <p>
                MANARANG connects manufacturers,
                MSMEs and entrepreneurs through
                a strong cooperative network.
                Members can explore collective
                procurement, business networking,
                market access and institutional
                supply opportunities.
                The network supports collaboration,
                industrial development and
                long-term mutual growth.
              </p>


              {/* =================================================
                  BENEFITS LIST
              ================================================= */}

              <div className="mmics-member-benefit-list">

                {/* COLLECTIVE BUSINESS */}

                <div className="mmics-member-benefit-item">

                  <span>
                    ✓
                  </span>

                  <div>

                    <h4>
                      Collective Business Opportunities
                    </h4>

                    <p>
                      Create new opportunities
                      through cooperative participation.
                    </p>

                  </div>

                </div>


                {/* RAW MATERIAL */}

                <div className="mmics-member-benefit-item">

                  <span>
                    ✓
                  </span>

                  <div>

                    <h4>
                      Raw Material Support
                    </h4>

                    <p>
                      Explore better sourcing
                      through collective procurement.
                    </p>

                  </div>

                </div>


                {/* MARKETING */}

                <div className="mmics-member-benefit-item">

                  <span>
                    ✓
                  </span>

                  <div>

                    <h4>
                      Marketing Support
                    </h4>

                    <p>
                      Improve market reach
                      and product visibility.
                    </p>

                  </div>

                </div>


                {/* INSTITUTIONAL SUPPLY */}

                <div className="mmics-member-benefit-item">

                  <span>
                    ✓
                  </span>

                  <div>

                    <h4>
                      Institutional Supply
                    </h4>

                    <p>
                      Connect with larger companies
                      and institutional buyers.
                    </p>

                  </div>

                </div>


                {/* BUSINESS NETWORKING */}

                <div className="mmics-member-benefit-item">

                  <span>
                    ✓
                  </span>

                  <div>

                    <h4>
                      Business Networking
                    </h4>

                    <p>
                      Build stronger industry
                      relationships and partnerships.
                    </p>

                  </div>

                </div>


                {/* GROWTH */}

                <div className="mmics-member-benefit-item">

                  <span>
                    ✓
                  </span>

                  <div>

                    <h4>
                      Growth Opportunities
                    </h4>

                    <p>
                      Support mutual growth
                      and industrial development.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                RIGHT IMAGE
            ================================================= */}

            <div className="mmics-member-benefits-image">

              <img
                src={memberBenefits}
                alt="MANARANG cooperative manufacturing network"
              />

              <div className="mmics-member-benefits-image-overlay" />

              <div className="mmics-member-benefits-image-text">

                <span>
                  MANARANG
                </span>

                <h3>
                  Together We Manufacture.
                  Together We Grow.
                </h3>

                <p>
                  Building stronger opportunities
                  through cooperation.
                </p>

              </div>

            </div>

          </div>


          {/* ==================================================
              VIDEO HEADING
          ================================================== */}

          <div className="mmics-member-video-heading">

            <span>
              WATCH & DISCOVER
            </span>

            <h3>
              Discover the MANARANG Network
            </h3>

            <p>
              Learn how MANARANG supports
              manufacturers through cooperation,
              networking and business opportunities.
            </p>

          </div>


          {/* ==================================================
              VIDEOS
          ================================================== */}

          <div className="mmics-member-video-grid">

            {/* =================================================
                YOUTUBE VIDEO
            ================================================= */}

            <div className="mmics-member-video-card">

              <div className="mmics-member-video-wrapper">

                <iframe
                  src="https://www.youtube.com/embed/4JMj46GyKPU"
                  title="MANARANG Cooperative Network"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />

              </div>

            </div>


            {/* =================================================
                LOCAL VIDEO
            ================================================= */}

            <div className="mmics-member-video-card">

              <div className="mmics-member-video-wrapper">

                <video
                  controls
                  playsInline
                  preload="metadata"
                >

                  <source
                    src="/member-benefits.mp4"
                    type="video/mp4"
                  />

                  Your browser does not
                  support the video tag.

                </video>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          MEMBERS SECTION
      ==================================================== */}

      <section className="mmics-members-section">

        <div className="mmics-members-container">

          {/* ==================================================
              HEADING
          ================================================== */}

          <div className="mmics-members-heading">

            <span>
              OUR MEMBER NETWORK
            </span>

            <h2>
              Connect with the{" "}
              <strong>
                MMMICS Community
              </strong>
            </h2>

            <p>
              Explore our member network
              and discover businesses,
              professionals and organizations
              connected through MMMICS.
            </p>

          </div>


          {/* ==================================================
              TOOLBAR
          ================================================== */}

          <div className="mmics-members-toolbar">

            {/* SEARCH */}

            <div className="mmics-members-search">

              <Search />

              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

              {search && (

                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                >
                  <X />
                </button>

              )}

            </div>


            {/* DESIGNATION FILTER */}

            <select
              value={designation}
              onChange={(event) =>
                setDesignation(
                  event.target.value
                )
              }
              className="mmics-members-filter"
            >

              <option value="all">
                All Designations
              </option>

              {designations.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

          </div>


          {/* ==================================================
              RESULT COUNT
          ================================================== */}

          {!loading &&
            !error && (

              <div className="mmics-members-result-count">

                Showing{" "}

                <strong>
                  {filteredMembers.length}
                </strong>{" "}

                member

                {filteredMembers.length !==
                1
                  ? "s"
                  : ""}

              </div>

            )}


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (

            <div className="mmics-members-state">

              <Loader2 className="mmics-members-spinner" />

              <span>
                Loading members...
              </span>

            </div>

          )}


          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading &&
            error && (

              <div className="mmics-members-state">

                <UsersRound />

                <h3>
                  Unable to Load Members
                </h3>

                <p>
                  Please try again.
                </p>

                <button
                  type="button"
                  onClick={
                    fetchMembers
                  }
                >

                  <RefreshCw />

                  Retry

                </button>

              </div>

            )}


          {/* ==================================================
              EMPTY
          ================================================== */}

          {!loading &&
            !error &&
            filteredMembers.length ===
              0 && (

              <div className="mmics-members-state">

                <UsersRound />

                <h3>
                  No Members Found
                </h3>

                <p>
                  Try changing your search
                  or filter.
                </p>

                {(search ||
                  designation !==
                    "all") && (

                  <button
                    type="button"
                    onClick={
                      clearSearch
                    }
                  >
                    Clear Filters
                  </button>

                )}

              </div>

            )}


          {/* ==================================================
              MEMBERS GRID
          ================================================== */}

          {!loading &&
            !error &&
            filteredMembers.length >
              0 && (

              <div className="mmics-members-grid">

                {filteredMembers.map(
                  (
                    member,
                    index
                  ) => {

                    const image =
                      member.profileImage
                        ? getImageUrl(
                            member.profileImage
                          )
                        : "/profile.jpg";

                    return (

                      <article
                        className="mmics-member-card"
                        key={
                          member.id
                        }
                        onClick={() =>
                          setSelectedMember(
                            member
                          )
                        }
                      >

                        {/* IMAGE */}

                        <div className="mmics-member-image">

                          {image &&
                          !imageErrors[
                            member.id
                          ] ? (

                            <img
                              src={image}
                              alt={
                                member.name
                              }
                              onError={() =>
                                handleImageError(
                                  member.id
                                )
                              }
                            />

                          ) : (

                            <div className="mmics-member-placeholder">

                              <UserRound />

                            </div>

                          )}

                        </div>


                        {/* CONTENT */}

                        <div className="mmics-member-content">

                          <span className="mmics-member-number">

                            {member.membershipNumber ||
                              `MMICS-${String(
                                index + 1
                              ).padStart(
                                3,
                                "0"
                              )}`}

                          </span>


                          <h3>
                            {member.name}
                          </h3>


                          {member.designation && (

                            <p className="mmics-member-designation">

                              {
                                member.designation
                              }

                            </p>

                          )}

                        </div>

                      </article>

                    );
                  }
                )}

              </div>

            )}

        </div>

      </section>


      {/* ====================================================
          CTA
      ==================================================== */}

      <section className="mmics-members-cta">

        <img
          src={memberCta}
          alt="Join the MMICS community"
          className="mmics-members-cta-image"
        />

        <div className="mmics-members-cta-overlay" />

        <div className="mmics-members-cta-content">

          <span>
            JOIN THE COMMUNITY
          </span>

          <h2>
            Be Part of the{" "}
            <strong>
              MMMICS Network
            </strong>
          </h2>

          <p>
            Connect with businesses,
            discover opportunities and
            grow together with the MMMICS
            community.
          </p>

          <Link
            to="/contact"
            className="mmics-members-cta-button"
          >
            Become a Member

            <ArrowRight />
          </Link>

        </div>

      </section>


      {/* ====================================================
          MEMBER MODAL
      ==================================================== */}

      {selectedMember && (

        <div
          className="mmics-member-modal-backdrop"
          onClick={() =>
            setSelectedMember(null)
          }
        >

          <div
            className="mmics-member-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="mmics-member-modal-close"
              onClick={() =>
                setSelectedMember(null)
              }
              aria-label="Close"
            >
              <X />
            </button>


            {/* MODAL IMAGE */}

            <div className="mmics-member-modal-image">

              <img
                src={
                  selectedMember.profileImage &&
                  !imageErrors[
                    selectedMember.id
                  ]
                    ? getImageUrl(
                        selectedMember.profileImage
                      )
                    : "/profile.jpg"
                }
                alt={
                  selectedMember.name
                }
                onError={(event) => {
                  event.currentTarget.src =
                    "/default-avatar.png";
                }}
              />

            </div>


            {/* MODAL CONTENT */}

            <div className="mmics-member-modal-content">

              <span>

                {selectedMember.membershipNumber ||
                  "MMICS MEMBER"}

              </span>


              <h2>
                {selectedMember.name}
              </h2>


              {selectedMember.designation && (

                <p className="mmics-member-modal-designation">

                  {
                    selectedMember.designation
                  }

                </p>

              )}


              {selectedMember.email && (

                <div>

                  <small>
                    Email
                  </small>

                  <p>
                    {
                      selectedMember.email
                    }
                  </p>

                </div>

              )}


              {selectedMember.phone && (

                <div>

                  <small>
                    Phone
                  </small>

                  <p>
                    {
                      selectedMember.phone
                    }
                  </p>

                </div>

              )}


              {selectedMember.address && (

                <div>

                  <small>
                    Address
                  </small>

                  <p>
                    {
                      selectedMember.address
                    }
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </main>
  );
};


export default Members;