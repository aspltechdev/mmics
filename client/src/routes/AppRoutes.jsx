// client/src/routes/AppRoutes.jsx

import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicLayout from "../components/layout/PublicLayout";

import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import MemberLogin from "../pages/auth/MemberLogin";

import MembersAdmin from "../pages/admin/Members";
import Categories from "../pages/admin/Categories";
import ProductsAdmin from "../pages/admin/Products";
import HeroSlides from "../pages/admin/HeroSlides";
import GalleryAdmin from "../pages/admin/Gallery";
import Enquiries from "../pages/admin/Enquiries";

// Public pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Organization from "../pages/public/Organization";
import Members from "../pages/public/Members";
import Products from "../pages/public/Products";
import ProductDetails from "../pages/public/ProductDetails";
import Gallery from "../pages/public/Gallery";
import Contact from "../pages/public/Contact";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =================================================
          PUBLIC ROUTES
      ================================================= */}

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route
          path="/organization"
          element={<Organization />}
        />

        <Route
          path="/members"
          element={<Members />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/products/:slug"
          element={<ProductDetails />}
        />

        <Route
          path="/gallery"
          element={<Gallery />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />
      </Route>

      {/* =================================================
          AUTH
      ================================================= */}

      <Route
        path="/member-login"
        element={<MemberLogin />}
      />

      {/* =================================================
          MEMBER ROUTES
      ================================================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["MEMBER"]} />
        }
      >
        <Route
          path="/member"
          element={<div>Member Dashboard</div>}
        />

        <Route
          path="/member/profile"
          element={<div>Member Profile</div>}
        />
      </Route>

      {/* =================================================
          ADMIN ROUTES
      ================================================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]} />
        }
      >
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/members"
            element={<MembersAdmin />}
          />

          <Route
            path="/admin/categories"
            element={<Categories />}
          />

          <Route
            path="/admin/products"
            element={<ProductsAdmin />}
          />

          <Route
            path="/admin/hero-slides"
            element={<HeroSlides />}
          />

          <Route
            path="/admin/gallery"
            element={<GalleryAdmin />}
          />

          <Route
            path="/admin/website-content"
            element={<div>Website Content</div>}
          />

          <Route
            path="/admin/enquiries"
            element={<Enquiries />}
          />
        </Route>
      </Route>

      {/* =================================================
          404
      ================================================= */}

      <Route
        path="*"
        element={<div>Page Not Found</div>}
      />
    </Routes>
  );
};

export default AppRoutes;