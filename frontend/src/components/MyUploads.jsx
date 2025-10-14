import { useState, useEffect } from "react";
import {
  HiOutlineDownload,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import { TiEyeOutline } from "react-icons/ti";
import { toast } from "react-toastify";
import { deleteUpload, fetchMyUploads } from "../../Services/uploadService";
import UploadModal from "./Modal/UploadModal";
import CardLoader from "./Loader/CardLoader";

const MyUploads = () => {
  const [myUploads, setMyUploads] = useState([]);
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const res = await fetchMyUploads();
      if (res.success) {
        setMyUploads(res.data);
        setFilteredUploads(res.data);
      } else {
        toast.error(res.message || "Failed to load uploads.");
      }
    } catch (err) {
      toast.error(err.message || "Error fetching uploads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  // Filter by search term and category
  useEffect(() => {
    let filtered = myUploads;

    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (file) => file.resources?.toLowerCase() === activeFilter
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (file) =>
          file.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.courseCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUploads(filtered);
  }, [searchTerm, activeFilter, myUploads]);

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = import.meta.env.VITE_API_FILE_URL + fileUrl;
    link.setAttribute("download", fileName);
    document.body.append(link);
    link.click();
    link.remove();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this upload?")) return;

    try {
      const res = await deleteUpload(id);
      if (res.success) {
        toast.success("Upload deleted successfully!");
        setMyUploads((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(res.message || "Failed to delete upload.");
      }
    } catch (err) {
      toast.error(err.message || "Error deleting upload.");
    }
  };

  const handleEdit = (upload) => {
    setSelectedUpload(upload);
    setIsEditModalOpen(true);
  };

  const filterButtons = [
    { key: "all", label: "All" },
    { key: "notes", label: "Notes" },
    { key: "syllabus", label: "Syllabus" },
    { key: "questions", label: "Questions" },
  ];

  return (
    <div className="w-full mx-auto h-[calc(100vh-210px)] md:h-[calc(100vh-60px)] mt-20 flex flex-col items-center bg-transparent overflow-y-scroll pb-5 rounded-lg px-5 md:px-10 lg:px-20">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Uploads</h2>

        {/* Search bar */}
        <input
          type="text"
          placeholder="🔍 Search by course name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300  focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setActiveFilter(btn.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeFilter === btn.key
                ? "bg-lightGreen text-white border-[#5CAE59]"
                : "bg-white text-gray-600 border-gray-300 hover:bg-green-100"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Uploads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <CardLoader key={i} />
            ))}
          </>
        ) : filteredUploads.length > 0 ? (
          filteredUploads.map((file) => (
            <div
              key={file._id}
              className="p-4 border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-green-400 bg-white flex flex-col gap-3"
            >
              <h1 className="flex items-center text-lg font-semibold text-gray-700">
                {file.university}
              </h1>

              <div className="flex items-center text-base text-gray-600 gap-1">
                <h3>{file.courseCode}</h3> - <p>{file.courseName}</p>
              </div>

              <div className="flex gap-2 items-center flex-wrap mt-2">
                <span className="px-2 py-1 bg-lightGreen text-white rounded-md text-sm">
                  {file.semyear}
                </span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm">
                  {new Date(file.createdAt).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-sm capitalize">
                  {file.resources}
                </span>
              </div>

              <hr className="my-2" />

              <div className="flex justify-end gap-2 flex-wrap">
                <a
                  href={import.meta.env.VITE_API_FILE_URL + file.filepath}
                  className="flex items-center gap-1 border border-gray-300 px-2 py-1 rounded-md text-sm hover:bg-lightGreen hover:text-white transition"
                >
                  <TiEyeOutline /> View
                </a>
                <button
                  onClick={() => handleDownload(file.filepath, file.filename)}
                  className="flex items-center gap-1 border border-gray-300 px-2 py-1 rounded-md text-sm hover:bg-lightGreen hover:text-white transition"
                >
                  <HiOutlineDownload /> Download
                </button>
                <button
                  onClick={() => handleEdit(file)}
                  className="flex items-center gap-1 border border-blue-400 text-blue-500 px-2 py-1 rounded-md text-sm hover:bg-blue-500 hover:text-white transition"
                >
                  <HiOutlinePencil /> Edit
                </button>
                <button
                  onClick={() => handleDelete(file._id)}
                  className="flex items-center gap-1 border border-red-400 text-red-500 px-2 py-1 rounded-md text-sm hover:bg-red-500 hover:text-white transition"
                >
                  <HiOutlineTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-center w-full mt-6">
            You haven't uploaded any files yet.
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <UploadModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)} 
          existingData={selectedUpload}
          isEdit={true}
          onUploadComplete={fetchUploads}
        />
      )}
    </div>
  );
};

export default MyUploads;
