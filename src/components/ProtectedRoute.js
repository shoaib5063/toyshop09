import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const ProtectedRoute = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
