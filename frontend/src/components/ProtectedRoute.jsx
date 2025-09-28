import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import Loader from "./Loader";
import { AuthContext } from "./Context/AuthContext";

const ProtectedRoute = ({ roleRequired }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  // User not logged in
  if (!user) return <Navigate to="/study/signin" replace />;

  // Role-based access control
  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/study/not-authorize" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
