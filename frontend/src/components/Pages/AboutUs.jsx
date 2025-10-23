import {
  FaChalkboardTeacher,
  FaBookOpen,
  FaCloudUploadAlt,
  FaUsers,
  FaFileAlt,
  FaShieldAlt,
  FaSearch,
  FaMobile,
  FaHeart,
} from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="text-center w-full ">
      <div className="p-2">
        <h1 className="text-2xl md:text-3xl font-bold text-lightGreen mb-4">
          About EasyStudyZone
        </h1>
        <p className="text-sm md:text-lg text-subTextLight dark:text-subTextDark md:text-center text-justify mb-4">
          Welcome to EasyStudyZone - Nepal's growing academic resource sharing
          platform! We connect students from universities across Nepal to share
          and access educational materials, fostering a collaborative learning
          community.
        </p>
        <p className="text-subTextLight dark:text-subTextDark mb-6 text-sm md:text-lg">
          Whether you're from KU, TU, PU, or any other Nepali university, share
          your notes, question papers, and study materials with fellow students
          nationwide. Together, we're building Nepal's largest student-driven
          academic resource hub.
        </p>
      </div>

      {/* Features Section */}
      <div className="mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:w-[95%] text-center">
        {[
          {
            icon: FaCloudUploadAlt,
            title: "Easy Upload System",
            desc: "Upload and share your notes, question papers, and study materials with fellow students in just a few clicks.",
          },
          {
            icon: FaBookOpen,
            title: "All Nepal Universities",
            desc: "Open platform for students from all universities across Nepal - KU, TU, PU, and many more. No restrictions, all are welcome!",
          },
          {
            icon: FaSearch,
            title: "Simple Search",
            desc: "Find study materials easily with our search functionality. Look for specific topics, subjects, or content you need.",
          },
          {
            icon: FaUsers,
            title: "Community Driven",
            desc: "Built by students, for students. Share knowledge, help others, and build a stronger academic community together.",
          },
          {
            icon: FaShieldAlt,
            title: "Secure & Reliable",
            desc: "Secure authentication, file management, and admin moderation ensure quality content and user safety.",
          },
          {
            icon: FaFileAlt,
            title: "PDF Support",
            desc: "Specialized for PDF documents - perfect for notes, question papers, and study materials. View PDFs directly in browser with our built-in viewer.",
          },
          {
            icon: FaMobile,
            title: "Mobile Friendly",
            desc: "Responsive design works seamlessly on all devices. Access your study materials anywhere, anytime.",
          },
          {
            icon: FaChalkboardTeacher,
            title: "Growing Platform",
            desc: "We're constantly evolving! More features like better organization, advanced search, and enhanced user experience coming soon.",
          },
          {
            icon: FaHeart,
            title: "Made for Nepal",
            desc: "Built by Nepali students for Nepali students. Understanding our unique academic culture and needs across the country.",
          },
        ].map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="px-3 py-6 rounded-3xl md:rounded-2xl shadow-lg text-center dark:bg-gray-900 border border-yellow-50 dark:border-gray-800 md:hover-supported:hover:scale-105 transition-all duration-500"
            >
              <Icon className="text-4xl mx-auto mb-3 text-lightGreen " />
              <h2 className="md:text-xl font-semibold dark:text-textDark text-textLight">
                {feature.title}
              </h2>
              <p className="text-subTextLight dark:text-subTextDark mt-2">
                {feature.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutUs;
