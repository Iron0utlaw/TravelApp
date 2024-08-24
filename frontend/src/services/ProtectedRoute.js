import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

function ProtectedRoute({ element: Component, ...rest }) {
  const { user } = useAuth();

  if (!user) {
    // If user is not authenticated, redirect to landing page
    return <Navigate to="/" replace />;
  }

  // If user is authenticated, render the protected component
  return Component;
}

export default ProtectedRoute;
