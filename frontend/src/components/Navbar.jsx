import React, { useState, useContext } from "react";
import note from "/images/note.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import { logoutUser } from "../../Services/userService";
import { toast } from "react-toastify";
import { AuthContext } from "./context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { token, logout: contextLogout } = useContext(AuthContext);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const logout = async () => {
    try {
      const res = await logoutUser();
      if (res.success) {
        contextLogout();
        toast.success(res.message);
        navigate("/study/login/admin");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const navlinks = [
    { name: "Home", link: "/" },
    { name: "Syllabus", link: "/syllabus" },
    { name: "Notes", link: "/notes" },
    { name: "Questions", link: "/questions" },
  ];

  if (token) {
    navlinks.push({ name: "Admin", link: "/study/admin/dashboard" });
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-gray-200 shadow-md">
      <div className="relative flex items-center justify-between px-5 py-2 md:px-10 lg:px-20">
        <div className="flex items-center gap-2">
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
            className="absolute right-5 text-2xl text-gray-900 md:hidden"
          >
            {menuOpen ? <IoClose className="text-red-500" /> : <IoMenu />}
          </button>
          <div className="flex justify-between md:justify-center md:flex-col items-center gap-2">
            <Link
              to="/"
              className="flex flex-col md:flex-row w-fit items-center md:gap-2"
            >
              {/* Optimized Image */}
              <img
                className="w-10 rounded-full"
                src={note}
                alt="logo"
                loading="lazy"
                width="40"
                height="40"
              />
              <p className="hidden text-lg text-gray-900 font-bold md:block">
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
              className={`cursor-pointer text-gray-900 hover:text-green-700 ${
                location.pathname === navlink.link ||
                (navlink.link !== "/" &&
                  location.pathname.startsWith(navlink.link))
                  ? "text-green-500 font-bold"
                  : ""
              }`}
            >
              <Link to={navlink.link}>{navlink.name}</Link>
            </li>
          ))}
        </ul>

        {/* Login/Logout Buttons */}
        <div className="items-center gap-4">
          {token && (
            <button
              aria-label="logout"
              onClick={logout}
              className="hidden rounded-full bg-red-500 px-6 py-1 text-white hover:bg-red-700 md:block"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <ul
        className={`absolute left-0 top-14 flex h-screen-minus-50 w-1/2 flex-col items-start justify-start gap-10 bg-gray-200 px-10 py-5 shadow-md transition-transform duration-500 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-96"
        }`}
      >
        {navlinks.map((navlink, index) => (
          <li
            key={index}
            className={`py-2 text-lg font-medium text-gray-900 hover:text-green-700 ${
              location.pathname === navlink.link ||
              (navlink.link !== "/" &&
                location.pathname.startsWith(navlink.link))
                ? "text-green-500 font-bold"
                : ""
            }`}
          >
            <Link to={navlink.link} onClick={toggleMenu}>
              {navlink.name}
            </Link>
          </li>
        ))}
        <div onClick={toggleMenu}>
          {token && (
            <button
              aria-label="logout"
              onClick={logout}
              className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
