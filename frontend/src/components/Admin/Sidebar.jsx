import React, { useState } from "react";
import { GrResources } from "react-icons/gr";
import { FaArrowCircleRight, FaBook, FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdFileUpload } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";

const Sidebar = () => {
  const url = "/study/admin/dashboard";
  const menus = [
    { name: "Analytics", link: `${url}/analytics` },
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
    <div className="relative w-full">
      {/* Desktop Admin menu */}
      <div className=" hidden  md:flex flex-col justify-center md:justify-start w-full text-center gap-5 border-r-gray-400 h-full border-b-gray-400  border-2 mt-10 py-5 px-2 ">
        {menus.map((menu) => (
          <Link
            to={menu.link}
            key={menu.name}
            className={`flex gap-2 items-center justify-center px-4 py-3 rounded-2xl shadow-lg   bg-transparent border  border-slate-100 hover-supported:hover:text-green-600 ${
              activeLink === menu.link ? "bg-blue-200    text-[#5CAE59]" : ""
            }`}
            onClick={() => handleClick(menu.link)}
          >
            {/* Choose icon based on the menu */}
            {menu.name === "Analytics" && (
              <VscGraph className="text-blue-800 text-2xl" />
            )}
            {menu.name === "Manage Programme" && (
              <FaGraduationCap className="text-blue-800 text-2xl" />
            )}
            {menu.name === "Manage Semesters" && (
              <FaBook className="text-yellow-600" />
            )}
            {menu.name === "Upload Resources" && (
              <MdFileUpload className="text-red-600 text-2xl" />
            )}
            {menu.name === "Manage Resources" && (
              <GrResources className="text-blue-600 text-2xl" />
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
        className={` md:hidden absolute top-0  z-50 ${
          adminMenuOpen
            ? "rotate-180 left-48 text-red-600"
            : "-left-3 text-green-600"
        } transition-all duration-500 `}
      />
      <div
        className={`fixed left-0 top-14 border border-r-yellow-50  backdrop-blur-sm flex h-screen w-max flex-col items-start justify-start gap-10 px-2 py-5  shadow-lg transition-transform duration-500 md:hidden ${
          adminMenuOpen ? "-translate-x-0" : "-translate-x-full"
        }`}
      >
        {menus.map((menu) => (
          <Link
            to={menu.link}
            key={menu.name}
            className={`flex gap-2 items-center justify-center px-4 py-3  hover-supported:hover:text-green-600 ${
              activeLink === menu.link ? "  text-[#5CAE59]" : ""
            } `}
            onClick={() => {
              handleClick(menu.link);
              handleAdminMenu();
            }}
          >
            {/* Choose icon based on the menu */}
            {menu.name === "Analytics" && (
              <VscGraph className="text-blue-800 text-2xl" />
            )}
            {menu.name === "Manage Programme" && (
              <FaGraduationCap className="text-blue-800 text-2xl" />
            )}
            {menu.name === "Manage Semesters" && (
              <FaBook className="text-yellow-600" />
            )}
            {menu.name === "Upload Resources" && (
              <MdFileUpload className="text-red-600 text-2xl" />
            )}
            {menu.name === "Manage Resources" && (
              <GrResources className="text-blue-600 text-2xl" />
            )}
            <h1>{menu.name}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
