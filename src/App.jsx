import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Shared layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";
import MemberLayout from "./components/layout/MemberLayout";

// Auth
import Login from "./pages/login";
import MemberLogin from "./pages/Member/MemberLogin";

// Admin
import Dashboard from "./pages/Admin/Dashboard";
import HeroManager from "./pages/Admin/Hero/HeroManager";
import ProductList from "./pages/Admin/Products/ProductList";
import ProductForm from "./pages/Admin/Products/ProductForm";
import CategoryList from "./pages/Admin/Categories/CategoryList";
import CategoryForm from "./pages/Admin/Categories/CategoryForm";
import EnquiryList from "./pages/Admin/Enquiries/EnquiryList";
import EnquiryDetail from "./pages/Admin/Enquiries/EnquiryDetail";
import MemberList from "./pages/Admin/Members/MemberList";
import MemberForm from "./pages/Admin/Members/MemberForm";

// Member portal
import MemberDashboard from "./pages/Member/Dashboard";
import MemberProfile from "./pages/Member/Profile";

// Public website
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Products from "./pages/Products";
import BoardOfDirectors from "./pages/BoardOfDirectors";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";

import "./App.css";

/* =========================================================
   PUBLIC WEBSITE LAYOUT
   =========================================================
   Left untouched: the public site design is still in
   progress, so only routing is defined here.
   ========================================================= */

const WebsiteLayout = () => (
  <div className="website-layout">
    <Navbar />
    <main className="website-main">
      <Outlet />
    </main>
    <Footer />
  </div>
);

/* =========================================================
   PLACEHOLDER FOR ADMIN SCREENS NOT YET BUILT
   =========================================================
   The admin sidebar links to several sections whose pages do
   not exist yet. Without a route these rendered as a blank
   404, which looked like a broken app. This explains what is
   going on instead.
   ========================================================= */

const ComingSoon = ({ title }) => (
  <div className="dashboard-container">
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>This section is not built yet</p>
      </div>
    </div>

    <div className="form-card">
      <div className="empty-state">
        <span className="icon">🚧</span>
        <p>
          The {title} management screen has not been built yet. The API endpoints for it are
          live, so this page can be added without any backend work.
        </p>
      </div>
    </div>
  </div>
);

/* =========================================================
   APP
   ========================================================= */

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ============ PUBLIC WEBSITE ============ */}
          <Route element={<WebsiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/board-of-directors" element={<BoardOfDirectors />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* ============ LOGIN ============ */}
          <Route path="/login" element={<Login />} />
          <Route path="/member/login" element={<MemberLogin />} />

          {/* ============ ADMIN ============ */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "EDITOR"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="hero" element={<HeroManager />} />

            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />

            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />

            <Route path="enquiries" element={<EnquiryList />} />
            <Route path="enquiries/:id" element={<EnquiryDetail />} />

            {/* Member management */}
            <Route path="members" element={<MemberList />} />
            <Route path="members/new" element={<MemberForm />} />
            <Route path="members/edit/:id" element={<MemberForm />} />

            {/* Sidebar links whose screens are not built yet */}
            <Route path="contact" element={<ComingSoon title="Contact Messages" />} />
            <Route path="directors" element={<ComingSoon title="Directors" />} />
            <Route path="gallery" element={<ComingSoon title="Gallery" />} />
            <Route path="news" element={<ComingSoon title="News" />} />
            <Route path="testimonials" element={<ComingSoon title="Testimonials" />} />
            <Route path="settings" element={<ComingSoon title="Settings" />} />
          </Route>

          {/* ============ MEMBER PORTAL ============ */}
          <Route
            path="/member"
            element={
              <ProtectedRoute allowedRoles={["MEMBER"]}>
                <MemberLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/member/dashboard" replace />} />
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="profile" element={<MemberProfile />} />
          </Route>

          {/* ============ 404 ============ */}
          <Route
            path="*"
            element={
              <div className="route-denied">
                <h1 style={{ fontSize: "48px" }}>404</h1>
                <p>That page could not be found.</p>
                <a href="/" className="btn btn-primary">
                  Back to home
                </a>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
