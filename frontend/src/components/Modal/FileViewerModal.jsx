import React from "react";
import { IoClose } from "react-icons/io5";
import { HiOutlineExternalLink } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const FileViewerModal = ({ isOpen, onClose, fileUrl, fileName, fileId }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const fileType = fileUrl?.split(".").pop()?.toLowerCase();

  const renderPreview = () => {
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(fileType)) {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="max-h-[75vh] mx-auto rounded-lg object-contain"
        />
      );
    } else if (fileType === "pdf") {
      return (
        <iframe
          src={fileUrl}
          title={fileName}
          allowFullScreen
          className="w-full h-[75vh] rounded-lg"
        />
      );
    } else {
      return (
        <div className="text-center py-10 text-gray-700">
          <p className="mb-4">Preview not available for this file type.</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Open in new tab
          </a>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[95%] md:w-[80%] max-w-4xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-gray-700 hover:text-red-600"
        >
          <IoClose size={26} />
        </button>

        {/* Header */}
        <div className="px-5 pt-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">{fileName}</h2>

          <button
            onClick={() => navigate(`/study/view/${fileId}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition text-sm font-medium"
          >
            <HiOutlineExternalLink /> View Full Page
          </button>
        </div>

        {/* Preview */}
        <div className="p-5">{renderPreview()}</div>
      </div>
    </div>
  );
};

export default FileViewerModal;
