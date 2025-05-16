import React, { useState } from "react";
import { GrResources } from "react-icons/gr";
import { FaBook, FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdFileUpload } from "react-icons/md";

const Sidebar = () => {
  const url = "/study/admin/dashboard";
  const menus = [
    { name: "Manage Programme", link: `${url}/manageprogramme` },
    { name: "Manage Semesters", link: `${url}/managesemester` },
    { name: "Upload Resources", link: `${url}/uploadresources` },
    { name: "Manage Resources", link: `${url}/manageresources` },
  ];

  const [activeLink, setActiveLink] = useState("");

  const handleClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className=" gap-5 md:flex md:flex-col justify-center md:justify-start grid grid-cols-2 w-full text-center md:gap-5 border-r-gray-400 border-b-gray-400 md:border-2 pt-10  md:px-2">
      {menus.map((menu) => (
        <Link
          to={menu.link}
          key={menu.name}
          className={`flex gap-2 items-center justify-center bg-transparent hover-supported:hover:animate-pulse  shadow-lg border-[2px]  border-slate-100 p-2 rounded-lg hover-supported:hover:text-green-500 ${
            activeLink === menu.link
              ? "bg-blue-200 animate-bounce  text-green-600"
              : ""
          }`}
          onClick={() => handleClick(menu.link)}
        >
          {/* Choose icon based on the menu */}
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
  );
};

export default Sidebar;
