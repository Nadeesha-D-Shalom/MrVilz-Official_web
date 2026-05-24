import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isSuperAdmin } from "../../utils/adminRole";

export default function SuperAdminRoute({ children }) {
  const { admin, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isSuperAdmin(admin)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
