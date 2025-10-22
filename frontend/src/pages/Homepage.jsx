// Homepage.js
import { Link, useLocation } from "react-router-dom";
import AboutUs from "../components/AboutUs";
import Review from "../components/Review/Review";

const Homepage = () => {
  const location = useLocation();
  const existingReview = location.state?.review || null;

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-light dark:bg-dark transition-colors duration-300">
      {/* Overlay for readability */}
      <div className="relative z-10 mt-20 px-5 md:px-10 lg:px-20 w-full">
        <div className="animate-marqueeLong whitespace-nowrap text-sm md:text-base font-medium text-center text-gray-600 dark:text-gray-300 py-2 w-full">
          You can send feedback or any suggestions directly to :{" "}
          <span className="text-blue-400 dark:text-blue-300">
            eyeh193@gmail.com
          </span>
        </div>

        {/* Hero / Welcome Section */}
        <section
          id="home"
          className="relative flex flex-col gap-3 justify-center items-center h-[400px] mb-10 md:h-[600px] rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-600 text-center text-white bg-cover bg-center bg-no-repeat animate-bg-slide"
        >
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40 rounded-xl"></div>

          <div className="relative z-10 flex flex-col gap-3 justify-center items-center">
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
              Learn, Explore & Excel
            </h1>
            <p className="mt-4 text-sm md:text-lg font-medium drop-shadow-md max-w-2xl">
              Access comprehensive syllabi, notes, and exam-oriented questions
              for BIT, BCA, BE Civil, BBA, and more. Empower your academic
              journey with curated study resources.
            </p>
            <div className="flex gap-5">
              <a
                href="#about"
                className="mt-6 bg-transparent border-2 border-white text-white dark:border-gray-200 dark:text-gray-200 px-4 py-2 rounded-full font-semibold hover:bg-light hover:text-[#2b352b] dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-all duration-300 shadow-lg"
              >
                Explore
              </a>
              <Link
                to="/study/contact-us"
                className="mt-6 bg-transparent border-2 border-white text-white dark:border-gray-200 dark:text-gray-200 px-4 py-2 rounded-full font-semibold hover:bg-light hover:text-[#2b352b] dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-all duration-300 shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <hr className="w-full border-gray-300 dark:border-gray-600 border-[1px]" />

        {/* About Us Section */}
        <section
          id="about"
          className="py-10 text-gray-800 dark:text-gray-200 relative z-10 scroll-m-10"
        >
          <AboutUs />
        </section>

        <hr className="w-full border-gray-300 dark:border-gray-600 border-[1px]" />

        {/* Review Section */}
        <section
          id="review"
          className="py-10 text-gray-800 dark:text-gray-200 relative z-10"
        >
          <Review existingReview={existingReview} />
        </section>
      </div>
    </div>
  );
};

export default Homepage;
