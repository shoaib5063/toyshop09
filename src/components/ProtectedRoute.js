import React from 'react';
import { Redirect } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return <Redirect to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
