import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/login';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import MemberLayout from './components/layout/MemberLayout';
import MemberDashboard from './pages/Member/Dashboard';
import HeroManager from './pages/Admin/Hero/HeroManager';
import ProductList from './pages/Admin/Products/ProductList';
import ProductForm from './pages/Admin/Products/ProductForm';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Products from './pages/Products';
import Contact from './pages/Contact/Contact';
import Gallery from './pages/Gallery';
import BoardOfDirectors from './pages/BoardOfDirectors';

function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/board-of-directors" element={<BoardOfDirectors />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* ===== ADMIN ROUTES ===== */}
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
        </Route>

        {/* ===== MEMBER ROUTES ===== */}
        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRoles={['MEMBER']}>
              <MemberLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<MemberDashboard />} />
        </Route>

        {/* ===== 404 ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default AppRoutes;