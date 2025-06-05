import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import Loader from "./Loader";

const PublicRoute = () => {
  const { token, user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  if (token && user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
