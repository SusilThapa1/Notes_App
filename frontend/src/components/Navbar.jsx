import { useState, useContext } from "react";
import { FaRegUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import { IoIosArrowDropdown } from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";
import { MdLockOutline, MdLogout } from "react-icons/md";

import { AuthContext } from "./Context/AuthContext";
import Swal from "sweetalert2";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpenAccountDetails, setIsOpenAccountDetails] = useState(false);
  const location = useLocation();

  const { token, logOut, userDetails } = useContext(AuthContext);
  const openAccountMenu = () => setIsOpenAccountDetails(!isOpenAccountDetails);

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
      background: "#E2E8F0",
      scrollbarPadding: false,
      customClass: {
        popup: "text-base sm:text-lg md:text-xl",
        title: "text-xl sm:text-2xl md:text-3xl font-semibold",
        confirmButton:
          "text-sm sm:text-base md:text-lg bg-blue-600 text-white px-4 py-2 rounded",
        cancelButton:
          "text-sm sm:text-base md:text-lg bg-gray-400 text-white px-4 py-2 rounded",
      },
    });

    if (!response.isConfirmed) return;
    logOut(false, "Logged out successfully");
  };

  const navlinks = [
    { name: "Home", link: "/" },
    { name: "Syllabus", link: "/study/syllabus" },
    { name: "Notes", link: "/study/notes" },
    { name: "Questions", link: "/study/questions" },
  ];

  if (
    token &&
    userDetails?.isAccountVerified &&
    userDetails?.role === "admin"
  ) {
    navlinks.push({ name: "Admin", link: "/study/admin/dashboard" });
  }

  return (
    <nav className="fixed top-0 z-50 w-full  bg-transparent  shadow-sm border  border-slate-100">
      <div className="relative backdrop-blur-sm flex items-center justify-between px-5 py-2 md:px-10 lg:px-20 z-20">
        <div className="flex justify-center gap-5 items-center w-28 md:w-auto">
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
            className="absolute left-5 text-2xl text-gray-800 md:hidden "
          >
            {menuOpen ? (
              <IoClose size={25} className="text-red-500 " />
            ) : (
              <IoMenu size={25} className=" text-[#5CAE59] " />
            )}
          </button>
          <div className="flex justify-between md:justify-center md:flex-col items-center gap-2 ml-7 md:ml-0">
            <Link
              to="/"
              className="flex flex-col md:flex-row w-fit items-center md:gap-2"
            >
              <img
                onClick={() => window.scroll(0, 0)}
                className="w-12 md:w-20 rounded-lg  shadow-xl bg-transparent border-2 border-gray-200"
                src="/images/study3D21Copy.png"
                alt="logo"
                loading="lazy"
              />
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}

        <ul className="hidden gap-5 font-semibold md:flex">
          {navlinks.map((navlink, index) => {
            const isActive =
              location.pathname === navlink.link ||
              (navlink.link !== "/" &&
                location.pathname.startsWith(navlink.link));

            return (
              <li
                onClick={() => window.scroll(0, 0)}
                key={index}
                className={`group relative cursor-pointer font-semibold  transition-all duration-500 ${
                  isActive ? " text-[#5CAE59]" : "hover:text-green-500"
                }`}
              >
                <Link to={navlink.link}>{navlink.name}</Link>
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-green-600 transition-all duration-500 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </li>
            );
          })}
        </ul>
        {!token || !userDetails?.isAccountVerified ? (
          <div className="flex items-center justify-between gap-5">
            <Link
              to="/study/signup"
              className="relative group border   border-slate-100 hover-supported:hover:border-transparent  text-center shadow-lg rounded-full px-3 py-1 min-w-max overflow-hidden transition-colors duration-500"
            >
              <span className="absolute bottom-0 left-0 h-0 bg-[#5CAE59]   w-full hover-supported:group-hover:h-full transition-all duration-500 ease-in-out z-0"></span>

              <span className="relative z-10 hover-supported:group-hover:text-white">
                Sign up
              </span>
            </Link>
            <Link
              to="/study/signin"
              className="relative group border border-slate-100   hover-supported:hover:border-transparent  text-center shadow-lg rounded-full px-3 py-1 min-w-max overflow-hidden transition-colors duration-500"
            >
              <span className="absolute bottom-0 left-0 h-0 bg-[#5CAE59] w-full hover-supported:group-hover:h-full transition-all duration-500 ease-in-out z-0"></span>

              <span className="relative z-10 hover-supported:group-hover:text-white">
                Sign in
              </span>
            </Link>
          </div>
        ) : (
          <div className=" flex items-center justify-between gap-5">
            <img
              className={`rounded-full object-cover h-10 w-10 md:w-12 md:h-12 border-2 ${
                userDetails?.profilepath ? "border-gray-300" : ""
              } relative z-30  shadow-lg`}
              src={
                token ? userDetails?.profilepath || "/prof.webp" : "/prof.webp"
              }
              alt="profile"
              loading="lazy"
              width="40"
              height="40"
            />
            <div>
              <IoIosArrowDropdown
                onClick={openAccountMenu}
                size={25}
                className={`relative cursor-pointer  text-[#5CAE59]      ${
                  isOpenAccountDetails ? " text-[#5CAE59]" : ""
                } z-30`}
              />

              {/* Dropdown Menu */}
              <div
                className={`${
                  isOpenAccountDetails ? "flex" : "hidden"
                } absolute top-14 md:top-[62px]    right-0 font-medium rounded-b-2xl border  bg-gray-200  flex-col min-w-max p-5 gap-3 justify-center items-center z-40 transition-all duration-500  shadow-lg text-sm  `}
              >
                <Link
                  onClick={openAccountMenu}
                  to="/study/userprofile"
                  className="w-full flex items-center gap-3 hover-supported:hover:text-[#5CAE59] active:text-[#5CAE59] focus:text-[#5CAE59]"
                >
                  <FaRegUser />
                  <p>View Profile</p>
                </Link>
                {token && (
                  <div className="flex flex-col justify-center items-center gap-3">
                    <Link
                      onClick={openAccountMenu}
                      to="/study/user/change-password"
                      className="w-full hover-supported:hover:text-[#5CAE59] active:text-[#5CAE59] flex justify-center gap-2 items-center"
                    >
                      <MdLockOutline title="sign out" />
                      <p>Change Password</p>
                    </Link>
                    <Link
                      onClick={openAccountMenu}
                      to="/study/user/deletemyaccount"
                      className="w-full  hover-supported:hover:text-red-600 active:text-red-600 flex gap-2 items-center"
                    >
                      <FiAlertTriangle />
                      <p>Delete My Account</p>
                    </Link>
                    <button
                      aria-label="sign out"
                      onClick={() => {
                        openAccountMenu();
                        logout();
                      }}
                      className="w-full text-red-600 flex gap-2 items-center"
                    >
                      <MdLogout />
                      <p>Sign out</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <ul
        className={`absolute left-0 top-14 border border-r-yellow-50   backdrop-blur-sm flex h-screen-minus-50 w-1/2 flex-col items-start justify-start gap-10 px-10 py-5  shadow-lg transition-transform duration-500 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navlinks.map((navlink, index) => {
          const isActive =
            location.pathname === navlink.link ||
            (navlink.link !== "/" &&
              location.pathname.startsWith(navlink.link));

          return (
            <li
              onClick={() => setMenuOpen(false)}
              key={index}
              className={`group relative active:text-green-500 font-semibold text-gray-800 transition-all duration-500 ${
                isActive ? " text-[#5CAE59]" : " "
              }`}
            >
              <Link to={navlink.link}>{navlink.name}</Link>
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-green-600 transition-all duration-500 ${
                  isActive ? "w-full" : "w-0 "
                }`}
              ></span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
