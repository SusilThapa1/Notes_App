import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import Loader from "./Loader";

const PublicRoute = () => {
  const { userDetails, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  if (userDetails) {
    // redirect based on role
    const role = userDetails.role?.toLowerCase();
    if (role === "admin") {
      return <Navigate to="/study/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
