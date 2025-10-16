import { useState } from "react";
import { FaUsers } from "react-icons/fa6";
import {
  FaGraduationCap,
  FaCloudUploadAlt,
  FaRegCalendarAlt,
} from "react-icons/fa";
import BarChart from "./BarChart";
import { toast } from "react-toastify";
import { fetchAllUsers } from "../../../Services/userService";
import { useEffect } from "react";
import { useContext } from "react";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import Loader from "../Loader/Loader";

const Analytics = () => {
  const [users, setUsers] = useState(null);

  const { programmeLists, semesterLists, uploads, loading } =
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

  // ✨ Prepare chart data
  const labels = Object.keys(genderCounts);
  const dataValues = Object.values(genderCounts);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center w-full  gap-5    px-2 py-10">
      {/* Dashboard Header */}
      <div className="text-center mb-10">
        <h1 className="text-lg font-bold text-gray-800 mb-2">
          Platform Analytics
        </h1>
        <p className="text-gray-600  ">
          Get insights into users, programmes, semesters, and uploads.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12 w-full">
        <div className="bg-transparent shadow-lg p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition duration-500 hover:scale-105">
          <FaUsers className="text-3xl md:text-5xl text-gray-500" />
          <h1 className="font-semibold text-green-600 ">Users</h1>
          <span className=" font-bold text-gray-700">
            Total: {users?.length}
          </span>
        </div>

        <div className="bbg-transparent shadow-lg p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition duration-500 hover:scale-105">
          <FaGraduationCap className="text-3xl md:text-5xl text-blue-500" />
          <h1 className="font-semibold text-green-600 ">Programmes</h1>
          <span className=" font-bold text-gray-700">
            Total: {programmeLists?.length}
          </span>
        </div>

        <div className="bg-transparent shadow-lg p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition duration-500 hover:scale-105">
          <FaRegCalendarAlt className="text-3xl md:text-5xl text-yellow-500" />
          <h1 className="font-semibold text-green-600 ">Semesters/Years</h1>
          <span className=" font-bold text-gray-700">
            Total: {semesterLists?.length}
          </span>
        </div>

        <div className="bg-transparent shadow-lg p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition duration-500 hover:scale-105">
          <FaCloudUploadAlt className="text-3xl md:text-5xl text-sky-600" />
          <h1 className="font-semibold text-green-600 ">Uploads</h1>
          <span className=" font-bold text-gray-700">
            Total: {uploads?.length}
          </span>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className=" flex justify-center items-center  flex-col w-full   p-6   md:h-[65vh]  ">
        <h2 className=" text-center underline font-semibold text-gray-800 mb-4">
          Chart Showing Users by Gender{" "}
        </h2>
        <BarChart labels={labels} dataValues={dataValues} />
      </div>
    </div>
  );
};

export default Analytics;
