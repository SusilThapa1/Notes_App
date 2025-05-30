import { useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { FaGraduationCap, FaBook, FaCloudUploadAlt } from "react-icons/fa";
import BarChart from "./BarChart";
import { toast } from "react-toastify";
import { fetchAllUsers } from "../../../Services/userService";
import { useEffect } from "react";
import { useContext } from "react";
import { ProgrammesContext } from "../Context/ProgrammeContext";

const Analytics = () => {
  const [users, setUsers] = useState(10);
  // const [programmes, setProgrammes] = useState(5);
  // const [semesters, setUSemesters] = useState(36);
  // const [uploads, setUploads] = useState(20);
  const { programmeLists, semesterLists, uploads } =
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
  console.log(genderCounts);

  useEffect(() => {
    allUsers();
  }, []);

  // ✨ Prepare chart data
  const labels = Object.keys(genderCounts);
  const dataValues = Object.values(genderCounts);
  return (
    <div className="flex flex-col items-center w-full overflow-y-scroll scroll-container gap-5 bg-transparent shadow-sm mx-auto    md:pb-0 px-2 pt-10">
      {/* Dashboard Header */}
      <div className="text-center mb-10">
        <h1 className="  font-bold text-gray-800 mb-2">
          Admin Analytics Dashboard
        </h1>
        <p className="text-gray-600  ">
          Here's a quick overview of your platform’s performance and activity.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12">
        <div className="bg-transparent shadow-lg p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition duration-500 hover:scale-105">
          <FaUsers className="text-3xl md:text-5xl text-gray-500" />
          <h1 className="font-semibold text-green-600 ">Users</h1>
          <span className=" font-bold text-gray-700">
            Total: {users.length}
          </span>
        </div>

        <div className="bbg-transparent shadow-lg p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition duration-500 hover:scale-105">
          <FaGraduationCap className="text-3xl md:text-5xl text-blue-500" />
          <h1 className="font-semibold text-green-600 ">Programmes</h1>
          <span className=" font-bold text-gray-700">
            Total: {programmeLists.length}
          </span>
        </div>

        <div className="bg-transparent shadow-lg p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition duration-500 hover:scale-105">
          <FaBook className="text-3xl md:text-5xl text-yellow-500" />
          <h1 className="font-semibold text-green-600 ">Semesters/Years</h1>
          <span className=" font-bold text-gray-700">
            Total: {semesterLists.length}
          </span>
        </div>

        <div className="bg-transparent shadow-lg p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition duration-500 hover:scale-105">
          <FaCloudUploadAlt className="text-3xl md:text-5xl text-sky-600" />
          <h1 className="font-semibold text-green-600 ">Uploads</h1>
          <span className=" font-bold text-gray-700">
            Total: {uploads.length}
          </span>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="w-full bg-transparent rounded-xl shadow-lg p-6 h-max mx-auto">
        <h2 className=" text-center underline font-semibold text-gray-800 mb-4">
          Chart Showing Users by Gender{" "}
        </h2>
        <BarChart labels={labels} dataValues={dataValues} />
      </div>
    </div>
  );
};

export default Analytics;
