import React, { useState, useContext } from "react";
import note from "/images/note.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import { MdLogin, MdLogout } from "react-icons/md";
import { logoutUser } from "../../Services/userService";
import { toast } from "react-toastify";
import { AuthContext } from "./Context/AuthContext";
import Swal from "sweetalert2";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    token,
    logout: contextLogout,
    user,
    userDetails,
  } = useContext(AuthContext);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const logout = async () => {
    const response = await Swal.fire({
      title: "Are you sure, you want to log out?",
      text: "You have to use your credentials if you want to login again!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#49bb0f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      width: "400px",
      background: "#f4f6f8",
    });

    if (!response.isConfirmed) return;
    try {
      const res = await logoutUser();
      if (res.success) {
        contextLogout();
        toast.success(res.message);
        navigate("/study/admin/login");
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
    <nav className="fixed top-0 z-50 w-full bg-gray-300 shadow-md">
      <div className="relative flex items-center justify-between px-5 py-2 md:px-10 lg:px-20">
        <div className="flex items-center gap-2">
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
            className="absolute left-5 text-2xl text-gray-900 md:hidden"
          >
            {menuOpen ? <IoClose className="text-red-500" /> : <IoMenu />}
          </button>
          <div className="flex justify-between md:justify-center md:flex-col items-center gap-2 ml-7 md:ml-0">
            <Link
              to="/"
              className="flex flex-col md:flex-row w-fit items-center md:gap-2"
            >
              <img
                className="md:w-14 rounded-full"
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
                  ? "text-green-600 font-bold"
                  : ""
              }`}
            >
              <Link to={navlink.link}>{navlink.name}</Link>
            </li>
          ))}
        </ul>

        <div className="group relative ml-7 md:ml-0 rounded-full  ">
          <img
            className="rounded-full relative object-cover h-10 w-10 md:w-12 md:h-12 border-2 border-gray-400 z-10 "
            src={
              token ? userDetails?.profilepath || "/prof.webp" : "/prof.webp"
            }
            alt="profile"
            loading="lazy"
            width="40"
            height="40"
          />
          <div className=" hidden absolute top-10 right-[-20px] md:right-[-40px] font-medium bg-gray-300 rounded-b-md group-hover:flex flex-col min-w-max p-5 gap-3 justify-center items-center shadow-md ">
            <Link to="/study/userprofile" className="w-full">
              View Profile
            </Link>
            {token ? (
              <button
                onClick={logout}
                className="w-full text-red-600 flex justify-center gap-2 items-center"
              >
                <MdLogout title="sign out" className="" />
                <p>Sign out</p>
              </button>
            ) : (
              <Link
                to="study/admin/login"
                className={`${
                  token ? "flex" : "hidden"
                } w-full   text-red-600   justify-center gap-2 items-center`}
              >
                <p>Sign in</p>
                <MdLogin title="sign out" className="" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <ul
        className={`absolute left-0 top-14 flex h-screen-minus-50 w-1/2 flex-col items-start justify-start gap-10 bg-gray-300 px-10 py-5 shadow-md transition-transform duration-500 md:hidden ${
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
      </ul>
    </nav>
  );
};

export default Navbar;
