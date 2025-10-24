import { useState, useContext, useRef } from "react";
import { toast } from "react-toastify";

import { MdOutlineDeleteForever } from "react-icons/md";
import Loader from "../Loader/Loader";
import { showConfirm } from "../../../Utils/alertHelper";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import { uploadFile } from "../../../Utils/uploadFile";
import {
  addUniversity,
  deleteUniversity,
  updateUniversity,
} from "../../../Services/universityService";

const UniversityManager = () => {
  const scrollRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);

  const [universityData, setUniversityData] = useState({
    imagepath: "",
    imagename: "",
    universityfullname: "",
    universityshortname: "",
    _id: "",
  });

  const { fetchAllData, universityLists, setUniversityLists, loading } =
    useContext(ProgrammesContext);

  // Handle submit (add/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (
      !universityData.universityfullname ||
      !universityData.universityshortname
    ) {
      return toast.error("Please fill in all required fields.");
    }

    if (!universityData._id && !imageFile) {
      return toast.error("Please upload a university logo or image.");
    }

    try {
      let imagepath = universityData.imagepath;
      let imagename = universityData.imagename;

      if (imageFile) {
        const res = await uploadFile(imageFile, "images");
        if (!res?.fileUrl || !res?.originalName) {
          toast.error("Image upload failed. Please try again.");
          return;
        }
        imagepath = res.fileUrl;
        imagename = res.originalName;
      }

      const payload = {
        universityfullname: universityData.universityfullname.trim(),
        universityshortname: universityData.universityshortname.trim(),
      };

      if (!universityData._id || imageFile) {
        payload.imagepath = imagepath;
        payload.imagename = imagename;
      }

      let res;
      if (universityData._id) {
        res = await updateUniversity(universityData._id, payload);
      } else {
        res = await addUniversity(payload);
      }

      if (res.success) {
        toast.success(res.message);
        setUniversityData({
          imagepath: "",
          imagename: "",
          universityfullname: "",
          universityshortname: "",
          _id: "",
        });
        setImageFile(null);
        fetchAllData();
      } else {
        toast.error(res?.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Error submitting university."
      );
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
    setUniversityData({ ...universityData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleDelete = async (id) => {
    const response = await showConfirm({
      title: "Are you sure you want to delete this university?",
      text: "This action cannot be undone.",
    });
    if (!response.isConfirmed) return;

    try {
      const deleteResponse = await deleteUniversity(id);
      if (deleteResponse.success) {
        toast.success(deleteResponse.message);
        setUniversityLists((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error deleting university.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div
      ref={scrollRef}
      className="flex flex-col items-center w-full  px-5 mt-8 pb-10 overflow-y-scroll scroll-container bg-light dark:bg-dark text-textLight dark:text-textDark mx-auto h-screen"
    >
      <h1 className="text-2xl font-semibold mb-4 text-center text-lightGreen dark:text-darkGreen">
        {universityData._id ? "Edit University" : "Add New University"}
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 w-full max-w-xl"
      >
        {/* Image Upload */}
        <div
          className={`mx-auto w-full max-w-[150px] h-[150px] border-2 border-dashed dark:bg-gray-900 rounded-xl flex flex-col justify-center items-center cursor-pointer transition-all ${
            imageFile
              ? "border-green-400"
              : "border-gray-300 dark:border-gray-600 hover:border-green-400"
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById("universityImage").click()}
        >
          <input
            type="file"
            id="universityImage"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
          {imageFile || universityData.imagepath ? (
            <img
              loading="lazy"
              src={
                imageFile
                  ? URL.createObjectURL(imageFile)
                  : `${import.meta.env.VITE_API_FILE_URL}${
                      universityData.imagepath
                    }`
              }
              alt="Preview"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-subTextLight dark:text-subTextDark w-full mx-auto">
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

        {/* University Fullname */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="universityfullname"
            className="font-medium text-textLight dark:text-textDark"
          >
            University Fullname
          </label>
          <input
            type="text"
            id="universityfullname"
            name="universityfullname"
            value={universityData.universityfullname}
            onChange={handleChange}
            placeholder="University fullname..."
            required
            className="px-4 py-3 rounded-2xl shadow-lg border border-slate-100 dark:border-gray-600 bg-transparent dark:bg-gray-900 text-textLight dark:text-textDark"
          />
        </div>

        {/* University Shortname */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="universityshortname"
            className="font-medium text-textLight dark:text-textDark"
          >
            University Shortname
          </label>
          <input
            type="text"
            id="universityshortname"
            name="universityshortname"
            value={universityData.universityshortname}
            onChange={handleChange}
            placeholder="University shortname..."
            required
            className="px-4 py-3 rounded-2xl shadow-lg border border-slate-100 dark:border-gray-600 bg-transparent dark:bg-gray-900 text-textLight dark:text-textDark"
          />
        </div>

        {/* Submit Button */}
        <div className="text-left">
          <button
            type="submit"
            className="bg-lightGreen dark:bg-darkGreen hover-supported:hover:bg-darkGreen text-white font-bold py-2 px-4 min-w-fit w-[7vw] rounded-lg transition-all duration-200"
          >
            {universityData._id ? "Update University" : "Add University"}
          </button>
        </div>
      </form>

      {/* Universities List */}
      <div className="mt-6 w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Universities List
        </h2>
        <div className="overflow-x-auto bg-transparent border-2 border-slate-300 dark:border-gray-700 rounded-lg shadow-lg">
          <table className="w-full text-center h-max border-collapse">
            <thead className="bg-lightGreen dark:bg-darkGreen text-white text-[12px] md:text-base">
              <tr>
                <th className="p-2 border border-gray-400">Image</th>
                <th className="px-4 py-2 border border-gray-400">Fullname</th>
                <th className="px-4 py-2 border border-gray-400">Shortname</th>
                <th className="px-4 py-2 border border-gray-400">Image Name</th>
                <th className="px-4 py-2 w-[20%] border border-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {universityLists.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-2 text-sm text-subTextLight dark:text-subTextDark border border-gray-400"
                  >
                    No universities available
                  </td>
                </tr>
              ) : (
                universityLists.map((uni) => (
                  <tr
                    key={uni._id}
                    className="bg-gray-200 dark:bg-gray-900 hover:bg-gray-300 dark:hover:bg-gray-700 text-center transition-all duration-500"
                  >
                    <td className="p-2 border border-gray-400">
                      <div className="flex justify-center items-center">
                        <img
                          loading="lazy"
                          src={`${import.meta.env.VITE_API_FILE_URL}${
                            uni.imagepath
                          }`}
                          alt="university"
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-2 border border-gray-400">
                      {uni.universityfullname}
                    </td>
                    <td className="p-2 border border-gray-400">
                      {uni.universityshortname}
                    </td>
                    <td className="p-2 border border-gray-400">
                      {uni.imagename || "-"}
                    </td>
                    <td className="p-2 w-[20%] border border-gray-400">
                      <div className="flex justify-center items-center gap-4">
                        <button
                          title="Edit"
                          onClick={() => {
                            setUniversityData({
                              ...uni,
                              imagepath: uni.imagepath || "",
                              imagename: uni.imagename || "",
                            });
                            scrollRef.current?.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }}
                          className="text-xl"
                        >
                          🖋️
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(uni._id)}
                          className="text-red-500 hover:text-red-700"
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

export default UniversityManager;
