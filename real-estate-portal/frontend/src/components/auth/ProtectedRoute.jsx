import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roles }) => {
  // Placeholder - will be implemented with actual auth
  // For now, allow all access
  return children;
};

export default ProtectedRoute;
