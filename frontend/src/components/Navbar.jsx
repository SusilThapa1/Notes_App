import React, { useState } from "react";
import note from "./assets/note.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const logout = () => {
    localStorage.removeItem("auth-token");
    navigate("/");
  };

  const navlinks = [
    { name: "Home", link: "/" },
    { name: "Syllabus", link: "/syllabus" },
    { name: "Notes", link: "/notes" },
    { name: "Questions", link: "/questions" },
    { name: "Admin", link: "/admin" },
  ];
  const admin = true;
  return (
    <nav className="fixed top-0 z-50 w-full bg-gray-100 shadow-md   ">
      <div className=" relative flex items-center justify-between px-5 py-2 md:px-10 lg:px-20">
        <div className=" flex items-center gap-2">
          <button
            onClick={toggleMenu}
            className="absolute right-5  text-2xl md:hidden"
          >
            {menuOpen ? (
              <IoClose className="text-red-500" />
            ) : (
              <IoMenu className="text-green-600" />
            )}
          </button>
          <div className="flex justify-between md:justify-center md:flex-col items-center gap-2">
            <Link
              to="/"
              className="flex flex-col md:flex-row items-center md:gap-2"
            >
              <img src={note} alt="logo" className="w-10 rounded-[50%]" />
              <p className="hidden text-lg text-green-600 font-bold sm:block">
                Study
              </p>
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden gap-5 font-semibold md:flex">
          {navlinks.map((navlink, index) => (
            <li
              key={index}
              className={`cursor-pointer ${
                location.pathname === navlink.link ||
                (navlink.link !== "/" &&
                  location.pathname.startsWith(navlink.link))
                  ? "border-b-2 border-red-500"
                  : ""
              }`}
            >
              <Link to={navlink.link}>{navlink.name}</Link>
            </li>
          ))}
        </ul>

        {/* Cart & Login/Logout Buttons */}
        <div className={`  items-center gap-4 ${admin ? "flex" : "hidden"}`}>
          {localStorage.getItem("auth-token") ? (
            <button
              onClick={logout}
              className="hidden rounded-full bg-red-500 px-6 py-1 text-white hover:bg-red-700 md:block"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="hidden md:block">
              <button className="rounded-full bg-green-500 px-6 py-1 text-white hover:bg-[#26c939]">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <ul
        className={`absolute left-0 top-14 flex h-screen-minus-50 w-1/2 flex-col items-start justify-start gap-10 bg-gray-100 px-10 py-5 shadow-md transition-transform duration-500 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } `}
      >
        {navlinks.map((navlink, index) => (
          <li
            key={index}
            className={`py-2 text-lg font-medium ${
              location.pathname === navlink.link ||
              (navlink.link !== "/" &&
                location.pathname.startsWith(navlink.link)) === navlink.link
                ? "border-b-2 border-green-500"
                : ""
            }`}
          >
            <Link
              to={navlink.link}
              onClick={() => {
                toggleMenu(); // Close the menu when a navlink is clicked
              }}
            >
              {navlink.name}
            </Link>
          </li>
        ))}
        <div
          onClick={() => {
            toggleMenu();
          }}
        >
          {localStorage.getItem("auth-token") ? (
            <button
              onClick={logout}
              className="rounded bg-red-500 px-3 py-2 text-white hover:bg-green-700"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="w-full rounded-full bg-green-500 px-3 py-2 text-white hover:bg-[#26c939]">
                Login
              </button>
            </Link>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
