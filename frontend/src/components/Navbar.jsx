import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { MdLockOutline, MdLogout, MdOutlineDevices } from "react-icons/md";
import { HiOutlineUpload } from "react-icons/hi";
import { AuthContext } from "./Context/AuthContext";
import { showConfirm } from "../../Utils/alertHelper";
import { IoIosArrowDropdown } from "react-icons/io";

const Navbar = () => {
  const { logOut, userDetails, loading } = useContext(AuthContext);
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

  // Define links based on role
  const baseLinks = [
    { name: "Home", link: "/" },
    { name: "Syllabus", link: "/study/syllabus" },
    { name: "Notes", link: "/study/notes" },
    { name: "Questions", link: "/study/questions" },
  ];

  if (userDetails?.isAccountVerified && userDetails?.role === "admin") {
    baseLinks.push({ name: "Admin", link: "/study/admin/dashboard" });
  }

  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path));

  return (
    <nav className="fixed top-0 z-50 w-full bg-transparent shadow-sm border border-slate-100">
      <div className="relative backdrop-blur-sm flex items-center justify-between px-5 py-2 md:px-10 lg:px-20">
        {/* Logo and Mobile Menu Button */}
        <div className="flex justify-center gap-5 items-center w-28 md:w-auto">
          {userDetails && (
            <button
              onClick={toggleMenu}
              className="md:hidden text-2xl absolute left-5 text-gray-800"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <IoClose size={25} className="text-red-500" />
              ) : (
                <IoMenu size={25} className="text-lightGreen" />
              )}
            </button>
          )}

          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex flex-col md:flex-row items-center gap-2 ml-7 md:ml-0"
          >
            <img
              src="/images/study3D21Copy.png"
              alt="logo"
              loading="lazy"
              className="w-12 md:w-20 rounded-lg border-2 border-gray-200 shadow-xl"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        {userDetails && (
          <ul className="hidden md:flex gap-5 font-semibold">
            {baseLinks.map((navlink) => (
              <li
                key={navlink.link}
                className={`relative cursor-pointer transition-all duration-500 ${
                  isActive(navlink.link)
                    ? "text-lightGreen"
                    : "hover:text-green-500"
                }`}
              >
                <Link to={navlink.link}>{navlink.name}</Link>
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-lightGreen transition-all duration-500 ${
                    isActive(navlink.link) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </li>
            ))}
          </ul>
        )}

        {/* Right side - Profile or Auth */}
        {userDetails ? (
          <div className="flex items-center gap-4">
            <img
              src={
                userDetails?.profilepath
                  ? `${import.meta.env.VITE_API_FILE_URL}${
                      userDetails.profilepath
                    }`
                  : "/prof.webp"
              }
              alt="profile"
              className="rounded-full object-cover h-10 w-10 md:h-12 md:w-12 border-2 border-gray-300 shadow-lg"
            />
            <IoIosArrowDropdown
              size={25}
              onClick={toggleAccountMenu}
              className={`cursor-pointer text-lightGreen transition-transform ${
                accountMenuOpen ? "rotate-180" : ""
              }`}
            />

            {/* Account Dropdown */}
            {accountMenuOpen && (
              <div className="absolute top-14 md:top-[62px] right-0 flex flex-col gap-3 items-start bg-gray-200 rounded-b-2xl border shadow-lg p-5 text-sm font-medium min-w-max z-40">
                <DropdownLink
                  to="/study/userprofile"
                  icon={<FaRegUser />}
                  text="My Profile"
                />
                <DropdownLink
                  to="/study/myuploads"
                  icon={<HiOutlineUpload />}
                  text="My Uploads"
                />
                <DropdownLink
                  to="/study/user/change-password"
                  icon={<MdLockOutline />}
                  text="Change Password"
                />
                <DropdownLink
                  to="/study/user/view-logins"
                  icon={<MdOutlineDevices />}
                  text="View All Logins"
                />
                <DropdownLink
                  to="/study/user/deletemyaccount"
                  icon={<FiAlertTriangle />}
                  text="Delete Account"
                  danger
                />
                <button
                  onClick={() => {
                    toggleAccountMenu();
                    logout();
                  }}
                  className="flex items-center gap-2 text-red-600 hover:opacity-80 transition-all"
                >
                  <MdLogout /> <p>Sign out</p>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-4">
            <AuthButton to="/study/signup" text="Sign up" />
            <AuthButton to="/study/signin" text="Sign in" />
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {userDetails && (
        <ul
          className={`absolute left-0 top-14 border border-r-yellow-50 backdrop-blur-sm flex flex-col items-start gap-8 px-10 py-5 shadow-lg transition-transform duration-500 md:hidden h-screen w-1/2 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {baseLinks.map((navlink) => (
            <li
              key={navlink.link}
              onClick={() => setMenuOpen(false)}
              className={`font-semibold text-gray-800 ${
                isActive(navlink.link) ? "text-lightGreen" : ""
              }`}
            >
              <Link to={navlink.link}>{navlink.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

// 🔹 Small helper for account dropdown
const DropdownLink = ({ to, icon, text, danger }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 w-full ${
      danger
        ? "hover-supported:hover:text-red-700"
        : "hover-supported:hover:text-lightGreen text-gray-800"
    } transition-all`}
  >
    {icon}
    <p>{text}</p>
  </Link>
);

// 🔹 Small helper for Auth buttons (Sign up / Sign in)
const AuthButton = ({ to, text }) => (
  <Link
    to={to}
    className="relative group border border-slate-100 text-center shadow-lg rounded-full px-3 py-1 min-w-max overflow-hidden transition-all duration-500"
  >
    <span className="absolute bottom-0 left-0 h-0 bg-lightGreen w-full group-hover:h-full transition-all duration-500 ease-in-out z-0"></span>
    <span className="relative z-10 group-hover:text-white">{text}</span>
  </Link>
);

export default Navbar;
