// Table.jsx
import { FaTrash } from "react-icons/fa";
import { useContext, useState } from "react";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import { deleteUpload } from "../../../Services/uploadService";
import { toast } from "react-toastify";
import { showConfirm } from "../../../Utils/alertHelper";
import { HiOutlineCheck, HiOutlineX } from "react-icons/hi";
import FileViewerModal from "../Modal/FileViewerModal";
import UploadModal from "../Modal/UploadModal";

const Table = ({ resource }) => {
  const { setUploads, fetchAllData } = useContext(ProgrammesContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState(null);

  const handleDelete = async (id) => {
    const response = await showConfirm({
      title: "Are you sure you want to delete?",
      text: "You won't be able to revert this!",
    });
    if (!response.isConfirmed) return;

    try {
      const deleteResponse = await deleteUpload(id);
      if (deleteResponse.success) {
        toast.success(deleteResponse.message);
        setUploads((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete resource"
      );
    }
  };

  const handleEdit = (upload) => {
    setSelectedUpload(upload);
    setIsEditModalOpen(true);
  };

  const handleFileClick = (upload) => {
    setSelectedFile({
      url: import.meta.env.VITE_API_FILE_URL + upload.filepath,
      name: upload.filename,
      id: upload._id,
    });
  };

  return (
    <>
      <div className="overflow-x-auto bg-transparent dark:bg-gray-900 rounded-lg shadow-md">
        <table className="w-full text-center border border-gray-200 dark:border-gray-600 min-w-[600px]">
          <thead className="bg-lightGreen dark:bg-darkGreen text-white">
            <tr className="border-b border-gray-300 dark:border-gray-600  ">
              <th className="p-2 w-[5%] border-r border-gray-300 dark:border-gray-600 rounded-tl-lg">
                S.N.
              </th>
              <th className="p-2 border-r border-gray-300 dark:border-gray-600 ">
                University
              </th>
              <th className="p-2 border-r border-gray-300 dark:border-gray-600 ">
                Programme
              </th>
              <th className="p-2 border-r border-gray-300 dark:border-gray-600 ">
                Semester/Year
              </th>
              <th className="p-2 border-r border-gray-300 dark:border-gray-600 ">
                Owner
              </th>
              <th className="p-2 border-r border-gray-300 dark:border-gray-600 ">
                File Preview
              </th>
              <th className="p-2 border-r border-gray-300 dark:border-gray-600 ">
                Status
              </th>
              <th className="p-2 w-[15%] lg:w-[10%] rounded-tr-lg ">Actions</th>
            </tr>
          </thead>

          <tbody className="[&_td]:align-middle">
            {resource
              .sort((a, b) => a.semyear.localeCompare(b.semyear))
              .map((upload, index) => (
                <tr
                  key={upload._id}
                  className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <td className="p-2 border-r border-gray-300 dark:border-gray-600 text-textLight dark:text-textDark">
                    {index + 1}.
                  </td>
                  <td className="p-2 border-r border-gray-300 dark:border-gray-600 text-textLight dark:text-textDark">
                    {upload.universityID?.universityfullname}
                  </td>
                  <td className="p-2 border-r border-gray-300 dark:border-gray-600 text-textLight dark:text-textDark">
                    {upload.programmeID?.programmefullname || "N/A"}
                  </td>
                  <td className="p-2 border-r border-gray-300 dark:border-gray-600 text-textLight dark:text-textDark">
                    {upload?.semyear}
                  </td>
                  <td className="p-2 border-r border-gray-300 dark:border-gray-600 flex items-center gap-2 justify-center text-textLight dark:text-textDark">
                    <img
                      loading="lazy"
                      src={
                        upload?.userID?.profilepath
                          ? import.meta.env.VITE_API_FILE_URL +
                            upload?.userID?.profilepath
                          : "/profile.png"
                      }
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      alt={upload?.userID?.username || "profile"}
                    />
                    <span>{upload?.userID?.username}</span>
                  </td>
                  <td className="p-2 border-r border-gray-300 dark:border-gray-600">
                    <button
                      onClick={() => handleFileClick(upload)}
                      className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      {upload?.filename}
                    </button>
                  </td>
                  <td className="p-2 border-r border-gray-300 dark:border-gray-600">
                    <div className="flex justify-center items-center">
                      {upload?.isVerified ? (
                        <HiOutlineCheck
                          className="text-lightGreen dark:text-green-400 text-xl"
                          title="Verified"
                        />
                      ) : (
                        <HiOutlineX
                          className="text-red-600 dark:text-red-400 text-xl"
                          title="Not Verified"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-center flex justify-center items-center gap-3 text-textLight dark:text-textDark">
                    <button
                      onClick={() => handleEdit(upload)}
                      className="text-cyan-500 dark:text-cyan-400 text-lg hover:text-cyan-700 dark:hover:text-cyan-300 transition"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(upload._id)}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-600 transition"
                      title="Delete"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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

      {isEditModalOpen && (
        <UploadModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          existingData={selectedUpload}
          isEdit={true}
          onUploadComplete={fetchAllData}
        />
      )}
    </>
  );
};

export default Table;
