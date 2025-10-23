import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProgrammesContext } from "../Context/ProgrammeContext";
import Loader from "../Loader/Loader";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const FileViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { uploads, loading } = useContext(ProgrammesContext);

  const file = uploads.find((u) => u._id === id);

  const workerUrl =
    "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  // Call plugin at top-level
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (loading) return <Loader />;

  if (!file)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-subTextLight dark:text-subTextDark">
        <p className="text-lg">File not found 😢</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Go Back
        </button>
      </div>
    );

  const fileUrl = import.meta.env.VITE_API_FILE_URL + file.filepath;

  return (
    <div className="flex flex-col mt-20  md:px-10 lg:px-20">
      {/* PDF Viewer */}
      <div className="h-[calc(100vh-72px)] overflow-y-auto flex justify-center bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner border-none">
        <Worker workerUrl={workerUrl}>
          <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      </div>
    </div>
  );
};

export default FileViewer;
