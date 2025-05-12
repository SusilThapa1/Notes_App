import React, { useState, useContext, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import { FaGraduationCap, FaBookOpen } from "react-icons/fa";
import {
  addSemester,
  deleteSemester,
  updateSemester,
} from "../../../Services/semesterService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { ProgrammesContext } from "../Context/ProgrammeContext";

const SemesterManager = () => {
  const [semesters, setSemesters] = useState({
    semestername: "",
    programmename: "",
    _id: "",
  });
  const scrollRef = useRef(null);
  const { programmeLists, fetchAllData, semesterLists, setSemesterLists } =
    useContext(ProgrammesContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const semesternames = semesters.semestername
      .split(",")
      .map((semester) => semester.trim());

    if (semesternames.length === 0) {
      toast.error("Please enter at least one semester.");
      return;
    }

    // Check if the semester already exists in the selected programme
    const existingSemesters = semesterLists
      .filter((semester) => semester.programmename === semesters.programmename)
      .map((semester) => semester.semestername);

    const duplicateSemesters = semesternames.filter((name) =>
      existingSemesters.includes(name)
    );

    if (duplicateSemesters.length > 0) {
      toast.error(
        `The following semesters already exist: ${duplicateSemesters.join(
          ", "
        )}`
      );
      return;
    }

    if (semesters._id) {
      try {
        const res = await updateSemester(semesters._id, {
          semesternames: semesternames,
          programmename: semesters.programmename,
        });
        if (res.success) {
          toast.success(res.message);
          setSemesters({
            semestername: "",
            programmename: "",
            _id: "",
          });
          fetchAllData();
        } else {
          toast.error(res.message);
        }
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Failed to update semesters"
        );
        console.log(err.message);
      }
    } else {
      const response = await addSemester({
        semesternames: semesternames,
        programmename: semesters.programmename,
      });

      if (response.success) {
        toast.success(response.message);
        setSemesters({
          programmename: "",
          semestername: "",
          _id: "",
        });
        fetchAllData();
      } else {
        toast.error(response.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSemesters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    const response = await Swal.fire({
      title: "Are you sure you want to delete this semester?",
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
      const deleteResponse = await deleteSemester(id);
      if (deleteResponse.success) {
        toast.success(deleteResponse.message);

        // Update the semesterLists state after deletion
        setSemesterLists((prevsemesters) =>
          prevsemesters.filter((semester) => semester._id !== id)
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(
        "Error deleting semester:",
        error?.response?.data?.message || error.message
      );
    }
  };

  return (
    <div
      ref={scrollRef}
      className="flex flex-col items-center  w-full mt-4 overflow-y-scroll scroll-container bg-transparent shadow-sm mx-auto h-[calc(100vh-200px)] md:h-[calc(100vh-60px)]"
    >
      <div className="w-full flex flex-col gap-3  justify-center items-center h-fit pt-5 rounded-lg">
        <h1 className="text-2xl font-bold text-center">
          {semesters._id ? "Edit semesters" : "Add semesters"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 md:w-[80%] lg:w-[50%] w-full "
        >
          <div className="flex items-center border border-gray-400 rounded-lg p-2">
            <FaBookOpen className="text-orange-600 mr-2" />
            <input
              type="text"
              name="semestername"
              value={semesters.semestername}
              onChange={handleChange}
              placeholder="Enter multiple semesters separated by commas"
              className="w-full outline-none bg-transparent"
              autoComplete="on"
            />
          </div>

          {/* Programme Selection */}
          <div className="flex items-center border border-gray-400 rounded-lg p-2">
            <FaGraduationCap className="text-blue-800 mr-2" />
            <select
              name="programmename"
              value={semesters.programmename}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
            >
              <option value="">Select programme</option>
              {programmeLists.map((programme, index) => (
                <option key={index} value={programme.programmeshortname}>
                  {programme.programmeshortname}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 min-w-fit w-[7vw] rounded-lg transition-all duration-200"
          >
            {semesters._id ? "update" : "Add"}
          </button>
        </form>
      </div>

      <div className="py-4 w-full ">
        <div className="max-h-[300px] scroll-container">
          <h1 className="text-xl font-bold mb-4 text-center">
            Available Semesters/Years List
          </h1>

          {/* Group semesters by programme */}
          <div className="grid grid-cols-[auto] md:grid-cols-2 gap-5">
            {programmeLists.map((programme, index) => {
              const programmeSemesters = semesterLists.filter(
                (semester) =>
                  semester.programmename === programme.programmeshortname
              );

              return programmeSemesters.length > 0 ? (
                <div key={index} className="  w-full  py-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-center mb-3">
                    {programme.programmeshortname} Semesters/Years
                  </h2>
                  <table
                    border="collapse"
                    className="min-w-full bg-transparent shadow-lg text-center"
                  >
                    <thead className="bg-green-600 text-white">
                      <tr className="text-center border-b border-gray-400">
                        <th className="p-2  w-[5%] border-r border-gray-400 rounded-tl-lg">
                          S.N.
                        </th>
                        <th className="p-2 border-r border-gray-400">
                          Semester/Year
                        </th>
                        <th className="p-2 text-center w-[20%] rounded-tr-lg">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {programmeSemesters
                        .sort((a, b) =>
                          a.semestername.localeCompare(b.semestername)
                        )
                        .map((semester, semesterIndex) => (
                          <tr
                            key={semesterIndex}
                            className="border-b border-gray-400  rounded-b-lg hover:bg-gray-300 text-center"
                          >
                            <td className="p-2   w-[5%] border-r border-gray-400">
                              {semesterIndex + 1}.
                            </td>
                            <td className="p-2 border-r text-[12px] md:text-base border-gray-400">
                              {semester.semestername}
                            </td>
                            <td className="p-2 w-[20%] text-center">
                              <div className="flex justify-center items-center gap-4">
                                <button
                                  title="Edit"
                                  onClick={() => {
                                    setSemesters(semester);
                                    scrollRef.current?.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    });
                                  }}
                                  className="text-blue-500 text-xl hover:text-blue-700"
                                >
                                  <GrEdit />
                                </button>
                                <button
                                  title="Delete"
                                  onClick={() => handleDelete(semester._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTrash size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemesterManager;
