import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-5">
      <div className="flex justify-center items-center gap-5 text-red-500 text-[5w] md:text-6xl">
        <FaExclamationTriangle className="  mb-4" />
        <h1 className=" font-bold">404</h1>
      </div>
      <div className="flex flex-col justify-center items-center gap-5">
        <p className=" font-bold text-xl text-gray-700 tracking-widest">
          Look like you're lost
        </p>
        <p className="text-gray-600 px-1 text-lg">
          the page you are looking for does not exist.
        </p>
      </div>
      <Link
        to="/"
        className="border-slate-100 bg-green-600 hover-supported:hover:bg-[#5CAE59]  shadow-lg rounded-lg px-3 py-2 text-white"
      >
        Go to home page
      </Link>
    </div>
  );
};

export default PageNotFound;
