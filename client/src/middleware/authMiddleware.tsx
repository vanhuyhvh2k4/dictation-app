import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = Cookies.get('token');

  if (!token) {
    // Redirect to login if there is no token
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = Cookies.get('token');

  if (token) {
    // Redirect to home if user is already logged in
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};