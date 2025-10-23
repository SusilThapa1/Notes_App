import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-5">
        <FaExclamationTriangle className="text-[5w] md:text-6xl text-red-500 dark:text-red-400" />
      
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className=" font-bold text-red-500 dark:text-red-400">404 - Not Found</h1>
        <p className=" font-bold text-xl text-textLight dark:text-textDark tracking-widest">
          Look like you're lost
        </p>
        <p className="text-subTextLight dark:text-subTextDark px-1 text-lg">
          the page you are looking for does not exist.
        </p>
      </div>
      <Link
        to="/"
        className="border-slate-100  bg-lightGreen dark:bg-darkGreen hover-supported:hover:bg-darkGreen dark:hover-supported:hover:bg-green-700  shadow-lg rounded-lg px-3 py-2 text-white"
      >
        Go to home page
      </Link>
    </div>
  );
};

export default PageNotFound;
