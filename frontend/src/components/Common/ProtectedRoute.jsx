import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import Loader from "../Loader/Loader";
import { AuthContext } from "../Context/AuthContext";

const ProtectedRoute = ({ roleRequired }) => {
  const { userDetails, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  // User not logged in -> send to sign-in
  if (!userDetails) return <Navigate to="/signin" replace />;

  // Role-based access control
  if (
    roleRequired &&
    userDetails?.role?.toLowerCase() !== roleRequired.toLowerCase()
  ) {
    return <Navigate to="/not-authorize" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
