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
  const { programmeLists } = useContext(ProgrammesContext);
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
        university: existingData.university || "",
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

    if (!isEdit && !file) {
      return toast.error("Please select a file to upload.");
    }

    try {
      setLoading(true);

      let filepath = uploadData.filepath;
      let filename = uploadData.filename;

      // Upload new file if selected
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

      const payload = {
        university: uploadData.university,
        resources: uploadData.resources,
        programme: uploadData.programme,
        courseCode: uploadData.courseCode,
        courseName: uploadData.courseName,
        academicstructure: selectedProgramme?.academicstructure || "Semester",
        semyear: uploadData.semyear,
        filepath,
        filename,
        isVerified: uploadData.isVerified,
      };

      let response;
      if (isEdit && uploadData._id) {
        response = await updateUpload(uploadData._id, payload);
      } else {
        response = await addUpload(payload);
      }

      if (response.success) {
        toast.success(response.message || "File uploaded successfully!");
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <HiOutlineX size={20} />
        </button>

        <h2 className="text-xl text-center font-semibold mb-4 text-gray-700">
          {isEdit ? "Edit Upload" : "Upload File"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {/* University */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Choose University
            </label>
            <select
              name="university"
              value={uploadData.university}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
            >
              <option value="">Select University</option>
              {[
                "Tribhuvan University",
                "Kathmandu University",
                "Purbanchal University",
                "Pokhara University",
                "Mid-West University",
                "Far-Western University",
                "Lumbini Buddhist University",
                "Agriculture and Forestry University",
              ].map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>

          {/* Resource */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Resource Type
            </label>
            <select
              name="resources"
              value={uploadData.resources}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-200"
            >
              <option value="">Select Type</option>
              <option value="syllabus">Syllabus</option>
              <option value="notes">Notes</option>
              <option value="questions">Questions</option>
            </select>
          </div>

          {/* Programme */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Programme Name
            </label>
            <select
              name="programme"
              value={uploadData.programme}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300"
            >
              <option value="">Select Programme</option>
              {programmeLists.map((programme) => (
                <option key={programme._id} value={programme._id}>
                  {programme.programmefullname} ({programme.programmeshortname})
                </option>
              ))}
            </select>
            {selectedProgramme && (
              <p className="text-xs text-gray-500 mt-1">
                Academic Structure:{" "}
                <span className="font-medium text-gray-700">
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
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300"
            />
            <input
              type="text"
              name="courseName"
              value={uploadData.courseName}
              onChange={handleChange}
              placeholder="Course Name"
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Semester / Year */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {selectedProgramme?.academicstructure === "Yearly"
                ? "Select Year"
                : "Select Semester"}
            </label>
            <select
              name="semyear"
              value={uploadData.semyear}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-300"
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
              <label className="text-sm font-medium">Verified</label>
              <button
                type="button"
                onClick={() =>
                  setUploadData({
                    ...uploadData,
                    isVerified: !uploadData.isVerified,
                  })
                }
                className={`w-12 h-6 flex items-center rounded-full pr-1 duration-300 ${
                  uploadData.isVerified ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-8 h-6 rounded-full shadow-md transform duration-300 ${
                    uploadData.isVerified ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select File
            </label>

            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center w-full p-5 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
            >
              {!file ? (
                <>
                  <HiOutlineUpload className="text-3xl text-gray-500 mb-2" />
                  <p className="text-gray-600 text-sm">
                    Click to{" "}
                    <span className="text-blue-600 font-medium">
                      upload a PDF
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">(Max size: 5 MB)</p>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex flex-col items-center bg-white border border-gray-200 rounded-md p-3 shadow-sm w-full">
                    <div className="flex items-center gap-2">
                      <VscFilePdf className="text-2xl text-red-600" />
                      <span className="text-gray-700 font-medium truncate">
                        {file.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {file.size ? formatFileSize(file.size) : "unknown size"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm mt-2"
                  >
                    <HiOutlineX /> Remove File
                  </button>
                </div>
              )}
            </label>

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
            className="w-full flex items-center justify-center gap-2 bg-lightGreen text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
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
