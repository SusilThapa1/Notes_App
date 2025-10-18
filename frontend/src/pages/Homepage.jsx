// Homepage.js
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AboutUs from "../components/AboutUs";
import Review from "../components/Review/Review";

const Homepage = () => {
  const location = useLocation();
  const existingReview = location.state?.review || null;

  const bgImages = [
    "https://plus.unsplash.com/premium_photo-1713296254777-0a89f05dcb60?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1930/background.webp",
    "https://plus.unsplash.com/premium_photo-1683749808307-e5597ac69f1e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070/images/desktop.png",
    "https://png.pngtree.com/thumb_back/fw800/background/20250728/pngtree-cozy-study-room-with-an-open-book-green-plants-and-a-image_17654821.webp",
     
  ];

  const [bgIndex, setBgIndex] = useState(0);

  // Cycle through background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      {/* Overlay for readability */}
      <div className="relative z-10 mt-20 px-5 md:px-10 lg:px-20 w-full">
        <div className="animate-marqueeLong whitespace-nowrap text-sm md:text-base font-medium text-center text-gray-600 py-2 w-full">
          You can send feedback or any suggestions directly to :{" "}
          <span className="text-blue-400">eyeh193@gmail.com</span>
        </div>

        {/* Hero / Welcome Section */}
        <section
          id="home"
          className="parent relative flex flex-col gap-3 justify-center items-center h-[400px] mb-10 md:h-[600px] rounded-xl shadow-lg border border-lightGreen text-center text-white bg-cover bg-no-repeat bg-center transition-all duration-1000"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.1)), url(${bgImages[bgIndex]})`,
          }}
        >
          {/* Content */}
          <div className="relative z-10 flex flex-col gap-3 justify-center items-center">
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
              Learn, Explore & Excel
            </h1>
            <p className="mt-4 text-sm md:text-lg font-medium drop-shadow-md max-w-2xl">
              Access comprehensive syllabi, notes, and exam-oriented questions
              for BIT, BCA, BE Civil, BBA, and more. Empower your academic
              journey with curated study resources.
            </p>
            <Link
              to="/study/contact-us"
              className="mt-6 bg-transparent border-2 border-white text-white px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-[#2b352b] transition-all duration-300 shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </section>

        <hr className="w-full border-gray-300 border-[1px]" />

        {/* About Us Section */}
        <section id="about" className="py-10 text-white relative z-10">
          <AboutUs />
        </section>

        <hr className="w-full border-gray-300 border-[1px]" />

        {/* Review Section */}
        <section id="review" className="py-10 text-white relative z-10">
          <Review existingReview={existingReview} />
        </section>
      </div>
    </div>
  );
};

export default Homepage;
