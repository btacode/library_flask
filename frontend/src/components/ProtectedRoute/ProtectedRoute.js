import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../config/APIs";

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const data = await api.checkAuth();
        if (data.authenticated) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
      setAuthChecked(true);
    };
    verifyAuth();
  }, []);

  if (!authChecked) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
