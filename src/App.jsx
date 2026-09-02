import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Shared Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";

// Auth / Admin Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Admin/Dashboard";

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
   Navbar and Footer are shared across all public pages.
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
      <Routes>

        {/* =================================================
            PUBLIC WEBSITE
            ================================================= */}

        <Route element={<WebsiteLayout />}>

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* About */}
          <Route
            path="/about"
            element={<About />}
          />

          {/* Products */}
          <Route
            path="/products"
            element={<Products />}
          />

          {/* Board of Directors */}
          <Route
            path="/board-of-directors"
            element={<BoardOfDirectors />}
          />

          {/* Gallery */}
          <Route
            path="/gallery"
            element={<Gallery />}
          />

          {/* Contact */}
          <Route
            path="/contact"
            element={<Contact />}
          />

        </Route>

        {/* =================================================
            LOGIN
            ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =================================================
            ADMIN
            ================================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<Dashboard />}
          />
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
    </AuthProvider>
  );
}

export default App;