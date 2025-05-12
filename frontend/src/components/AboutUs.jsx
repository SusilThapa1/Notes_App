import {
  FaChalkboardTeacher,
  FaBookOpen,
  FaCloudUploadAlt,
  FaLink,
  FaCogs,
  FaShieldAlt,
  FaFolderOpen,
} from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="text-center">
      <div className="p-2 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">About Us</h1>
        <p className="text-gray-700 md:text-center text-justify mb-4">
          Welcome to the official Course Hub for Purbanchal University. Our
          mission is simple — make access to verified academic materials fast,
          organized, and admin-controlled.
        </p>
        <p className="text-gray-700 mb-6">
          From syllabi to past papers, everything is uploaded and managed by
          trusted admins to ensure quality and reliability.
        </p>
      </div>

      {/* Features Section */}
      <div className="mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="p-6 rounded-lg shadow-md text-center">
          <FaChalkboardTeacher className="text-4xl text-gray-900 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900">Admin Control</h2>
          <p className="text-gray-700 mt-2">
            Only admins are allowed to upload and manage academic content.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md text-center">
          <FaCloudUploadAlt className="text-4xl text-gray-900 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Direct Uploads
          </h2>
          <p className="text-gray-700 mt-2">
            Admins can upload PDFs like notes, questions, and model sets
            instantly.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md text-center">
          <FaLink className="text-4xl text-gray-900 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Google Drive Links
          </h2>
          <p className="text-gray-700 mt-2">
            Share direct links to organized folders for each semester or
            subject.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md text-center">
          <FaBookOpen className="text-4xl text-gray-900 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Sorted Resources
          </h2>
          <p className="text-gray-700 mt-2">
            All materials are categorized by program and semester for easy
            navigation.
          </p>
        </div>

        {/* <div className="p-6 rounded-lg shadow-md text-center">
          <FaFolderOpen className="text-4xl text-gray-900 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Folder Management
          </h2>
          <p className="text-gray-700 mt-2">
            Admins can create folders and subfolders to organize documents
            better.
          </p>
        </div> */}

        <div className="p-6 rounded-lg shadow-md text-center">
          <FaShieldAlt className="text-4xl text-gray-900 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            Verified Materials Only
          </h2>
          <p className="text-gray-700 mt-2">
            No public uploads — everything is curated by trusted admins for
            quality.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md text-center">
          <FaCogs className="text-4xl text-gray-900 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            More Features Coming
          </h2>
          <p className="text-gray-700 mt-2">
            Stay tuned for file analytics, edit history, and more tools just for
            admins.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
