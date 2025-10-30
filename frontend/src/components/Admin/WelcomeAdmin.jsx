import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import Analytics from "./Analytics";
import { AiOutlineFileSearch } from "react-icons/ai";
import { IoAnalytics } from "react-icons/io5";
import { PiGraduationCap } from "react-icons/pi";

const WelcomeAdmin = () => {
  const { userDetails, greeting } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center scroll-container w-full pt-8 h-full overflow-scroll bg-transparent mx-auto pb-10 px-5 text-textLight dark:text-textDark dark:bg-dark transition-colors duration-300">
      {/* Welcome Message */}
      <div className="flex flex-col justify-center items-center gap-2 text-justify md:text-center mb-8">
        <div className="flex flex-col gap-5 justify-center items-center text-[5vw] md:text-3xl text-center font-bold mb-4 text-lightGreen">
          <h1>
            {userDetails?.username
              ? `${greeting}, ${userDetails.username.split(" ")[0]}!`
              : ""}
          </h1>
          <p>Welcome to the Admin Panel</p>
        </div>
        <div className="mx-auto flex flex-col justify-center items-center">
          <p className="text-lg mb-6 text-subTextLight dark:text-subTextDark">
            Monitor platform activity, manage users, and oversee content
            uploaded by students across Nepal's universities.
          </p>
          <p className="text-lg max-w-lg mb-8 text-subTextLight dark:text-subTextDark">
            As the administrator, you can manage user accounts, moderate
            content, view platform analytics, and ensure quality educational
            resources.
          </p>
        </div>
      </div>

      {/* Admin Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {/* Manage Users */}
        <div className="bg-light dark:bg-gray-900 p-6 border border-yellow-50 dark:border-gray-800 rounded-2xl shadow-md flex flex-col items-center justify-center text-center transition-all duration-300">
          <PiGraduationCap className="text-blue-500 w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-lightGreen">
            Manage Users
          </h3>
          <p className="text-subTextLight dark:text-subTextDark">
            View and manage student accounts across all universities.
          </p>
        </div>

        {/* Content Moderation */}
        <div className="bg-light dark:bg-gray-900 p-6 border border-yellow-50 dark:border-gray-800 rounded-2xl shadow-md flex flex-col items-center justify-center text-center transition-all duration-300">
          <AiOutlineFileSearch className="text-yellow-500 w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-lightGreen">
            Content Moderation
          </h3>
          <p className="text-subTextLight dark:text-subTextDark">
            Review and manage uploaded study materials.
          </p>
        </div>

        {/* Platform Analytics */}
        <div className="bg-light dark:bg-gray-900 p-6 border border-yellow-50 dark:border-gray-800 rounded-2xl shadow-md flex flex-col items-center justify-center text-center transition-all duration-300">
          <IoAnalytics className="text-red-500 w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-lightGreen">
            Platform Analytics
          </h3>
          <p className="text-subTextLight dark:text-subTextDark">
            View usage statistics and platform insights.
          </p>
        </div>
      </div>

      <Analytics />
    </div>
  );
};

export default WelcomeAdmin;
