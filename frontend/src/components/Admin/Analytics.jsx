import { useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { FaGraduationCap, FaBook, FaCloudUploadAlt } from "react-icons/fa";

const Analytics = () => {
  const [users, setUsers] = useState(10);
  const [programmes, setProgrammes] = useState(5);
  const [semesters, setUSemesters] = useState(36);
  const [uploads, setUploads] = useState(20);
  return (
    <div className="flex flex-col items-center  w-full max-w-6xl mt-7  pb-10 md:pb-0  overflow-y-scroll scroll-container bg-transparent shadow-sm mx-auto h-[calc(100vh-200px)] md:h-[calc(100vh-75px)]">
      <div className="grid  md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="flex flex-col justify-center items-center gap-5">
          <FaUsers className="text-3xl md:text-5xl text-gray-500" />
          <h1 className="font-semibold text-green-600">
            Total Users: {users}{" "}
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <FaGraduationCap className="text-5xl text-blue-500" />
          <h1 className="font-semibold text-green-600">
            Total Programmes: {programmes}{" "}
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <FaBook className="text-3xl md:text-5xl text-yellow-500" />
          <h1 className="font-semibold text-green-600">
            Total Semasters/Years: {semesters}{" "}
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <FaCloudUploadAlt className="text-3xl md:text-5xl text-sky-600" />
          <h1 className="font-semibold text-green-600">
            Total Uploaded Links: {uploads}{" "}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
