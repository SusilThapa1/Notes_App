import { useState, useContext, useMemo, useEffect } from "react";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import UploadModal from "../Modal/UploadModal";
import { TiEyeOutline } from "react-icons/ti";
import { HiOutlineUpload } from "react-icons/hi";
import { FcSearch } from "react-icons/fc";
import FileViewerModal from "../Modal/FileViewerModal";
import { CardLoader } from "../Loader/CardLoader";

const FileCard = ({
  file,
  id,
  university,
  programme,
  courseCode,
  courseName,
  year,
  uploaderImage,
  uploadedBy,
  uploadDate,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileClick = (upload) => {
    setSelectedFile({
      url: import.meta.env.VITE_API_FILE_URL + upload.filepath,
      name: upload.filename,
      id: upload._id,
    });
  };

  return (
    <div className="p-4 border-2 border-yellow-50 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-100 dark:hover:border-gray-600   dark:bg-gray-900 dark:text-textDark flex flex-col gap-3 justify-between">
      <h1 className="flex items-center text-lg gap-1">
        {programme.programmeshortname}
        {" - "}
        {university.universityfullname}({university.universityshortname})
      </h1>
      <div className="flex items-center text-base text-subTextLight dark:text-subTextDark gap-1">
        <h3>{courseCode}</h3>-<p>{courseName}</p>
      </div>

      <div className="flex gap-2 items-center">
        <span className="border border-gray-300 dark:border-gray-600 px-2 py-1 bg-lightGreen rounded-lg text-white">
          {year}
        </span>
        <span className="border border-gray-300 dark:border-gray-600 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-subTextLight dark:text-subTextDark">
          {uploadDate}
        </span>
      </div>
      <hr className="w-full  px-1 border border-gray-300 dark:border-gray-700" />

      <div className="flex justify-between items-center">
        <p className="text-sm text-subTextLight dark:text-subTextDark flex items-center gap-2">
          <img
            loading="lazy"
            src={
              uploaderImage
                ? `${import.meta.env.VITE_API_FILE_URL + uploaderImage}`
                : "/profile.png"
            }
            alt="Profile"
            className="inline-block w-10 h-10 rounded-full object-cover"
          />
          By {uploadedBy}
        </p>

        <button
          onClick={() => handleFileClick(file)}
          className="flex-1 flex items-center justify-center gap-1 border border-lightGreen dark:border-darkGreen text-lightGreen   hover:text-white px-4 py-1 rounded-md hover:bg-darkGreen dark:hover:text-textDark  transition-colors duration-500 max-w-max"
        >
          <TiEyeOutline />
          View
        </button>
      </div>

      {selectedFile && (
        <FileViewerModal
          isOpen={true}
          onClose={() => setSelectedFile(null)}
          fileUrl={selectedFile.url}
          fileName={selectedFile.name}
          fileId={selectedFile.id}
        />
      )}
    </div>
  );
};

// =========================
//  Main Component
// =========================
const Courses = ({ resource, programme, university, structure }) => {
  const { uploads, fetchAllData, loading } = useContext(ProgrammesContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced value
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states

  const [selectedCourse, setSelectedCourse] = useState("");

  // Debounce effect — wait 500ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Derive base uploads that match params
  const filteredBaseUploads = uploads.filter(
    (file) =>
      file.resources?.toLowerCase() === resource?.toLowerCase() &&
      file.programmeID?.programmeshortname?.toLowerCase() ===
        programme?.toLowerCase().replaceAll("-", " ") &&
      file.universityID?.universityshortname?.toLowerCase() ===
        university?.toLowerCase() &&
      file.semyear?.toLowerCase() ===
        structure?.toLowerCase().replaceAll("-", " ")
  );

  // Build course dropdown
  const courses = useMemo(() => {
    return [...new Set(filteredBaseUploads.map((f) => f.courseName))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [filteredBaseUploads]);

  // Final filtering logic — runs only when typing stops
  const filteredFiles = filteredBaseUploads.filter((file) => {
    const term = debouncedSearch.toLowerCase();
    const matchSearch =
      !term ||
      file.filename?.toLowerCase().includes(term) ||
      file.courseName?.toLowerCase().includes(term) ||
      file.courseCode?.toLowerCase().includes(term);

    const matchFilters =
      !selectedCourse ||
      file.courseName?.toLowerCase() === selectedCourse.toLowerCase();

    return file.isVerified && matchSearch && matchFilters;
  });
  return (
    <div className="mt-4">
      {/* Filter Box */}
      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        className="w-max mb-5 border border-yellow-50 dark:border-gray-600 p-2 rounded-lg shadow-sm bg-transparent  dark:bg-gray-900 dark:text-textDark"
      >
        <option value="">All Courses</option>
        {courses.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Search and Upload */}
      <div className="flex gap-4 justify-between items-center mb-4">
        <div className="flex justify-between items-center w-full px-3 py-2 bg-transparent border border-yellow-50 dark:border-gray-600 shadow-md rounded-xl dark:bg-gray-900">
          <FcSearch size={20} />
          <input
            type="text"
            placeholder={`Search ${resource}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none dark:text-textDark dark:placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-lightGreen text-white px-2 md:px-4 py-2 text-sm rounded-lg hover:bg-darkGreen dark:hover:bg-darkGreen transition min-w-max"
        >
          <HiOutlineUpload size={20} />
          <span>Upload</span>
        </button>
      </div>

      {/* File Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardLoader key={i} />
          ))}
        </div>
      ) : filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <FileCard
              key={file._id}
              file={file}
              id={file._id}
              university={file.universityID}
              programme={file.programmeID}
              courseCode={file.courseCode}
              courseName={file.courseName}
              year={file.semyear}
              uploaderImage={file.userID?.profilepath}
              uploadedBy={file.userID?.username || "Anonymous"}
              uploadDate={new Date(file.createdAt).toLocaleDateString()}
              fileName={file.filename}
              fileUrl={file.filepath}
            />
          ))}
        </div>
      ) : (
        <p className="text-subTextLight dark:text-subTextDark italic text-center mt-6">
          No {resource} found for this programme and semester/year.
        </p>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadComplete={fetchAllData}
      />
    </div>
  );
};

export default Courses;
