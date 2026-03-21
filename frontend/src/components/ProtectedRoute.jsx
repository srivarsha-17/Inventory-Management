import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
