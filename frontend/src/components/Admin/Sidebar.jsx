import React, { useState } from "react";
import { GrResources } from "react-icons/gr";
import { FaArrowCircleRight, FaBook, FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdFileUpload } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { FaUser } from "react-icons/fa6";

const Sidebar = () => {
  const url = "/study/admin/dashboard";
  const menus = [
    { name: "View Analytics", link: `${url}/analytics` },
    { name: "Manage Users", link: `${url}/manageusers` },
    { name: "Manage Programme", link: `${url}/manageprogramme` },
    { name: "Manage Semesters", link: `${url}/managesemester` },
    { name: "Upload Resources", link: `${url}/uploadresources` },
    { name: "Manage Resources", link: `${url}/manageresources` },
  ];

  const [activeLink, setActiveLink] = useState("");
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const handleAdminMenu = () => {
    setAdminMenuOpen(!adminMenuOpen);
  };

  const handleClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="relative w-full md:h-screen">
      {/* Desktop Admin menu */}
      <div className=" hidden  h-screen  md:flex flex-col justify-center md:justify-start text-center gap-5 border-r-gray-400 border-b-gray-400  border-2 mt-5 py-5 px-2 z-0">
        {menus.map((menu) => (
          <Link
            to={menu.link}
            key={menu.name}
            className={`flex gap-2 items-center justify-center  py-3 rounded-2xl shadow-lg   bg-transparent border  border-slate-100 hover-supported:hover:text-green-600 ${
              activeLink === menu.link ? "bg-blue-200 text-[#5CAE59]" : ""
            }`}
            onClick={() => handleClick(menu.link)}
          >
            {/* Choose icon based on the menu */}
            {menu.name === "View Analytics" && (
              <VscGraph size={20} className="text-purple-500 " />
            )}
            {menu.name === "Manage Users" && (
              <FaUser size={20} className="text-gray-800 " />
            )}
            {menu.name === "Manage Programme" && (
              <FaGraduationCap size={20} className="text-blue-800 " />
            )}
            {menu.name === "Manage Semesters" && (
              <FaBook size={20} className="text-yellow-600" />
            )}
            {menu.name === "Upload Resources" && (
              <MdFileUpload size={20} className="text-red-600 " />
            )}
            {menu.name === "Manage Resources" && (
              <GrResources size={20} className="text-blue-600 " />
            )}
            <h1>{menu.name}</h1>
          </Link>
        ))}
      </div>

      {/* //Mobile admin menu*/}

      <FaArrowCircleRight
        size={20}
        onClick={handleAdminMenu}
        title="Admin menu"
        className={` md:hidden fixed top-16  z-50 ${
          adminMenuOpen
            ? "rotate-180 left-52 text-red-600"
            : "left-5 text-[#5CAE59]"
        } transition-all duration-500 `}
      />
      <div
        className={`fixed left-0 top-14 border border-r-yellow-50 h-screen backdrop-blur-sm flex  w-max flex-col items-start justify-start gap-10 px-2 py-5  shadow-lg transition-transform duration-500 md:hidden ${
          adminMenuOpen ? "-translate-x-0" : "-translate-x-full"
        }`}
      >
        {menus.map((menu) => (
          <Link
            to={menu.link}
            key={menu.name}
            className={`flex gap-2 items-center justify-center px-4 py-3 hover-supported:hover:text-green-600 ${
              activeLink === menu.link ? "  text-[#5CAE59]" : ""
            } `}
            onClick={() => {
              handleClick(menu.link);
              handleAdminMenu();
            }}
          >
            {/* Choose icon based on the menu */}
            {menu.name === "View Analytics" && (
              <VscGraph size={15} className="text-purple-500 " />
            )}
            {menu.name === "Manage Users" && (
              <FaUser size={15} className="text-gray-800 " />
            )}
            {menu.name === "Manage Programme" && (
              <FaGraduationCap size={15} className="text-blue-800 " />
            )}
            {menu.name === "Manage Semesters" && (
              <FaBook size={15} className="text-yellow-600" />
            )}
            {menu.name === "Upload Resources" && (
              <MdFileUpload size={15} className="text-red-600 " />
            )}
            {menu.name === "Manage Resources" && (
              <GrResources size={15} className="text-blue-600 " />
            )}
            <h1>{menu.name}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
