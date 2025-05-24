import { useState, useContext, useRef } from "react";
import Swal from "sweetalert2";
import upload_Image from "/upload_area.svg";

import { toast } from "react-toastify";
import {
  deleteProgramme,
  updateProgramme,
  addProgramme,
} from "../../../Services/programmeService";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import { MdOutlineDeleteForever } from "react-icons/md";
import Loader from "../Loader";

const ProgrammeManager = () => {
  const scrollRef = useRef(null);
  const [image, setImage] = useState(null);
  const [programmeData, setProgrammeData] = useState({
    image: "",
    programmefullname: "",
    programmeshortname: "",
    _id: "",
  });
  const { fetchAllData, programmeLists, setProgrammeLists, loading } =
    useContext(ProgrammesContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("image", image);
    formData.append("programmefullname", programmeData.programmefullname);
    formData.append("programmeshortname", programmeData.programmeshortname);
    formData.append("academicstructure", programmeData.academicstructure);

    // Check if all fields are filled
    if (
      !programmeData.programmefullname ||
      !programmeData.programmeshortname ||
      !programmeData.academicstructure ||
      (!image && !programmeData.image)
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (programmeData._id) {
      const formData = new FormData();
      formData.append("programmefullname", programmeData.programmefullname);
      formData.append("programmeshortname", programmeData.programmeshortname);
      formData.append("academicstructure", programmeData.academicstructure);

      if (image) {
        formData.append("image", image); // Only add if new image is selected
      }
      try {
        const res = await updateProgramme(programmeData._id, formData);
        if (res.success) {
          toast.success(res.message);
          setProgrammeData({
            image: "",
            programmefullname: "",
            programmeshortname: "",
            academicstructure: "",
            _id: "",
          });
          setImage(null);
          fetchAllData();
        } else {
          toast.error(res.message || "Failed to update programme.");
        }
      } catch (error) {
        const errorMessage =
          error?.response?.message ||
          error.message ||
          "Error updating programme.";
        toast.error(errorMessage);
        console.error("Error submitting programme:", errorMessage);
      }
    } else {
      try {
        const res = await addProgramme(formData);
        if (res.success) {
          toast.success(res.message);
          setProgrammeData({
            image: "",
            programmefullname: "",
            programmeshortname: "",
            academicstructure: "",
            _id: "",
          });
          setImage(null);
          fetchAllData();
        } else {
          toast.error(res.message || "Failed to add programme.");
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error.message ||
          "Error adding programme.";
        toast.error(errorMessage);
        console.error("Error adding programme:", errorMessage);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgrammeData({ ...programmeData, [name]: value });
  };
  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const handleDelete = async (id) => {
    const response = await Swal.fire({
      title: "Are you sure you want to delete this programme?",
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
      const deleteResponse = await deleteProgramme(id);
      if (deleteResponse.success) {
        toast.success(deleteResponse.message);
        setProgrammeLists((prevProgrammes) =>
          prevProgrammes.filter((programme) => programme._id !== id)
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error deleting programme."
      );
      console.error(
        "Error deleting programme:",
        error?.response?.data?.message || error.message
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      ref={scrollRef}
      className="flex flex-col items-center  w-full max-w-6xl mt-8  pb-10 md:pb-0  overflow-y-scroll scroll-container bg-transparent shadow-sm mx-auto h-[calc(100vh-200px)] md:h-[calc(100vh-75px)]"
    >
      <h1 className="text-2xl font-semibold mb-4 text-center    text-[#5CAE59]">
        {programmeData._id ? "Edit Programme" : "Add New Programme"}
      </h1>

      {/* Form to add or edit programme */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full max-w-xl"
      >
        <div className=" rounded-lg">
          <label
            htmlFor="programmeImage"
            className="flex flex-col gap-2 items-center"
          >
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : programmeData.image || "/upload_area.png"
              }
              alt="upload"
              className="cursor-pointer w-32 h-32 object-cover bg-transparent shadow-lg rounded-lg border-2 border-slate-100 "
              loading="lazy"
            />
            <span>Cover image</span>
          </label>
          <input
            type="file"
            name="image"
            id="programmeImage"
            hidden
            onChange={imageHandler}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="programmefullname"
            className="font-medium text-gray-700"
          >
            Programme Fullname
          </label>
          <input
            type="text"
            id="programmefullname"
            name="programmefullname"
            value={programmeData.programmefullname}
            placeholder="Programme fullname..."
            onChange={handleChange}
            className="px-4 py-3 rounded-2xl shadow-lg focus: outline-slate-200 focus:ring-2 focus:ring-gray-200 bg-transparent border  border-slate-100  placeholder:font-medium"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="programmeshortname"
            className="font-medium text-gray-700"
          >
            Programme Shortname
          </label>
          <input
            type="text"
            id="programmeshortname"
            name="programmeshortname"
            value={programmeData.programmeshortname}
            placeholder="Programme shortname..."
            onChange={handleChange}
            className="px-4 py-3 rounded-2xl shadow-lg focus:outline-slate-200 focus:ring-2 focus:ring-gray-200 bg-transparent border  border-slate-100  placeholder:font-medium"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="structure" className="font-medium text-gray-700">
            Academic Structure
          </label>
          <select
            name="academicstructure"
            id="structure"
            onChange={handleChange}
            value={programmeData.academicstructure}
            className="px-4 py-3 rounded-2xl shadow-lg focus: outline-slate-200 focus:ring-2 focus:ring-gray-200 bg-transparent border  border-slate-100  placeholder:font-medium"
            required
          >
            <option value="">Select</option>
            <option value="semester">Semester-Wise</option>
            <option value="yearly">Year-wise</option>
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-transparent border  border-slate-100 hover-supported:hover:border-transparent  px-4 py-3 rounded-2xl font-medium hover-supported: hover:bg-[#5CAE59] hover-supported:hover:text-gray-200 active:bg-green-600 shadow-lg transition-all duration-500"
          >
            {programmeData._id ? "Update Programme" : "Add Programme"}
          </button>
        </div>
      </form>
      {/* List of Programmes */}
      <div className="mt-6 w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Programmes List
        </h2>
        <div className="overflow-x-auto bg-transparent border-2 border-slate-300 rounded-lg shadow-lg">
          <table border="collapse" className="w-full  text-center h-max ">
            <thead className="bg-green-600 text-white text-[12px] md:text-base ">
              <tr className="text-center border-b border-gray-400">
                <th className="p-2  border-x-2 border-gray-400   ">Image</th>
                <th className="px-4 py-2   border-r border-gray-400">
                  Fullname
                </th>
                <th className="px-4 py-2 border-r border-gray-400">
                  Shortname
                </th>
                <th className="px-4 py-2 border-r border-gray-400">
                  Academic Structure
                </th>
                <th className="px-4 py-2 w-[20%]  rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programmeLists.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-2  w-full text-sm text-gray-500"
                  >
                    No programmes available
                  </td>
                </tr>
              ) : (
                programmeLists.map((programme) => (
                  <tr
                    key={programme._id}
                    className="border-b border-gray-500 bg-gray-200   hover-supported:hover:bg-gray-300 text-center transition-all duration-500"
                  >
                    <td className="p-2 flex justify-center items-center  border-r border-gray-400">
                      <img
                        src={programme.imagepath}
                        alt="image"
                        className="w-14 h-14 rounded-lg object-cover"
                        loading="lazy"
                      />
                    </td>
                    <td className="p-2   border-r border-gray-400">
                      {programme.programmefullname}
                    </td>
                    <td className="p-2   border-r border-gray-400">
                      {programme.programmeshortname}
                    </td>
                    <td className="p-2   border-r border-gray-400 capitalize">
                      {programme.academicstructure}
                    </td>

                    <td className="p-2 w-[20%] ">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          title="Edit"
                          onClick={() => {
                            setProgrammeData({
                              ...programme,
                              image: programme.imagepath || "",
                            });
                            scrollRef.current?.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }}
                          className="  text-xl  "
                        >
                          🖋️
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(programme._id)}
                          className="text-red-500 hover-supported:hover:text-red-700"
                        >
                          <MdOutlineDeleteForever size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgrammeManager;
