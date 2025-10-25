import { useState, useContext, useRef } from "react";
import { toast } from "react-toastify";
import {
  deleteProgramme,
  updateProgramme,
  addProgramme,
} from "../../../Services/programmeService";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import Loader from "../Loader/Loader";
import { useAlerts } from "../../../Utils/alertHelper";
import { uploadFile } from "../../../Utils/uploadFile";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";

const ProgrammeManager = () => {
  const { showConfirm } = useAlerts();
  const scrollRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);

  const [programmeData, setProgrammeData] = useState({
    imagepath: "",
    imagename: "",
    programmefullname: "",
    programmeshortname: "",
    academicstructure: "",
    _id: "",
  });

  const { fetchAllData, programmeLists, setProgrammeLists, loading } =
    useContext(ProgrammesContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (
      !programmeData.programmefullname ||
      !programmeData.programmeshortname ||
      !programmeData.academicstructure
    ) {
      return toast.error("Please fill in all required fields.");
    }

    try {
      let imagepath = programmeData.imagepath;
      let imagename = programmeData.imagename;

      if (imageFile) {
        const res = await uploadFile(imageFile, "images");
        if (!res) return;
        imagepath = res.fileUrl;
        imagename = res.originalName;
      }

      const payload = {
        programmefullname: programmeData.programmefullname,
        programmeshortname: programmeData.programmeshortname,
        academicstructure: programmeData.academicstructure,
      };

      if (!programmeData._id || imageFile) {
        payload.imagepath = imagepath;
        payload.imagename = imagename;
      }

      let res;
      if (programmeData._id) {
        res = await updateProgramme(programmeData._id, payload);
      } else {
        res = await addProgramme(payload);
      }

      if (res.success) {
        toast.success(res.message);
        setProgrammeData({
          imagepath: "",
          imagename: "",
          programmefullname: "",
          programmeshortname: "",
          academicstructure: "",
          _id: "",
        });
        setImageFile(null);
        fetchAllData();
      } else {
        toast.error(res.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error(err?.message || "Error submitting programme.");
      console.error(err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      toast.error("Please drop a valid image file.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProgrammeData({ ...programmeData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleDelete = async (id) => {
    const response = await showConfirm({
      title: "Are you sure you want to delete this programme?",
      text: "You won't be able to revert this!",
    });
    if (!response.isConfirmed) return;

    try {
      const deleteResponse = await deleteProgramme(id);
      if (deleteResponse.success) {
        toast.success(deleteResponse.message);
        setProgrammeLists((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error(err?.message || "Error deleting programme.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div
      ref={scrollRef}
      className="flex flex-col items-center w-full  px-5 mt-8 pb-10 overflow-y-scroll scroll-container  text-textLight dark:text-textDark mx-auto h-screen"
    >
      <h1 className="text-2xl font-semibold mb-4 text-center text-lightGreen dark:text-darkGreen">
        {programmeData._id ? "Edit Programme" : "Add New Programme"}
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full max-w-xl"
      >
        {/* Image Upload */}
        <div
          className={`mx-auto w-full max-w-[150px] h-[150px] dark:bg-gray-900 border-2 border-dashed rounded-xl flex flex-col justify-center items-center cursor-pointer transition-all ${
            imageFile
              ? "border-green-400"
              : "border-gray-300 hover:border-green-400"
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById("programmeImage").click()}
        >
          <input
            type="file"
            id="programmeImage"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
          {imageFile || programmeData.imagepath ? (
            <img
              loading="lazy"
              src={
                imageFile
                  ? URL.createObjectURL(imageFile)
                  : `${import.meta.env.VITE_API_FILE_URL}${
                      programmeData.imagepath
                    }`
              }
              alt="Preview"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2  text-subTextLight dark:text-subTextDark w-full mx-auto">
              <img
                loading="lazy"
                src="/upload_area.png"
                alt="upload"
                className="w-20 h-20"
              />
              <p className="text-sm font-medium text-center">
                Drag & Drop or Click to Upload
              </p>
            </div>
          )}
        </div>

        {/* Text Inputs */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="programmefullname"
            className="font-medium text-textLight dark:text-textDark"
          >
            Programme Fullname
          </label>
          <input
            type="text"
            id="programmefullname"
            name="programmefullname"
            value={programmeData.programmefullname}
            onChange={handleChange}
            placeholder="Programme fullname..."
            required
            className="px-4 py-3 rounded-2xl shadow-lg border border-slate-100 bg-transparent dark:bg-gray-900 text-textLight dark:text-textDark"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="programmeshortname"
            className="font-medium text-textLight dark:text-textDark"
          >
            Programme Shortname
          </label>
          <input
            type="text"
            id="programmeshortname"
            name="programmeshortname"
            value={programmeData.programmeshortname}
            onChange={handleChange}
            placeholder="Programme shortname..."
            required
            className="px-4 py-3 rounded-2xl shadow-lg border border-slate-100 bg-transparent dark:bg-gray-900 text-textLight dark:text-textDark"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="structure"
            className="font-medium text-textLight dark:text-textDark"
          >
            Academic Structure
          </label>
          <select
            name="academicstructure"
            id="structure"
            value={programmeData.academicstructure}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-2xl shadow-lg bg-light dark:bg-gray-900 border border-slate-100 bg-transparent text-textLight dark:text-textDark"
          >
            <option value="">Select</option>
            <option value="semester">Semester-Wise</option>
            <option value="yearly">Year-wise</option>
          </select>
        </div>

        <div className="text-left">
          <button
            type="submit"
            className="bg-lightGreen dark:bg-darkGreen hover-supported:hover:bg-darkGreen text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
          >
            {programmeData._id ? "Update Programme" : "Add Programme"}
          </button>
        </div>
      </form>

      {/* Programmes List */}
      <div className="mt-6 w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Programmes List
        </h2>
        <div className="overflow-x-auto bg-transparent border-2 border-slate-300 dark:border-gray-700 rounded-lg shadow-lg">
          <table className="w-full text-center h-max border-collapse">
            <thead className="bg-lightGreen dark:bg-darkGreen text-white text-[12px] md:text-base">
              <tr>
                <th className="p-2 border border-gray-400">Image</th>
                <th className="px-4 py-2 border border-gray-400">Fullname</th>
                <th className="px-4 py-2 border border-gray-400">Shortname</th>
                <th className="px-4 py-2 border border-gray-400">
                  Academic Structure
                </th>
                <th className="px-4 py-2 border border-gray-400">Image Name</th>
                <th className="px-4 py-2 w-[20%] border border-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {programmeLists.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-2 text-sm text-subTextLight dark:text-subTextDark border border-gray-400"
                  >
                    No programmes available
                  </td>
                </tr>
              ) : (
                programmeLists.map((programme) => (
                  <tr
                    key={programme._id}
                    className="bg-gray-200 dark:bg-gray-900 hover:bg-gray-300 dark:hover:bg-gray-700 text-center transition-all duration-500"
                  >
                    <td className="p-2 border border-gray-400">
                      <div className="flex justify-center items-center">
                        <img
                          loading="lazy"
                          src={`${import.meta.env.VITE_API_FILE_URL}${
                            programme.imagepath
                          }`}
                          alt="image"
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-2 border border-gray-400">
                      {programme.programmefullname}
                    </td>
                    <td className="p-2 border border-gray-400">
                      {programme.programmeshortname}
                    </td>
                    <td className="p-2 border border-gray-400 capitalize">
                      {programme.academicstructure}
                    </td>
                    <td className="p-2 border border-gray-400">
                      {programme.imagename || "-"}
                    </td>
                    <td className="p-2 w-[20%] border border-gray-400">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          title="Edit"
                          onClick={() => {
                            setProgrammeData({
                              ...programme,
                              imagepath: programme.imagepath || "",
                              imagename: programme.imagename || "",
                            });
                            scrollRef.current?.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }}
                          className="text-xl text-editOutlineText"
                        >
                          <HiOutlinePencilAlt size={20} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(programme._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <HiOutlineTrash size={20} />
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
