import { FaExclamationTriangle } from "react-icons/fa";

const NotAuthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <FaExclamationTriangle className="text-red-500 dark:text-red-400 text-6xl mb-4" />
      <h1 className="text-[5w] md:text-2xl font-bold text-textLight dark:text-textDark">
        403 - Not Authorized
      </h1>
      <p className="text-subTextLight dark:text-subTextDark px-1 text-lg">
        Access Denied
      </p>
    </div>
  );
};

export default NotAuthorized;
