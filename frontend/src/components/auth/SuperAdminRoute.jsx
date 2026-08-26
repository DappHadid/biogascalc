import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function SuperAdminRoute({ children }) {
  const { isSuperAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div className="admin-spinner" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
