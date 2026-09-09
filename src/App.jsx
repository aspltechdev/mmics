import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Shared Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";

// Auth / Admin Pages
import Login from "./pages/login";
import Dashboard from "./pages/Admin/Dashboard";
import HeroManager from "./pages/Admin/Hero/HeroManager";
import ProductList from "./pages/Admin/Products/ProductList";
import ProductForm from "./pages/Admin/Products/ProductForm";
import EnquiryList from './pages/Admin/Enquiries/EnquiryList';
import EnquiryDetail from './pages/Admin/Enquiries/EnquiryDetail';

// ✅ ADD CATEGORY IMPORTS
import CategoryList from "./pages/Admin/Categories/CategoryList";
import CategoryForm from "./pages/Admin/Categories/CategoryForm";

// Public Website Pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Products from "./pages/Products";
import BoardOfDirectors from "./pages/BoardOfDirectors";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";

import "./App.css";

/* =========================================================
   PUBLIC WEBSITE LAYOUT
   ========================================================= */

const WebsiteLayout = () => {
  return (
    <div className="website-layout">
      <Navbar />
      <main className="website-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

/* =========================================================
   APP
   ========================================================= */

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* =================================================
              PUBLIC WEBSITE
              ================================================= */}

          <Route element={<WebsiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/board-of-directors" element={<BoardOfDirectors />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* =================================================
              LOGIN
              ================================================= */}

          <Route path="/login" element={<Login />} />

          {/* =================================================
              ADMIN
              ================================================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'EDITOR']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="hero" element={<HeroManager />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />

            {/* ✅ CATEGORY ROUTES */}
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />
            <Route path="enquiries" element={<EnquiryList />} />
            <Route path="enquiries/:id" element={<EnquiryDetail />} />
          </Route>

          {/* =================================================
              404
              ================================================= */}

          <Route
            path="*"
            element={
              <div className="temporary-page">
                <h1>404</h1>
                <p>Page not found.</p>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;