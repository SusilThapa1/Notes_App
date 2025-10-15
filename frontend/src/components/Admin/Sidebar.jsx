import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdFileUpload } from "react-icons/md";
import { FaUser, FaGraduationCap, FaCalendarAlt } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { GrResources } from "react-icons/gr";

const Sidebar = () => {
  const url = "/study/admin";
  const menus = [
    { name: "Dashboard", link: `${url}/dashboard` },
    { name: "Manage Users", link: `${url}/manageusers` },
    { name: "Manage Programme", link: `${url}/manageprogramme` },
    { name: "Manage Semesters", link: `${url}/managesemester` },
    { name: "Upload Resources", link: `${url}/uploadresources` },
    { name: "Manage Resources", link: `${url}/manageresources` },
  ];

  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);
  console.log(location.pathname);
  const handleAdminMenu = () => {
    setAdminMenuOpen(!adminMenuOpen);
  };

  return (
    <div className="relative w-full md:h-screen">
      {/* Desktop Admin menu */}
      <div className="hidden h-screen md:flex flex-col justify-center md:justify-start text-center gap-5 border-r-gray-300 border-b-gray-400 border-2 mt-5 py-5 px-2">
        {menus.map((menu) => {
          const isActive = activeLink === menu.link;
          return (
            <Link
              to={menu.link}
              key={menu.name}
              className={`bg-transparent flex gap-2 items-center w-full px-3 py-3 rounded-2xl transition-all duration-300 shadow-xl border border-yellow-50 hover-supported:hover:text-darkGreen
                ${
                  isActive
                    ? "  text-lightGreen border-transparent "
                    : "text-gray-700"
                }`}
            >
              {/* Choose icon based on the menu */}
              {menu.name === "Dashboard" && <MdDashboard size={20} />}
              {menu.name === "Manage Users" && <FaUser size={20} />}
              {menu.name === "Manage Programme" && (
                <FaGraduationCap size={20} />
              )}
              {menu.name === "Manage Semesters" && <FaCalendarAlt size={20} />}
              {menu.name === "Upload Resources" && <MdFileUpload size={20} />}
              {menu.name === "Manage Resources" && <GrResources size={20} />}
              <h1 className="font-medium">{menu.name}</h1>
            </Link>
          );
        })}
      </div>

      {/* Mobile Admin Menu Toggle */}
      <FaArrowCircleRight
        size={22}
        onClick={handleAdminMenu}
        title="Admin menu"
        className={`md:hidden fixed top-16 z-50 cursor-pointer transition-all duration-500 ${
          adminMenuOpen
            ? "rotate-180 left-48 text-red-600 hover-supported:hover:text-red-700"
            : "left-5 text-lightGreen hover-supported:hover:text-darkGreen"
        }`}
      />

      {/* Mobile Admin Menu */}
      <div
        className={`fixed left-0 top-14 border border-gray-200 h-screen backdrop-blur-sm flex  flex-col items-start justify-start gap-5 px-2 py-10 shadow-lg transition-transform duration-500 md:hidden w-1/2 ${
          adminMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {menus.map((menu) => {
          const isActive = activeLink === menu.link;
          return (
            <Link
              to={menu.link}
              key={menu.name}
              onClick={() => setAdminMenuOpen(false)}
              className={`flex gap-2 items-center w-full px-3 py-2 rounded-xl transition-all duration-300 shadow-sm border 
                ${
                  isActive
                    ? "  text-lightGreen border-transparent "
                    : "text-gray-700"
                }`}
            >
              {menu.name === "Dashboard" && <MdDashboard size={18} />}
              {menu.name === "Manage Users" && <FaUser size={18} />}
              {menu.name === "Manage Programme" && (
                <FaGraduationCap size={18} />
              )}
              {menu.name === "Manage Semesters" && <FaCalendarAlt size={18} />}
              {menu.name === "Upload Resources" && <MdFileUpload size={18} />}
              {menu.name === "Manage Resources" && <GrResources size={18} />}
              <h1 className="font-medium">{menu.name}</h1>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
