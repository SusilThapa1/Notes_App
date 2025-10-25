import { useState, useEffect } from "react";
import {
  HiOutlineDownload,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineUpload,
} from "react-icons/hi";
import { TiEyeOutline } from "react-icons/ti";
import { toast } from "react-toastify";
import { deleteUpload, fetchMyUploads } from "../../../Services/uploadService";
import UploadModal from "../Modal/UploadModal";
import { MyUploadCardLoader } from "../Loader/CardLoader";
import { useAlerts } from "../../../Utils/alertHelper";
import { MdOutlineVerifiedUser } from "react-icons/md";
import FileViewerModal from "../Modal/FileViewerModal";
import { FcSearch } from "react-icons/fc";

const MyUploads = () => {
  const { showConfirm } = useAlerts();
  const [myUploads, setMyUploads] = useState([]);
  const [filteredUploads, setFilteredUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
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

  console.log(filteredUploads);
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
          file.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.semyear?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.universityID?.universityfullname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUploads(filtered);
  }, [searchTerm, activeFilter, myUploads]);

  const handleDelete = async (id) => {
    const response = await showConfirm({
      title: "Are you sure you want to delete?",
      text: "You won't be able to revert this!",
    });
    if (!response.isConfirmed) return;

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

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileClick = (upload) => {
    setSelectedFile({
      url: import.meta.env.VITE_API_FILE_URL + upload.filepath,
      name: upload.filename,
      id: upload._id,
    });
  };

  const filterButtons = [
    { key: "all", label: "All" },
    { key: "notes", label: "Notes" },
    { key: "syllabus", label: "Syllabus" },
    { key: "questions", label: "Questions" },
  ];

  return (
    <div className="w-full mx-auto mt-20 flex flex-col items-center bg-transparent dark:bg-dark pb-5 rounded-lg px-5 md:px-10 lg:px-20">
      {/* Header */}
      <div className="w-full flex flex-col items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-semibold text-lightGreen dark:text-darkGreen">
          My Uploads
        </h2>

        {/* Search bar */}
        <div className="flex justify-between items-center gap-5 w-full">
          <div className="flex justify-between items-center w-full px-2 py-2 bg-transparent dark:bg-gray-900 border-2 border-slate-100 dark:border-gray-600 shadow-md rounded-xl">
            <FcSearch size={15} />
            <input
              type="text"
              placeholder={`Search uploads...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none dark:text-gray-200 dark:placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-addNormal text-white px-2 py-2 rounded-lg hover:bg-addHover transition-all mt-2 min-w-max"
          >
            <HiOutlineUpload className="text-xl" />
            Upload Resource
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setActiveFilter(btn.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeFilter === btn.key
                ? "bg-lightGreen dark:bg-darkGreen text-white border-gray-200 dark:border-gray-600"
                : "bg-light dark:bg-gray-800 text-subTextLight dark:text-subTextDark border-gray-300 dark:border-gray-600 hover:bg-lightGreen/10 dark:hover:bg-gray-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Uploads Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {[...Array(6)].map((_, i) => (
            <MyUploadCardLoader key={i} />
          ))}
        </div>
      ) : filteredUploads.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {filteredUploads.map((file) => (
            <div
              key={file._id}
              className="p-4 border border-yellow-50 dark:border-gray-800 shadow-md rounded-xl hover-supported:hover:shadow-lg transition-all duration-300 hover-supported:hover:border-gray-200 dark:hover-supported:hover:border-gray-500 bg-light dark:bg-gray-900 flex flex-col gap-3"
            >
              <h1 className="flex items-center text-lg font-semibold text-textLight dark:text-textDark">
                {file.programmeID?.programmeshortname}
                {" - "}
                {file.universityID?.universityfullname} (
                {file.universityID?.universityshortname})
              </h1>

              <div className="flex items-center text-base text-subTextLight dark:text-subTextDark gap-1">
                <h3>{file.courseCode}</h3> - <p>{file.courseName}</p>
              </div>

              <div className="flex gap-2 items-center flex-wrap mt-2">
                <span className="px-2 py-1 bg-lightGreen dark:bg-darkGreen text-white rounded-md text-sm">
                  {file.semyear}
                </span>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-subTextLight dark:text-subTextDark rounded-md text-sm">
                  {new Date(file.createdAt).toLocaleDateString()}
                </span>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    file.isVerified
                      ? "bg-addNormal/20 text-addNormal dark:text-green-400"
                      : "bg-deleteNormal/20 text-deleteNormal dark:text-red-400"
                  }`}
                >
                  {file.isVerified ? (
                    <>
                      <MdOutlineVerifiedUser className="text-lg" />
                      Verified by Admin
                    </>
                  ) : (
                    <>
                      <img
                        loading="lazy"
                        src="/file_search.gif"
                        alt="verifying"
                        className="h-5 w-5 bg-transparent"
                      />
                      Under Verification
                    </>
                  )}
                </div>
              </div>

              <hr className="  border border-gray-300 dark:border-gray-800" />

              <div className="flex justify-between items-center gap-2  ">
                <button
                  onClick={() => handleFileClick(file)}
                  className="flex items-center gap-1 border border-lightGreen dark:border-darkGreen text-lightGreen dark:text-darkGreen px-2 py-1 rounded-md text-sm hover-supported:hover:bg-lightGreen dark:hover-supported:hover:bg-darkGreen hover-supported:hover:text-white transition"
                >
                  <TiEyeOutline /> View
                </button>
                <div className="flex justify-between items-center gap-5">
                  <button
                    onClick={() => handleEdit(file)}
                    className="flex items-center gap-1 border border-editOutlineText text-editOutlineText px-2 py-1 rounded-md text-sm hover-supported:hover:bg-editNormal hover-supported:hover:text-white hover-supported:hover:border-editNormal transition"
                  >
                    <HiOutlinePencil /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="flex items-center gap-1 border border-deleteOutlineText text-deleteOutlineText px-2 py-1 rounded-md text-sm hover-supported:hover:bg-deleteNormal hover-supported:hover:text-white hover-supported:hover:border-deleteNormal transition"
                  >
                    <HiOutlineTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-subTextLight dark:text-subTextDark italic text-center w-full mt-6">
          You haven't uploaded any files yet.
        </p>
      )}

      {selectedFile && (
        <FileViewerModal
          isOpen={true}
          onClose={() => setSelectedFile(null)}
          fileUrl={selectedFile.url}
          fileName={selectedFile.name}
          fileId={selectedFile.id}
        />
      )}

      {/*  Upload Modal */}
      {isUploadModalOpen && (
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          // resource={resourceSelected}
          onUploadComplete={fetchUploads}
        />
      )}

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
