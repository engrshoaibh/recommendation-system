import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';

interface AuthRouteProps {
  element: React.ReactElement;
  requiresAuth: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ element, requiresAuth }) => {
  const isAuthenticated = !!localStorage.getItem('user');
  const location = useLocation();

  if (requiresAuth && !isAuthenticated) {
    // Redirect to sign-in if authentication is required and user is not authenticated
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!requiresAuth && isAuthenticated) {
    // Redirect to home if authentication is not required but user is already authenticated
    return <Navigate to="/home" replace />;
  }

  return element;
};

export default AuthRoute;
