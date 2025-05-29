import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { deleteUpload } from "../../../Services/uploadService";
import { FaFilter } from "react-icons/fa";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import Table from "./Table";
import Loader from "../Loader";

const ManageResources = () => {
  const [programSelected, setProgramSelected] = useState("");
  const [resourceSelected, setResourceSelected] = useState("");

  const { uploads, programmeLists, loading } = useContext(ProgrammesContext);

  // Filter the uploadList based on selected program, resource
  const filteredUploads = uploads.filter(
    (upload) =>
      (programSelected ? upload.programmename === programSelected : true) &&
      (resourceSelected ? upload.resources === resourceSelected : true)
  );

  // Separate resources into different categories
  const syllabusUploads = filteredUploads.filter(
    (upload) => upload.resources === "syllabus"
  );
  const notesUploads = filteredUploads.filter(
    (upload) => upload.resources === "notes"
  );
  const questionsUploads = filteredUploads.filter(
    (upload) => upload.resources === "questions"
  );
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center w-full overflow-y-scroll scroll-container gap-5 bg-transparent shadow-sm mx-auto h-[calc(100vh-200px)] md:h-[calc(100vh-65px)] pb-10 md:pb-0 px-2 pt-10">
      <h1 className="text-3xl font-medium text-center    text-[#5CAE59]">
        Resources List
      </h1>

      {/* Program selection and resource type selection */}
      <div className="w-full flex  flex-col justify-between items-start md:items-center rounded-lg border  border-green-50  p-2 gap-4 mb-5 md:mb-10">
        <div className="flex justify-center items-center w-full">
          <FaFilter className="text-lg text-blue-600" />
          <h1 className="text-md font-bold ">Filter Box </h1>
        </div>
        <div className="w-full flex md:flex-row flex-col justify-between items-start md:items-center gap-5">
          {/* Program selection */}
          <select
            className="p-2 bg-transparent border-2   border-slate-100  shadow-lg rounded-md  outline-slate-200 w-full md:w-auto"
            value={programSelected}
            onChange={(e) => setProgramSelected(e.target.value)}
          >
            <option value="">Select Program</option>
            {programmeLists.map((programme, index) => (
              <option key={index} value={programme.programmeshortname}>
                {" "}
                {programme.programmeshortname}
              </option>
            ))}
          </select>

          {/* Resource type selection */}
          <select
            className="p-2 bg-transparent rounded-md border-2   border-slate-100  shadow-lg  outline-slate-200 w-full md:w-auto"
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

      {/* Syllabus Table */}
      {syllabusUploads.length > 0 && (
        <div className="w-full  rounded-lg ">
          <h2 className="text-xl font-semibold mb-2">Syllabus</h2>
          <Table resource={syllabusUploads} />
        </div>
      )}

      {/* Notes Table */}
      {notesUploads.length > 0 && (
        <div className="w-full  rounded-lg  ">
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <Table resource={notesUploads} />
        </div>
      )}

      {/* Questions Table */}
      {questionsUploads.length > 0 && (
        <div className="w-full  rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Questions</h2>
          <Table resource={questionsUploads} />
        </div>
      )}
    </div>
  );
};

export default ManageResources;
