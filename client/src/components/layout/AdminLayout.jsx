import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  Images,
  PanelsTopLeft,
  FileText,
  MessageSquare,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./AdminLayout.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Members",
      path: "/admin/members",
      icon: Users,
    },
    {
      label: "Categories",
      path: "/admin/categories",
      icon: FolderTree,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Hero Slides",
      path: "/admin/hero-slides",
      icon: PanelsTopLeft,
    },
    {
      label: "Gallery",
      path: "/admin/gallery",
      icon: Images,
    },
    {
      label: "Website Content",
      path: "/admin/website-content",
      icon: FileText,
    },
    {
      label: "Enquiries",
      path: "/admin/enquiries",
      icon: MessageSquare,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/member-login");
  };

  return (
    <div className="mmics-admin">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          className="mmics-admin-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`mmics-admin-sidebar ${
          sidebarOpen
            ? "mmics-admin-sidebar-open"
            : ""
        }`}
      >

        {/* LOGO */}

        <div className="mmics-admin-brand">

          <div className="mmics-admin-brand-mark">
            M
          </div>

          <div>
            <strong>MMICS</strong>
            <span>Admin Portal</span>
          </div>

          <button
            type="button"
            className="mmics-admin-mobile-close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={20} />
          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="mmics-admin-nav">

          <div className="mmics-admin-nav-label">
            MAIN MENU
          </div>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `mmics-admin-nav-item ${
                    isActive
                      ? "active"
                      : ""
                  }`
                }
                onClick={() =>
                  setSidebarOpen(false)
                }
              >
                <Icon size={18} />

                <span>{item.label}</span>

                <ChevronRight
                  size={14}
                  className="mmics-admin-nav-arrow"
                />
              </NavLink>
            );
          })}

        </nav>

        {/* SIDEBAR FOOTER */}

        <div className="mmics-admin-sidebar-footer">

          <div className="mmics-admin-user-mini">

            <div className="mmics-admin-avatar">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {user?.name || "Administrator"}
              </strong>

              <span>
                Administrator
              </span>
            </div>

          </div>

          <button
            type="button"
            className="mmics-admin-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN AREA */}

      <div className="mmics-admin-main">

        {/* TOPBAR */}

        <header className="mmics-admin-topbar">

          <button
            type="button"
            className="mmics-admin-menu-button"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="mmics-admin-topbar-title">
            <span>MMICS</span>
            <strong>Administration</strong>
          </div>

          <div className="mmics-admin-topbar-user">

            <div className="mmics-admin-topbar-avatar">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {user?.name || "Administrator"}
              </strong>
              <span>Admin</span>
            </div>

          </div>

        </header>

        {/* PAGE */}

        <main className="mmics-admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;