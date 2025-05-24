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
    <div className="text-center w-full">
      <div className="p-2  ">
        <h1 className="text-2xl md:text-3xl font-bold    text-[#5CAE59] mb-4">
          About Us
        </h1>
        <p className="text-sm md:text-lg text-gray-700 md:text-center text-justify mb-4">
          Welcome to the official Course Hub for Purbanchal University. Our
          mission is simple — make access to verified academic materials fast,
          organized, and admin-controlled.
        </p>
        <p className="text-gray-700 mb-6 text-sm md:text-lg">
          From syllabi to past papers, everything is uploaded and managed by
          trusted admins to ensure quality and reliability.
        </p>
      </div>

      {/* Features Section */}
      <div className="mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 md:w-[95%]   text-[#5CAE59] text-center ">
        <div className="p-6 rounded-3xl md:rounded-2xl  shadow-lg text-center bg-transparent border  border-slate-100 md:hover:scale-110  transition-all duration-500 ">
          <FaChalkboardTeacher className="text-4xl mx-auto mb-3" />
          <h2 className=" md:text-xl font-semibold ">Admin Control</h2>
          <p className="text-gray-700 mt-2">
            Only admins are allowed to upload and manage academic content.
          </p>
        </div>

        <div className="p-6 rounded-3xl md:rounded-2xl  shadow-lg text-center bg-transparent border  border-slate-100 md:hover:scale-110  transition-all duration-500">
          <FaCloudUploadAlt className="text-4xl mx-auto mb-3" />
          <h2 className=" md:text-xl font-semibold ">Direct Uploads</h2>
          <p className="text-gray-700 mt-2">
            Admins can upload PDFs like notes, questions, and model sets
            instantly.
          </p>
        </div>

        <div className="p-6 rounded-3xl md:rounded-2xl  shadow-lg text-center bg-transparent border  border-slate-100 md:hover:scale-110  transition-all duration-500">
          <FaLink className="text-4xl  mx-auto mb-3" />
          <h2 className=" md:text-xl font-semibold ">Google Drive Links</h2>
          <p className="text-gray-700 mt-2">
            Share direct links to organized folders for each semester or
            subject.
          </p>
        </div>

        <div className="p-6 rounded-3xl md:rounded-2xl  shadow-lg text-center bg-transparent border  border-slate-100 md:hover:scale-110  transition-all duration-500">
          <FaBookOpen className="text-4xl mx-auto mb-3" />
          <h2 className=" md:text-xl font-semibold ">Sorted Resources</h2>
          <p className="text-gray-700 mt-2">
            All materials are categorized by program and semester for easy
            navigation.
          </p>
        </div>

        <div className="p-6 rounded-3xl md:rounded-2xl  shadow-lg text-center bg-transparent border  border-slate-100 md:hover:scale-110  transition-all duration-500">
          <FaShieldAlt className="text-4xl  mx-auto mb-3" />
          <h2 className=" md:text-xl font-semibold ">
            Verified Materials Only
          </h2>
          <p className="text-gray-700 mt-2">
            No public uploads — everything is curated by trusted admins for
            quality.
          </p>
        </div>

        <div className="p-6 rounded-3xl md:rounded-2xl  shadow-lg text-center bg-transparent border  border-slate-100 md:hover:scale-110 transition-all duration-500">
          <FaCogs className="text-4xl  mx-auto mb-3" />
          <h2 className=" md:text-xl font-semibold ">More Features Coming</h2>
          <p className="text-gray-700 mt-2">
            Stay tuned for analytics, history track & more tools for admins
            only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
