import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { fetchAllUsers } from "../../../Services/userService";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import { PiGraduationCapThin, PiUsersThree } from "react-icons/pi";
import { SlCloudUpload } from "react-icons/sl";
import { LiaUniversitySolid } from "react-icons/lia";
import BarChart from "./BarChart";

const Analytics = () => {
  const [users, setUsers] = useState(null);
  const { programmeLists, universityLists, uploads } =
    useContext(ProgrammesContext);
  const [genderCounts, setGenderCounts] = useState({});

  const allUsers = async () => {
    try {
      const res = await fetchAllUsers();
      if (res.success) {
        setUsers(res.data);
        const counts = res.data.reduce((acc, user) => {
          const gender = user.gender;
          acc[gender] = (acc[gender] || 0) + 1;
          return acc;
        }, {});
        setGenderCounts(counts);
      } else {
        toast.error(res?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    allUsers();
  }, []);

  const labels = Object.keys(genderCounts);
  const dataValues = Object.values(genderCounts);

  return (
    <div className="flex flex-col items-center w-full gap-5 px-2 py-10 text-textLight dark:text-textDark transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-lg font-bold text-textLight dark:text-textDark mb-2">
          Platform Analytics
        </h1>
        <p className="text-subTextLight dark:text-subTextDark">
          Get insights into users, programmes, semesters, and uploads.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12 w-full">
        <div className="bg-light dark:bg-gray-900 border border-yellow-50 dark:border-gray-800 shadow-lg p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:scale-105 transition duration-300">
          <PiUsersThree className="text-3xl md:text-5xl text-gray-500" />
          <h1 className="font-semibold text-lightGreen">Users</h1>
          <span className="font-bold text-subTextLight dark:text-subTextDark">
            Total: {users?.length}
          </span>
        </div>

        <div className="bg-light dark:bg-gray-900 border border-yellow-50 dark:border-gray-800 shadow-lg p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:scale-105 transition duration-300">
          <PiGraduationCapThin className="text-3xl md:text-5xl text-blue-500" />
          <h1 className="font-semibold text-lightGreen">Programmes</h1>
          <span className="font-bold text-subTextLight dark:text-subTextDark">
            Total: {programmeLists?.length}
          </span>
        </div>

        <div className="bg-light dark:bg-gray-900 border border-yellow-50 dark:border-gray-800 shadow-lg p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:scale-105 transition duration-300">
          <LiaUniversitySolid className="text-3xl md:text-5xl text-yellow-500" />
          <h1 className="font-semibold text-lightGreen">University</h1>
          <span className="font-bold text-subTextLight dark:text-subTextDark">
            Total: {universityLists?.length}
          </span>
        </div>

        <div className="bg-light dark:bg-gray-900 border border-yellow-50 dark:border-gray-800 shadow-lg p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:scale-105 transition duration-300">
          <SlCloudUpload className="text-3xl md:text-5xl text-sky-600" />
          <h1 className="font-semibold text-lightGreen">Uploads</h1>
          <span className="font-bold text-subTextLight dark:text-subTextDark">
            Total: {uploads?.length}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex flex-col justify-center items-center w-full p-6 md:h-[65vh]">
        <h2 className="text-center underline font-semibold text-textLight dark:text-textDark mb-4">
          Chart Showing Users by Gender
        </h2>
        <BarChart labels={labels} dataValues={dataValues} />
      </div>
    </div>
  );
};

export default Analytics;
