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
    year: "",
    semyear: "",
    isVerified: false,
    filename: "",
    filepath: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Preload when editing
  useEffect(() => {
    if (isEdit && existingData) {
      setUploadData({
        university: existingData.universityID?._id || "",
        resources: existingData.resources || "",
        programme: existingData.programmeID?._id || "",
        courseCode: existingData.courseCode || "",
        courseName: existingData.courseName || "",
        year: existingData.year || "",
        semyear: existingData.semyear || "",
        filename: existingData.filename || "",
        filepath: existingData.filepath || "",
        _id: existingData._id || "",
        isVerified: existingData.isVerified || false,
      });

      if (existingData.filepath && existingData.filename) {
        setFile({
          name: existingData.filename,
          previewUrl: existingData.filepath,
          size: 0,
        });
      }
    }
  }, [isEdit, existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUploadData({ ...uploadData, [name]: value });
  };

  // File handling
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const maxSizeMB = 25;
    if (selectedFile.size / (1024 * 1024) > maxSizeMB) {
      toast.error(`File size exceeds ${maxSizeMB} MB limit`);
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (droppedFile.size / (1024 * 1024) > 25) {
      toast.error("File size exceeds 25 MB limit");
      return;
    }
    setFile(droppedFile);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    const {
      resources,
      university,
      programme,
      courseCode,
      courseName,
      year,
      semyear,
    } = uploadData;

    // Conditional validation
    if (!university || !resources || !programme || !semyear) {
      return toast.error("Please fill all required fields.");
    }

    if (resources !== "questions" && (!courseCode || !courseName)) {
      return toast.error("Course Code and Course Name are required.");
    }

    if (resources === "questions" && !year) {
      return toast.error("Please select a year for questions.");
    }

    if (!isEdit && !file) {
      return toast.error("Please select a file to upload.");
    }

    try {
      setLoading(true);

      let filepath = uploadData.filepath;
      let filename = uploadData.filename;

      // Upload file if new one selected
      if (file && file instanceof File) {
        const res = await uploadFile(file, uploadData.resources);
        if (!res?.fileUrl) {
          toast.error("File upload failed.");
          setLoading(false);
          return;
        }
        filepath = res.fileUrl;
        filename = res.originalName;
      }

      const selectedProgramme = programmeLists.find(
        (p) => p._id === uploadData.programme
      );

      console.log(selectedProgramme?.academicstructure);
      const payload = {
        university,
        resources,
        programme,
        courseCode: courseCode || "",
        courseName: courseName || "",
        year: year || "",
        semyear,
        academicstructure: selectedProgramme?.academicstructure || "Semester",
        isVerified: uploadData.isVerified,
      };

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
        onUploadComplete?.();
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
      <div className="bg-light dark:bg-dark rounded-lg shadow-lg w-full max-w-lg p-6 relative overflow-auto scroll-container max-h-[95vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-subTextLight dark:text-subTextDark hover:text-red-600 hover:dark:text-red-600"
        >
          <HiOutlineX size={20} />
        </button>

        <h2 className="text-xl text-center font-semibold mb-2 text-textLight dark:text-textDark">
          {isEdit ? "Edit Upload" : "Upload File"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* University */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-textDark">
              Choose University
            </label>
            <select
              name="university"
              value={uploadData.university}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-textDark"
            >
              <option value="">Select University</option>
              {universityLists.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.universityfullname} ({u.universityshortname})
                </option>
              ))}
            </select>
          </div>

          {/* Resource Type */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-textDark">
              Resource Type
            </label>
            <select
              name="resources"
              value={uploadData.resources}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-textDark"
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
              className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-textDark"
            >
              <option value="">Select Programme</option>
              {programmeLists.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.programmefullname} ({p.programmeshortname})
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

          {/* Conditional Fields */}
          {uploadData.resources === "questions" ? (
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-textDark">
                Select Year
              </label>
              <select
                name="year"
                value={uploadData.year}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-transparent border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-textDark"
              >
                <option value="">Select Year</option>
                {Array.from(
                  { length: new Date().getFullYear() - 2019 },
                  (_, i) => 2020 + i
                ).map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                name="courseCode"
                value={uploadData.courseCode}
                onChange={handleChange}
                placeholder="Course Code"
                className="flex-1 px-3 py-2 border rounded-lg bg-transparent border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-textDark"
              />
              <input
                type="text"
                name="courseName"
                value={uploadData.courseName}
                onChange={handleChange}
                placeholder="Course Name"
                className="flex-1 px-3 py-2 border rounded-lg bg-transparent border-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-textDark"
              />
            </div>
          )}

          {/* Semester / Year */}
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-textDark">
              {selectedProgramme
                ? selectedProgramme.academicstructure === "Yearly"
                  ? "Select Year"
                  : "Select Semester"
                : "Select Semester / Year"}
            </label>

            <select
              name="semyear"
              value={uploadData.semyear}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-400 dark:border-gray-600 rounded-lg bg-transparent dark:bg-gray-900 dark:text-textDark"
            >
              <option value="">
                {selectedProgramme
                  ? selectedProgramme.academicstructure === "yearly"
                    ? "Select Year"
                    : "Select Semester"
                  : "Select Semester / Year"}
              </option>

              {selectedProgramme &&
                (selectedProgramme.academicstructure === "yearly" ? (
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
                ))}
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
                className={`w-12 h-6 flex items-center rounded-full transition-all ${
                  uploadData.isVerified
                    ? "bg-lightGreen"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <div
                  className={`bg-light dark:bg-gray-200 w-6 h-6 rounded-full shadow-md transform transition-transform ${
                    uploadData.isVerified ? "translate-x-6" : ""
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
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("fileInput").click()}
              className="flex flex-col items-center justify-center w-full pb-5 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            >
              {!file ? (
                <>
                  <HiOutlineUpload className="text-3xl text-subTextLight dark:text-subTextDark mb-2" />
                  <p className="text-subTextLight dark:text-subTextDark text-sm">
                    Click or drag to upload your PDF
                  </p>
                  <p className="text-xs text-subTextLight dark:text-subTextDark">
                    (Max size: 25 MB)
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex flex-col flex-wrap over items-center gap-2 bg-light dark:bg-gray-700 p-3 rounded-md border border-gray-300 dark:border-gray-600 w-full justify-between">
                    <div className="flex items-center gap-2">
                      <VscFilePdf className="text-2xl text-red-600 dark:text-red-400" />
                      <span className="text-textLight dark:text-textDark font-medium truncate">
                        {file.name}
                      </span>
                    </div>
                    <p className="text-xs text-subTextLight dark:text-subTextDark">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 text-sm flex items-center gap-1"
                  >
                    <HiOutlineX /> Remove File
                  </button>
                </div>
              )}
            </div>
            <input
              type="file"
              id="fileInput"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-lightGreen text-white px-4 py-2 rounded-lg hover:bg-darkGreen transition disabled:opacity-50"
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
