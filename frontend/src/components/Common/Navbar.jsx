import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoMenu, IoClose, IoMoon, IoSunny } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import {
  MdLockOutline,
  MdLogout,
  MdOutlineDashboard,
  MdOutlineDevices,
} from "react-icons/md";
import { HiOutlineUpload } from "react-icons/hi";
import { AuthContext } from "../Context/AuthContext";
import { ThemeContext } from "../Context/ThemeContext";
import { showConfirm } from "../../../Utils/alertHelper";

const Navbar = () => {
  const { logOut, userDetails, loading } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const location = useLocation();

  if (loading) return null;

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleAccountMenu = () => setAccountMenuOpen((prev) => !prev);

  const logout = async () => {
    const response = await showConfirm({ text: "You will be logged out" });
    if (response.isConfirmed) logOut(false, "Logged out successfully");
  };

  const baseLinks = [
    { name: "Home" },
    { name: "Syllabus" },
    { name: "Notes" },
    { name: "Questions" },
  ];

  const dropDownLink = [
    {
      to: "/user/profile",
      icon: <FaRegUser />,
      text: "My Profile",
    },
    {
      to: "/user/myuploads",
      icon: <HiOutlineUpload />,
      text: "My Uploads",
    },
    {
      to: "/user/change-password",
      icon: <MdLockOutline />,
      text: "Change Password",
    },
    {
      to: "/user/view-logins",
      icon: <MdOutlineDevices />,
      text: "View All Logins",
    },
    {
      to: "/user/deletemyaccount",
      icon: <FiAlertTriangle />,
      text: "Delete Account",
      danger: true,
    },
  ];

  if (userDetails?.role === "admin") {
    dropDownLink.unshift({
      to: "/admin/dashboard",
      icon: <MdOutlineDashboard />,
      text: "Admin Dashboard",
    });
  }

  const getPath = (name) =>
    name.toLowerCase() === "home" ? "/" : `/${name.toLowerCase()}`;
  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path));

  return (
    <nav className="fixed top-0 z-40 w-full bg-light dark:bg-dark shadow-sm border-b border-gray-700 transition-colors duration-300 ">
      <div className="relative backdrop-blur-lg flex items-center justify-between py-2 px-5 md:px-10 lg:px-20 h-16">
        {/* Logo & Mobile Button */}
        <div className="flex justify-center gap-5 items-center w-20  ">
          {userDetails && userDetails?.role !== "admin" && (
            <button
              onClick={toggleMenu}
              className="md:hidden text-2xl absolute left-5 text-textLight dark:text-textDark"
              aria-label="Toggle menu"
            >
              {menuOpen ? <IoClose size={25} /> : <IoMenu size={25} />}
            </button>
          )}

          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex flex-col md:flex-row items-center gap-2 ml-7 md:ml-0"
          >
            <img
              loading="lazy"
              src="/images/study3D21Copy.png"
              alt="logo"
              className="w-12 md:w-20 rounded-lg   shadow-xl"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        {userDetails && userDetails?.role !== "admin" && (
          <ul className="hidden md:flex gap-5 font-semibold text-textLight dark:text-textDark">
            {baseLinks.map(({ name }) => {
              const path = getPath(name);
              return (
                <li
                  key={path}
                  className={`relative cursor-pointer transition-all duration-500 ${
                    isActive(path)
                      ? "text-lightGreen "
                      : "hover:text-darkGreen "
                  }`}
                >
                  <Link to={path}>{name}</Link>
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-lightGreen transition-all duration-500 ${
                      isActive(path) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="text-lightGreen hover-supported:hover:text-darkGreen   dark:hover-supported:hover:text-darkGreen  transition-colors text-2xl"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <IoSunny title="switch to light mode" />
            ) : (
              <IoMoon title="switch to dark mode" />
            )}
          </button>

          {userDetails ? (
            <>
              <img
                loading="lazy"
                src={
                  userDetails?.profilepath
                    ? `${import.meta.env.VITE_API_FILE_URL}${
                        userDetails.profilepath
                      }`
                    : "/profile.png"
                }
                alt="profile"
                className="rounded-full object-cover h-10 w-10 md:h-12 md:w-12 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
              />
              <IoIosArrowDropdown
                size={25}
                onClick={toggleAccountMenu}
                className={`cursor-pointer text-lightGreen transition-transform hover-supported:hover:text-darkGreen ${
                  accountMenuOpen ? "rotate-180" : ""
                }`}
              />

              {/* Account Dropdown */}
              {accountMenuOpen && (
                <div className="absolute top-14 md:top-[62px] right-0 flex flex-col gap-3 items-start bg-light dark:bg-dark rounded-b-2xl border dark:border-gray-600 shadow-lg p-5 text-sm font-medium min-w-max z-40">
                  {dropDownLink.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setAccountMenuOpen(false)}
                      className={`flex items-center gap-2 w-full ${
                        link.danger
                          ? "hover:text-deleteHover text-textLight dark:text-textDark dark:hover:text-deleteHover"
                          : "hover:text-darkGreen text-textLight dark:text-textDark"
                      } transition-all`}
                    >
                      {link.icon}
                      <p>{link.text}</p>
                    </Link>
                  ))}

                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 text-deleteNormal hover:opacity-80 transition-all"
                  >
                    <MdLogout /> <p>Sign out</p>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-2 md:gap-4">
              <AuthButton to="/signup" text="Sign up" />
              <AuthButton to="/signin" text="Sign in" />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {userDetails && (
        <ul
          className={`absolute left-0 top-14 border border-gray-200 dark:border-gray-700 backdrop-blur-lg flex flex-col items-start gap-8 px-10 py-5 shadow-lg transition-transform duration-500 md:hidden h-screen w-1/2 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {baseLinks.map(({ name }) => {
            const path = getPath(name);
            return (
              <li
                key={path}
                onClick={() => setMenuOpen(false)}
                className={`font-semibold text-textLight dark:text-textDark ${
                  isActive(path) ? "text-lightGreen " : ""
                }`}
              >
                <Link to={path}>{name}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};

const AuthButton = ({ to, text }) => (
  <Link
    to={to}
    className="relative group border border-gray-200 dark:border-gray-600 text-center shadow-lg rounded-full px-3 py-1 min-w-max overflow-hidden transition-all duration-500 text-sm md:text-base"
  >
    <span className="absolute bottom-0 left-0 h-0 bg-lightGreen w-full group-hover:h-full transition-all duration-500 ease-in-out z-0"></span>
    <span className="relative z-10 text-textLight dark:text-textDark group-hover:text-white">
      {text}
    </span>
  </Link>
);

export default Navbar;
