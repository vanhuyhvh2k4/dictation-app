import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface JWTPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

// Utility function to check if token is valid and decode it
const getDecodedToken = (token: string | undefined): JWTPayload | null => {
  if (!token) return null;
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Utility function to check if user is admin
const isAdmin = (token: string | undefined): boolean => {
  const decoded = getDecodedToken(token);
  return decoded?.role === 'admin';
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = Cookies.get('token');

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // If user is admin, redirect to admin dashboard
  if (isAdmin(token)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = Cookies.get('token');

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (!isAdmin(token)) {
    // Redirect non-admin users to home page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = Cookies.get('token');

  if (token) {
    // If user is admin, redirect to admin dashboard, otherwise to home
    if (isAdmin(token)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Route that allows both authenticated and non-authenticated users
export const OptionalAuthRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = Cookies.get('token');

  // If user is admin, redirect to admin dashboard
  if (token && isAdmin(token)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};