import { useEffect, useState } from "react";
import {
  Users,
  Package,
  FolderTree,
  Images,
  PanelsTopLeft,
  MessageSquare,
  ArrowUpRight,
  Clock3,
} from "lucide-react";

import dashboardService from "../../services/dashboardService";

import "./Dashboard.css";

const Dashboard = () => {
  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const response =
          await dashboardService.getAnalytics();

        setAnalytics(
          response?.data || response
        );
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      label: "Total Members",
      value:
        analytics?.members?.total ?? 0,
      active:
        analytics?.members?.active ?? 0,
      icon: Users,
    },
    {
      label: "Total Products",
      value:
        analytics?.products?.total ?? 0,
      active:
        analytics?.products?.active ?? 0,
      icon: Package,
    },
    {
      label: "Categories",
      value:
        analytics?.categories?.total ?? 0,
      active:
        analytics?.categories?.active ?? 0,
      icon: FolderTree,
    },
    {
      label: "Gallery",
      value:
        analytics?.galleries?.total ?? 0,
      active:
        analytics?.galleries?.active ?? 0,
      icon: Images,
    },
    {
      label: "Hero Slides",
      value:
        analytics?.heroSlides?.total ?? 0,
      active:
        analytics?.heroSlides?.active ?? 0,
      icon: PanelsTopLeft,
    },
    {
      label: "New Enquiries",
      value:
        analytics?.enquiries?.new ?? 0,
      active:
        analytics?.enquiries?.total ?? 0,
      icon: MessageSquare,
    },
  ];

  if (loading) {
    return (
      <div className="mmics-admin-page-loading">
        <div className="mmics-admin-spinner" />
        <span>
          Loading dashboard...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mmics-admin-error">
        {error}
      </div>
    );
  }

  return (
    <div className="mmics-dashboard">

      {/* HEADER */}

      <div className="mmics-dashboard-header">

        <div>
          <span className="mmics-dashboard-eyebrow">
            OVERVIEW
          </span>

          <h1>Dashboard</h1>

          <p>
            Manage your MMICS digital portal
            from one place.
          </p>
        </div>

      </div>

      {/* STATS */}

      <div className="mmics-dashboard-stats">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              className="mmics-dashboard-stat"
              key={stat.label}
            >
              <div className="mmics-dashboard-stat-top">

                <div className="mmics-dashboard-stat-icon">
                  <Icon size={19} />
                </div>

                <ArrowUpRight size={16} />

              </div>

              <div className="mmics-dashboard-stat-value">
                {stat.value}
              </div>

              <div className="mmics-dashboard-stat-label">
                {stat.label}
              </div>

              <div className="mmics-dashboard-stat-active">
                {stat.active} active
              </div>
            </div>
          );
        })}

      </div>

      {/* LOWER GRID */}

      <div className="mmics-dashboard-grid">

        {/* RECENT MEMBERS */}

        <section className="mmics-dashboard-card">

          <div className="mmics-dashboard-card-header">

            <div>
              <span>
                MEMBERS
              </span>

              <h2>
                Recent Members
              </h2>
            </div>

            <Users size={19} />

          </div>

          <div className="mmics-dashboard-list">

            {analytics?.recentMembers
              ?.length ? (
              analytics.recentMembers.map(
                (member) => (
                  <div
                    className="mmics-dashboard-list-item"
                    key={member.id}
                  >
                    <div className="mmics-dashboard-list-avatar">
                      {member.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {member.name}
                      </strong>

                      <span>
                        {member.membershipNumber}
                      </span>
                    </div>

                    <small>
                      {member.status}
                    </small>
                  </div>
                )
              )
            ) : (
              <div className="mmics-dashboard-empty">
                No members yet.
              </div>
            )}

          </div>

        </section>

        {/* RECENT ENQUIRIES */}

        <section className="mmics-dashboard-card">

          <div className="mmics-dashboard-card-header">

            <div>
              <span>
                ENQUIRIES
              </span>

              <h2>
                Recent Enquiries
              </h2>
            </div>

            <MessageSquare size={19} />

          </div>

          <div className="mmics-dashboard-list">

            {analytics?.recentEnquiries
              ?.length ? (
              analytics.recentEnquiries.map(
                (enquiry) => (
                  <div
                    className="mmics-dashboard-enquiry"
                    key={enquiry.id}
                  >
                    <div>
                      <strong>
                        {enquiry.name}
                      </strong>

                      <span>
                        {enquiry.subject ||
                          enquiry.type}
                      </span>
                    </div>

                    <small>
                      <Clock3 size={12} />
                      {enquiry.status}
                    </small>
                  </div>
                )
              )
            ) : (
              <div className="mmics-dashboard-empty">
                No enquiries yet.
              </div>
            )}

          </div>

        </section>

      </div>

    </div>
  );
};

export default Dashboard;