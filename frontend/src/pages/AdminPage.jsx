import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";
import WelcomeAdmin from "../components/Admin/WelcomeAdmin";
import ProgrammeManager from "../components/Admin/ProgrammeManager";
import ManageResources from "../components/Admin/ManageResources";
import Analytics from "../components/Admin/Analytics";
import ManageUsers from "../components/Admin/ManageUsers";
import UniversityManager from "../components/Admin/UniversityManager";

const AdminPage = () => {
  return (
    <div className=" flex  mt-[45px] overflow-hidden h-screen bg-no-repeat bg-center bg-cover scroll-smooth  ">
      <Sidebar />
      <Routes>
        {/* 👇 Redirect /study/admin to /study/admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<WelcomeAdmin />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="manageusers" element={<ManageUsers />} />
        <Route path="manageprogramme" element={<ProgrammeManager />} />
        <Route path="manageuniversities" element={<UniversityManager />} />
        <Route path="manageresources" element={<ManageResources />} />
      </Routes>
    </div>
  );
};

export default AdminPage;
