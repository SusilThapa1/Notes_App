import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { HiOutlineExternalLink } from "react-icons/hi";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const FileViewerModal = ({ isOpen, onClose, fileUrl, fileName, fileId }) => {
  const navigate = useNavigate();
  const location = useLocation()
  if (!isOpen) return null;

  const workerUrl =
    "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  // Call plugin at top-level
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const fileType = fileUrl?.split(".").pop()?.toLowerCase();

  const renderPreview = () => {
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(fileType)) {
      return (
        <img
          loading="lazy"
          src={fileUrl}
          alt={fileName}
          className="max-h-[60vh] mx-auto rounded-lg object-contain"
        />
      );
    }

    if (fileType === "pdf") {
      return (
        <div className="h-[80vh] overflow-y-auto bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <Worker workerUrl={workerUrl}>
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
          </Worker>
        </div>
      );
    }

    return (
      <p className="text-center text-subTextLight dark:text-subTextDark py-10">
        Preview not available for this file type.
      </p>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50  backdrop-blur-lg flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-light dark:bg-dark rounded-lg shadow-lg w-[95%] md:w-[80%] max-w-4xl relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-0 right-1 text-textLight dark:text-textDark hover-supported:hover:text-red-600 z-40"
        >
          <IoClose size={26} />
        </button>

        <div className="px-5 pt-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-light dark:bg-dark z-20">
          <h2 className="text-lg font-semibold text-textLight dark:text-textDark truncate">
            {fileName}
          </h2>
          <button
            onClick={() => navigate(`${location.pathname}/${fileId}`)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition text-sm font-medium"
          >
            <HiOutlineExternalLink /> View Full Page
          </button>
        </div>

        <div className="p-5 overflow-y-auto">{renderPreview()}</div>
      </div>
    </div>
  );
};

export default FileViewerModal;
