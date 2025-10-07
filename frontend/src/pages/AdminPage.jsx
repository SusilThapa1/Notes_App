import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";
import WelcomeAdmin from "../components/Admin/WelcomeAdmin";
import ProgrammeManager from "../components/Admin/ProgrammeManager";
import SemesterManager from "../components/Admin/SemesterManager";
import ManageResources from "../components/Admin/ManageResources";
import UploadResources from "../components/Admin/UploadResources";
import Analytics from "../components/Admin/Analytics";
import ManageUsers from "../components/Admin/ManageUsers";

const AdminPage = () => {
  return (
    <div className="md:grid md:grid-cols-[20%,80%] gap-2 mt-[45px] overflow-hidden md:h-screen h-screen bg-transparent bg-no-repeat bg-center bg-cover scroll-smooth px-5 md:pl-0 ">
      <Sidebar />
      <Routes>
        {/* 👇 Redirect /study/admin to /study/admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        <Route path="dashboard" element={<WelcomeAdmin />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="manageusers" element={<ManageUsers />} />
        <Route path="manageprogramme" element={<ProgrammeManager />} />
        <Route path="managesemester" element={<SemesterManager />} />
        <Route path="uploadresources" element={<UploadResources />} />
        <Route path="manageresources" element={<ManageResources />} />
      </Routes>
    </div>
  );
};

export default AdminPage;
