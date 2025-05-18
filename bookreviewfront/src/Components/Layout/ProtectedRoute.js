import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const ProtectedRoute = ({ element: Element }) => {
  const { user } = useAuth();

  if (!user) {
    // Utilizatorul nu este autentificat, redirecționează către pagina de login
    return <Navigate to="/" replace />;
  }

  // Utilizatorul este autentificat, randează componenta dorită
  return <Element />;
};

export default ProtectedRoute; 