import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is admin but trying to access member route
  if (allowedRoles.includes('MEMBER') && ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user?.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If user is member but trying to access admin route
  if (allowedRoles.includes('SUPER_ADMIN') && user?.role === 'MEMBER') {
    return <Navigate to="/member/dashboard" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;