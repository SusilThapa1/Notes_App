import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useContext } from "react";
import { ProgrammesContext } from "../components/Context/ProgrammeContext";

const FileViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { uploads } = useContext(ProgrammesContext);

  const file = uploads.find((u) => u._id === id);

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p className="text-lg">File not found 😢</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const fileUrl = import.meta.env.VITE_API_FILE_URL + file.filepath;
  const fileType = file.filename.split(".").pop().toLowerCase();

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-lightGreen"
        >
          <IoArrowBack size={22} /> Back
        </button>
        <h1 className="text-lg font-semibold text-gray-800">{file.filename}</h1>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-md p-3">
        {["png", "jpg", "jpeg", "gif", "webp"].includes(fileType) ? (
          <img
            src={fileUrl}
            alt={file.filename}
            className="mx-auto max-h-[80vh] object-contain"
          />
        ) : fileType === "pdf" ? (
          <iframe
            src={fileUrl}
            title={file.filename}
            allowFullScreen
            className="w-full h-[85vh] rounded-lg"
          />
        ) : (
          <div className="text-center py-20 text-gray-700">
            <p>Preview not available for this file type.</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Open in new tab
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer;
