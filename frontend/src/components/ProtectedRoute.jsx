import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); // Get token from localStorage or state

  return token ? <Outlet /> : <Navigate to="/study/admin/login" replace />;
};

export default ProtectedRoute;
