import { useState, useEffect } from "react";
import { FaCalendarAlt, FaGraduationCap, FaLink } from "react-icons/fa";
import { MdCategory, MdDateRange } from "react-icons/md";
import { GrResources } from "react-icons/gr";
import { toast } from "react-toastify";
import { fetchAllSemesters } from "../../../Services/semesterService";
import { fetchAllProgrammes } from "../../../Services/programmeService";
import { addUpload, updateUpload } from "../../../Services/uploadService";
import { useLocation, useNavigate } from "react-router-dom";

const p_years = ["Year 1", "Year 2", "Year 3", "Year 4"];

// const currentYear = new Date().getFullYear();
// const years = [];
// for (let i = 2020; i <= currentYear; i++) {
//   years.push(i);
// }

const UploadResources = () => {
  const [programmes, setProgrammes] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [filteredSemesters, setFilteredSemesters] = useState([]);
  const location = useLocation();
  const existingUpload = location.state?.upload || {};

  const [upload, setUpload] = useState({
    resources: existingUpload.resources || "",
    programmename: existingUpload.programmename || "",
    academicstructure: existingUpload.academicstructure || "",
    semestername: existingUpload.semestername || "",

    year: existingUpload.year || "",
    link: existingUpload.link || "",
    _id: existingUpload._id || "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpload((prev) => ({ ...prev, [name]: value }));
  };

  const fetchSemesters = async () => {
    try {
      const response = await fetchAllSemesters();
      if (response.success) {
        setSemesters(response.data);
      }
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const fetchProgrammes = async () => {
    try {
      const response = await fetchAllProgrammes();
      if (response.success) {
        setProgrammes(response.data);
      }
    } catch (error) {
      console.error("Error fetching programmes:", error);
    }
  };

  const uniqueStructures = [
    ...new Set(programmes.map((p) => p.academicstructure)),
  ];

  useEffect(() => {
    fetchSemesters();
    fetchProgrammes();
  }, []);

  useEffect(() => {
    if (upload.programmename) {
      setFilteredSemesters(
        semesters.filter(
          (semester) => semester.programmename === upload.programmename
        )
      );
    } else {
      setFilteredSemesters([]);
    }
  }, [upload.programmename, semesters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (
      !upload.resources ||
      !upload.programmename ||
      !upload.academicstructure ||
      !upload.link
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      if (upload._id) {
        const response = await updateUpload(upload._id, upload);
        if (response.success) {
          navigate("/study/admin/dashboard/manageresources", {
            state: { upload },
          });
          toast.success(response.message);
          setUpload({
            resources: "",
            programmename: "",
            academicstructure: "",
            semestername: "",
            year: "",
            link: "",
            _id: "",
          });

          // Reset the file input field after successful submission
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await addUpload(upload);
        if (response.success) {
          toast.success(response.message);
          setUpload({
            resources: "",
            programmename: "",
            academicstructure: "",
            semestername: "",
            year: "",
            link: "",
            _id: "",
          });

          // Reset the file input field after successful submission
        } else {
          toast.error(response.message);
        }
      }
    } catch (err) {
      console.error(
        "Error:",
        err.response ? err.response.data.message : err.message
      );
      toast.error(
        err?.response?.data.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="w-full mx-auto h-[calc(100vh-210px)] md:h-[calc(100vh-60px)]   flex flex-col  items-center gap-3 bg-transparent overflow-y-scroll scroll-container pb-5 rounded-lg">
      <h1 className="text-2xl font-bold pt-8    text-[#5CAE59]">
        {upload._id ? "Edit Resources" : "Upload Resources"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full md:w-[70%] lg:w-[50%] gap-4 text-gray-800"
      >
        <div className="flex gap-2 justify-center items-center px-4 py-3 rounded-2xl shadow-lg    bg-transparent border  border-slate-100  placeholder:font-medium">
          <GrResources className="text-purple-500" />

          <select
            name="resources"
            value={upload.resources}
            onChange={handleChange}
            className="w-full  outline-none bg-transparent"
            required
          >
            <option value="">Select resources</option>
            <option value="syllabus">Syllabus</option>
            <option value="notes">Notes</option>
            <option value="questions">Questions</option>
          </select>
        </div>

        <div className="flex gap-2 justify-center items-center px-4 py-3 rounded-2xl shadow-lg    bg-transparent border  border-slate-100  placeholder:font-medium">
          <FaGraduationCap className="text-blue-500" />
          <select
            name="programmename"
            value={upload.programmename}
            onChange={handleChange}
            className="w-full  outline-none bg-transparent"
            required
          >
            <option value="">Select programme</option>
            {programmes.map((programme, index) => (
              <option key={index} value={programme.programmeshortname}>
                {programme.programmeshortname}
              </option>
            ))}
          </select>
        </div>

        {/* {upload.resources === "syllabus" && ( */}
        <div className="flex gap-2 justify-center items-center px-4 py-3 rounded-2xl shadow-lg    bg-transparent border  border-slate-100  placeholder:font-medium">
          <MdCategory className="text-green-500" />
          <select
            name="academicstructure"
            value={upload.academicstructure}
            onChange={handleChange}
            className="w-full  outline-none bg-transparent capitalize"
            required
          >
            <option value="">Select Academic Structure</option>
            {uniqueStructures.map((structure, index) => (
              <option key={index} value={structure}>
                {structure}
              </option>
            ))}
          </select>
        </div>
        {/* )} */}

        {upload.academicstructure === "yearly" && (
          <div className="flex gap-2 justify-center items-center px-4 py-3 rounded-2xl shadow-lg    bg-transparent border  border-slate-100  placeholder:font-medium">
            <MdDateRange className="text-red-500" />

            <select
              name="year"
              value={upload.year}
              onChange={handleChange}
              className="w-full  outline-none bg-transparent"
              required
            >
              <option value="">Select Year</option>
              {p_years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
        {upload.academicstructure === "semester" && (
          <div className="flex gap-2 justify-center items-center border-2 border-slate-100 shadow-lg bg-transparent rounded-lg p-2 mt-1 outline-slate-200 ">
            <FaCalendarAlt className="text-gray-500" />
            <select
              name="semestername"
              value={upload.semestername}
              onChange={handleChange}
              className="w-full  outline-none bg-transparent"
              required
            >
              <option value="">Select Semester</option>
              {filteredSemesters.map((sem, index) => (
                <option key={index} value={sem.semestername.toLowerCase()}>
                  {sem.semestername}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-2 justify-center items-center px-4 py-3 rounded-2xl shadow-lg    bg-transparent border  border-slate-100  placeholder:font-medium ">
          <FaLink />
          <input
            type="text"
            name="link"
            value={upload.link}
            onChange={handleChange}
            placeholder="Place google drive link here"
            className="w-full  outline-none bg-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-2xl bg-transparent border  border-slate-100 hover-supported:hover:border-transparent  placeholder:font-medium hover-supported: hover:bg-[#5CAE59] hover-supported:hover:text-gray-200 active:bg-green-600 shadow-lg transition-all duration-500 self-center"
        >
          {upload._id ? "Update  " : " Upload  "}
        </button>
      </form>
    </div>
  );
};

export default UploadResources;
