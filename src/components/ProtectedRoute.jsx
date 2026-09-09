import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard for both portals.
 *
 * Pass allowedRoles to restrict a branch of the route tree:
 *
 *   <ProtectedRoute allowedRoles={['SUPER_ADMIN','ADMIN','EDITOR']}>
 *   <ProtectedRoute allowedRoles={['MEMBER']}>
 *
 * A signed-in person who lands on the wrong portal is sent to
 * their own dashboard rather than bounced back to a login
 * screen they have already passed.
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user, isMember } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="route-loading">
        <div className="spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  const wantsMemberArea = allowedRoles.includes('MEMBER');

  if (!isAuthenticated) {
    return (
      <Navigate
        to={wantsMemberArea ? '/member/login' : '/login'}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Member sitting on an admin route.
  if (!wantsMemberArea && isMember) {
    return <Navigate to="/member/dashboard" replace />;
  }

  // Admin sitting on a member route.
  if (wantsMemberArea && !isMember) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="route-denied">
        <h2>Access restricted</h2>
        <p>Your account does not have permission to view this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
