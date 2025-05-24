import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import Loader from "./Loader";
import { AuthContext } from "./Context/AuthContext";

const ProtectedRoute = ({ roleRequired }) => {
  const { token, user, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  if (!token || !user) {
    return <Navigate to="/study/signin" replace />;
  }

  if (roleRequired && user?.role !== roleRequired) {
    return <Navigate to="/study/not-authorize" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
