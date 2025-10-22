import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { LiaUniversitySolid } from "react-icons/lia";
import { GrResources } from "react-icons/gr";
import { PiGraduationCapThin, PiUsersThree } from "react-icons/pi";
import { IoClose, IoMenu } from "react-icons/io5";
import { AuthContext } from "../Context/AuthContext";

const Sidebar = () => {
  const url = "/study/admin";
  const menus = [
    { name: "Dashboard", link: `${url}/dashboard` },
    { name: "Manage Users", link: `${url}/manageusers` },
    { name: "Manage Programme", link: `${url}/manageprogramme` },
    { name: "Manage Universities", link: `${url}/manageuniversities` },
    { name: "Manage Resources", link: `${url}/manageresources` },
  ];

  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleAdminMenu = () => {
    setAdminMenuOpen(!adminMenuOpen);
  };

  const { userDetails } = useContext(AuthContext);

  return (
    <div className="relative w-max md:h-screen dark:bg-[#0d1117]">
      {/* Desktop Admin menu */}
      <div className="hidden h-screen md:flex flex-col justify-center md:justify-start text-center gap-5 border-r-gray-300 border-b-gray-400 border-2 mt-5 py-5 px-2 w-max dark:border-gray-700  ">
        <div className="flex flex-col justify-center items-center gap-3">
          <img
            loading="lazy"
            src={
              userDetails?.profilepath
                ? `${import.meta.env.VITE_API_FILE_URL}${
                    userDetails.profilepath
                  }`
                : "/profile.png"
            }
            className="w-24 h-24 rounded-full object-cover"
          />
          <h2 className="text-gray-700 font-medium dark:text-gray-200">
            {userDetails?.username || "Easy Study Zone"}
          </h2>
          <h3 className="text-gray-600 dark:text-gray-400">
            {userDetails?.email}
          </h3>
        </div>
        <hr className="bg-gray-300 w-full px-1 h-[2px] rounded-full dark:bg-gray-700" />
        {menus.map((menu) => {
          const isActive = activeLink === menu.link;
          return (
            <Link
              to={menu.link}
              key={menu.name}
              className={`flex gap-2 items-center w-full px-3 py-3 rounded-2xl transition-all duration-300 shadow-xl border hover-supported:hover:text-darkGreen dark:hover:text-lightGreen
                ${
                  isActive
                    ? "text-lightGreen border-transparent dark:border-gray-700"
                    : "text-gray-700 border-yellow-50 dark:text-gray-300 dark:border-gray-700"
                }`}
            >
              {menu.name === "Dashboard" && <MdOutlineDashboard size={20} />}
              {menu.name === "Manage Users" && <PiUsersThree size={20} />}
              {menu.name === "Manage Programme" && (
                <PiGraduationCapThin size={20} />
              )}
              {menu.name === "Manage Universities" && (
                <LiaUniversitySolid size={20} />
              )}
              {menu.name === "Manage Resources" && <GrResources size={20} />}
              <h1 className="font-medium">{menu.name}</h1>
            </Link>
          );
        })}
      </div>

      {/* Mobile Admin Menu Toggle */}
      <button
        onClick={handleAdminMenu}
        className="md:hidden text-2xl fixed top-3 z-50 text-gray-800 dark:text-gray-200"
        aria-label="Toggle menu"
      >
        {adminMenuOpen ? (
          <IoClose size={25} className="text-red-500" />
        ) : (
          <IoMenu size={25} className="text-lightGreen" />
        )}
      </button>

      {/* Mobile Admin Menu */}
      <div
        className={`fixed left-0 top-16 z-50 border border-gray-300 h-screen backdrop-blur-lg flex flex-col items-start justify-start gap-5 px-2 py-10 shadow-lg transition-transform duration-500 md:hidden w-max dark:bg-dark dark:border-gray-700 ${
          adminMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-center items-center gap-3 w-full px-2">
          <img
            loading="lazy"
            src={
              userDetails?.profilepath
                ? `${import.meta.env.VITE_API_FILE_URL}${
                    userDetails.profilepath
                  }`
                : "/profile.png"
            }
            className="w-20 h-20 rounded-full object-cover"
          />
          <h2 className="text-gray-700 font-medium dark:text-gray-200">
            {userDetails?.username || "Easy Study Zone"}
          </h2>
          <h3 className="text-gray-600 dark:text-gray-400">
            {userDetails?.email}
          </h3>
        </div>
        <hr className="bg-gray-300 w-full px-1 h-1 rounded-full dark:bg-gray-700" />
        {menus.map((menu) => {
          const isActive = activeLink === menu.link;
          return (
            <Link
              to={menu.link}
              key={menu.name}
              onClick={() => setAdminMenuOpen(false)}
              className={`flex gap-2 items-center w-full px-3 py-2 rounded-xl transition-all duration-300 shadow-sm border hover-supported:hover:text-darkGreen dark:hover:text-lightGreen
                ${
                  isActive
                    ? "text-lightGreen border-lightGreen"
                    : "text-gray-700 border-yellow-50 dark:text-gray-300 dark:border-gray-700"
                }`}
            >
              {menu.name === "Dashboard" && <MdOutlineDashboard size={18} />}
              {menu.name === "Manage Users" && <PiUsersThree size={18} />}
              {menu.name === "Manage Programme" && (
                <PiGraduationCapThin size={18} />
              )}
              {menu.name === "Manage Universities" && (
                <LiaUniversitySolid size={18} />
              )}
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
