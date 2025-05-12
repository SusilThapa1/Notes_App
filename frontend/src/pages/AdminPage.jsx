import React from "react";
import Sidebar from "../components/Admin/Sidebar";
import { Route, Routes } from "react-router-dom";
import WelcomeAdmin from "../components/Admin/WelcomeAdmin";
import ProgrammeManager from "../components/Admin/ProgrammeManager";
import SemesterManager from "../components/Admin/SemesterManager";
import ManageResources from "../components/Admin/ManageResources";
import UploadResources from "../components/Admin/UploadResources";

const AdminPage = () => {
  return (
    <div className="md:grid md:grid-cols-[20%,80%] gap-2  lg:grid-col-[5%,90%] mt-14 overflow-hidden  bg-[url(/images/Admin_bg.jpg)] bg-no-repeat bg-center bg-cover scroll-smooth  px-5 md:pl-0  mb-1 ">
      <Sidebar />
      <Routes>
        <Route index element={<WelcomeAdmin />} />
        <Route path="manageprogramme" element={<ProgrammeManager />} />
        <Route path="managesemester" element={<SemesterManager />} />
        <Route path="uploadresources" element={<UploadResources />} />
        <Route path="manageresources" element={<ManageResources />} />
      </Routes>
    </div>
  );
};

export default AdminPage;
