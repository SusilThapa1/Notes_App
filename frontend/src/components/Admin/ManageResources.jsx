// ManageResources.jsx
import { useContext, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { HiOutlineUpload } from "react-icons/hi";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import Loader from "../Loader/Loader";
import UploadModal from "../Modal/UploadModal";
import Table from "./Table";

const ManageResources = () => {
  const [programSelected, setProgramSelected] = useState("");
  const [resourceSelected, setResourceSelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { uploads, programmeLists, loading, fetchAllData } =
    useContext(ProgrammesContext);

  const filteredUploads = uploads.filter(
    (upload) =>
      (programSelected
        ? upload.programmename?.toLowerCase() === programSelected.toLowerCase()
        : true) &&
      (resourceSelected
        ? upload.resources?.toLowerCase() === resourceSelected.toLowerCase()
        : true)
  );

  const syllabusUploads = filteredUploads.filter(
    (u) => u.resources === "syllabus"
  );
  const notesUploads = filteredUploads.filter((u) => u.resources === "notes");
  const questionsUploads = filteredUploads.filter(
    (u) => u.resources === "questions"
  );

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col items-center w-full overflow-y-auto scroll-container gap-5 bg-transparent dark:bg-dark shadow-sm mx-auto h-screen pb-5 px-3 pt-10">
      <h1 className="text-3xl font-medium text-center text-lightGreen dark:text-darkGreen">
        Resources List
      </h1>

      {/* Filter resource */}
      <div className="w-full max-w-5xl flex flex-col justify-between items-start md:items-center rounded-lg border border-gray-300 p-3 gap-4 mb-8   shadow-sm">
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="flex justify-center items-center gap-2 ">
            <FaFilter className="text-lg text-blue-600 dark:text-blue-400" />
            <h1 className="text-md font-bold dark:text-gray-200">Filter Box</h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-addNormal text-white px-4 py-2 rounded-lg hover:bg-addHover transition-all mt-2"
          >
            <HiOutlineUpload className="text-xl" />
            Upload Resource
          </button>
        </div>

        <div className="w-full flex md:flex-row flex-col justify-between items-start md:items-center gap-4">
          <select
            className="p-2 bg-light dark:bg-gray-900 border-2 border-slate-100 dark:border-gray-600 shadow-md rounded-md outline-none  dark:text-gray-200"
            value={programSelected}
            onChange={(e) => setProgramSelected(e.target.value)}
          >
            <option value="">Select Program</option>
            {programmeLists.map((programme, index) => (
              <option key={index} value={programme.programmefullname}>
                {programme.programmefullname}
              </option>
            ))}
          </select>

          <select
            className="p-2 bg-light dark:bg-gray-900 border-2 border-slate-100 dark:border-gray-600 shadow-md rounded-md outline-none  dark:text-gray-200"
            value={resourceSelected}
            onChange={(e) => setResourceSelected(e.target.value)}
          >
            <option value="">Select Resource Type</option>
            <option value="syllabus">Syllabus</option>
            <option value="notes">Notes</option>
            <option value="questions">Questions</option>
          </select>
        </div>
      </div>

      {/* Tables */}
      <div className="w-full max-w-7xl space-y-8">
        {syllabusUploads.length > 0 && (
          <div className="rounded-lg">
            <h2 className="text-xl font-semibold dark:text-gray-200">
              Syllabus
            </h2>
            <Table resource={syllabusUploads} />
          </div>
        )}

        {notesUploads.length > 0 && (
          <div className="rounded-lg">
            <h2 className="text-xl font-semibold dark:text-gray-200">Notes</h2>
            <Table resource={notesUploads} />
          </div>
        )}

        {questionsUploads.length > 0 && (
          <div className="rounded-lg">
            <h2 className="text-xl font-semibold dark:text-gray-200">
              Questions
            </h2>
            <Table resource={questionsUploads} />
          </div>
        )}
      </div>

      {isModalOpen && (
        <UploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          resource={resourceSelected}
          onUploadComplete={fetchAllData}
        />
      )}
    </div>
  );
};

export default ManageResources;
