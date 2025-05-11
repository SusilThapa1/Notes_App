import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteUpload } from "../../../Services/uploadService";
import { FaTrashAlt, FaFilter } from "react-icons/fa";
// import { FiEdit } from "react-icons/fi";
import Swal from "sweetalert2";
import { ProgrammesContext } from "../context/ProgrammeContext";
import { FiEdit } from "react-icons/fi";

const ManageResources = () => {
  const [programSelected, setProgramSelected] = useState("");
  const [resourceSelected, setResourceSelected] = useState("");
  const navigate = useNavigate();

  const { uploads, programmeLists, setUploads } = useContext(ProgrammesContext);
  const handleDelete = async (id) => {
    const response = await Swal.fire({
      title: "Are you sure, you want to delete?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#49bb0f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      width: "400px",
    });

    if (!response.isConfirmed) return;

    try {
      const deleteResponse = await deleteUpload(id);
      if (deleteResponse.success) {
        toast.success(deleteResponse.message);
        setUploads((prevUploads) =>
          prevUploads.filter((upload) => upload._id !== id)
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete resource"
      );
      console.error(
        "Error deleting resource:",
        error?.response?.data?.message || error.message
      );
    }
  };

  const handleEdit = (upload) => {
    navigate("/study/admin/dashboard/uploadresources", { state: { upload } });
  };

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

  return (
    <div className="flex flex-col items-center w-full mt-4 overflow-y-scroll scroll-container bg-transparent shadow-sm mx-auto h-[calc(100vh-200px)] md:h-[calc(100vh-145px)] pb-20 md:p-2">
      <h1 className="text-3xl font-medium text-center ">Resources List</h1>

      {/* Program selection and resource type selection */}
      <div className="w-full flex  flex-col justify-between items-start md:items-center rounded-lg border  border-gray-300 p-2 gap-4 mb-5 md:mb-10">
        <div className="flex justify-center items-center w-full">
          <FaFilter className="text-lg text-blue-600" />
          <h1 className="text-md font-bold ">Filter Box </h1>
        </div>
        <div className="w-full flex md:flex-row flex-col justify-between items-start md:items-center gap-5">
          {/* Program selection */}
          <select
            className="p-2 bg-transparent border border-gray-300 shadow-md rounded-md outline-none w-full md:w-auto"
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
            className="p-2 bg-transparent rounded-md border border-gray-300 shadow-md outline-none w-full md:w-auto"
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
          <table className="w-full bg-transparent shadow-lg text-center ">
            <thead className="bg-green-600 text-white">
              <tr className="text-center border-b border-gray-400 ">
                <th className="p-2  w-[5%] border-r border-gray-400 rounded-tl-lg">
                  S.N.
                </th>
                <th className="p-2 border-r border-gray-400">Programme</th>
                <th className="p-2 border-r border-gray-400">Semester/Year</th>
                <th className="p-2 text-center w-[20%] rounded-tr-lg ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {syllabusUploads.map((upload, index) => (
                <tr
                  key={upload._id}
                  className="border-b border-gray-400  rounded-b-lg hover:bg-gray-300 text-center transition-all duration-500"
                >
                  <td className="p-2 w-[5%] border-r border-gray-400">
                    {index + 1}.
                  </td>
                  <td className="p-2 border-r border-gray-400">
                    {upload.programmename}
                  </td>
                  <td className="p-2 border-r border-gray-400 uppercase">
                    {upload?.semestername || upload?.year}
                  </td>
                  <td className="p-2 flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(upload)}
                      className="text-cyan-500 text-xl hover:text-cyan-600"
                      title="edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(upload._id)}
                      className="text-red-500 hover:text-red-700"
                      title="delete"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes Table */}
      {notesUploads.length > 0 && (
        <div className="w-full  rounded-lg  ">
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <table className="w-full bg-transparent shadow-lg text-center rounded-lg">
            <thead className="bg-green-600 text-white">
              <tr className="text-center border-b border-gray-400 ">
                <th className="p-2  w-[5%] border-r border-gray-400 rounded-tl-lg ">
                  S.N.
                </th>
                <th className="p-2 border-r border-gray-400">Programme</th>
                <th className="p-2 border-r border-gray-400">Semester/Year</th>
                <th className="p-2 text-center w-[20%] rounded-tr-lg ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {notesUploads
                .sort((a, b) =>
                  (a.semestername || a.year || "").localeCompare(
                    b.semestername || b.year || ""
                  )
                )
                .map((upload, index) => (
                  <tr
                    key={upload._id}
                    className="border-b border-gray-400  rounded-b-lg hover:bg-gray-300 text-center transition-all duration-500"
                  >
                    <td className="p-2 w-[5%] border-r border-gray-400">
                      {index + 1}.
                    </td>
                    <td className="p-2 border-r border-gray-400">
                      {upload.programmename}
                    </td>
                    <td className="p-2 border-r border-gray-400 uppercase">
                      {upload?.semestername || upload?.year}
                    </td>
                    <td className="p-2 flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(upload)}
                        className="text-cyan-500 text-xl hover:text-cyan-600"
                        title="edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(upload._id)}
                        className="text-red-500 hover:text-red-700"
                        title="delete"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Questions Table */}
      {questionsUploads.length > 0 && (
        <div className="w-full  rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Questions</h2>
          <table className="w-full bg-transparent shadow-lg text-center">
            <thead className="bg-green-600 text-white">
              <tr className="text-center border-b border-gray-400">
                <th className="p-2  w-[5%] border-r border-gray-400 rounded-tl-lg">
                  S.N.
                </th>
                <th className="p-2 border-r border-gray-400">Programme</th>
                <th className="p-2 border-r border-gray-400">Year/Semester</th>
                <th className="p-2 text-center w-[20%] rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {questionsUploads.map((upload, index) => (
                <tr
                  key={upload._id}
                  className="border-b border-gray-400  rounded-b-lg hover:bg-gray-300 text-center transition-all duration-500"
                >
                  <td className="p-2 w-[5%] border-r border-gray-400">
                    {index + 1}.
                  </td>
                  <td className="p-2 border-r border-gray-400">
                    {upload.programmename}
                  </td>
                  <td className="p-2 border-r border-gray-400 uppercase">
                    {upload?.year || upload?.semestername}
                  </td>
                  <td className="p-2 flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(upload)}
                      className="  text-xl  "
                      title="edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(upload._id)}
                      className="text-red-500 hover:text-red-700"
                      title="delete"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageResources;
