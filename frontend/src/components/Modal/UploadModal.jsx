import { useState, useContext, useEffect } from "react";
import { HiOutlineUpload, HiOutlineX } from "react-icons/hi";
import { VscFilePdf } from "react-icons/vsc";
import { toast } from "react-toastify";
import { uploadFile } from "../../../Utils/uploadFile";
import { addUpload, updateUpload } from "../../../Services/uploadService";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import { AuthContext } from "../Context/AuthContext";

const formatFileSize = (bytes) => {
  if (!bytes) return "unknown size";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(2)} ${sizes[i]}`;
};

const UploadModal = ({
  isOpen,
  onClose,
  existingData = null,
  isEdit = false,
  onUploadComplete,
}) => {
  const { programmeLists, universityLists } = useContext(ProgrammesContext);
  const { userDetails } = useContext(AuthContext);

  const [uploadData, setUploadData] = useState({
    university: "",
    resources: "",
    programme: "",
    courseCode: "",
    courseName: "",
    semyear: "",
    isVerified: false,
    filename: "",
    filepath: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Preload data if editing
  useEffect(() => {
    if (isEdit && existingData) {
      setUploadData({
        university: existingData.universityID?._id || "",
        resources: existingData.resources || "",
        programme: existingData.programmeID?._id || "",
        courseCode: existingData.courseCode || "",
        courseName: existingData.courseName || "",
        semyear: existingData.semyear || "",
        filename: existingData.filename || "",
        filepath: existingData.filepath || "",
        _id: existingData._id || "",
        isVerified: existingData.isVerified || false,
      });

      if (existingData.filepath && existingData.filename) {
        setFile({
          name: existingData.filename,
          type: existingData.filename.split(".").pop(),
          previewUrl: existingData.filepath,
          size: 0,
        });
      }
    }
  }, [isEdit, existingData]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUploadData({ ...uploadData, [name]: value });
  };

  // Handle file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const maxSizeMB = 25;
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size exceeds ${maxSizeMB} MB limit`);
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    {
      e.preventDefault();
      e.stopPropagation();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && droppedFile.type === "application/pdf") {
        const maxSizeMB = 25;
        const fileSizeMB = droppedFile.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          toast.error(`File size exceeds ${maxSizeMB} MB limit`);
          return;
        }
        setFile(droppedFile);
      } else {
        toast.error("Only PDF files are allowed.");
      }
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    const required = [
      "university",
      "resources",
      "programme",
      "courseCode",
      "courseName",
      "semyear",
    ];

    if (required.some((key) => !uploadData[key])) {
      return toast.error("Please fill all required fields.");
    }

    const selectedProgramme = programmeLists.find(
      (p) => p._id === uploadData.programme
    );

    // Require file only when adding new
    if (!isEdit && !file) {
      return toast.error("Please select a file to upload.");
    }

    try {
      setLoading(true);

      let filepath = uploadData.filepath;
      let filename = uploadData.filename;

      //  Upload new file only if a File object is selected
      if (file && file instanceof File) {
        const res = await uploadFile(file, uploadData.resources);
        if (!res || !res.fileUrl) {
          toast.error("File upload failed.");
          setLoading(false);
          return;
        }
        filepath = res.fileUrl;
        filename = res.originalName;
      }

      //  Build payload
      const payload = {
        university: uploadData.university,
        resources: uploadData.resources,
        programme: uploadData.programme,
        courseCode: uploadData.courseCode,
        courseName: uploadData.courseName,
        academicstructure: selectedProgramme?.academicstructure || "Semester",
        semyear: uploadData.semyear,
        isVerified: uploadData.isVerified,
      };

      //  Include file data only if a new file was uploaded or adding new
      if (!isEdit || (file && file instanceof File)) {
        payload.filepath = filepath;
        payload.filename = filename;
      }

      let response;
      if (isEdit && uploadData._id) {
        response = await updateUpload(uploadData._id, payload);
      } else {
        response = await addUpload(payload);
      }

      if (response.success) {
        toast.success(response.message || "File saved successfully!");
        onClose();
        if (onUploadComplete) onUploadComplete();
      } else {
        toast.error(response.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error(err.message || "Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedProgramme = programmeLists.find(
    (p) => p._id === uploadData.programme
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 sm:px-5">
      <div className="bg-light dark:bg-dark rounded-lg shadow-lg w-full max-w-lg p-6 relative overflow-auto max-h-[95vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-subTextLight dark:text-subTextDark hover-supported:hover:text-red-600"
        >
          <HiOutlineX size={20} />
        </button>

        <h2 className="text-xl text-center font-semibold mb-2 text-textLight dark:text-textDark">
          {isEdit ? "Edit Upload" : "Upload File"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 w-full">
          {/* University */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-textDark">
              Choose University
            </label>
            <select
              name="university"
              value={uploadData.university}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-lg  outline-none bg-transparent dark:bg-gray-900 dark:text-textDark"
            >
              <option value="">Select University</option>
              {universityLists.map((university) => (
                <option key={university._id} value={university._id}>
                  {university.universityfullname} (
                  {university.universityshortname})
                </option>
              ))}
            </select>
          </div>

          {/* Resource */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-textDark">
              Resource Type
            </label>
            <select
              name="resources"
              value={uploadData.resources}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-lg  bg-transparent dark:bg-gray-900 dark:text-textDark"
            >
              <option value="">Select Type</option>
              <option value="syllabus">Syllabus</option>
              <option value="notes">Notes</option>
              <option value="questions">Questions</option>
            </select>
          </div>

          {/* Programme */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-textDark">
              Programme Name
            </label>
            <select
              name="programme"
              value={uploadData.programme}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-lg  bg-transparent dark:bg-gray-900 dark:text-textDark"
            >
              <option value="">Select Programme</option>
              {programmeLists.map((programme) => (
                <option
                  key={programme._id}
                  value={programme._id}
                  className="max-w-3xl"
                >
                  {programme.programmefullname} ({programme.programmeshortname})
                </option>
              ))}
            </select>
            {selectedProgramme && (
              <p className="text-xs text-subTextLight dark:text-subTextDark mt-1">
                Academic Structure:{" "}
                <span className="font-medium text-textLight dark:text-textDark">
                  {selectedProgramme.academicstructure}
                </span>
              </p>
            )}
          </div>

          {/* Course Code + Name */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              name="courseCode"
              value={uploadData.courseCode}
              onChange={handleChange}
              placeholder="Course Code"
              className="flex-1 px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-lg  bg-transparent dark:bg-gray-900 dark:text-textDark dark:placeholder:text-gray-400"
            />
            <input
              type="text"
              name="courseName"
              value={uploadData.courseName}
              onChange={handleChange}
              placeholder="Course Name"
              className="flex-1 px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-lg  bg-transparent dark:bg-gray-900 dark:text-textDark dark:placeholder:text-gray-400"
            />
          </div>

          {/* Semester / Year */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-textDark">
              {selectedProgramme?.academicstructure === "Yearly"
                ? "Select Year"
                : "Select Semester"}
            </label>
            <select
              name="semyear"
              value={uploadData.semyear}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-lg  bg-transparent dark:bg-gray-900 dark:text-textDark"
            >
              <option value="">
                {selectedProgramme?.academicstructure === "Yearly"
                  ? "Select Year"
                  : "Select Semester"}
              </option>

              {selectedProgramme?.academicstructure === "Yearly" ? (
                <>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </>
              ) : (
                <>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                  <option value="5th Semester">5th Semester</option>
                  <option value="6th Semester">6th Semester</option>
                  <option value="7th Semester">7th Semester</option>
                  <option value="8th Semester">8th Semester</option>
                </>
              )}
            </select>
          </div>

          {/* Verified (Admin Only) */}
          {userDetails?.role === "admin" && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium dark:text-textDark">
                Verified
              </label>
              <button
                type="button"
                onClick={() =>
                  setUploadData({
                    ...uploadData,
                    isVerified: !uploadData.isVerified,
                  })
                }
                className={`w-12 h-6 flex items-center rounded-full pr-1 duration-300 ${
                  uploadData.isVerified
                    ? "bg-lightGreen"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <div
                  className={`bg-light dark:bg-gray-200 w-8 h-6 rounded-full shadow-md transform duration-300 ${
                    uploadData.isVerified ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-textDark">
              Select File
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.add(
                  "border-green-400",
                  "bg-green-50"
                );
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove(
                  "border-green-400",
                  "bg-green-50"
                );
              }}
              onClick={() => document.getElementById("fileInput").click()}
              className="flex flex-col items-center justify-center w-full p-5 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
            >
              {!file ? (
                <>
                  <HiOutlineUpload className="text-3xl text-subTextLight dark:text-subTextDark mb-2" />
                  <p className="text-subTextLight dark:text-subTextDark text-sm text-center">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      Click to upload
                    </span>{" "}
                    or <span className="font-medium">drag and drop</span> your
                    PDF here
                  </p>
                  <p className="text-xs text-subTextLight dark:text-subTextDark mt-1">
                    (Max size: 25 MB)
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex flex-col items-center bg-light dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md p-3 shadow-sm w-full">
                    <div className="flex items-center gap-2">
                      <VscFilePdf className="text-2xl text-red-600 dark:text-red-400" />
                      <span className="text-textLight dark:text-textDark font-medium truncate">
                        {file.name}
                      </span>
                    </div>
                    <p className="text-xs text-subTextLight dark:text-subTextDark mt-1">
                      {file.size ? formatFileSize(file.size) : "unknown size"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="flex items-center gap-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm mt-2"
                  >
                    <HiOutlineX /> Remove File
                  </button>
                </div>
              )}
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-lightGreen text-white px-4 py-2 rounded-lg hover:bg-darkGreen transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <HiOutlineUpload /> {isEdit ? "Update" : "Upload"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
